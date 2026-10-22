Blog posts live here as Markdown files. They are separate from historical stories
in content/articles and appear only on /blogs and /blogs/:slug.

Each .md file needs frontmatter with title and publishedAt. Optional fields are
slug, excerpt, updatedAt, author, tags, and books. Example:

---
title: Notes on Reading Historical Sources
publishedAt: 2026-09-25
excerpt: A short introduction to the post.
author: India History
tags: [research]
books: ["0349122385", "935699322X", "0143330802"]
---

Write the blog post body in Markdown below the frontmatter. Run npm run build
to update the site and dist/ after adding a post.

Use quoted ISBN-10 values from the recommended book catalogue in books. Each
page load randomly selects up to three associated books: one in the sidebar
and up to two below the blog. Both placements share the same selection, with
no duplicates. Books without affiliate links are shown only in dev mode.
Translations inherit book associations from the English source.
