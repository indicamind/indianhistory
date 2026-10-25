const assert = require("node:assert/strict");
const {test, afterEach, mock} = require("node:test");
const {Firestore, Query} = require("firebase-admin/firestore");
const {setArticleReaction} = require("../index");
const {getArticleReactions} = require("../article-reactions");
const app = {appId: "1:459246488891:web:ddc1fc5a3fea90c343fb1e"};
const voterId = "12e45678-e89b-42d3-a456-426614174000";
const slug = "mewar-resistance-and-the-road-to-rajasthan";
afterEach(() => mock.restoreAll());

/**
 * @param {object} t Test context.
 * @param {Map} documents Stored documents.
 * @return {Array} Writes performed by the transaction.
 */
function fakeTransaction(t, documents) {
  const writes = [];
  t.mock.method(Firestore.prototype, "runTransaction", async (callback) => {
    let written = false;
    return callback({
      async getAll(...refs) {
        assert.equal(written, false, "Reads precede writes");
        return refs.map((ref) => ({exists: documents.has(ref.path),
          get: (key) => (documents.get(ref.path) || {})[key]}));
      },
      set(ref, value, options) {
        written = true;
        writes.push({path: ref.path, value, options});
        documents.set(ref.path, {...(options && options.merge ?
          documents.get(ref.path) : {}), ...value});
      },
      delete(ref) {
        written = true;
        documents.delete(ref.path);
      },
    });
  });
  return writes;
}

test("votes repeat safely, switch, and remove while preserving views",
    async (t) => {
      const documents = new Map([[`pageViews/${slug}`, {count: 42}]]);
      const writes = fakeTransaction(t, documents);
      const vote = (value) => setArticleReaction.run({app,
        data: {slug, voterId, vote: value, thumbsUp: 999}});
      await vote("up");
      assert.equal(documents.get(`pageViews/${slug}`).thumbsUp, 1);
      assert.equal(writes[0].options.merge, true);
      const firstWrites = writes.length;
      await vote("up");
      assert.equal(writes.length, firstWrites);
      await vote("down");
      const totals = documents.get(`pageViews/${slug}`);
      assert.equal(totals.count, 42);
      assert.equal(totals.thumbsUp, 0);
      assert.equal(totals.thumbsDown, 1);
      assert.ok(writes[1].path.startsWith(`pageViews/${slug}/reactions/`));
      assert.ok(!writes[1].path.includes(voterId));
      await vote(null);
      assert.equal(documents.size, 1);
      assert.equal(documents.get(`pageViews/${slug}`).thumbsDown, 0);
      const before = writes.length;
      await vote(null);
      assert.equal(writes.length, before);
    });

test("first vote creates a compatible page document and separate voters",
    async (t) => {
      const documents = new Map();
      fakeTransaction(t, documents);
      for (const id of [voterId, "22e45678-e89b-42d3-a456-426614174000"]) {
        await setArticleReaction.run({app,
          data: {slug, voterId: id, vote: "up"}});
      }
      assert.equal(documents.get(`pageViews/${slug}`).count, 0);
      assert.equal(documents.get(`pageViews/${slug}`).thumbsUp, 2);
      assert.equal(documents.size, 3);
    });

test("rejects unverified apps and malformed data before database access",
    async (t) => {
      const run = t.mock.method(Firestore.prototype, "runTransaction");
      for (const otherApp of [undefined, {appId: "other"}]) {
        await assert.rejects(setArticleReaction.run({app: otherApp,
          data: {slug, voterId, vote: "up"}}), {code: "permission-denied"});
      }
      for (const data of [undefined, {}, {slug, voterId},
        {slug: "a/b", voterId, vote: "up"},
        {slug, voterId: "bad-id", vote: "down"},
        {slug, voterId, vote: "like"}, {slug, voterId, vote: 1}]) {
        await assert.rejects(setArticleReaction.run({app, data}),
            {code: "invalid-argument"});
      }
      assert.equal(run.mock.callCount(), 0);
    });

test("propagates database failure rather than reporting a saved vote",
    async (t) => {
      t.mock.method(Firestore.prototype, "runTransaction", async () => {
        throw new Error("Unavailable");
      });
      await assert.rejects(setArticleReaction.run({app,
        data: {slug, voterId, vote: "up"}}), /Unavailable/);
    });

/** @return {object} Captured response. */
function response() {
  return {statusCode: 200, headers: {},
    set(key, value) {
      this.headers[key] = value;
    },
    status(value) {
      this.statusCode = value; return this;
    },
    json(value) {
      this.body = value;
    }};
}

test("exports aggregate fields and defaults old page documents to zero",
    async (t) => {
      const select = t.mock.method(Query.prototype, "select", function(
          ...keys) {
        assert.deepEqual(keys, ["thumbsUp", "thumbsDown"]);
        return this;
      });
      t.mock.method(Query.prototype, "get", async () => ({
        readTime: {toDate: () => new Date("2026-10-25T00:00:00Z")},
        docs: [{id: slug, get: (key) => ({thumbsUp: 3, thumbsDown: 1})[key]},
          {id: "old-article", get: () => undefined}],
      }));
      const result = response();
      await getArticleReactions({method: "GET"}, result);
      assert.equal(select.mock.callCount(), 1);
      assert.deepEqual(result.body.reactions, {
        [slug]: {thumbsUp: 3, thumbsDown: 1},
        "old-article": {thumbsUp: 0, thumbsDown: 0},
      });
      assert.equal(result.headers["Cache-Control"], "no-store");
    });

test("retrieval rejects writes and fails on corrupt counts", async (t) => {
  const read = t.mock.method(Query.prototype, "get", async () => ({
    docs: [{id: slug, get: () => -1}],
  }));
  const rejected = response();
  await getArticleReactions({method: "POST"}, rejected);
  assert.equal(rejected.statusCode, 405);
  assert.equal(read.mock.callCount(), 0);
  const corrupt = response();
  await getArticleReactions({method: "GET"}, corrupt);
  assert.equal(corrupt.statusCode, 503);
});
