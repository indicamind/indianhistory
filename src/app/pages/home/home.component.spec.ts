import { Injector, runInInjectionContext, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleSummary } from '../../models/article.model';
import { DevModeService } from '../../services/dev-mode.service';
import { personalities, polities, themes } from '../../data/periods';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let devMode: ReturnType<typeof signal<boolean>>;
  let articles: ReturnType<typeof signal<ArticleSummary[]>>;

  beforeEach(() => {
    devMode = signal(false);
    articles = signal<ArticleSummary[]>([]);
    const mockArticlesSvc = {
      whenReady: async () => {},
      allArticles: articles.asReadonly(),
      hasWorldHistoryStories: () => false,
    };
    const mockPeriodsSvc = {
      getBySlug: () => null,
      getArticleCount: async () => 0,
      getThemes: () => [],
      getPersonalities: () => [],
      getEmpires: () => [],
      getRegionalKingdoms: () => [],
    };
    const mockRoute = {
      snapshot: { fragment: '' },
    };
    const mockViewportScroller = {
      scrollToAnchor: () => {},
    };
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      format: (s: string) => s,
    };

    const injector = Injector.create({
      providers: [
        { provide: ArticleService, useValue: mockArticlesSvc },
        { provide: PeriodsService, useValue: mockPeriodsSvc },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ViewportScroller, useValue: mockViewportScroller },
        { provide: LocaleService, useValue: mockLocale },
        { provide: DevModeService, useValue: { isDevMode: devMode } },
      ],
    });

    component = runInInjectionContext(injector, () => new HomeComponent());
  });

  it('should initialize with empty lists and loading true', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.list().length).toBe(0);
    expect(component.timelinePeriods().length).toBe(0);
    expect(component.empires().length).toBe(0);
  });

  it('hides the empty World History section in dev mode', () => {
    devMode.set(true);
    expect(component.showWorldHistory()).toBeFalsy();
  });

  it('features a World History article rather than its event overview', async () => {
    const base = {
      publishedAt: '2026-10-16',
      updatedAt: '2026-10-16',
      tags: [],
      themes: [],
      personalities: [],
      books: [],
    };
    articles.set([
      { ...base, slug: 'agriculture', title: 'Agriculture', excerpt: 'Event', period: 'world-history' },
      { ...base, slug: 'farming-life', title: 'Farming life', excerpt: 'Article', period: 'world-history', relatedTo: 'agriculture' },
    ]);

    await component.ngOnInit();
    expect(component.list().map(article => article.slug)).toEqual(['farming-life']);
  });

  it('shows empty section cards only in dev mode', () => {
    component.timelinePeriods.set([
      { slug: 'prehistory', name: 'Prehistory', range: '', description: '', articleCount: 3 },
      { slug: 'medieval', name: 'Medieval', range: '', description: '', articleCount: 0 },
    ]);
    expect(component.visibleTimelinePeriods().map(period => period.slug)).toEqual(['prehistory']);
    devMode.set(true);
    expect(component.visibleTimelinePeriods().map(period => period.slug)).toEqual(['prehistory', 'medieval']);
  });

  it('shows a few items in each section until it is expanded', () => {
    component.themes.set(themes.slice(0, 4).map(item => ({ ...item, articleCount: 1 })));
    component.empires.set(polities.filter(item => item.kind === 'empire').slice(0, 4).map(item => ({ ...item, articleCount: 1 })));
    component.regionalKingdoms.set(polities.filter(item => item.kind === 'regional-kingdom').slice(0, 4).map(item => ({ ...item, articleCount: 1 })));
    component.personalities.set(personalities.slice(0, 4).map(item => ({ ...item, articleCount: 1 })));

    expect(component.shownThemes().length).toBe(3);
    expect(component.shownEmpires().length).toBe(3);
    expect(component.shownRegionalKingdoms().length).toBe(3);
    expect(component.shownPersonalities().length).toBe(3);

    component.expandedThemes.set(true);
    component.expandedEmpires.set(true);
    component.expandedRegionalKingdoms.set(true);
    component.expandedPersonalities.set(true);
    expect(component.shownThemes().length).toBe(4);
    expect(component.shownEmpires().length).toBe(4);
    expect(component.shownRegionalKingdoms().length).toBe(4);
    expect(component.shownPersonalities().length).toBe(4);

    component.expandedThemes.set(false);
    expect(component.shownThemes().length).toBe(3);
  });

  it('searches beyond the collapsed list and restores it when cleared', () => {
    component.personalities.set(personalities.map(person => ({ ...person, articleCount: 1 })));
    expect(component.shownPersonalities().length).toBe(3);
    component.personalityQuery.set('  PRATAP   1576  ');
    expect(component.shownPersonalities().map(person => person.slug)).toEqual(['maharana-pratap']);
    component.personalityQuery.set('Mewar');
    expect(component.shownPersonalities().length).toBeGreaterThan(3);
    component.personalityQuery.set('not-a-personality');
    expect(component.shownPersonalities().length).toBe(0);
    component.personalityQuery.set('');
    expect(component.shownPersonalities().length).toBe(3);
  });

  it('searches localized copy and English names while respecting public visibility', () => {
    const pratap = personalities.find(person => person.slug === 'maharana-pratap')!;
    component.personalities.set([{ ...pratap, name: 'महाराणा प्रताप', shortDescription: 'मेवाड़ का प्रतिरोध', description: '', articleCount: 1 }]);
    component.personalityQuery.set('प्रताप');
    expect(component.shownPersonalities().length).toBe(1);
    component.personalityQuery.set('Pratap');
    expect(component.shownPersonalities().length).toBe(1);
    component.personalities.set([{ ...pratap, articleCount: 0 }]);
    expect(component.shownPersonalities().length).toBe(0);
    devMode.set(true);
    expect(component.shownPersonalities().length).toBe(1);
  });

  it('should use the generated thumbnail metadata', () => {
    const articleWithImage: ArticleSummary = {
      slug: 'stone-tools',
      title: 'Stone Tools',
      excerpt: 'Old tools',
      thumbnail: { src: '/assets/media/tools.jpg', alt: 'Acheulean tools' },
      publishedAt: '2026-01-01',
      tags: [],
      books: [],
    };

    const thumb = component.thumbnail(articleWithImage);
    expect(thumb).not.toBeNull();
    expect(thumb?.src).toBe('/assets/media/tools.jpg');
    expect(thumb?.alt).toBe('Acheulean tools');
  });

  it('should return null when article has no images', () => {
    const articleWithoutImage: ArticleSummary = {
      slug: 'no-image',
      title: 'No Image',
      excerpt: 'Text only',
      publishedAt: '2026-01-01',
      tags: [],
      books: [],
    };

    const thumb = component.thumbnail(articleWithoutImage);
    expect(thumb).toBeNull();
  });
});
