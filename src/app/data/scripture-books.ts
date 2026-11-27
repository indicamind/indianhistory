import { RecommendedBook } from '../models/book.model';

/** Affiliate short links rotated across Bhagavad Gita chapters and verse intervals. */
export const gitaAffiliateUrls = [
  'https://link.amazon/B0jcYVPdJ',
  'https://link.amazon/B0f5YAMZw',
  'https://link.amazon/B00cGx6Wl',
  'https://link.amazon/B0bOEw6Up',
  'https://link.amazon/B0aNdVXKq',
] as const;

export const GITA_BOOK_VERSE_INTERVAL = 30;

const gitaBookBase: RecommendedBook = {
  title: 'Bhagavad Gita As It Is',
  author: 'A. C. Bhaktivedanta Swami Prabhupada',
  description: 'An English translation and commentary on the Bhagavad Gita by A. C. Bhaktivedanta Swami Prabhupada.',
  amazonUrl: 'https://www.amazon.in/dp/B0D8BMZFSW',
  affiliateUrl: gitaAffiliateUrls[0],
  sourceUrl: 'https://www.bbt.org/book/en-bg',
  linkVerifiedOn: '2026-11-27',
  linkVerification: 'amazon',
  imageUrl: 'assets/media/books/bhagavad-gita-as-it-is.jpg',
  imageAlt: 'Cover of Bhagavad Gita As It Is by A. C. Bhaktivedanta Swami Prabhupada',
  format: 'Hardcover',
  isbn10: 'B0D8BMZFSW',
};

/** Returns the Gita book card with a rotated affiliate link for the given slot. */
export function gitaBooksForSlot(slot: number): RecommendedBook[] {
  const index = ((Math.trunc(slot) % gitaAffiliateUrls.length) + gitaAffiliateUrls.length) % gitaAffiliateUrls.length;
  return [{ ...gitaBookBase, affiliateUrl: gitaAffiliateUrls[index] }];
}

/** Book selected for the Scriptures library and Bhagavad Gita overview. */
export const gitaBooks: RecommendedBook[] = gitaBooksForSlot(0);
