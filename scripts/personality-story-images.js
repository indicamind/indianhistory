const fs = require('fs');
const path = require('path');
const assert = require('assert');

// The same chapter-image contract serves drafts, translated previews and released stories.
function withStoryImages(root, story, data) {
  const credits = new Map();
  const chapters = story.chapters.map((chapter, index) => {
    const image = data.chapters[index].image;
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
      width: record.width, height: record.height } };
  });
  return credits.size ? { ...story, chapters, imageCredits: [...credits.values()] } : story;
}

module.exports = { withStoryImages };
