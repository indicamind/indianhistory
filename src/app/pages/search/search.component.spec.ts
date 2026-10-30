import { DestroyRef, Injector, runInInjectionContext, signal } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, convertToParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { SearchComponent } from './search.component';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { SearchResult } from '../../models/article.model';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let isDevMode: ReturnType<typeof signal<boolean>>;
  let routeParams: Subject<ParamMap>;

  beforeEach(() => {
    isDevMode = signal(false);
    routeParams = new Subject<ParamMap>();
    const mockArticles = {
      whenReady: async () => {},
      allArticles: () => [],
    };
    const mockPeriods = {
      searchAll: async () => [],
      getAll: () => [],
      getThemes: () => [],
      getPersonalities: () => [],
      getEmpires: () => [{ slug: 'maurya' }],
      getPolities: () => [{ slug: 'tughlaq-dynasty', kind: 'dynasty' }],
      getRegionalKingdoms: () => [{ slug: 'kakatiya' }],
      isVisiblePolity: () => true,
      getPolityBySlug: (slug: string) => {
        if (slug === 'maurya') return { kind: 'empire' };
        if (slug === 'kakatiya') return { kind: 'regional-kingdom' };
        if (slug === 'tughlaq-dynasty') return { kind: 'dynasty' };
        return null;
      },
    };
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      navigation: { books: 'Books', kingdoms: 'Kingdoms' },
    };
    const mockRoute = {
      snapshot: { queryParamMap: { get: () => null } },
      queryParamMap: routeParams,
    };
    const mockRouter = {
      navigate: async () => true,
    };
    const mockDestroyRef = {
      onDestroy: () => () => {},
    };

    const injector = Injector.create({
      providers: [
        { provide: ArticleService, useValue: mockArticles },
        { provide: PeriodsService, useValue: mockPeriods },
        { provide: LocaleService, useValue: mockLocale },
        { provide: DevModeService, useValue: { isDevMode } },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    });

    component = runInInjectionContext(injector, () => new SearchComponent());
  });

  it('should initialize with default filter "all" and empty query', () => {
    expect(component.query).toBe('');
    expect(component.activeFilter()).toBe('all');
    expect(component.loading()).toBeTruthy();
  });

  it('submits the current input before the live-search debounce finishes', () => {
    component.onQueryInput('Bindusara');
    component.submit();
    expect(component.query).toBe('Bindusara');
    expect(component.searched()).toBeTruthy();
  });

  it('preserves newly typed text when the current URL is emitted again', async () => {
    await component.ngOnInit();
    component.query = 'Bindusara';
    routeParams.next(convertToParamMap({ lang: 'en' }));
    expect(component.query).toBe('Bindusara');
    routeParams.next(convertToParamMap({ q: 'Ashoka', lang: 'en' }));
    expect(component.query).toBe('Ashoka');
  });

  it('preserves input entered while the article index is becoming ready', async () => {
    const ready = component.ngOnInit();
    component.onQueryInput('Bindusara');
    await ready;
    expect(component.query).toBe('Bindusara');
    expect(component.searched()).toBeTruthy();
  });

  it('hides stale pending book results when dev mode is switched off', () => {
    component.results.set([{ kind: 'book', slug: 'pending', title: 'Pending', excerpt: '', kindLabel: 'Book', externalUrl: 'https://www.amazon.in/dp/pending', affiliatePending: true }]);
    isDevMode.set(true);
    expect(component.filteredResults().length).toBe(1);
    isDevMode.set(false);
    expect(component.filteredResults().length).toBe(0);
  });

  it('should match results correctly with active filters', () => {
    const articleResult: SearchResult = {
      slug: 'stone-tools',
      title: 'Stone Tools',
      excerpt: '',
      kind: 'article',
      routerLink: ['/article', 'stone-tools'],
      kindLabel: 'Story',
    };

    const bookResult: SearchResult = {
      slug: '0140138358',
      title: 'A History of India',
      excerpt: '',
      kind: 'book',
      externalUrl: 'https://amazon.in',
      kindLabel: 'Book',
    };

    const empireResult: SearchResult = {
      slug: 'maurya',
      title: 'Mauryan Empire',
      excerpt: '',
      kind: 'polity',
      routerLink: ['/polity', 'maurya'],
      kindLabel: 'Empire',
    };

    const kingdomResult: SearchResult = {
      slug: 'kakatiya',
      title: 'Kakatiya Kingdom',
      excerpt: '',
      kind: 'polity',
      routerLink: ['/polity', 'kakatiya'],
      kindLabel: 'Kingdom',
    };

    component.activeFilter.set('all');
    expect((component as any).matchesFilter(articleResult)).toBeTruthy();
    expect((component as any).matchesFilter(bookResult)).toBeTruthy();

    component.activeFilter.set('article');
    expect((component as any).matchesFilter(articleResult)).toBeTruthy();
    expect((component as any).matchesFilter(bookResult)).toBeFalsy();

    component.activeFilter.set('book');
    expect((component as any).matchesFilter(bookResult)).toBeTruthy();
    expect((component as any).matchesFilter(articleResult)).toBeFalsy();

    component.activeFilter.set('empire');
    expect((component as any).matchesFilter(empireResult)).toBeTruthy();
    expect((component as any).matchesFilter(kingdomResult)).toBeFalsy();

    component.activeFilter.set('kingdom');
    expect((component as any).matchesFilter(kingdomResult)).toBeTruthy();
    expect((component as any).matchesFilter(empireResult)).toBeFalsy();

    component.activeFilter.set('dynasty');
    expect((component as any).matchesFilter({ ...empireResult, slug: 'tughlaq-dynasty', kindLabel: 'Dynasty' })).toBeTruthy();
    expect((component as any).matchesFilter(empireResult)).toBeFalsy();
    expect((component as any).matchesFilter(kingdomResult)).toBeFalsy();
  });

  it('should normalize invalid filter values to "all"', () => {
    expect((component as any).toFilter('invalid-filter')).toBe('all');
    expect((component as any).toFilter('empire')).toBe('empire');
    expect((component as any).toFilter('book')).toBe('book');
  });

  it('omits filter chips for history categories without stories', () => {
    const values = component.filters().map(option => option.value);
    expect(values).toContain('all');
    expect(values).toContain('book');
    expect(values).toContain('empire');
    expect(values).not.toContain('period');
    expect(values).not.toContain('theme');
    expect(values).not.toContain('personality');
  });
});
