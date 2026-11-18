import { Injectable, inject } from '@angular/core';
import { ArticleSummary, SearchResult, SearchResultKind } from '../models/article.model';
import { booksForMode } from '../data/recommended-books';
import { ArticleService } from './article.service';
import { BlogService } from './blog.service';
import { BlogPost } from '../models/blog.model';
import { SectionEntry } from '../models/section-membership.model';
import { LocaleService } from '../i18n/locale.service';
import { DevModeService } from './dev-mode.service';
import { articleRoute } from '../utils/article-route';
import {
  Period,
  Personality,
  Polity,
  PolityKind,
  Theme,
  findParent,
  findPeriod,
  getSubtreeSlugs,
  personalities,
  periods,
  polities,
  themes,
} from '../data/periods';

export type SectionKind = 'period' | 'polity' | 'theme' | 'personality';

export interface ArticleSectionLink {
  name: string;
  route: string[];
  kindLabel: 'Period' | 'Empire' | 'Kingdom' | 'Dynasty' | 'Theme' | 'Personality' | 'Article';
  fragment?: string;
}

@Injectable({ providedIn: 'root' })
export class PeriodsService {
  private readonly articlesService = inject(ArticleService);
  private readonly blogsService = inject(BlogService);
  private readonly locale = inject(LocaleService);
  private readonly devMode = inject(DevModeService);
  private readonly localizedPeriods = periods.map(period => this.localizePeriod(period));
  private readonly localizedPolities = polities.map(polity => ({
    ...polity,
    name: this.locale.translate(polity.name),
    range: this.locale.translate(polity.range),
    shortDescription: this.locale.translate(polity.shortDescription),
    description: this.locale.translate(polity.description),
  }));
  private readonly localizedThemes = themes.map(theme => ({
    ...theme,
    name: this.locale.translate(theme.name),
    range: this.locale.translate(theme.range),
    shortDescription: this.locale.translate(theme.shortDescription),
    description: this.locale.translate(theme.description),
  }));
  private readonly localizedPersonalities = personalities.map(person => ({
    ...person,
    name: this.locale.translate(person.name),
    range: this.locale.translate(person.range),
    shortDescription: this.locale.translate(person.shortDescription),
    description: this.locale.translate(person.description),
  }));

  private localizePeriod(period: Period): Period {
    return {
      ...period,
      name: this.locale.translate(period.name),
      range: this.locale.translate(period.range),
      shortDescription: this.locale.translate(period.shortDescription),
      description: this.locale.translate(period.description),
      children: period.children?.map(child => this.localizePeriod(child)),
    };
  }

  /** All root periods (for home overview etc.) */
  getTopLevel(): Period[] {
    return this.localizedPeriods;
  }

  /** Find any period (including nested) by slug */
  getBySlug(slug: string): Period | undefined {
    return findPeriod(slug, this.localizedPeriods);
  }

  /** Find the direct parent period (if any) */
  getParent(slug: string): Period | undefined {
    return findParent(slug, this.localizedPeriods);
  }

  /** Get all periods flattened (useful for counts etc.) */
  getAll(): Period[] {
    const all: Period[] = [];
    const walk = (list: Period[]) => {
      for (const p of list) {
        all.push(p);
        if (p.children) walk(p.children);
      }
    };
    walk(this.localizedPeriods);
    return all;
  }

  /**
   * Return articles whose `period` field matches this node or any descendant.
   * Falls back to tag-based matching for older articles if needed.
   */
  async getArticlesForPeriod(slug: string): Promise<ArticleSummary[]> {
    await this.articlesService.whenReady();
    return this.articlesForPeriod(slug);
  }

  isVisiblePeriod(slug: string): boolean {
    return this.devMode.isDevMode() || this.articlesForPeriod(slug).length > 0 || this.blogsForSection('period', slug).length > 0;
  }

  private articlesForPeriod(slug: string): ArticleSummary[] {
    return this.sortArticlesForListing(this.articlesService.allArticles().filter(entry => this.belongsToPeriod(entry, slug)));
  }

  private belongsToPeriod(entry: SectionEntry, slug: string): boolean {
    const period = this.getBySlug(slug);
    if (!period) return false;
    if (entry.period) return getSubtreeSlugs(period).includes(entry.period);
    const tags = (entry.tags || []).map(tag => tag.toLowerCase());
    if (slug === 'mauryan') return tags.includes('mauryan');
    if (slug === 'early-historic') return tags.includes('early historic') || tags.includes('mauryan');
    if (slug === 'indus-valley') return ['indus', 'harappan', 'sindhu', 'saraswati'].some(tag => tags.includes(tag));
    return false;
  }

