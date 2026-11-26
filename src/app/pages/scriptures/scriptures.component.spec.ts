import {DestroyRef,Injector,runInInjectionContext,signal} from '@angular/core';
import {DOCUMENT,ViewportScroller} from '@angular/common';
import {ActivatedRoute,Router} from '@angular/router';
import {EMPTY,Subject} from 'rxjs';
import {ScripturesComponent} from './scriptures.component';
import {ScripturesService} from '../../services/scriptures.service';
import {ScriptureProgressService} from '../../services/scripture-progress.service';
import {LocaleService} from '../../i18n/locale.service';
import {DevModeService} from '../../services/dev-mode.service';

describe('Scripture verse navigation',()=>{
  function setup(reducedMotion=false){
    const fragment=new Subject<string|null>(),navigations:any[]=[],scrolls:any[]=[],focus:any[]=[],frames:(()=>void)[]=[];
    const saved=new Map<string,string>();
    const positions:Record<string,number>={'verse-1-1':-400,'verse-1-2':200,'verse-1-3':800};
    const doc={documentElement:{dir:'ltr'},getSelection:()=>null,
      querySelector:(selector:string)=>selector==='.reader-controls'?{getBoundingClientRect:()=>({bottom:160})}:null,
      getElementById:(id:string)=>id in positions?{focus:(options:any)=>focus.push([id,options]),scrollIntoView:(options:any)=>scrolls.push([id,options]),getBoundingClientRect:()=>({top:positions[id]})}:null,
      defaultView:{localStorage:{getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>saved.set(key,value)},matchMedia:()=>({matches:reducedMotion}),requestAnimationFrame:(fn:()=>void)=>{frames.push(fn);return frames.length;},cancelAnimationFrame:()=>{}}
    };
    const injector=Injector.create({providers:[
      {provide:DOCUMENT,useValue:doc},{provide:DestroyRef,useValue:{onDestroy:()=>()=>{}}},
      {provide:ViewportScroller,useValue:{scrollToAnchor:()=>{}}},
      {provide:LocaleService,useValue:{language:'en',offline:false}},
      {provide:DevModeService,useValue:{isDevMode:signal(false)}},
      {provide:ScripturesService,useValue:{}},
      ScriptureProgressService,
      {provide:ActivatedRoute,useValue:{paramMap:EMPTY,fragment}},
      {provide:Router,useValue:{events:EMPTY,navigate:(commands:any,options:any)=>{navigations.push(options);fragment.next(options.fragment);return Promise.resolve(true);}}}
    ]});
    const component=runInInjectionContext(injector,()=>new ScripturesComponent());
    component.loading.set(false);
    component.chapter.set({book:'bhagavad-gita',number:1,title:'अध्याय',transliteration:'adhyāya',verses:[1,2,3].map(number=>({id:`1.${number}`,number,sanskrit:'धर्म',transliteration:'dharma'}))});
    const pointer=(x:number,y:number,timeStamp:number,extra:any={})=>({isPrimary:true,pointerType:'touch',pointerId:1,clientX:x,clientY:y,timeStamp,target:{closest:()=>null},...extra} as unknown as PointerEvent);
    return{component,navigations,scrolls,focus,frames,positions,pointer,doc,saved};
  }
  it('moves within the chapter, preserves URL parameters, and never navigates past either boundary',async()=>{
    const{component,navigations,scrolls,focus,saved}=setup();
    component.navigateVerse(0);component.navigateVerse(4);component.navigateVerse(NaN);
    expect(navigations.length).toBe(0);
    component.navigateVerse(2);
    await new Promise(resolve=>setTimeout(resolve,5));
    expect(navigations[0].fragment).toBe('verse-1-2');
    expect(navigations[0].queryParamsHandling).toBe('preserve');
    expect(navigations[0].replaceUrl).toBeTruthy();
    expect(scrolls[0]).toEqual(['verse-1-2',{behavior:'smooth',block:'start'}]);
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
});
