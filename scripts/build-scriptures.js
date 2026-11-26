const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const matter = require('gray-matter');
const { marked } = require('marked');
const { LANGUAGES } = require('./translation-languages');
const { toIAST } = require('./sanskrit-transliteration');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const sourceHash = source => hash(JSON.stringify({ title: source.data.title, excerpt: source.data.excerpt, body: source.content.trim() }));
function manuscripts(root, draft = false) {
  const directory = path.join(root, 'content', ...(draft ? ['drafts'] : []), 'articles');
  return fs.existsSync(directory) ? fs.readdirSync(directory).filter(f => f.endsWith('.md')).map(file => ({file, ...matter.read(path.join(directory, file))})).filter(s => s.data.scriptureChapterFor) : [];
}
function compileCommentary(source, chapter) {
  assert(source.data.scriptureChapterFor === chapter.book && source.data.chapter === chapter.number, 'Scripture chapter metadata changed');
  assert.equal(source.data.textSourceHash, chapter.textSourceHash, 'Scripture Sanskrit source changed; commentary needs review');
  assert(source.data.title?.trim() && source.data.excerpt?.trim(), 'Scripture commentary needs title and excerpt');
  const blocks = []; let heading = '', current = [];
  const flush = () => { blocks.push({heading, tokens:current}); current = []; };
  for (const token of marked.lexer(source.content.trim())) {
    if (token.type === 'heading' && token.depth === 2) { flush(); heading = token.text; }
    else current.push(token);
  }
  flush();
  const introHtml = marked.parser(blocks.shift().tokens);
  const sources = blocks.pop();
  assert(sources && !/^\d+\.\d+$/.test(sources.heading), 'Scripture commentary needs final Sources');
  assert.equal(blocks.length, chapter.verses.length, 'Scripture commentary must explain every verse in this chapter');
  const verses = blocks.map((block, i) => {
    assert.equal(block.heading, chapter.verses[i].id, 'Scripture verse identifier or order changed');
    const sections = []; let tokens = [];
    for (const token of block.tokens) {
      if (token.type === 'heading' && token.depth === 3) { if (sections.length) sections[sections.length-1] = marked.parser(tokens); else assert(!marked.parser(tokens).trim(), 'Verse text must follow its Meaning heading'); sections.push(''); tokens = []; }
      else tokens.push(token);
    }
    if (sections.length) sections[sections.length-1] = marked.parser(tokens);
    assert(sections.length === 2 && sections.every(html => html.replace(/<[^>]+>/g, '').trim()), 'Each verse needs a meaning and a detailed explanation');
    return { id:block.heading, meaningHtml:sections[0], explanationHtml:sections[1] };
  });
  assert(![introHtml, ...verses.flatMap(v => [v.meaningHtml,v.explanationHtml])].some(html => /href="https?:|<img\b|<script\b|<iframe\b/i.test(html)), 'External references belong in final Sources');
  return { title:source.data.title, excerpt:source.data.excerpt, introHtml, verses, sourcesHtml:marked.parser(sources.tokens) };
}
function translationProblems(source, translation, chapter) {
  if (!translation) return ['missing'];
  const problems = [];
  if (translation.data.sourceHash !== sourceHash(source)) problems.push('stale');
  if (translation.content.trim() === source.content.trim()) problems.push('English content copied');
  if (translation.data.title === source.data.title && translation.data.excerpt === source.data.excerpt) problems.push('untranslated metadata');
  if (JSON.stringify(translation.data.tags || []) !== JSON.stringify(source.data.tags || []) && (translation.data.tags || []).length !== (source.data.tags || []).length) problems.push('tags changed');
  try { compileCommentary(translation, chapter); } catch (e) { problems.push(e.message); }
  const targets = s => [...marked.parse(s.content).matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const citations = s => [...s.content.matchAll(/\[(\d[\d,\s–-]*)\](?!\()/g)].map(m => m[1].replace(/\s/g,''));
  if (JSON.stringify(targets(source)) !== JSON.stringify(targets(translation))) problems.push('source links changed');
  if (JSON.stringify(citations(source)) !== JSON.stringify(citations(translation))) problems.push('citations changed');
  return problems;
}
function readBooks(root) {
  const directory = path.join(root, 'content/scriptures');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(f => f.endsWith('.json')).map(file => {
    const book = JSON.parse(fs.readFileSync(path.join(directory,file),'utf8'));
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.slug));
    book.chapters = book.chapters.map((chapter, i) => {
      assert.equal(chapter.number,i+1, 'Missing scripture chapter');
      return {book:book.slug,number:chapter.number,title:chapter.title,transliteration:toIAST(chapter.title),textSourceHash:hash(JSON.stringify(chapter)),verses:chapter.verses.map((v,j) => {
        assert.equal(v.number,j+1,'Missing or duplicate scripture verse');
        const sanskrit = v.text.normalize('NFC').replace(/।{2}/g,'॥').replace(/[0-9]/g,n=>'०१२३४५६७८९'[Number(n)]); assert(/[\u0900-\u097f]/.test(sanskrit));
        return {id:`${chapter.number}.${v.number}`,number:v.number,sanskrit,transliteration:toIAST(sanskrit)};
      })};
    });
    return book;
  });
}
function writeJson(file, value) { fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,JSON.stringify(value)); }
function writeScriptures(root, output) {
  const books = readBooks(root), approved = manuscripts(root), drafts = manuscripts(root,true), draftIndex = {};
  const base = path.join(output,'scriptures'); fs.rmSync(base,{recursive:true,force:true});
  fs.rmSync(path.join(output,'scripture-drafts'),{recursive:true,force:true});
  for (const language of ['en',...LANGUAGES]) fs.rmSync(path.join(output,language==='en'?'':language,'scripture-commentary'),{recursive:true,force:true});
  const index = books.map(book => {
    const commentaryChapters = [], englishCommentaryChapters = [];
    for (const chapter of book.chapters) {
      writeJson(path.join(base,book.slug,`${chapter.number}.json`),chapter);
      const sources = approved.filter(s => s.data.scriptureChapterFor===book.slug && s.data.chapter===chapter.number);
      assert(sources.length<=1,'Duplicate approved scripture chapter');
      const source = sources[0];
      let preview;
      if (source) {
        const english = compileCommentary(source,chapter);
        englishCommentaryChapters.push(chapter.number);
        writeJson(path.join(output,'scripture-commentary',book.slug,`${chapter.number}.json`),english);
        const translations = LANGUAGES.map(language => {
          const file = path.join(root,'content/translations',language,'articles',source.file);
          return fs.existsSync(file) ? matter.read(file) : undefined;
        });
        if (translations.every(local => !translationProblems(source,local,chapter).length)) {
          commentaryChapters.push(chapter.number);
          for(const [i,language] of LANGUAGES.entries()) writeJson(path.join(output,language,'scripture-commentary',book.slug,`${chapter.number}.json`),compileCommentary(translations[i],chapter));
        }
      }
      const draft = drafts.filter(s => s.data.scriptureChapterFor===book.slug && s.data.chapter===chapter.number);
      assert(draft.length<=1,'Duplicate scripture chapter draft');
      assert(!source || !draft[0] || source.file===draft[0].file,'Scripture revisions must retain the approved filename');
      if (draft[0]) preview={...compileCommentary(draft[0],chapter),draft:true};
      if (preview) {
        (draftIndex[book.slug] ||= []).push(chapter.number);
        writeJson(path.join(output,'scripture-drafts',book.slug,`${chapter.number}.json`),preview);
      }
    }
    return {slug:book.slug,originalTitle:book.originalTitle,editionNote:book.editionNote,sources:book.sources,commentaryChapters,englishCommentaryChapters,
      verseCount:book.chapters.reduce((n,c)=>n+c.verses.length,0),chapters:book.chapters.map(({verses,...c})=>({...c,verseCount:verses.length}))};
  });
  for(const source of [...approved,...drafts]) assert(books.some(b=>b.slug===source.data.scriptureChapterFor&&b.chapters.some(c=>c.number===source.data.chapter)),'Commentary points to an unknown scripture chapter');
  writeJson(path.join(output,'scriptures.json'),index);
  writeJson(path.join(output,'scripture-drafts.json'),draftIndex);
  console.log(`Built ${index.length} scripture(s), ${books.flatMap(b=>b.chapters).reduce((n,c)=>n+c.verses.length,0)} Sanskrit verses and ${Object.values(draftIndex).flat().length} English commentary preview(s)`);
}
module.exports = {writeScriptures,readBooks,manuscripts,compileCommentary,translationProblems,sourceHash};
