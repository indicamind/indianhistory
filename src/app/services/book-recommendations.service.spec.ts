import { BookRecommendationsService } from './book-recommendations.service';
import { ArticleSummary } from '../models/article.model';
import { recommendedBooks } from '../data/recommended-books';
import { BlogPost } from '../models/blog.model';

describe('BookRecommendationsService', () => {
  it('shares a stable blog draw across placements, separately from articles with the same slug', () => {
    const service = new BookRecommendationsService();
    const books = ['0349122385', '935699322X', '0143330802'];
    const blog = { slug: 'ashoka', books } as BlogPost;
    const sidebar = service.forBlog(blog, false);
    expect(service.forBlog({ ...blog, books: [...books] }, false)).toBe(sidebar);
    const chosen = [sidebar.highlighted!, ...sidebar.below].map(book => book.isbn10);
    expect(new Set(chosen).size).toBe(3);
    expect(chosen.every(isbn => books.includes(isbn))).toBeTruthy();
    expect(service.forArticle({ slug: blog.slug, books } as ArticleSummary, false)).not.toBe(sidebar);
    expect(new BookRecommendationsService().forBlog(blog, false)).not.toBe(sidebar);
  });

  it('shares one stable draw between the article summary and detail placements', () => {
    const service = new BookRecommendationsService();
    const article = {
      slug: 'ashoka-edicts',
      books: ['0349122385', '935699322X', '0143330802'],
    } as ArticleSummary;
    const sidebar = service.forArticle(article, false);
    const detail = service.forArticle({ ...article, books: [...article.books] }, false);
    expect(detail).toBe(sidebar);
    expect(detail.below.some(book => book.isbn10 === sidebar.highlighted?.isbn10)).toBeFalsy();
    expect(new Set([sidebar.highlighted!, ...detail.below].map(book => book.isbn10)).size).toBe(3);

    // A page refresh creates a new root service and therefore a fresh draw.
    expect(new BookRecommendationsService().forArticle(article, false)).not.toBe(sidebar);
  });

  it('keeps public and dev selections separate and redraws when assigned books change', () => {
    const service = new BookRecommendationsService();
    const publicBook = recommendedBooks.find(book => !!book.affiliateUrl)!;
    const pending = recommendedBooks.find(book => !book.affiliateUrl)!;
    const article = { slug: 'test', books: [publicBook.isbn10, pending.isbn10] } as ArticleSummary;
    const publicDraw = service.forArticle(article, false);
    expect(publicDraw.related.length).toBe(1);
    expect(service.forArticle(article, true).related.length).toBe(2);
    const updated = service.forArticle({ ...article, books: ['0349122385'] }, false);
    expect(updated).not.toBe(publicDraw);
    expect(updated.highlighted?.isbn10).toBe('0349122385');
  });
});
