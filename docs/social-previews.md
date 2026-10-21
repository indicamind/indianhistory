# Social link previews

`npm run build` runs `scripts/generate-share-pages.js` after Angular compiles.
Each published article and blog gets an HTML shell at its route's `index.html`,
containing its title, excerpt, canonical URL, Open Graph tags and X/Twitter card
tags. Crawlers can read them without running Angular. The normal Angular app
still loads for readers. This generates metadata, not server-rendered article
bodies, and needs no always-running server.

## Images

By default, the first `<img>` in the article or blog is the featured image.
An entry without an image uses the India History cover generated from the site's
existing mark. To choose another image, add this optional English frontmatter:

```yaml
shareImage: /assets/media/images/ashoka-kandahar-bilingual.jpg
```

The build carries the override into all localized entry data. It leaves article
text and its translation hash unchanged. Local images become 1200 × 630 JPEGs,
fitted with padding so that tall inscription plates remain complete. Images are
deduplicated and named by content hash under `assets/share/`. A direct external
HTTPS override is used as supplied, without downloading it; provide an appropriately
sized JPEG or PNG at that address. Missing local images fail the build.

The default public site is `https://www.indiahistory.info/`. Set `SITE_URL` to an
HTTPS base URL (including a path prefix if needed) for a different deployment.
The Angular `--base-href` option is still passed to Angular as before.

## Languages and drafts

Every published article and blog gets an HTML preview in English and all 15
translation languages. English keeps its existing URL; other languages use a
prefix, for example:

```text
/article/ashoka-major-rock-edict-1
/hi/article/ashoka-major-rock-edict-1
/ar/blogs/ashoka-in-stone
```

Titles, descriptions, image alt text, document language/direction and canonical
URLs come from the corresponding localized content. Alternate-language links
and Open Graph locales are included. Images are shared across languages, without
creating another JPEG per translation. The generator fails if a published entry
is missing in a requested language.

Angular recognizes the language prefix before loading content. Article/blog
links and language switching use these paths automatically. Non-content pages
such as search, books and the home page keep their existing `?lang=` convention.

Old article/blog `?lang=hi` links still open Hindi and are normalized to the new
path by Angular. Crawlers that do not execute JavaScript still see the initial
English metadata at those old query URLs; **share the localized path** for a
translated preview. A language prefix takes precedence over a conflicting
`lang` query. Preview canonical URLs omit `lang`, `dev`, navigation context and
other query parameters.

Unapproved blog drafts and `previewOnly` articles do not get share pages. Existing
`/post/<slug>` article aliases get the canonical article metadata as well.

## Amplify configuration required

Rewrite rules are stored in the Amplify console, not in `amplify.yml`. The build
does not change those settings. In **Hosting → Rewrites and redirects**, replace
the catch-all SPA **200 rewrite** with the **404-200 fallback** in
[`amplify-rewrites.json`](../amplify-rewrites.json). Keep any needed domain
redirects above it and remove any other unconditional SPA 200 rewrite.

This lets Amplify serve real generated HTML files first and use the app shell
for missing extensionless SPA routes. The pattern excludes filenames, so missing
image or JSON requests can still return 404. Amplify supports clean folder URLs;
it may add a trailing slash to serve a directory's `index.html`.

This JSON is an import example; committing it does **not** apply console settings.
Check the deployed URL after changing the rules. AWS documents
[rule ordering](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html),
[clean URLs](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html),
and the [404-200 rule type](https://docs.aws.amazon.com/amplify/latest/APIReference/API_CustomRule.html).

## Verification

Inspect the built HTML directly, or start a static server:

```sh
python3 -m http.server 8080 --directory dist/hello-world/browser
curl -sL 'http://localhost:8080/blogs/ashoka-in-stone/'
curl -sL 'http://localhost:8080/hi/blogs/ashoka-in-stone/'
```

`ng serve` provides the development SPA and does not run the post-build HTML
generator. Use the built static files when testing crawler metadata locally.

After deployment, inspect the **exact localized URL** being shared:

```sh
curl -sL 'https://www.indiahistory.info/hi/blogs/ashoka-in-stone'
```

The response must contain this blog's Hindi `og:title`, `og:description` and absolute
HTTPS `og:image` inside `<head>`, and the image URL must return an actual JPEG.
If the response contains only the homepage metadata, check the Amplify rules.
Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to
inspect or refresh cached previews. Previously shared links can retain cached
images and text until each service refreshes them.
