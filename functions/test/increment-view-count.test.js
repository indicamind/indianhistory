const assert = require("node:assert/strict");
const {test, afterEach, mock} = require("node:test");
const {DocumentReference, FieldValue} = require("firebase-admin/firestore");
const {incrementViewCount} = require("../index");
const app = {appId: "1:459246488891:web:ddc1fc5a3fea90c343fb1e"};

afterEach(() => mock.restoreAll());

test("increments the requested slug and ignores client count", async (t) => {
  let writtenPath;
  let writtenData;
  let writtenOptions;
  const write = async function(data, options) {
    writtenPath = this.path;
    writtenData = data;
    writtenOptions = options;
  };
  t.mock.method(DocumentReference.prototype, "set", write);

  const result = await incrementViewCount.run({
    app,
    data: {slug: "ashoka-major-rock-edict-1", count: 999},
  });

  assert.deepEqual(result, {slug: "ashoka-major-rock-edict-1", success: true});
  assert.equal(writtenPath, "pageViews/ashoka-major-rock-edict-1");
  assert.ok(writtenData.count.isEqual(FieldValue.increment(1)));
  assert.ok(writtenData.updatedAt.isEqual(FieldValue.serverTimestamp()));
  assert.deepEqual(writtenOptions, {merge: true});
});

test("rejects malformed slugs before writing to Firestore", async (t) => {
  const write = t.mock.method(DocumentReference.prototype, "set");
  const invalid = [undefined, null, {}, {slug: 123}, {slug: ""},
    {slug: "../other"}, {slug: "a/b"}, {slug: "has spaces"},
    {slug: "Uppercase"}, {slug: "a\n"}, {slug: "a-"},
    {slug: "a--b"}, {slug: "a".repeat(201)}];

  for (const data of invalid) {
    await assert.rejects(incrementViewCount.run({data, app}), {
      code: "invalid-argument",
    });
  }
  assert.equal(write.mock.callCount(), 0);
});

test("does not report success when Firestore fails", async (t) => {
  t.mock.method(DocumentReference.prototype, "set", async () => {
    throw new Error("Firestore unavailable");
  });

  await assert.rejects(
      incrementViewCount.run({data: {slug: "ashoka-edicts"}, app}),
      /Firestore unavailable/);
});

test("rejects missing App Check context and other apps before writing",
    async (t) => {
      const write = t.mock.method(DocumentReference.prototype, "set");
      for (const otherApp of [undefined, {appId: "different-app"}]) {
        await assert.rejects(incrementViewCount.run({
          data: {slug: "ashoka-edicts"}, app: otherApp,
        }), {code: "permission-denied"});
      }
      assert.equal(write.mock.callCount(), 0);
    });
