const fs = require('fs'), os = require('os'), path = require('path');
const {writeThemeStories} = require('./build-theme-stories');
const matter = require('gray-matter');
const {sourceHash, chapterSourceHash} = require('./personality-life-translations');
const {LANGUAGES} = require('./translation-languages');
const draft = (body = 'An original-source account.', article = 'source-article') => `---\ntitle: Colonial rule and independence\nexcerpt: An English review draft.\nthemeStoryFor: colonization-of-india\nchapters:\n  - id: colony-first\n    date: 1757 · Bengal\n    articles: [${article}]\n---\n\nAn introduction.\n\n## A change in political power\n\n${body}\n\n## Sources\n\n[Archive](https://example.org/archive)\n`;
const article = {slug:'source-article',title:'An original record',themes:['colonization-of-india'],personalities:[]};
describe('Theme timeline approval gate', () => {
  let root;
  beforeEach(() => {root=fs.mkdtempSync(path.join(os.tmpdir(),'theme-story-'));fs.mkdirSync(path.join(root,'content/drafts/articles'),{recursive:true});});
  afterEach(() => fs.rmSync(root,{recursive:true,force:true}));
  it('builds an inline English review with theme-specific article membership', () => {
    fs.writeFileSync(path.join(root,'content/drafts/articles/colonization.md'),draft());
    writeThemeStories(root,root,[article]);
    const previews=JSON.parse(fs.readFileSync(path.join(root,'theme-story-drafts.json')));
    expect(previews['colonization-of-india'].story.chapters.length).toBe(1);
    expect(previews['colonization-of-india'].story.draft).toBeTruthy();
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-stories.json')))).toEqual({});
  });
  it('never puts unapproved English into translated theme previews', () => {
    fs.writeFileSync(path.join(root,'content/drafts/articles/colonization.md'),draft());
    writeThemeStories(root,root,[article],{},'hi');
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-story-drafts.json')))).toEqual({});
  });
  it('rejects article links outside the theme and external narrative links', () => {
    const file=path.join(root,'content/drafts/articles/colonization.md');
    fs.writeFileSync(file,draft());
    expect(()=>writeThemeStories(root,root,[{...article,themes:[]}])).toThrow('belong to this theme');
    fs.writeFileSync(file,draft('[External](https://example.org)'));
    expect(()=>writeThemeStories(root,root,[article])).toThrow('external links belong in Sources');
  });
  it('keeps an approved source separate from its revised English preview', () => {
    fs.mkdirSync(path.join(root,'content/articles'));
    const approved=path.join(root,'content/articles/colonization.md'),original=draft('Previously approved.');
    fs.writeFileSync(approved,original);
    fs.writeFileSync(path.join(root,'content/drafts/articles/colonization.md'),draft('Expanded account for approval.'));
    writeThemeStories(root,root,[article]);
    expect(fs.readFileSync(approved,'utf8')).toBe(original);
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-stories.json')))).toEqual({});
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-story-drafts.json')))['colonization-of-india'].story.chapters[0].html).toContain('Expanded account');
  });

  it('releases an approved theme only after every required translation is complete', () => {
    fs.mkdirSync(path.join(root,'content/articles'));
    fs.writeFileSync(path.join(root,'content/articles/colonization.md'),draft());
    const source = matter(draft());
    const translated = matter.stringify(source.content.replace('An introduction.', 'Une introduction.').replace('An original-source account.', 'Un récit fondé sur les sources.'), {
      ...source.data, title: 'Un titre traduit', excerpt: 'Un résumé traduit', sourceHash: sourceHash(source), chapterSourceHash: chapterSourceHash(source),
    });
    for (const language of LANGUAGES.slice(0,-1)) {
      const directory=path.join(root,'content/translations',language,'articles');
      fs.mkdirSync(directory,{recursive:true});
      fs.writeFileSync(path.join(directory,'colonization.md'),translated);
    }
    writeThemeStories(root,root,[article]);
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-stories.json')))).toEqual({});
    const directory=path.join(root,'content/translations',LANGUAGES.at(-1),'articles');
    fs.mkdirSync(directory,{recursive:true});
    fs.writeFileSync(path.join(directory,'colonization.md'),translated);
    writeThemeStories(root,root,[article]);
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-stories.json')))['colonization-of-india'].story.chapters.length).toBe(1);
    writeThemeStories(root,root,[article],{},LANGUAGES.at(-1));
    expect(JSON.parse(fs.readFileSync(path.join(root,'theme-stories.json')))['colonization-of-india'].story.chapters[0].html).toContain('Un récit');
  });
});
