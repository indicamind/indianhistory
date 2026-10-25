import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { supportsViewCounting } from '../config/firebase.config';
import { DevModeService } from './dev-mode.service';

export type ArticleVote = 'up' | 'down' | null;
export interface SavedArticleReaction { vote: 'up' | 'down'; expiresAt: number }
export const LOCAL_REACTION_LIFETIME = 7 * 24 * 60 * 60 * 1000;
export const REACTION_CLOCK = new InjectionToken<() => number>('REACTION_CLOCK', {
  providedIn: 'root', factory: () => () => Date.now(),
});
export function activeLocalVote(reaction: SavedArticleReaction | null, now: number): ArticleVote {
  return reaction && reaction.expiresAt > now ? reaction.vote : null;
}
export interface ReactionRequest { slug: string; voterId: string; vote: ArticleVote }
type Writer = (request: ReactionRequest) => Promise<void>;
export const REACTION_WRITER_LOADER = new InjectionToken<() => Promise<Writer>>('REACTION_WRITER_LOADER', {
  providedIn: 'root',
  factory: () => () => import('./article-reaction-client').then(client => client.createReactionWriter()),
});

@Injectable({ providedIn: 'root' })
export class ArticleReactionService {
  private readonly document = inject(DOCUMENT);
  private readonly devMode = inject(DevModeService);
  private readonly loadWriter = inject(REACTION_WRITER_LOADER);
  private readonly now = inject(REACTION_CLOCK);
  private readonly remembered = new Map<string, SavedArticleReaction | null>();
  private writer?: Promise<Writer>;
  private voterId?: string;

  private get preview(): boolean {
    const href = this.document.location?.href;
    return this.devMode.isDevMode() || !href || !supportsViewCounting(new URL(href));
  }

  private key(slug: string): string {
    return `${this.preview ? 'ih_preview_reaction' : 'ih_article_reaction'}:${slug}`;
  }

  choice(slug: string): ArticleVote {
    return this.saved(slug)?.vote ?? null;
  }

  saved(slug: string): SavedArticleReaction | null {
    const key = this.key(slug);
    if (this.remembered.has(key)) return this.remembered.get(key)!;
    try {
      const raw = this.document.defaultView?.localStorage.getItem(key);
      if (raw === 'up' || raw === 'down') {
        // Give existing saved choices a single seven-day display window.
        const migrated: SavedArticleReaction = { vote: raw, expiresAt: this.now() + LOCAL_REACTION_LIFETIME };
        this.remember(key, migrated);
        return migrated;
      }
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && (saved.vote === 'up' || saved.vote === 'down') &&
          Number.isSafeInteger(saved.expiresAt) && saved.expiresAt >= 0) {
        return { vote: saved.vote, expiresAt: saved.expiresAt };
      }
    } catch { /* Keep working when browser storage is blocked. */ }
    return null;
  }

  async save(slug: string, vote: ArticleVote): Promise<SavedArticleReaction | null> {
    const key = this.key(slug);
    if (!this.preview) {
      const voterId = this.browserId();
      this.writer ??= this.loadWriter().catch(error => {
        this.writer = undefined;
        throw error;
      });
      const write = await this.writer;
      // Dev mode may change while the SDK is loading.
      if (this.preview) throw new Error('Voting mode changed. Please try again.');
      await write({ slug, voterId, vote });
    }
    const saved = vote === null ? null : { vote, expiresAt: this.now() + LOCAL_REACTION_LIFETIME };
    this.remember(key, saved);
    return saved;
  }

  private remember(key: string, saved: SavedArticleReaction | null): void {
    this.remembered.set(key, saved);
    try {
      const storage = this.document.defaultView?.localStorage;
      if (saved === null) storage?.removeItem(key);
      else storage?.setItem(key, JSON.stringify(saved));
    } catch { /* The current session still remembers the registered vote. */ }
  }

  private browserId(): string {
    if (this.voterId) return this.voterId;
    let storage: Storage | undefined;
    let saved: string | null = null;
    try {
      storage = this.document.defaultView?.localStorage;
      saved = storage?.getItem('ih_reaction_voter') ?? null;
    } catch { /* Use memory. */ }
    this.voterId = saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)
      ? saved : this.document.defaultView!.crypto.randomUUID();
    try { storage?.setItem('ih_reaction_voter', this.voterId); } catch { /* Use memory. */ }
    return this.voterId;
  }
}
