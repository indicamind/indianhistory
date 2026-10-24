const fs = require('node:fs');
const path = require('node:path');

const SNAPSHOT_FILE = path.join(__dirname, '../content/data/page-views.json');
const SNAPSHOT_URL = 'https://us-central1-indiahistorypageviews.cloudfunctions.net/getViewCounts';

function validateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot.fetchedAt !== 'string' ||
      !Number.isFinite(Date.parse(snapshot.fetchedAt)) ||
      !snapshot.counts || typeof snapshot.counts !== 'object' || Array.isArray(snapshot.counts)) {
    throw new Error('Invalid view count snapshot.');
  }
  for (const [slug, count] of Object.entries(snapshot.counts)) {
    if (slug.length > 200 || slug !== slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        !Number.isSafeInteger(count) || count < 0) {
      throw new Error(`Invalid view count for ${slug}.`);
    }
  }
  return {
    fetchedAt: new Date(snapshot.fetchedAt).toISOString(),
    counts: Object.fromEntries(Object.entries(snapshot.counts).sort(([a], [b]) => a.localeCompare(b))),
  };
}

async function fetchViewCounts({fetchImpl = fetch, outputFile = SNAPSHOT_FILE} = {}) {
  const response = await fetchImpl(SNAPSHOT_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
    headers: {Accept: 'application/json'},
  });
  if (!response.ok) throw new Error(`View count fetch failed: HTTP ${response.status}.`);
  const snapshot = validateSnapshot(await response.json());
  fs.mkdirSync(path.dirname(outputFile), {recursive: true});
  const temporaryFile = `${outputFile}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(snapshot, null, 2) + '\n');
  fs.renameSync(temporaryFile, outputFile);
  return snapshot;
}

module.exports = {SNAPSHOT_FILE, validateSnapshot, fetchViewCounts};

if (require.main === module) {
  fetchViewCounts().then(snapshot => {
    console.log(`Fetched ${Object.keys(snapshot.counts).length} slug view counts at ${snapshot.fetchedAt}`);
  }).catch(error => {
    console.error(`Could not refresh Firestore view counts: ${error.message}`);
    process.exitCode = 1;
  });
}
