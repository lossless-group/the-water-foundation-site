---
site_uuid: a6dd96f6-996a-4f2b-b513-b4f08ad268e7
hex_code: 3dpmz1
title: Issue of Slide Decks Bypassing the Mode System
date_created: 2026-08-23
date_authored_initial_draft: 2026-08-23
date_authored_current_draft: 2026-08-23
authors:
  - Michael Staton
at_semantic_version: 0.0.1.0
tags:
  - Issue
  - Theme-System
  - Slides
lede: "The two slide-deck layouts declare their own `<html>` and never set `data-mode`, so the eight `/slides/*` pages ignore light/dark entirely."
summary: "Found while moving the anti-FOUC mode script into <head> on 2026-08-23. MarkdownSlideDeck.astro and OneSlideDeck.astro each open their own <html> element rather than going through BoilerPlateHTML.astro, so they never receive the mode script, never carry data-mode, and do not respond to the mode toggle. Pre-existing and unrelated to the flash fix. Parked as low priority — decks are visually self-contained and currently look intentional."
publish: false
---

## What was observed

`src/layouts/BoilerPlateHTML.astro` owns the site's `<html>` element and, as of
2026-08-23, the inline script in `<head>` that applies the stored light/dark mode
before first paint. Two other layouts declare their own `<html>` instead:

| Layout | Line | Opening tag |
|---|---|---|
| `src/layouts/MarkdownSlideDeck.astro` | 33 | `<html lang="en">` |
| `src/layouts/OneSlideDeck.astro` | 23 | `<html lang="en" data-theme="water">` |

Neither sets `data-mode`, and neither contains any `localStorage` mode read. A
sweep of the production build confirms the eight `/slides/*` pages are among the
seventeen that ship without the head mode script.

Note that `OneSlideDeck.astro` uses `data-theme="water"` where the rest of the
site uses a `theme-water` class plus `data-mode` — so the decks are off the theme
convention as well as the mode one.

## Why it matters

Toggling to light mode leaves the decks unchanged. Anyone reading a deck after
switching modes elsewhere on the site gets an inconsistent surface. Since decks
are the fundraise-facing artifact, that inconsistency is more visible to outside
readers than it would be on an internal page.

The decks *do* render `Header.astro`, so they picked up the logo fix from the same
2026-08-23 change. It is only the mode/theme wiring they miss.

## Why it is parked

The decks are visually self-contained and currently read as deliberately dark, so
nothing looks broken today. This is a consistency debt, not a defect.

## Likely fix

Route both deck layouts through `BoilerPlateHTML.astro` rather than opening their
own `<html>`, which would give them the head mode script for free. If a deck needs
to force a mode regardless of user preference, that should be an explicit prop on
the shared boilerplate rather than a separate `<html>`.

## Related

- See [[Issue-of-Empty-Fellowship-Program-Page]] — the other finding parked from
  the same build audit.
- The theme/mode contract is documented in the `theme-system` skill and in this
  site's `DESIGN.md`.
