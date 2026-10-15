import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LazyImageDirective } from '../../directives/lazy-image.directive';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { getPageBookRecommendations } from '../../utils/book-recommendations';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, DatePipe, LazyImageDirective],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly articles = inject(ArticleService);
  private readonly periodsService = inject(PeriodsService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  readonly article = signal<Article | null>(null);
  readonly html = signal<SafeHtml | null>(null);
  readonly bookRecommendations = computed(() => getPageBookRecommendations(this.article(), this.devMode.isDevMode()));
  readonly bottomBooks = computed(() => this.bookRecommendations().below);
  readonly loading = signal(true);
  readonly backLink = signal<string>('/');
  readonly backText = signal<string>(this.locale.translate('← Back to home'));

  async ngOnInit(): Promise<void> {
    await this.articles.whenReady();
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = await this.articles.getArticle(slug).catch(() => null) ?? null;
    this.article.set(found);
    this.html.set(
      found ? this.sanitizer.bypassSecurityTrustHtml(found.html) : null
    );

    // Context-aware back navigation
    const fromPeriodSlug = this.route.snapshot.queryParamMap.get('fromPeriod');
    const fromPolitySlug = this.route.snapshot.queryParamMap.get('fromPolity');
    const fromThemeSlug = this.route.snapshot.queryParamMap.get('fromTheme');
    const fromPersonalitySlug = this.route.snapshot.queryParamMap.get('fromPersonality');
    const fromSearch = this.route.snapshot.queryParamMap.get('fromSearch');
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
    } else {
      this.backLink.set('/');
      this.backText.set(this.locale.translate('← Back to home'));
    }

    this.loading.set(false);
  }

}
