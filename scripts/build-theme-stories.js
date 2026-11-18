const fs = require('fs');
const path = require('path');
const assert = require('assert');
const matter = require('gray-matter');
const {readSources, readTranslation, releaseStatus, translationProblems, compileStory} = require('./personality-life-translations');
const {withStoryImages} = require('./personality-story-images');

function profile(root, source, articles, flags, copy, language) {
  const story = withStoryImages(root, compileStory(source, articles, flags), source.data, {copy, language});
  const result = {events: [], sources: [], story};
  if (source.data.image) {
    const image = source.data.image;
    // Reuse the chapter contract to validate and credit the hero, too.
    const checked = withStoryImages(root, {chapters: [{id: source.data.themeStoryFor + '-hero'}]}, {chapters: [{image}]}, {copy, language});
    const credit = checked.imageCredits[0];
    result.image = {...checked.chapters[0].image, credit: credit.author + ' · ' + credit.license,
      kind: image.kind || 'Later artwork', landscape: true, sourceUrl: credit.sourceUrl, licenseUrl: credit.licenseUrl};
  }
  return result;
}

function writeThemeStories(root, output, articles, copy = {}, language = 'en') {
  const approved = readSources(root, 'theme');
  const released = {}, previews = {};
  for (const source of approved) {
    const ready = releaseStatus(root, source).ready;
    const local = language === 'en' ? source : readTranslation(root, source, language);
    if (!local || (language !== 'en' && translationProblems(source, local).length)) continue;
    const slug = source.data.themeStoryFor;
    (ready ? released : previews)[slug] = profile(root, local, articles, ready ? {} : {preview: true}, copy, language);
  }
  if (language === 'en') {
    const directory = path.join(root, 'content/drafts/articles');
    const slugs = new Set();
    for (const file of fs.existsSync(directory) ? fs.readdirSync(directory).filter(f => f.endsWith('.md')) : []) {
      const source = {file, ...matter.read(path.join(directory, file))};
      const slug = source.data.themeStoryFor;
      if (!slug) continue;
      assert(!slugs.has(slug), `Duplicate theme story draft: ${slug}`);
      const original = approved.find(item => item.data.themeStoryFor === slug);
      assert(!original || original.file === file, `${slug}: revision must retain approved theme filename`);
      slugs.add(slug);
      previews[slug] = profile(root, source, articles, {draft: true}, copy, language);
    }
  }
  fs.writeFileSync(path.join(output, 'theme-stories.json'), JSON.stringify(released));
  fs.writeFileSync(path.join(output, 'theme-story-drafts.json'), JSON.stringify(previews));
}
module.exports = {writeThemeStories};
