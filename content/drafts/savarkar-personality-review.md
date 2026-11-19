# Veer Savarkar personality review

English review: [85 illustrated moments](http://localhost:4201/personality/veer-savarkar?dev=true&lang=en#life-timeline).

The manuscript is `content/drafts/articles/veer-savarkar-life-story.md`. It is an inline personality timeline, not a standalone article. All 85 bubbles have a local image, a dated heading and numbered citations. There are 32 annotated source records and 15 distinct images, including 13 newly sourced files. Individual passages are at most 32 words, excluding headings and dates.

## Coverage

The timeline follows Bhagur and Pune; Mitra Mela and Abhinav Bharat; London, India House, Mazzini and the history of 1857; Dhingra and the Nashik prosecutions; the Morea escape and international arbitration; the Cellular Jail, work, correspondence, petitions and prisoners’ protests; Gandhi’s 1920 interventions; mainland imprisonment and conditional release; Hindutva, literary work, caste reform and Patit Pavan Mandir; Mahasabha leadership, nationality, citizenship, European comparisons, Hyderabad, wartime recruitment and Quit India; Partition and independence; the Gandhi assassination case and acquittal; later restrictions, writing, family life and death; and the subsequent Kapur inquiry and Supreme Court distinction.

Contemporary official records, Savarkar’s writings, Gandhi’s letters and articles, trial material, the arbitration award and inquiry documents are identified individually in the final Sources. His political arguments are presented as his arguments. Colonial surveillance, advocacy submissions, retrospective memoirs and commemorative biographies are identified by type.

## Historical checks

- Gandhi’s January 1920 letter was to Narayan Savarkar. It is not used to claim that Gandhi advised Vinayak’s earlier petitions.
- The 1910 Bombay High Court decision concerns jurisdiction, and the 1911 Hague award concerns international custody. Neither is represented as a finding on the Indian criminal charges.
- The Mahasabha succession in 1944 is to Syama Prasad Mookerjee, supported by Savarkar’s dated statement. Bengal’s Fazlul Huq ministry is distinguished from the Sind coalition with the Muslim League.
- Savarkar’s 1938–1940 statements about European nations and Nazism are attributed to him; they are not assertions about Jews or other communities.
- The 1949 acquittal, posthumous 1969 commission findings and 2018 Supreme Court decision remain separate. The Supreme Court did not overturn the acquittal or adjudicate the correctness of the inquiry’s findings.
- The memorial chronology contains inconsistent details: a Bose visit dated after Bose had left India, conflicting dates for the second sentence, and an incorrect age at death. Those details are not adopted. Birth in May 1883 and death in February 1966 give an age of 82.
- Hindutva is dated to publication in 1923 without repeating a modern introduction’s inconsistent claim that it was completed in the Andamans in 1921–1922.

## Images and presentation

All images are local and accompanied by creator/license sidecars under `content/media/images`. Sources are Wikimedia Commons records, including archival material and present-day site photographs. The hero uses an authentic undated portrait. The London image is the actual 65 Cromwell Avenue house, not another building named India House. The Morea photograph depicts the vessel built in 1908. Modern sites and contextual images are labelled accordingly; the Constituent Assembly photograph does not imply that Savarkar attended that session.

The title page illustrates the 1923 work only. Trial photographs and the newspaper are labelled by subject/date; the newspaper is not used as an image of the later commission. The damaged prison portrait is described as a damaged archival photograph without inventing a cause. The family image is dated only to the record’s “before 1950.” Exact capture dates are not inferred from upload dates.

The existing shared renderer puts images to the left of text on desktop and above text on mobile. Bubble images use lazy-loaded WebP thumbnails with image dimensions and JPEG fallbacks. Clicking opens the larger local image. Visible credits are plain text; linked image sources and licenses appear in the final Sources → Image credits. No external links appear in the narrative.

## Membership and translation audit

Savarkar is added to the shared personality catalogue and profile definitions. Existing published English articles/blogs and their translated membership metadata were audited; none provides a Savarkar article to associate. Existing memberships and approved narrative hashes remain unchanged. No unrelated article is assigned to fill an empty list. The shared article-section rules continue to derive navigation.

The four new catalogue strings (name, range, summary and portrait alt text) are authored directly in all 33 translation editions. Historical-photo and other shared interface labels use their existing translations. There is no translation API. All 34 editions remain available. The full 85-bubble narrative remains an English dev draft until approval, including its dates, alt text, captions and sources.

## Validation

- `npm test`: 254 passed, 0 failed.
- `npm run check-translations`: all 33 translation editions pass.
- `npm run build`: production application, share pages and complete offline extension/ZIP built; 48 articles and 2 blogs bundled in all 34 editions. Non-fatal stylesheet budget warnings remain; the shared image-viewer stylesheet is 86 bytes over its 4 kB warning threshold.
- Production Chromium checks: 85 cited and illustrated bubbles; 15 distinct image assets; all 85 images marked lazy, with 8 initially loaded; images to the left on desktop; no overflow at 390px; a 390px-wide mobile dialog and accessible close control; 32 source records; no page errors.
- English normal mode and Hindi, Telugu and Arabic dev views exclude the draft. The profile title, summary and portrait alt text are localized. Generated profiles and draft isolation were inspected in all 34 editions; the detailed draft is absent from released article and search assets.
- Membership audit: 64 existing English source documents, including inline timelines, and 2,112 translated source documents. Existing identifiers are unchanged; explicit localized identifiers and inherited identifiers in all generated article/blog editions match the English memberships.
- Installed-extension verification in an isolated Chrome profile with networking disabled: English and Telugu Savarkar profiles and portraits load, the unapproved story stays excluded, the released Ashoka timeline and Telugu civilizational-roots blog load, and the reader makes zero HTTP(S) requests. The toolbar handler opens the bundled reader; Chrome retains its native `chrome://new-tab-page/` page. No page errors were observed.
- Offline draft exclusion was checked in all 34 editions. The complete ZIP was generated at `chrome-extension/dist/india-history-new-tab.zip`.
