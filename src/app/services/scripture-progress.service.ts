import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ScriptureBook } from './scriptures.service';

export interface ScriptureReadingPosition { chapter: number; verse: number; }

@Injectable({providedIn:'root'})
export class ScriptureProgressService {
  private readonly document=inject(DOCUMENT);

  read(book: ScriptureBook): ScriptureReadingPosition | undefined {
    try {
      const raw=this.document.defaultView?.localStorage.getItem(this.key(book.slug));
      if(!raw)return undefined;
      const position: unknown=JSON.parse(raw);
      if(!position || typeof position!=='object')return undefined;
      const {chapter,verse}=position as ScriptureReadingPosition;
      const summary=book.chapters.find(item=>item.number===chapter);
      return summary && Number.isInteger(verse) && verse>=1 && verse<=summary.verseCount
        ? {chapter,verse} : undefined;
    } catch { return undefined; }
  }

  save(book: string,chapter: number,verse: number): void {
    if(!Number.isInteger(chapter) || chapter<1 || !Number.isInteger(verse) || verse<1)return;
    try {
      this.document.defaultView?.localStorage.setItem(this.key(book),JSON.stringify({chapter,verse}));
    } catch { /* Reading remains available when browser storage is blocked or full. */ }
  }

  private key(book: string): string { return 'ih_scripture_progress:'+book; }
}
