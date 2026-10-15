import { getPageBookRecommendations } from './book-recommendations';
import { Article } from '../models/article.model';
import { recommendedBooks } from '../data/recommended-books';

describe('BookRecommendations Utils - getPageBookRecommendations', () => {
  it('should return default recommendations when article is null', () => {
    const recs = getPageBookRecommendations(null, true);
    expect(recs.related.length).toBe(0);
    expect(recs.highlighted).toBe(recommendedBooks[0]);
    expect(recs.below.length).toBe(2);
    expect(recs.below[0].isbn10).not.toBe(recs.highlighted?.isbn10);
    expect(recs.below[1].isbn10).not.toBe(recs.highlighted?.isbn10);
  });

  it('should find related books when article contains book ISBNs', () => {
    const firstBook = recommendedBooks[0];
    const secondBook = recommendedBooks[1];
    const article: Article = {
      slug: 'test-article',
      title: 'Test Article',
      excerpt: 'Excerpt',
      html: '<p>Content</p>',
      publishedAt: '2026-01-01',
      tags: [],
      books: [firstBook.isbn10, secondBook.isbn10],
    };

    const recs = getPageBookRecommendations(article, true);
    expect(recs.related.length).toBe(2);
    expect(recs.related[0].isbn10).toBe(firstBook.isbn10);
    expect(recs.related[1].isbn10).toBe(secondBook.isbn10);
    expect(recs.highlighted?.isbn10).toBe(firstBook.isbn10);
    expect(recs.below.length).toBe(2);
    expect(recs.below[0].isbn10).toBe(secondBook.isbn10);
  });

  it('should fallback to general catalogue when article has empty book array', () => {
    const article: Article = {
      slug: 'empty-books-article',
      title: 'Empty Books',
      excerpt: 'Excerpt',
      html: '<p>Content</p>',
      publishedAt: '2026-01-01',
      tags: [],
      books: [],
    };

    const recs = getPageBookRecommendations(article, true);
    expect(recs.related.length).toBe(0);
    expect(recs.highlighted?.isbn10).toBe(recommendedBooks[0].isbn10);
    expect(recs.below.length).toBe(2);
  });

  it('uses affiliated fallback books when an article only recommends a pending book publicly', () => {
    const pending = recommendedBooks.find(book => !book.affiliateUrl)!;
    const article = { slug: 'test', title: 'Test', excerpt: '', tags: [], books: [pending.isbn10] } as Article;
    const publicPicks = getPageBookRecommendations(article, false);
    expect(publicPicks.related.length).toBe(0);
    expect(publicPicks.highlighted?.affiliateUrl).toBeDefined();
    expect(publicPicks.below.every(book => !!book.affiliateUrl)).toBeTruthy();
    expect(getPageBookRecommendations(article, true).related[0].isbn10).toBe(pending.isbn10);
  });
});
