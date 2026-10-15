import { Injector, runInInjectionContext, signal } from '@angular/core';
import { MustReadComponent } from './must-read.component';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { recommendedBooks } from '../../data/recommended-books';

describe('MustReadComponent', () => {
  let component: MustReadComponent;
  let isDevMode: ReturnType<typeof signal<boolean>>;

  beforeEach(() => {
    isDevMode = signal(false);
    const mockLocale = {
      language: 'en',
      translate: (s: string) => s,
      format: (s: string) => s,
    };

    const injector = Injector.create({
      providers: [
        { provide: LocaleService, useValue: mockLocale },
        { provide: DevModeService, useValue: { isDevMode } },
      ],
    });

    component = runInInjectionContext(injector, () => new MustReadComponent());
  });

  it('should initialize with default filter values and initial page size of 24', () => {
    expect(component.query()).toBe('');
    expect(component.category()).toBe('all');
    expect(component.linkFilter()).toBe('all');
    expect(component.visibleCount()).toBe(24);
    expect(component.catalogueBooks().length).toBeGreaterThan(0);
    expect(component.visibleBooks().length).toBeLessThanOrEqual(24);
  });

  it('should update query filter and reset visible count', () => {
    isDevMode.set(true);
    component.loadMore();
    expect(component.visibleCount()).toBe(48);

    component.updateFilter('query', 'Thapar');
    expect(component.query()).toBe('Thapar');
    expect(component.visibleCount()).toBe(24);
  });

  it('should update category and linkFilter filters', () => {
    component.updateFilter('category', 'Society & culture');
    expect(component.category()).toBe('Society & culture');

    component.updateFilter('linkFilter', 'affiliate');
    expect(component.linkFilter()).toBe('affiliate');
  });

  it('should reset all filters and reset visible count back to 24', () => {
    component.updateFilter('query', 'something');
    component.updateFilter('category', 'Ancient');
    component.updateFilter('linkFilter', 'pending');
    component.loadMore();

    component.resetFilters();
    expect(component.query()).toBe('');
    expect(component.category()).toBe('all');
    expect(component.linkFilter()).toBe('all');
    expect(component.visibleCount()).toBe(24);
  });

  it('should load more books when loadMore is called', () => {
    isDevMode.set(true);
    const initialVisible = component.visibleBooks().length;
    component.loadMore();
    expect(component.visibleCount()).toBe(48);
    expect(component.visibleBooks().length).toBeGreaterThanOrEqual(initialVisible);
  });

  it('should compute hasMore properly', () => {
    if (component.filteredBooks().length > 24) {
      expect(component.hasMore()).toBeTruthy();
    }
  });

  it('shows only affiliated books publicly and includes pending books in dev mode', () => {
    expect(component.catalogueBooks().every(book => !!book.affiliateUrl)).toBeTruthy();
    const publicCount = component.catalogueBooks().length;
    component.linkFilter.set('pending');
    expect(component.filteredBooks().length).toBe(publicCount);
    isDevMode.set(true);
    expect(component.catalogueBooks().length).toBe(recommendedBooks.length);
    expect(component.filteredBooks().length).toBeGreaterThan(0);
    expect(component.filteredBooks().every(book => !book.affiliateUrl)).toBeTruthy();
  });
});
