import { DOCUMENT } from '@angular/common';
import { Injector, runInInjectionContext } from '@angular/core';
import { DevModeService } from './dev-mode.service';
import { ArticleReactionService, REACTION_WRITER_LOADER, ReactionRequest } from './article-reaction.service';

describe('Article reactions stored per browser', () => {
  const id = '12e45678-e89b-42d3-a456-426614174000';
  let storage: Map<string, string>;
  let document: any;
  let dev: boolean;
  let calls: ReactionRequest[];
  let fail: boolean;
  let loads: number;
  function service(): ArticleReactionService {
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: document },
      { provide: DevModeService, useValue: { isDevMode: () => dev } },
      { provide: REACTION_WRITER_LOADER, useValue: async () => {
        loads++;
        return async (request: ReactionRequest) => {
          calls.push(request);
          if (fail) throw new Error('Unavailable');
        };
      } },
    ] });
    return runInInjectionContext(injector, () => new ArticleReactionService());
  }
  beforeEach(() => {
    storage = new Map(); dev = false; calls = []; fail = false; loads = 0;
    document = { location: { href: 'https://www.indiahistory.info/article/mewar' }, defaultView: {
      crypto: { randomUUID: () => id },
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    } };
  });
  it('remembers successful votes after reload, switch and removal using the same ID', async () => {
    await service().save('mewar', 'up');
    const reloaded = service();
    expect(reloaded.choice('mewar')).toBe('up');
    await reloaded.save('mewar', 'down');
    expect(service().choice('mewar')).toBe('down');
    await reloaded.save('mewar', null);
    expect(service().choice('mewar')).toBeNull();
    expect(calls).toEqual(['up', 'down', null].map(vote => ({ slug: 'mewar', voterId: id, vote })));
  });
  it('preserves the saved choice after failure and allows retry', async () => {
    const reactions = service();
    await reactions.save('mewar', 'up');
    fail = true;
    let rejected = false;
    try { await reactions.save('mewar', 'down'); } catch { rejected = true; }
    expect(rejected).toBe(true);
    expect(reactions.choice('mewar')).toBe('up');
    fail = false;
    await reactions.save('mewar', 'down');
    expect(reactions.choice('mewar')).toBe('down');
  });
  it('keeps articles independent and ignores invalid stored choices', async () => {
    const reactions = service();
    storage.set('ih_article_reaction:ashoka', 'bad');
    await reactions.save('mewar', 'up');
    expect(reactions.choice('ashoka')).toBeNull();
    expect(reactions.choice('mewar')).toBe('up');
  });
  it('previews locally on localhost and in dev without loading Firebase or changing real votes', async () => {
    storage.set('ih_article_reaction:mewar', 'down');
    for (const href of ['http://localhost:4200/article/mewar', 'https://www.indiahistory.info/article/mewar']) {
      document.location.href = href;
      dev = href.startsWith('https');
      const reactions = service();
      await reactions.save('mewar', 'up');
      expect(reactions.choice('mewar')).toBe('up');
    }
    expect(loads).toBe(0);
    expect(storage.get('ih_article_reaction:mewar')).toBe('down');
  });
  it('handles blocked localStorage with an in-memory ID and choice', async () => {
    Object.defineProperty(document.defaultView, 'localStorage', { get: () => { throw new Error('Blocked'); } });
    const reactions = service();
    await reactions.save('mewar', 'up');
    expect(reactions.choice('mewar')).toBe('up');
    await reactions.save('ashoka', 'down');
    expect(calls.map(call => call.voterId)).toEqual([id, id]);
  });
  it('remembers a vote in memory when storage can be read but writes are blocked', async () => {
    document.defaultView.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
    const reactions = service();
    await reactions.save('mewar', 'up');
    expect(reactions.choice('mewar')).toBe('up');
    await reactions.save('mewar', null);
    expect(reactions.choice('mewar')).toBeNull();
  });
});
