const fs = require('node:fs');
const path = require('node:path');

const REACTIONS_FILE = path.join(__dirname, '../content/data/article-reactions.json');
const URL = 'https://us-central1-indiahistorypageviews.cloudfunctions.net/getArticleReactions';

function validateReactions(snapshot) {
  if (!snapshot || typeof snapshot.fetchedAt !== 'string' || !Number.isFinite(Date.parse(snapshot.fetchedAt)) ||
      !snapshot.reactions || typeof snapshot.reactions !== 'object' || Array.isArray(snapshot.reactions)) {
    throw new Error('Invalid article reaction snapshot.');
  }
  const reactions = {};
  for (const [slug, counts] of Object.entries(snapshot.reactions).sort(([a], [b]) => a.localeCompare(b))) {
    if (slug.length > 200 || slug !== slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        !counts || !Number.isSafeInteger(counts.thumbsUp) || counts.thumbsUp < 0 ||
        !Number.isSafeInteger(counts.thumbsDown) || counts.thumbsDown < 0) {
      throw new Error(`Invalid article reactions for ${slug}.`);
    }
    reactions[slug] = {thumbsUp: counts.thumbsUp, thumbsDown: counts.thumbsDown};
  }
  return {fetchedAt: new Date(snapshot.fetchedAt).toISOString(), reactions};
}

async function fetchArticleReactions({fetchImpl = fetch, outputFile = REACTIONS_FILE} = {}) {
  const response = await fetchImpl(URL, {
    cache: 'no-store', signal: AbortSignal.timeout(30000), headers: {Accept: 'application/json'},
  });
  if (!response.ok) throw new Error(`Article reaction fetch failed: HTTP ${response.status}.`);
  const snapshot = validateReactions(await response.json());
  fs.mkdirSync(path.dirname(outputFile), {recursive: true});
  fs.writeFileSync(`${outputFile}.tmp`, JSON.stringify(snapshot, null, 2) + '\n');
  fs.renameSync(`${outputFile}.tmp`, outputFile);
  return snapshot;
}

module.exports = {REACTIONS_FILE, validateReactions, fetchArticleReactions};

if (require.main === module) {
  fetchArticleReactions().then(snapshot => {
    console.log(`Fetched ${Object.keys(snapshot.reactions).length} article reaction totals at ${snapshot.fetchedAt}`);
  }).catch(error => {
    console.error(`Could not refresh Firestore article reactions: ${error.message}`);
    process.exitCode = 1;
  });
}
