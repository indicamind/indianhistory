import {Injector, runInInjectionContext} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {LocaleService} from '../i18n/locale.service';
import {DevModeService} from './dev-mode.service';
import {ThemeStoriesService} from './theme-stories.service';

describe('Theme story visibility', () => {
  function setup(language = 'en', dev = true, offline = false) {
    const requested: string[] = [];
    const injector = Injector.create({providers: [
      {provide: LocaleService, useValue: {language, offline, generatedAssetsBase:'/assets/generated/'}},
      {provide: DevModeService, useValue: {isDevMode:()=>dev}},
      {provide: HttpClient, useValue: {get:(url:string)=>{requested.push(url);return of(url.includes('drafts') ? {'colonization-of-india':{events:[],sources:[],story:{title:'Review',draft:true,chapters:[]}}}:{});}}},
    ]});
    return {service:runInInjectionContext(injector,()=>new ThemeStoriesService()),requested};
  }
  it('shows the unapproved narrative only in English dev mode',async()=>{
    expect((await setup().service.get('colonization-of-india'))?.story?.title).toBe('Review');
    expect(await setup('hi').service.get('colonization-of-india')).toBeUndefined();
  });
  it('never fetches draft text in normal or offline modes',async()=>{
    for(const offline of [false,true]){const {service,requested}=setup('en',offline,offline);expect(await service.get('colonization-of-india')).toBeUndefined();expect(requested).toEqual(['/assets/generated/theme-stories.json']);}
  });
});
