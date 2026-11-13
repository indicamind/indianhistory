import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, readFile, readdir, rm, copyFile, writeFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const repo = path.resolve(root, '..');
const require = createRequire(path.join(repo, 'package.json'));
const sharp = require('sharp');
const { LANGUAGES } = require(path.join(repo, 'scripts/translation-languages.js'));
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const messages = JSON.parse(await readFile(path.join(root, 'translations.json'), 'utf8'));
const languages = ['en', ...LANGUAGES];

function run(file, args) {
  const result = spawnSync(process.execPath, [path.join(repo, file), ...args], { cwd: repo, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${file} failed (${result.signal || result.status}).`);
}

assert.deepEqual(Object.keys(messages).sort(), [...languages].sort(), 'Complete translations are required.');
for (const [language, copy] of Object.entries(messages)) {
  assert.equal(Object.keys(copy).sort().join(','), 'extensionDescription,extensionName', language);
  for (const value of Object.values(copy)) assert(typeof value === 'string' && value.trim(), language);
  assert([...copy.extensionDescription].length <= 132, language + ': description exceeds Chrome’s limit.');
}
assert.equal(manifest.manifest_version, 3);
assert(!manifest.chrome_url_overrides, 'The extension must preserve Chrome’s normal new-tab page.');
assert(manifest.action && !manifest.action.default_popup, 'The toolbar action must open the offline reader.');
assert.equal(manifest.background.service_worker, 'background.js');
assert(!manifest.permissions && !manifest.host_permissions, 'Offline reading requires no extra permissions.');
assert(manifest.content_security_policy.extension_pages.includes("connect-src 'self'"));

// The root build has already optimized images and generated the current content.
// Standalone extension builds do those local steps too, without fetching counters.
run('scripts/check-translations.js', []);
if (!process.argv.includes('--content-ready')) {
  run('scripts/optimize-images.js', []);
  run('scripts/build-content.js', []);
}
run('node_modules/@angular/cli/bin/ng.js', ['build', '--configuration', 'production,extension']);

const dist = path.join(root, 'dist');
const output = path.join(dist, 'india-history-new-tab');
await copyFile(path.join(root, 'manifest.json'), path.join(output, 'manifest.json'));
await copyFile(path.join(root, 'background.js'), path.join(output, 'background.js'));

// Chrome has fewer installation-label locales than the offline reader has editions.
const locales = {
  en: 'en', hi: 'hi', bn: 'bn', ta: 'ta', te: 'te', mr: 'mr', ur: 'ur', gu: 'gu',
  kn: 'kn', ml: 'ml', es: 'es', fr: 'fr', ar: 'ar', zh_CN: 'zh', zh_TW: 'zh',
  pt_BR: 'pt', pt_PT: 'pt', ja: 'ja', id: 'id', th: 'th', de: 'de', fa: 'fa',
  ru: 'ru', ko: 'ko', vi: 'vi', tr: 'tr', it: 'it', ms: 'ms', sw: 'sw', fil: 'fil',
};
for (const [locale, language] of Object.entries(locales)) {
  const directory = path.join(output, '_locales', locale);
  await mkdir(directory, { recursive: true });
  const copy = locale === 'zh_TW'
    ? { extensionName: '印度歷史', extensionDescription: '點選工具列圖示，離線閱讀印度歷史。所有內容均已內建。' }
    : messages[language];
  await writeFile(path.join(directory, 'messages.json'), JSON.stringify(
    Object.fromEntries(Object.entries(copy).map(([key, message]) => [key, { message }])), null, 2
  ) + '\n');
}

await mkdir(path.join(output, 'icons'), { recursive: true });
for (const size of [16, 32, 48, 128]) {
  await sharp(path.join(repo, 'public/favicon.svg'), { density: 192 })
    .resize(size, size).png().toFile(path.join(output, 'icons', `icon-${size}.png`));
}

const json = async file => JSON.parse(await readFile(path.join(output, file), 'utf8'));
const english = await json('assets/generated/articles.json');
const englishBlogs = await json('assets/generated/blogs.json');
let articleEditions = 0;
let blogEditions = 0;
const media = new Set();
function collectMedia(html) {
  for (const match of html.matchAll(/\b(?:src|srcset|poster)="([^"]+)"/g)) {
    if (match[1].startsWith('data:')) continue;
    for (const candidate of match[1].split(',')) {
      const source = candidate.trim().split(/\s+/)[0];
      assert(!/^(?:https?:)?\/\//i.test(source), 'Remote embedded resource: ' + source);
      if (source) media.add(source.replace(/^\//, ''));
    }
  }
}
for (const language of languages) {
  const prefix = 'assets/generated/' + (language === 'en' ? '' : language + '/');
  const articles = await json(prefix + 'articles.json');
  const blogs = await json(prefix + 'blogs.json');
  const profiles = await json(prefix + 'personality-profiles.json');
  for (const profile of Object.values(profiles)) {
    if (profile.image) media.add(profile.image.src.replace(/^\//, ''));
    if (profile.story) {
      assert(!profile.story.draft && !profile.story.preview, language + ': unpublished personality timeline');
      for (const chapter of profile.story.chapters) collectMedia(chapter.html);
      collectMedia(profile.story.sourcesHtml);
      // Keep reference text and URLs as metadata, without outbound navigation.
      profile.story.referenceUrls = [...new Set([...profile.story.sourcesHtml.matchAll(/\bhref="(https?:[^\"]*)"/gi)].map(match => match[1]))];
      profile.story.sourcesHtml = profile.story.sourcesHtml.replace(/<a\b[^>]*href="https?:[^\"]*"[^>]*>([\s\S]*?)<\/a>/gi, '<span>$1</span>');
    }
  }
  await writeFile(path.join(output, prefix + 'personality-profiles.json'), JSON.stringify(profiles));
  await writeFile(path.join(output, prefix + 'personality-story-drafts.json'), '{}\n');
  assert.equal(articles.length, english.length, language + ': incomplete articles');
  assert.equal(blogs.length, englishBlogs.length, language + ': incomplete blogs');
  for (const article of articles) {
    assert(!article.previewOnly && !article.draft, language + ': unpublished or untranslated article');
    const story = await json(prefix + 'stories/' + article.slug + '.json');
    assert(story.html.trim(), language + ': empty story');
    collectMedia(story.html);
    articleEditions++;
  }
  for (const blog of blogs) {
    assert(!blog.draft && !blog.previewOnly, language + ': unpublished blog');
    collectMedia(blog.html);
    blogEditions++;
  }
  if (language !== 'en') await json(prefix + 'site.json');
}
for (const file of await readdir(path.join(repo, 'src/app/data'))) {
  if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) continue;
  const source = await readFile(path.join(repo, 'src/app/data', file), 'utf8');
  for (const match of source.matchAll(/\bimageUrl['"]?\s*:\s*['"]([^'"]+)['"]/g)) {
    assert(!/^(?:https?:)?\/\//i.test(match[1]), 'Remote book cover: ' + match[1]);
    media.add(match[1].replace(/^\//, ''));
  }
}
for (const image of media) assert((await stat(path.join(output, image))).isFile(), 'Missing bundled image: ' + image);
// Never ship unpublished English drafts inside the installed extension.
for (const name of ['article-drafts.json', 'blog-drafts.json']) {
  await writeFile(path.join(output, 'assets/generated', name), '[]\n');
}
await writeFile(path.join(output, 'assets/generated/personality-story-drafts.json'), '{}\n');
const index = await readFile(path.join(output, 'newtab.html'), 'utf8');
assert(!/\b(?:src|href)="https?:\/\//i.test(index), 'The offline reader must not load remote resources.');
for (const file of await readdir(output)) {
  if (!file.endsWith('.css')) continue;
  const css = await readFile(path.join(output, file), 'utf8');
  assert(!/@import\s+(?:url\()?['"]?https?:|url\(['"]?https?:/i.test(css), 'Remote styles or fonts: ' + file);
}

await writeFile(path.join(output, 'offline-content.json'), JSON.stringify({
  builtAt: new Date().toISOString(), languages,
  articles: english.length, blogs: englishBlogs.length, articleEditions, blogEditions,
  mediaFiles: media.size, networkAccess: false,
}, null, 2) + '\n');
const archive = path.join(dist, 'india-history-new-tab.zip');
await rm(archive, { force: true });
const zipped = spawnSync('zip', ['-qr', archive, ...await readdir(output)], { cwd: output, encoding: 'utf8' });
if (zipped.error) throw zipped.error;
if (zipped.status !== 0) throw new Error(zipped.stderr || 'Could not package the extension.');
console.log(`Offline extension: ${output}\nZIP: ${archive}\nBundled ${english.length} articles and ${englishBlogs.length} blogs in ${languages.length} languages (${articleEditions} article editions).`);
