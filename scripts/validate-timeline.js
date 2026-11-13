const path = require('path');
const matter = require('gray-matter');
const { readSources, translationProblems } = require('./personality-life-translations');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/validate-timeline.js <path-to-translated-file>');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const absFile = path.resolve(file);
const rel = path.relative(path.join(root, 'content/translations'), absFile);
const parts = rel.split(path.sep);
const lang = parts[0];
const filename = parts.slice(2).join(path.sep);

const sources = readSources(root);
const translation = matter.read(absFile);
const slug = translation.data.personalityStoryFor;
const source = sources.find(s => s.data.personalityStoryFor === slug);

if (!source) {
  console.error(`Error: Source personality story for slug "${slug}" not found.`);
  process.exit(1);
}

const problems = translationProblems(source, translation);
if (problems.length === 0) {
  console.log(`PASS: ${file} is 100% valid for language "${lang}".`);
  process.exit(0);
} else {
  console.error(`FAIL: ${file} has problems:`, problems);
  process.exit(1);
}
