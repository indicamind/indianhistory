import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BlogDetailComponent } from './blog-detail.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';
import { LocaleService } from '../../i18n/locale.service';
import { BookRecommendationsService } from '../../services/book-recommendations.service';
import { DevModeService } from '../../services/dev-mode.service';
import { PageViewService } from '../../services/page-view.service';

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  let recordedSlugs: string[];
  const samplePost: BlogPost = {
    slug: 'post-1',
    title: 'Post 1',
    excerpt: 'Excerpt',
    html: '<p><a href="/article/ashoka-major-rock-edict-13">Edict XIII</a> <a href="https://example.com/source">Source</a></p>',
    publishedAt: '2026-01-01',
    tags: [],
    books: ['0349122385', '935699322X', '0143330802'],
  };

  beforeEach(() => {
    recordedSlugs = [];
    const mockRoute = {
      queryParamMap: of({ get: () => null }),
      paramMap: of({
        get: (key: string) => (key === 'slug' ? 'post-1' : null),
      }),
    };

    const mockDestroyRef = {
      onDestroy: () => () => {},
    };

    const mockBlogs = {
      whenReady: async () => {},
      getBySlug: (slug: string) => (slug === 'post-1' ? samplePost : undefined),
    };

    const mockSanitizer = {
      bypassSecurityTrustHtml: (html: string) => html,
    };

    const injector = Injector.create({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DestroyRef, useValue: mockDestroyRef },
        { provide: BlogService, useValue: mockBlogs },
        { provide: PageViewService, useValue: { record: (slug: string) => recordedSlugs.push(slug) } },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: DOCUMENT, useValue: document },
        { provide: LocaleService, useValue: { language: 'hi', translate: (source: string) => source } },
        BookRecommendationsService,
        { provide: DevModeService, useValue: { isDevMode: () => false } },
      ],
    });

    component = runInInjectionContext(injector, () => new BlogDetailComponent());
  });

  it('should initialize with loading true', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.post()).toBeNull();
  });

  it('should load blog post on ngOnInit', async () => {
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(component.loading()).toBeFalsy();
    expect(component.post()?.title).toBe('Post 1');
    expect(recordedSlugs).toEqual(['post-1']);
    expect(String(component.html())).toContain('href="/hi/article/ashoka-major-rock-edict-13"');
    expect(String(component.html())).toContain('href="https://example.com/source"');
    expect(component.bottomBooks().length).toBe(2);
    expect(component.bottomBooks().every(book => samplePost.books!.includes(book.isbn10))).toBeTruthy();
  });

  it('does not count blog drafts', async () => {
    samplePost.draft = true;
    try {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(recordedSlugs).toEqual([]);
    } finally {
      delete samplePost.draft;
    }
  });

  it('renders intact content parts around two assigned book placements while retaining image buttons', async () => {
    const original = samplePost.html;
    const first = '<h3>First comparison</h3><div class="blog-comparison"><figure><img src="ancient.jpg" alt="Ancient object"></figure><figure><img src="later.jpg" alt="Later object"></figure></div><p>First explanation.</p>';
    const middle = '<h3>Second comparison</h3><p>Second explanation.</p>';
    const last = '<h3>Third comparison</h3><p>Third explanation.</p>';
    samplePost.html = first + middle + last;
    samplePost.bookInsertionOffsets = [first.length, first.length + middle.length];
    try {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));
      const parts = component.htmlParts().map(String);
      expect(parts.length).toBe(3);
      expect(parts[0]).toContain('First explanation.');
      expect(parts[0]).toContain('blog-image-trigger');
      expect(parts[1]).toBe(middle);
      expect(parts[2]).toBe(last);
      expect(component.bottomBooks().length).toBe(2);
    } finally {
      samplePost.html = original;
      delete samplePost.bookInsertionOffsets;
    }
  });
});
