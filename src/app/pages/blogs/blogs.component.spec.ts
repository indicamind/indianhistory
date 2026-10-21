import { Injector, runInInjectionContext } from '@angular/core';
import { BlogsComponent } from './blogs.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';
import { LocaleService } from '../../i18n/locale.service';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  const samplePosts: BlogPost[] = [
    {
      slug: 'welcome',
      title: 'Welcome Post',
      excerpt: 'Intro',
      html: '<p>Content</p>',
      publishedAt: '2026-01-01',
      tags: [],
    },
  ];

  beforeEach(() => {
    const mockBlogService = {
      whenReady: async () => {},
      allPosts: () => samplePosts,
    };

    const injector = Injector.create({
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: LocaleService, useValue: { language: 'en' } },
      ],
    });

    component = runInInjectionContext(injector, () => new BlogsComponent());
  });

  it('should initialize with loading true and empty posts', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.posts().length).toBe(0);
  });

  it('should populate posts and finish loading on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.loading()).toBeFalsy();
    expect(component.posts().length).toBe(1);
    expect(component.posts()[0].slug).toBe('welcome');
  });
});
