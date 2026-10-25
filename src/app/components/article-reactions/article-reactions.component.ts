import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { ArticleSummary } from '../../models/article.model';
import { LocaleService } from '../../i18n/locale.service';
import { activeLocalVote, ArticleReactionService, ArticleVote, LOCAL_REACTION_LIFETIME, SavedArticleReaction } from '../../services/article-reaction.service';

@Component({
  selector: 'app-article-reactions',
  templateUrl: './article-reactions.component.html',
  styleUrl: './article-reactions.component.css',
})
export class ArticleReactionsComponent {
  readonly article = input.required<ArticleSummary>();
  readonly locale = inject(LocaleService);
  private readonly reactions = inject(ArticleReactionService);
  readonly vote = signal<ArticleVote>(null);
  readonly busy = signal(false);
  readonly error = signal(false);
  readonly submitted = signal(false);
  private readonly localVote = signal<ArticleVote>(null);
  readonly thumbsUp = computed(() => (this.article().thumbsUp ?? 0) + Number(this.localVote() === 'up'));
  readonly thumbsDown = computed(() => (this.article().thumbsDown ?? 0) + Number(this.localVote() === 'down'));
  private requestId = 0;
  private expiryTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.requestId++;
      clearTimeout(this.expiryTimer);
    });
    effect(() => {
      const slug = this.article().slug;
      this.requestId++;
      const saved = this.reactions.saved(slug);
      this.vote.set(saved?.vote ?? null);
      this.applyLocalVote(saved);
      this.busy.set(false);
      this.error.set(false);
      this.submitted.set(false);
    });
  }

  async react(choice: 'up' | 'down'): Promise<void> {
    if (this.busy()) return;
    const requestId = ++this.requestId;
    const slug = this.article().slug;
    const previous = this.vote();
    const previousSaved = this.reactions.saved(slug);
    const next = previous === choice ? null : choice;
    this.vote.set(next);
    this.applyLocalVote(next ? { vote: next, expiresAt: Date.now() + LOCAL_REACTION_LIFETIME } : null);
    this.busy.set(true);
    this.error.set(false);
    this.submitted.set(false);
    try {
      const saved = await this.reactions.save(slug, next);
      if (this.requestId === requestId) {
        this.applyLocalVote(saved);
        this.submitted.set(true);
      }
    } catch {
      if (this.requestId === requestId) {
        this.vote.set(previous);
        this.applyLocalVote(previousSaved);
        this.error.set(true);
      }
    } finally {
      if (this.requestId === requestId) this.busy.set(false);
    }
  }

  private applyLocalVote(saved: SavedArticleReaction | null): void {
    clearTimeout(this.expiryTimer);
    this.localVote.set(activeLocalVote(saved, Date.now()));
    if (saved && saved.expiresAt > Date.now()) {
      this.expiryTimer = setTimeout(() => this.applyLocalVote(saved),
        Math.min(saved.expiresAt - Date.now(), LOCAL_REACTION_LIFETIME));
    }
  }
}
