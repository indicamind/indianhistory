# Antisemitism theme hierarchy

The catalog adds `antisemitism` and five child themes: pre-Christian, Christian, Islamic, National Socialist, and international socialist antisemitism. These are section names and concise descriptions, not a new article or blog narrative. The international socialist section covers documented anti-Jewish ideas and persecution within socialist movements and states, including Soviet campaigns.

`Theme.parent` provides the hierarchy. Home lists root themes; the parent page lists its subthemes. Article and blog membership, ancestor topic links, parent counts, search and visibility use the shared section rules. Empty sections retain the existing dev-mode gate. The entry point is `/theme/antisemitism?lang=en&dev=true`.

All six names, ranges and descriptions, plus “Explore subthemes”, are translated directly into all 33 editions. This hierarchy adds 19 translated strings; with the Persecution of Hindus theme, the site requires 542.

## Membership audit

All 64 English article/blog source documents and 2,112 corresponding translations were audited. Their 172 explicit period, polity, theme and personality memberships resolve, and every translated membership agrees with its English source. None of the existing English narratives focuses on antisemitism; no unrelated content has been reassigned. Existing section links remain intact. New child memberships aggregate to the parent without duplicating an entry or adding siblings.

## Sources for the catalog scope

- United States Holocaust Memorial Museum, [Antisemitism](https://encyclopedia.ushmm.org/content/en/article/antisemitism): the term, ancient and Christian backgrounds, religious and secular settings, and persecution.
- United States Holocaust Memorial Museum, [Antisemitism and the Holocaust](https://encyclopedia.ushmm.org/content/en/article/antisemitism-1): Nazi persecution and genocide.
- Yad Vashem, [Stalin, Joseph Vissarionovich](https://wwv.yadvashem.org/odot_pdf/Microsoft%20Word%20-%206042.pdf): Soviet anti-Jewish campaigns and the Doctors’ Plot.

## Verification

- 254 unit tests passed, including parent aggregation, duplicate prevention, sibling exclusion, blog visibility, child counts and parent navigation.
- Translation checks passed for all 33 editions with no English previews.

The later Persecution of Hindus root theme adds two further translated strings (542 total) and one relevant published article membership. It remains separate from the Antisemitism hierarchy. See `persecution-of-hindus-theme-review.md`.

- Browser verification passed all 34 language views: five localized subthemes, parent returns, mobile/RTL layout, root-only home listing, search and the existing empty-section gate. Temporary article/blog fixtures verified ancestor links, counts and both navigation directions in normal/dev modes in English, Hindi, Urdu and Chinese.
- The final root build passed and packaged 48 articles and two blogs in all 34 languages, plus the complete offline-extension ZIP. Existing bundle/CSS budget warnings remain.
- An isolated installed Chrome extension passed parent/subtheme navigation in English, Hindi, Urdu and Chinese with networking disabled; published article/blog reading and images worked without HTTP(S) requests.