  /** Count of articles under a period (including subtree) */
  async getArticleCount(slug: string): Promise<number> {
    const arts = await this.getArticlesForPeriod(slug);
    return arts.length;
  }

  /** All polities / empires / kingdoms */
  getPolities(): Polity[] {
    return this.localizedPolities;
  }

  /** Major empires (pan-subcontinental or imperial scale) */
  getEmpires(): Polity[] {
    return this.localizedPolities.filter((p) => p.kind === 'empire' && !p.parent);
  }

  /** Regional kingdoms, sultanates, and successor states */
  getRegionalKingdoms(): Polity[] {
    return this.localizedPolities.filter((p) => p.kind === 'regional-kingdom' && !p.parent);
  }

  getPolityChildren(slug: string): Polity[] {
    return this.localizedPolities.filter(polity => polity.parent === slug);
  }

  getPolityParent(slug: string): Polity | undefined {
    const parent = this.getPolityBySlug(slug)?.parent;
    return parent ? this.getPolityBySlug(parent) : undefined;
  }

  /** Find a polity by slug */
  getPolityBySlug(slug: string): Polity | undefined {
    return this.localizedPolities.find((p) => p.slug === slug);
  }

  /** Cross-period themes such as Vedas, Buddhism/Jainism, and colonization */
  getThemes(): Theme[] {
    return this.localizedThemes;
  }

  /** Find a theme by slug */
  getThemeBySlug(slug: string): Theme | undefined {
    return this.localizedThemes.find((t) => t.slug === slug);
  }

  /** Historical personalities available for deep dives */
  getPersonalities(): Personality[] {
    return this.localizedPersonalities;
  }

  /** Find a personality by slug */
  getPersonalityBySlug(slug: string): Personality | undefined {
    return this.localizedPersonalities.find((p) => p.slug === slug);
  }

  /** Use the section listing rules so article navigation includes every matching ancestor. */
  getSectionsForArticle(article: ArticleSummary): ArticleSectionLink[] {
    return this.sectionsForEntry(article);
  }

  getSectionsForBlog(blog: BlogPost): ArticleSectionLink[] {
    return this.sectionsForEntry(blog);
  }

  private sectionsForEntry(article: SectionEntry): ArticleSectionLink[] {
    const links: ArticleSectionLink[] = [];

    for (const period of this.getAll()) {
      if (this.belongsToPeriod(article, period.slug)) {
        links.push({ name: period.name, route: ['/period', period.slug], kindLabel: 'Period' });
      }
    }
    for (const polity of this.getPolities()) {
      if (this.belongsToPolity(article, polity.slug)) {
        links.push({ name: polity.name, route: ['/polity', polity.slug], kindLabel: polity.kind === 'dynasty' ? 'Dynasty' : polity.kind === 'empire' ? 'Empire' : 'Kingdom' });
      }
    }
    for (const theme of this.getThemes()) {
      if (this.belongsToSection(article, 'theme', theme.slug)) {
        links.push({ name: theme.name, route: ['/theme', theme.slug], kindLabel: 'Theme' });
      }
    }
    for (const person of this.getPersonalities()) {
      if (this.belongsToSection(article, 'personality', person.slug)) {
        links.push({ name: person.name, route: ['/personality', person.slug], kindLabel: 'Personality' });
      }
    }
    if (article.period === 'world-history') {
      links.push({ name: this.locale.translate('World history'), route: ['/'], fragment: 'world-history', kindLabel: 'Period' });
    }
    const seen = new Set([article.slug]);
    const guides: ArticleSectionLink[] = [];
    let parentSlug = article.relatedTo;
    while (parentSlug && !seen.has(parentSlug)) {
      seen.add(parentSlug);
      const parent = this.articlesService.getBySlug(parentSlug);
      if (!parent) break;
      guides.unshift({ name: parent.title, route: articleRoute(parent), kindLabel: 'Article' });
      parentSlug = parent.relatedTo;
    }
    return [...links, ...guides];
  }

  /**
   * Return articles for this polity and its descendants.
   */
  async getArticlesForPolity(slug: string): Promise<ArticleSummary[]> {
    await this.articlesService.whenReady();
    return this.articlesForPolity(slug);
  }

  isVisiblePolity(slug: string): boolean {
    return this.devMode.isDevMode() || this.articlesForPolity(slug).length > 0 || this.blogsForSection('polity', slug).length > 0;
  }

