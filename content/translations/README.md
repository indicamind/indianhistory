# Translation files

English stories and blogs live in `content/articles` and `content/blogs`. A translation uses the same filename in `content/translations/<language>/articles` or `content/translations/<language>/blogs`. The frontmatter needs translated `title`, `excerpt`, and `tags`, plus a `sourceHash` of the English title, excerpt, and trimmed Markdown body. The Markdown body is the complete translation. Shared IDs, dates, image paths, and citation URLs come from the English file during the build.

The configured language codes are listed in `scripts/translation-languages.js`, with native names and writing direction in `src/app/i18n/languages.ts`. Configured editions are not necessarily released editions: `src/app/i18n/available-languages.generated.ts` records which editions passed the content build's completeness gate.

Each language also needs a `site.json` object mapping every English interface and history-data string to its translation. `npm run check-translations` reports missing or stale story/blog files and the number of missing `site.json` entries. The selector exposes a language only when its complete site, story, and blog translations pass the build checks. Book titles and book descriptions remain in their published language.

## Released and in-preparation editions

The user requested seven additional language editions on 2026-10-31. Completed editions pass the full release gate and become available in the language selector. Unfinished editions remain configured but hidden.

| Edition | Code | Required site strings translated | Articles translated | Blogs translated | Status |
| --- | --- | ---: | ---: | ---: | --- |
| Italian | `it` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Korean | `ko` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Vietnamese | `vi` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Turkish | `tr` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Malay | `ms` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Swahili | `sw` | 583 / 583 | 48 / 48 | 2 / 2 | Released |
| Filipino | `fil` | 583 / 583 | 48 / 48 | 2 / 2 | Released |

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


## Veer Savarkar personality draft, 19 November 2026

The new `veer-savarkar` profile has its name, date range, summary and portrait alt text authored in all 33 translation editions. All 576 required site strings remain complete. The detailed English timeline has **85 illustrated bubbles** and **32 numbered source records**, under `content/drafts/articles/veer-savarkar-life-story.md`. Review it at `/personality/veer-savarkar?dev=true&lang=en`.

The narrative, chapter dates, image descriptions and source notes await explicit English approval before translation or publication. They are excluded from normal and localized views and the offline extension; the translated catalogue entry and historical portrait are available independently. The existing 462 approved personality timeline translations remain unchanged. See the [Savarkar review notes](../drafts/savarkar-personality-review.md) for coverage and provenance.


## Indian Scriptures reader, 26 November 2026

The `/scriptures` library starts with the Bhagavad Gita. Its complete 18-chapter Sanskrit source and directly generated IAST transliteration are available independently of commentary. The selected source includes Arjuna’s opening question as 13.1 and therefore has 701 numbered verses; the edition note is localized and displayed in Sources. All 30 new library, reader, search and source-interface strings are directly authored in all 33 translation editions, bringing required site strings to 576. Original Sanskrit and its transliteration remain unchanged when the site language changes.

Following the user’s choice to complete English Chapters 2–18 before translating, all 18 chapters now have original English meanings and detailed explanations for all 701 numbered verses. The user explicitly approved the complete English text on 26 November 2026. The approved manuscripts are `content/articles/bhagavad-gita-chapter-01.md` through `bhagavad-gita-chapter-18.md`, moved unchanged from drafts and identified by `scriptureChapterFor` and `chapter`. At the user’s subsequent request, English is published independently at `/scriptures/bhagavad-gita/<chapter>?lang=en` in normal web and offline readers. Translated views retain the complete source text and localized preparation note until the translation gate passes. This is not a release of translated commentary.

The user approved the direct-explanation revision on 26 November 2026 and requested removal of the existing non-English Gita commentary. All 77 translation files were deleted; the revised English is the published source. Do not restart Gita commentary translation without a new request. Other translated articles, blogs and interface dictionaries remain unchanged.

