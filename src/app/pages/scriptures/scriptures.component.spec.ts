import {DestroyRef,Injector,runInInjectionContext,signal} from '@angular/core';
import {DOCUMENT,ViewportScroller} from '@angular/common';
import {ActivatedRoute,NavigationStart,Router,convertToParamMap} from '@angular/router';
import {Subject} from 'rxjs';
import {ScripturesComponent} from './scriptures.component';
import {ScripturesService} from '../../services/scriptures.service';
import {ScriptureProgressService} from '../../services/scripture-progress.service';
import {LocaleService} from '../../i18n/locale.service';
import {DevModeService} from '../../services/dev-mode.service';
import {gitaAffiliateUrls} from '../../data/scripture-books';

describe('Scripture verse navigation',()=>{
  function setup(reducedMotion=false){
    const fragment=new Subject<string|null>(),navigations:any[]=[],destinations:any[]=[],scrolls:any[]=[],focus:any[]=[],frames:(()=>void)[]=[];
    const params=new Subject<any>(),events=new Subject<any>(),anchors:string[]=[],dataService:any={};
    const saved=new Map<string,string>();
    const positions:Record<string,number>={'verse-1-1':-400,'verse-1-2':200,'verse-1-3':800};
    const doc={documentElement:{dir:'ltr'},getSelection:()=>null,
      querySelector:(selector:string)=>selector==='.reader-controls'?{getBoundingClientRect:()=>({bottom:160})}:null,
      getElementById:(id:string)=>id in positions?{focus:(options:any)=>focus.push([id,options]),scrollIntoView:(options:any)=>scrolls.push([id,options]),getBoundingClientRect:()=>({top:positions[id]})}:null,
      defaultView:{localStorage:{getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>saved.set(key,value)},matchMedia:()=>({matches:reducedMotion}),requestAnimationFrame:(fn:()=>void)=>{frames.push(fn);return frames.length;},cancelAnimationFrame:()=>{}}
    };
    const injector=Injector.create({providers:[
      {provide:DOCUMENT,useValue:doc},{provide:DestroyRef,useValue:{onDestroy:()=>()=>{}}},
      {provide:ViewportScroller,useValue:{scrollToAnchor:(id:string)=>anchors.push(id)}},
      {provide:LocaleService,useValue:{language:'en',offline:false}},
      {provide:DevModeService,useValue:{isDevMode:signal(false)}},
      {provide:ScripturesService,useValue:dataService},
      ScriptureProgressService,
      {provide:ActivatedRoute,useValue:{paramMap:params,fragment}},
      {provide:Router,useValue:{events,navigate:(commands:any,options:any)=>{destinations.push(commands);navigations.push(options);fragment.next(options.fragment);return Promise.resolve(true);}}}
    ]});
    const component=runInInjectionContext(injector,()=>new ScripturesComponent());
    component.loading.set(false);
    component.chapter.set({book:'bhagavad-gita',number:1,title:'अध्याय',transliteration:'adhyāya',verses:[1,2,3].map(number=>({id:`1.${number}`,number,sanskrit:'धर्म',transliteration:'dharma'}))});
    const pointer=(x:number,y:number,timeStamp:number,extra:any={})=>({isPrimary:true,pointerType:'touch',pointerId:1,clientX:x,clientY:y,timeStamp,target:{closest:()=>null},...extra} as unknown as PointerEvent);
    return{component,navigations,destinations,scrolls,focus,frames,positions,pointer,doc,saved,params,events,fragment,anchors,dataService};
  }
  it('opens chapter 1 from the top and remaining chapters at the controls while preserving language and query parameters',()=>{
    const{component,navigations,destinations}=setup();
    component.book.set({slug:'bhagavad-gita'} as any);
    component.selectChapter('1');
    expect(destinations[0]).toEqual(['/scriptures','bhagavad-gita','1']);
    expect(navigations[0].fragment).toBeUndefined();
    component.selectChapter('5');
    expect(destinations[1]).toEqual(['/scriptures','bhagavad-gita','5']);
    expect(navigations[1].fragment).toBe('reading-controls');
    expect(navigations[1].queryParams).toEqual({lang:'en'});
    expect(navigations[1].queryParamsHandling).toBe('merge');
  });
  it('waits for the selected chapter to load before scrolling to its controls',async()=>{
    const{component,params,fragment,anchors,dataService}=setup();
    const chapter={...component.chapter()!,number:2,verses:component.chapter()!.verses.map(verse=>({...verse,id:`2.${verse.number}`}))};
    const book={slug:'bhagavad-gita',chapters:[{number:1,verseCount:3},{number:2,verseCount:3}]} as any;
    let finish!:(chapter:any)=>void;
    dataService.getBooks=async()=>[book];
    dataService.getChapter=()=>new Promise(resolve=>{finish=resolve;});
    params.next(convertToParamMap({slug:'bhagavad-gita',chapter:'2'}));
    fragment.next('reading-controls');
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(component.loading()).toBeTruthy();expect(anchors).toEqual([]);
    finish(chapter);
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(component.chapter()?.number).toBe(2);
    expect(component.loading()).toBeFalsy();
    expect(anchors).toEqual(['reading-controls']);
  });
  it('leaves browser history scroll restoration in charge when returning to a controls link',async()=>{
    const{events,fragment,anchors}=setup();
    events.next(new NavigationStart(1,'/scriptures/bhagavad-gita/1#reading-controls','popstate'));
    fragment.next('reading-controls');
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(anchors).toEqual([]);
    events.next(new NavigationStart(2,'/scriptures/bhagavad-gita/2#reading-controls'));
    fragment.next('reading-controls');
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(anchors).toEqual(['reading-controls']);
  });
  it('moves within the chapter, preserves URL parameters, and never navigates past either boundary',async()=>{
    const{component,navigations,scrolls,focus,saved}=setup();
    component.navigateVerse(0);component.navigateVerse(4);component.navigateVerse(NaN);
    expect(navigations.length).toBe(0);
    component.navigateVerse(2);
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(navigations[0].fragment).toBe('verse-1-2');
    expect(navigations[0].queryParamsHandling).toBe('preserve');
    expect(navigations[0].replaceUrl).toBeTruthy();
    expect(scrolls[0]).toEqual(['verse-1-2',{behavior:'instant',block:'start'}]);
    expect(focus[0]).toEqual(['verse-1-2',{preventScroll:true}]);
    expect(component.activeVerse()).toBe(2);
    expect(JSON.parse(saved.get('ih_scripture_progress:bhagavad-gita')!)).toEqual({chapter:1,verse:2});
  });
  it('respects reduced motion when jumping to a verse',async()=>{
    const{component,scrolls}=setup(true);component.navigateVerse(3);
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(scrolls[0][1].behavior).toBe('instant');
  });
  it('supports left/right touch swipes while rejecting vertical scrolling, mouse dragging, controls and cancelled gestures',()=>{
    const{component,navigations,pointer}=setup();
    component.startSwipe(pointer(250,200,0),1);component.endSwipe(pointer(120,210,200));
    expect(navigations.length).toBe(1);expect(navigations[0].fragment).toBe('verse-1-2');
    component.startSwipe(pointer(100,200,0),2);component.endSwipe(pointer(220,215,200));
    expect(navigations[1].fragment).toBe('verse-1-1');
    const invalid=[
      [pointer(250,200,0),pointer(120,450,200)],
      [pointer(250,200,0,{pointerType:'mouse'}),pointer(120,200,200)],
      [pointer(250,200,0,{target:{closest:()=>({})}}),pointer(120,200,200)],
      [pointer(250,200,0),pointer(120,200,1000)],
      [pointer(250,200,0),pointer(120,200,200,{pointerId:2})]
    ];
    for(const[start,end]of invalid){component.startSwipe(start,1);component.endSwipe(end);}
    component.startSwipe(pointer(250,200,0),1);component.cancelSwipe();component.endSwipe(pointer(120,200,200));
    expect(navigations.length).toBe(2);
  });
  it('tracks manual reading without changing the URL and coalesces scroll work into one frame',()=>{
    const{component,navigations,frames,saved}=setup();component.trackReading();component.trackReading();
    expect(frames.length).toBe(1);frames[0]();
    expect(component.activeVerse()).toBe(2);expect(navigations.length).toBe(0);
    expect(JSON.parse(saved.get('ih_scripture_progress:bhagavad-gita')!)).toEqual({chapter:1,verse:2});
  });
  it('uses left and right keys to move from the current reading position and save progress',()=>{
    const{component,navigations,saved}=setup();let prevented=0;
    const key=(key:string)=>({key,target:{closest:()=>null},preventDefault:()=>prevented++} as unknown as KeyboardEvent);
    component.navigateByKeyboard(key('ArrowLeft'));
    expect(navigations.length).toBe(0);
    component.navigateByKeyboard(key('ArrowRight'));
    expect(navigations[0].fragment).toBe('verse-1-2');
    component.navigateByKeyboard(key('ArrowLeft'));
    expect(navigations[1].fragment).toBe('verse-1-1');
    expect(JSON.parse(saved.get('ih_scripture_progress:bhagavad-gita')!)).toEqual({chapter:1,verse:1});
    component.activeVerse.set(3);component.navigateByKeyboard(key('ArrowRight'));
    expect(navigations.length).toBe(2);expect(prevented).toBe(2);
  });
  it('leaves editing controls, shortcuts, key repeats and unrelated keys alone',()=>{
    const{component,navigations,doc}=setup();
    const key=(extra:any={})=>({key:'ArrowRight',target:{closest:()=>null},preventDefault:()=>{throw new Error('Must preserve native keyboard behavior');},...extra} as unknown as KeyboardEvent);
    for(const modifier of ['altKey','ctrlKey','metaKey','shiftKey','isComposing','repeat','defaultPrevented'])component.navigateByKeyboard(key({[modifier]:true}));
    component.navigateByKeyboard(key({key:'ArrowDown'}));
    component.navigateByKeyboard(key({target:{closest:()=>({})}}));
    component.navigateByKeyboard(key({target:{closest:(selector:string)=>selector.startsWith('a,button')?{}:null}}));
    doc.querySelector=()=>({getBoundingClientRect:()=>({bottom:160})});
    component.navigateByKeyboard(key());
    component.loading.set(true);component.navigateByKeyboard(key());
    expect(navigations.length).toBe(0);
  });
  it('steps through filtered verse matches and restores the whole chapter when a verse is selected',()=>{
    const{component,navigations}=setup();
    component.setMatches({query:'arjuna',hits:[{chapter:1,id:'1.1'},{chapter:1,id:'1.3'},{chapter:2,id:'2.47'}] as any});
    expect(component.visibleVerses().map(verse=>verse.number)).toEqual([1,3]);
    component.navigateAdjacent(1,1);expect(navigations[0].fragment).toBe('verse-1-3');
    component.selectVerse(2);expect(navigations[1].fragment).toBe('verse-1-2');
    expect(component.visibleVerses().length).toBe(3);
  });
  it('keeps a short final verse selected when the document cannot scroll it to the top',()=>{
    const{component,doc,positions,frames}=setup();
    Object.assign(doc.defaultView,{scrollY:1000,innerHeight:800});Object.assign(doc.documentElement,{scrollHeight:1800});
    positions['verse-1-3']=500;component.trackReading();frames[0]();
    expect(component.activeVerse()).toBe(3);
  });
  it('continues through chapter boundaries and wraps the book in both directions',()=>{
    const{component,navigations,destinations}=setup();
    component.book.set({slug:'bhagavad-gita',chapters:[{number:1,verseCount:3},{number:2,verseCount:5},{number:3,verseCount:2}]} as any);
    component.navigateAdjacent(3,1);
    expect(destinations[0]).toEqual(['/scriptures','bhagavad-gita',2]);expect(navigations[0].fragment).toBe('verse-2-1');
    component.navigateAdjacent(1,-1);
    expect(destinations[1]).toEqual(['/scriptures','bhagavad-gita',3]);expect(navigations[1].fragment).toBe('verse-3-2');
    component.chapter.set({...component.chapter()!,number:3,verses:component.chapter()!.verses.slice(0,2).map(verse=>({...verse,id:`3.${verse.number}`}))});
    component.navigateAdjacent(2,1);
    expect(destinations[2]).toEqual(['/scriptures','bhagavad-gita',1]);expect(navigations[2].fragment).toBe('verse-1-1');
    expect(component.adjacentChapter(1)).toBe(1);expect(component.adjacentChapter(-1)).toBe(2);
    expect(navigations.every(options=>options.queryParamsHandling==='preserve')).toBeTruthy();
  });
  it('loops filtered matches within their chapter without discarding the search',()=>{
    const{component,navigations}=setup();
    component.book.set({slug:'bhagavad-gita',chapters:[{number:1,verseCount:3},{number:2,verseCount:5}]} as any);
    component.setMatches({query:'arjuna',hits:[{chapter:1,id:'1.1'},{chapter:1,id:'1.3'}] as any});
    component.navigateAdjacent(3,1);expect(navigations[0].fragment).toBe('verse-1-1');
    component.navigateAdjacent(1,-1);expect(navigations[1].fragment).toBe('verse-1-3');
    expect(component.searchQuery()).toBe('arjuna');
  });
  it('rotates Gita affiliate links across chapters and every 30 verses while reading',()=>{
    const{component}=setup();
    component.book.set({slug:'bhagavad-gita',chapters:[{number:1,verseCount:47},{number:2,verseCount:72}]} as any);
    expect(component.chapterBooks()[0].affiliateUrl).toBe(gitaAffiliateUrls[0]);
    expect(component.showBookAfterVerse(29)).toBeFalsy();
    expect(component.showBookAfterVerse(30)).toBeTruthy();
    expect(component.booksAfterVerse(30)[0].affiliateUrl).toBe(gitaAffiliateUrls[1]);
    expect(component.booksAfterVerse(60)[0].affiliateUrl).toBe(gitaAffiliateUrls[2]);
    component.chapter.set({...component.chapter()!,number:6});
    expect(component.chapterBooks()[0].affiliateUrl).toBe(gitaAffiliateUrls[0]);
    component.chapter.set({...component.chapter()!,number:2});
    expect(component.chapterBooks()[0].affiliateUrl).toBe(gitaAffiliateUrls[1]);
    expect(component.booksAfterVerse(30)[0].affiliateUrl).toBe(gitaAffiliateUrls[2]);
    component.setMatches({query:'arjuna',hits:[{chapter:2,id:'2.30'}] as any});
    expect(component.showBookAfterVerse(30)).toBeFalsy();
  });
});