  private articlesForPolity(slug: string): ArticleSummary[] {
    return this.sortArticlesForListing(this.articlesService.allArticles().filter(entry => this.belongsToPolity(entry, slug)));
  }

  private belongsToPolity(entry: SectionEntry, slug: string): boolean {
    if (!this.getPolityBySlug(slug)) return false;
    const allowed = new Set<string>();
    const include = (current: string) => {
      if (allowed.has(current)) return;
      allowed.add(current);
      this.getPolityChildren(current).forEach(child => include(child.slug));
    };
    include(slug);
    if (entry.polity) return allowed.has(entry.polity);
    const tags = (entry.tags || []).map(tag => tag.toLowerCase());
    return [...allowed].some(value => tags.includes(value)) || (slug === 'maurya' && tags.includes('mauryan'));
  }

  /** Count of articles for a specific polity */
  async getArticleCountForPolity(slug: string): Promise<number> {
    const arts = await this.getArticlesForPolity(slug);
    return arts.length;
  }

  /**
   * Return articles whose `themes` array contains this slug.
   */
  async getArticlesForTheme(slug: string): Promise<ArticleSummary[]> {
    await this.articlesService.whenReady();
    return this.articlesForTheme(slug);
  }

  isVisibleTheme(slug: string): boolean {
    return this.devMode.isDevMode() || this.articlesForTheme(slug).length > 0 || this.blogsForSection('theme', slug).length > 0;
  }

  private articlesForTheme(slug: string): ArticleSummary[] {
    return this.articlesService.allArticles().filter(entry => this.belongsToSection(entry, 'theme', slug));
  }

  /** Count of articles for a specific theme */
  async getArticleCountForTheme(slug: string): Promise<number> {
    const arts = await this.getArticlesForTheme(slug);
    return arts.length;
  }

  /** Return articles whose `personalities` array contains this slug. */
  async getArticlesForPersonality(slug: string): Promise<ArticleSummary[]> {
    await this.articlesService.whenReady();
    return this.articlesForPersonality(slug);
  }

  isVisiblePersonality(slug: string): boolean {
    // Every personality now has a biography and life timeline of its own.
    return !!this.getPersonalityBySlug(slug);
  }

  private articlesForPersonality(slug: string): ArticleSummary[] {
    return this.sortArticlesForListing(this.articlesService.allArticles().filter(entry => this.belongsToSection(entry, 'personality', slug)));
  }

  /** Blogs use the same explicit section and ancestor rules as articles. */
  async getBlogsForSection(kind: SectionKind, slug: string): Promise<BlogPost[]> {
    await this.blogsService.whenReady();
    return this.blogsForSection(kind, slug);
  }

  async getBlogCountForSection(kind: SectionKind, slug: string): Promise<number> {
    return (await this.getBlogsForSection(kind, slug)).length;
  }

  private blogsForSection(kind: SectionKind, slug: string): BlogPost[] {
    return this.blogsService.allPosts().filter(entry => this.belongsToSection(entry, kind, slug));
  }

  private belongsToSection(entry: SectionEntry, kind: SectionKind, slug: string): boolean {
    if (kind === 'period') return this.belongsToPeriod(entry, slug);
    if (kind === 'polity') return this.belongsToPolity(entry, slug);
    if (kind === 'theme') return !!this.getThemeBySlug(slug) && !entry.relatedTo && (entry.themes || []).includes(slug);
    return !!this.getPersonalityBySlug(slug) && (entry.personalities || []).includes(slug);
  }

  private sortArticlesForListing(entries: ArticleSummary[]): ArticleSummary[] {
    const bySlug = new Intl.Collator('en', { numeric: true });
    return entries.sort((a, b) =>
      Number(!!a.relatedTo) - Number(!!b.relatedTo) || bySlug.compare(a.slug, b.slug)
    );
  }

  /** Count of articles for a specific personality */
  async getArticleCountForPersonality(slug: string): Promise<number> {
    const arts = await this.getArticlesForPersonality(slug);
    return arts.length;
  }

