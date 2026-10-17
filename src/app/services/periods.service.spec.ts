import { Injector, runInInjectionContext, signal } from '@angular/core';
import { PeriodsService } from './periods.service';
import { ArticleService } from './article.service';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';
import { recommendedBooks } from '../data/recommended-books';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let isDevMode: ReturnType<typeof signal<boolean>>;
  let articles: any[];

  beforeEach(() => {
    isDevMode = signal(false);
    articles = [];
    const mockArticlesService = {
      whenReady: async () => {},
      allArticles: () => articles,
      search: async () => [],
      getBySlug: () => undefined,
    };

    const mockLocaleService = {
      language: 'en',
      translate: (s: string) => s,
      format: (s: string) => s,
    };

    const injector = Injector.create({
      providers: [
        { provide: ArticleService, useValue: mockArticlesService },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: DevModeService, useValue: { isDevMode } },
      ],
    });

    service = runInInjectionContext(injector, () => new PeriodsService());
  });

  it('should get top level periods', () => {
    const top = service.getTopLevel();
    expect(top.length).toBeGreaterThan(0);
    expect(top.some(p => p.slug === 'prehistory')).toBeTruthy();
  });

  it('should find periods by slug and find parent', () => {
    const period = service.getBySlug('lower-paleolithic');
    expect(period).toBeDefined();
    expect(period?.name).toBe('Lower Paleolithic');

    const parent = service.getParent('lower-paleolithic');
    expect(parent?.slug).toBe('paleolithic');
  });

  it('should filter polities into empires and regional kingdoms', () => {
    const empires = service.getEmpires();
    const kingdoms = service.getRegionalKingdoms();

    expect(empires.length).toBeGreaterThan(0);
    expect(kingdoms.length).toBeGreaterThan(0);
    expect(empires.every(e => e.kind === 'empire')).toBeTruthy();
    expect(kingdoms.every(k => k.kind === 'regional-kingdom')).toBeTruthy();
  });

  it('should retrieve polities by slug', () => {
    const maurya = service.getPolityBySlug('maurya');
    expect(maurya).toBeDefined();
    expect(maurya?.kind).toBe('empire');
  });

  it('should retrieve themes and personalities', () => {
    const themes = service.getThemes();
    expect(themes.length).toBeGreaterThan(0);

    const personalities = service.getPersonalities();
    expect(personalities.length).toBeGreaterThan(0);
  });

  it('should return unified search results across entities when searched', async () => {
    isDevMode.set(true);
    const results = await service.searchAll('Maurya');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.title.toLowerCase().includes('maurya'))).toBeTruthy();
  });

  it('keeps empty history categories out of public search', async () => {
    const regular = await service.searchAll('Maurya');
    expect(regular.some(result => result.kind === 'period' || result.kind === 'polity')).toBeFalsy();
    isDevMode.set(true);
    const dev = await service.searchAll('Maurya');
    expect(dev.some(result => result.kind === 'period' || result.kind === 'polity')).toBeTruthy();
  });

  it('keeps books without affiliate links out of public search', async () => {
    const pending = recommendedBooks.find(book => !book.affiliateUrl)!;
    const publicResults = await service.searchAll(pending.isbn10);
    expect(publicResults.some(result => result.kind === 'book' && result.slug === pending.isbn10)).toBeFalsy();
    isDevMode.set(true);
    const devResults = await service.searchAll(pending.isbn10);
    expect(devResults.some(result => result.kind === 'book' && result.slug === pending.isbn10)).toBeTruthy();
  });

  it('hides empty categories, keeps ancestor periods, and reveals all in dev mode', () => {
    articles = [{ period: 'lower-paleolithic', polity: undefined, themes: [], personalities: [], tags: [] }];
    expect(service.isVisiblePeriod('lower-paleolithic')).toBeTruthy();
    expect(service.isVisiblePeriod('paleolithic')).toBeTruthy();
    expect(service.isVisiblePeriod('prehistory')).toBeTruthy();
    expect(service.isVisiblePeriod('medieval')).toBeFalsy();
    expect(service.isVisibleTheme(service.getThemes()[0].slug)).toBeFalsy();
    isDevMode.set(true);
    expect(service.isVisiblePeriod('medieval')).toBeTruthy();
    expect(service.isVisibleTheme(service.getThemes()[0].slug)).toBeTruthy();
  });

  it('does not show unrelated empires from a generic Empire tag', () => {
    articles = [{ period: 'medieval', polity: 'mughal', themes: [], personalities: [], tags: ['Empire'] }];
    expect(service.isVisiblePeriod('medieval')).toBeTruthy();
    expect(service.isVisiblePeriod('early-historic')).toBeFalsy();
    expect(service.isVisiblePolity('mughal')).toBeTruthy();
    expect(service.isVisiblePolity('maurya')).toBeFalsy();
  });

  it('lists Ashoka’s guide and individual edicts on his personality page', async () => {
    articles = [
      { slug: 'ashoka-major-rock-edict-10', relatedTo: 'ashoka-edicts', personalities: ['ashoka'] },
      { slug: 'unrelated-edict', relatedTo: 'other-guide', personalities: ['other'] },
      { slug: 'ashoka-major-rock-edict-2', relatedTo: 'ashoka-edicts', personalities: ['ashoka'] },
      { slug: 'ashoka-edicts', personalities: ['ashoka'] },
      { slug: 'ashoka-major-rock-edict-1', relatedTo: 'ashoka-edicts', personalities: ['ashoka'] },
    ];

    const result = await service.getArticlesForPersonality('ashoka');
    expect(result.map(article => article.slug)).toEqual([
      'ashoka-edicts',
      'ashoka-major-rock-edict-1',
      'ashoka-major-rock-edict-2',
      'ashoka-major-rock-edict-10',
    ]);
    expect(await service.getArticleCountForPersonality('ashoka')).toBe(4);
  });

  it('lists Ashoka’s guide and edicts under the Mauryan period and polity', async () => {
    articles = [
      { slug: 'ashoka-major-rock-edict-2', period: 'mauryan', polity: 'maurya', relatedTo: 'ashoka-edicts', tags: [] },
      { slug: 'unrelated', period: 'classical', polity: 'gupta', tags: [] },
      { slug: 'ashoka-edicts', period: 'mauryan', polity: 'maurya', tags: [] },
      { slug: 'ashoka-major-rock-edict-1', period: 'mauryan', polity: 'maurya', relatedTo: 'ashoka-edicts', tags: [] },
    ];
    const expected = ['ashoka-edicts', 'ashoka-major-rock-edict-1', 'ashoka-major-rock-edict-2'];

    expect((await service.getArticlesForPeriod('mauryan')).map(article => article.slug)).toEqual(expected);
    expect((await service.getArticlesForPeriod('early-historic')).map(article => article.slug)).toEqual(expected);
    expect((await service.getArticlesForPolity('maurya')).map(article => article.slug)).toEqual(expected);
    expect(await service.getArticleCount('mauryan')).toBe(3);
    expect(await service.getArticleCountForPolity('maurya')).toBe(3);
  });
});
