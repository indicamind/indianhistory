# Translation files

English stories and blogs live in `content/articles` and `content/blogs`. A translation uses the same filename in `content/translations/<language>/articles` or `content/translations/<language>/blogs`. The frontmatter needs translated `title`, `excerpt`, and `tags`, plus a `sourceHash` of the English title, excerpt, and trimmed Markdown body. The Markdown body is the complete translation. Shared IDs, dates, image paths, and citation URLs come from the English file during the build.

The configured language codes are listed in `scripts/translation-languages.js`, with native names and writing direction in `src/app/i18n/languages.ts`. Configured editions are not necessarily released editions: `src/app/i18n/available-languages.generated.ts` records which editions passed the content build's completeness gate.

Each language also needs a `site.json` object mapping every English interface and history-data string to its translation. `npm run check-translations` reports missing or stale story/blog files and the number of missing `site.json` entries. The selector exposes a language only when its complete site, story, and blog translations pass the build checks. Book titles and book descriptions remain in their published language.

## Released and in-preparation editions

The user requested seven additional language editions on 2026-10-31. Completed editions pass the full release gate and become available in the language selector. Unfinished editions remain configured but hidden.

| Edition | Code | Required site strings translated | Articles translated | Blogs translated | Status |
| --- | --- | ---: | ---: | ---: | --- |
| Italian | `it` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Korean | `ko` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Vietnamese | `vi` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Turkish | `tr` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Malay | `ms` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Swahili | `sw` | 467 / 467 | 48 / 48 | 1 / 1 | Released |
| Filipino | `fil` | 467 / 467 | 48 / 48 | 1 / 1 | Released |

All seven requested editions have passed the full release gate with complete translations for interface strings, articles, blogs, image attributions, metadata, and search assets. Each translation includes the complete body, metadata, tags, image alt text and attribution, and a final Sources section with image credits. Original Prakrit, Greek, and Aramaic transliterations remain unchanged.

The approved Rani Durgavati article is included in all 33 translation editions, with its complete narrative, sources, alt text, captions, and image credits. The approved English text remains unchanged.

Run `npm run check-translations` and `npm run build` after any content change to inspect generated articles, blogs, search assets, section navigation, and share-page metadata across all released editions.

## Personality life timelines approved on 2026-11-12

The English bubble timelines for all 14 personalities with published articles have
been approved. Their source manuscripts now live in `content/articles/*-life-story.md`.
They are inline personality content, not separate biography articles, and remain
outside the article listings and article search index.

This update is **not released**. Of the required 462 complete timeline translations
(14 personalities × 33 languages), 70 have been authored and structurally checked:
French 14/14, Hindi 14/14, Bengali 14/14, Tamil 14/14 and Telugu 14/14.
The remaining 28 languages each have 0/14, leaving 392 translations to complete.
Existing published personality content remains
available while the new timelines are prepared. No translation API was used.

Tamil and Telugu now include the complete approved timelines for all 14 personalities,
including Akbar's 40 chapters and Ashoka's 60 chapters. Dates, uncertainty
statements, source notes and image credits are retained in the Tamil and Telugu manuscripts.

Every translated manuscript includes the full narrative, chapter headings and
dates, source notes and image credits. `sourceHash` covers the English title,
excerpt and trimmed Markdown body; `chapterSourceHash` also detects changes to
English chapter dates, qualifiers, identifiers and article memberships.

Each timeline is published only after **all 33 translations** pass its shared
validation. Until then, approved English and complete localized translations can
be reviewed with `?dev=true&lang=<code>` on the personality page. These previews
are excluded from the offline extension in every language. Unapproved English
rewrites still follow the separate draft approval workflow.

`npm run check-translations` validates existing translations and reports missing
personality timelines as pending unpublished work. Run
`npm run check-personality-translations` for the strict completion audit: missing
personality translations are failures. A successful build of the existing site
does not mean this timeline update is complete.

`npm run personality-translation-status` prints the current per-language counts
and the number of timelines that have cleared the full release gate.
