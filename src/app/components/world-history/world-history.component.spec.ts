import { Injector, runInInjectionContext, signal } from '@angular/core';
import { WorldHistoryComponent } from './world-history.component';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleService } from '../../services/article.service';

describe('WorldHistoryComponent', () => {
  let component: WorldHistoryComponent;

  beforeEach(() => {
    const mockLocale = {
      translate: (s: string) => `[TR] ${s}`,
    };
    const articles = signal([
      { slug: 'second', period: 'world-history', eventDate: '2000', timelineOrder: 2, title: 'Second', excerpt: 'Second summary' },
      { slug: 'indian', period: 'modern', eventDate: undefined, timelineOrder: undefined, title: 'Indian', excerpt: 'Indian summary' },
      { slug: 'first', period: 'world-history', eventDate: '1000', timelineOrder: 1, title: 'First', excerpt: 'First summary' },
      { slug: 'third', period: 'world-history', eventDate: '3000', timelineOrder: 3, title: 'Third', excerpt: 'Third summary' },
      { slug: 'fourth', period: 'world-history', eventDate: '4000', timelineOrder: 4, title: 'Fourth', excerpt: 'Fourth summary' },
      { slug: 'fifth', period: 'world-history', eventDate: '5000', timelineOrder: 5, title: 'Fifth', excerpt: 'Fifth summary' },
    ]);

    const injector = Injector.create({
      providers: [
        { provide: LocaleService, useValue: mockLocale },
        { provide: ArticleService, useValue: { allArticles: articles.asReadonly() } },
      ],
    });

    component = runInInjectionContext(injector, () => new WorldHistoryComponent());
  });

  it('uses ordered world history stories from the article service', () => {
    expect(component.events().map(event => event.slug)).toEqual(['first', 'second', 'third', 'fourth', 'fifth']);
  });

  it('shows four events initially and all events when expanded', () => {
    expect(component.visibleEvents().length).toBe(4);
    component.expanded.set(true);
    expect(component.visibleEvents().length).toBe(component.events().length);
    component.expanded.set(false);
    expect(component.visibleEvents().length).toBe(4);
  });
});