For future requested Gita translations, use the same filename under each language’s `articles` directory. These inline chapter manuscripts are excluded from ordinary article listings. Preserve `scriptureChapterFor`, `chapter` and `textSourceHash`, translate title, excerpt, tags and the complete body, and set `sourceHash` from the approved English title, excerpt and trimmed body. Keep the numbered verse headings and citations unchanged; translate the two third-level headings and all associated prose. Localized publication requires every verse’s meaning and explanation, matching source links and citations, matching Sanskrit-source metadata, and all 33 valid translations. The generator rejects identical English copies and withdraws localized commentary assets when a required translation becomes stale. Approved English remains published independently.

See [source and authoring notes](../scriptures/README.md) and [the complete English review](../drafts/gita-reader-review.md). No translation API or browser translation service was used.

The Gita reading interface now uses flowing verse cards with previous/next arrows on their left and right edges, touch swipes, and a chapter/verse progress bar. Its four additional navigation strings are authored in all 33 translation editions (580 required site strings). Sanskrit, IAST and the English commentary text remain unchanged.

The Gita reader now has a direct verse grid and full-text verse search across all 18 chapters. The shared site search links to exact verses too. Search covers Devanagari, IAST (with or without diacritics), verse references and available commentary in the selected language; approved English commentary is searchable in normal English web and offline readers; unfinished translations remain gated. The four new search labels are authored in all 33 translation editions; the obsolete “Go to verse” label is no longer required, bringing the current interface gate to 583 strings.

## Gita commentary translation progress

After removal of the previous translations, the user explicitly requested translating the Gita into the other languages again. The source is the approved, published direct-explanation revision, not the superseded commentary. English remains unchanged. Codex authors the translations directly without translation APIs or browser translation services.

The broader Gita translation project covers 18 chapters in 33 translation languages. On 28 November 2026, the user limited this thread’s active goal to completing Chapter 2 and stopping there. Chapter 3 was assigned to another agent; this thread will not translate Chapter 3 or any later chapter. The table below tracks only Chapters 1–2 within this goal, which require 66 chapter files in total. Other agents’ manuscripts beyond Chapter 2 are outside these counts and remain untouched here. Current authored and structurally validated files within this goal:

| Language | Chapters | Verses with both meaning and explanation |
| --- | --- | ---: |
| Hindi (`hi`) | 1, 2 | 119 |
| French (`fr`) | 1, 2 | 119 |
| Spanish (`es`) | 1, 2 | 119 |
| Chinese (`zh`) | 1, 2 | 119 |
| German (`de`) | 1, 2 | 119 |
| Bengali (`bn`) | 1 | 47 |
| Portuguese (`pt`) | 1, 2 | 119 |
| Italian (`it`) | 1, 2 | 119 |
| Indonesian (`id`) | 1, 2 | 119 |
| Malay (`ms`) | 1, 2 | 119 |
| Tamil (`ta`) | 1 | 47 |
| Telugu (`te`) | 1 | 47 |
| Marathi (`mr`) | 1 | 47 |
| Urdu (`ur`) | 1 | 47 |
| Gujarati (`gu`) | 1 | 47 |
| Punjabi (`pa`) | 1 | 47 |
| Arabic (`ar`) | 1 | 47 |
| Japanese (`ja`) | 1 | 47 |
| Russian (`ru`) | 1 | 47 |
| Korean (`ko`) | 1 | 47 |
| Swahili (`sw`) | 1 | 47 |
| Turkish (`tr`) | 1 | 47 |
| Vietnamese (`vi`) | 1 | 47 |
| Filipino (`fil`) | 1 | 47 |
| Persian (`fa`) | 1 | 47 |
| Kannada (`kn`) | 1 | 47 |
| Nepali (`ne`) | 1 | 47 |
| Sanskrit (`sa`) | 1 | 47 |
| Thai (`th`) | 1 | 47 |
| Malayalam (`ml`) | 1 | 47 |
| Odia (`or`) | 1 | 47 |
| Sinhala (`si`) | 1 | 47 |
| Kashmiri (`ks`) | 1 | 47 |

