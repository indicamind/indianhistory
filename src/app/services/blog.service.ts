import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BlogPost } from '../models/blog.model';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly devMode = inject(DevModeService);
  private readonly posts = signal<BlogPost[]>([]);
  private readonly drafts = signal<BlogPost[]>([]);
  private draftRequest: Promise<void> | undefined;
  private readonly ready = this.load();

  readonly allPosts = computed(() => {
    if (!this.devMode.isDevMode() || this.locale.language !== 'en') return this.posts();
    const posts = new Map(this.posts().map(post => [post.slug, post]));
    for (const draft of this.drafts()) posts.set(draft.slug, draft);
    return [...posts.values()].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  });

  async whenReady(): Promise<void> {
    await this.ready;
    if (this.devMode.isDevMode() && this.locale.language === 'en') {
      this.draftRequest ??= this.loadDrafts();
      await this.draftRequest;
    }
  }

  getBySlug(slug: string): BlogPost | undefined {
    return this.allPosts().find(post => post.slug === slug);
  }

  private async loadDrafts(): Promise<void> {
    try {
      this.drafts.set(await firstValueFrom(this.http.get<BlogPost[]>(`${this.locale.generatedAssetsBase}blog-drafts.json`)));
    } catch {
      // Older deployments may not have a draft asset yet.
      this.drafts.set([]);
    }
  }

  private async load(): Promise<void> {
    const base = this.locale.language === 'en' ? this.locale.generatedAssetsBase : `${this.locale.generatedAssetsBase}${this.locale.language}/`;
    try {
      this.posts.set(await firstValueFrom(this.http.get<BlogPost[]>(`${base}blogs.json`)));
    } catch (error) {
      if (this.locale.language === 'en') throw error;
      this.locale.translationAvailable.set(false);
      this.posts.set(await firstValueFrom(this.http.get<BlogPost[]>(`${this.locale.generatedAssetsBase}blogs.json`)));
    }
  }
}
