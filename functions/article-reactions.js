const {createHash} = require("node:crypto");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const validSlug = (slug) => typeof slug === "string" && slug.length <= 200 &&
  slug === slug.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

/**
 * @param {*} value Stored total.
 * @return {number} Valid aggregate total.
 */
function total(value) {
  if (value === undefined) return 0;
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Invalid reaction total.");
  }
  return value;
}

exports.setArticleReaction = async (request) => {
  if (!request.app ||
      request.app.appId !== "1:459246488891:web:ddc1fc5a3fea90c343fb1e") {
    throw new HttpsError("permission-denied", "Unrecognized web app.");
  }
  const {slug, voterId, vote} = request.data || {};
  if (!validSlug(slug) || typeof voterId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          .test(voterId) || !["up", "down", null].includes(vote)) {
    throw new HttpsError("invalid-argument", "Provide a slug, browser ID, " +
      "and a vote of up, down, or null.");
  }
  const db = getFirestore();
  const page = db.collection("pageViews").doc(slug);
  const voterKey = createHash("sha256").update(voterId.toLowerCase())
      .digest("hex");
  const reaction = page.collection("reactions").doc(voterKey);
  await db.runTransaction(async (transaction) => {
    const [pageSnapshot, previous] = await transaction.getAll(page, reaction);
    const oldVote = previous.exists ? previous.get("vote") : null;
    if (oldVote !== null && !["up", "down"].includes(oldVote)) {
      throw new Error("Invalid stored reaction.");
    }
    if (oldVote === vote) return;
    const thumbsUp = total(pageSnapshot.get("thumbsUp")) +
      Number(vote === "up") - Number(oldVote === "up");
    const thumbsDown = total(pageSnapshot.get("thumbsDown")) +
      Number(vote === "down") - Number(oldVote === "down");
    total(thumbsUp);
    total(thumbsDown);
    const totals = {thumbsUp, thumbsDown,
      reactionsUpdatedAt: FieldValue.serverTimestamp()};
    // A first vote must also be readable by the existing view-count export.
    if (!pageSnapshot.exists) totals.count = 0;
    transaction.set(page, totals, {merge: true});
    if (vote === null) {
      transaction.delete(reaction);
    } else {
      transaction.set(reaction, {vote,
        updatedAt: FieldValue.serverTimestamp()});
    }
  });
  return {slug, vote, success: true};
};

exports.getArticleReactions = async (request, response) => {
  response.set("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.set("Allow", "GET");
    response.status(405).json({error: "Use GET."});
    return;
  }
  try {
    // Export aggregate fields only, never individual browser records.
    const snapshot = await getFirestore().collection("pageViews")
        .select("thumbsUp", "thumbsDown").get();
    const reactions = {};
    for (const document of snapshot.docs) {
      if (!validSlug(document.id)) continue;
      reactions[document.id] = {
        thumbsUp: total(document.get("thumbsUp")),
        thumbsDown: total(document.get("thumbsDown")),
      };
    }
    response.json({fetchedAt: snapshot.readTime.toDate().toISOString(),
      reactions});
  } catch (error) {
    logger.error("Could not export article reactions.", error);
    response.status(503).json({error: "Article reactions are unavailable."});
  }
};
