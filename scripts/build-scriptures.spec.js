const fs=require('fs'),path=require('path'),matter=require('gray-matter'),assert=require('assert');
const {LANGUAGES}=require('./translation-languages');
const {toIAST}=require('./sanskrit-transliteration');
const {readBooks,writeScriptures,compileCommentary,sourceHash,translationProblems}=require('./build-scriptures');
describe('Scripture text and commentary release',()=>{
 const repo=path.resolve(__dirname,'..');let root;
 beforeEach(()=>{fs.mkdirSync(path.join(repo,'.codex-tmp'),{recursive:true});root=fs.mkdtempSync(path.join(repo,'.codex-tmp/scripture-test-'));});
 afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
 const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value)};
 function fixture(){
  write(path.join(root,'content/scriptures/bhagavad-gita.json'),JSON.stringify({slug:'bhagavad-gita',originalTitle:'भगवद्गीता',sources:[],editionNote:'A test edition',chapters:[{number:1,title:'अर्जुनविषादयोग',verses:[{number:1,text:'धर्मक्षेत्रे ॥१.१॥'}]}]}));
  const chapter=readBooks(root)[0].chapters[0];
  const source={data:{title:'An English review',excerpt:'The verse in context',scriptureChapterFor:'bhagavad-gita',chapter:1,textSourceHash:chapter.textSourceHash,tags:[]},content:'An introduction. [1]\n\n## 1.1\n\n### Meaning\n\nA field of dharma.\n\n### Explanation\n\nThe question introduces the scene and its moral setting. [1]\n\n## Sources\n\n1. [The source](https://example.com/source)\n'};
  write(path.join(root,'content/drafts/articles/chapter-one.md'),matter.stringify(source.content,source.data));
  return {chapter,source,output:path.join(root,'generated')};
 }
 it('transliterates conjuncts, vowel length, nasal sounds, avagraha and verse numerals faithfully',()=>{
  expect(toIAST('धृतराष्ट्र उवाच')).toBe('dhṛtarāṣṭra uvāca');
  expect(toIAST('ज्ञानं क्षेत्रज्ञः पितॄन्')).toBe('jñānaṃ kṣetrajñaḥ pitṝn');
  expect(toIAST('न हन्यते हन्यमाने शरीरे ॥२.२०॥')).toBe('na hanyate hanyamāne śarīre || 2.20 ||');
  expect(toIAST('मेऽच्युत')).toBe('me’cyuta');
 });
 it('preserves the complete chosen edition and derives every transliteration from its displayed text',()=>{
  const book=readBooks(repo)[0];expect(book.chapters.length).toBe(18);expect(book.chapters.reduce((n,c)=>n+c.verses.length,0)).toBe(701);expect(book.chapters[12].verses.length).toBe(35);
  for(const chapter of book.chapters)for(const verse of chapter.verses)expect(verse.transliteration).toBe(toIAST(verse.sanskrit));
  expect(book.chapters[0].verses[20].sanskrit.indexOf('अर्जुन उवाच')).toBeGreaterThan(book.chapters[0].verses[20].sanskrit.indexOf('हृषीकेशं'));
 });
 it('rejects reordered or missing verse explanations and stale Sanskrit metadata',()=>{
  const{source,chapter}=fixture();assert.throws(()=>compileCommentary({...source,content:source.content.replace('## 1.1','## 1.2')},chapter));
  assert.throws(()=>compileCommentary({...source,content:source.content.replace('### Explanation','### Extra\n\nExtra.\n\n### Explanation')},chapter));
  assert.throws(()=>compileCommentary({...source,data:{...source.data,textSourceHash:'old'}},chapter));
 });
 it('rejects changed citations and external narrative links in translated or authored explanations',()=>{
  const{source,chapter}=fixture();const local={data:{...source.data,sourceHash:sourceHash(source)},content:source.content.replace('setting. [1]','setting. [2]')};
  expect(translationProblems(source,local,chapter)).toContain('citations changed');
  assert.throws(()=>compileCommentary({...source,content:source.content.replace('A field of dharma.','[A field](https://example.com/outside)')},chapter));
 });
 it('publishes Sanskrit while keeping unapproved commentary in a separate review asset',()=>{
  const{output}=fixture();writeScriptures(root,output);const index=JSON.parse(fs.readFileSync(path.join(output,'scriptures.json')));
  expect(index[0].commentaryChapters).toEqual([]);expect(JSON.parse(fs.readFileSync(path.join(output,'scripture-drafts/bhagavad-gita/1.json'))).draft).toBeTruthy();
  expect(fs.existsSync(path.join(output,'scripture-commentary'))).toBeFalsy();
 });
 it('requires approval and all 33 complete translations, then withdraws stale commentary in every language',()=>{
  const{source,output}=fixture();fs.mkdirSync(path.join(root,'content/articles'),{recursive:true});fs.renameSync(path.join(root,'content/drafts/articles/chapter-one.md'),path.join(root,'content/articles/chapter-one.md'));
  // Synthetic locale fixtures exercise the gate; they are not published translations.
  const local={data:{...source.data,title:'Un chapitre',excerpt:'Une explication',sourceHash:sourceHash(source)},content:source.content.replace('An introduction.','Une introduction.').replace('A field of dharma.','Un champ de dharma.')};
  for(const lang of LANGUAGES.slice(0,-1))write(path.join(root,'content/translations',lang,'articles/chapter-one.md'),matter.stringify(local.content,local.data));
  writeScriptures(root,output);expect(JSON.parse(fs.readFileSync(path.join(output,'scriptures.json')))[0].commentaryChapters).toEqual([]);
  const last=LANGUAGES[LANGUAGES.length-1];write(path.join(root,'content/translations',last,'articles/chapter-one.md'),matter.stringify(local.content,local.data));writeScriptures(root,output);
  expect(JSON.parse(fs.readFileSync(path.join(output,'scriptures.json')))[0].commentaryChapters).toEqual([1]);expect(fs.existsSync(path.join(output,'te/scripture-commentary/bhagavad-gita/1.json'))).toBeTruthy();
  write(path.join(root,'content/translations',last,'articles/chapter-one.md'),matter.stringify(local.content,{...local.data,sourceHash:'stale'}));writeScriptures(root,output);
  expect(JSON.parse(fs.readFileSync(path.join(output,'scriptures.json')))[0].commentaryChapters).toEqual([]);expect(fs.existsSync(path.join(output,'scripture-commentary/bhagavad-gita/1.json'))).toBeFalsy();
 });
});
