import { Injector, runInInjectionContext } from '@angular/core';
import { PersonalityProfileComponent } from './personality-profile.component';
import { LocaleService } from '../../i18n/locale.service';
import { PersonalityProfile, PersonalityProfilesService } from '../../services/personality-profiles.service';

describe('PersonalityProfileComponent', () => {
  function create(language = 'en', get: (slug: string) => Promise<PersonalityProfile | undefined> = async () => undefined) {
    const injector = Injector.create({ providers: [
      { provide: LocaleService, useValue: { language, translate: (s: string) => s } },
      { provide: PersonalityProfilesService, useValue: { get } },
    ] });
    return runInInjectionContext(injector, () => new PersonalityProfileComponent());
  }

  it('preserves historical years and uncertainty instead of inferring a birth or reign date', () => {
    const component = create();
    expect(component.eventDate({ title: 'Kalinga War', year: -261, approximate: true })).toBe('c. 261 BCE');
    expect(component.eventDate({ title: 'Siege', year: 1567, until: 1568 })).toBe('1567–1568 CE');
    expect(component.eventDate({ title: 'Renunciation', date: 'Dates uncertain' })).toBe('Dates uncertain');
    expect(create('zh').eventDate({ title: 'War', year: -261 })).toBe('BCE 261');
  });

  it('keeps the latest personality when a previous profile request finishes later', async () => {
    let finishFirst!: (profile: PersonalityProfile) => void;
    const first = new Promise<PersonalityProfile>(resolve => finishFirst = resolve);
    const second: PersonalityProfile = { events: [{ title: 'Regency' }], sources: [] };
    const component = create('en', slug => slug === 'ashoka' ? first : Promise.resolve(second));
    const person = (slug: string) => ({ slug, name: slug, range: '', description: '', shortDescription: '' });
    component.personality = person('ashoka');
    const previous = component.ngOnChanges();
    component.personality = person('rani-durgavati');
    await component.ngOnChanges();
    finishFirst({ events: [{ title: 'Kalinga War' }], sources: [] });
    await previous;
    expect(component.profile()?.events[0].title).toBe('Regency');
  });

  it('preserves draft preview context and the personality backlink on article links', () => {
    const component = create('hi');
    component.personality = { slug: 'ashoka', name: '', range: '', description: '', shortDescription: '' };
    expect(component.articleParams(true)).toEqual({ lang: 'hi', fromPersonality: 'ashoka', dev: true });
  });
});
