import {Injector,runInInjectionContext,signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {ScripturesService} from './scriptures.service';
import {LocaleService} from '../i18n/locale.service';
import {DevModeService} from './dev-mode.service';
describe('Scripture reader data isolation',()=>{
 function setup(language='en',dev=false,offline=false,released=false,englishReleased=false){
  const requested:string[]=[],mode=signal(dev),book={slug:'bhagavad-gita',originalTitle:'भगवद्गीता',editionNote:'Edition',verseCount:1,sources:[],chapters:[{book:'bhagavad-gita',number:1,title:'अध्याय',transliteration:'adhyāya',verseCount:1}],commentaryChapters:released?[1]:[],englishCommentaryChapters:released||englishReleased?[1]:[]};
  const chapter={...book.chapters[0],verses:[{id:'1.1',number:1,sanskrit:'धर्म',transliteration:'dharma'}]};
  const commentary={title:'Review',excerpt:'Context',introHtml:'Intro',sourcesHtml:'Sources',verses:[{id:'1.1',meaningHtml:'Meaning',explanationHtml:'Explanation'}]};
  const injector=Injector.create({providers:[{provide:LocaleService,useValue:{language,offline,generatedAssetsBase:'/assets/generated/',translate:(s:string)=>s}},{provide:DevModeService,useValue:{isDevMode:mode}},{provide:HttpClient,useValue:{get:(url:string)=>{requested.push(url);return of(url.endsWith('/scriptures.json')?[book]:url.endsWith('/scripture-drafts.json')?{'bhagavad-gita':[1]}:url.includes('scripture-drafts/')?{...commentary,draft:true}:url.includes('scripture-commentary/')?commentary:chapter)}}}]});
  return{service:runInInjectionContext(injector,()=>new ScripturesService()),requested,mode};
 }
 it('loads only the selected chapter and never requests unpublished explanations in ordinary or translated mode',async()=>{
  for(const[language,offline]of[['en',false],['hi',false],['en',true]] as const){const{service,requested}=setup(language,false,offline);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary).toBeUndefined();expect(requested).toEqual(['/assets/generated/scriptures.json','/assets/generated/scriptures/bhagavad-gita/1.json']);expect(await service.getChapter(book,2)).toBeUndefined();}
 });
 it('keeps English review data out of the cached base text and respects dev mode being switched off',async()=>{
  const{service,requested,mode}=setup('en',true);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary?.draft).toBeTruthy();mode.set(false);expect((await service.getChapter(book,1))?.commentary).toBeUndefined();expect(requested.filter(url=>url==='/assets/generated/scriptures/bhagavad-gita/1.json').length).toBe(1);
 });
 it('never requests English review text in a translated dev view or the offline extension',async()=>{
  for(const[language,offline]of[['te',false],['en',true]] as const){const{service,requested}=setup(language,true,offline);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary).toBeUndefined();expect(requested.some(url=>url.includes('drafts'))).toBeFalsy();}
 });
 it('loads approved English in public and offline views while keeping pending translations absent',async()=>{
  for(const offline of [false,true]){const{service,requested}=setup('en',false,offline,false,true);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary?.title).toBe('Review');expect(requested).toContain('/assets/generated/scripture-commentary/bhagavad-gita/1.json');expect(requested.some(url=>url.includes('drafts'))).toBeFalsy();}
  for(const language of ['hi','te','ar']){const{service,requested}=setup(language,true,false,false,true);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary).toBeUndefined();expect(requested.some(url=>url.includes('commentary'))).toBeFalsy();}
 });
 it('loads released explanations from the selected language while sharing the Sanskrit text',async()=>{
  const{service,requested}=setup('fr',false,false,true);const book=(await service.getBooks())[0];expect((await service.getChapter(book,1))?.commentary?.title).toBe('Review');expect(requested).toContain('/assets/generated/fr/scripture-commentary/bhagavad-gita/1.json');
 });
});
