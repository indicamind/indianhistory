const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

initializeApp();
setGlobalOptions({maxInstances: 10});

// Slugs are shared across languages, so every translation uses one counter.
exports.incrementViewCount = onCall(
    {
      enforceAppCheck: true,
      cors: ["https://www.indiahistory.info", "https://indicamind.github.io"],
    }, async (request) => {
      if (!request.app ||
          request.app.appId !== "1:459246488891:web:ddc1fc5a3fea90c343fb1e") {
        throw new HttpsError("permission-denied", "Unrecognized web app.");
      }
      const slug = request.data && request.data.slug;
      if (typeof slug !== "string" || slug.length > 200 ||
          slug !== slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new HttpsError("invalid-argument",
            "Provide a slug of up to 200 lowercase letters, " +
            "digits, or hyphens.");
      }

      await getFirestore().collection("pageViews").doc(slug).set({
        count: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      }, {merge: true});

      return {slug, success: true};
    });
