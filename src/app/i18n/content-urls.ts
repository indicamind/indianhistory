import { LANGUAGES, LanguageCode, languageFromUrl } from './languages';

export function contentPath(pathname: string): { path: string; language?: LanguageCode } | null {
  const parts = pathname.split('/').filter(Boolean);
  const language = LANGUAGES.find(entry => entry.code === parts[0])?.code;
  const route = language ? parts.slice(1) : parts;
  const valid = (['article', 'blogs', 'post', 'worldhistory'].includes(route[0]) && route.length === 2)
    || (route[0] === 'worldhistory' && route.length === 3);
  return valid && route.slice(1).every(slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    ? { path: '/' + route.join('/'), language } : null;
}

export function languageAtLocation(url: URL, basePath = '/'): LanguageCode {
  const relative = url.pathname.startsWith(basePath) ? '/' + url.pathname.slice(basePath.length) : url.pathname;
  return contentPath(relative)?.language ?? languageFromUrl(url.searchParams.get('lang'));
}

export function localizedContentUrl(value: string, language: LanguageCode): string {
  const url = new URL(value, 'https://history.invalid');
  const route = contentPath(url.pathname);
  if (!route) return value;
  url.pathname = (language === 'en' ? '' : '/' + language) + route.path;
  url.searchParams.delete('lang');
  return url.pathname + url.search + url.hash;
}

export function localizeContentLinks(html: string, language: LanguageCode, dev = false, basePath = '/'): string {
  return html.replace(/href="(\/(?:article|blogs|worldhistory|post)\/[^"\s]+)"/g, (match, href: string) => {
    const url = new URL(localizedContentUrl(href.replace(/&amp;/g, '&'), language), 'https://history.invalid');
    url.pathname = basePath.replace(/\/$/, '') + url.pathname;
    if (dev) url.searchParams.set('dev', 'true');
    return `href="${(url.pathname + url.search + url.hash).replace(/&/g, '&amp;')}"`;
  });
}
