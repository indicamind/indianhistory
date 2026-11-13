const fs = require('fs');
const os = require('os');
const path = require('path');
const matter = require('gray-matter');
const { LANGUAGES } = require('./translation-languages');
const { translationProblems, sourceHash, chapterSourceHash, compileStory, releaseStatus } = require('./personality-life-translations');

describe('Personality life translations', () => {
  const source = {
    data: {title: 'A ruler', excerpt: 'A complete life', personalityStoryFor: 'ruler', chapters: [
      {id: 'ruler-birth', date: 'c. 1540 · Uncertain birthplace', articles: ['campaign']},
    ]},
    content: '## Early life\n\nThe traditional date is uncertain. [1]\n\n## Sources\n\n1. [A source](https://example.org/record)\n',
  };
  function translation() {
    return {data: {...source.data, title: 'Un souverain', excerpt: 'Une vie complète', sourceHash: sourceHash(source), chapterSourceHash: chapterSourceHash(source),
      chapters: [{...source.data.chapters[0], date: 'Vers 1540 · Lieu de naissance incertain'}]},
    content: '## Jeunesse\n\nLa date traditionnelle est incertaine. [1]\n\n## Sources\n\n1. [Une source](https://example.org/record)\n'};
  }
  it('accepts translated headings and dates while retaining chapter identities and source links', () => {
    const local = translation();
    expect(translationProblems(source, local)).toEqual([]);
    const story = compileStory(local, [{slug: 'campaign', title: 'Une campagne', personalities: ['ruler']}]);
    expect(story.chapters[0].id).toBe('ruler-birth');
    expect(story.chapters[0].title).toBe('Jeunesse');
    expect(story.chapters[0].articles[0].title).toBe('Une campagne');
  });
  it('rejects stale translations and changes to historical dates, citations and reference links', () => {
    const local = translation();
    local.data.sourceHash = 'old';
    local.data.chapters[0].date = 'Vers 1550';
    local.content = local.content.replace('[1]', '[2]').replace('example.org/record', 'example.org/other');
    const problems = translationProblems(source, local);
    expect(problems).toContain('stale');
    expect(problems).toContain('chapter dates, identifiers or memberships changed');
    expect(problems).toContain('citations changed');
    expect(problems).toContain('links or images changed');
  });
  it('keeps missing translations incomplete', () => {
    expect(translationProblems(source, undefined)).toEqual(['missing']);
  });
  it('requires the same chapter image with translated alt text and caption before release', () => {
    const illustrated = {...source, data: {...source.data, chapters: [{...source.data.chapters[0],
      image: {file: 'fort.jpg', alt: 'A hill fort', caption: 'The fort today'}}]}};
    const local = translation();
    local.data.chapterSourceHash = chapterSourceHash(illustrated);
    expect(translationProblems(illustrated, local)).toContain('chapter images changed or lack translated alt text and captions');
    local.data.chapters[0].image = {file: 'fort.jpg', alt: 'Une forteresse de montagne', caption: 'La forteresse aujourd’hui'};
    expect(translationProblems(illustrated, local)).toEqual([]);
    local.data.chapters[0].image.file = 'different-fort.jpg';
    expect(translationProblems(illustrated, local)).toContain('chapter images changed or lack translated alt text and captions');
  });
  it('releases a timeline only when every language passes, and closes the gate again after an English revision', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'personality-release-test-'));
    const original = {file: 'ruler-life-story.md', ...source};
    try {
      expect(releaseStatus(root, original).ready).toBeFalsy();
      for (const language of LANGUAGES) {
        const directory = path.join(root, 'content/translations', language, 'articles');
        fs.mkdirSync(directory, {recursive: true});
        const local = translation();
        fs.writeFileSync(path.join(directory, original.file), matter.stringify(local.content, local.data));
      }
      expect(releaseStatus(root, original)).toEqual({ready: true, missing: []});
      expect(releaseStatus(root, {...original, content: original.content + '\nNew approved evidence.\n'}).ready).toBeFalsy();
    } finally { fs.rmSync(root, {recursive: true, force: true}); }
  });
});
