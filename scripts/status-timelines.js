const path = require('path');
const { LANGUAGES } = require('./translation-languages');
const { readSources, readTranslation, translationProblems } = require('./personality-life-translations');

const root = path.resolve(__dirname, '..');
const sources = readSources(root);

console.log(`Total personalities: ${sources.length}`);
console.log(`Total languages: ${LANGUAGES.length}\n`);

const summary = [];
for (const lang of LANGUAGES) {
  let done = 0;
  const missing = [];
  for (const source of sources) {
    const tr = readTranslation(root, source, lang);
    const probs = translationProblems(source, tr);
    if (probs.length === 0) {
      done++;
    } else {
      missing.push(source.data.personalityStoryFor);
    }
  }
  summary.push({ lang, done, total: sources.length, missing });
  console.log(`${lang.padEnd(5)}: ${String(done).padStart(2)}/${sources.length} (${missing.length === 0 ? 'COMPLETE' : missing.join(', ')})`);
}

const totalDone = summary.reduce((acc, s) => acc + s.done, 0);
const totalRequired = sources.length * LANGUAGES.length;
console.log(`\nOverall: ${totalDone} / ${totalRequired} (${(totalDone / totalRequired * 100).toFixed(1)}%)`);
