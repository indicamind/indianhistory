# Gita reader and Chapter 1 review

[Review Chapter 1](http://localhost:4201/scriptures/bhagavad-gita/1?dev=true&lang=en) · [Library](http://localhost:4201/scriptures?lang=en).

The user selected original explanations with interpretive context and one chapter for style approval before expansion. All 47 verses in Chapter 1 have an original English meaning and a detailed explanation, about 5,750 words including introductory and source notes. The manuscript is `content/drafts/articles/bhagavad-gita-chapter-01.md`.

The reader separately contains the complete source in Devanagari and directly generated IAST across all 18 chapters. The chosen source numbers Arjuna’s opening question in Chapter 13, giving 701 verses. Its edition, pinned upstream revision, licence and local transcription corrections are recorded in `content/scriptures/` and the final Sources. No modern translation or commentary was imported from the upstream dataset.

## Commentary choices

The chapter is read as a dialogue: Dhritarashtra’s question, Sanjaya’s narration, Arjuna’s speech and Krishna’s initial responses remain distinct. The explanation considers particular words, family relationships, the movement from military survey to moral crisis, and the questions raised by the narrative. It does not claim to follow a single traditional commentary.

Verse 1.10 identifies the difference between reading *aparyāptam* as insufficient or unlimited and cites Shridhara and Baladeva’s Sanskrit commentaries. The speaker transitions in 1.21 and 1.28 follow the narrative’s actual transition into Arjuna’s words. References to parental generations in 1.26 do not place Pandu on the field. The discussion of 1.40–1.44 explains family ritual, inherited social rank and Arjuna’s statements about women and varna without removing those statements or turning them into present-day instructions.

Meaning and Explanation are separate sections for every verse. Sanskrit and IAST remain visible and retain left-to-right direction in right-to-left editions. Every chapter has a stable route, and verses have individual fragment links. The chapter selector, verse jump and previous/next chapter links support continuous reading. The reader does not insert unrelated book advertisements into its text column.

## Approval and localization

The English commentary is visible only in English web dev mode. Public views and all translated views show the original text and an explicitly localized preparation note. The offline package excludes all unapproved commentary files. Approval of this draft is needed before it is translated or published, and before this style is expanded into the remaining chapter explanations.

All 30 new interface/catalogue strings are directly authored in all 33 translation editions. The existing approved article, blog and personality content remains unchanged. Sanskrit and IAST are source text, not English fallback. Fully translated commentary is not yet released.

## Membership audit

Existing English article/blog sources and their translated memberships were reviewed. No published standalone article or blog provides a direct Bhagavad Gita membership. Gandhi’s unapproved expanded personality draft discusses discovering the Gita; Kumbha’s Gita Govinda is a different work, and the Ashoka narrative’s Mundaka Upanishad reference is not a Gita association. No unrelated article was assigned to the reader. Existing memberships and ancestor navigation are preserved; the library and on-site Gita reader are discoverable through the main navigation, home section and localized site search.

## Validation

- 267 unit tests pass, including the original suite plus source/transliteration checks, chapter-only fetching, English draft isolation, all-language publication gates, stale-translation withdrawal, language-specific routes, verse fragments and on-site search.
- All 33 translation editions pass `npm run check-translations`, with 576 required interface/history strings.
- Browser checks cover the 18-chapter index, all 47 meanings and explanations in Chapter 1, 78 verses in Chapter 18, source-to-IAST fidelity, chapter-only loading, verse jumping, missing chapter routes and native-language preparation notes. At 390px there is no horizontal overflow, including Hindi, Telugu and Arabic views.
- Final production assets match the reviewed English manuscript, including its 47 complete meaning/explanation pairs. English review text is not exposed in normal or translated views.
- The membership audit covered 64 existing English source documents and 2,112 translated documents; existing identifiers and generated memberships are unchanged.
- `npm run build` produced the application and complete offline extension/ZIP, containing the 701 source verses and the existing 48 articles and 2 blogs in 34 editions. Non-fatal stylesheet budget warnings remain; the new reader stylesheet is 482 bytes above its 4 kB warning threshold.
- Production browser checks confirm that the language picker preserves chapter 2 and verse 2.47 while changing to Telugu, in addition to the chapter/verse and responsive checks above.
- The installed extension was checked in an isolated Chrome profile with networking disabled. English, Telugu and Arabic source chapters load, all unapproved commentary files are absent, sources have no outbound navigation, the reader makes zero HTTP(S) requests, the toolbar opens the bundled reader, and Chrome retains its normal new-tab page.
