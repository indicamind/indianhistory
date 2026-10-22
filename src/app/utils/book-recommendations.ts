import { RecommendedBook } from '../models/book.model';
import { booksForMode } from '../data/recommended-books';

export interface PageBookRecommendations {
  highlighted: RecommendedBook | null;
  related: RecommendedBook[];
  below: RecommendedBook[];
}

export function getAssignedBookRecommendations(
  content: { books?: string[] } | null,
  isDevMode: boolean,
  random: () => number = Math.random,
): PageBookRecommendations {
  const availableBooks = booksForMode(isDevMode);
  const assigned = new Set(content?.books ?? []);
  const related = availableBooks.filter(book => assigned.has(book.isbn10));
  const shuffled = [...related];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { highlighted: shuffled[0] ?? null, related, below: shuffled.slice(1, 3) };
}

export function getPageBookRecommendations(
  content: { books?: string[] } | null,
  isDevMode: boolean,
  random: () => number = Math.random,
): PageBookRecommendations {
  const availableBooks = booksForMode(isDevMode);
  const selection = getAssignedBookRecommendations(content, isDevMode, random);
  const { related } = selection;
  const highlighted = selection.highlighted ?? availableBooks[0] ?? null;
  const source = related.length ? selection.below : availableBooks;
  const different = source.filter(book => book.isbn10 !== highlighted?.isbn10);
  const fallback = availableBooks.filter(book =>
    book.isbn10 !== highlighted?.isbn10 && !different.some(item => item.isbn10 === book.isbn10)
  );
  const below = [...different, ...fallback].slice(0, 2);
  return { highlighted, related, below };
}
