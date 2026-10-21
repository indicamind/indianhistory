const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { generateSharePages, firstImage, renderHtml } = require('./generate-share-pages');

describe('Build-time social previews', () => {
  let root;
  let output;
  const template = '<!doctype html><html><head><title>India History</title><base href="/"></head><body><app-root></app-root><script src="main.js"></script></body></html>';

  beforeEach(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-share-test-'));
    output = path.join(root, 'dist');
    fs.mkdirSync(path.join(root, 'public'), { recursive: true });
    fs.writeFileSync(path.join(root, 'public/favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#9a3412"/></svg>');
    fs.mkdirSync(path.join(output, 'assets/generated/stories'), { recursive: true });
    fs.mkdirSync(path.join(output, 'assets/media'), { recursive: true });
    fs.writeFileSync(path.join(output, 'index.html'), template);
    await sharp({ create: { width: 80, height: 160, channels: 3, background: '#334455' } }).png().toFile(path.join(output, 'assets/media/photo.png'));
    await sharp({ create: { width: 160, height: 80, channels: 3, background: '#557755' } }).webp().toFile(path.join(output, 'assets/media/override.webp'));
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  function content() {
    const base = { publishedAt: '2026-10-21', updatedAt: '2026-10-21', excerpt: 'History & evidence', html: '<img src="assets/media/photo.png" alt="Greek &amp; Aramaic">' };
    const articles = [
      { ...base, slug: 'one', title: 'A & "B" <C>' },
      { ...base, slug: 'two', title: 'Override', shareImage: '/assets/media/override.webp' },
      { ...base, slug: 'event', title: 'World history', period: 'world-history', html: '<p>No image</p>' },
      { ...base, slug: 'remote', title: 'External', shareImage: 'https://cdn.example.test/share.jpg' },
      { ...base, slug: 'unreleased', title: 'Unreleased', previewOnly: true },
    ];
    const blogs = [
      { ...base, slug: 'blog', title: 'A blog' },
      { ...base, slug: 'draft', title: 'Unapproved draft', draft: true },
    ];
    fs.writeFileSync(path.join(output, 'assets/generated/articles.json'), JSON.stringify(articles));
    for (const article of articles) fs.writeFileSync(path.join(output, 'assets/generated/stories', article.slug + '.json'), JSON.stringify(article));
    fs.writeFileSync(path.join(output, 'assets/generated/blogs.json'), JSON.stringify(blogs));
  }

  it('writes crawler-readable metadata, compatible images and canonical aliases without JavaScript', async () => {
    content();
    const result = await generateSharePages({ root, output, languages: ['en'], siteUrl: 'https://example.test/' });
    expect(result.entries).toBe(5);
    const one = fs.readFileSync(path.join(output, 'article/one/index.html'), 'utf8');
    const blog = fs.readFileSync(path.join(output, 'blogs/blog/index.html'), 'utf8');
    const override = fs.readFileSync(path.join(output, 'article/two/index.html'), 'utf8');
    const remote = fs.readFileSync(path.join(output, 'article/remote/index.html'), 'utf8');
    const head = one.split('</head>')[0];
    expect(head).toContain('property="og:type" content="article"');
    expect(head).toContain('property="og:title" content="A &amp; &quot;B&quot; &lt;C&gt;"');
    expect(head).toContain('name="description" content="History &amp; evidence"');
    expect(head).toContain('property="og:image:alt" content="Greek &amp; Aramaic"');
    expect(head).toContain('name="twitter:card" content="summary_large_image"');
    expect(head).toContain('property="article:published_time" content="2026-10-21T00:00:00.000Z"');
    expect(one).toContain('<base href="/">');
    expect(one).toContain('<script src="main.js"></script>');
    const image = html => html.match(/property="og:image" content="([^"]+)"/)[1];
    expect(image(one)).toBe(image(blog));
    expect(image(override)).not.toBe(image(one));
    expect(image(remote)).toBe('https://cdn.example.test/share.jpg');
    expect(remote).not.toContain('property="og:image:width"');
    for (const file of fs.readdirSync(path.join(output, 'assets/share'))) {
      const metadata = await sharp(path.join(output, 'assets/share', file)).metadata();
      expect(metadata.format).toBe('jpeg');
      expect(metadata.width).toBe(1200);
      expect(metadata.height).toBe(630);
    }
    const event = fs.readFileSync(path.join(output, 'article/event/index.html'), 'utf8');
    expect(event).toContain('rel="canonical" href="https://example.test/worldhistory/event"');
    expect(fs.readFileSync(path.join(output, 'post/one/index.html'), 'utf8')).toContain('rel="canonical" href="https://example.test/article/one"');
    expect(fs.existsSync(path.join(output, 'article/unreleased/index.html'))).toBeFalsy();
    expect(fs.existsSync(path.join(output, 'blogs/draft/index.html'))).toBeFalsy();
  });

  it('respects a deployment URL prefix and stays idempotent', async () => {
    content();
    await generateSharePages({ root, output, languages: ['en'], siteUrl: 'https://example.test/history/' });
    await generateSharePages({ root, output, languages: ['en'], siteUrl: 'https://example.test/history/' });
    const html = fs.readFileSync(path.join(output, 'article/one/index.html'), 'utf8');
    expect(html).toContain('rel="canonical" href="https://example.test/history/article/one"');
    expect(html).toContain('property="og:image" content="https://example.test/history/assets/share/');
    expect((html.match(/property="og:title"/g) || []).length).toBe(1);
  });

  it('extracts alt text without losing apostrophes and decodes entities', () => {
    expect(firstImage('<img data-src="wrong.jpg" src="assets/a.jpg" alt="Ashoka\'s &quot;words&quot; &#x26; stone">')).toEqual({ src: 'assets/a.jpg', alt: 'Ashoka\'s "words" & stone' });
  });

  it('generates translated metadata and canonical URLs while sharing the same JPEG assets', async () => {
    content();
    for (const [language, title, description, alt] of [
      ['hi', 'अशोक के अभिलेख', 'अशोक का संदेश', 'कंधार का अभिलेख'],
      ['ar', 'نقوش أشوكا', 'رسالة أشوكا', 'نقش قندهار'],
    ]) {
      const base = path.join(output, 'assets/generated');
      const dir = path.join(base, language);
      fs.mkdirSync(path.join(dir, 'stories'), { recursive: true });
      const articles = JSON.parse(fs.readFileSync(path.join(base, 'articles.json'))).map(entry => ({ ...entry, title, excerpt: description, html: `<img src="assets/media/photo.png" alt="${alt}">` }));
      fs.writeFileSync(path.join(dir, 'articles.json'), JSON.stringify(articles));
      for (const entry of articles) fs.writeFileSync(path.join(dir, 'stories', entry.slug + '.json'), JSON.stringify(entry));
      const blogs = JSON.parse(fs.readFileSync(path.join(base, 'blogs.json'))).map(entry => ({ ...entry, title, excerpt: description, html: `<img src="assets/media/photo.png" alt="${alt}">` }));
      fs.writeFileSync(path.join(dir, 'blogs.json'), JSON.stringify(blogs));
      fs.writeFileSync(path.join(dir, 'site.json'), JSON.stringify({ 'India History': title }));
    }
    const result = await generateSharePages({ root, output, languages: ['en', 'hi', 'ar'], siteUrl: 'https://example.test/' });
    expect(result.languages).toBe(3);
    expect(result.images).toBe(3);
    const hindi = fs.readFileSync(path.join(output, 'hi/article/one/index.html'), 'utf8');
    const arabic = fs.readFileSync(path.join(output, 'ar/blogs/blog/index.html'), 'utf8');
    expect(hindi).toContain('property="og:title" content="अशोक के अभिलेख"');
    expect(hindi).toContain('property="og:description" content="अशोक का संदेश"');
    expect(hindi).toContain('property="og:image:alt" content="कंधार का अभिलेख"');
    expect(hindi).toContain('property="og:locale" content="hi_IN"');
    expect(hindi).toContain('rel="canonical" href="https://example.test/hi/article/one"');
    expect(hindi).toContain('hreflang="ar" href="https://example.test/ar/article/one"');
    expect(arabic).toContain('lang="ar" dir="rtl"');
    expect(arabic).toContain('property="og:title" content="نقوش أشوكا"');
    expect(arabic).toContain('property="og:url" content="https://example.test/ar/blogs/blog"');
    const image = html => html.match(/property="og:image" content="([^"]+)"/)[1];
    expect(image(hindi)).toBe(image(arabic));
  });

  it('escapes metadata so text cannot inject HTML into the head', () => {
    const html = renderHtml(template, {
      title: '</title><script>bad()</script>', description: '" onload="bad()',
      url: 'https://example.test/article/one', type: 'article',
      image: { url: 'https://example.test/image.jpg', alt: '<danger>' },
    });
    expect(html).not.toContain('<script>bad()</script>');
    expect(html).toContain('&lt;/title&gt;&lt;script&gt;bad()&lt;/script&gt;');
    expect(html).toContain('content="&quot; onload=&quot;bad()"');
  });
});
