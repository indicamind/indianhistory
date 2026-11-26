import { AfterRenderRef, Component, DestroyRef, ElementRef, HostListener, Injector, afterNextRender, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocaleService } from '../../i18n/locale.service';
import { ScriptureBook, ScriptureChapter } from '../../services/scriptures.service';

@Component({selector:'app-scripture-controls',imports:[FormsModule],templateUrl:'./scripture-controls.component.html',styleUrl:'./scripture-controls.component.css'})
export class ScriptureControlsComponent {
  readonly locale=inject(LocaleService);
  private readonly host=inject(ElementRef<HTMLElement>);
  private readonly injector=inject(Injector);
  readonly book=input.required<ScriptureBook>();
  readonly chapter=input.required<ScriptureChapter>();
  readonly activeVerse=input.required<number>();
  readonly chapterChange=output<string>();
  readonly verseChange=output<number>();
  readonly expanded=signal(false);
  readonly trigger=viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly grid=viewChild<ElementRef<HTMLElement>>('grid');
  private pendingFocus: AfterRenderRef|undefined;
  constructor(){inject(DestroyRef).onDestroy(()=>this.pendingFocus?.destroy());}
  toggle(): void {if(this.expanded())this.close();else this.open();}
  open(): void {
    this.expanded.set(true);this.pendingFocus?.destroy();
    this.pendingFocus=afterNextRender(()=>{
      const grid=this.grid()?.nativeElement,button=grid?.querySelector<HTMLButtonElement>(`[data-verse="${this.activeVerse()}"]`);
      if(!grid || !button)return;
      button.focus({preventScroll:true});grid.scrollTop=button.offsetTop-grid.clientHeight/2;
    },{injector:this.injector});
  }
  close(focus=false): void {this.expanded.set(false);this.pendingFocus?.destroy();if(focus)this.trigger()?.nativeElement.focus({preventScroll:true});}
  choose(number: number): void {this.close();this.verseChange.emit(number);}
  move(event: KeyboardEvent,index: number): void {
    const count=this.chapter().verses.length;
    const step:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-5,ArrowDown:5,Home:-index,End:count-1-index};
    if(!(event.key in step))return;
    event.preventDefault();event.stopPropagation();
    this.grid()?.nativeElement.querySelector<HTMLButtonElement>(`[data-verse="${Math.max(0,Math.min(count-1,index+step[event.key]))+1}"]`)?.focus();
  }
  @HostListener('document:click',['$event'])
  outside(event: MouseEvent): void {if(this.expanded()&&!this.host.nativeElement.contains(event.target as Node))this.close();}
  @HostListener('document:focusin',['$event'])
  outsideFocus(event: FocusEvent): void {if(this.expanded()&&!this.host.nativeElement.contains(event.target as Node))this.close();}
  @HostListener('document:keydown.escape',['$event'])
  escape(event: KeyboardEvent): void {if(this.expanded()){event.preventDefault();event.stopPropagation();this.close(true);}}
}
