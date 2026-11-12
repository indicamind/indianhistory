import { Injector, runInInjectionContext } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LocaleService } from './locale.service';
import { AVAILABLE_LANGUAGES } from './available-languages.generated';

describe('LocaleService', () => {
  let service: LocaleService;
  let mockDoc: any;

  beforeEach(() => {
    mockDoc = {
      baseURI: 'http://localhost:4201/',
      location: {
        href: 'http://localhost:4201/?lang=en',
        assign: (url: string) => { mockDoc.location.href = url; },
      },
      documentElement: {
        lang: 'en',
        dir: 'ltr',
      },
      title: '',
    };

    const mockHttp = {
      get: () => of({}),
    };

    const injector = Injector.create({
      providers: [
        { provide: DOCUMENT, useValue: mockDoc },
        { provide: HttpClient, useValue: mockHttp },
      ],
    });

    service = runInInjectionContext(injector, () => new LocaleService());
    (service as any).copy = {
      'Hello': 'नमस्ते',
      'Showing {visible} of {total}': '{visible} में से {total} दिखा रहे हैं',
    };
  });

  it('should return source string if no translation is in copy dictionary', () => {
    expect(service.translate('Unmapped String')).toBe('Unmapped String');
    expect(service.translate('')).toBe('');
    expect(service.translate(null)).toBe('');
  });

  it('should return translated string when present in copy dictionary', () => {
    expect(service.translate('Hello')).toBe('नमस्ते');
  });

  it('should interpolate format values correctly in strings', () => {
    const formatted = service.format('Showing {visible} of {total}', {
      visible: 10,
      total: 50,
    });
    expect(formatted).toBe('10 में से 50 दिखा रहे हैं');
  });

  it('should update document location when changing language', () => {
    service.changeLanguage('hi');
    expect(mockDoc.location.href).toContain('lang=hi');
  });

  it('loads translated site copy under the document base URL', async () => {
    expect(service.generatedAssetsBase).toBe('/assets/generated/');
    mockDoc.baseURI = 'https://example.com/indianhistory/';
    mockDoc.location.href = 'https://example.com/indianhistory/?lang=hi';
    const requestedUrls: string[] = [];
    const injector = Injector.create({
      providers: [
        { provide: DOCUMENT, useValue: mockDoc },
        { provide: HttpClient, useValue: { get: (url: string) => { requestedUrls.push(url); return of({}); } } },
      ],
    });
    const nested = runInInjectionContext(injector, () => new LocaleService());
    await nested.load();
    expect(nested.generatedAssetsBase).toBe('/indianhistory/assets/generated/');
    expect(requestedUrls).toEqual(['/indianhistory/assets/generated/hi/site.json']);
  });

  it('switches content paths between languages while preserving context and fragments', () => {
    mockDoc.baseURI = 'https://example.com/history/';
    mockDoc.location.href = 'https://example.com/history/hi/blogs/ashoka-in-stone?dev=true&fromPeriod=mauryan#sources';
    service.changeLanguage('ar');
    expect(mockDoc.location.href).toBe('https://example.com/history/ar/blogs/ashoka-in-stone?dev=true&fromPeriod=mauryan#sources');
    service.changeLanguage('en');
    expect(mockDoc.location.href).toBe('https://example.com/history/blogs/ashoka-in-stone?dev=true&fromPeriod=mauryan#sources');
  });

  it('reloads an offline article in the chosen language without losing its route or citation fragment', () => {
    mockDoc.baseURI = 'chrome-extension://reader/newtab.html';
    mockDoc.location.href = 'chrome-extension://reader/newtab.html?lang=hi#/hi/article/ashoka-edicts?fromPeriod=mauryan#sources';
    const saved: Record<string, string> = {};
    mockDoc.defaultView = { localStorage: { setItem: (key: string, value: string) => { saved[key] = value; } } };
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: mockDoc },
      { provide: HttpClient, useValue: { get: () => of({}) } },
    ] });
    const offline = runInInjectionContext(injector, () => new LocaleService());
    expect(offline.language).toBe('hi');
    expect(offline.basePath).toBe('/');
    expect(offline.generatedAssetsBase).toBe('/assets/generated/');
    offline.changeLanguage('ar');
    expect(mockDoc.location.href).toBe('chrome-extension://reader/newtab.html?lang=ar#/ar/article/ashoka-edicts?fromPeriod=mauryan#sources');
    expect(saved['ih_extension_language']).toBe('ar');
  });

  it('loads Sanskrit locale data for the complete edition', async () => {
    mockDoc.location.href = 'http://localhost:4201/?lang=sa';
    mockDoc.title = 'India History';
    const urls: string[] = [];
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: mockDoc },
      { provide: HttpClient, useValue: { get: (url: string) => {
        urls.push(url);
        return of({ 'India History': 'भारतेतिहासः' });
      } } },
    ] });
    const localized = runInInjectionContext(injector, () => new LocaleService());
    await localized.load();
    expect(localized.language).toBe('sa');
    expect(localized.languages.some(language => language.code === 'sa')).toBeTruthy();
    expect(mockDoc.documentElement.lang).toBe('sa');
    expect(mockDoc.documentElement.dir).toBe('ltr');
    expect(mockDoc.title).toBe('भारतेतिहासः');
    expect(localized.translationAvailable()).toBeTruthy();
    expect(urls).toEqual(['/assets/generated/sa/site.json']);
    localized.changeLanguage('sa');
    expect(mockDoc.location.href).toContain('lang=sa');
  });

  it('loads the language in a shared URL path and preserves its generated article title', async () => {
    mockDoc.location.href = 'http://localhost:4201/ar/article/ashoka-edicts?lang=en';
    mockDoc.title = 'عنوان المقال';
    const urls: string[] = [];
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: mockDoc },
      { provide: HttpClient, useValue: { get: (url: string) => { urls.push(url); return of({ 'India History': 'تاريخ الهند' }); } } },
    ] });
    const localized = runInInjectionContext(injector, () => new LocaleService());
    await localized.load();
    expect(localized.language).toBe('ar');
    expect(mockDoc.documentElement.dir).toBe('rtl');
    expect(mockDoc.title).toBe('عنوان المقال');
    expect(urls).toEqual(['/assets/generated/ar/site.json']);
  });

  it('loads the new locale data without offering unfinished editions in the selector', async () => {
    for (const code of ['ko', 'vi', 'tr', 'it', 'ms', 'sw', 'fil']) {
      mockDoc.location.href = `http://localhost:4201/${code}/article/ashoka-sudama-cave-inscription`;
      const urls: string[] = [];
      const injector = Injector.create({ providers: [
        { provide: DOCUMENT, useValue: mockDoc },
        { provide: HttpClient, useValue: { get: (url: string) => { urls.push(url); return of({}); } } },
      ] });
      const localized = runInInjectionContext(injector, () => new LocaleService());
      await localized.load();
      expect(localized.language).toBe(code);
      expect(mockDoc.documentElement.lang).toBe(code);
      expect(mockDoc.documentElement.dir).toBe('ltr');
      expect(localized.languages.some(language => language.code === code)).toBe(AVAILABLE_LANGUAGES.includes(code));
      expect(urls).toEqual([`/assets/generated/${code}/site.json`]);
      expect(localized.navigation.search).toBeTruthy();
    }
  });
});
