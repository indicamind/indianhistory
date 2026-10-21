import { Injector, runInInjectionContext, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { ArticleService } from './services/article.service';
import { DevModeService } from './services/dev-mode.service';
import { LocaleService } from './i18n/locale.service';
import { PeriodsService } from './services/periods.service';
import { BlogService } from './services/blog.service';
import { recommendedBooks } from './data/recommended-books';
import { BookRecommendationsService } from './services/book-recommendations.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let isDevMode: ReturnType<typeof signal<boolean>>;
  let mockArticles: any;

  beforeEach(() => {
    isDevMode = signal(false);
    const mockViewportScroller = {
      setOffset: () => {},
    };
    const mockRouter = {
      url: '/',
      navigated: true,
      events: {
        subscribe: () => ({ unsubscribe: () => {} }),
      },
    };
    mockArticles = {
      whenReady: async () => {},
      getBySlug: () => null,
      hasWorldHistoryStories: () => false,
    };
    const mockDevMode = {
      isDevMode,
    };
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      translateDocument: () => {},
    };

    const injector = Injector.create({
      providers: [
        { provide: ViewportScroller, useValue: mockViewportScroller },
        { provide: Router, useValue: mockRouter },
        { provide: ArticleService, useValue: mockArticles },
        BookRecommendationsService,
        { provide: DevModeService, useValue: mockDevMode },
        { provide: LocaleService, useValue: mockLocale },
        { provide: PeriodsService, useValue: {} },
        { provide: BlogService, useValue: { allPosts: () => [] } },
      ],
    });

    component = runInInjectionContext(injector, () => new AppComponent());
  });

  it('should initialize with menu closed', () => {
    expect(component.menuOpen()).toBeFalsy();
  });

  it('hides World History navigation when there are no articles, including in dev mode', () => {
    isDevMode.set(true);
    expect(component.showWorldHistory()).toBeFalsy();
  });

  it('should toggle menu open and closed', () => {
    component.toggleMenu();
    expect(component.menuOpen()).toBeTruthy();

    component.toggleMenu();
    expect(component.menuOpen()).toBeFalsy();
  });

  it('should explicitly close menu when closeMenu is called', () => {
    component.toggleMenu();
    expect(component.menuOpen()).toBeTruthy();

    component.closeMenu();
    expect(component.menuOpen()).toBeFalsy();
  });

  it('replaces a pending sidebar book when dev mode is switched off', () => {
    const pending = recommendedBooks.find(book => !book.affiliateUrl)!;
    isDevMode.set(true);
    component.highlightedBook.set(pending);
    expect(component.displayedBook()?.isbn10).toBe(pending.isbn10);
    isDevMode.set(false);
    expect(component.displayedBook()?.affiliateUrl).toBeDefined();
    expect(component.excludedBookIsbns()).toContain(component.displayedBook()?.isbn10);
  });

  it('features an assigned Ashoka book and keeps three distinct placements', async () => {
    const books = ['0349122385', '935699322X', '0143330802'];
    mockArticles.getBySlug = (slug: string) => ({ slug, books });

    for (const slug of ['ashoka-edicts', 'ashoka-major-rock-edict-1']) {
      await (component as any).updateBookPlacement(`/hi/article/${slug}?fromPeriod=mauryan`);
      expect(books).toContain(component.displayedBook()?.isbn10);
      expect(component.displayedBook()?.affiliateUrl).toContain('tag=indiahistor01-21');
      expect([...component.excludedBookIsbns()].sort()).toEqual([...books].sort());
    }
  });
});
