const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const SITE_NAME = 'India History';
const OG_LOCALES = {
  en: 'en_IN', hi: 'hi_IN', bn: 'bn_IN', ta: 'ta_IN', te: 'te_IN', mr: 'mr_IN',
  ur: 'ur_PK', gu: 'gu_IN', kn: 'kn_IN', ml: 'ml_IN', pa: 'pa_IN',
  es: 'es_ES', fr: 'fr_FR', ar: 'ar_AR', zh: 'zh_CN', pt: 'pt_BR',
};
const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND = '#fffaf2';
const START = '<!-- share-metadata:start -->';
const END = '<!-- share-metadata:end -->';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function decodeHtml(value) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(value).replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()];
    const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
  });
}

function firstImage(html = '') {
  const image = html.match(/<img\b[^>]*>/i)?.[0] || '';
  const attribute = name => decodeHtml(image.match(new RegExp(`\\s${name}=(["'])([\\s\\S]*?)\\1`, 'i'))?.[2] || '');
  return { src: attribute('src'), alt: attribute('alt') };
}

function renderHtml(template, page) {
  const clean = template.replace(/<!-- share-metadata:start -->[\s\S]*?<!-- share-metadata:end -->\s*/g, '');
  const tags = [];
  const meta = (attribute, name, value) => tags.push(`  <meta ${attribute}="${name}" content="${escapeHtml(value)}">`);
  tags.push(`  <link rel="canonical" href="${escapeHtml(page.url)}">`);
  meta('name', 'description', page.description);
  meta('property', 'og:type', page.type);
  meta('property', 'og:site_name', page.siteName || SITE_NAME);
  meta('property', 'og:locale', OG_LOCALES[page.language || 'en']);
  for (const alternate of page.alternates || []) {
    tags.push(`  <link rel="alternate" hreflang="${alternate.language}" href="${escapeHtml(alternate.url)}">`);
    if (alternate.language !== (page.language || 'en')) meta('property', 'og:locale:alternate', OG_LOCALES[alternate.language]);
  }
  const english = page.alternates?.find(alternate => alternate.language === 'en');
  if (english) tags.push(`  <link rel="alternate" hreflang="x-default" href="${escapeHtml(english.url)}">`);
  meta('property', 'og:title', page.title);
  meta('property', 'og:description', page.description);
  meta('property', 'og:url', page.url);
  meta('property', 'og:image', page.image.url);
  meta('property', 'og:image:secure_url', page.image.url);
  if (page.image.width) {
    meta('property', 'og:image:type', 'image/jpeg');
    meta('property', 'og:image:width', page.image.width);
    meta('property', 'og:image:height', page.image.height);
  }
  meta('property', 'og:image:alt', page.image.alt);
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', page.title);
  meta('name', 'twitter:description', page.description);
  meta('name', 'twitter:image', page.image.url);
  meta('name', 'twitter:image:alt', page.image.alt);
  if (page.publishedAt) meta('property', 'article:published_time', new Date(page.publishedAt).toISOString());
  if (page.updatedAt) meta('property', 'article:modified_time', new Date(page.updatedAt).toISOString());
  const title = page.type === 'article' ? `${page.title} | ${page.siteName || SITE_NAME}` : page.title;
  return clean.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<html\b([^>]*)>/i, (_, attributes) => `<html${attributes.replace(/\s(?:lang|dir)="[^"]*"/gi, '')} lang="${page.language || 'en'}" dir="${['ar', 'ur'].includes(page.language) ? 'rtl' : 'ltr'}">`)
    .replace('</head>', `${START}\n${tags.join('\n')}\n${END}\n</head>`);
}

