import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeriodDetailComponent } from './period-detail.component';
import { PeriodsService } from '../../services/periods.service';
import { ArticleService } from '../../services/article.service';
import { LocaleService } from '../../i18n/locale.service';

describe('PeriodDetailComponent', () => {
  let component: PeriodDetailComponent;
  let periodsMock: any;

  beforeEach(() => {
    const mockRoute = {
      paramMap: { pipe: () => ({ subscribe: () => {} }) },
      snapshot: { url: [], queryParamMap: { get: () => null } },
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
      getPolityChildren: () => [],
      getPolityParent: () => undefined,
      isVisiblePolity: () => true,
      isVisiblePeriod: () => true,
    };
    periodsMock = mockPeriodsService;
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

    component.polity.set({ ...component.polity()!, kind: 'dynasty' });
    expect(component.kindLabel()).toBe('dynasty');

    // Theme
    component.isPolity.set(false);
    component.isTheme.set(true);
    expect(component.kindLabel()).toBe('theme');

    // Personality
    component.isTheme.set(false);
    component.isPersonality.set(true);
    expect(component.kindLabel()).toBe('personality');
  });

  it('loads child kingdoms with counts and filters their visibility', async () => {
    const base = { range: '', description: '', shortDescription: '', kind: 'regional-kingdom', period: 'medieval' };
    periodsMock.getPolityBySlug = () => ({ ...base, slug: 'rajputs', name: 'Rajputs' });
    periodsMock.getPolityChildren = () => [
      { ...base, slug: 'mewar', name: 'Mewar' }, { ...base, slug: 'marwar', name: 'Marwar' },
    ];
    periodsMock.getArticleCountForPolity = async (slug: string) => slug === 'mewar' ? 1 : 0;
    periodsMock.isVisiblePolity = (slug: string) => slug !== 'marwar';
    await (component as any).loadPeriod('rajputs');
    expect(component.children().length).toBe(2);
    expect(component.visibleChildren().map(child => child.slug)).toEqual(['mewar']);
    expect(component.childCounts()).toEqual({ mewar: 1, marwar: 0 });
  });

  it('returns from an individual kingdom to its parent and resets children when navigating', async () => {
    const base = { range: '', description: '', shortDescription: '', kind: 'regional-kingdom', period: 'medieval' };
    const mewar = { ...base, slug: 'mewar', name: 'Mewar', parent: 'rajputs' };
    periodsMock.getPolityBySlug = () => mewar;
    periodsMock.getPolityParent = () => ({ ...base, slug: 'rajputs', name: 'Rajputs' });
    component.children.set([mewar as any]);
    await (component as any).loadPeriod('mewar');
    expect(component.backRoute()).toEqual(['/polity', 'rajputs']);
    expect(component.backText()).toBe('← Back to Rajputs');
    expect(component.children().length).toBe(0);
  });
});
