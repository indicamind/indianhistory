import { Injectable } from '@angular/core';
import { ArticleSummary } from '../models/article.model';
import { BlogPost } from '../models/blog.model';
import { getAssignedBookRecommendations, getPageBookRecommendations, PageBookRecommendations } from '../utils/book-recommendations';

@Injectable({ providedIn: 'root' })
export class BookRecommendationsService {
  // The sidebar and inline placements share a draw for this page load. A refresh creates
  // a new service, so every assigned book gets another chance to be selected.
  private readonly selections = new Map<string, PageBookRecommendations>();

  forArticle(article: ArticleSummary | null, isDevMode: boolean): PageBookRecommendations {
    return this.forContent('article', article, isDevMode);
  }

  forBlog(blog: BlogPost | null, isDevMode: boolean): PageBookRecommendations {
    return this.forContent('blog', blog, isDevMode);
  }

  private forContent(kind: 'article' | 'blog', content: { slug: string; books?: string[] } | null, isDevMode: boolean): PageBookRecommendations {
    const select = kind === 'blog' ? getAssignedBookRecommendations : getPageBookRecommendations;
    if (!content) return select(null, isDevMode);
    const key = JSON.stringify([kind, content.slug, content.books, isDevMode]);
    let selection = this.selections.get(key);
    if (!selection) {
      selection = select(content, isDevMode);
      this.selections.set(key, selection);
    }
    return selection;
  }
}
