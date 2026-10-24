# Page views and Firebase App Check

The site records article, world-history article, and published blog views with
the callable `incrementViewCount` function in `indiahistorypageviews`.
All languages share the slug's `pageViews/{slug}.count` counter. A successful
call adds 1 using a Firestore atomic increment and updates `updatedAt`.
These are view counts, including repeat visits, rather than unique visitors.

## Production configuration

The registered Firebase web app is
`1:459246488891:web:ddc1fc5a3fea90c343fb1e` (Indian History Website).
Firebase App Check uses the score-based reCAPTCHA Enterprise site key
`6LemIv4tAAAAABGBPhnlPrsgZ-3HcBUBsOogJitZ`, with these allowed hosts:

- `www.indiahistory.info`
- `indicamind.github.io`

Google's domain restrictions cover hostnames, including their subdomains;
they do not restrict URL paths. The Angular integration additionally runs on
GitHub Pages only below `/indianhistory/`. This client-side path check avoids
initializing analytics on other deployments; it is not a security boundary.
Production uses a minimum reCAPTCHA score of 0.5 and one-hour App Check tokens.
Localhost is excluded from the production key. No debug tokens are bundled.

The function enforces App Check, checks the verified Firebase app ID, and
limits browser CORS origins to `https://www.indiahistory.info` and
`https://indicamind.github.io`. App Check reduces abuse but does not prevent
every automated visit or duplicate request. CORS is an additional browser
restriction, not authentication. The Admin SDK performs Firestore writes;
these do not require granting the browser direct database write access.

## Website behavior

The SDK loads lazily after an article or published blog has loaded. App Check
starts before the callable is invoked and refreshes tokens automatically.
Query-string and fragment-only changes do not count the same loaded story
again. Navigating to another story and returning counts another view.
The site skips localhost, unsupported hosts/paths, dev mode, missing stories,
and blog drafts. A counting failure does not block reading or navigation.
Firebase API and site keys in the client config are public identifiers.

## Build and deploy

```sh
npm test
npm run check-translations
npm run build
npm --prefix functions run lint
npm --prefix functions test
firebase deploy --only functions:incrementViewCount --project indiahistorypageviews
```

Publish the frontend through the existing website hosting workflows. The
GitHub Pages workflow builds with `--base-href /indianhistory/`; Amplify builds
with `/`. Both use the same Firebase web app and public site key.

Verify from each production host that App Check token exchange succeeds and
calls reach the function. Missing or invalid App Check tokens must receive
HTTP 401. Valid App Check tokens for another Firebase app must be rejected.

References: [web App Check setup](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider),
[callable enforcement](https://firebase.google.com/docs/app-check/cloud-functions),
[reCAPTCHA domain settings](https://docs.cloud.google.com/recaptcha/docs/reference/rest/v1/projects.keys#WebKeySettings).
