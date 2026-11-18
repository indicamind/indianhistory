# Colonization of India: English timeline review

Status: English draft awaiting approval. The narrative is not published, translated, or included in the offline extension.

Review page: http://localhost:4201/theme/colonization-of-india?lang=en&dev=true

English source: [colonization-of-india-timeline.md](articles/colonization-of-india-timeline.md)

## Scope

The theme contains 100 dated bubbles, starting with the established Indian Ocean trading world and the Portuguese arrival in 1498. It follows the Portuguese, Dutch, Danish, English and French establishments; company conquest and revenue government; regional and Adivasi resistance; the 1857 uprising; Crown rule; economic criticism and organised national politics; and the transfer of power and Partition in 1947. The final bubble is an epilogue covering the Republic and the remaining French and Portuguese enclaves through 1962.

Nonviolent resistance includes collective refusal, swadeshi, satyagraha, non-cooperation, salt campaigns, Khudai Khidmatgar organisation and constitutional negotiations. Armed resistance includes regional wars and uprisings, Ghadar, revolutionary organisations, Kakori, Bhagat Singh and his associates, Chittagong, the INA and the 1946 naval revolt. The account distinguishes the stated nonviolent programme of Quit India from the varied actions after the leadership's arrest. Civilian killings and communal violence are not presented as interchangeable with anticolonial resistance.

## Evidence and illustrations

Every bubble has numbered citations into 45 source references. These identify original charters, treaties, statutes, correspondence, proclamations, inquiry reports, newspapers, speeches, court statements and assembly proceedings. Later participant memoirs and retrospective colonial administrative compilations are identified as such. Official and revolutionary accounts retain their different perspectives; political declarations are evidence of their authors' aims, rather than proof of every claim they make.

The 100 bubbles use 33 distinct freely licensed images, including maps, original documents, portraits, historic sites, photographs and later artwork. Twenty-four new colonization assets supplement existing site images. Captions distinguish later artwork and geographical context from documentary depictions of an event. A 1909 map used for geographical context is explicitly dated rather than presented as a map of earlier political boundaries. Attribution is visible beside images; original links, licenses and modification details appear in Sources → Image credits.

The shared layout places images to the left of the bubble text on desktop and above it on mobile. Images use local lazy-loaded WebP thumbnails with a full-image viewer. The hero depicts members taking the pledge at the independence session of the Constituent Assembly.

## Approval and release

The English draft is available only in English dev mode. Other themes retain their existing pages. Normal views, translated editions and the offline extension exclude this unapproved narrative. Once the English text is approved, its complete narrative, dates, captions, alt text and sources must be translated and reviewed in all 33 editions before release.

The existing colonization theme slug is unchanged. Published article memberships were audited. The Mewar article, which covers the 1818 protection treaty, British paramountcy and accession, is associated with this theme in English and all 33 translations. Three relevant bubbles link to it, and the article’s derived navigation links back to the theme. Inline timeline documents are excluded from standalone article and search listings.

## Companion correction

The two repeated Buddha images now use different sites: Sanchi for the chief disciples, and Venuvana in Rajgir for Bimbisara's patronage. Venuvana's site label is supplied in every translation edition. The English narrative is unchanged.

## Verification

- 243 unit tests passed, including theme membership, article backlinks, draft isolation and the all-language release gate.
- `npm run check-translations` passed for all 33 editions.
- Chromium verified 100 unique bubbles with citations and images; image-left desktop and stacked mobile layouts; WebP assets and zoom; 45 source references; related article navigation; English dev-only visibility; and the two distinct Buddha images.
- `npm run build` passed and packaged the complete offline extension and ZIP: 48 articles and one blog in 34 languages, including English. Existing CSS budget warnings remain.
- The installed extension was checked in an isolated Chrome profile with networking disabled: toolbar entry, reading, language switching, article navigation and images worked without HTTP(S) requests. Unapproved theme drafts were absent in all 34 language asset sets.
- All 19 personality timelines passed browser regression checks; 476 released personality editions retained their image assets.
- Generated article/search data in all 34 languages retained the Mewar theme association and valid translation source hashes. Browser navigation was checked in English, Hindi and Korean in normal and dev modes.
