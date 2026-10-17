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

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let mockRoute: any;
  let mockArticles: any;
  let mockPeriodsService: any;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let queryParams: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const article = (slug: string, title: string, relatedTo?: string): Article => ({
    slug, title, relatedTo, excerpt: '', html: `<p>${title}</p>`,
    publishedAt: '2026-10-16', updatedAt: '2026-10-16',
    tags: [], themes: [], personalities: [], books: [],
  });

  beforeEach(() => {
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
    mockArticles.getArticle = async (slug: string) => slug === guide.slug ? guide : edict;
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
  });
});
