# Colonization of India: English timeline review

Status: English draft awaiting approval. The narrative is not published, translated, or included in the offline extension.

Review page: http://localhost:4201/theme/colonization-of-india?lang=en&dev=true

English source: [colonization-of-india-timeline.md](articles/colonization-of-india-timeline.md)

## Scope

The theme contains 140 dated bubbles, starting with the established Indian Ocean trading world and the Portuguese arrival in 1498. It follows the Portuguese, Dutch, Danish, English and French establishments; company conquest and revenue government; regional and Adivasi resistance; the 1857 uprising; Crown rule; economic criticism and organised national politics; and the transfer of power and Partition in 1947. The final entries form an epilogue covering the Republic and the remaining French and Portuguese enclaves through 1962.

Nonviolent resistance includes collective refusal, swadeshi, satyagraha, non-cooperation, salt campaigns, Khudai Khidmatgar organisation and constitutional negotiations. Armed resistance includes regional wars and uprisings, Ghadar, revolutionary organisations, Kakori, Bhagat Singh and his associates, Chittagong, the INA and the 1946 naval revolt. The account distinguishes the stated nonviolent programme of Quit India from the varied actions after the leadership's arrest. Civilian killings and communal violence are not presented as interchangeable with anticolonial resistance.

## Compact reading revision

The user requested shorter, slightly wider bubbles. The revised English draft has 140 entries averaging 26.6 words (maximum 32), compared with 54.8 words across the original 100. Longer subjects are split into focused moments, including court negotiations, revenue arrangements, civic and revolutionary campaigns, and the separate stages of the final territorial transfers. Existing dated entries are ordered by their starting period, with overlapping ranges retained.

All 100 original chapter identifiers are preserved. The three related-article links retained at this stage were removed in the later membership correction below. Every entry remains cited; all 45 source references, the complete Sources text and all 33 image assets are retained. No historical narrative has been published or translated during this revision.

Theme timelines now allocate slightly more space to the text cards, with less padding, shorter headings and smaller image panels. Mobile image panels remain above the text. The new rules are scoped to themes, preserving personality layouts.

## Evidence and illustrations

Every bubble has numbered citations into 45 source references. These identify original charters, treaties, statutes, correspondence, proclamations, inquiry reports, newspapers, speeches, court statements and assembly proceedings. Later participant memoirs and retrospective colonial administrative compilations are identified as such. Official and revolutionary accounts retain their different perspectives; political declarations are evidence of their authors' aims, rather than proof of every claim they make.

The 140 bubbles now use 35 distinct freely licensed images, including maps, original documents, portraits, historic sites, photographs and later artwork. Twenty-seven new colonization assets supplement existing site images. Captions distinguish later artwork and geographical context from documentary depictions of an event. A 1909 map used for geographical context is explicitly dated rather than presented as a map of earlier political boundaries. Attribution is visible beside images; original links, licenses and modification details appear in Sources → Image credits.

The shared layout places images to the left of the bubble text on desktop and above it on mobile. Images use local lazy-loaded WebP thumbnails with a full-image viewer. The hero depicts members taking the pledge at the independence session of the Constituent Assembly.

## Approval and release

The English draft is available only in English dev mode. Other themes retain their existing pages. Normal views, translated editions and the offline extension exclude this unapproved narrative. Once the English text is approved, its complete narrative, dates, captions, alt text and sources must be translated and reviewed in all 33 editions before release.

The existing colonization theme slug is unchanged. Following the user’s review, the Mewar article is excluded from this theme in English and all 33 translations, and the three timeline links to it are removed. Its Medieval Period, Rajputs, Mewar and personality memberships remain. Inline timeline documents are excluded from standalone article and search listings.

## Companion correction

The two repeated Buddha images now use different sites: Sanchi for the chief disciples, and Venuvana in Rajgir for Bimbisara's patronage. Venuvana's site label is supplied in every translation edition. The English narrative is unchanged.

## Original verification

- 243 unit tests passed, including theme membership, article backlinks, draft isolation and the all-language release gate.
- `npm run check-translations` passed for all 33 editions.
- Earlier Chromium verification covered the original 100 unique bubbles with citations and images; image-left desktop and stacked mobile layouts; WebP assets and zoom; 45 source references; related article navigation; English dev-only visibility; and the two distinct Buddha images.
- `npm run build` passed and packaged the complete offline extension and ZIP: 48 articles and one blog in 34 languages, including English. Existing CSS budget warnings remain.
- The installed extension was checked in an isolated Chrome profile with networking disabled: toolbar entry, reading, language switching, article navigation and images worked without HTTP(S) requests. Unapproved theme drafts were absent in all 34 language asset sets.
- All 19 personality timelines passed browser regression checks; 476 released personality editions retained their image assets.
- Generated article/search data in all 34 languages retained the Mewar theme association and valid translation source hashes. Browser navigation was checked in English, Hindi and Korean in normal and dev modes.

## Compact revision verification

- All 251 current unit tests and translation checks for all 33 editions passed.
- Chromium checks at 1440, 1024 and 390 pixels verified 140 cited bubbles, all 100 original anchors, 33 WebP assets, 45 sources, three related-article links, image zoom and no horizontal overflow.
- At 1440 pixels, mean text-card width increased from 381 to 431 pixels, while mean height fell from 490 to 189 pixels. At 390 pixels, mean text-card height fell from 397 to 189 pixels. Measurements compare the same 100 chapter identifiers.
- The English dev-only gate remains in place. The first Shivaji bubble has exactly the same mobile dimensions as before this theme-specific change.
- The final root `npm run build` passed and packaged the complete offline reader and ZIP with 48 articles and two blogs in all 34 languages. Existing bundle/CSS budget warnings remain.
- The installed extension was verified in an isolated Chrome profile with networking disabled: toolbar entry, reading in English/Hindi/Korean, images and article navigation worked with no HTTP(S) requests. Unapproved theme drafts remained absent from all 34 bundled asset sets.
- Final generated source and deployment draft assets exactly match the 140 revised entries. All 34 published language asset sets retain their article/blog counts and exclude the unapproved timeline.

## Bose photograph revision

The repeated standing portrait is replaced in all three affected bubbles: Bose reviewing INA troops; Captain Lakshmi Sahgal alongside Bose for the provisional-government and women-soldiers entry; and the Red Fort baoli, photographed in 2016, for the INA trials. The first two photographs are marked public domain in India by their Commons records; Ramesh lalwani’s site photograph uses CC BY-SA 4.0. Each image has local license metadata, a visible plain-text credit and a linked source in the generated final image credits. The narrative, dates and 140 chapter identifiers are unchanged.

The photo revision passed desktop/mobile Chromium checks for all three thumbnails, captions, visible credits, final source links and zoom, plus all 33 translation checks. The full site and offline-extension build passed.

## Mewar membership correction

The user requested removal of the Mewar article card from Colonization of India. Its theme membership is removed in English and all 33 translations, together with the three dependent chapter links. The 140-bubble narrative, citations, dates, images and all article prose and translation source hashes remain unchanged. The article continues to appear in its period, polity and personality sections.

The correction passed all 33 translation checks and the full site/offline build. All 64 English source documents and 2,112 translations were audited for valid matching memberships; final web, search and offline assets were checked in all 34 languages. Browser checks in English, Hindi, Urdu and Korean confirmed removal in normal/dev modes and retained period/Rajputs/Mewar/personality links. An isolated installed extension retained the corrected English/Hindi Mewar navigation with networking disabled and no HTTP(S) requests.
