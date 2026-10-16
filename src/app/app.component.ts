import { ViewportScroller } from '@angular/common';
import { Component, AfterViewInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MustReadComponent } from './components/must-read/must-read.component';
import { BookSidebarComponent } from './components/book-sidebar/book-sidebar.component';
import { ArticleService } from './services/article.service';
import { RecommendedBook } from './models/book.model';
import { getPageBookRecommendations } from './utils/book-recommendations';
import { booksForMode } from './data/recommended-books';
import { LocaleService } from './i18n/locale.service';
import { DevModeService } from './services/dev-mode.service';
import { PeriodsService } from './services/periods.service';
import { BlogService } from './services/blog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, MustReadComponent, BookSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly router = inject(Router);
  private readonly articles = inject(ArticleService);
  private readonly devMode = inject(DevModeService);
  private readonly periods = inject(PeriodsService);
  private readonly blogs = inject(BlogService);
  readonly locale = inject(LocaleService);
  readonly showTimeline = computed(() => this.periods.getTopLevel().some(period => this.periods.isVisiblePeriod(period.slug)));
  readonly showThemes = computed(() => this.periods.getThemes().some(theme => this.periods.isVisibleTheme(theme.slug)));
  readonly showEmpires = computed(() => this.periods.getEmpires().some(polity => this.periods.isVisiblePolity(polity.slug)));
  readonly showKingdoms = computed(() => this.periods.getRegionalKingdoms().some(polity => this.periods.isVisiblePolity(polity.slug)));
  readonly showPersonalities = computed(() => this.periods.getPersonalities().some(person => this.periods.isVisiblePersonality(person.slug)));
  readonly showWorldHistory = computed(() => this.devMode.isDevMode() || this.articles.hasWorldHistoryStories());
  readonly showBlogs = computed(() => this.devMode.isDevMode() || this.blogs.allPosts().length > 0);
  private readonly homeSections = new Set(['timeline', 'themes', 'empires', 'regional-kingdoms', 'personalities', 'world-history']);
  private lastPlacementUrl: string | null = null;
  private placementVersion = 0;
  readonly menuOpen = signal(false);
  readonly highlightedBook = signal<RecommendedBook | null>(null);
  private readonly storyBookIsbns = signal<string[]>([]);
  readonly displayedBook = computed(() => {
    const book = this.highlightedBook();
    if (this.devMode.isDevMode() || book?.affiliateUrl) return book;
    return booksForMode(false).find(candidate => !this.storyBookIsbns().includes(candidate.isbn10)) ?? null;
  });
  readonly excludedBookIsbns = computed(() => {
    const displayed = this.displayedBook();
    return [...new Set([...this.storyBookIsbns(), ...(displayed ? [displayed.isbn10] : [])])];
  });
  readonly isBookLibrary = signal(false);

  constructor() {
    void this.updateBookPlacement(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.setSectionScrollBehavior(event);
      } else if (event instanceof NavigationEnd) {
        void this.updateBookPlacement(event.urlAfterRedirects);
      }
    });
  }

  private setSectionScrollBehavior(event: NavigationStart): void {
    const currentPath = this.router.url.split(/[?#]/)[0];
    const nextPath = event.url.split(/[?#]/)[0];
    const fragment = event.url.split('#')[1] ?? '';
    const sameHomeSection = this.router.navigated
      && event.navigationTrigger === 'imperative'
      && currentPath === '/'
      && nextPath === '/'
      && this.homeSections.has(fragment);
    document.documentElement.classList.toggle('smooth-section-navigation', sameHomeSection);
  }

  ngAfterViewInit(): void {
    this.locale.translateDocument();
    // Set exact pixel height of the sticky header so that fragment navigation
    // (Timeline / Empires / Kingdoms links) scrolls the target just below the header
    // instead of hiding the section title behind it.
    this.viewportScroller.setOffset(() => [0, this.headerOffset()]);
    document.documentElement.style.setProperty('--header-height', `${this.headerOffset()}px`);
  }

  private headerOffset(): number {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    return header ? header.offsetHeight + 12 : 0;
  }

  private async updateBookPlacement(url: string): Promise<void> {
    if (this.lastPlacementUrl === url) return;
    this.lastPlacementUrl = url;
    const version = ++this.placementVersion;
    const path = url.split('?')[0].split('#')[0];
    this.isBookLibrary.set(path === '/books');
    let storyRecommendations: string[] = [];
    const articleMatch = path.match(/^\/article\/([^/]+)$/)
      ?? path.match(/^\/worldhistory\/(?:[^/]+\/)?([^/]+)$/);
    if (articleMatch) {
      await this.articles.whenReady();
      if (version !== this.placementVersion) return;
      const article = this.articles.getBySlug(decodeURIComponent(articleMatch[1])) ?? null;
      storyRecommendations = getPageBookRecommendations(article, this.devMode.isDevMode()).below.map(book => book.isbn10);
    }

    const nextBook = this.pickRandomBook(storyRecommendations);
    this.highlightedBook.set(nextBook);
    this.storyBookIsbns.set(storyRecommendations);
  }

  private pickRandomBook(excludedIsbns: string[]): RecommendedBook | null {
    const previousIsbn = this.highlightedBook()?.isbn10;
    const excluded = new Set([...excludedIsbns, ...(previousIsbn ? [previousIsbn] : [])]);
    const availableBooks = booksForMode(this.devMode.isDevMode());
    const choices = availableBooks.filter(book => !excluded.has(book.isbn10));
    if (choices.length) return choices[Math.floor(Math.random() * choices.length)];
    return availableBooks.find(book => !excludedIsbns.includes(book.isbn10)) ?? null;
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