  /**
   * Unified search across:
   * - Articles (stories)
   * - All periods (top-level + sub-periods like Mauryan, Mature Phase, etc.)
   * - All polities (empires + regional kingdoms)
   *
   * Results are ranked so that title matches come first, then by kind (articles slightly preferred), then alpha.
   */
  async searchAll(query: string): Promise<SearchResult[]> {
    await this.articlesService.whenReady();
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Articles via the existing pre-built index (includes full body text)
    const articleHits = await this.articlesService.search(query);
    for (const a of articleHits) {
      const summary = this.articlesService.getBySlug(a.slug);
      results.push({
        kind: 'article',
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        routerLink: summary ? articleRoute(summary) : ['/article', a.slug],
        queryParams: { fromSearch: true },
        kindLabel: this.locale.translate('Article'),
      });
    }

    // All periods (flattened tree so sub-periods like 'mauryan' or 'mature-harappan' are findable)
    const allPeriods = this.getAll().filter(period => this.isVisiblePeriod(period.slug));
    for (const p of allPeriods) {
      const haystack = `${p.name} ${p.shortDescription} ${p.description} ${p.range}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          kind: 'period',
          slug: p.slug,
          title: p.name,
          excerpt: p.shortDescription || (p.description ? p.description.slice(0, 160) : ''),
          routerLink: ['/period', p.slug],
          queryParams: { fromSearch: true },
          kindLabel: this.locale.translate('Period'),
        });
      }
    }

    // All polities (empires and regional kingdoms)
    const allPolities = this.getPolities().filter(polity => this.isVisiblePolity(polity.slug));
    for (const pol of allPolities) {
      const haystack = `${pol.name} ${pol.shortDescription} ${pol.description} ${pol.range}`.toLowerCase();
      if (haystack.includes(q)) {
        const isEmpire = pol.kind === 'empire';
        results.push({
          kind: 'polity',
          slug: pol.slug,
          title: pol.name,
          excerpt: pol.shortDescription || (pol.description ? pol.description.slice(0, 160) : ''),
          routerLink: ['/polity', pol.slug],
          queryParams: { fromSearch: true },
          kindLabel: this.locale.translate(pol.kind === 'dynasty' ? 'Dynasty' : isEmpire ? 'Empire' : 'Kingdom'),
        });
      }
    }

    // Cross-period themes
    for (const theme of this.getThemes().filter(item => this.isVisibleTheme(item.slug))) {
      const haystack = `${theme.name} ${theme.shortDescription} ${theme.description} ${theme.range}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          kind: 'theme',
          slug: theme.slug,
          title: theme.name,
          excerpt: theme.shortDescription || (theme.description ? theme.description.slice(0, 160) : ''),
          routerLink: ['/theme', theme.slug],
          queryParams: { fromSearch: true },
          kindLabel: this.locale.translate('Theme'),
        });
      }
    }

    // Historical personalities
    for (const personality of this.getPersonalities().filter(item => this.isVisiblePersonality(item.slug))) {
      const haystack = `${personality.name} ${personality.shortDescription} ${personality.description} ${personality.range}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          kind: 'personality',
          slug: personality.slug,
          title: personality.name,
          excerpt: personality.shortDescription || (personality.description ? personality.description.slice(0, 160) : ''),
          routerLink: ['/personality', personality.slug],
          queryParams: { fromSearch: true },
          kindLabel: this.locale.translate('Personality'),
        });
      }
    }

    // Recommended books
    for (const book of booksForMode(this.devMode.isDevMode())) {
      const haystack = `${book.title} ${book.author} ${book.description} ${book.category ?? ''} ${book.publisher ?? ''} ${book.format} ${book.publicationDate ?? ''} ${book.isbn10} ${book.isbn13 ?? ''}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          kind: 'book',
          slug: book.isbn10,
          title: book.title,
          excerpt: `${this.locale.translate('Book by')} ${book.author}. ${book.description}`,
          bookAuthor: book.author,
          bookDescription: book.description,
          externalUrl: book.affiliateUrl || book.amazonUrl,
          affiliatePending: !book.affiliateUrl,
          kindLabel: this.locale.translate('Book'),
        });
      }
    }

    // De-duplicate (in case of slug collisions across kinds, though unlikely)
    const seen = new Set<string>();
    const unique: SearchResult[] = [];
    for (const r of results) {
      const key = `${r.kind}:${r.slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }

    // Rank: prefer title hits that start with the query, then contain, then by kind (Story first), then name
    const kindRank: Record<SearchResultKind, number> = { article: 0, book: 1, period: 2, personality: 3, theme: 4, polity: 5 };
    unique.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aScore = aTitle.startsWith(q) ? 0 : aTitle.includes(q) ? 1 : 2;
      const bScore = bTitle.startsWith(q) ? 0 : bTitle.includes(q) ? 1 : 2;
      if (aScore !== bScore) return aScore - bScore;
      if (kindRank[a.kind] !== kindRank[b.kind]) return kindRank[a.kind] - kindRank[b.kind];
      return a.title.localeCompare(b.title);
    });

    return unique;
  }
}
