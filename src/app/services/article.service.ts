import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Article, ArticleSummary, SearchEntry } from '../models/article.model';
import { LocaleService } from '../i18n/locale.service';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly articles = signal<ArticleSummary[]>([]);
  private searchIndex: Promise<SearchEntry[]> | null = null;
  private readonly storyRequests = new Map<string, Promise<Article>>();
  private contentBase = this.locale.generatedAssetsBase;
  private ready: Promise<void>;

  readonly allArticles = this.articles.asReadonly();

  constructor() {
    this.ready = this.load();
  }

  async whenReady(): Promise<void> {
    await this.ready;
  }

  getBySlug(slug: string): ArticleSummary | undefined {
    return this.articles().find((a) => a.slug === slug);
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    await this.whenReady();
    if (!this.getBySlug(slug)) return undefined;
    const pending = this.storyRequests.get(slug);
    if (pending) return pending;

    const request = firstValueFrom(this.http.get<Article>(`${this.contentBase}stories/${encodeURIComponent(slug)}.json`))
      .catch(async error => {
        if (this.contentBase === this.locale.generatedAssetsBase) throw error;
        this.locale.translationAvailable.set(false);
        return firstValueFrom(this.http.get<Article>(`${this.locale.generatedAssetsBase}stories/${encodeURIComponent(slug)}.json`));
      });
    this.storyRequests.set(slug, request);
    try {
      return await request;
    } catch (error) {
      this.storyRequests.delete(slug);
      throw error;
    }
  }

  hasWorldHistoryStories(): boolean {
    const articles = this.articles();
    const worldHistoryEvents = new Set(articles
      .filter(article => article.period === 'world-history' && article.eventDate && article.timelineOrder !== undefined)
      .map(article => article.slug));
    return articles.some(article => article.relatedTo && worldHistoryEvents.has(article.relatedTo));
  }

  async search(query: string): Promise<SearchEntry[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }
    await this.whenReady();
    const index = await this.loadSearchIndex();
    return index.filter((entry) => {
      const haystack = `${entry.title} ${entry.excerpt} ${entry.text}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  private basePath(): string {
    return this.locale.language === 'en' ? this.locale.generatedAssetsBase : `${this.locale.generatedAssetsBase}${this.locale.language}/`;
  }

  private loadSearchIndex(): Promise<SearchEntry[]> {
    if (this.searchIndex) return this.searchIndex;
    const request = firstValueFrom(this.http.get<SearchEntry[]>(`${this.contentBase}search-index.json`))
      .catch(async error => {
        if (this.contentBase === this.locale.generatedAssetsBase) throw error;
        this.locale.translationAvailable.set(false);
        return firstValueFrom(this.http.get<SearchEntry[]>(`${this.locale.generatedAssetsBase}search-index.json`));
      });
    this.searchIndex = request;
    void request.catch(() => { this.searchIndex = null; });
    return request;
  }

  private async load(): Promise<void> {
    const base = this.basePath();
    let articles: ArticleSummary[];
    try {
      articles = await firstValueFrom(this.http.get<ArticleSummary[]>(`${base}articles.json`));
      this.contentBase = base;
    } catch (error) {
      if (this.locale.language === 'en') throw error;
      this.locale.translationAvailable.set(false);
      articles = await firstValueFrom(this.http.get<ArticleSummary[]>(`${this.locale.generatedAssetsBase}articles.json`));
      this.contentBase = this.locale.generatedAssetsBase;
    }
    this.articles.set(articles);
  }
}
