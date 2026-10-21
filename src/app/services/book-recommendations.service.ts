import { Injectable } from '@angular/core';
import { ArticleSummary } from '../models/article.model';
import { getPageBookRecommendations, PageBookRecommendations } from '../utils/book-recommendations';

@Injectable({ providedIn: 'root' })
export class BookRecommendationsService {
  // Both article placements share a draw for this page load. A refresh creates
  // a new service, so every assigned book gets another chance to be selected.
  private readonly selections = new Map<string, PageBookRecommendations>();

  forArticle(article: ArticleSummary | null, isDevMode: boolean): PageBookRecommendations {
    if (!article) return getPageBookRecommendations(null, isDevMode);
    const key = JSON.stringify([article.slug, article.books, isDevMode]);
    let selection = this.selections.get(key);
    if (!selection) {
      selection = getPageBookRecommendations(article, isDevMode);
      this.selections.set(key, selection);
    }
    return selection;
  }
}
