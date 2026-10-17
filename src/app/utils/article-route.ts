import { ArticleSummary } from '../models/article.model';

export function articleRoute(article: Pick<ArticleSummary, 'slug' | 'period' | 'relatedTo'>): string[] {
  if (article.period === 'world-history') {
    return article.relatedTo
      ? ['/article', article.slug]
      : ['/worldhistory', article.slug];
  }
  return ['/article', article.slug];
}
