const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');
const matter = require('gray-matter');
const { marked } = require('marked');
const { LANGUAGES } = require('./translation-languages');

function sourceHash(source) {
  return crypto.createHash('sha256').update(JSON.stringify({
    title: source.data.title, excerpt: source.data.excerpt, body: source.content.trim(),
  })).digest('hex');
}

function chapterSourceHash(source) {
  return crypto.createHash('sha256').update(JSON.stringify(source.data.chapters)).digest('hex');
}

function readSources(root) {
  const directory = path.join(root, 'content/articles');
  return fs.existsSync(directory) ? fs.readdirSync(directory).filter(file => file.endsWith('.md'))
    .map(file => ({ file, ...matter.read(path.join(directory, file)) }))
    .filter(source => source.data.personalityStoryFor) : [];
}

function targets(content) {
  return [...marked.parse(content).matchAll(/\b(?:src|href)="([^"]+)"/g)].map(match => match[1]).sort();
}

function citations(content) {
  return [...content.matchAll(/\[(\d[\d,\s–-]*)\](?!\()/g)].map(match => match[1].replace(/\s/g, ''));
}

function headings(content) {
  return marked.lexer(content.trim()).filter(token => token.type === 'heading' && token.depth === 2);
}

function readTranslation(root, source, language) {
  const file = path.join(root, 'content/translations', language, 'articles', source.file);
  return fs.existsSync(file) ? matter.read(file) : undefined;
}

function translationProblems(source, translation) {
  if (!translation) return ['missing'];
  const problems = [];
  if (!translation.data.title || !translation.data.excerpt || !translation.content.trim()) problems.push('incomplete');
  if (translation.data.sourceHash !== sourceHash(source)) problems.push('stale');
  if (translation.data.chapterSourceHash !== chapterSourceHash(source)) problems.push('stale chapter metadata');
  if (translation.data.personalityStoryFor !== source.data.personalityStoryFor) problems.push('personality changed');
  const original = source.data.chapters || [], local = translation.data.chapters || [];
  if (headings(translation.content).length !== original.length + 1) problems.push('chapter count changed');
  if (local.length !== original.length || local.some((chapter, index) => {
    const english = original[index];
    return chapter.id !== english?.id || !chapter.date ||
      JSON.stringify(chapter.articles || []) !== JSON.stringify(english?.articles || []) ||
      JSON.stringify(chapter.date.match(/\d+/g) || []) !== JSON.stringify(english?.date.match(/\d+/g) || []);
  })) problems.push('chapter dates, identifiers or memberships changed');
  if (local.some((chapter, index) => {
    const image = original[index]?.image;
    if (!image) return !!chapter.image;
    return chapter.image?.file !== image.file || !chapter.image?.alt?.trim() || !chapter.image?.caption?.trim() ||
      chapter.image.alt === image.alt || chapter.image.caption === image.caption;
  })) problems.push('chapter images changed or lack translated alt text and captions');
  if (JSON.stringify(targets(source.content)) !== JSON.stringify(targets(translation.content))) problems.push('links or images changed');
  if (JSON.stringify(citations(source.content)) !== JSON.stringify(citations(translation.content))) problems.push('citations changed');
  const originalParagraphs = marked.lexer(source.content.trim()).filter(token => token.type === 'paragraph').map(token => token.text.trim());
  const localParagraphs = marked.lexer(translation.content.trim()).filter(token => token.type === 'paragraph').map(token => token.text.trim());
  if (localParagraphs.length !== originalParagraphs.length) problems.push('paragraph count changed');
  if (localParagraphs.some(paragraph => paragraph.length > 100 && originalParagraphs.includes(paragraph))) problems.push('untranslated prose');
  return problems;
}

function compileStory(source, articles, flags = {}) {
  const slug = source.data.personalityStoryFor;
  const tokens = marked.lexer(source.content.trim());
  const groups = [];
  let current = { title: '', tokens: [] };
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 2) {
      groups.push(current);
      current = { title: token.text, tokens: [] };
    } else current.tokens.push(token);
  }
  groups.push(current);
  const intro = groups.shift();
  assert.equal(groups.length, source.data.chapters.length + 1, `${slug}: chapter metadata differs from text`);
  const sources = groups.pop();
  const chapters = groups.map((group, index) => {
    const metadata = source.data.chapters[index];
    assert(metadata?.id && metadata.date, `${slug}: chapter needs a stable id and date`);
    const related = (metadata.articles || []).map(articleSlug => {
      const article = articles.find(entry => entry.slug === articleSlug);
      assert(article?.personalities.includes(slug), `${slug}: chapter article must belong to this personality: ${articleSlug}`);
      return { slug: article.slug, title: article.title };
    });
    return { id: metadata.id, date: metadata.date, title: group.title, html: marked.parser(group.tokens), articles: related };
  });
  const introHtml = marked.parser(intro.tokens), sourcesHtml = marked.parser(sources.tokens);
  assert(sourcesHtml, `${slug}: life story requires Sources`);
  assert(![introHtml, ...chapters.map(chapter => chapter.html)].some(html => /href="https?:/i.test(html)), `${slug}: external links belong in Sources`);
  return { title: source.data.title, introHtml, chapters, sourcesHtml, ...flags };
}

function releaseStatus(root, source) {
  const missing = LANGUAGES.filter(language => translationProblems(source, readTranslation(root, source, language)).length);
  return { ready: !missing.length, missing };
}

function translationReport(root) {
  const sources = readSources(root);
  const languages = Object.fromEntries(LANGUAGES.map(language => [language, sources.filter(source =>
    !translationProblems(source, readTranslation(root, source, language)).length).length]));
  return { personalities: sources.length, required: sources.length * LANGUAGES.length,
    complete: Object.values(languages).reduce((sum, count) => sum + count, 0),
    released: sources.filter(source => releaseStatus(root, source).ready).length, languages };
}

module.exports = { sourceHash, chapterSourceHash, readSources, readTranslation, translationProblems, compileStory, releaseStatus, translationReport };

if (require.main === module) console.log(JSON.stringify(translationReport(path.join(__dirname, '..')), null, 2));
