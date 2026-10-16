import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleSummary } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { PeriodsService } from '../../services/periods.service';
import { Period, Personality, Polity, PolityKind, Theme } from '../../data/periods';
import { WorldHistoryComponent } from '../../components/world-history/world-history.component';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';
import { articleRoute } from '../../utils/article-route';

interface TimelinePeriod {
  slug: string;
  name: string;
  range: string;
  description: string;
  articleCount: number;
}

interface PolityDisplay {
  slug: string;
  name: string;
  range: string;
  description: string;
  articleCount: number;
  period: string;
  kind: PolityKind;
}

interface ThemeDisplay extends Theme {
  articleCount: number;
}

interface PersonalityDisplay extends Personality {
  articleCount: number;
}

interface StoryThumbnail {
  src: string;
  alt: string;
}

let featuredArticleSlug: string | null = null;
const INITIAL_SECTION_ITEMS = 3;

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, WorldHistoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly articlesSvc = inject(ArticleService);
  private readonly periodsSvc = inject(PeriodsService);
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  readonly articleRoute = articleRoute;
  readonly showWorldHistory = computed(() => this.devMode.isDevMode() || this.articlesSvc.hasWorldHistoryStories());

  readonly list = signal<ArticleSummary[]>([]);
  readonly loading = signal(true);
  readonly timelinePeriods = signal<TimelinePeriod[]>([]);
  readonly themes = signal<ThemeDisplay[]>([]);
  readonly personalities = signal<PersonalityDisplay[]>([]);
  readonly empires = signal<PolityDisplay[]>([]);
  readonly regionalKingdoms = signal<PolityDisplay[]>([]);
  readonly visibleTimelinePeriods = computed(() => this.visible(this.timelinePeriods()));
  readonly visibleThemes = computed(() => this.visible(this.themes()));
  readonly visiblePersonalities = computed(() => this.visible(this.personalities()));
  readonly visibleEmpires = computed(() => this.visible(this.empires()));
  readonly visibleRegionalKingdoms = computed(() => this.visible(this.regionalKingdoms()));
  readonly expandedThemes = signal(false);
  readonly expandedEmpires = signal(false);
  readonly expandedRegionalKingdoms = signal(false);
  readonly expandedPersonalities = signal(false);
  readonly shownThemes = computed(() => this.expandedThemes() ? this.visibleThemes() : this.visibleThemes().slice(0, INITIAL_SECTION_ITEMS));
  readonly shownEmpires = computed(() => this.expandedEmpires() ? this.visibleEmpires() : this.visibleEmpires().slice(0, INITIAL_SECTION_ITEMS));
  readonly shownRegionalKingdoms = computed(() => this.expandedRegionalKingdoms() ? this.visibleRegionalKingdoms() : this.visibleRegionalKingdoms().slice(0, INITIAL_SECTION_ITEMS));
  readonly shownPersonalities = computed(() => this.expandedPersonalities() ? this.visiblePersonalities() : this.visiblePersonalities().slice(0, INITIAL_SECTION_ITEMS));
  readonly initialSectionItems = INITIAL_SECTION_ITEMS;

  private visible<T extends { articleCount: number }>(items: T[]): T[] {
    return this.devMode.isDevMode() ? items : items.filter(item => item.articleCount > 0);
  }

  async ngOnInit(): Promise<void> {
    await this.articlesSvc.whenReady();

    // Visual "Long Arc" on home: the broad top-level periods only.
    // Sub-periods (e.g. Mauryan, Mughal) appear when you drill into their parent period.
    // Counts include articles in sub-periods.
    const displaySlugs = ['prehistory', 'indus-valley', 'early-historic', 'classical', 'medieval', 'colonial', 'modern'];
    const withCounts: TimelinePeriod[] = [];

    for (const slug of displaySlugs) {
      const p = this.periodsSvc.getBySlug(slug);
      if (!p) continue;
      const count = await this.periodsSvc.getArticleCount(slug);
      withCounts.push({
        slug: p.slug,
        name: p.name,
        range: p.range,
        description: p.shortDescription,
        articleCount: count,
      });
    }

    this.timelinePeriods.set(withCounts);

    const themeDisplays: ThemeDisplay[] = [];
    for (const theme of this.periodsSvc.getThemes()) {
      const count = await this.periodsSvc.getArticleCountForTheme(theme.slug);
      themeDisplays.push({
        ...theme,
        articleCount: count,
      });
    }
    this.themes.set(themeDisplays);

    const personalityDisplays: PersonalityDisplay[] = [];
    for (const personality of this.periodsSvc.getPersonalities()) {
      const count = await this.periodsSvc.getArticleCountForPersonality(personality.slug);
      personalityDisplays.push({
        ...personality,
        articleCount: count,
      });
    }
    this.personalities.set(personalityDisplays);

    // Load empires and regional kingdoms separately for two distinct deep-dive sections.
    // Each article can still appear under a broad period (via `period`) *and* under its specific polity (via `polity` frontmatter).
    const empirePolities = this.periodsSvc.getEmpires();
    const rkPolities = this.periodsSvc.getRegionalKingdoms();

    const empireDisplays: PolityDisplay[] = [];
    for (const p of empirePolities) {
      const count = await this.periodsSvc.getArticleCountForPolity(p.slug);
      empireDisplays.push({
        slug: p.slug,
        name: p.name,
        range: p.range,
        description: p.shortDescription,
        articleCount: count,
        period: p.period,
        kind: p.kind,
      });
    }
    this.empires.set(empireDisplays);

    const rkDisplays: PolityDisplay[] = [];
    for (const p of rkPolities) {
      const count = await this.periodsSvc.getArticleCountForPolity(p.slug);
      rkDisplays.push({
        slug: p.slug,
        name: p.name,
        range: p.range,
        description: p.shortDescription,
        articleCount: count,
        period: p.period,
        kind: p.kind,
      });
    }
    this.regionalKingdoms.set(rkDisplays);

    this.list.set(this.pickFeaturedArticle(this.articlesSvc.allArticles()));
    this.loading.set(false);

    // The sections above World History grow after article counts load. Re-align
    // the header anchor once that content has rendered.
    if (this.route.snapshot.fragment === 'world-history') {
      requestAnimationFrame(() => this.viewportScroller.scrollToAnchor('world-history'));
    }
  }

  private pickFeaturedArticle(articles: ArticleSummary[]): ArticleSummary[] {
    const candidates = articles.filter(article => article.period !== 'world-history' || !!article.relatedTo);
    if (candidates.length === 0) {
      return [];
    }

    const cachedArticle = featuredArticleSlug ? candidates.find((article) => article.slug === featuredArticleSlug) : null;
    if (cachedArticle) {
      return [cachedArticle];
    }

    const article = candidates[Math.floor(Math.random() * candidates.length)];
    featuredArticleSlug = article.slug;
    return [article];
  }


  thumbnail(article: ArticleSummary): StoryThumbnail | null {
    return article.thumbnail ?? null;
  }
}