Within the current Chapters 1–2 goal, this is 42 of 66 required files; 24 Chapter 2 files remain. Each existing file contains the complete introduction, translated metadata, every numbered verse with both translated sections, and the final Sources section. Source hashes, Sanskrit-source identifiers, citation markers and external reference URLs match the current English source. Review preserves the differing interpretations of 1.10, the indefinite duration in 1.44, and the direct statements about family dharma, varna, ancestors and hell.

Chapter 1 has all 33 valid translations and is included in the generated localized web and offline builds through the existing chapter completeness gate. Chapter 2 has complete Hindi, French, German, Spanish, Chinese, Portuguese, Italian, Indonesian and Malay manuscripts but remains unpublished locally until all 33 translations pass. Chapters 3–18 are outside this thread’s current goal; other agents may be working on them in the shared workspace. English publication is unchanged. A passing translation check validates the files present; its pending notices do not establish completion of the missing chapters.

At this 16-file checkpoint, `npm test` passed all 292 tests, `npm run check-translations` passed with the expected pending-commentary notices, and the full `npm run build` packaged the offline extension. All 752 translated verse pairs passed checks for paragraph coverage, localized section headings, source hashes, identifiers, citations and reference URLs. Inspection of generated source assets, the web build and the offline package confirmed all 701 Sanskrit/IAST verses, all 18 approved English commentary chapters, complete existing localized article/blog/search collections, the unpublished-commentary gate and offline draft isolation. Rendered English verse bodies still match the approved manuscripts; offline source URLs remain reference metadata with outbound source links disabled. Existing bundle/style budget warnings remain. No routing or extension-build code changed.

The separately requested verse-picker scrollbar spacing fix is committed as `0a4069b92` (shared CSS) and `c21845dcf` (matching deployment build). The compiled web and offline readers include `padding-inline-end: 1rem` and `scrollbar-gutter: stable` for the verse grid. The generated deployment changes were checked to contain only the padding rule and matching bundle references; no translation manuscripts were included in these commits. The local preview was restored on port 4201. Automated visual verification could not run because isolated Chrome launches timed out during display initialization.

The next direct-authorship batch adds complete Arabic, Japanese, Russian, Korean and Swahili versions of Chapter 1: 235 additional meaning/explanation pairs, bringing the total to 987. Review checks every paragraph against the approved source, distinguishes Bhishma from Bhima, retains both readings of 1.10, and preserves the unspecified duration of the punishment in 1.44. Korean review also corrects the rhetorical logic of 1.39 and the beneficiaries of the desired kingdom in 1.33. All 21 authored chapter files pass source-hash, metadata, paragraph-coverage, localized-heading, citation and reference-URL checks. No localized chapter has passed the all-33-language gate yet.

At this 21-file checkpoint, all 295 unit tests and `npm run check-translations` passed; the full `npm run build` completed and packaged the offline extension. Inspection of generated source, web and offline assets confirmed the approved English source hash, all 701 Sanskrit/IAST verses, all 18 published English commentary chapters, complete localized article/blog/search assets and the continued absence of unpublished localized Gita commentary. The offline package contains all 34 editions of released site content. Existing bundle/style budget warnings remain; no routing or extension-build code changed in this translation batch.

The following direct-authorship batch adds complete Turkish, Vietnamese, Filipino and Persian versions of Chapter 1, with 188 further meaning/explanation pairs. The 25 files now cover 1,175 verse pairs. Review preserves the beneficiaries of the hoped-for kingdom in 1.33, the distinction between Bhishma and Bhima, the two readings of 1.10 and the unspecified duration in 1.44. All introductions, source descriptions, translated tags and both sections of all 47 verses are present in every new file. No translation API or browser translation service was used; the approved English and the all-language release gate remain unchanged.

