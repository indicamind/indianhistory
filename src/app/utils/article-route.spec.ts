import { articleRoute } from './article-route';

describe('articleRoute', () => {
  it('uses the regular article URL for a World History child article', () => {
    expect(articleRoute({ slug: 'a-gradual-transition-to-agriculture', period: 'world-history', relatedTo: 'the-beginnings-of-agriculture' }))
      .toEqual(['/article', 'a-gradual-transition-to-agriculture']);
  });

  it('keeps the World History URL for an overview article', () => {
    expect(articleRoute({ slug: 'the-beginnings-of-agriculture', period: 'world-history' }))
      .toEqual(['/worldhistory', 'the-beginnings-of-agriculture']);
  });
});
