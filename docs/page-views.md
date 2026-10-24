# Page views and Firebase App Check

The site records article, world-history article, and published blog views with
the callable `incrementViewCount` function in `indiahistorypageviews`.
All languages share the slug's `pageViews/{slug}.count` counter. A successful
call adds 1 using a Firestore atomic increment and updates `updatedAt`.
The website counts each slug once per browser tab session, rather than counting
each refresh. These are session-based views, not globally unique visitors.

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
The site stores a marker in `sessionStorage` after a successful increment.
Refreshing, changing query strings or fragments, switching languages, or
navigating away and returning to the same slug does not count again in the
same tab session. Each different slug can count once. New tab sessions or
clearing session storage allow another view; the two website origins have
separate storage. An in-memory guard also prevents concurrent duplicate calls.
Failed requests are not marked as counted and can be retried. If storage is
blocked, the in-memory guard still works for navigation, but cannot survive a
full reload. This browser guard is not a server-side deduplication mechanism;
the callable function still adds 1 for each accepted request.
The site skips localhost, unsupported hosts/paths, dev mode, missing stories,
and blog drafts. A counting failure does not block reading or navigation.
Firebase API and site keys in the client config are public identifiers.

## Counts displayed on the website

`npm run build` first runs `npm run fetch-view-counts`. This retrieves a fresh
snapshot from the `getViewCounts` HTTPS function and saves it atomically to
`content/data/page-views.json`. The endpoint reads only the `count` field from
the `pageViews` collection and returns slug/count pairs and a read timestamp.
It accepts GET requests and performs no writes. These totals are public
because the website displays them; this read-only endpoint does not require
App Check or build credentials. App Check continues to protect increments.

The content generator embeds each slug's `viewCount` in the English and all
translated article, blog, and summary JSON files. Articles and published blogs
show the total in a badge below the title, with localized labels and number
formatting. A slug without a Firestore document has a total of zero. Blog drafts
do not display a count. The browser reads these shipped assets and never fetches
totals from Firestore or the snapshot endpoint. The existing App Check call
still records visits; displayed totals update on the next website build.

A failed fetch, malformed response, or invalid count stops the production
build without overwriting the previous snapshot. `npm run build-content`,
`npm start`, and watch mode can use the committed snapshot offline. Both
Amplify and GitHub Pages already run `npm run build`, so both refresh their
counts automatically with no service account secrets in the website or CI.

## Build and deploy

```sh
npm test
npm run check-translations
npm run build
npm --prefix functions run lint
npm --prefix functions test
firebase deploy --only functions:incrementViewCount --project indiahistorypageviews
firebase deploy --only functions:getViewCounts --project indiahistorypageviews
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
