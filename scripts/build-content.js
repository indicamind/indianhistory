const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const crypto = require('crypto');
const { collectSiteStrings } = require('./check-translations');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const BLOGS_DIR = path.join(ROOT, 'content', 'blogs');
const MEDIA_DIR = path.join(ROOT, 'content', 'media', 'images');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'generated');
const PUBLIC_MEDIA_DIR = path.join(ROOT, 'public', 'assets', 'media', 'images');
const TRANSLATION_DIR = path.join(ROOT, 'content', 'translations');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'es', 'fr', 'ar', 'zh', 'pt'];

marked.setOptions({ gfm: true });

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function relativeMediaUrls(html) {
  return html.replace(/\b(src|href)="\/assets\/media\//g, '$1="assets/media/');
}

function storySummary(article) {
  const { html, ...summary } = article;
  const image = html.match(/<img\b[^>]*>/i)?.[0];
  const src = image?.match(/\bsrc="([^"]*)"/i)?.[1];
  const alt = image?.match(/\balt="([^"]*)"/i)?.[1] || '';
  return src ? { ...summary, thumbnail: { src, alt } } : summary;
}

function writeStories(directory, articles) {
  const storiesDirectory = path.join(directory, 'stories');
  fs.rmSync(storiesDirectory, { recursive: true, force: true });
  fs.mkdirSync(storiesDirectory, { recursive: true });
  const generatedArticles = articles.map(article => ({ ...article, html: relativeMediaUrls(article.html) }));
  for (const article of generatedArticles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid story slug: ${article.slug}`);
    }
    fs.writeFileSync(path.join(storiesDirectory, `${article.slug}.json`), JSON.stringify(article));
  }
  fs.writeFileSync(path.join(directory, 'articles.json'), JSON.stringify(generatedArticles.map(storySummary)));
}

function writeBlogs(directory, blogs) {
  fs.writeFileSync(path.join(directory, 'blogs.json'), JSON.stringify(blogs.map(blog => ({
    ...blog,
    html: relativeMediaUrls(blog.html),
  })), null, 2));
}

function sourceFile(kind, slug) {
  const directory = path.join(ROOT, 'content', kind);
  return fs.readdirSync(directory).find(name => {
    if (!name.endsWith('.md')) return false;
    const { data } = matter(fs.readFileSync(path.join(directory, name), 'utf8'));
    return (data.slug || path.basename(name, '.md')) === slug;
  });
}

function translationHash(kind, slug) {
  const directory = path.join(ROOT, 'content', kind);
  const file = sourceFile(kind, slug);
  if (!file) return null;
  const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
  return crypto.createHash('sha256').update(JSON.stringify({
    title: data.title,
    excerpt: data.excerpt,
    body: content.trim(),
  })).digest('hex');
}

function targets(html) {
  return [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(match => match[1]).sort();
}

function placeholders(value) {
  return [...String(value).matchAll(/\{([a-z]+)\}/g)].map(match => match[1]).sort().join(',');
}

function translatedEntries(kind, language, entries) {
  return entries.map(entry => {
    const sourceName = sourceFile(kind, entry.slug);
    if (!sourceName) return null;
    const file = path.join(TRANSLATION_DIR, language, kind, sourceName);
    if (!fs.existsSync(file)) return null;
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    if (!data.title || !data.excerpt || !content.trim() || data.sourceHash !== translationHash(kind, entry.slug)) return null;
    if (entry.tags.length && (!Array.isArray(data.tags) || data.tags.length !== entry.tags.length || data.tags.some(tag => !tag))) return null;
    const html = marked.parse(content.trim());
    if (JSON.stringify(targets(html)) !== JSON.stringify(targets(entry.html))) return null;
    return { ...entry, title: String(data.title), excerpt: String(data.excerpt), tags: data.tags || [], html };
  });
}

function writeLocalizedContent(articles, blogs) {
  const requiredSiteStrings = collectSiteStrings();
  const available = ['en'];
  for (const language of LANGUAGES) {
    const directory = path.join(OUT_DIR, language);
    fs.mkdirSync(directory, { recursive: true });
    fs.rmSync(path.join(directory, 'stories'), { recursive: true, force: true });
    for (const file of ['articles.json', 'blogs.json', 'search-index.json', 'site.json']) {
      const generated = path.join(directory, file);
      if (fs.existsSync(generated)) fs.unlinkSync(generated);
    }
    const siteFile = path.join(TRANSLATION_DIR, language, 'site.json');
    let siteComplete = false;
    if (fs.existsSync(siteFile)) {
      const copy = JSON.parse(fs.readFileSync(siteFile, 'utf8'));
      if (requiredSiteStrings.every(value => typeof copy[value] === 'string' && copy[value] && placeholders(value) === placeholders(copy[value]))) {
        siteComplete = true;
      } else {
        console.warn(`${language}: incomplete site.json`);
      }
    } else {
      console.warn(`${language}: missing site.json`);
    }
    const localizedArticles = translatedEntries('articles', language, articles);
    const localizedBlogs = translatedEntries('blogs', language, blogs);
    if (!siteComplete || localizedArticles.some(entry => !entry) || localizedBlogs.some(entry => !entry)) {
      console.warn(`${language}: incomplete translations in content/translations/${language}/`);
      continue;
    }
    fs.copyFileSync(siteFile, path.join(directory, 'site.json'));
    writeStories(directory, localizedArticles);
    writeBlogs(directory, localizedBlogs);
    fs.writeFileSync(path.join(directory, 'search-index.json'), JSON.stringify(localizedArticles.map(article => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      text: [article.title, article.excerpt, stripHtml(article.html)].join(' '),
    })), null, 2));
    available.push(language);
  }
  fs.writeFileSync(path.join(ROOT, 'src', 'app', 'i18n', 'available-languages.generated.ts'),
    `// Generated by scripts/build-content.js. Do not edit.\nexport const AVAILABLE_LANGUAGES: readonly string[] = ${JSON.stringify(available)};\n`);
}

function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort();

  const articles = files.map((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || path.basename(file, '.md');
    const publishedAt = data.publishedAt || new Date().toISOString();
    const updatedAt = data.updatedAt || publishedAt;
    const body = content.trim();
    const html = body ? marked.parse(body) : '';

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      html,
      publishedAt,
      updatedAt,
      tags: Array.isArray(data.tags) ? data.tags : [],
      period: typeof data.period === 'string' ? data.period : undefined,
      polity: typeof data.polity === 'string' ? data.polity : undefined,
      themes: Array.isArray(data.themes) ? data.themes : [],
      personalities: Array.isArray(data.personalities) ? data.personalities : [],
      books: Array.isArray(data.books) ? data.books.map(String) : [],
      eventDate: typeof data.eventDate === 'string' ? data.eventDate : undefined,
      timelineOrder: typeof data.timelineOrder === 'number' ? data.timelineOrder : undefined,
      relatedTo: typeof data.relatedTo === 'string' ? data.relatedTo : undefined,
    };
  });

  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const searchIndex = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    text: [article.title, article.excerpt, stripHtml(article.html)].join(' '),
  }));

  writeStories(OUT_DIR, articles);
  fs.writeFileSync(
    path.join(OUT_DIR, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );

  const blogs = buildBlogs();
  writeBlogs(OUT_DIR, blogs);

  writeLocalizedContent(articles, blogs);

  copyMedia();

  console.log(`Built ${articles.length} article(s) → src/assets/generated/`);
  console.log(`Built ${blogs.length} blog post(s) → src/assets/generated/`);
}

function buildBlogs() {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });

  const blogs = fs.readdirSync(BLOGS_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8'));
      const slug = data.slug || path.basename(file, '.md');
      if (!data.title || !data.publishedAt) {
        throw new Error(`Blog post ${file} needs title and publishedAt frontmatter`);
      }
      const html = marked.parse(content.trim());
      return {
        slug,
        title: String(data.title),
        excerpt: data.excerpt || stripHtml(html).slice(0, 220),
        html,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt || data.publishedAt,
        author: data.author || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    });

  blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return blogs;
}

function copyMedia() {
  if (!fs.existsSync(MEDIA_DIR)) {
    return;
  }

  fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
  const entries = fs.readdirSync(MEDIA_DIR);
  let copied = 0;

  for (const name of entries) {
    const src = path.join(MEDIA_DIR, name);
    if (!fs.statSync(src).isFile()) {
      continue;
    }
    fs.copyFileSync(src, path.join(PUBLIC_MEDIA_DIR, name));
    copied += 1;
  }

  if (copied > 0) {
    console.log(`Copied ${copied} media file(s) → public/assets/media/images/`);
  }
}

build();
