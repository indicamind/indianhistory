const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');
const { marked } = require('marked');
const compiler = require('@angular/compiler');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const { LANGUAGES, IN_PROGRESS_LANGUAGES = new Set() } = require('./translation-languages');
const SOURCE_FILES = ['src/app/data/periods.ts'];
const VISIBLE_FIELDS = new Set(['name', 'range', 'shortDescription', 'description', 'date', 'title', 'summary']);
const DYNAMIC_COPY = [
  'Saving…', 'Vote removed.',
  "Article feedback", "Thumbs up", "Thumbs down", "Thanks for your feedback.", "Could not save your vote. Please try again.",
  'Explore kingdoms', 'Explore sub-periods & topics', '{count} articles across these kingdoms',
  'All', 'Articles', 'Periods', 'Article', 'Period', 'Empire', 'Kingdom', 'Theme', 'Personality', 'Book',
  '← Back to', '← Back to home', '← Back to Empires', '← Back to Kingdoms', '← Back to Themes',
  '← Back to Personalities', '← Back to search', 'Book by', 'by', 'pages', 'article', 'articles',
  'books', 'result(s)', 'Ancient & medieval', 'Biographies', 'Colonial & freedom struggle', 'Economic history',
  'General history', 'Hardback', 'Hardcover', 'Kindle', 'Mass Market Paperback', 'Military history',
  'Modern India', 'Paperback', 'Prehistory & environment', 'Print edition', 'Regional history',
  'Society & culture', 'World history',
  'Indian history library', 'More to explore', 'Explore the book collection', 'More history books',
  'Published', 'Updated', 'Show all', 'Show fewer', '{count} articles', '{count} results', '{count} view', '{count} views',
  'Showing {visible} of {total} books',
  'Showing {visible} of {total} books after the recommendations above',
  '{count} books · {pending} awaiting affiliate links. Red cards use regular Amazon.in links.',
  '{count} articles across this {kind}',
  '{count} articles across this {kind} and its sub-periods',
  'No articles yet for this {kind}. More articles are being added.',
  'No results for “{query}”.',
  'English preview · Translations in progress',
  'English draft · Awaiting approval',
  'Translated by AI.',
  'Article navigation', 'Next article', 'Previous article', 'Explore related topics',
];
const STRINGS = new Set();

function collectTemplate(node) {
  if (node.constructor.name === 'Text' && node.value.trim()) STRINGS.add(node.value.trim());
  for (const attr of node.attributes || []) {
    if (['alt', 'placeholder', 'aria-label', 'title'].includes(attr.name) && attr.value.trim()) STRINGS.add(attr.value.trim());
  }
  for (const child of node.children || []) collectTemplate(child);
  for (const branch of node.branches || []) {
    for (const child of branch.children || []) collectTemplate(child);
  }
}

