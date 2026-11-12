const fs = require('fs');
const os = require('os');
const path = require('path');
const {writeProfileDrafts} = require('./build-personality-profiles');

describe('Personality life-story draft build', () => {
  let root;
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'personality-story-test-'));
    fs.mkdirSync(path.join(root, 'content/drafts/articles'), {recursive:true});
  });
  afterEach(() => fs.rmSync(root, {recursive:true, force:true}));
  const draft = body => '---\ntitle: Life story\npersonalityStoryFor: ashoka\nchapters:\n  - {id: early-life, date: Early life, articles: [edict]}\n---\n\nIntro\n\n## Early life\n\n' + body + '\n\n## Sources\n\n[Original source](https://example.org/source)';

  it('builds inline chapters while ignoring ordinary article drafts', () => {
    fs.writeFileSync(path.join(root, 'content/drafts/articles/life.md'), draft('A complete paragraph.'));
    fs.writeFileSync(path.join(root, 'content/drafts/articles/ordinary.md'), '---\ntitle: An ordinary draft\n---\nText');
    writeProfileDrafts(root, root, [{slug:'edict', title:'An edict', personalities:['ashoka']}]);
    const result = JSON.parse(fs.readFileSync(path.join(root, 'personality-story-drafts.json')));
    expect(Object.keys(result)).toEqual(['ashoka']);
    expect(result.ashoka.chapters[0].id).toBe('early-life');
    expect(result.ashoka.chapters[0].articles[0].slug).toBe('edict');
    expect(result.ashoka.draft).toBeTruthy();
  });

  it('rejects external narrative links outside Sources', () => {
    fs.writeFileSync(path.join(root, 'content/drafts/articles/life.md'), draft('[Leave the site](https://example.org)'));
    expect(() => writeProfileDrafts(root, root, [{slug:'edict', title:'An edict', personalities:['ashoka']}])).toThrow('external links belong in Sources');
  });

  it('rejects chapter links to articles about a different personality', () => {
    fs.writeFileSync(path.join(root, 'content/drafts/articles/life.md'), draft('Text'));
    expect(() => writeProfileDrafts(root, root, [{slug:'edict', title:'Another person', personalities:['someone-else']}])).toThrow('chapter article must belong to this personality');
  });
});
