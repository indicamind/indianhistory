/**
 * Assemble reviewed, human-authored Ashoka translations into article Markdown.
 *
 * Language files in content/ashoka-localizations/ contain the translated prose
 * and the complete translated inscription. The ancient transliteration and the
 * cited English edition is named as the source of the localized translation.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

const root = path.join(__dirname, '..');
const sourceDir = path.join(root, 'content', 'articles');
const localeDir = path.join(root, 'content', 'ashoka-localizations');
const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'es', 'fr', 'ar', 'zh', 'pt'];

function section(body, heading, nextHeading) {
  const from = body.indexOf(`## ${heading}\n`);
  if (from < 0) throw new Error(`Missing section ${heading}`);
  const start = from + heading.length + 4;
  const end = nextHeading ? body.indexOf(`## ${nextHeading}\n`, start) : body.length;
  if (end < 0) throw new Error(`Missing section ${nextHeading}`);
  return body.slice(start, end).trim();
}

function hash(data, body) {
  return crypto.createHash('sha256').update(JSON.stringify({
    title: data.title,
    excerpt: data.excerpt,
    body: body.trim(),
  })).digest('hex');
}

function yaml(value) {
  return JSON.stringify(value);
}

function frontmatter(source, localized, sourceHash) {
  const tags = localized.tags;
  if (!Array.isArray(tags) || tags.length !== (source.data.tags || []).length) {
    throw new Error(`${source.data.slug}: expected ${source.data.tags?.length || 0} translated tags`);
  }
  return source.isEmpty ? '' : source.raw.match(/^---\n([\s\S]*?)\n---/)[1]
    .split('\n')
    .filter(line => !line.startsWith('sourceHash:'))
    .map(line => line.startsWith('title:') ? `title: ${yaml(localized.title)}` :
      line.startsWith('excerpt:') ? `excerpt: ${yaml(localized.excerpt)}` :
      line.startsWith('tags:') ? `tags: ${yaml(tags)}` : line)
    .concat(`sourceHash: ${sourceHash}`)
    .join('\n');
}

function articleBody(source, localized, common, language) {
  const body = source.content.trim();
  if (localized.body) return localized.body.trim() + '\n';
  if (localized.blocks) return blockTranslatedBody(source, localized, common);
  if (source.data.slug === 'ashoka-edicts') {
    throw new Error(`${language}: missing translated guide body`);
  }

  const aboutHeading = body.includes('## About this edict\n') ? 'About this edict' : 'About this inscription';
  const figures = section(body, 'Original script', 'Roman transliteration');
  const imageCount = [...figures.matchAll(/<figure\b/g)].length;
  const sourceAlts = [...figures.matchAll(/<img[^>]+alt="([^"]+)"/g)].map(match => match[1]);
  const sourceCaptions = [...figures.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map(match => match[1]);
  const siteFrom = (value, pattern) => common.siteNames?.[value.match(pattern)?.[1]];
  const applySite = (template, site) => template && site ? template.replace('{site}', site) : undefined;
  const alts = localized.imageAlts || sourceAlts.map(value => common.imageAltTranslations?.[value] ||
    applySite(common.siteAltTemplate, siteFrom(value, /^Brahmi inscription facsimile from (.+?) in Hultzsch/)));
  const captions = localized.imageCaptions || sourceCaptions.map(value => common.imageCaptionTranslations?.[value] ||
    applySite(common.siteCaptionTemplate, siteFrom(value, /^(.+?) inscription facsimile\. E\. Hultzsch/)));
  if (!Array.isArray(alts) || !Array.isArray(captions) || alts.length !== imageCount || captions.length !== imageCount ||
      alts.some(value => !value) || captions.some(value => !value)) {
    throw new Error(`${source.data.slug}: expected ${imageCount} translated image alt(s) and caption(s)`);
  }
  let figureNumber = 0;
  const translatedFigures = figures.replace(/<figure[\s\S]*?<\/figure>/g, figure => {
    const index = figureNumber++;
    return figure
      .replace(/alt="[^"]*"/, `alt="${alts[index].replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`)
      .replace(/<figcaption>[\s\S]*?<\/figcaption>/, `<figcaption>${captions[index]}</figcaption>`);
  });
  const transliteration = section(body, 'Roman transliteration', 'English translation').match(/<p class="inscription-transliteration"[\s\S]*?<\/p>/)?.[0];
  if (!transliteration) throw new Error(`${source.data.slug}: missing transliteration`);
  const sourceTransliterationNote = section(body, 'Roman transliteration', 'English translation').split('\n\n')[0];
  const transliterationNote = localized.transliterationNote || common.transliterationNotes?.[sourceTransliterationNote] ||
    applySite(common.siteTransliterationTemplate, siteFrom(sourceTransliterationNote, /^The text below follows the (.+?) version in Hultzsch/));
  const sourceNote = localized.sourceNote || common.sourceNote;
  const englishSection = section(body, 'English translation', 'Sources');
  const englishQuote = englishSection.slice(englishSection.indexOf('\n\n>') + 2).trim();
  const sourceLinks = [...section(body, 'Sources').matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  if (sourceLinks.length !== 2) throw new Error(`${source.data.slug}: expected two source links`);
  if (!localized.about || !localized.translation || !localized.title || !localized.excerpt ||
      !transliterationNote || !sourceNote || !common.translationBasisNote) {
    throw new Error(`${source.data.slug}: missing translated prose or inscription`);
  }
  const sourceClauses = [...englishQuote.matchAll(/^> /gm)].length;
  const translatedClauses = [...localized.translation.matchAll(/^> /gm)].length;
  if (sourceClauses !== translatedClauses) {
    throw new Error(`${source.data.slug}: ${translatedClauses} translated clauses, expected ${sourceClauses}`);
  }
  return [
    `## ${common[aboutHeading]}`,
    localized.about,
    `## ${common['Original script']}`,
    translatedFigures,
    `## ${common['Roman transliteration']}`,
    transliterationNote,
    transliteration,
    `## ${common.localTranslationHeading}`,
    common.translationBasisNote,
    localized.translation.trim(),
    `## ${common.Sources}`,
    `- E. Hultzsch, [*Inscriptions of Asoka* (1925)](${sourceLinks[0]}), *Corpus Inscriptionum Indicarum*, ${common.volumeOne}.`,
    `- [${common.polyglottaEdition}](${sourceLinks[1]}), ${common.universityOfOslo} (${sourceNote}).`,
  ].join('\n\n') + '\n';
}

function blockTranslatedBody(source, localized, common) {
  const headings = {
    '## About this inscription': `## ${common['About this inscription']}`,
    '## Original script': `## ${common['Original script']}`,
    '## Original scripts': `## ${common['Original scripts'] || 'मूल लिपियाँ'}`,
    '## Roman transliteration': `## ${common['Roman transliteration']}`,
    '## English translation': `## ${common.localTranslationHeading}`,
    '## English translation of the Greek': `## ${common['English translation of the Greek'] || 'यूनानी पाठ का हिंदी अनुवाद'}`,
    '## English translation of the Aramaic': `## ${common['English translation of the Aramaic'] || 'अरामाई पाठ का हिंदी अनुवाद'}`,
    '## Sources': `## ${common.Sources}`,
    '### Greek': `### ${common.Greek || 'यूनानी'}`,
    '### Aramaic': `### ${common.Aramaic || 'अरामाई'}`,
  };
  let figureIndex = 0;
  let inRomanSection = false;
  const blocks = source.content.trim().split(/\n\n/);
  const translated = blocks.map((block, index) => {
    if (block === '## Roman transliteration') inRomanSection = true;
    else if (block.startsWith('## ')) inRomanSection = false;
    if (headings[block]) return headings[block];
    if (block.startsWith('<figure')) {
      const alt = localized.imageAlts?.[figureIndex];
      const caption = localized.imageCaptions?.[figureIndex];
      figureIndex++;
      if (!alt || !caption) throw new Error(`${source.data.slug}: missing translated image text`);
      return block.replace(/alt="[^"]*"/, `alt="${alt.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`)
        .replace(/<figcaption>[\s\S]*?<\/figcaption>/, `<figcaption>${caption}</figcaption>`);
    }
    if (block.startsWith('<p class="inscription-transliteration"')) return block;
    if (inRomanSection && (block.startsWith('Greek: *') || block.startsWith('Aramaic: *'))) {
      return block.replace(/^Greek:/, `${common.Greek || 'यूनानी'}:`).replace(/^Aramaic:/, `${common.Aramaic || 'अरामाई'}:`);
    }
    const replacement = localized.blocks[String(index)];
    if (!replacement) throw new Error(`${source.data.slug}: missing Hindi body block ${index}`);
    if (block.startsWith('>') && block.split('\n').length !== replacement.split('\n').length) {
      throw new Error(`${source.data.slug}: different inscription line count in block ${index}`);
    }
    return replacement;
  });
  const sourceLinks = [...source.content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  const localLinks = [...translated.join('\n\n').matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  if (JSON.stringify(sourceLinks) !== JSON.stringify(localLinks)) throw new Error(`${source.data.slug}: source links changed`);
  return translated.join('\n\n') + '\n';
}

const onlySlug = process.argv.find(argument => argument.startsWith('--slug='))?.slice('--slug='.length);
const requestedLanguages = process.argv.slice(2).filter(argument => !argument.startsWith('--'));

function buildLanguage(language) {
  if (!languages.includes(language)) throw new Error(`Unsupported language: ${language}`);
  const file = path.join(localeDir, `${language}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing human-authored ${file}`);
  const localized = JSON.parse(fs.readFileSync(file, 'utf8'));
  const collectionFile = path.join(localeDir, language, 'standard.json');
  const collection = fs.existsSync(collectionFile)
    ? JSON.parse(fs.readFileSync(collectionFile, 'utf8')).articles || {}
    : {};
  const files = fs.readdirSync(sourceDir).filter(name =>
    name.startsWith('ashoka-') && name.endsWith('.md') && (!onlySlug || name === `${onlySlug}.md`)
  );
  if (onlySlug && files.length !== 1) throw new Error(`Unknown Ashoka article: ${onlySlug}`);
  const outDir = path.join(root, 'content', 'translations', language, 'articles');
  fs.mkdirSync(outDir, { recursive: true });
  for (const name of files) {
    const raw = fs.readFileSync(path.join(sourceDir, name), 'utf8');
    const source = matter(raw);
    source.raw = raw;
    const individualFile = path.join(localeDir, language, `${source.data.slug}.json`);
    const entry = fs.existsSync(individualFile)
      ? JSON.parse(fs.readFileSync(individualFile, 'utf8'))
      : localized.articles?.[source.data.slug] || collection[source.data.slug];
    if (!entry) throw new Error(`${language}: missing ${source.data.slug}`);
    const body = articleBody(source, entry, localized.common, language);
    const fm = frontmatter(source, entry, hash(source.data, source.content));
    fs.writeFileSync(path.join(outDir, name), `---\n${fm}\n---\n\n${body}`);
  }
  console.log(`${language}: wrote ${files.length} Ashoka articles`);
}

for (const language of requestedLanguages.length ? requestedLanguages : languages) buildLanguage(language);
