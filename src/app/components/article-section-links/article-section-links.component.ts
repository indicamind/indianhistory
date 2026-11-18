import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleSummary } from '../../models/article.model';
import { BlogPost } from '../../models/blog.model';
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
  readonly article = input<ArticleSummary | null>(null);
  readonly blog = input<BlogPost | null>(null);
  readonly links = computed(() => {
    const blog = this.blog();
    if (blog) return this.periods.getSectionsForBlog(blog);
    const article = this.article();
    return article ? this.periods.getSectionsForArticle(article) : [];
  });
}
