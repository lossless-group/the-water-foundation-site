# Source of truth: human-editable prose for the llms.txt endpoints

These markdown files are read at build time by the endpoints in
`src/pages/llms.txt.ts` and `src/pages/llms-full.txt.ts`. The endpoints are
deliberately dumb — they do token substitution and append the dynamic
corpus content. **All voice, framing, and structural prose lives here, not
in TypeScript.**

If you want to tweak the wording on `/llms.txt` or `/llms-full.txt`, edit
the corresponding `.md` file in this directory and rebuild. No code changes.

## Files

- `llms.md` — template for `/llms.txt` (the link index).
- `llms-full.md` — template for `/llms-full.txt` (the concatenated full content).

## Scope decision: ship BOTH `/llms.txt` and `/llms-full.txt`

The Water Foundation site has three substantive markdown collections:

- `strategies` — long-form essays with full markdown bodies, citations, and headings; the canonical "blog" of the site.
- `slides` — primer slide decks rendered through `MarkdownSlideDeck`; short but content-bearing markdown bodies.
- `events` — calendar/engagement entries; mostly frontmatter (dates, locations, event framing), useful for an LLM building a model of the Foundation's public footprint.

Across the three collections there is enough markdown body content (especially in `strategies`) that the full-corpus variant is worth shipping. The link index alone would under-serve LLMs that prefer one fetch. Following the llms.txt habit's Variants guidance for "Astro Knots client sites with a substantive blog or case-study collection," this site ships both files. If `strategies` and `slides` shrink to single-digit page counts the next maintainer should re-evaluate; for now both stay.

## Tokens (substituted at build time)

| Token | Replaced with |
|---|---|
| `{{SITE_NAME}}` | `SITE_SEO.siteName` from `src/lib/seo.ts` (currently "The Water Foundation") |
| `{{STRATEGY_COUNT}}` | Number of published entries in the `strategies` collection |
| `{{SLIDE_COUNT}}` | Number of published entries in the `slides` collection |
| `{{EVENT_COUNT}}` | Number of published entries in the `events` collection |
| `{{LLMS_FULL_URL}}` | Absolute URL to `/llms-full.txt` |
| `{{LLMS_INDEX_URL}}` | Absolute URL to `/llms.txt` |
| `{{STRATEGIES_INDEX}}` | Generated link list of strategies, sorted by date desc, then title alpha (used in `llms.md`) |
| `{{SLIDES_INDEX}}` | Generated link list of slide decks, alphabetical (used in `llms.md`) |
| `{{EVENTS_INDEX}}` | Generated link list of events with dates and location, sorted by upcoming date desc (used in `llms.md`) |
| `{{CORPUS_BODIES}}` | Concatenation of strategies + slides + events raw bodies with metadata headers (used in `llms-full.md`) |

Tokens are simple `{{NAME}}` placeholders — no Mustache, no Handlebars, no
templating engine. If a token is missing in the markdown, the endpoint emits
the file with the placeholder unchanged so typos surface in the output. If
you add a new dynamic value, register it in the endpoint's substitution map
and document it here.

## URL patterns and the publish/private gate

The endpoints emit canonical URLs that match the rendered HTML page templates:

- Strategies: `/strategies/${id}` — from `src/pages/strategies/[slug].astro`
- Slides: `/slides/${slug}` — from `src/pages/slides/[...slug].astro`. Slug is
  the lowercased filename without `.md`, matching `markdownDecks.ts`.
- Events: hand-rolled per-event astro files under `src/pages/events/*.astro`.
  We can't derive a clean URL pattern from the collection alone, so the
  endpoint links to the events index `/events` and includes the event entry
  as metadata only (no per-event URL).

The page templates today **do not filter** entries — every entry in each
collection renders. The endpoints apply
`e.data.publish !== false && e.data.private !== true` as a defensive gate so
that if someone adds a draft frontmatter field later, drafts will be
excluded from the LLM-facing output before the page templates pick up the
gate. If `[slug].astro` adds a real publish predicate later, copy it into the
endpoints in the same commit.

## Static output (no Vercel adapter)

This site is `output: 'static'` (Astro default — no `@astrojs/vercel`
adapter is registered). Static endpoints emit `dist/llms.txt` and
`dist/llms-full.txt` once per build; nothing runs at request time. If a
future migration to `output: 'server'` lands, add `export const prerender =
true` to both endpoint files (see `mpstaton-site` for the exact pattern).

## Why a separate `src/llms/` directory and not `src/lib/` or `src/content/`?

`src/lib/` is for code (TypeScript). `src/content/` is for Astro content
collections, which expect specific schemas and Astro-managed loaders. These
files are neither — they're prose templates that the build step reads as raw
strings via Vite's `?raw` import. Giving them their own directory keeps the
purpose obvious and makes the source-of-truth boundary easy to find.
