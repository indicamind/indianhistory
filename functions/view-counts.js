const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Only these public statistics leave Firestore; no other document fields do.
module.exports = async (request, response) => {
  response.set("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.set("Allow", "GET");
    response.status(405).json({error: "Use GET."});
    return;
  }

  try {
    const snapshot = await getFirestore().collection("pageViews")
        .select("count").get();
    const counts = {};
    for (const document of snapshot.docs) {
      if (document.id.length > 200 || document.id !== document.id.trim() ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.id)) continue;
      const count = document.get("count");
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error(`Invalid view count for ${document.id}.`);
      }
      counts[document.id] = count;
    }
    const fetchedAt = snapshot.readTime.toDate().toISOString();
    response.json({fetchedAt, counts});
  } catch (error) {
    logger.error("Could not export view counts.", error);
    response.status(503).json({error: "View counts are unavailable."});
  }
};
