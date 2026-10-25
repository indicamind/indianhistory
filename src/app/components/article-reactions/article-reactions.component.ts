import { Component, effect, inject, input, signal } from '@angular/core';
import { ArticleSummary } from '../../models/article.model';
import { LocaleService } from '../../i18n/locale.service';
import { ArticleReactionService, ArticleVote } from '../../services/article-reaction.service';

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
  private requestId = 0;

  constructor() {
    effect(() => {
      const slug = this.article().slug;
      this.requestId++;
      this.vote.set(this.reactions.choice(slug));
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
    const next = previous === choice ? null : choice;
    this.vote.set(next);
    this.busy.set(true);
    this.error.set(false);
    this.submitted.set(false);
    try {
      await this.reactions.save(slug, next);
      if (this.requestId === requestId) this.submitted.set(true);
    } catch {
      if (this.requestId === requestId) {
        this.vote.set(previous);
        this.error.set(true);
      }
    } finally {
      if (this.requestId === requestId) this.busy.set(false);
    }
  }
}
