import { Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PersonalityProfilesService } from './personality-profiles.service';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';

describe('Personality story approval gate', () => {
  function setup(language = 'en', dev = false, offline = false) {
    const requested: string[] = [];
    const mode = signal(dev);
    const injector = Injector.create({providers: [
      {provide: LocaleService, useValue: {language, offline, generatedAssetsBase: '/assets/generated/'}},
      {provide: DevModeService, useValue: {isDevMode: mode}},
      {provide: HttpClient, useValue: {get: (url: string) => {
        requested.push(url);
        return of(url.includes('story-drafts') ? {ashoka: {title: 'Unapproved life story', chapters: [], draft: true}} : {ashoka: {events: [], sources: []}});
      }}},
    ]});
    return {service: runInInjectionContext(injector, () => new PersonalityProfilesService()), requested, mode};
  }

  it('loads the life story only for an English dev preview', async () => {
    const {service, requested, mode} = setup('en', true);
    expect((await service.get('ashoka'))?.story?.title).toBe('Unapproved life story');
    expect(requested).toContain('/assets/generated/personality-story-drafts.json');
    mode.set(false);
    expect((await service.get('ashoka'))?.story).toBeUndefined();
  });

  it('never fetches unapproved story text in normal mode', async () => {
    const {service, requested} = setup();
    expect((await service.get('ashoka'))?.story).toBeUndefined();
    expect(requested).toEqual(['/assets/generated/personality-profiles.json']);
  });

  it('keeps translated previews on approved localized content', async () => {
    const {service, requested} = setup('hi', true);
    expect((await service.get('ashoka'))?.story).toBeUndefined();
    expect(requested).toEqual(['/assets/generated/hi/personality-profiles.json']);
  });

  it('does not load review drafts in the offline extension even when dev mode is requested', async () => {
    const {service, requested} = setup('en', true, true);
    expect((await service.get('ashoka'))?.story).toBeUndefined();
    expect(requested).toEqual(['/assets/generated/personality-profiles.json']);
  });
});