async function generateSharePages(options = {}) {
  const root = options.root || path.resolve(__dirname, '..');
  const output = options.output || path.join(root, 'dist', 'hello-world', 'browser');
  const site = new URL(options.siteUrl || process.env.SITE_URL || 'https://www.indiahistory.info/');
  if (site.protocol !== 'https:' || site.search || site.hash || site.username || site.password) {
    throw new Error('SITE_URL must be an HTTPS site base URL without query parameters or credentials');
  }
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  const absolute = value => new URL(value.replace(/^\//, ''), site).href;
  const generated = path.join(output, 'assets', 'generated');
  const readJson = file => JSON.parse(fs.readFileSync(path.join(generated, file), 'utf8'));
  const template = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  const imageDirectory = path.join(output, 'assets', 'share');
  fs.mkdirSync(imageDirectory, { recursive: true });
  const imageCache = new Map();

  // Reuse the site's own mark for entries without a featured image.
  const mark = await sharp(path.join(root, 'public', 'favicon.svg')).resize(280, 280).png().toBuffer();
  const brand = Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#fffaf2"/><rect x="0" y="0" width="1200" height="16" fill="#9a3412"/><text x="600" y="505" text-anchor="middle" font-family="serif" font-size="76" fill="#241d16">India History</text></svg>');
  const defaultBytes = await sharp(brand).composite([{ input: mark, left: 460, top: 110 }])
    .jpeg({ quality: 85, progressive: true }).toBuffer();
  const writeImage = bytes => {
    const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 20);
    const relative = `assets/share/${hash}.jpg`;
    fs.writeFileSync(path.join(output, relative), bytes);
    return { url: absolute(relative), width: WIDTH, height: HEIGHT };
  };
  const defaultImage = writeImage(defaultBytes);

  async function imageFor(entry) {
    const first = firstImage(entry.html);
    const src = entry.shareImage || first.src;
    if (!src) return { ...defaultImage, alt: entry.title || SITE_NAME };
    const url = new URL(src.startsWith('/') && !src.startsWith('//') ? src.slice(1) : src, site);
    if (url.protocol !== 'https:') throw new Error(`Share image must use HTTPS: ${src}`);
    const alt = (entry.shareImage && entry.shareImage !== first.src ? entry.title : first.alt) || entry.title;
    // External HTTPS overrides are used as supplied; no build-time network call.
    if (url.origin !== site.origin) return { url: url.href, alt };
    if (!url.pathname.startsWith(site.pathname)) throw new Error(`Share image is outside SITE_URL: ${src}`);
    const local = path.resolve(output, '.' + '/' + decodeURIComponent(url.pathname.slice(site.pathname.length)));
    if (!local.startsWith(path.resolve(output) + path.sep)) throw new Error(`Invalid share image path: ${src}`);
    const bytes = fs.readFileSync(local);
    const key = crypto.createHash('sha256').update(bytes).digest('hex');
    if (!imageCache.has(key)) {
      const jpeg = await sharp(bytes).rotate()
        .resize(WIDTH, HEIGHT, { fit: 'contain', background: BACKGROUND })
        .flatten({ background: BACKGROUND }).jpeg({ quality: 85, progressive: true }).toBuffer();
      imageCache.set(key, writeImage(jpeg));
    }
    return { ...imageCache.get(key), alt };
  }

  const pages = [];
  const writePage = (route, html) => {
    const file = path.join(output, route, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    pages.push(route);
  };
  const languages = options.languages || Object.keys(OG_LOCALES);
  const variants = new Map();
  for (const language of languages) {
    if (!OG_LOCALES[language]) throw new Error(`Unsupported share language: ${language}`);
    const prefix = language === 'en' ? '' : language + '/';
    variants.set(language, [
      ...readJson(prefix + 'articles.json').filter(entry => !entry.previewOnly)
        .map(entry => ({ ...readJson(`${prefix}stories/${entry.slug}.json`), kind: 'article' })),
      ...readJson(prefix + 'blogs.json').filter(entry => !entry.draft).map(entry => ({ ...entry, kind: 'blogs' })),
    ]);
  }
  const entries = variants.get('en');
  if (!entries) throw new Error('English content is required for share pages');
  const canonicalRoute = entry => entry.kind === 'article' && entry.period === 'world-history' && !entry.relatedTo
    ? `worldhistory/${entry.slug}` : `${entry.kind}/${entry.slug}`;
  const routeFor = (language, route) => (language === 'en' ? '' : language + '/') + route;
  for (const language of languages) {
    const localized = new Map(variants.get(language).map(entry => [entry.kind + '/' + entry.slug, entry]));
    const siteName = language === 'en' ? SITE_NAME : readJson(language + '/site.json')[SITE_NAME] || SITE_NAME;
    for (const source of entries) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.slug)) throw new Error(`Invalid share page slug: ${source.slug}`);
      const entry = localized.get(source.kind + '/' + source.slug);
      if (!entry) throw new Error(`Missing ${language} share translation: ${source.slug}`);
      const canonical = canonicalRoute(source);
      const route = routeFor(language, canonical);
      const html = renderHtml(template, {
        title: entry.title, description: entry.excerpt, type: 'article', language, siteName,
        url: absolute(route), image: await imageFor(entry),
        publishedAt: source.publishedAt, updatedAt: source.updatedAt,
        alternates: languages.map(code => ({ language: code, url: absolute(routeFor(code, canonical)) })),
      });
      writePage(route, html);
      // Existing /post links and the legacy /article world-history overview URL.
      if (entry.kind === 'article') {
        writePage(routeFor(language, `post/${entry.slug}`), html);
        if (canonical !== `article/${entry.slug}`) writePage(routeFor(language, `article/${entry.slug}`), html);
      }
    }
  }
  fs.writeFileSync(path.join(output, 'index.html'), renderHtml(template, {
    title: SITE_NAME, description: SITE_NAME, type: 'website', url: site.href,
    image: { ...defaultImage, alt: SITE_NAME },
  }));
  return { entries: entries.length, languages: languages.length, pages: pages.length, images: imageCache.size + 1 };
}

module.exports = { escapeHtml, firstImage, renderHtml, generateSharePages };
if (require.main === module) {
  generateSharePages().then(result => console.log(`Generated share previews: ${result.entries} entries, ${result.languages} languages, ${result.pages} routes, ${result.images} JPEG images`))
    .catch(error => { console.error(error); process.exitCode = 1; });
}
