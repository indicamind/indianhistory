import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';
import { ScripturesService } from './scriptures.service';
import { SearchResult } from '../models/article.model';

export interface ScriptureVerseHit {
  book: string; name: string; chapter: number; verse: number; id: string;
  excerpt: string; language: string; draft: boolean; preview?: boolean;
}
interface IndexedVerse {
  book: string; name: string; chapter: number; verse: number; id: string;
  sanskrit: string; transliteration: string; commentary: string; draft: boolean; preview?: boolean;
}
export function normalizeScriptureQuery(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[०-९٠-٩۰-۹]/g,digit=>String('०१२३४५६७८९٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)%10))
    .replace(/\s+/g,' ').trim();
}
@Injectable({providedIn:'root'})
export class ScriptureSearchService {
  private readonly scriptures=inject(ScripturesService);
  private readonly locale=inject(LocaleService);
  private readonly dev=inject(DevModeService);
  private readonly document=inject(DOCUMENT);
  private readonly indexes=new Map<string,Promise<IndexedVerse[]>>();
  private allowDrafts(): boolean {return this.locale.language==='en' && !this.locale.offline && this.dev.isDevMode();}
  private key(): string {return this.allowDrafts()?'review':'published';}
  private text(html: string): string {
    const element=this.document.createElement('div');element.innerHTML=html;
    return (element.textContent??'').replace(/\s+/g,' ').trim();
  }
  private index(): Promise<IndexedVerse[]> {
    const key=this.key();let index=this.indexes.get(key);
    if(!index){
      index=this.scriptures.getBooks().then(books=>Promise.all(books.flatMap(book=>book.chapters.map(async summary=>{
        const chapter=await this.scriptures.getChapter(book,summary.number);
        if(!chapter)return [];
        return chapter.verses.map(verse=>{
          const commentary=chapter.commentary?.verses.find(item=>item.id===verse.id);
          return {book:book.slug,name:book.name,chapter:chapter.number,verse:verse.number,id:verse.id,
            sanskrit:verse.sanskrit,transliteration:verse.transliteration,
            commentary:commentary?this.text(commentary.meaningHtml+' '+commentary.explanationHtml):'',
            draft:!!(chapter.commentary?.draft || chapter.commentary?.preview),preview:!!chapter.commentary?.preview};
        });
      })))).then(chapters=>chapters.flat()).catch(error=>{this.indexes.delete(key);throw error;});
      this.indexes.set(key,index);
    }
    return index;
  }
  async search(query: string,book?: string): Promise<ScriptureVerseHit[]> {
    const q=normalizeScriptureQuery(query);if(!q)return [];
    const key=this.key(),entries=await this.index();
    if(key!==this.key())return this.search(query,book);
    const reference=/^(\d+)\s*[.:]\s*(\d+)$/.exec(q);
    const terms=q.split(' '),hits:ScriptureVerseHit[]=[];
    for(const entry of entries){
      if(book && entry.book!==book)continue;
      const commentary=entry.draft&&!this.allowDrafts()?'':entry.commentary;
      const sections=[{text:entry.sanskrit,language:'sa',draft:false},{text:entry.transliteration,language:'sa-Latn',draft:false},
        {text:commentary,language:this.locale.language,draft:entry.draft}];
      const full=normalizeScriptureQuery(sections.map(section=>section.text).join(' '));
      if(reference ? entry.id!==`${Number(reference[1])}.${Number(reference[2])}` : !terms.every(term=>full.includes(term)))continue;
      const section=reference?sections[0]:sections.find(section=>terms.every(term=>normalizeScriptureQuery(section.text).includes(term)))
        ??sections.find(section=>terms.some(term=>normalizeScriptureQuery(section.text).includes(term)))!;
      const plain=section.text.replace(/\s+/g,' '),normalized=normalizeScriptureQuery(plain);
      const at=reference?0:Math.max(0,normalized.indexOf(terms[0])-65);
      const source=normalizeScriptureQuery(entry.sanskrit+' '+entry.transliteration);
      const draft=section.draft || (entry.draft && !reference && !terms.every(term=>source.includes(term)));
      hits.push({book:entry.book,name:entry.name,chapter:entry.chapter,verse:entry.verse,id:entry.id,
        excerpt:(at?'…':'')+plain.slice(at,at+240)+(plain.length>at+240?'…':''),language:section.language,draft,preview:draft&&entry.preview});
    }
    return hits;
  }
  result(hit: ScriptureVerseHit): SearchResult {
    return {kind:'scripture',slug:`${hit.book}/${hit.id}`,title:`${hit.name} · ${this.locale.translate('Verse')} ${hit.id}`,
      excerpt:hit.excerpt,routerLink:['/scriptures',hit.book,hit.chapter],fragment:`verse-${hit.chapter}-${hit.verse}`,
      queryParams:{lang:this.locale.language},kindLabel:this.locale.translate('Scripture'),draft:hit.draft,preview:hit.preview,excerptLanguage:hit.language};
  }
}
