import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LazyImageDirective } from '../../directives/lazy-image.directive';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { getPageBookRecommendations } from '../../utils/book-recommendations';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { articleRoute } from '../../utils/article-route';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, DatePipe, LazyImageDirective],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly articles = inject(ArticleService);
  private readonly periodsService = inject(PeriodsService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  readonly articleRoute = articleRoute;
  readonly article = signal<Article | null>(null);
  readonly html = signal<SafeHtml | null>(null);
  readonly bookRecommendations = computed(() => getPageBookRecommendations(this.article(), this.devMode.isDevMode()));
  readonly bottomBooks = computed(() => this.bookRecommendations().below);
  readonly isWorldHistoryOverview = computed(() => {
    const article = this.article();
    return article?.period === 'world-history' && !article.relatedTo;
  });
  readonly isEdictIndex = computed(() => this.article()?.slug === 'ashoka-edicts');
  readonly relatedArticles = computed(() => {
    const article = this.article();
    if (!article) return [];
    const entries = this.articles.allArticles().filter(candidate => candidate.relatedTo === article.slug);
    if (article.slug !== 'ashoka-edicts') return entries;
    const order = (slug: string): number => {
      const numbered = slug.match(/^ashoka-(major-rock|separate-rock|major-pillar|minor-rock)-edict-(\d+)$/);
      if (numbered) {
        const start: Record<string, number> = {
          'major-rock': 0,
          'separate-rock': 14,
          'major-pillar': 16,
          'minor-rock': 23,
        };
        return start[numbered[1]] + Number(numbered[2]);
      }
      return ({
        'ashoka-bairat-edict': 26,
        'ashoka-schism-edict': 27,
        'ashoka-queens-edict': 28,
        'ashoka-lumbini-edict': 29,
        'ashoka-nigali-sagar-edict': 30,
        'ashoka-sudama-cave-inscription': 31,
        'ashoka-visvakarma-cave-inscription': 32,
        'ashoka-karna-chaupar-cave-inscription': 33,
        'ashoka-kandahar-bilingual-inscription': 34,
        'ashoka-kandahar-greek-inscription': 35,
        'ashoka-kandahar-aramaic-inscription': 36,
        'ashoka-laghman-i-inscription': 37,
        'ashoka-laghman-ii-inscription': 38,
        'ashoka-taxila-aramaic-inscription': 39,
        'ashoka-pul-i-darunta-inscription': 40,
      } as Record<string, number>)[slug] ?? 100;
    };
    return [...entries].sort((a, b) => order(a.slug) - order(b.slug));
  });
  readonly loading = signal(true);
  readonly backLink = signal<string>('/');
  readonly backText = signal<string>(this.locale.translate('← Back to home'));
  private requestId = 0;

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, queryParams]) => {
        void this.loadArticle(params, queryParams);
      });
  }

  private async loadArticle(params: ParamMap, queryParams: ParamMap): Promise<void> {
    const requestId = ++this.requestId;
    this.loading.set(true);
    await this.articles.whenReady();
    if (requestId !== this.requestId) return;
    const slug = params.get('slug') ?? '';
    const loaded = await this.articles.getArticle(slug).catch(() => null) ?? null;
    if (requestId !== this.requestId) return;
    const eventSlug = params.get('eventSlug');
    const isWorldHistoryRoute = this.route.snapshot.routeConfig?.path?.startsWith('worldhistory/') ?? false;
    const found = isWorldHistoryRoute && (
      loaded?.period !== 'world-history' ||
      (eventSlug ? loaded.relatedTo !== eventSlug : !!loaded.relatedTo)
    ) ? null : loaded;
    this.article.set(found);
    this.html.set(
      found ? this.sanitizer.bypassSecurityTrustHtml(found.html) : null
    );

    // Context-aware back navigation
    const fromPeriodSlug = queryParams.get('fromPeriod');
    const fromPolitySlug = queryParams.get('fromPolity');
    const fromThemeSlug = queryParams.get('fromTheme');
    const fromPersonalitySlug = queryParams.get('fromPersonality');
    const fromSearch = queryParams.get('fromSearch');
    if (fromPolitySlug) {
      const pol = this.periodsService.getPolityBySlug(fromPolitySlug);
      if (pol) {
        this.backLink.set(`/polity/${fromPolitySlug}`);
        this.backText.set(`${this.locale.translate('← Back to')} ${pol.name}`);
      } else {
        this.backLink.set('/');
        this.backText.set(this.locale.translate('← Back to home'));
      }
    } else if (fromThemeSlug) {
      const theme = this.periodsService.getThemeBySlug(fromThemeSlug);
      if (theme) {
        this.backLink.set(`/theme/${fromThemeSlug}`);
        this.backText.set(`${this.locale.translate('← Back to')} ${theme.name}`);
      } else {
        this.backLink.set('/');
        this.backText.set(this.locale.translate('← Back to home'));
      }
    } else if (fromPersonalitySlug) {
      const personality = this.periodsService.getPersonalityBySlug(fromPersonalitySlug);
      if (personality) {
        this.backLink.set(`/personality/${fromPersonalitySlug}`);
        this.backText.set(`${this.locale.translate('← Back to')} ${personality.name}`);
      } else {
        this.backLink.set('/');
        this.backText.set(this.locale.translate('← Back to home'));
      }
    } else if (fromPeriodSlug) {
      const parentPeriod = this.periodsService.getBySlug(fromPeriodSlug);
      if (parentPeriod) {
        this.backLink.set(`/period/${fromPeriodSlug}`);
        this.backText.set(`${this.locale.translate('← Back to')} ${parentPeriod.name}`);
      } else {
        this.backLink.set('/');
        this.backText.set(this.locale.translate('← Back to home'));
      }
    } else if (fromSearch) {
      this.backLink.set('/search');
      this.backText.set(this.locale.translate('← Back to search'));
    } else if (found?.relatedTo) {
      const parent = this.articles.getBySlug(found.relatedTo);
      this.backLink.set(parent ? articleRoute(parent).join('/') : '/');
      this.backText.set(parent ? `${this.locale.translate('← Back to')} ${parent.title}` : this.locale.translate('← Back to home'));
    } else {
      this.backLink.set('/');
      this.backText.set(this.locale.translate('← Back to home'));
    }

    this.loading.set(false);
  }

}
