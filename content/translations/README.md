# Translation files

English stories and blogs live in `content/articles` and `content/blogs`. A translation uses the same filename in `content/translations/<language>/articles` or `content/translations/<language>/blogs`. The frontmatter needs translated `title`, `excerpt`, and `tags`, plus a `sourceHash` of the English title, excerpt, and trimmed Markdown body. The Markdown body is the complete translation. Shared IDs, dates, image paths, and citation URLs come from the English file during the build.

The configured language codes are listed in `scripts/translation-languages.js`, with native names and writing direction in `src/app/i18n/languages.ts`. Configured editions are not necessarily released editions: `src/app/i18n/available-languages.generated.ts` records which editions passed the content build's completeness gate.

Each language also needs a `site.json` object mapping every English interface and history-data string to its translation. `npm run check-translations` reports missing or stale story/blog files and the number of missing `site.json` entries. The selector exposes a language only when its complete site, story, and blog translations pass the build checks. Book titles and book descriptions remain in their published language.

## Released and in-preparation editions

The user requested seven additional language editions on 2026-10-31. Completed editions pass the full release gate and become available in the language selector. Unfinished editions remain configured but hidden.

| Edition | Code | Required site strings translated | Articles translated | Blogs translated | Status |
| --- | --- | ---: | ---: | ---: | --- |
| Italian | `it` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Korean | `ko` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Vietnamese | `vi` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Turkish | `tr` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Malay | `ms` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Swahili | `sw` | 542 / 542 | 48 / 48 | 2 / 2 | Released |
| Filipino | `fil` | 542 / 542 | 48 / 48 | 2 / 2 | Released |

All seven requested editions have passed the full release gate with complete translations for interface strings, articles, blogs, image attributions, metadata, and search assets. Each translation includes the complete body, metadata, tags, image alt text and attribution, and a final Sources section with image credits. Original Prakrit, Greek, and Aramaic transliterations remain unchanged.

The approved Rani Durgavati article is included in all 33 translation editions, with its complete narrative, sources, alt text, captions, and image credits. The approved English text remains unchanged.

Run `npm run check-translations` and `npm run build` after any content change to inspect generated articles, blogs, search assets, section navigation, and share-page metadata across all released editions.

## Civilizational roots blog, 18 November 2026

The approved [civilizational roots blog](../blogs/how-deep-are-indias-civilizational-roots.md) is complete in all 33 translation editions. Each includes the entire narrative, title, excerpt, tags, 25 numbered comparisons, 53 image descriptions and captions, Sources and Image credits. Both replacement images at point 7 are included. Publication titles and book descriptions remain in their published language.

Every translation matches the approved English source hash and preserves image/reference targets, book identifiers, dates, numbered citations and factual qualifiers. Direct authorship and independent cross-review corrected material terminology, period labels and image details. No translation API or browser translation service was used. The shared renderer places the two book recommendations between complete blocks near one-third and two-thirds of the prose in every edition.

The completeness gate includes both published blogs in every released language; no English blog fallback is required.

## Blogs in history sections

Blogs can use the same `period`, `polity`, `themes` and `personalities` metadata as articles. Set the identifiers in the English source and every translated source. The content build carries the English membership identifiers into each localized blog asset; translated titles, excerpts and tags remain local to each edition.

The section service shares membership and ancestor rules between articles and blogs. Section pages list associated blogs under a separate, localized Blogs heading; home cards count blogs separately and stay visible when a section has blogs alone. Blog topic links and contextual back links use the same section definitions, including localized names. English dev drafts follow the existing blog visibility rules.

Published blogs also share the article upvote/downvote controls and aggregate reaction snapshot. Drafts hide the controls. Blog feedback labels are translated in every edition; saved choices, switching, removal and offline/local previews follow the existing article reaction service. Mobile blog image dialogs fill the viewport width, preserve image proportions, and keep the close control accessible while tall images scroll.

The civilizational roots post belongs to `indus-valley` and `indigenous-aryanism-out-of-india-theory` in English and all 33 translations. Its narrative, citations and source hashes are unchanged by these metadata additions.

