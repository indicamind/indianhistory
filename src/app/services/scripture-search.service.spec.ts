import {DOCUMENT} from '@angular/common';
import {Injector,runInInjectionContext,signal} from '@angular/core';
import {ScriptureSearchService,normalizeScriptureQuery} from './scripture-search.service';
import {ScripturesService} from './scriptures.service';
import {LocaleService} from '../i18n/locale.service';
import {DevModeService} from './dev-mode.service';

describe('Search within scriptures',()=>{
  function setup(language='en',offline=false,preview=false){
    const mode=signal(false),requested:number[]=[];
    const book={slug:'bhagavad-gita',name:'Bhagavad Gita',chapters:[{number:1},{number:2}]};
    const service={getBooks:async()=>[book],getChapter:async(_:unknown,number:number)=>{
      requested.push(number);
      return {number,verses:number===1?[{id:'1.1',number:1,sanskrit:'अर्जुन उवाच',transliteration:'arjuna uvāca'}]:[{id:'2.47',number:47,sanskrit:'कर्मण्येवाधिकारस्ते',transliteration:'karmaṇyevādhikāraste'}],
        commentary:mode()&&language==='en'&&!offline?{draft:!preview,preview,verses:[{id:number===1?'1.1':'2.47',meaningHtml:'<p>Private review wording.</p>',explanationHtml:'<p>A detailed explanation.</p>'}]}:undefined};
    }};
    const injector=Injector.create({providers:[{provide:DOCUMENT,useValue:{createElement:()=>({innerHTML:'',get textContent(){return this.innerHTML.replace(/<[^>]*>/g,'');}})}},
      {provide:ScripturesService,useValue:service},{provide:LocaleService,useValue:{language,offline,translate:(s:string)=>s}},{provide:DevModeService,useValue:{isDevMode:mode}}]});
    return{search:runInInjectionContext(injector,()=>new ScriptureSearchService()),mode,requested};
  }
  it('loads chapters only on a nonempty search, then reuses the shared verse index',async()=>{
    const{search,requested}=setup();expect(await search.search('  ')).toEqual([]);expect(requested.length).toBe(0);
    const hit=(await search.search('Arjuna'))[0];expect(hit.id).toBe('1.1');expect(hit.language).toBe('sa-Latn');
    expect((await search.search('अर्जुन'))[0].id).toBe('1.1');expect((await search.search('karma'))[0].id).toBe('2.47');
    expect(requested).toEqual([1,2]);
  });
  it('accepts IAST with or without accents and native-digit chapter/verse references',async()=>{
    const{search}=setup();expect((await search.search('uvaca'))[0].id).toBe('1.1');expect((await search.search('uvāca'))[0].id).toBe('1.1');
    expect((await search.search('२:४७'))[0].id).toBe('2.47');expect((await search.search('٢.٤٧'))[0].id).toBe('2.47');
    expect(normalizeScriptureQuery('कर्मण्येवाधिकारस्ते')).toBe('कर्मण्येवाधिकारस्ते');
    expect(await search.search('2.4')).toEqual([]);expect(await search.search('Arjuna karma')).toEqual([]);
  });
  it('keeps English review text out of public, translated and offline search',async()=>{
    const{search,mode}=setup();expect(await search.search('Private')).toEqual([]);mode.set(true);
    expect((await search.search('Private'))[0].draft).toBeTruthy();mode.set(false);expect(await search.search('Private')).toEqual([]);
    mode.set(true);expect((await search.search('arjuna Private'))[0].draft).toBeTruthy();mode.set(false);expect(await search.search('arjuna Private')).toEqual([]);
    for(const[language,offline]of[['te',false],['en',true]] as const){const other=setup(language,offline);other.mode.set(true);expect(await other.search.search('Private')).toEqual([]);}
  });
  it('identifies approved translation previews while keeping their prose restricted to English dev mode',async()=>{
    const{search,mode}=setup('en',false,true);mode.set(true);
    const hit=(await search.search('Private'))[0];expect(hit.draft).toBeTruthy();expect(hit.preview).toBeTruthy();
    expect(search.result(hit).preview).toBeTruthy();expect((await search.search('arjuna'))[0].preview).toBeFalsy();
    mode.set(false);expect(await search.search('Private')).toEqual([]);
  });
  it('produces exact internal verse links rather than linking to the book overview',async()=>{
    const{search}=setup(),hit=(await search.search('karma'))[0],result=search.result(hit);
    expect(result.routerLink).toEqual(['/scriptures','bhagavad-gita',2]);expect(result.fragment).toBe('verse-2-47');
    expect(result.kind).toBe('scripture');expect(result.slug).toBe('bhagavad-gita/2.47');expect(result.externalUrl).toBeUndefined();
  });
});
