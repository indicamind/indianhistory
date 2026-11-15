const fs = require('fs');
const path = require('path');
const assert = require('assert');

const catalogs = new Map();
function readCatalog(root) {
  const file = path.join(root, 'content/data/personality-story-images.json');
  if (!fs.existsSync(file)) return { images: {}, personalities: {} };
  const modified = fs.statSync(file).mtimeMs;
  if (catalogs.get(file)?.modified !== modified) {
    catalogs.set(file, { modified, value: JSON.parse(fs.readFileSync(file, 'utf8')) });
  }
  return catalogs.get(file).value;
}

function catalogImage(catalog, key, copy, language) {
  const image = catalog.images[key];
  assert(image, `Unknown personality image: ${key}`);
  const translate = value => {
    assert(language === 'en' || copy[value]?.trim(), `${language}: missing personality image translation: ${value}`);
    return language === 'en' ? value : copy[value];
  };
  const year = image.year?.replace(/^c\.\s*/, () => translate('c.') + ' ');
  const caption = [translate(image.kind), translate(image.subject), year].filter(Boolean).join(' · ');
  return { ...image, alt: caption, caption };
}

// The same chapter-image contract serves drafts, translated previews and released stories.
function withStoryImages(root, story, data, {copy = {}, language = 'en'} = {}) {
  const credits = new Map();
  const catalog = readCatalog(root);
  const associations = catalog.personalities[data.personalityStoryFor];
  const chapters = story.chapters.map((chapter, index) => {
    const key = associations?.[chapter.id];
    const image = data.chapters[index].image || (key && catalogImage(catalog, key, copy, language));
    assert(!associations || image, `${chapter.id}: missing personality bubble image association`);
    if (!image) return chapter;
    assert(/^[a-z0-9][a-z0-9-]*\.(jpg|png)$/.test(image.file), `${chapter.id}: image must be a local image filename`);
    assert(image.alt?.trim() && image.caption?.trim(), `${chapter.id}: image needs localized alt text and caption`);
    const directory = path.join(root, 'content/media/images');
    assert(fs.existsSync(path.join(directory, image.file)), `${chapter.id}: missing chapter image`);
    const record = JSON.parse(fs.readFileSync(path.join(directory, image.file.replace(/\.[^.]+$/, '.license.json')), 'utf8'));
    assert(record.author && record.license && /^https:\/\//.test(record.sourcePageUrl), `${chapter.id}: image requires attribution, license and original source`);
    assert(!/https?:|<[^>]+>/.test(record.author + record.license), `${chapter.id}: image credit must be plain text`);
    const credit = { file: image.file, caption: image.caption, author: record.author, license: record.license,
      sourceUrl: record.sourcePageUrl, licenseUrl: record.licenseUrl,
      modifications: record.modifications };
    credits.set(image.file, credit);
    return { ...chapter, image: { src: 'assets/media/images/' + image.file,
      alt: image.alt, caption: image.caption, author: record.author, license: record.license,
      width: image.width || record.width, height: image.height || record.height } };
  });
  return credits.size ? { ...story, chapters, imageCredits: [...credits.values()] } : story;
}

module.exports = { withStoryImages };
