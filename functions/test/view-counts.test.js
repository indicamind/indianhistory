const assert = require("node:assert/strict");
const {test, afterEach, mock} = require("node:test");
const {Query} = require("firebase-admin/firestore");
require("../index");
const handler = require("../view-counts");

afterEach(() => mock.restoreAll());

/** @return {object} A minimal response capturing the endpoint's output. */
function response() {
  return {
    statusCode: 200,
    headers: {},
    set(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

test("exports fresh public counts without other document fields", async (t) => {
  t.mock.method(Query.prototype, "get", async () => ({
    readTime: {toDate: () => new Date("2026-10-24T12:00:00Z")},
    docs: [{id: "ashoka-edicts", get: (field) => field === "count" ? 42 : null},
      {id: "new-article", get: () => 0}],
  }));
  const result = response();
  await handler({method: "GET"}, result);
  assert.equal(result.statusCode, 200);
  assert.equal(result.headers["Cache-Control"], "no-store");
  assert.deepEqual(result.body, {
    fetchedAt: "2026-10-24T12:00:00.000Z",
    counts: {"ashoka-edicts": 42, "new-article": 0},
  });
});

test("rejects write requests without accessing Firestore", async (t) => {
  const read = t.mock.method(Query.prototype, "get");
  const result = response();
  await handler({method: "POST"}, result);
  assert.equal(result.statusCode, 405);
  assert.equal(result.headers.Allow, "GET");
  assert.equal(read.mock.callCount(), 0);
});

test("returns unavailable on Firestore read failure", async (t) => {
  t.mock.method(Query.prototype, "get", async () => {
    throw new Error("Firestore unavailable");
  });
  const result = response();
  await handler({method: "GET"}, result);
  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body, {error: "View counts are unavailable."});
});
