import { Component, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { ScriptureSearchService, ScriptureVerseHit } from '../../services/scripture-search.service';

@Component({selector:'app-scripture-search',imports:[RouterLink],templateUrl:'./scripture-search.component.html',styleUrl:'./scripture-search.component.css'})
export class ScriptureSearchComponent {
  readonly locale=inject(LocaleService);
  readonly dev=inject(DevModeService);
  private readonly service=inject(ScriptureSearchService);
  readonly book=input.required<string>();
  readonly matches=output<{query:string;hits:ScriptureVerseHit[]}|null>();
  readonly selected=output<ScriptureVerseHit>();
  readonly query=signal('');
  readonly busy=signal(false);
  readonly failed=signal(false);
  private readonly hits=signal<ScriptureVerseHit[]>([]);
  readonly limit=signal(20);
  readonly results=computed(()=>this.hits().filter(hit=>!hit.draft || (this.dev.isDevMode()&&this.locale.language==='en'&&!this.locale.offline)));
  private generation=0;
  constructor(){
    effect(cleanup=>{
      const query=this.query().trim(),book=this.book();this.dev.isDevMode();
      const version=++this.generation;this.failed.set(false);this.limit.set(20);
      if(!query){this.hits.set([]);this.busy.set(false);return;}
      this.busy.set(true);
      const timer=setTimeout(()=>void this.search(query,book,version),250);
      cleanup(()=>clearTimeout(timer));
    });
    inject(DestroyRef).onDestroy(()=>this.generation++);
  }
  updateQuery(query: string): void {this.matches.emit(null);this.query.set(query);}
  private async search(query: string,book: string,version: number): Promise<void> {
    try{
      const hits=await this.service.search(query,book);
      if(version!==this.generation || query!==this.query().trim())return;
      this.hits.set(hits);this.matches.emit({query,hits});
    }catch{if(version===this.generation)this.failed.set(true);}
    finally{if(version===this.generation)this.busy.set(false);}
  }
  clear(): void {this.generation++;this.query.set('');this.hits.set([]);this.busy.set(false);this.matches.emit(null);}
  choose(event: MouseEvent,hit: ScriptureVerseHit): void {
    if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    this.clear();this.selected.emit(hit);
  }
}