At the 25-file checkpoint, all 296 current unit tests and the translation checks passed, and the complete root build produced the website and offline extension ZIP. The detailed audit validates metadata, source hashes, verse order, paragraph coverage, localized headings, citations and source URLs across all 25 files. Generated source, web and offline assets retain all 701 Sanskrit/IAST verses and 18 approved English chapters; all 33 localized article/blog/search collections remain complete. No localized Gita chapter has cleared its 33-language gate yet. Eight Chapter 1 editions remain: Kannada, Malayalam, Sanskrit, Odia, Sinhala, Nepali, Thai and Kashmiri; Chapters 2–18 are still pending in all translation languages.

The next direct-authorship batch adds complete Kannada, Nepali, Sanskrit and Thai versions of Chapter 1, adding 188 meaning/explanation pairs for a total of 1,363. All four editions translate the introduction, metadata, all 47 verse pairs and the complete Sources section. Review preserves both interpretations of 1.10, the relatives for whose sake the kingdom was desired in 1.33, the rhetorical argument in 1.39, the direct claims about family dharma, varna, ancestors and hell, and the unspecified duration in 1.44. The Sanskrit commentary is a prose rendering of the approved English; the original Sanskrit scripture text remains unchanged. Chapter 1 still needs Malayalam, Odia, Sinhala and Kashmiri. Chapters 2–18 remain pending in all 33 translation languages.

At the 29-file checkpoint, all 296 unit tests and `npm run check-translations` passed; the full root `npm run build` completed and packaged the offline extension ZIP. The manuscript audit checked all 1,363 translated verse pairs for source hashes, metadata, verse order, localized section headings, paragraph coverage, citations and unchanged reference URLs. Inspection of generated source, web and offline assets confirmed all 701 Sanskrit/IAST verses, all 18 approved English chapters and complete article/blog/search collections in all 34 editions. The English manuscripts still match their approved committed text, unfinished localized Gita commentary remains absent, and the offline package retains source URLs only as reference metadata with draft commentary excluded. Existing bundle/style budget warnings remain. No routing or extension-packaging code changed.

The next direct-authorship batch completes Chapter 1 in Malayalam, Odia, Sinhala and Kashmiri, adding 188 meaning/explanation pairs for a total of 1,551. Every edition contains the full introduction, translated metadata, all 47 verse pairs and the complete Sources section. Review preserves Bhishma/Bhima, both readings of 1.10, the relatives for whose sake the kingdom was wanted in 1.33, the rhetorical argument in 1.39, the claims about family dharma, varna, ancestors and hell, and the unspecified duration in 1.44. All 33 Chapter 1 manuscripts pass the chapter validator and detailed paragraph/citation audit. The source Sanskrit and all 18 approved English manuscripts remain unchanged. Chapters 2–18 still require 561 translation files.

At the 33-file checkpoint, all 296 unit tests and `npm run check-translations` passed. The full root build completed and packaged the offline extension after a network-enabled rerun of the required Firestore refresh. Generated source, web and offline indices now list Chapter 1 in `commentaryChapters`; every localized chapter asset exactly matches its manuscript, including all 47 verse pairs. The audit also verified all 701 Sanskrit/IAST verses, all 18 approved English chapters and complete article/blog/search collections in all 34 editions. Checks using the actual scripture and search services passed 136 language/mode/package cases: localized chapter loading, exact verse links, verse search, normal/dev modes, offline assets, and no English fallback for untranslated chapters. The ZIP itself contains Chapter 1 in all 34 editions, excludes draft commentary and retains source URLs only as reference metadata. Existing bundle/style budget warnings remain. No routing or extension-build code changed. Chapter 1 is included in the generated web and offline builds; the overall translation task remains incomplete until Chapters 2–18 are translated and verified.

The next direct-authorship batch adds complete Hindi, French and German editions of Chapter 2, covering all 72 meanings and explanations in each edition: 216 additional verse pairs, bringing the total to 1,767. Each file includes the introduction, metadata and complete Sources section. Review preserves the distinction between the imperishable self and perishable bodies, Shankara’s and Ramanuja’s different readings of 2.12, the direct commands concerning kshatriya duty and battle, heaven and sin, all the instructions about action and inaction in 2.47, and the fuller discussions of restraint, devotion and steady wisdom. The three new files pass the chapter validator and paragraph/citation audit. Chapter 2 still needs the other 30 languages; Chapters 3–18 remain wholly pending.

