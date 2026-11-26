import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { scriptureBooks } from '../data/scriptures';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';

export interface ScriptureVerse { id: string; number: number; sanskrit: string; transliteration: string; }
export interface ScriptureChapterSummary { book: string; number: number; title: string; transliteration: string; verseCount: number; }
export interface ScriptureBook {
  slug: string; name: string; shortDescription: string; originalTitle: string;
  editionNote: string; verseCount: number; chapters: ScriptureChapterSummary[]; commentaryChapters: number[]; englishCommentaryChapters?: number[];
  sources: {label: string; author: string; url: string; license: string; licenseUrl: string}[];
}
export interface ScriptureCommentary {
  title: string; excerpt: string; introHtml: string; sourcesHtml: string;
  draft?: boolean; preview?: boolean;
  verses: {id: string; meaningHtml: string; explanationHtml: string}[];
}
export interface ScriptureChapter extends Omit<ScriptureChapterSummary,'verseCount'> {
  verses: ScriptureVerse[];
  commentary?: ScriptureCommentary;
}
@Injectable({providedIn:'root'})
export class ScripturesService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly devMode = inject(DevModeService);
  private index?: Promise<ScriptureBook[]>;
  private drafts?: Promise<Record<string, number[]>>;
  private chapters = new Map<string, Promise<ScriptureChapter>>();
  async getBooks(): Promise<ScriptureBook[]> {
    this.index ??= firstValueFrom(this.http.get<ScriptureBook[]>(this.locale.generatedAssetsBase+'scriptures.json'))
      .then(books => books.flatMap(book => {
        const metadata = scriptureBooks.find(item => item.slug===book.slug);
        return metadata ? [{...book,name:this.locale.translate(metadata.name),shortDescription:this.locale.translate(metadata.shortDescription),editionNote:this.locale.translate(book.editionNote)}] : [];
      })).catch(error => {this.index=undefined;throw error;});
    return this.index;
  }
  async getChapter(book: ScriptureBook, number: number): Promise<ScriptureChapter | undefined> {
    if (!book.chapters.some(c=>c.number===number)) return undefined;
    const key=book.slug+'/'+number;
    let request=this.chapters.get(key);
    if (!request) {
      request=firstValueFrom(this.http.get<ScriptureChapter>(this.locale.generatedAssetsBase+'scriptures/'+key+'.json'))
        .catch(error => {this.chapters.delete(key);throw error;});
      this.chapters.set(key,request);
    }
    const chapter=await request;
    let commentary: ScriptureCommentary | undefined;
    const available=this.locale.language==='en'?(book.englishCommentaryChapters??book.commentaryChapters):book.commentaryChapters;
    if (available.includes(number)) {
      const prefix=this.locale.language==='en'?'':this.locale.language+'/';
      commentary=await firstValueFrom(this.http.get<ScriptureCommentary>(this.locale.generatedAssetsBase+prefix+'scripture-commentary/'+key+'.json'));
    }
    if (this.locale.language==='en' && this.devMode.isDevMode() && !this.locale.offline) {
      this.drafts ??= firstValueFrom(this.http.get<Record<string,number[]>>(this.locale.generatedAssetsBase+'scripture-drafts.json')).catch(error=>{this.drafts=undefined;throw error;});
      if ((await this.drafts)[book.slug]?.includes(number)) commentary=await firstValueFrom(this.http.get<ScriptureCommentary>(this.locale.generatedAssetsBase+'scripture-drafts/'+key+'.json'));
    }
    return {...chapter,commentary};
  }
}
