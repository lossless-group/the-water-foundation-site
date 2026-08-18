---
version: alpha
name: The Water Foundation — Water Theme
description: >-
  Design system for The Water Foundation's site (`astro-knots/sites/twf_site`)
  and, by copy, for the `the-water-foundation` DidiDecks client-site. The brand
  spine is the **trademark gradient** (deep lake blue → cyan-teal → aquamarine,
  `#147EB6 → #33A3BC → #5FD7C5`), a **midnight-water ground** (`#042632`) that
  the site is born on, and a **rounded humanist type stack** (ITC Avant Garde
  Gothic / Avenir for brand marks, Nunito for reading, Quicksand for soft
  secondary voice). The register is calm, fluid, institutional-but-warm —
  a foundation that moves money into water resilience, not a tech startup.
  Tokens mirror the CSS custom properties in `src/styles/global.css`; that file
  is the runtime source of truth and this document is the contract.

# ─── Colors ────────────────────────────────────────────────────────────
colors:
  # Tier 1 — brand marks. These are the values baked into the trademark,
  # wordmark, appicon and favicon SVGs. They are NOT CSS variables; they
  # are the fixed brand facts every other token orbits.
  brand-lake-blue: "#147EB6"        # trademark gradient stop 1
  brand-cyan-teal: "#33A3BC"        # trademark gradient stop 2 — the mid-brand
  brand-aquamarine: "#5FD7C5"       # trademark gradient stop 3
  brand-abyss: "#12607A"            # appicon deepest stop
  brand-shallow: "#82FFED"          # appicon brightest stop — peak highlight

  # Tier 1 — the water scales (`.theme-water` in global.css).
  # primary = water blues (cyan family)
  primary-50: "#ecfeff"
  primary-100: "#cffafe"
  primary-200: "#a5f3fc"
  primary-300: "#67e8f9"
  primary-400: "#22d3ee"
  primary-500: "#06b6d4"
  primary-600: "#0891b2"            # the workhorse — headers, rules, borders
  primary-700: "#0e7490"
  primary-800: "#155e75"
  primary-900: "#164e63"
  primary-950: "#083344"

  # secondary = sky / cerulean family
  secondary-50: "#f0f9ff"
  secondary-100: "#e0f2fe"
  secondary-200: "#bae6fd"
  secondary-300: "#7dd3fc"
  secondary-400: "#38bdf8"
  secondary-500: "#0ea5e9"
  secondary-600: "#0284c7"
  secondary-700: "#0369a1"
  secondary-800: "#075985"
  secondary-900: "#0c4a6e"
  secondary-950: "#082f49"

  # accent = teal / aquamarine family — the "living water" register
  accent-50: "#f0fdfa"
  accent-100: "#ccfbf1"
  accent-200: "#99f6e4"
  accent-300: "#5eead4"
  accent-400: "#2dd4bf"
  accent-500: "#14b8a6"
  accent-600: "#0d9488"
  accent-700: "#0f766e"
  accent-800: "#115e59"
  accent-900: "#134e4a"
  accent-950: "#042f2e"

  # Tier 2 — semantic. What components actually read. Values below are the
  # DARK bindings (`.theme-water[data-mode="dark"]`), which is the default.
  background: "#042632"             # midnight water — the ground the brand lives on
  foreground: "#fbfffe"             # near-white with the faintest green cast
  card: "{colors.secondary-900}"
  card-foreground: "#E7FFFB"
  neutral-background: "#6a8d9a"     # slate-water; the one desaturated surface
  muted: "{colors.secondary-900}"
  muted-foreground: "#DEEAE8"
  primary: "{colors.secondary-500}"
  primary-foreground: "{colors.secondary-950}"
  secondary: "{colors.secondary-800}"
  secondary-foreground: "#E7FFFB"
  accent: "{colors.accent-500}"
  accent-brighter: "#5BCEFF"        # hover / active lift on accent surfaces
  accent-foreground: "{colors.secondary-950}"
  border: "{colors.secondary-700}"
  input: "{colors.secondary-700}"

