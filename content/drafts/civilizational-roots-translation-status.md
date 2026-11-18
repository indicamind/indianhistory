# Civilizational roots post: translation verification

The user requested translations of this specific post on 17 November 2026 after reviewing and revising its English text. All 33 supported translation editions have now been authored and reviewed, including both replacement images at point 7.

Approved English source: [how-deep-are-indias-civilizational-roots.md](../blogs/how-deep-are-indias-civilizational-roots.md). The English text was moved unchanged into published content on 18 November 2026 after the complete translation batch was ready.

Each translated file under `content/translations/<language>/blogs/` contains the complete title, excerpt, tags, 25 comparisons, 53 image alt texts and captions, Sources and Image credits. English source hashes, reference/image targets, metadata identifiers, HTML structure and dates/citation numbers pass the structural audit. Reviewed East Asian numeric month names and Japanese spelled-out quantities match the English facts. Publication titles, photographer names and license identifiers retain their original forms.

The user explicitly requested parallel subagents. Assigned-language drafting and independent cross-review are complete. Review corrected material terminology, period labels, image details and grammar while preserving the approved English claims and factual qualifiers. Translations were authored directly, without translation APIs or browser translation services.

Validation completed:

- `npm run check-translations`: all 33 languages pass, with no English previews.
- `npm test`: 245 tests pass.
- `npm run build`: full website and offline extension/ZIP packaged successfully. Existing bundle/CSS budget warnings remain nonfatal.
- Generated assets: all 34 editions contain the exact localized metadata, 25 comparisons, 53 lazy image entries, complete source credits and two intact book placements near one-third and two-thirds. Article/search/site assets remain complete.
- Chromium: every language renders correctly on desktop and mobile. The Malayalam title exposed long-word overflow; shared blog-heading wrapping was corrected and all 34 editions rechecked. Point 7 uses the two replacement images; image zoom, RTL layouts and all 53 article images work.
- Installed Chrome extension in an isolated profile with networking disabled: English, Hindi, Urdu, Kashmiri, Tamil, Chinese, Japanese, Korean and Swahili article views plus French language switching pass. All article images and book covers load, localized listings and search work, external navigation stays disabled, and no HTTP(S) request occurs. Chrome's normal new-tab page and toolbar entry point are preserved.

The package contains 48 articles and two blogs in 34 languages (1,632 article editions and 68 blog editions), with 904 media files. The final site and extension bundles both contain the mobile-heading correction. No translation work remains for this post.