function collectSiteStrings() {
  const app = path.join(ROOT, 'src/app');
  function walk(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name);
      if (item.isDirectory()) walk(file);
      else if (item.name.endsWith('.component.html')) {
        const parsed = compiler.parseTemplate(fs.readFileSync(file, 'utf8'), file);
        if (parsed.errors?.length) throw new Error(`Could not parse ${file}`);
        for (const node of parsed.nodes) collectTemplate(node);
      }
    }
  }
  walk(app);
  for (const name of SOURCE_FILES) {
    const file = path.join(ROOT, name);
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isPropertyAssignment(node) && VISIBLE_FIELDS.has(node.name.getText(source)) &&
          (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))) {
        STRINGS.add(node.initializer.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  for (const name of sourceFiles('articles')) {
    const { data } = matter(fs.readFileSync(path.join(ROOT, 'content', 'articles', name), 'utf8'));
    if (typeof data.eventDate === 'string') STRINGS.add(data.eventDate);
  }
  for (const value of DYNAMIC_COPY) STRINGS.add(value);
  return [...STRINGS].filter(value => /\p{L}/u.test(value));
}

function hash(data, content) {
  return crypto.createHash('sha256').update(JSON.stringify({
    title: data.title,
    excerpt: data.excerpt,
    body: content.trim(),
  })).digest('hex');
}

function urls(html) {
  return [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(match => match[1]).sort();
}

function sourceFiles(kind) {
  const directory = path.join(ROOT, 'content', kind);
  return fs.readdirSync(directory).filter(name => name.endsWith('.md'));
}

function placeholders(value) {
  return [...String(value).matchAll(/\{([a-z]+)\}/g)].map(match => match[1]).sort().join(',');
}

function checkContent(kind, language) {
  const problems = [];
  for (const name of sourceFiles(kind)) {
    const source = matter(fs.readFileSync(path.join(ROOT, 'content', kind, name), 'utf8'));
    const translatedFile = path.join(ROOT, 'content', 'translations', language, kind, name);
    if (!fs.existsSync(translatedFile)) {
      if (source.data.previewOnly !== true) problems.push(`${kind}/${name}: missing`);
      continue;
    }
    const translation = matter(fs.readFileSync(translatedFile, 'utf8'));
    if (!translation.data.title || !translation.data.excerpt || !translation.content.trim()) {
      problems.push(`${kind}/${name}: incomplete`);
    } else if (source.data.tags?.length && (!Array.isArray(translation.data.tags) || translation.data.tags.length !== source.data.tags.length || translation.data.tags.some(tag => !tag))) {
      problems.push(`${kind}/${name}: tags missing`);
    } else if (translation.data.sourceHash !== hash(source.data, source.content)) {
      problems.push(`${kind}/${name}: stale`);
    } else if (JSON.stringify(urls(marked.parse(source.content.trim()))) !== JSON.stringify(urls(marked.parse(translation.content.trim())))) {
      problems.push(`${kind}/${name}: links or images changed`);
    }
  }
  return problems;
}

module.exports = { collectSiteStrings };

if (require.main === module) {
  const siteStrings = collectSiteStrings();
  const previewFiles = sourceFiles('articles').filter(name => {
    const { data } = matter(fs.readFileSync(path.join(ROOT, 'content', 'articles', name), 'utf8'));
    return data.previewOnly === true;
  });
  let failed = false;
  for (const language of LANGUAGES) {
    const isProgress = IN_PROGRESS_LANGUAGES.has(language);
    const contentProblems = [...checkContent('articles', language), ...checkContent('blogs', language)];
    const siteFile = path.join(ROOT, 'content', 'translations', language, 'site.json');
    const siteProblems = [];
    if (!fs.existsSync(siteFile)) {
      siteProblems.push(`site.json: missing ${siteStrings.length} interface and history strings`);
    } else {
      const copy = JSON.parse(fs.readFileSync(siteFile, 'utf8'));
      const missing = siteStrings.filter(value => typeof copy[value] !== 'string' || !copy[value]);
      if (missing.length) siteProblems.push(`site.json: missing ${missing.length} of ${siteStrings.length} strings`);
      const mismatched = siteStrings.filter(value => copy[value] && placeholders(value) !== placeholders(copy[value]));
      if (mismatched.length) siteProblems.push(`site.json: ${mismatched.length} placeholder mismatch(es)`);
    }

    if (isProgress) {
      // In-progress editions must have a complete site.json interface.
      // Missing articles/blogs are expected as English previews, but any broken or stale
      // translations that exist must be reported as errors.
      const realContentProblems = contentProblems.filter(p => !p.endsWith(': missing'));
      const allProblems = [...siteProblems, ...realContentProblems];
      const missingArticles = contentProblems.filter(p => p.startsWith('articles/') && p.endsWith(': missing')).length;
      const missingBlogs = contentProblems.filter(p => p.startsWith('blogs/') && p.endsWith(': missing')).length;
      if (allProblems.length) {
        console.log(`${language}: in-progress edition incomplete; ${allProblems.join('; ')}`);
        failed = true;
      } else {
        console.log(`${language}: in-progress edition interface complete; ${missingArticles} article preview(s), ${missingBlogs} blog preview(s)`);
      }
    } else {
      const problems = [...contentProblems, ...siteProblems];
      const previewCount = previewFiles.filter(name => !fs.existsSync(path.join(ROOT, 'content', 'translations', language, 'articles', name))).length;
      console.log(`${language}: ${problems.length ? problems.join('; ') : `released content complete; ${previewCount} English preview(s)`}`);
      if (problems.length) failed = true;
    }
  }
  if (failed) process.exitCode = 1;
}
