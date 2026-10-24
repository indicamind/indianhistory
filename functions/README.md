# Slug view counter

`incrementViewCount` is a Firebase callable function. Send `{slug}` to add
exactly 1 to `pageViews/{slug}.count` in the default Firestore database.
The first call creates the document. Each write also sets `updatedAt` to a
server timestamp, preserving other fields. Atomic increments preserve updates
from simultaneous calls. Slugs must contain lowercase ASCII letters or digits
separated by single hyphens, with a maximum length of 200 characters.

All translations of a slug share the same counter. Every successful call
counts, including repeat visits; this does not count unique visitors. The
function requires a valid Firebase App Check token for the registered Indian
History web app, but does not require user sign-in. It accepts any valid slug. It does not
verify that the slug exists in published content or prevent repeat requests.
The Angular site calls the function for loaded articles and published blogs.
See [production configuration](../docs/page-views.md) for domain settings,
excluded environments, and frontend deployment details.

## Deploy

Use Node 24, ensure the project has a default Firestore database and the Blaze
plan, then run from the repository root:

```sh
firebase deploy --only functions:incrementViewCount
```

## Call from a Firebase web client

The web app and reCAPTCHA Enterprise key are registered for the production
domains listed in [production configuration](../docs/page-views.md). The
Angular integration initializes App Check before calling the function. For
another client using this registered web app, initialize the same way:

```js
import {getFunctions, httpsCallable} from "firebase/functions";
import {
  initializeAppCheck, ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY"),
  isTokenAutoRefreshEnabled: true,
});

const incrementViewCount = httpsCallable(getFunctions(app), "incrementViewCount");
const response = await incrementViewCount({slug: "ashoka-edicts"});
// response.data: {slug: "ashoka-edicts", success: true}
```

The response confirms that the increment committed; it does not read back the
total. The Firebase SDK attaches the App Check token automatically. Calls
without a valid token are rejected, including website calls until App Check
is configured there. For local development, use a registered App Check debug
token rather than adding localhost to the production reCAPTCHA key.

Callable functions use a `data` wrapper when invoked over plain HTTP and
require an App Check token in the `X-Firebase-AppCheck` header:

```sh
curl -X POST \
  https://us-central1-indiahistorypageviews.cloudfunctions.net/incrementViewCount \
  -H 'Content-Type: application/json' \
  -H "X-Firebase-AppCheck: $APP_CHECK_TOKEN" \
  -d '{"data":{"slug":"ashoka-edicts"}}'
```

The URL above is available after deployment. A successful HTTP response has
`{"result":{"slug":"ashoka-edicts","success":true}}`.

## Validation

```sh
npm --prefix functions run lint
npm --prefix functions test
```

Tests invoke the handler directly, stub Firestore writes, and do not connect
to the live database or exercise App Check middleware. Verify enforcement
through the deployed endpoint: requests with missing or invalid App Check
tokens must return HTTP 401 with `UNAUTHENTICATED`.

References: [Callable functions](https://firebase.google.com/docs/functions/callable),
[atomic increments](https://firebase.google.com/docs/firestore/manage-data/add-data#increment_a_numeric_value),
[App Check enforcement](https://firebase.google.com/docs/app-check/cloud-functions),
[web App Check setup](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider).
