# Complete Gita approved English source

[Begin Chapter 1](http://localhost:4201/scriptures/bhagavad-gita/1?dev=true&lang=en) · [Chapter 2](http://localhost:4201/scriptures/bhagavad-gita/2?dev=true&lang=en) · [Chapter 18](http://localhost:4201/scriptures/bhagavad-gita/18?dev=true&lang=en) · [Library](http://localhost:4201/scriptures?lang=en).

All 18 chapters now have original English meanings and explanations for all 701 verses, approximately 73,212 whitespace-separated words including introductions and source notes. The manuscripts are `content/articles/bhagavad-gita-chapter-01.md` through `bhagavad-gita-chapter-18.md`. After the initial Chapter 1 review, the user explicitly chose completing English Chapters 2–18 before translations, using parallel drafting followed by consistency review.

| Review chapter | Verses | Words, including notes |
| --- | ---: | ---: |
| [Chapter 1](http://localhost:4201/scriptures/bhagavad-gita/1?dev=true&lang=en) | 47 | 5,747 |
| [Chapter 2](http://localhost:4201/scriptures/bhagavad-gita/2?dev=true&lang=en) | 72 | 7,605 |
| [Chapter 3](http://localhost:4201/scriptures/bhagavad-gita/3?dev=true&lang=en) | 43 | 4,041 |
| [Chapter 4](http://localhost:4201/scriptures/bhagavad-gita/4?dev=true&lang=en) | 42 | 4,099 |
| [Chapter 5](http://localhost:4201/scriptures/bhagavad-gita/5?dev=true&lang=en) | 29 | 2,866 |
| [Chapter 6](http://localhost:4201/scriptures/bhagavad-gita/6?dev=true&lang=en) | 47 | 4,584 |
| [Chapter 7](http://localhost:4201/scriptures/bhagavad-gita/7?dev=true&lang=en) | 30 | 3,088 |
| [Chapter 8](http://localhost:4201/scriptures/bhagavad-gita/8?dev=true&lang=en) | 28 | 2,934 |
| [Chapter 9](http://localhost:4201/scriptures/bhagavad-gita/9?dev=true&lang=en) | 34 | 3,573 |
| [Chapter 10](http://localhost:4201/scriptures/bhagavad-gita/10?dev=true&lang=en) | 42 | 4,271 |
| [Chapter 11](http://localhost:4201/scriptures/bhagavad-gita/11?dev=true&lang=en) | 55 | 5,907 |
| [Chapter 12](http://localhost:4201/scriptures/bhagavad-gita/12?dev=true&lang=en) | 20 | 2,305 |
| [Chapter 13](http://localhost:4201/scriptures/bhagavad-gita/13?dev=true&lang=en) | 35 | 3,654 |
| [Chapter 14](http://localhost:4201/scriptures/bhagavad-gita/14?dev=true&lang=en) | 27 | 2,840 |
| [Chapter 15](http://localhost:4201/scriptures/bhagavad-gita/15?dev=true&lang=en) | 20 | 2,339 |
| [Chapter 16](http://localhost:4201/scriptures/bhagavad-gita/16?dev=true&lang=en) | 24 | 2,558 |
| [Chapter 17](http://localhost:4201/scriptures/bhagavad-gita/17?dev=true&lang=en) | 28 | 2,920 |
| [Chapter 18](http://localhost:4201/scriptures/bhagavad-gita/18?dev=true&lang=en) | 78 | 7,881 |
| **Total** | **701** | **73,212** |

## Reading and review

Each card presents Meaning, Explanation, Devanagari Sanskrit and IAST, in that order. The side arrows, keyboard Left/Right and touch swipes move between verses, continue across chapter boundaries and wrap around the book. The reader remembers chapter and verse on reload. The chapter selector and direct verse grid support longer jumps; reader search and the shared site search link to exact verses. Search covers source scripts, IAST without diacritics, verse references and available commentary. Filtered matches loop within their chapter.

The selected Sanskrit source numbers Arjuna’s opening question as 13.1, giving Chapter 13 thirty-five verses and the work 701. Comparisons with editions that omit that numbered question must account for this offset. Devanagari and IAST are generated from the same text. The upstream revision, Unlicense and all local transcription corrections are recorded in `content/scriptures/`. No modern upstream translation or commentary is imported.

## Explanation choices and cross-review

The prose follows the dialogue, the wording of individual verses and the larger argument. Meanings and explanations are original writing, with public-domain Telang and original Sanskrit commentaries used for comparison. External references appear only in each chapter’s final Sources. Difficult terms retain their philosophical, devotional and historical context rather than being silently recast as modern advice.

Named differences among traditional readings are identified where material: divine manifestation at 4.6; equal vision at 6.29; the self and unmanifest at 12.3; knowledge and relinquishment at 12.12; self and field in Chapter 13; Brahman at 14.27; the self at 15.7; the five causes and non-agency at 18.14–20; and surrender at 18.66. The explanations preserve the text’s statements on varna, gender, warfare and religious hierarchy while locating them in the argument. These are not presented as a single traditional commentary.

Parallel drafting covered Chapters 3–6, 7–11 and 13–17; the coordinating author wrote Chapters 2, 12 and 18. Independent cross-reviews checked the remaining batches, including all Meaning passages in Chapters 3–11 and 13–17 and the important agency, duty and surrender passages in Chapter 18. Refinements include the cycle-of-four-ages sense of yuga at 8.17, the distinction among traditional readings at 12.12, and explicit philosophical readings of agency at 18.17. Compiler and manuscript audits verify current Sanskrit hashes, exactly one ordered meaning/explanation pair per verse, final Sources placement and distinct explanation text throughout.

## Approval and translations

The user explicitly approved all 18 English chapters on 26 November 2026: “Approved for english, so commit that.” All 18 manuscripts were moved unchanged from `content/drafts/articles/` into `content/articles/`. Their approved English source is available in English web dev mode with the “Preview · Translations in progress” notice. Public, localized and offline readers retain the complete Sanskrit and IAST, with localized preparation notices, until the all-language gate passes; the offline package excludes preview prose. The 583 required interface/history strings are already authored in all 33 translation editions. This does not constitute translated commentary.

English approval is complete. Author complete translations from these approved sources in all 33 language editions. Preserve the identifiers, Sanskrit-source hash, citations and source URLs, and set each translation’s English source hash. A chapter’s commentary is publicly released only after the complete all-language gate passes. The approval workflow is documented in [AGENTS.md](../../AGENTS.md) and the [source notes](../scriptures/README.md).

## Memberships

These inline chapter manuscripts are excluded from ordinary article lists and article navigation memberships. No existing article or blog was reassigned. Existing memberships and ancestor navigation remain intact; the library and verse reader are discoverable through main navigation, the home section and localized site search.

## Validation

- All 290 unit tests pass, including checks for restored Sanskrit words and the distinction between approved translation previews and unapproved drafts.
- All 33 translation editions pass `npm run check-translations`; the current interface gate remains 583 strings. No commentary translations were created in the English approval change.
- The manuscript compiler and independent audit confirm all 701 ordered meaning/explanation pairs, current Sanskrit-source hashes and distinct explanation text throughout.
- The full root `npm run build` succeeds and generates the complete web application and offline Chrome extension directory and ZIP. The extension retains 48 published articles and 2 blogs in 34 editions. Existing non-fatal bundle and stylesheet budget warnings remain.
- Production Chrome checks compare every rendered Devanagari verse, IAST, meaning and explanation with the generated assets across all 18 English dev chapters. Normal English views show source text only across all 18 chapters.
- Browser checks pass for cross-chapter and circular verse navigation, keyboard controls, the verse grid, reload progress, reader and global search linking to the new Chapter 18 prose, and exclusion of that prose from public search. English, Hindi, Telugu and Arabic readers fit a 390px viewport without horizontal overflow; localized views do not display English preview explanations.
- All 34 generated article, blog and search editions retain the published counts and exclude inline scripture manuscripts. The live localhost:4201 review link serves the new Chapter 18 explanations.
- The installed extension passes in an isolated Chrome profile with networking disabled. Corrected Sanskrit, localized reading and source search work; no preview prose or outbound source links are present. It makes zero HTTP(S) requests, the toolbar opens the bundled reader, and Chrome retains its normal new-tab page.

### English approval verification

All 18 moved files retain the exact bytes of the approved drafts. Search results and chapter pages identify them as translation previews rather than awaiting English approval. The approved-source compiler generates 18 English translation previews without the unapproved-draft flag; public commentary remains gated. Article and blog memberships and counts remain unchanged because scripture manuscripts are inline reader sources.

After the approval move, all 290 tests and the translation checker pass (Gita translations are explicitly pending). The full root build and offline package succeed. Production Chrome verifies all 18 approved-preview chapter labels and verse counts, the corrected search status, public search exclusion, and English/Telugu/Arabic mobile isolation. The installed extension loads localized source text and search with networking disabled, excludes preview prose and makes zero HTTP(S) requests.
