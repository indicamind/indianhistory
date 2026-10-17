# Ashoka inscription collection — editorial draft

The English source articles now live in `content/articles/` as previews, at the
user's request to see the work on the local site. They carry
`previewOnly: true`. The build omits these articles from localized editions
as translated content until their complete translations are ready. It shows
them as labeled English previews in every language, while the existing
translated articles remain localized.

Current inventory: 39 inscription article previews plus the guide. Laghman II
has source notes below but is not yet a publishable article.

## Scope

- One article per distinct edict or associated inscription, not per site copy.
- Preserve the complete surviving text of the named edition, its source script
  facsimile or photograph, Roman transliteration, full English translation,
  explanation, and scholarly sources.
- Greek and Aramaic records with disputed Ashokan attribution must retain that
  uncertainty in all language editions.
- A guide article (`ashoka-edicts.md`) groups and links all child articles.

## Translation work

`scripts/build-ashoka-translations.js` assembles human-authored translations
from `content/ashoka-localizations/<language>.json`, retaining each English
article's metadata and source links and computing the required `sourceHash`.
The files it writes go to `content/translations/<language>/articles/`.
For example:

```sh
node scripts/build-ashoka-translations.js hi --slug=ashoka-major-rock-edict-1
```

The Hindi guide and Major Rock Edict I are initial reviewed examples. Every
remaining article still needs complete, directly authored translations in
`hi`, `bn`, `ta`, `te`, `mr`, `ur`, `gu`, `kn`, `ml`, `pa`, `es`, `fr`, `ar`,
`zh`, and `pt`. No translation API or browser translation service is used.

## Open source review

- Laghman II needs a verified line-by-line Roman transcription before an
  article can claim to show its complete surviving text. Its photograph and
  drawing are in [Falk 2006, pp. 249–250](https://doi.org/10.5281/zenodo.3403874),
  citing Davary and Humbach's 1974 edition. Falk also documents conflicting
  interpretations; the guide must not call it a certain royal edict.
- Verify each modern image's reuse terms before moving it into production.
- Recheck Greek and Aramaic letter readings against the editions named in
  their respective draft articles before translating those articles.

## Publication gate

After all English source articles and all translated articles are complete,
remove their `previewOnly: true` markers, then run `npm run check-translations`
and `npm run build`. Inspect localized article, search, and site assets in
`src/assets/generated/<language>/`. Mark the full collection complete only
when all 15 languages report complete and the built guide links every child.
