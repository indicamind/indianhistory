# Article and blog approval workflow

For new articles and blog posts, and substantive rewrites of existing ones, write the English draft first. Present it to the user and wait for explicit approval before creating or updating translations. Do not treat approval of an earlier version as approval of a rewritten draft.

Keep English drafts awaiting approval under `content/drafts/articles/` or `content/drafts/blogs/`, outside the published content directories. Once the user approves the English text, move it into `content/articles/` or `content/blogs/` and complete all supported translations using the requirements below.

Blog drafts are generated separately by `npm run build-content` and can be reviewed at `/blogs/<slug>?dev=true&lang=en`. A draft with the same slug as a published blog replaces it in English dev mode for review. Published and translated blog assets remain independent of drafts.

# Article and blog links

Keep readers on the website while they read an article or blog post. Do not put external links in the narrative, headings, images, or image captions. Collect external references in a clearly labelled Sources section at the end of the article or post. Use plain numbered citation markers in the narrative when needed to connect claims to those sources. Internal website links may remain in the body.

Keep image attribution visible beside each image as plain text, including the creator and license where applicable. Put the linked original image source, creator attribution, and license in an Image credits subsection of the final Sources section. Preserve required attribution and modification details. Apply this placement rule to English drafts, approved content, and every translation when creating or editing articles and blog posts.

# Article section navigation

Article pages replace plain tags with internal links to every section and subsection in which the article appears: timeline periods and their ancestors, empires and kingdoms and their parents, themes, personalities, and parent article guides where applicable. Keep this navigation derived from the shared section-listing rules and article metadata; do not hardcode a separate list of navigation links into article Markdown or templates.

Whenever adding, moving, renaming, or removing a personality, section, subsection, timeline period, theme, empire, kingdom, article, or article series, audit every existing article's memberships and resulting navigation links. Update all relevant `period`, `polity`, `themes`, `personalities`, and `relatedTo` references in the English source and every supported translation. Associate relevant existing articles with newly added sections and personalities. Check that ancestor links remain complete, labels are localized, and each destination exists and provides the expected article or series. Verify links in both directions, from article to section and from section to article, in normal and dev modes. Review the generated localized article and search assets after rebuilding.

# Article recommendations

Separate the two shared “More books” recommendations into individual placements within the article body: one in the first half, near one-third of the prose, and the other in the second half, near two-thirds. Place each between complete content blocks, with article text between the recommendations. This applies to existing and future articles in every language. Keep the placement in the shared renderer and content build; do not hardcode book cards or placement markers into article Markdown. Keep figures, tables, and lists whole, and keep headings attached to their following content. For very short content with too few safe internal boundaries, use the available boundaries and then the end of the article without splitting a block.

# Translation requirement

The site supports English (`en`) and these translation languages: `hi`, `bn`, `ta`, `te`, `mr`, `ur`, `gu`, `kn`, `ml`, `pa`, `or` (Odia), `sa` (Sanskrit), `ne` (Nepali), `si` (Sinhala), `es`, `fr`, `de`, `pt`, `ru`, `ar`, `fa` (Persian), `zh`, `ja`, `th`, `id` (Indonesian).

For articles and blog posts, translate the complete approved English text into every supported language after the approval step above. For other reader-facing content, complete all translations in the same change. This includes navigation, page labels, period and theme descriptions, alt text, and search copy. Leave book titles and book descriptions in their published language; translate the surrounding book interface. English is the source language. Keep slugs, dates, ISBNs, source links, HTML attributes, and factual qualifiers intact. Translate the language of the text, not the historical claim. Review important dates, names, uncertainty statements, and citations in each translation.

For an article or blog post, add a Markdown file under `content/translations/<language>/articles/` or `content/translations/<language>/blogs/` with the same filename as the English source. Translate the `title`, `excerpt`, `tags`, body, and image alt text. Set `sourceHash` to the SHA-256 value of `JSON.stringify({title, excerpt, body: content.trim()})` from the English Markdown frontmatter and body. Keep the English source file's metadata identifiers and links. Put interface and history-data translations in `content/translations/<language>/site.json`, keyed by the exact English string. Run `npm run check-translations` and `npm run build`; inspect the generated localized article, blog, and search assets. A language remains incomplete until these checks pass; do not describe it as fully released while it still shows English fallback.

Do not use a translation API or browser translation service for this project unless the user explicitly changes that preference. Codex should author and review the translations directly.
