# India History

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

It also generates page-specific social preview HTML and JPEG images for every
published article and blog. See [social preview setup](docs/social-previews.md)
for image overrides, local testing, language limitations, and the required
Amplify rewrite configuration.

Translated article and blog URLs use language prefixes such as
`/hi/article/ashoka-edicts` and `/fr/blogs/ashoka-in-stone`, with localized
sharing metadata. Existing `?lang=` links remain supported by the app.

## Reviewing English article drafts

Keep unapproved articles in `content/drafts/articles/`. Run
`npm run build-content`, then open `/article/<slug>?dev=true&lang=en` in the
development server. Drafts can replace a published article of the same slug
for English dev-mode review. Normal and translated pages continue to use
published content, and drafts have no generated social-preview routes or
public search entries. Dev-mode search includes their full text. Draft assets
are separate JSON files for review; dev mode is not an access-control system.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


### Book links

Edit `src/app/data/recommended-books.ts` for the original picks, or
`src/app/data/amazon-history-books.ts` or `src/app/data/world-history-books.ts`
for the larger collections. Every book has a regular Amazon.in product URL.
Indian-history source details are recorded in
`content/books/amazon-history-sources.json`; world-history sources are in
`content/books/world-history-sources.json`. The 200 world-history additions use
direct product links listed by Penguin Random House India and Oxford University
Press India, plus ASINs captured in a February 2024 Amazon.in book dataset and
an archived Amazon.in history-category index. The archived records establish
past product listings; current stock and price have not been checked. `affiliateUrl` is optional;
when absent, cards display a red border and an “Affiliate link pending” label.
Adding it automatically switches all book links and removes the pending styling.
The Books/Must Read list supports title/author/ISBN/ASIN search and link-status filtering.

The added Romila Thapar *A History of India* listing (ASIN 0140138358) was
checked against https://www.amazon.in/dp/0140138358 on 2026-09-25, including
author, cover, publisher, format, date, page count and ISBN. Stock and price
are not asserted for any listing.


### Custom book order

Edit `customRank` in `src/app/data/recommended-books.ts` or
`src/app/data/amazon-history-books.ts` or `src/app/data/world-history-books.ts`.
Lower numbers appear first. The eight
original recommendations have ranks 1–8 and appear before the unranked additions.
Give another book a lower rank to move it up; equal and missing ranks retain the
array order. The Books page initially renders 24 matching books and appends 24
more when the reader approaches the bottom; its Load 24 more button also works
without scroll observers.

### Blogs and historical stories

Historical stories live in `content/articles/` and appear in the timeline,
period, polity, theme, and personality sections. Blog posts live separately in
`content/blogs/` and appear only at `/blogs` and `/blogs/:slug`; they are not
included in story counts or the story search index. See
`content/blogs/README.txt` for the Markdown frontmatter format. Run
`npm run build` after adding a post to regenerate the JSON and deployable `dist/`.

The build writes story summaries to `assets/generated/articles.json` and full
stories to `assets/generated/stories/<slug>.json`, with matching files for each
available language. The app fetches summaries at startup, a full story when it
is opened, and the full-text search index when a search is submitted.

Readers see only periods, sub-periods, polities, themes, and personalities that
have at least one linked story. Parent periods stay visible when a descendant
has a story. Empty homepage sections, search categories, and the Blogs header
link stay hidden. Visit `/dev` or add `?dev=true` to any page to see the full
catalogue while editing; `?dev=false` returns to the reader view. Dev mode is
remembered for the current browser session. New stories reveal their linked
sections automatically after the content build.
Dev mode also shows affiliate-link status, the link-status filter, and source
verification notes on books; readers see a uniform book-card design.

### World history timeline

The World History link in the header opens the homepage section when it has a
story, or in dev mode. Mark a story with the `World History` tag, the
`world-history` period, or the `world-history` theme to reveal it. Edit
`src/app/data/world-history.ts` to add, change, or reorder its major events.
These overview cards are separate from Indian history story counts.
