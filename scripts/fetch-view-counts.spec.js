const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {validateSnapshot, fetchViewCounts} = require('./fetch-view-counts');

describe('Build-time view count snapshot', () => {
  const fetchedAt = '2026-10-24T12:00:00.000Z';

  it('accepts zero and positive integer totals', () => {
    expect(validateSnapshot({fetchedAt, counts: {'ashoka-edicts': 42, 'new-article': 0}})).toEqual({
      fetchedAt, counts: {'ashoka-edicts': 42, 'new-article': 0},
    });
  });

  it('rejects malformed and unsafe values', () => {
    for (const count of [-1, 1.5, '42', null, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => validateSnapshot({fetchedAt, counts: {'ashoka-edicts': count}})).toThrow();
    }
    for (const counts of [null, [], {'a/b': 1}, {'a\n': 1}]) {
      expect(() => validateSnapshot({fetchedAt, counts})).toThrow();
    }
    expect(() => validateSnapshot({fetchedAt: 'invalid', counts: {}})).toThrow();
  });

  it('writes new totals and preserves the previous file on fetch failure', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ih-view-counts-'));
    const outputFile = path.join(directory, 'snapshot.json');
    try {
      const snapshot = {fetchedAt, counts: {'ashoka-edicts': 42}};
      await fetchViewCounts({outputFile, fetchImpl: async () => ({
        ok: true, json: async () => snapshot,
      })});
      expect(JSON.parse(fs.readFileSync(outputFile, 'utf8'))).toEqual(snapshot);
      await assert.rejects(fetchViewCounts({outputFile, fetchImpl: async () => ({
        ok: false, status: 503,
      })}), /HTTP 503/);
      await assert.rejects(fetchViewCounts({outputFile, fetchImpl: async () => ({
        ok: true, json: async () => ({fetchedAt, counts: {'bad': -1}}),
      })}), /Invalid view count/);
      expect(JSON.parse(fs.readFileSync(outputFile, 'utf8'))).toEqual(snapshot);
    } finally {
      fs.rmSync(directory, {recursive: true});
    }
  });
});
