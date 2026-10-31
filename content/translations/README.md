# Translation files

English stories and blogs live in `content/articles` and `content/blogs`. A translation uses the same filename in `content/translations/<language>/articles` or `content/translations/<language>/blogs`. The frontmatter needs translated `title`, `excerpt`, and `tags`, plus a `sourceHash` of the English title, excerpt, and trimmed Markdown body. The Markdown body is the complete translation. Shared IDs, dates, image paths, and citation URLs come from the English file during the build.

The configured language codes are listed in `scripts/translation-languages.js`, with native names and writing direction in `src/app/i18n/languages.ts`. Configured editions are not necessarily released editions: `src/app/i18n/available-languages.generated.ts` records which editions passed the content build's completeness gate.

Each language also needs a `site.json` object mapping every English interface and history-data string to its translation. `npm run check-translations` reports missing or stale story/blog files and the number of missing `site.json` entries. The selector exposes a language only when its complete site, story, and blog translations pass the build checks. Book titles and book descriptions remain in their published language.

## Released and in-preparation editions

The user requested seven additional language editions on 2026-10-31. Completed editions pass the full release gate and become available in the language selector. Unfinished editions remain configured but hidden.

| Edition | Code | Required site strings translated | Articles translated | Blogs translated | Status |
| --- | --- | ---: | ---: | ---: | --- |
| Italian | `it` | 418 / 418 | 47 / 47 | 1 / 1 | Released |
| Korean | `ko` | 418 / 418 | 47 / 47 | 1 / 1 | Released |
| Vietnamese | `vi` | 418 / 418 | 47 / 47 | 1 / 1 | Released |
| Turkish | `tr` | 418 / 418 | 3 / 47 | 1 / 1 | In preparation |
| Malay | `ms` | 418 / 418 | 3 / 47 | 1 / 1 | In preparation |
| Swahili | `sw` | 418 / 418 | 3 / 47 | 1 / 1 | In preparation |
| Filipino | `fil` | 418 / 418 | 3 / 47 | 1 / 1 | In preparation |

These counts are a snapshot; rerun the checker for current requirements. The first translated articles are the Sudama, Visvakarma, and Karna Chaupar cave inscriptions. Each translation includes the complete body, metadata, tags, image alt text and attribution, and a final Sources section with image credits. Original Prakrit transliterations remain unchanged.

Next work: complete the remaining interface and history-data strings, then the other 44 articles and `blogs/ashoka-in-stone.md` in each language. Author and review translations directly from the published English sources; do not use a translation API. Maintain source hashes, identifiers, dates, source URLs, and uncertainty statements. No English source rewrite or pending English draft is approved by this language expansion.

The new editions deliberately use the full release gate rather than the English-preview exception. `npm run check-translations` currently fails for their missing translations; it must pass before release. After completion, run `npm run build` and inspect generated articles, blogs, search assets, section navigation, and share-page metadata in each language.
