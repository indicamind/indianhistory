import { DOCUMENT, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LANGUAGES, LanguageCode, languageFromUrl } from './languages';
import { NAVIGATION } from './navigation';
import { AVAILABLE_LANGUAGES, IN_PROGRESS_LANGUAGES } from './available-languages.generated';
import { contentPath, languageAtLocation, localizedContentUrl } from './content-urls';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private copy: Record<string, string> = {};
  readonly basePath = new URL(this.document.baseURI).pathname;
  readonly generatedAssetsBase = new URL('assets/generated/', this.document.baseURI).pathname;
  readonly languages = LANGUAGES.filter(entry => AVAILABLE_LANGUAGES.includes(entry.code));
  readonly language: LanguageCode = languageAtLocation(
    new URL(this.document.location.href), this.basePath
  );
  readonly translationAvailable = signal(!IN_PROGRESS_LANGUAGES.includes(this.language));
  readonly navigation = NAVIGATION[this.language];

  async load(): Promise<void> {
    if (this.language === 'en') return;
    const localeData = {
      hi: () => import('@angular/common/locales/hi'),
      bn: () => import('@angular/common/locales/bn'),
      ta: () => import('@angular/common/locales/ta'),
      te: () => import('@angular/common/locales/te'),
      mr: () => import('@angular/common/locales/mr'),
      ur: () => import('@angular/common/locales/ur'),
      gu: () => import('@angular/common/locales/gu'),
      kn: () => import('@angular/common/locales/kn'),
      ml: () => import('@angular/common/locales/ml'),
      pa: () => import('@angular/common/locales/pa'),
      sa: () => import('@angular/common/locales/sa'),
      es: () => import('@angular/common/locales/es'),
      fr: () => import('@angular/common/locales/fr'),
      ar: () => import('@angular/common/locales/ar'),
      zh: () => import('@angular/common/locales/zh'),
      pt: () => import('@angular/common/locales/pt'),
      or: () => import('@angular/common/locales/or'),
      si: () => import('@angular/common/locales/si'),
      ja: () => import('@angular/common/locales/ja'),
      ne: () => import('@angular/common/locales/ne'),
      id: () => import('@angular/common/locales/id'),
      th: () => import('@angular/common/locales/th'),
      de: () => import('@angular/common/locales/de'),
      fa: () => import('@angular/common/locales/fa'),
      ru: () => import('@angular/common/locales/ru'),
      ks: () => import('@angular/common/locales/ks'),
    };
    registerLocaleData((await localeData[this.language]()).default);
    try {
      this.copy = await firstValueFrom(this.http.get<Record<string, string>>(`${this.generatedAssetsBase}${this.language}/site.json`));
      if (this.document.title === 'India History') this.document.title = this.translate('India History');
    } catch {
      this.translationAvailable.set(false);
    }
  }

  translate(source: string | null | undefined): string {
    if (!source) return '';
    return this.copy[source] || source;
  }

  format(source: string, values: Record<string, string | number>): string {
    return this.translate(source).replace(/\{([a-z]+)\}/g, (match, key: string) => {
      const value = values[key];
      if (value === undefined) return match;
      return typeof value === 'number' ? new Intl.NumberFormat(this.language).format(value) : value;
    });
  }

  formatBookDate(source: string): string {
    if (this.language === 'en') return source;
    const shortMonth = /^([A-Z][a-z]{2})\/(\d{4})$/.exec(source);
    if (shortMonth) {
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(shortMonth[1]);
      if (month >= 0) {
        const date = new Date(Date.UTC(Number(shortMonth[2]), month, 1));
        return new Intl.DateTimeFormat(this.language, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
      }
    }
    const match = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(source);
    if (!match) return /^\d{4}$/.test(source)
      ? new Intl.NumberFormat(this.language, { useGrouping: false }).format(Number(source))
      : source;
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(match[2]);
    if (month < 0) return source;
    const date = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
    return new Intl.DateTimeFormat(this.language, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  }

  bookCoverAlt(title: string, englishAlt: string): string {
    return this.language === 'en' ? englishAlt : `${this.translate('Book')}: ${title}`;
  }

  translateDocument(): void {
    if (this.language === 'en' || !Object.keys(this.copy).length) return;
    const translateNodes = () => {
      const root = this.document.body;
      const walker = this.document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('script, style, code, pre, textarea, .notranslate, [translate="no"]')) continue;
        const source = node.textContent || '';
        const trimmed = source.trim();
        const translated = this.translate(trimmed);
        if (trimmed && translated !== trimmed) {
          node.textContent = source.replace(trimmed, translated);
        }
      }
      for (const element of root.querySelectorAll('[alt], [placeholder], [title], [aria-label]')) {
        if (element.closest('.notranslate, [translate="no"]')) continue;
        for (const attribute of ['alt', 'placeholder', 'title', 'aria-label']) {
          const source = element.getAttribute(attribute);
          if (source) {
            const translated = this.translate(source);
            if (translated !== source) element.setAttribute(attribute, translated);
          }
        }
      }
    };
    translateNodes();
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => { pending = false; translateNodes(); });
    });
    observer.observe(this.document.body, { childList: true, subtree: true, characterData: true });
  }

  constructor() {
    const entry = LANGUAGES.find(language => language.code === this.language)!;
    this.document.documentElement.lang = entry.code;
    this.document.documentElement.dir = entry.direction;
  }

  changeLanguage(code: string): void {
    const language = languageFromUrl(code);
    const url = new URL(this.document.location.href);
    const base = new URL(this.document.baseURI).pathname;
    const relative = url.pathname.startsWith(base) ? '/' + url.pathname.slice(base.length) : url.pathname;
    if (contentPath(relative)) {
      const localized = new URL(localizedContentUrl(relative + url.search + url.hash, language), url.origin);
      url.pathname = base.replace(/\/$/, '') + localized.pathname;
      url.search = localized.search;
    } else {
      url.searchParams.set('lang', language);
    }
    this.document.location.assign(url.href);
  }
}
