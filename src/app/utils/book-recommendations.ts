import { ArticleSummary } from '../models/article.model';
import { RecommendedBook } from '../models/book.model';
import { booksForMode } from '../data/recommended-books';

export interface PageBookRecommendations {
  highlighted: RecommendedBook | null;
  related: RecommendedBook[];
  below: RecommendedBook[];
}

export function getPageBookRecommendations(article: ArticleSummary | null, isDevMode: boolean): PageBookRecommendations {
  const availableBooks = booksForMode(isDevMode);
  const related = article
    ? availableBooks.filter(book => new Set(article.books).has(book.isbn10))
    : [];
  const highlighted = related[0] ?? availableBooks[0] ?? null;
  const source = related.length ? related : availableBooks;
  const different = source.filter(book => book.isbn10 !== highlighted?.isbn10);
  const fallback = availableBooks.filter(book =>
    book.isbn10 !== highlighted?.isbn10 && !different.some(item => item.isbn10 === book.isbn10)
  );
  const below = [...different, ...fallback].slice(0, 2);
  return { highlighted, related, below };
}
