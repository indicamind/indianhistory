import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeriodDetailComponent } from './period-detail.component';
import { PeriodsService } from '../../services/periods.service';
import { ArticleService } from '../../services/article.service';
import { LocaleService } from '../../i18n/locale.service';

describe('PeriodDetailComponent', () => {
  let component: PeriodDetailComponent;

  beforeEach(() => {
    const mockRoute = {
      paramMap: { pipe: () => ({ subscribe: () => {} }) },
      snapshot: { url: [] },
    };
    const mockPeriodsService = {
      getBySlug: () => null,
      getParent: () => null,
      getPolityBySlug: () => null,
      getThemeBySlug: () => null,
      getPersonalityBySlug: () => null,
      getArticlesForPeriod: async () => [],
      getArticlesForPolity: async () => [],
      getArticlesForTheme: async () => [],
      getArticlesForPersonality: async () => [],
    };
    const mockArticlesService = {
      whenReady: async () => {},
    };
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      format: (s: string) => s,
    };
    const mockDestroyRef = {
      onDestroy: () => () => {},
    };

    const injector = Injector.create({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PeriodsService, useValue: mockPeriodsService },
        { provide: ArticleService, useValue: mockArticlesService },
        { provide: LocaleService, useValue: mockLocale },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    });

    component = runInInjectionContext(injector, () => new PeriodDetailComponent());
  });

  it('should initialize with loading true and backRoute pointing to home', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.backRoute()).toEqual(['/']);
  });

  it('should compute kindLabel accurately for different entity types', () => {
    // Period default
    component.isPolity.set(false);
    component.isTheme.set(false);
    component.isPersonality.set(false);
    expect(component.kindLabel()).toBe('period');

    // Empire
    component.isPolity.set(true);
    component.polity.set({
      slug: 'maurya',
      name: 'Mauryan Empire',
      range: '322–185 BCE',
      shortDescription: '',
      description: '',
      period: 'early-historic',
      kind: 'empire',
    });
    expect(component.kindLabel()).toBe('empire');

    // Regional Kingdom
    component.polity.set({
      slug: 'ahom',
      name: 'Ahom Kingdom',
      range: '1228–1826 CE',
      shortDescription: '',
      description: '',
      period: 'medieval',
      kind: 'regional-kingdom',
    });
    expect(component.kindLabel()).toBe('kingdom');

    // Theme
    component.isPolity.set(false);
    component.isTheme.set(true);
    expect(component.kindLabel()).toBe('theme');

    // Personality
    component.isTheme.set(false);
    component.isPersonality.set(true);
    expect(component.kindLabel()).toBe('personality');
  });
});
