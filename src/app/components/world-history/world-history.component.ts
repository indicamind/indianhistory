import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleService } from '../../services/article.service';
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
  readonly expanded = signal(false);
  readonly events = computed(() => this.articles.allArticles()
    .filter(article => article.period === 'world-history' && article.eventDate && article.timelineOrder !== undefined)
    .sort((a, b) => a.timelineOrder! - b.timelineOrder!));
  readonly initialEventCount = 4;
  readonly visibleEvents = computed(() => this.expanded() ? this.events() : this.events().slice(0, this.initialEventCount));
}
