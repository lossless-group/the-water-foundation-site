---
site_uuid: 8aa92e35-4c93-4884-aa81-8cd46495bdf5
hex_code: s60059
title: Issue of Empty Fellowship Program Page
date_created: 2026-08-23
date_authored_initial_draft: 2026-08-23
date_authored_current_draft: 2026-08-23
authors:
  - Michael Staton
at_semantic_version: 0.0.1.0
tags:
  - Issue
  - Build
  - Pages
lede: "`/our-fellowship-program` builds to a zero-byte HTML file — the route ships, but there is nothing in it."
summary: "Found incidentally while auditing the production build during the page-load flash investigation on 2026-08-23. `pnpm build` emits dist/our-fellowship-program/index.html at 0 bytes, so the route resolves but serves an empty document. The build reports no error and the page is counted among the 80 built pages, which is why this went unnoticed. Not investigated — parked as low priority."
publish: false
---

## What was observed

During a sweep of all 80 built pages (checking script placement in the production
build), one page came back at zero bytes:

```
dist/our-fellowship-program/index.html   0 bytes
```

Every other page in that sweep had real content. The build does not warn, error,
or otherwise flag it — `pnpm build` reports `80 page(s) built` and exits clean.

## Why it matters

The route resolves. A visitor to `/our-fellowship-program` gets a 200 and a blank
document — no header, no footer, no chrome. That is worse than a 404, because
nothing signals that anything is wrong, to a visitor or to a crawler.

Worth checking whether the route is in `sitemap-index.xml`, since an empty page
being advertised to search engines is the more damaging version of this.

## What was NOT done

No investigation at all. The source is `src/pages/our-fellowship-program/index.astro`;
a `grep` for its layout imports returned nothing, which may itself be the clue —
the page may have no layout import and no rendered output, or may be an abandoned
stub. Nobody has opened the file yet.

## Related

- The page-load flash work of 2026-08-23 (see `changelog/`) is where this surfaced;
  it is unrelated to the cause.
- See [[Issue-of-Slide-Decks-Bypassing-the-Mode-System]] — the other finding parked
  from the same audit.
