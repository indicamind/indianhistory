import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ArticleDetailComponent } from './article-detail.component';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { BookRecommendationsService } from '../../services/book-recommendations.service';
import { PageViewService } from '../../services/page-view.service';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let mockRoute: any;
  let mockArticles: any;
  let mockPeriodsService: any;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let queryParams: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let recordedSlugs: string[];

  const article = (slug: string, title: string, relatedTo?: string): Article => ({
    slug, title, relatedTo, excerpt: '', html: `<p>${title}</p>`,
    publishedAt: '2026-10-16', updatedAt: '2026-10-16',
    tags: [], themes: [], personalities: [], books: [],
  });

  beforeEach(() => {
    recordedSlugs = [];
    params = new BehaviorSubject(convertToParamMap({ slug: 'attirampakkam-acheulean-stone-tools' }));
    queryParams = new BehaviorSubject(convertToParamMap({}));
    mockRoute = {
      paramMap: params,
      queryParamMap: queryParams,
      snapshot: { routeConfig: { path: 'article/:slug' } },
    };
    mockArticles = {
      whenReady: async () => {},
      getArticle: async () => null,
      getBySlug: () => undefined,
      allArticles: () => [],
    };
    mockPeriodsService = {
      getPolityBySlug: () => null,
      getBySlug: () => null,
      getThemeBySlug: () => null,
      getPersonalityBySlug: () => null,
    };
    const mockSanitizer = {
      bypassSecurityTrustHtml: (html: string) => html,
    };
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      format: (s: string) => s,
    };

    const injector = Injector.create({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DestroyRef, useValue: { onDestroy: () => () => {} } },
        { provide: ArticleService, useValue: mockArticles },
        { provide: PageViewService, useValue: { record: (slug: string) => recordedSlugs.push(slug) } },
        BookRecommendationsService,
        { provide: PeriodsService, useValue: mockPeriodsService },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: LocaleService, useValue: mockLocale },
        { provide: DevModeService, useValue: { isDevMode: () => false } },
      ],
    });

    component = runInInjectionContext(injector, () => new ArticleDetailComponent());
  });

  it('should initialize with loading true and default backLink', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.backLink()).toBe('/');
  });

  it('counts loaded articles once per slug and ignores query-only changes', async () => {
    mockArticles.getArticle = async (slug: string) => article(slug, slug);
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    queryParams.next(convertToParamMap({ fromSearch: 'true' }));
    await new Promise(resolve => setTimeout(resolve, 0));
    params.next(convertToParamMap({ slug: 'ashoka-edicts' }));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(recordedSlugs).toEqual(['attirampakkam-acheulean-stone-tools', 'ashoka-edicts']);
  });

  it('does not count missing articles', async () => {
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(recordedSlugs).toEqual([]);
  });

  it('shows draft text without recording a view', async () => {
    mockArticles.getArticle = async (slug: string) => ({ ...article(slug, 'English draft'), draft: true });
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.article()?.draft).toBeTruthy();
    expect(String(component.html())).toContain('English draft');
    expect(recordedSlugs).toEqual([]);
  });

  it('should adapt backLink when navigated from search', async () => {
    queryParams.next(convertToParamMap({ fromSearch: 'true' }));
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.backLink()).toBe('/search');
    expect(component.backText()).toContain('search');
  });

  it('should adapt backLink when navigated from a polity', async () => {
    queryParams.next(convertToParamMap({ fromPolity: 'maurya' }));
    mockPeriodsService.getPolityBySlug = (slug: string) => {
      if (slug === 'maurya') return { name: 'Mauryan Empire' };
      return null;
    };

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.backLink()).toBe('/polity/maurya');
    expect(component.backText()).toContain('Mauryan Empire');
  });

  it('loads the new edict when an article link changes the slug on the same route', async () => {
    const guide = article('ashoka-edicts', 'Ashoka’s edicts: a guide');
    const edict = article('ashoka-major-rock-edict-1', 'Major Rock Edict I', 'ashoka-edicts');
    const second = article('ashoka-major-rock-edict-2', 'Major Rock Edict II', 'ashoka-edicts');
    const entries = [guide, edict, second];
    mockArticles.allArticles = () => entries;
    mockArticles.getArticle = async (slug: string) => entries.find(entry => entry.slug === slug);
    mockArticles.getBySlug = (slug: string) => slug === guide.slug ? guide : undefined;
    params.next(convertToParamMap({ slug: guide.slug }));
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.article()?.title).toBe(guide.title);

    params.next(convertToParamMap({ slug: edict.slug }));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.article()?.title).toBe(edict.title);
    expect(component.html()).toBe(edict.html);
    expect(component.backLink()).toBe('/article/ashoka-edicts');
    expect(component.edictNavigation()?.next?.slug).toBe(second.slug);

    params.next(convertToParamMap({ slug: second.slug }));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.article()?.slug).toBe(second.slug);
    expect(component.edictNavigation()?.previous?.slug).toBe(edict.slug);
    expect(component.edictNavigation()?.next).toBeUndefined();
  });

  it('uses the guide order for numerical edicts and transitions between groups', () => {
    const entry = (slug: string) => article(slug, slug, 'ashoka-edicts');
    const first = entry('ashoka-major-rock-edict-1');
    const second = entry('ashoka-major-rock-edict-2');
    const tenth = entry('ashoka-major-rock-edict-10');
    const lastRock = entry('ashoka-major-rock-edict-14');
    const separate = entry('ashoka-separate-rock-edict-1');
    const pillar = entry('ashoka-major-pillar-edict-1');
    const guide = article('ashoka-edicts', 'Guide');
    mockArticles.allArticles = () => [pillar, tenth, guide, separate, second, lastRock, first];

    component.article.set(guide);
    expect(component.relatedArticles().map(entry => entry.slug)).toEqual([
      first.slug, second.slug, tenth.slug, lastRock.slug, separate.slug, pillar.slug,
    ]);
    component.article.set(second);
    expect(component.edictNavigation()?.next?.slug).toBe(tenth.slug);
    expect(component.edictNavigation()?.previous?.slug).toBe(first.slug);
    component.article.set(lastRock);
    expect(component.edictNavigation()?.next?.slug).toBe(separate.slug);
    component.article.set(separate);
    expect(component.edictNavigation()?.next?.slug).toBe(pillar.slug);
  });

  it('omits nonexistent neighbors and follows the available associated inscriptions', () => {
    const entry = (slug: string, title: string) => article(slug, title, 'ashoka-edicts');
    const first = entry('ashoka-major-rock-edict-1', 'प्रथम शिलालेख');
    const laghman = entry('ashoka-laghman-i-inscription', 'लगमान');
    const taxila = entry('ashoka-taxila-aramaic-inscription', 'तक्षशिला');
    const last = entry('ashoka-pul-i-darunta-inscription', 'पुल-ए-दरुंता');
    mockArticles.allArticles = () => [last, taxila, first, laghman];

    component.article.set(first);
    expect(component.edictNavigation()?.previous).toBeUndefined();
    expect(component.edictNavigation()?.next?.title).toBe(laghman.title);
    component.article.set(laghman);
    expect(component.edictNavigation()?.next?.slug).toBe(taxila.slug);
    component.article.set(last);
    expect(component.edictNavigation()?.next).toBeUndefined();
    expect(component.edictNavigation()?.previous?.slug).toBe(taxila.slug);
  });

  it('does not show edict navigation on the guide or unrelated articles', () => {
    mockArticles.allArticles = () => [article('ashoka-major-rock-edict-1', 'Edict I', 'ashoka-edicts')];
    component.article.set(article('ashoka-edicts', 'Guide'));
    expect(component.edictNavigation()).toBeNull();
    component.article.set(article('other-article', 'Other', 'other-guide'));
    expect(component.edictNavigation()).toBeNull();
    component.article.set(article('missing-edict', 'Missing', 'ashoka-edicts'));
    expect(component.edictNavigation()).toBeNull();
  });
});
