import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { supportsViewCounting } from '../config/firebase.config';
import { DevModeService } from './dev-mode.service';

export type ArticleVote = 'up' | 'down' | null;
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
  private readonly remembered = new Map<string, ArticleVote>();
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
    const key = this.key(slug);
    if (this.remembered.has(key)) return this.remembered.get(key)!;
    try {
      const storage = this.document.defaultView?.localStorage;
      if (storage) {
        const vote = storage.getItem(key);
        return vote === 'up' || vote === 'down' ? vote : null;
      }
    } catch { /* Keep working when browser storage is blocked. */ }
    return this.remembered.get(key) ?? null;
  }

  async save(slug: string, vote: ArticleVote): Promise<void> {
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
    this.remembered.set(key, vote);
    try {
      const storage = this.document.defaultView?.localStorage;
      if (vote === null) storage?.removeItem(key);
      else storage?.setItem(key, vote);
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
