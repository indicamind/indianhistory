import { Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, Scroll } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { ScriptureBook, ScriptureChapter, ScripturesService } from '../../services/scriptures.service';
import { ScriptureProgressService } from '../../services/scripture-progress.service';
@Component({selector:'app-scriptures',imports:[RouterLink,FormsModule],templateUrl:'./scriptures.component.html',styleUrl:'./scriptures.component.css'})
export class ScripturesComponent {
  readonly locale=inject(LocaleService);
  readonly devMode=inject(DevModeService);
  private readonly service=inject(ScripturesService);
  private readonly progress=inject(ScriptureProgressService);
  private readonly route=inject(ActivatedRoute);
  private readonly router=inject(Router);
  private readonly viewport=inject(ViewportScroller);
  private readonly document=inject(DOCUMENT);
  private readonly destroy=inject(DestroyRef);
  readonly textDirection=this.document.documentElement.dir || 'ltr';
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
  readonly activeVerse=signal(1);
  private generation=0;
  private fragment: string|null=null;
  private scrollFrame: number|null=null;
  private swipe: {id:number;x:number;y:number;time:number;verse:number}|null=null;
  private smoothAnchor: string|null=null;
  private initialLoad=true;
  private restoring=false;
  verseNumber=1;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(params=>void this.load(params.get('slug'),params.get('chapter')));
    this.route.fragment.pipe(takeUntilDestroyed(this.destroy)).subscribe(fragment=>{this.fragment=fragment;this.scrollToFragment();});
    this.router.events.pipe(takeUntilDestroyed(this.destroy)).subscribe(event=>{if(event instanceof Scroll && event.anchor===this.fragment)this.scrollToFragment();});
    this.destroy.onDestroy(()=>{
      this.generation++;
      if(this.scrollFrame!==null)this.document.defaultView?.cancelAnimationFrame(this.scrollFrame);
    });
  }
  private async load(slug: string|null, chapterValue: string|null): Promise<void> {
    const version=++this.generation;
    const firstLoad=this.initialLoad;
    this.initialLoad=false;
    const navigation=this.document.defaultView?.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
    const reloading=firstLoad && !this.router.navigated && navigation?.type==='reload';
    this.restoring=false;
    this.loading.set(true);this.failed.set(false);this.notFound.set(false);this.chapter.set(null);this.book.set(null);this.verseNumber=1;this.activeVerse.set(1);this.swipe=null;this.smoothAnchor=null;
    try {
      const books=await this.service.getBooks();if(version!==this.generation)return;this.books.set(books);
      if(slug){const book=books.find(b=>b.slug===slug);if(!book){this.notFound.set(true);return;}this.book.set(book);
        const saved=this.progress.read(book);
        if(!chapterValue && saved){
          await this.router.navigate(['/scriptures',book.slug,saved.chapter],{fragment:this.anchor(`${saved.chapter}.${saved.verse}`),queryParamsHandling:'merge',replaceUrl:true});
          return;
        }
        if(chapterValue){const number=/^[1-9]\d*$/.test(chapterValue)?Number(chapterValue):0;const chapter=await this.service.getChapter(book,number);if(version!==this.generation)return;if(!chapter)this.notFound.set(true);else {
          this.chapter.set(chapter);
          if(saved?.chapter===number && firstLoad && (reloading || !this.fragment)){
            this.restoring=true;
            this.fragment=this.anchor(`${number}.${saved.verse}`);
            await this.router.navigate([],{relativeTo:this.route,fragment:this.fragment,queryParamsHandling:'preserve',replaceUrl:true});
          }
        }}
      }
    } catch {if(version===this.generation)this.failed.set(true);}
    finally {if(version===this.generation){this.loading.set(false);this.scrollToFragment();}}
  }
  selectChapter(value: string): void { if(this.book())void this.router.navigate(['/scriptures',this.book()!.slug,value],{queryParams:{lang:this.locale.language},queryParamsHandling:'merge'}); }
  goToVerse(): void {
    this.navigateVerse(Number(this.verseNumber));
  }
  navigateVerse(number: number): void {
    const verse=this.chapter()?.verses.find(v=>v.number===number);
    if(!verse)return;
    const anchor=this.anchor(verse.id);
    this.activeVerse.set(number);this.verseNumber=number;
    this.rememberVerse(number);
    this.smoothAnchor=anchor;
    if(this.fragment===anchor)this.scrollToFragment();
    else void this.router.navigate([],{relativeTo:this.route,fragment:anchor,queryParamsHandling:'preserve',replaceUrl:true});
  }
  startSwipe(event: PointerEvent,verse: number): void {
    this.swipe=null;
    if(!event.isPrimary || !['touch','pen'].includes(event.pointerType))return;
    const target=event.target as Element|null;
    if(target?.closest('a,button,input,select,summary'))return;
    this.swipe={id:event.pointerId,x:event.clientX,y:event.clientY,time:event.timeStamp,verse};
  }
  endSwipe(event: PointerEvent): void {
    const swipe=this.swipe;this.swipe=null;
    if(!swipe || swipe.id!==event.pointerId)return;
    const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y;
    if(Math.abs(dx)<70 || Math.abs(dy)>Math.abs(dx)*.55 || event.timeStamp-swipe.time>800 || this.document.getSelection()?.toString())return;
    this.navigateVerse(swipe.verse+(dx<0?1:-1));
  }
  cancelSwipe(): void {this.swipe=null;}
  @HostListener('window:scroll')
  trackReading(): void {
    const win=this.document.defaultView;
    if(!win || !this.chapter() || this.scrollFrame!==null)return;
    this.scrollFrame=win.requestAnimationFrame(()=>{
      this.scrollFrame=null;
      const boundary=(this.document.querySelector('.reader-controls')?.getBoundingClientRect().bottom??100)+48;
      let number: number|undefined;
      for(const verse of this.chapter()?.verses??[]){
        const card=this.document.getElementById(this.anchor(verse.id));
        if(!card || card.getBoundingClientRect().top>boundary)break;
        number=verse.number;
      }
      if(number!==undefined){
        this.activeVerse.set(number);
        this.rememberVerse(number);
      }
    });
  }
  anchor(id: string): string { return 'verse-'+id.replace('.','-'); }
  explanation(id: string) { return this.commentary()?.verses.find(v=>v.id===id); }
  private lastSaved: string|null=null;
  private rememberVerse(number: number): void {
    const chapter=this.chapter();
    if(!chapter || this.restoring)return;
    const key=`${chapter.book}/${chapter.number}/${number}`;
    if(this.lastSaved===key)return;
    this.progress.save(chapter.book,chapter.number,number);
    this.lastSaved=key;
  }
  private scrollToFragment(): void {
    if(this.loading()||!this.fragment||!/^verse-\d+-\d+$/.test(this.fragment))return;
    const fragment=this.fragment,version=this.generation;
    setTimeout(()=>{
      if(version!==this.generation)return;
      const verse=this.chapter()?.verses.find(v=>this.anchor(v.id)===fragment);
      if(!verse)return;
      const restoring=this.restoring;
      this.restoring=false;
      this.activeVerse.set(verse.number);this.verseNumber=verse.number;
      this.rememberVerse(verse.number);
      const card=this.document.getElementById(fragment);
      if(card && restoring)card.scrollIntoView({behavior:'instant',block:'start'});
      else if(card && this.smoothAnchor===fragment){
        this.smoothAnchor=null;
        card.focus({preventScroll:true});
        card.scrollIntoView({behavior:this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      }else if(card)card.scrollIntoView({block:'start'});
      else this.viewport.scrollToAnchor(fragment);
    },0);
  }
}
