import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleService } from '../../services/article.service';
import { DevModeService } from '../../services/dev-mode.service';
import { articleRoute } from '../../utils/article-route';

@Component({
  selector: 'app-world-history',
  imports: [RouterLink],
  templateUrl: './world-history.component.html',
  styleUrl: './world-history.component.css',
})
export class WorldHistoryComponent {
  readonly locale = inject(LocaleService);
  readonly articleRoute = articleRoute;
  private readonly articles = inject(ArticleService);
  private readonly devMode = inject(DevModeService);
  readonly expanded = signal(false);
  readonly events = computed(() => {
    const articles = this.articles.allArticles();
    const eventsWithArticles = new Set(articles.filter(article => article.relatedTo).map(article => article.relatedTo));
    return articles
      .filter(article => article.period === 'world-history' && article.eventDate && article.timelineOrder !== undefined &&
        (this.devMode.isDevMode() || eventsWithArticles.has(article.slug)))
      .sort((a, b) => a.timelineOrder! - b.timelineOrder!);
  });
  readonly initialEventCount = 4;
  readonly visibleEvents = computed(() => this.expanded() ? this.events() : this.events().slice(0, this.initialEventCount));
}
