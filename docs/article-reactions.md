# Article thumbs up and thumbs down

Published articles, including world-history stories, display two feedback buttons
below the title. The totals come from the build; selecting a thumb immediately
highlights it and saves the choice locally once the write succeeds. The totals
remain unchanged until a new website build. Clicking the selected thumb removes
the vote; choosing the other thumb switches it. All languages share a slug and
the browser's choice. Drafts and blogs do not display these controls.
The controls show a saving message while a request is pending, confirmation
after a vote or removal, and a retry message after failure. Button descriptions
expose the build's totals to screen readers, and keyboard focus remains visible.

## Firestore and functions

The existing `pageViews/{slug}` document stores `count`, `thumbsUp`, and
`thumbsDown`. Voting preserves the view counter. Missing reaction fields mean
zero. A vote can create the page document before its first view, with `count: 0`.

The callable `setArticleReaction` accepts `{slug, voterId, vote}`, where `vote`
is `"up"`, `"down"`, or `null`, and `voterId` is a randomly generated UUID v4.
It enforces the same Firebase App Check app and browser origins as page views.
No browser gets direct Firestore access.

The transaction reads `pageViews/{slug}/reactions/{sha256(voterId)}` and the
aggregate document before updating both. It calculates differences from the
stored vote, never from a client-supplied counter or previous vote. Repeated
identical requests do not add votes, concurrent updates retry through Firestore,
and switching or removing votes adjusts the existing totals. Individual records
contain only the vote and timestamp; the browser ID is hashed for the document
key. Aggregate changes update `reactionsUpdatedAt`.

The public GET function `getArticleReactions` returns
`{fetchedAt, reactions: {slug: {thumbsUp, thumbsDown}}}`. It selects only the two
aggregate fields and never exports individual records. Other request methods
are rejected. No App Check is needed to retrieve these public totals.

## Browser persistence and previews

The random browser ID is saved as `ih_reaction_voter`. Each successful vote is
stored as `ih_article_reaction:<slug>`. A failed write restores the previous
selection and offers a retry. The two website origins have separate browser
storage, as do separate browsers/devices. Clearing storage creates a new browser
identity; this is browser-level deduplication, not a signed-in unique voter.
When storage is blocked, the ID and choice survive only in memory until reload.

Localhost, unsupported hosts/paths, and `?dev=true` use local previews. These
never load the Firebase SDK for voting or write to Firestore. Preview choices
use `ih_preview_reaction:<slug>`, separately from registered production votes.
Page views and voting share one lazily initialized Firebase/App Check client.

## Build and release

`npm run build` runs `npm run fetch-article-reactions`, alongside view retrieval,
before generating content. The retrieval script validates and atomically writes
`content/data/article-reactions.json`; failure stops the build and preserves the
previous snapshot. The content generator embeds `thumbsUp` and `thumbsDown` in
English and translated article summaries and story JSON. The browser never
retrieves live totals. `npm start` and `npm run build-content` use the committed
snapshot for offline development. Future articles automatically get the buttons
and default to zero until their first snapshot contains votes.

Deploy the new functions before running the first build that retrieves totals:

```sh
npm test
npm --prefix functions run lint
npm --prefix functions test
firebase deploy --only functions:setArticleReaction,functions:getArticleReactions --project indiahistorypageviews
npm run check-translations
npm run build
```

Publish the frontend through the existing Amplify/GitHub Pages workflows.
Function deployment alone does not publish the voting buttons.

See [Firebase transaction behavior](https://firebase.google.com/docs/firestore/manage-data/transactions)
and [App Check enforcement](https://firebase.google.com/docs/app-check/cloud-functions).
