const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {validateReactions, fetchArticleReactions} = require('./fetch-article-reactions');

describe('Build-time article reactions', () => {
  const fetchedAt = '2026-10-25T00:00:00.000Z';
  const snapshot = {fetchedAt, reactions: {mewar: {thumbsUp: 8, thumbsDown: 0}}};
  it('keeps aggregate counters only', () => {
    expect(validateReactions({fetchedAt, reactions: {mewar: {
      thumbsUp: 8, thumbsDown: 0, privateData: 'discard',
    }}})).toEqual(snapshot);
  });
  it('rejects malformed totals and slugs', () => {
    for (const value of [-1, 0.5, '1', null, undefined, Number.MAX_SAFE_INTEGER + 1]) {
      for (const key of ['thumbsUp', 'thumbsDown']) {
        expect(() => validateReactions({fetchedAt, reactions: {
          mewar: {...snapshot.reactions.mewar, [key]: value},
        }})).toThrow();
      }
    }
    for (const slug of ['a/b', 'a\n', '', 'a'.repeat(201)]) {
      expect(() => validateReactions({fetchedAt, reactions: {[slug]: snapshot.reactions.mewar}})).toThrow();
    }
    expect(() => validateReactions({fetchedAt: 'bad', reactions: {}})).toThrow();
  });
  it('writes fetched totals atomically and preserves the file on failed or invalid retrieval', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ih-reactions-'));
    const outputFile = path.join(directory, 'snapshot.json');
    try {
      await fetchArticleReactions({outputFile, fetchImpl: async () => ({ok: true, json: async () => snapshot})});
      await assert.rejects(fetchArticleReactions({outputFile, fetchImpl: async () => ({ok: false, status: 503})}), /HTTP 503/);
      await assert.rejects(fetchArticleReactions({outputFile, fetchImpl: async () => ({ok: true, json: async () => ({})})}), /Invalid/);
      expect(JSON.parse(fs.readFileSync(outputFile, 'utf8'))).toEqual(snapshot);
    } finally { fs.rmSync(directory, {recursive: true}); }
  });
});
