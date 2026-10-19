import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, input, signal } from '@angular/core';
import { booksForMode, recommendedBooks } from '../../data/recommended-books';
import { WebpPipe } from '../../pipes/webp.pipe';
import { filterBooks } from '../../utils/book-catalogue';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';

@Component({
  selector: 'app-must-read',
  imports: [WebpPipe],
  templateUrl: './must-read.component.html',
  styleUrl: './must-read.component.css',
})
export class MustReadComponent implements AfterViewInit, OnDestroy {
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  readonly presentation = input<'full' | 'bottom'>('full');
  readonly excludeIsbns = input<string[]>(recommendedBooks[0] ? [recommendedBooks[0].isbn10] : []);
  readonly query = signal('');
  readonly linkFilter = signal('all');
  readonly category = signal('all');
  readonly visibleCount = signal(24);
  readonly catalogueBooks = computed(() => {
    const excluded = this.presentation() === 'bottom' ? new Set(this.excludeIsbns()) : new Set<string>();
    return booksForMode(this.devMode.isDevMode()).filter(book => !excluded.has(book.isbn10));
  });
  readonly pendingCount = computed(() => this.catalogueBooks().filter(book => !book.affiliateUrl).length);
  readonly categories = computed(() => [...new Set(this.catalogueBooks().map(book => book.category).filter((category): category is string => !!category))].sort());
  readonly filteredBooks = computed(() => filterBooks(this.catalogueBooks(), {
    query: this.query(), category: this.category(), linkStatus: this.devMode.isDevMode() ? this.linkFilter() : 'all',
  }));
  readonly visibleBooks = computed(() => this.filteredBooks().slice(0, this.visibleCount()));
  readonly hasMore = computed(() => this.visibleBooks().length < this.filteredBooks().length);

  @ViewChild('loadMoreSentinel') private loadMoreSentinel?: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.loadMoreSentinel) return;
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) this.loadMore();
    }, { rootMargin: '700px 0px' });
    this.observer.observe(this.loadMoreSentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  updateFilter(field: 'query' | 'linkFilter' | 'category', value: string): void {
    this[field].set(value);
    this.visibleCount.set(24);
  }

  resetFilters(): void {
    this.query.set('');
    this.linkFilter.set('all');
    this.category.set('all');
    this.visibleCount.set(24);
  }

  loadMore(): void {
    this.visibleCount.update(count => Math.min(count + 24, this.filteredBooks().length));
  }
}
