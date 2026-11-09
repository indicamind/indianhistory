# Translation files

English stories and blogs live in `content/articles` and `content/blogs`. A translation uses the same filename in `content/translations/<language>/articles` or `content/translations/<language>/blogs`. The frontmatter needs translated `title`, `excerpt`, and `tags`, plus a `sourceHash` of the English title, excerpt, and trimmed Markdown body. The Markdown body is the complete translation. Shared IDs, dates, image paths, and citation URLs come from the English file during the build.

The configured language codes are listed in `scripts/translation-languages.js`, with native names and writing direction in `src/app/i18n/languages.ts`. Configured editions are not necessarily released editions: `src/app/i18n/available-languages.generated.ts` records which editions passed the content build's completeness gate.

Each language also needs a `site.json` object mapping every English interface and history-data string to its translation. `npm run check-translations` reports missing or stale story/blog files and the number of missing `site.json` entries. The selector exposes a language only when its complete site, story, and blog translations pass the build checks. Book titles and book descriptions remain in their published language.

## Released and in-preparation editions

The user requested seven additional language editions on 2026-10-31. Completed editions pass the full release gate and become available in the language selector. Unfinished editions remain configured but hidden.

| Edition | Code | Required site strings translated | Articles translated | Blogs translated | Status |
| --- | --- | ---: | ---: | ---: | --- |
| Italian | `it` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Korean | `ko` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Vietnamese | `vi` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Turkish | `tr` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Malay | `ms` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Swahili | `sw` | 420 / 420 | 48 / 48 | 1 / 1 | Released |
| Filipino | `fil` | 420 / 420 | 48 / 48 | 1 / 1 | Released |

All seven requested editions have passed the full release gate with complete translations for interface strings, articles, blogs, image attributions, metadata, and search assets. Each translation includes the complete body, metadata, tags, image alt text and attribution, and a final Sources section with image credits. Original Prakrit, Greek, and Aramaic transliterations remain unchanged.

The approved Rani Durgavati article is included in all 33 translation editions, with its complete narrative, sources, alt text, captions, and image credits. The approved English text remains unchanged.

Run `npm run check-translations` and `npm run build` after any content change to inspect generated articles, blogs, search assets, section navigation, and share-page metadata across all released editions.
