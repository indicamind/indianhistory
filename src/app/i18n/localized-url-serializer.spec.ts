import { Injector } from '@angular/core';
import { DefaultUrlSerializer, UrlSerializer } from '@angular/router';
import { contentPath, languageAtLocation, localizeContentLinks, localizedContentUrl } from './content-urls';
import { LocalizedUrlSerializer } from './localized-url-serializer';
import { LANGUAGES } from './languages';

describe('Localized content URLs', () => {
  const serializer = new LocalizedUrlSerializer();
  const standard = new DefaultUrlSerializer();

  it('can be installed as Angular’s URL serializer', () => {
    const injector = Injector.create({ providers: [{ provide: UrlSerializer, useClass: LocalizedUrlSerializer }] });
    const installed = injector.get(UrlSerializer);
    expect(installed.serialize(installed.parse('/article/ashoka-edicts?lang=hi'))).toBe('/hi/article/ashoka-edicts');
  });

  it('routes every language through existing components and round-trips its public URL', () => {
    for (const { code } of LANGUAGES) {
      const prefix = code === 'en' ? '' : '/' + code;
      const tree = serializer.parse(`${prefix}/article/ashoka-edicts?fromPeriod=mauryan&dev=true#sources`);
      expect(standard.serialize(tree)).toContain('/article/ashoka-edicts?');
      expect(serializer.serialize(tree)).toBe(`${prefix}/article/ashoka-edicts?fromPeriod=mauryan&dev=true#sources`);
      expect(languageAtLocation(new URL(`https://example.com${prefix}/article/ashoka-edicts`))).toBe(code);
    }
  });

  it('upgrades old query links while retaining context and without mutating the UrlTree', () => {
    const tree = serializer.parse('/blogs/ashoka-in-stone?lang=hi&fromPeriod=mauryan#sources');
    expect(serializer.serialize(tree)).toBe('/hi/blogs/ashoka-in-stone?fromPeriod=mauryan#sources');
    expect(tree.queryParams['lang']).toBe('hi');
    expect(serializer.serialize(serializer.parse('/hi/article/ashoka-edicts?lang=en'))).toBe('/hi/article/ashoka-edicts');
    expect(serializer.serialize(serializer.parse('/search?lang=hi'))).toBe('/search?lang=hi');
    expect(serializer.serialize(serializer.parse('/books?lang=ar'))).toBe('/books?lang=ar');
  });

  it('keeps language detection correct under a deployment prefix and supports legacy aliases', () => {
    expect(languageAtLocation(new URL('https://example.com/history/ar/article/ashoka-edicts?lang=hi'), '/history/')).toBe('ar');
    expect(languageAtLocation(new URL('https://example.com/history/?lang=ta'), '/history/')).toBe('ta');
    expect(serializer.serialize(serializer.parse('/post/ashoka-edicts?lang=fr'))).toBe('/fr/post/ashoka-edicts');
    expect(serializer.serialize(serializer.parse('/worldhistory/event/child?lang=bn'))).toBe('/bn/worldhistory/event/child');
    expect(contentPath('/xx/article/ashoka-edicts')).toBeNull();
  });

  it('localizes Markdown links, preserves fragments and leaves external sources alone', () => {
    expect(localizedContentUrl('/hi/article/ashoka-edicts?lang=hi&fromPeriod=mauryan#sources', 'ar'))
      .toBe('/ar/article/ashoka-edicts?fromPeriod=mauryan#sources');
    expect(localizedContentUrl('/hi/article/ashoka-edicts', 'en')).toBe('/article/ashoka-edicts');
    const html = '<a href="/article/ashoka-edicts#sources">Guide</a> <a href="https://example.com/source">Source</a>';
    expect(localizeContentLinks(html, 'hi')).toContain('href="/hi/article/ashoka-edicts#sources"');
    expect(localizeContentLinks(html, 'hi')).toContain('href="https://example.com/source"');
    expect(localizeContentLinks(html, 'en', true)).toContain('href="/article/ashoka-edicts?dev=true#sources"');
    expect(localizeContentLinks(html, 'hi', false, '/history/')).toContain('href="/history/hi/article/ashoka-edicts#sources"');
  });
});
