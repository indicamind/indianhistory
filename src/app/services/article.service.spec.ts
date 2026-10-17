import { Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ArticleService } from './article.service';
import { LocaleService } from '../i18n/locale.service';
import { Article, SearchEntry } from '../models/article.model';

describe('ArticleService', () => {
  let service: ArticleService;
  let requestedUrls: string[];
  const mockArticles: Article[] = [
    {
      slug: 'attirampakkam-acheulean-stone-tools',
      title: 'Attirampakkam Acheulean Stone Tools',
      excerpt: 'Prehistoric stone tools from Tamil Nadu',
      html: '<p>Excavations revealed Lower Paleolithic tools.</p>',
      publishedAt: '2026-01-01',
      tags: ['Prehistory', 'Archaeology'],
      books: [],
    },
    {
      slug: 'poompuhar-dispute',
      title: 'Poompuhar Submerged Port',
      excerpt: 'Submerged coastal structures at Poompuhar',
      html: '<p>Disputed marine archaeology claims.</p>',
      publishedAt: '2026-02-01',
      tags: ['Maritime', 'Sangam'],
      books: [],
    },
  ];

  const mockIndex: SearchEntry[] = [
    {
      slug: 'attirampakkam-acheulean-stone-tools',
      title: 'Attirampakkam Acheulean Stone Tools',
      excerpt: 'Prehistoric stone tools from Tamil Nadu',
      text: 'Attirampakkam Acheulean Stone Tools Lower Paleolithic',
    },
    {
      slug: 'poompuhar-dispute',
      title: 'Poompuhar Submerged Port',
      excerpt: 'Submerged coastal structures at Poompuhar',
      text: 'Poompuhar Submerged Port Marine Archaeology',
    },
  ];

  beforeEach(() => {
    requestedUrls = [];
    const mockHttp = {
      get: (url: string) => {
        requestedUrls.push(url);
        if (url.includes('/stories/')) return of(mockArticles.find(article => url.endsWith(`${article.slug}.json`)));
        if (url.includes('articles.json')) return of(mockArticles.map(({ html, ...summary }) => summary));
        if (url.includes('search-index.json')) return of(mockIndex);
        return of([]);
      },
    };

    const mockLocale = {
      language: 'en',
      generatedAssetsBase: '/indianhistory/assets/generated/',
      navigation: { worldHistory: 'World History' },
      translationAvailable: { set: () => {} },
    };

    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: LocaleService, useValue: mockLocale },
      ],
    });

    service = runInInjectionContext(injector, () => new ArticleService());
  });

  it('loads summaries at startup and fetches a story only when opened', async () => {
    await service.whenReady();
    expect(requestedUrls).toEqual(['/indianhistory/assets/generated/articles.json']);
    expect('html' in service.allArticles()[0]).toBeFalsy();

    const full = await service.getArticle('attirampakkam-acheulean-stone-tools');
    expect(full?.html).toContain('Excavations');
    expect(requestedUrls).toContain('/indianhistory/assets/generated/stories/attirampakkam-acheulean-stone-tools.json');
    await service.getArticle('attirampakkam-acheulean-stone-tools');
    expect(requestedUrls.filter(url => url.includes('/stories/')).length).toBe(1);
    expect(await service.getArticle('unknown-slug')).toBeUndefined();
  });

  it('should retrieve article summary by slug', async () => {
    await service.whenReady();
    const article = service.getBySlug('attirampakkam-acheulean-stone-tools');
    expect(article).toBeDefined();
    expect(article?.title).toBe('Attirampakkam Acheulean Stone Tools');

    const notFound = service.getBySlug('unknown-slug');
    expect(notFound).toBeUndefined();
  });

  it('should expose allArticles signal', async () => {
    await service.whenReady();
    const all = service.allArticles();
    expect(all.length).toBe(2);
    expect(all[0].slug).toBe('attirampakkam-acheulean-stone-tools');
  });

  it('loads the full-text index only when searching', async () => {
    await service.whenReady();
    expect(requestedUrls).not.toContain('/indianhistory/assets/generated/search-index.json');
    const results = await service.search('Paleolithic');
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('attirampakkam-acheulean-stone-tools');

    const marineResults = await service.search('marine');
    expect(marineResults.length).toBe(1);
    expect(marineResults[0].slug).toBe('poompuhar-dispute');
    expect(requestedUrls.filter(url => url.includes('search-index.json')).length).toBe(1);
  });

  it('should return empty array for empty search queries', async () => {
    expect((await service.search('')).length).toBe(0);
    expect((await service.search('   ')).length).toBe(0);
    expect(requestedUrls).not.toContain('/indianhistory/assets/generated/search-index.json');
  });

  it('keeps translated asset fallbacks under the deployment base URL', async () => {
    const urls: string[] = [];
    let translationMissing = false;
    const http = {
      get: (url: string) => {
        urls.push(url);
        if (url.includes('/hi/')) throw new Error('missing translation');
        if (url.includes('/stories/')) return of(mockArticles[0]);
        if (url.endsWith('articles.json')) return of(mockArticles.map(({ html, ...summary }) => summary));
        return of(mockIndex);
      },
    };
    const locale = {
      language: 'hi',
      generatedAssetsBase: '/indianhistory/assets/generated/',
      navigation: { worldHistory: 'World History' },
      translationAvailable: { set: (value: boolean) => { translationMissing = !value; } },
    };
    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: LocaleService, useValue: locale },
      ],
    });
    const localizedService = runInInjectionContext(injector, () => new ArticleService());
    await localizedService.whenReady();
    await localizedService.getArticle(mockArticles[0].slug);
    await localizedService.search('Paleolithic');

    expect(translationMissing).toBeTruthy();
    expect(urls).toEqual([
      '/indianhistory/assets/generated/hi/articles.json',
      '/indianhistory/assets/generated/articles.json',
      '/indianhistory/assets/generated/stories/attirampakkam-acheulean-stone-tools.json',
      '/indianhistory/assets/generated/search-index.json',
    ]);
  });

  it('reveals world history only when an event has a detailed article', async () => {
    await service.whenReady();
    expect(service.hasWorldHistoryStories()).toBeFalsy();
    (service as any).articles.set([
      { ...mockArticles[0], slug: 'agriculture', period: 'world-history', eventDate: '10,000 BCE', timelineOrder: 1 },
    ]);
    expect(service.hasWorldHistoryStories()).toBeFalsy();
    (service as any).articles.set([
      { ...mockArticles[0], slug: 'agriculture', period: 'world-history', eventDate: '10,000 BCE', timelineOrder: 1 },
      { ...mockArticles[0], slug: 'farming-life', relatedTo: 'agriculture' },
    ]);
    expect(service.hasWorldHistoryStories()).toBeTruthy();
  });
});
