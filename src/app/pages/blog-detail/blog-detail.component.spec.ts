import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BlogDetailComponent } from './blog-detail.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';
import { LocaleService } from '../../i18n/locale.service';

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  const samplePost: BlogPost = {
    slug: 'post-1',
    title: 'Post 1',
    excerpt: 'Excerpt',
    html: '<p><a href="/article/ashoka-major-rock-edict-13">Edict XIII</a> <a href="https://example.com/source">Source</a></p>',
    publishedAt: '2026-01-01',
    tags: [],
  };

  beforeEach(() => {
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
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: LocaleService, useValue: { language: 'hi' } },
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
    expect(String(component.html())).toContain('href="/hi/article/ashoka-major-rock-edict-13"');
    expect(String(component.html())).toContain('href="https://example.com/source"');
  });
});
