const fs = require('fs');
const path = require('path');
const assert = require('assert');
const matter = require('gray-matter');
const { marked } = require('marked');
const { readSources, readTranslation, releaseStatus, compileStory, translationProblems } = require('./personality-life-translations');

function text(html) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return html.replace(/<sup\b[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, ' ').replace(/\[(?:\d+[\s,–-]*)+\]/g, '')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, key) => entities[key])
    .replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function sections(html) {
  return [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|$)/g)]
    .map(match => ({ heading: text(match[1]), paragraphs: [...match[2]
      .replace(/<figure\b[\s\S]*?<\/figure>/gi, '')
      .matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(p => text(p[1])).filter(Boolean) }));
}

function buildProfiles(root, english, localized, copy = {}, language = 'en') {
  const definitions = JSON.parse(fs.readFileSync(path.join(root, 'content/data/personality-profiles.json'), 'utf8'));
  const stories = readSources(root).filter(source => releaseStatus(root, source).ready);
  const translate = source => copy[source] || source;
  return Object.fromEntries(Object.entries(definitions).map(([slug, definition]) => {
    const profile = { events: definition.events.map(event => ({ ...event, title: translate(event.title), date: event.date ? translate(event.date) : undefined })), sources: definition.sources };
    if (definition.article) {
      const original = english.find(a => a.slug === definition.article);
      const article = localized.find(a => a.slug === definition.article);
      assert(original && article, `${slug}: missing approved biography article`);
      assert(article.personalities.includes(slug), `${slug}: biography must belong to this personality`);
      profile.article = { slug: article.slug, title: article.title };
      if (definition.biography) {
        const originalSections = sections(original.html);
        const localSections = sections(article.html);
        const index = originalSections.findIndex(s => s.heading === definition.biography.heading);
        assert(index >= 0, `${slug}: biography heading was changed`);
        const start = definition.biography.paragraph || 0;
        const count = definition.biography.count || 1;
        if (definition.biography.overrideLanguages?.includes(language)) {
          profile.paragraphs = originalSections[index].paragraphs.slice(start, start + count).map(paragraph => {
            assert(copy[paragraph], `${slug}: approved biography excerpt needs a ${language} translation`);
            return copy[paragraph];
          });
        } else {
          assert(localSections.length >= originalSections.length, `${slug}: translated biography needs an explicit section mapping`);
          profile.paragraphs = localSections[index].paragraphs.slice(start, start + count);
        }
        assert.equal(profile.paragraphs.length, count, `${slug}: missing translated biography paragraphs`);
      }
    }
    for (const event of profile.events) {
      const articleSlug = event.article || definition.article;
      if (articleSlug) {
        const article = localized.find(a => a.slug === articleSlug);
        assert(article?.personalities.includes(slug), `${slug}: milestone links must match article membership`);
        event.article = articleSlug;
        event.articleTitle = article.title;
      }
    }
    if (definition.image) {
      const record = JSON.parse(fs.readFileSync(path.join(root, 'content/media/images', definition.image.file.replace(/\.[^.]+$/, '.license.json')), 'utf8'));
      const src = 'assets/media/images/' + definition.image.file;
      const figure = localized.flatMap(article => [...article.html.matchAll(/<figure\b[\s\S]*?<\/figure>/g)])
        .find(match => match[0].includes(definition.image.file));
      assert(figure, `${slug}: image must already appear in approved translated content`);
      const alt = figure[0].match(/<img\b[^>]*\balt="([^"]*)"/)?.[1];
      const credit = figure[0].match(/<span\b[^>]*class="figure-credit"[^>]*>([\s\S]*?)<\/span>/)?.[1];
      assert(credit, `${slug}: approved image attribution must remain visible`);
      profile.image = { src, alt: text(alt || ''), credit: text(credit), landscape: !!definition.image.landscape, kind: translate(definition.image.kind), author: record.author,
        license: /public domain/i.test(record.license) ? translate('Public domain') : record.license,
        sourceUrl: record.sourcePageUrl, licenseUrl: record.licenseUrl };
    }
    const story = stories.find(source => source.data.personalityStoryFor === slug);
    if (story) profile.story = compileStory(language === 'en' ? story : readTranslation(root, story, language), localized);
    return [slug, profile];
  }));
}

function writeProfiles(root, output, english, localized, copy, language) {
  fs.writeFileSync(path.join(output, 'personality-profiles.json'), JSON.stringify(buildProfiles(root, english, localized, copy, language)));
  if (language && language !== 'en') {
    const previews = {};
    for (const source of readSources(root)) {
      const translation = readTranslation(root, source, language);
      if (!releaseStatus(root, source).ready && !translationProblems(source, translation).length) {
        previews[source.data.personalityStoryFor] = compileStory(translation, localized, { preview: true });
      }
    }
    fs.writeFileSync(path.join(output, 'personality-story-drafts.json'), JSON.stringify(previews));
  }
}

function writeProfileDrafts(root, output, articles) {
  const directory = path.join(root, 'content/drafts/articles');
  const drafts = {};
  for (const source of readSources(root)) {
    if (!releaseStatus(root, source).ready) {
      drafts[source.data.personalityStoryFor] = compileStory(source, articles, { preview: true });
    }
  }
  for (const file of fs.existsSync(directory) ? fs.readdirSync(directory).filter(f => f.endsWith('.md')) : []) {
    const { data, content } = matter.read(path.join(directory, file));
    if (!data.personalityStoryFor) continue;
    const slug = data.personalityStoryFor;
    assert(!drafts[slug], `Duplicate personality story draft: ${slug}`);
    const tokens = marked.lexer(content.trim());
    const chapters = [];
    let current = [];
    let introHtml = '';
    let sourcesHtml = '';
    let heading;
    const flush = () => {
      const html = marked.parser(current);
      if (!heading) introHtml = html;
      else if (heading === 'Sources') sourcesHtml = html;
      else {
        const metadata = data.chapters?.[chapters.length];
        assert(metadata?.id && metadata.date, `${slug}: each chapter needs a stable id and date`);
        const related = (metadata.articles || []).map(articleSlug => {
          const article = articles.find(a => a.slug === articleSlug);
          assert(article?.personalities.includes(slug), `${slug}: chapter article must belong to this personality: ${articleSlug}`);
          return { slug: article.slug, title: article.title };
        });
        chapters.push({ id: metadata.id, date: metadata.date, title: heading, html, articles: related });
      }
      current = [];
    };
    for (const token of tokens) {
      if (token.type === 'heading' && token.depth === 2) { flush(); heading = token.text; }
      else current.push(token);
    }
    flush();
    assert.equal(chapters.length, data.chapters.length, `${slug}: chapter metadata differs from draft`);
    assert(sourcesHtml, `${slug}: life story requires Sources`);
    assert(![introHtml, ...chapters.map(c => c.html)].some(html => /href="https?:/i.test(html)), `${slug}: external links belong in Sources`);
    drafts[slug] = { title: data.title, introHtml, chapters, sourcesHtml, draft: true };
  }
  fs.writeFileSync(path.join(output, 'personality-story-drafts.json'), JSON.stringify(drafts));
  console.log(`Built ${Object.keys(drafts).length} English personality story review preview(s) for dev mode`);
}

module.exports = { buildProfiles, writeProfiles, writeProfileDrafts, sections };
