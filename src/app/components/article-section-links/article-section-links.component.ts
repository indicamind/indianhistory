import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleSummary } from '../../models/article.model';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-article-section-links',
  imports: [RouterLink],
  templateUrl: './article-section-links.component.html',
  styleUrl: './article-section-links.component.css',
})
export class ArticleSectionLinksComponent {
  private readonly periods = inject(PeriodsService);
  readonly locale = inject(LocaleService);
  readonly article = input.required<ArticleSummary>();
  readonly links = computed(() => this.periods.getSectionsForArticle(this.article()));
}