# ─── Gradients ─────────────────────────────────────────────────────────
gradients:
  trademark: "linear-gradient(135deg, #147EB6 0%, #33A3BC 50%, #5FD7C5 100%)"
  appicon: "linear-gradient(135deg, #12607A 0%, #2A91AA 33%, #33A3BC 66%, #82FFED 100%)"
  water-header: "linear-gradient(135deg, #0891b2 0%, {colors.foreground} 100%)"
  water-rule: >-
    linear-gradient(90deg, #0891b2 0%, rgba(8,145,178,0.6) 50%, transparent 100%)

# ─── Modes ─────────────────────────────────────────────────────────────
modes:
  default: dark
  available: [light, dark]
  vibrant: "not implemented — see Do's and Don'ts before adding one"
  mechanism: >-
    `<html class="theme-water" data-mode="dark">`. The class picks the THEME
    (`theme-water` | `theme-default`); the `data-mode` attribute picks the
    MODE (absent = light, `dark` = dark). An inline script in
    `src/layouts/BoilerPlateHTML.astro` applies the mode before paint to
    avoid FOUC and reads `localStorage.mode`, falling back to `dark`.

# ─── Typography ────────────────────────────────────────────────────────
typography:
  fonts:
    brand: "Avenir, ITC Avant Garde Gothic, Montserrat, Inter, system-ui, sans-serif"
    display: "ITC Avant Garde Gothic, Montserrat, Inter, system-ui, sans-serif"
    primary: "Nunito, Quicksand, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    secondary: "Quicksand, -apple-system, sans-serif"
    mono: "Fira Code, Courier New, monospace"
  weights:
    hairline: 100                   # water-header-team only
    light: 300
    normal: 400
    medium: 500
    bold: 700
  line-height:
    relaxed: 1.7                    # the body default in `.theme-water`
  letter-spacing:
    wide: "0.03em"                  # applied to the whole water theme
    team-header: "0.15em"
  scale:
    display: "3.5rem"               # water-header-team desktop
    display-mobile: "2.5rem"
    h1: "2.25rem"
    body: "1rem"

# ─── Rounded ───────────────────────────────────────────────────────────
rounded:
  sm: "0.5rem"                      # `.theme-water` override — note: applied to * 
  md: "0.75rem"
  lg: "1rem"
  full: "9999px"

# ─── Spacing ───────────────────────────────────────────────────────────
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  container: "max-w-4xl mx-auto"    # default prose container in BaseThemeLayout
  container-wide: "max-w-7xl mx-auto"

# ─── Breakpoints ───────────────────────────────────────────────────────
breakpoints:
  mobile-sm: "360px"
  mobile-base: "480px"
  mobile-xl: "640px"
  tablet: "768px"
  laptop: "1024px"
  monitor: "1536px"

# ─── Motion ────────────────────────────────────────────────────────────
motion:
  smooth: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  theme-swap: "75ms ease"
  gentle-flow: "3s ease-in-out infinite"   # water-header underline
  team-water-flow: "5s ease-in-out infinite"

# ─── Components ────────────────────────────────────────────────────────
components:
  water-header:
    background: "{gradients.water-header}"
    backgroundClip: text
    fontWeight: 300
    borderLeft: "4px solid {colors.primary-600}"
    paddingLeft: "1rem"
    afterRule: "{gradients.water-rule}"
    animation: "{motion.gentle-flow}"
  water-header-team:
    fontSize: "{typography.scale.display}"
    fontWeight: 100
    textTransform: uppercase
    letterSpacing: "{typography.letter-spacing.team-header}"
    borderLeft: "6px solid {colors.primary-600}"
    background: "{gradients.water-header}"
    backgroundClip: text
    animation: "{motion.team-water-flow}"
  card:
    background: "{colors.card}"
    color: "{colors.card-foreground}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
  mode-toggle:
    icons: "public/icons/sun.svg, public/icons/moon.svg"
    border: "1px solid {colors.border}"
    transition: "all 0.2s ease"

# ─── Imagery ───────────────────────────────────────────────────────────
imagery:
  trademark: public/trademark__The-Water-Foundation.svg
  trademark-inverted: public/trademark__The-Water-Foundation--Inverted.svg
  wordmark: public/wordmark__The-Water-Foundation.svg
  wordmark-parts: [public/wordmarkPart__The.svg, public/wordmarkPart__Water.svg, public/wordmarkPart__Foundation.svg]
  appicon: public/appIcon__The-Water-Foundation.svg
  favicon: public/favicon__The-Water-Foundation.svg
  primary-motif: public/imageOf__Whale--Mom-Calf-under-Wave.jpg
  hero: public/heroes/imageOf__Whale-pair-under-wave.jpeg
  partner-marks: public/trademarks/
  event-banners: public/share-banners/
  og:
    landscape: public/ogImageLandscape__The-Water-Foundation.jpg
    portrait: public/ogImagePortrait__The-Water-Foundation.jpg
    aspect: "1200x630 (landscape), 1080x1350 (portrait)"
    background: "{colors.background}"
    overlay-gradient: "{gradients.trademark}"
    typeface-h1: "ITC Avant Garde Gothic Demi"
    typeface-eyebrow: "Nunito 300"
    voice: >-
      Water photographed, not illustrated. The whale mother-and-calf is the
      emotional anchor; the trademark gradient is the brand signature; the
      copy stays short and institutional. No stock-photo optimism, no
      infographic clutter in the share frame.
---

# The Water Foundation — DESIGN.md

> **Runtime source of truth:** `src/styles/global.css` — specifically the
> `.theme-water` block and its `.theme-water[data-mode="dark"]` override.
> `src/styles/water-theme.css` is a *secondary* file, imported only by
> `src/layouts/OneSlideDeck.astro`. `src/styles/default-theme.css` is currently
> imported by nothing. This document is the human- and agent-readable contract
> that explains intent. Keep the two in sync when either changes.

## Overview

The Water Foundation is a Munich/Dubai/Delhi/Vaduz foundation working on water
resilience through blended, unsiloed finance. The design register that follows
from that: **institutional trust with a living-water warmth**. It is not a
climate-doom brand and it is not a startup brand. It reads like an organization
that convenes ministers and fund managers and still wants you to feel the water.

Three things carry the identity:

1. **The trademark gradient** — `#147EB6 → #33A3BC → #5FD7C5`. Deep lake blue
   through cyan-teal to aquamarine. It lives in the trademark, wordmark, appicon
   and favicon SVGs as a baked gradient, and it is the one visual you should
   reach for when a surface needs to *say Water Foundation* without a logo.
2. **The midnight-water ground** — `#042632`. The site is **born dark**. Not a
   neutral slate dark, not a purple dark: a deep blue-green that reads as water
   at depth. Light mode exists and is supported, but dark is the default and the
   brand's home.
3. **The rounded humanist type stack** — ITC Avant Garde Gothic (self-hosted,
   geometric, the brand's mark voice) over Nunito and Quicksand (soft, rounded,
   readable). Combined with the `0.03em` letter-spacing and `1.7` line-height
   applied theme-wide, the effect is *unhurried*. Nothing on this site should
   feel like it is shouting for a click.

The DidiDecks client-site copy of this document governs decks built for the
Foundation. Decks inherit the same tokens; where a deck needs something the
website doesn't have (slide-scale type, 16:9 Play-UI constraints), it extends
here rather than inventing a parallel system.

## Colors

The palette is three cyan-adjacent scales, deliberately close in hue. That
closeness is the point — the brand is **monochromatic-in-blue-green with
temperature shifts**, not a multi-hue system.

| Scale | Family | Job |
|---|---|---|
| `primary-*` | Cyan / water blue | Structure. Headers, left-borders, rules, the `water-header` gradient. `primary-600` (`#0891b2`) is the single most-used brand color in the CSS. |
| `secondary-*` | Sky / cerulean | Surfaces and chrome. Cards (`secondary-900`), borders (`secondary-700`), the interactive primary (`secondary-500`). |
| `accent-*` | Teal / aquamarine | Life. The accent that signals "this is living, this is the thing that moves" — CTAs, active states, data highlights. `accent-500` (`#14b8a6`) is the accent proper; `accent-brighter` (`#5BCEFF`) is its hover lift. |

**Semantic tier is what components read.** Never reach past `--color-background`,
`--color-foreground`, `--color-card`, `--color-accent`, `--color-border` etc.
into a raw scale step inside a component. The scale steps exist so the semantic
tier can be rebound per mode; hard-coding `primary-600` in a component defeats
mode-switching.

**The one desaturated token.** `--color-neutral-background: #6a8d9a` (slate
water) is the only surface in the system that isn't saturated. Use it when a
region needs to recede *without* going darker — e.g. a photo caption bar over
imagery. It is easy to overuse; two per page is plenty.

### Light vs. dark

Light mode inherits the `.theme-water` scales as written (50 = lightest). Dark
mode does **not** simply darken — `.theme-water[data-mode="dark"]` inverts the
scales so `primary-50` becomes the darkest step. This means a component written
against scale steps will look correct in one mode and wrong in the other, which
is the strongest practical argument for the semantic-tier rule above.

## Typography

| Role | Family | Use |
|---|---|---|
| Brand | Avenir → ITC Avant Garde Gothic | The wordmark voice. Section eyebrows, the logotype lockup, anything adjacent to the mark. `.font-brand` / `.font-avenir`. |
| Display | ITC Avant Garde Gothic | Large headers where the geometric character should read. Self-hosted from `public/fonts/itc-avant-garde-gothic/` across Book/Medium/Demi/Bold + obliques. |
| Primary (body) | Nunito | All reading text. Rounded terminals, generous x-height — warm without being childish. |
| Secondary | Quicksand | Softer secondary voice — pull quotes, captions, the occasional oversized number. Lighter and more geometric than Nunito. |
| Mono | Fira Code | Data, figures, technical callouts. Rare on this site. |

Theme-wide, `.theme-water` sets `line-height: 1.7` and `letter-spacing: 0.03em`
on everything. Both are deliberately loose. Do not tighten them locally to fit
more copy — cut the copy instead.

ITC Avant Garde Gothic is licensed and **self-hosted**; it is not on Google
Fonts. The Adobe Fonts kit line in `BoilerPlateHTML.astro` is commented out and
unused. Nunito, Quicksand, Inter and Fira Code load from Google Fonts.

## Layout & Spacing

- **Container model:** fixed-max, centered. `max-w-4xl mx-auto` is the default
  prose container in `BaseThemeLayout`; `max-w-7xl mx-auto` for grid-heavy
  pages (brand kit, team, partner walls).
- **Spacing scale:** a 7-step `--spacing-*` ladder from `0.25rem` to `4rem`,
  plus Tailwind v4's own scale. Section rhythm on long pages is `3rem`–`5rem`.
- **Breakpoints:** six named steps (`mobile-sm` 360 → `monitor` 1536), with
  matching `.mobile-only` / `.tablet-only` / `.laptop-only` / `.monitor-only`
  visibility utilities in `global.css`. Prefer container queries
  (`src/styles/responsive/container-queries.css`) for component-internal
  responsiveness; use the breakpoints for page-level composition.
- **Vertical rhythm:** headings own their space via `margin` on the
  `water-header` family (`5rem 0 4rem` for team headers). Don't add wrapper
  padding on top of that; you'll double the gap.

## Elevation & Depth

The system is **near-flat**. Depth comes from three things, in order of
preference:

1. **Surface value** — `card` (`#0c4a6e`) sits above `background` (`#042632`)
   by being lighter, not by casting a shadow.
2. **Border** — a 1px `--color-border` (`#0369a1`) hairline is how an edge is
   declared. This is the dominant separator in the system.
3. **Shadow** — the `--shadow-*` ladder exists in `default-theme.css` but the
   water theme barely uses it. On a `#042632` ground, drop shadows read as
   mud. If you need lift, lighten the surface.

There is no glow layer. Motion (the animated `water-header` underline) does the
work that glow does in the Lossless house style.

## Shapes

Rounding is **generous** — `sm: 0.5rem`, `md: 0.75rem`, `lg: 1rem`. These are
roughly double the platform defaults and are what makes the theme read as
*water* rather than *dashboard*.

⚠️ `BaseThemeLayout` contains `.theme-water * { border-radius: var(--border-radius-sm); }`
— a universal selector that applies `0.5rem` rounding to **every element** in
the theme. That is aggressive and occasionally wrong (it rounds table cells and
inline elements). Any component that needs square corners must override
explicitly. See Do's and Don'ts.

## Components

### `water-header` — the standard section header

Gradient-clipped text (`#0891b2` → `foreground`), weight 300, with a 4px
`primary-600` left border and an animated underline rule that breathes on a
3-second loop. **Opt-in only** (`@layer components` in `global.css`) — apply the
class deliberately; it is not the default `h2` treatment.

### `water-header-team` — the oversized page header

The dramatic variant: `3.5rem` (`2.5rem` on mobile), weight **100**, uppercase,
`0.15em` tracking, 6px left border, a faint gradient wash behind, and a 12rem
animated underline on a 5-second loop. One per page. It is the loudest thing in
the system and it earns that by being used almost never.

### `card`

`secondary-900` surface, `#E7FFFB` text, 1px `border` hairline, `md` rounding.
No shadow. The workhorse container for people, strategies, facts, and events.

### `ModeToggle`

Sun/moon SVG pair from `public/icons/`. Writes `localStorage.mode` and toggles
`data-mode` + the `.dark` class on `<html>`. The pre-paint inline script in
`BoilerPlateHTML.astro` must stay in sync with whatever this writes.

### Theme switcher (legacy)

`src/utils/theme-switcher.js` sets a `data-theme` attribute (`water` |
`default`). **Nothing in `global.css` currently keys off `data-theme`** — the
theme is selected by the `theme-water` / `theme-default` *class* on `<html>`.
The attribute-selector rules in `water-theme.css` and `default-theme.css` are
therefore inert for site pages. Treat this as known drift, not as a pattern to
copy. See Do's and Don'ts.

## Imagery

Photography over illustration, always. The Foundation's imagery is real water
and real rooms — the whale mother-and-calf under a wave is the emotional
anchor of the brand, and event banners are documentary photographs from COP30,
UNGA, The Drop, Norrsken, OceanX, BMW Foundation.

- **Brand marks** ship in five weights of contrast — base, `--Lighter`,
  `--Darker`, `--Darker--Wide`, `--Inverted`. Pick by ground, not by habit: on
  `#042632`, use the base or `--Inverted` mark; never the `--Darker` variants.
- **Wordmark parts** (`The` / `Water` / `Foundation`) exist as separate SVGs for
  animated or stacked lockups. They are not for re-typesetting the name — the
  wordmark's letterforms are the mark.
- **Partner trademarks** live in `public/trademarks/` and are third-party marks.
  Never recolor them, never apply the brand gradient to them, and prefer the
  contrast variant that reads on the current ground.
- **OG images** are pre-rendered at `public/ogImageLandscape__*.jpg` and
  `public/ogImagePortrait__*.jpg`. Per the `open-graph-share-seo-geo` skill,
  keep them JPEG and absolute-URL'd.

## Do's and Don'ts

**Do**

- Read the semantic tier (`--color-background`, `--color-card`, `--color-accent`,
  `--color-border`) in components. It's the only thing that survives a mode swap.
- Assume dark. Design on `#042632` first, then check light.
- Reach for surface-value or a hairline border before reaching for a shadow.
- Keep the trademark gradient for moments that mean something — a hero, a
  divider, one signature surface per page. It's the brand's strongest verb.
- Let the loose tracking and 1.7 line-height stand. Cut copy, don't tighten type.
- Use the photographs. This brand is more credible with real water in it.

**Don't**

- **Don't hard-code a scale step** (`primary-600`, `accent-500`) inside a
  component. Dark mode inverts the scales; a component pinned to a step will
  look correct in exactly one mode.
- **Don't add rules keyed to `[data-theme="water"]`.** Site pages select the
  theme with the `theme-water` *class*; the attribute selectors in
  `water-theme.css` / `default-theme.css` don't match and your rule will
  silently do nothing. If you're touching this, fix the drift rather than
  adding to it.
- **Don't edit `default-theme.css` expecting it to ship.** Nothing imports it.
- **Don't rely on `.theme-water * { border-radius }`** to do the right thing.
  It rounds everything, including things that shouldn't be rounded. Override
  explicitly where square corners matter.
- **Don't introduce a third hue.** The palette's discipline is that everything
  is blue-green. A warm accent would read as a different organization. If a
  chart genuinely needs categorical separation, vary lightness and saturation
  within the three scales before adding a hue.
- **Don't add a "vibrant" mode by inheriting the light ground.** If a vibrant
  mode is ever added, it must be **dark-based** per the `theme-system` skill —
  this is the canonical error across Lossless sites.
- **Don't drop-shadow on the dark ground.** It reads as mud.
- **Don't recolor partner trademarks** to fit the palette.

## Source-of-truth discipline

- **Runtime:** `src/styles/global.css` ships. The `.theme-water` block and its
  `[data-mode="dark"]` override are what actually render.
- **Contract:** this `DESIGN.md`. When the runtime CSS changes in a way that
  changes the contract (new token, renamed token, refreshed palette, new
  component pattern, new mode), update this file in the same commit, per the
  [`maintain-design-md`](https://github.com/lossless-group/lossless-monorepo)
  skill.
- **Copies:** a copy of this file lives at
  `ai-labs/dididecks-ai/client-sites/the-water-foundation/DESIGN.md` and governs
  DidiDecks work for the Foundation. When this file changes materially, refresh
  that copy; when the deck side learns something the website should adopt, bring
  it back here.

## Known drift (as of 2026-08-14)

Recorded rather than fixed, so the next agent doesn't rediscover it:

1. `water-theme.css` and `default-theme.css` define `[data-theme="…"]` blocks
   that never match on site pages (the theme is a class, not an attribute).
   `water-theme.css` is imported only by `OneSlideDeck.astro`.
2. `default-theme.css` is imported by nothing at all.
3. `water-theme.css` declares `--color-primary-*` as space-separated RGB triples
   while `global.css` declares the same names as hex. Two incompatible formats
   under one token name.
4. `BoilerPlateHTML.astro` defaults `ogImage` to
   `/og_image--The-Water-Foundation_vnt1.jpg`, which is not the filename present
   in `public/` (`ogImageLandscape__The-Water-Foundation.jpg`). Pages that don't
   pass `ogImage` explicitly will 404 their share image.

## What's not here yet

- A slide-scale type ramp for Play-UI (16:9, 1920×1080) deck slides.
- Chart / data-viz color assignments — the three-scale palette needs an explicit
  categorical ordering before the first data-heavy deck slide.
- A documented `vibrant` mode (see Don'ts).
- Component tokens for the infographic, dataroom, and events component families.
