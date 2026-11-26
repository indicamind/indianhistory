import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { ScriptureBook, ScriptureChapter, ScripturesService } from '../../services/scriptures.service';
@Component({selector:'app-scriptures',imports:[RouterLink,FormsModule],templateUrl:'./scriptures.component.html',styleUrl:'./scriptures.component.css'})
export class ScripturesComponent {
  readonly locale=inject(LocaleService);
  readonly devMode=inject(DevModeService);
  private readonly service=inject(ScripturesService);
  private readonly route=inject(ActivatedRoute);
  private readonly router=inject(Router);
  private readonly viewport=inject(ViewportScroller);
  private readonly destroy=inject(DestroyRef);
  readonly books=signal<ScriptureBook[]>([]);
  readonly book=signal<ScriptureBook|null>(null);
  readonly chapter=signal<ScriptureChapter|null>(null);
  readonly commentary=computed(()=>{
    const text=this.chapter()?.commentary;
    return text && (text.draft || text.preview) && (!this.devMode.isDevMode() || this.locale.offline || this.locale.language!=='en') ? undefined : text;
  });
  readonly loading=signal(true);
  readonly failed=signal(false);
  readonly notFound=signal(false);
  private generation=0;
  private fragment: string|null=null;
  verseNumber=1;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(params=>void this.load(params.get('slug'),params.get('chapter')));
    this.route.fragment.pipe(takeUntilDestroyed(this.destroy)).subscribe(fragment=>{this.fragment=fragment;this.scrollToFragment();});
    this.destroy.onDestroy(()=>this.generation++);
  }
  private async load(slug: string|null, chapterValue: string|null): Promise<void> {
    const version=++this.generation;
    this.loading.set(true);this.failed.set(false);this.notFound.set(false);this.chapter.set(null);this.book.set(null);this.verseNumber=1;
    try {
      const books=await this.service.getBooks();if(version!==this.generation)return;this.books.set(books);
      if(slug){const book=books.find(b=>b.slug===slug);if(!book){this.notFound.set(true);return;}this.book.set(book);
        if(chapterValue){const number=/^[1-9]\d*$/.test(chapterValue)?Number(chapterValue):0;const chapter=await this.service.getChapter(book,number);if(version!==this.generation)return;if(!chapter)this.notFound.set(true);else this.chapter.set(chapter);}
      }
    } catch {if(version===this.generation)this.failed.set(true);}
    finally {if(version===this.generation){this.loading.set(false);this.scrollToFragment();}}
  }
  selectChapter(value: string): void { if(this.book())void this.router.navigate(['/scriptures',this.book()!.slug,value],{queryParams:{lang:this.locale.language},queryParamsHandling:'merge'}); }
  goToVerse(): void {
    if(!this.chapter()?.verses.some(v=>v.number===Number(this.verseNumber)))return;
    const anchor=this.anchor(`${this.chapter()!.number}.${Number(this.verseNumber)}`);
    void this.router.navigate([],{relativeTo:this.route,fragment:anchor,queryParamsHandling:'preserve'});
    this.viewport.scrollToAnchor(anchor);
  }
  anchor(id: string): string { return 'verse-'+id.replace('.','-'); }
  explanation(id: string) { return this.commentary()?.verses.find(v=>v.id===id); }
  private scrollToFragment(): void {
    if(this.loading()||!this.fragment||!/^verse-\d+-\d+$/.test(this.fragment))return;
    const fragment=this.fragment,version=this.generation;
    setTimeout(()=>{if(version===this.generation)this.viewport.scrollToAnchor(fragment);},0);
  }
}