## Colonization theme timeline awaiting English approval

The revised 140-bubble English timeline is under `content/drafts/articles/colonization-of-india-timeline.md` and can be reviewed at `/theme/colonization-of-india?lang=en&dev=true`. Its `themeStoryFor` metadata identifies an inline theme narrative, rather than a standalone article. It is excluded from normal views, translated previews and the offline extension. English approval must precede complete translations of the narrative, chapter dates, image captions, alt text and sources into all 33 editions. Theme stories use the same source and chapter hash checks and all-language release gate as personality timelines. See `content/drafts/colonization-theme-review.md` for scope and verification.

## Personality life timelines approved on 2026-11-12

The English bubble timelines for all 14 personalities with published articles have
been approved. Their source manuscripts now live in `content/articles/*-life-story.md`.
They are inline personality content, not separate biography articles, and remain
outside the article listings and article search index.

The original approved versions have now passed the shared translation gate:
**462 / 462** complete timeline translations (14 personalities × 33 languages),
with all 14 original timelines released. `npm run personality-translation-status`
reports 14/14 for every supported language. English source hashes and chapter
hashes match all existing translations. This completion applies to the original
approved versions; it does not approve or release the expanded English drafts
listed below. No translation API was used.

Every translated manuscript includes the full narrative, chapter headings and
dates, source notes and image credits. `sourceHash` covers the English title,
excerpt and trimmed Markdown body; `chapterSourceHash` also detects changes to
English chapter dates, qualifiers, identifiers and article memberships.

Each timeline is published only after **all 33 translations** pass its shared
validation. While a timeline is incomplete, approved English and complete localized translations can
be reviewed with `?dev=true&lang=<code>` on the personality page. Pending dev previews
are excluded from the offline extension in every language; the released original
versions are included. Unapproved English
rewrites still follow the separate draft approval workflow.

`npm run check-translations` validates existing translations and reports missing
personality timelines as pending unpublished work. Run
`npm run check-personality-translations` for the strict completion audit: missing
personality translations are failures. A successful build of the existing site
does not mean this timeline update is complete.

`npm run personality-translation-status` prints the current per-language counts
and the number of timelines that have cleared the full release gate.

## Expanded personality English review, 2026-11-14

Fourteen expanded English timelines now have 50 bubbles each under
`content/drafts/articles/`. See the [English review index](../drafts/personality-life-timelines-review.md)
for counts, dev previews, sources, and the three evidence-limited exceptions.
These revisions await fresh English approval. They shadow the original text
only in English dev mode; approved source hashes, existing translations, and
the shared release gate remain unchanged. The 462 existing translated timelines still cover the earlier approved text,
not these expanded drafts.
Do not translate or publish the expanded narratives before explicit approval.

## Personality image associations, 2026-11-15

The shared chapter image catalogue now covers all 804 bubbles in the other
18 English timelines, alongside Shivaji’s existing illustrated draft. All 33
translation editions include the image labels in site.json. Images are selected
by stable chapter identifiers, so adding them does not change the approved
narrative source hashes or release the expanded English drafts. Linked image
credits, local WebP/JPEG assets and the image viewer also work offline. See the
[image review and provenance table](../drafts/personality-images-review.md).

## Antisemitism theme hierarchy

`antisemitism` has five subthemes: `pre-christian-antisemitism`, `christian-antisemitism`, `islamic-antisemitism`, `national-socialist-antisemitism` and `international-socialist-antisemitism`. All six names, ranges, descriptions and the subtheme navigation label are translated in all 33 editions. Empty sections follow the existing dev-mode visibility rule. Theme memberships include ancestors for both articles and blogs; the home page lists root themes.

`persecution-of-hindus` is a separate root theme with its name and description translated into all 33 editions. The published Firuz Shah Tughlaq persecution article belongs to it in every edition. Relevant Ghazni review drafts carry the same theme without being published or translated; the parent series guide supplies their theme listing.
