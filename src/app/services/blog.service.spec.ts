import { Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { BlogService } from './blog.service';
import { LocaleService } from '../i18n/locale.service';
import { BlogPost } from '../models/blog.model';
import { DevModeService } from './dev-mode.service';

describe('BlogService', () => {
  let service: BlogService;
  let requestedUrls: string[];
  const devMode = { isDevMode: signal(false) };
  const samplePosts: BlogPost[] = [
    {
      slug: 'welcome-to-indian-history',
      title: 'Welcome to India History',
      excerpt: 'Introduction to our digital history platform.',
      html: '<p>Welcome!</p>',
      publishedAt: '2026-03-01',
      tags: ['Introduction'],
    },
    {
      slug: 'archaeological-methods',
      title: 'Dating and Stratigraphy in Archaeology',
      excerpt: 'How modern science dates prehistoric sites.',
      html: '<p>Luminescence dating etc.</p>',
      publishedAt: '2026-03-10',
      tags: ['Science', 'Archaeology'],
    },
  ];
  const drafts = [
    { ...samplePosts[0], title: 'Rewritten English draft', draft: true },
    { ...samplePosts[0], slug: 'new-draft', title: 'Unpublished post', draft: true },
  ];

  beforeEach(() => {
    requestedUrls = [];
    devMode.isDevMode.set(false);
    const mockHttp = {
      get: (url: string) => {
        requestedUrls.push(url);
        return of(url.endsWith('blog-drafts.json') ? drafts : samplePosts);
      },
    };

    const mockLocale = {
      language: 'en',
      generatedAssetsBase: '/indianhistory/assets/generated/',
      translationAvailable: { set: () => {} },
    };

    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: LocaleService, useValue: mockLocale },
        { provide: DevModeService, useValue: devMode },
      ],
    });

    service = runInInjectionContext(injector, () => new BlogService());
    (service as any).posts.set(samplePosts);
  });

  it('should retrieve blog post by slug', () => {
    const post = service.getBySlug('welcome-to-indian-history');
    expect(post).toBeDefined();
    expect(post?.title).toBe('Welcome to India History');

    const notFound = service.getBySlug('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('should expose allPosts signal', () => {
    const posts = service.allPosts();
    expect(posts.length).toBe(2);
    expect(posts[1].slug).toBe('archaeological-methods');
  });

  it('loads blog data under the deployment base URL', async () => {
    await service.whenReady();
    expect(requestedUrls).toEqual(['/indianhistory/assets/generated/blogs.json']);
  });

  it('overlays matching drafts and includes new drafts only in English dev mode', async () => {
    devMode.isDevMode.set(true);
    await service.whenReady();
    expect(service.getBySlug(samplePosts[0].slug)?.title).toBe('Rewritten English draft');
    expect(service.getBySlug('new-draft')?.draft).toBeTruthy();
    expect(service.allPosts().length).toBe(3);
    expect(requestedUrls).toContain('/indianhistory/assets/generated/blog-drafts.json');

    devMode.isDevMode.set(false);
    expect(service.getBySlug(samplePosts[0].slug)?.title).toBe(samplePosts[0].title);
    expect(service.getBySlug('new-draft')).toBeUndefined();
    expect(service.allPosts().length).toBe(2);

    devMode.isDevMode.set(true);
    await service.whenReady();
    expect(requestedUrls.filter(url => url.endsWith('blog-drafts.json')).length).toBe(1);
  });

  it('keeps localized pages on their published version in dev mode', async () => {
    const urls: string[] = [];
    devMode.isDevMode.set(true);
    const injector = Injector.create({ providers: [
      { provide: HttpClient, useValue: { get: (url: string) => { urls.push(url); return of(samplePosts); } } },
      { provide: LocaleService, useValue: { language: 'hi', generatedAssetsBase: '/assets/generated/' } },
      { provide: DevModeService, useValue: devMode },
    ] });
    const localizedService = runInInjectionContext(injector, () => new BlogService());
    await localizedService.whenReady();
    expect(urls).toEqual(['/assets/generated/hi/blogs.json']);
    expect(localizedService.getBySlug(samplePosts[0].slug)?.title).toBe(samplePosts[0].title);
  });

  it('keeps published posts available if the draft asset is unavailable', async () => {
    devMode.isDevMode.set(true);
    const injector = Injector.create({ providers: [
      { provide: HttpClient, useValue: { get: (url: string) => url.endsWith('blog-drafts.json')
        ? throwError(() => new Error('missing draft asset')) : of(samplePosts) } },
      { provide: LocaleService, useValue: { language: 'en', generatedAssetsBase: '/assets/generated/' } },
      { provide: DevModeService, useValue: devMode },
    ] });
    const previewService = runInInjectionContext(injector, () => new BlogService());
    await previewService.whenReady();
    expect(previewService.allPosts().length).toBe(samplePosts.length);
    expect(previewService.getBySlug(samplePosts[0].slug)).toEqual(samplePosts[0]);
    expect(previewService.getBySlug(samplePosts[1].slug)).toEqual(samplePosts[1]);
  });
});
