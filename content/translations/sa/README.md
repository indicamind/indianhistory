# Sanskrit edition

Sanskrit uses language code `sa`, the native label `संस्कृतम्`, Devanagari script,
and left-to-right layout. Translations are authored directly from English without
a translation service.

The published corpus is translated:

- Interface, search copy, navigation, and period/theme/personality descriptions in `site.json`.
- All published articles, including the Ashoka collection, the archaeology
  articles, and Mewar, with titles, excerpts, tags, complete bodies, image alt
  text, captions, citations, and source notes.
- The published blog post, `ashoka-in-stone.md`.

The original ancient transliterations and source links are preserved. The
Sanskrit inscription translations identify their historical English editions as
their sources. Greek and Aramaic pages preserve the separately cited editions,
damaged passages, disputed readings, and attribution qualifications.

External references appear in the final Sources section. Image attribution is
visible beside images, with linked records and licenses in Image credits.
Unapproved English drafts are outside this translation batch.

Sanskrit now uses the same completeness gate as the other released editions in
`scripts/translation-languages.js`; it is no longer an in-progress exception.
The build generates localized article, blog, search, and share assets.

Run `npm run check-translations` and `npm run build` whenever approved English
sources or their Sanskrit translations change. Source hashes must match, and
the generated assets must not substitute English previews for published work.