At the 36-file checkpoint, all 296 unit tests and `npm run check-translations` passed, and the full root build completed after a network-enabled rerun of the required Firestore refresh. The detailed manuscript audit covers all 1,767 translated verse pairs and confirms source hashes, identifiers, metadata, localized headings, paragraph coverage, citations and source URLs. Generated source, web and offline assets retain all 701 Sanskrit/IAST verses, all 18 unchanged approved English chapters and Chapter 1 in all 33 translations. The new Chapter 2 manuscripts remain unpublished through the existing all-language gate. All 34 article/blog/search editions remain complete. The extension ZIP was separately inspected for these chapter gates, original verse coverage, the 72-verse English Chapter 2, disabled outbound source links and draft isolation. Existing bundle/style budget warnings remain; no routing or extension-build code changed.

The next direct-authorship batch adds complete Spanish, Chinese and Portuguese editions of Chapter 2, with 216 additional meaning/explanation pairs, bringing the total to 1,983. Each file includes all 72 verses, the introduction, translated metadata and the complete Sources section. Review retains the enduring self/body distinction, Shankara’s and Ramanuja’s differing readings of 2.12, the direct statements about kshatriya duty, battle, heaven and sin, the action/inaction instructions of 2.47, and the explanations of restraint, devotion, steady wisdom and karmic results. All six Chapter 2 files pass the chapter validator; the detailed audit covers all 39 manuscripts. Chapter 2 still needs 27 translation languages, and Chapters 3–18 remain pending in all languages.

At the 39-file checkpoint, all 296 unit tests and `npm run check-translations` passed, and the full root `npm run build` completed with the required Firestore refresh, website generation and offline-extension ZIP. The detailed manuscript audit checks all 1,983 verse pairs for metadata, source hashes, Sanskrit-source identifiers, localized section headings, verse order, paragraph coverage, citations and source URLs. Generated source, web and offline assets retain all 701 Sanskrit/IAST verses, all 18 unchanged approved English chapters, Chapter 1 in all 33 translations and the pending Chapter 2 gate. Article, blog and search collections remain complete in all 34 editions. The ZIP was separately inspected for original verse coverage, released chapters, the absence of unfinished localized Chapter 2 and draft commentary, and disabled outbound source links. Existing bundle/style budget warnings remain; no routing or extension-build code changed.

The next direct-authorship batch adds complete Italian, Indonesian and Malay editions of Chapter 2, with all 72 meaning/explanation pairs in each edition. This adds 216 pairs, bringing the Chapters 1–2 total to 2,199 across 42 files. Review preserves the self/body distinction, the two named interpretations in 2.12, duty and battle, heaven and sin, all action/inaction instructions in 2.47, and the longer discussions of restraint, devotion and steady wisdom. All nine Chapter 2 editions pass the chapter validator. The user subsequently set the endpoint of this goal at Chapter 2: finish its remaining 24 languages, then stop. Chapter 3 and later manuscripts written by other agents have not been edited here.

At this nine-language Chapter 2 checkpoint, all 296 unit tests and `npm run check-translations` passed, and the full root build produced the website and offline extension ZIP. The detailed manuscript audit covers only this thread’s Chapters 1–2 scope: all 42 files and 2,199 verse pairs pass metadata, source-hash, localized-heading, verse-order, paragraph-coverage, citation and source-URL checks. The generated source, web and offline assets retain all 701 Sanskrit/IAST verses, all 18 unchanged approved English chapters, localized Chapter 1 and the pending Chapter 2 gate. Other agents’ later chapters were checked only for compatibility with the existing build validation and presence of released assets. All 34 article/blog/search collections remain complete. The ZIP was separately checked for original verse coverage, released asset coverage, the Chapter 2 gate, disabled outbound source navigation and draft isolation. Existing bundle/style budget warnings remain; no routing or extension-build code was changed by this batch.
