---
site_uuid: f0f131ad-7271-484c-a804-e956d0d2b5ce
hex_code: yhjk17
title: Adopt twf-next's Type and Spacing, and a Three-Mode Theme
date_created: 2026-10-14
date_authored_initial_draft: 2026-10-14
date_authored_current_draft: 2026-10-14
authors:
  - Michael Staton
at_semantic_version: 0.0.1.0
status: Draft
tags:
  - Spec
  - Theme-System
  - Design-System
  - Typography
  - Vibrant-Mode
lede: "twf-next's typography and spacing take over twf_site; twf-next's dark palette becomes twf_site's dark mode; a new vibrant mode lays our gradients, glows and glass over that dark blue. Light mode is still an open design decision."
summary: "Plan for restyling the live site, the-water-foundation.com, with the design system of its replacement build, twf-next, without porting twf-next itself. Step 0 repairs the existing mode and token wiring. Several parts of it do not work today: semantic tokens generate no utilities, dark: follows the OS rather than the toggle, and the brand typography never reaches <html>. The later steps add the new tokens, switch the type over, and convert the components from hard-coded Tailwind palette classes. Grounded in a read-only audit of both repos on 2026-10-14."
publish: false
---

# Adopt twf-next's Type and Spacing, and a Three-Mode Theme

## Intent

As stated by the owner, 2026-10-14:

1. **Typography and spacing:** twf-next's design font and spacing "take over" twf_site, in every mode.
2. **Dark:** twf-next's dark colours become twf_site's dark mode.
3. **Vibrant:** a new mode combining twf-next's dark blue with twf_site's gradients, glows and glassmorphic surfaces.
4. **Light:** "we need to figure out." This spec keeps it as an open decision, with options (see [Light mode](#light-mode-open-decision)).

**Out of scope:**
- Porting twf-next's pages, components, three.js water field or content.
- Changing twf-next. It is read-only here, and nothing in this spec requires touching it.

Sources for every value below:
- `astro-knots/sites/twf-next/src/styles/{tokens,type,surface,layout,button}.css`.
- twf-next's `docs/design/direction.md` is **stale on fonts** (it still names Space Grotesk and Inter) and on the type shadow. **Trust the CSS.**

---

## What the audit found in twf_site today

The token layer is small and easy to replace. The real weight is in the components. Several parts of the current wiring do not work as DESIGN.md says they do, and step 0 has to fix them first.

| # | Finding | Where | Consequence |
|---|---|---|---|
| 1 | Semantic tokens (`--color-background`, `-foreground`, `-card`, `-border`, `-muted-foreground`, `-accent`) are not declared in `@theme` | `src/styles/global.css:117-153` | About 870 uses of `bg-background`, `text-foreground`, `bg-card`, `border-border` and `text-muted-foreground` generate **no CSS**. For example, the sticky header's `bg-background/80` is transparent. |
| 2 | No `@custom-variant dark` | `global.css` | The 130 `dark:` utilities follow `prefers-color-scheme`, not the toggle. |
| 3 | Brand font, 1.7 leading, 0.03em tracking and universal rounding sit in a **scoped** `<style>` | `src/layouts/BaseThemeLayout.astro:50-64` | That style compiles to `.theme-water[data-astro-cid-…]`, which never matches `<html>`. The site renders in Tailwind's default `ui-sans-serif`, not Nunito. |
| 4 | Light mode has no semantic tokens | `global.css:219-270` | In light mode, `body { background: var(--color-background) }` is invalid. The page shows white, with hard-coded dark section gradients on top. |
| 5 | Light mode is the *absence* of `data-mode`, not `data-mode="light"` | `BoilerPlateHTML.astro:33-62`, `src/utils/mode-switcher.js` | A third mode has nowhere to go until this changes. The switcher rejects anything except `light` and `dark` (`mode-switcher.js:92`). |
| 6 | About 4,650 raw Tailwind palette classes in 132 files; 126 hex literals; 671 `rgb()`/`rgba()` | top offenders listed in [Step 4](#step-4-component-migration) | The "look" is in the components, so mode changes cannot reach it yet. |
| 7 | No type scale or spacing tokens; 909 uses of `text-*xl` | throughout | There is nothing for "take over" to replace, so it means adding a system, not editing one. |
| 8 | No vibrant mode | DESIGN.md:98, :482 | New work. |
| 9 | Dead or duplicate theme files | `water-theme.css` and `default-theme.css`; `tailwind-v4.css`; `tailwind.plugin.js` (never loaded); `theme-switcher.js` (brand-kit only); a second toggle in `SlidesControlButtons.astro` | Delete or fold in during step 0 so there is one mode system. |

These are already logged and are not reopened here, though step 0 should fold in the first:
- `context-v/issues/Issue-of-Slide-Decks-Bypassing-the-Mode-System.md`
- `changelog/2026-08-23_01.md` (moving the pre-paint script into `<head>`)

---

## Target architecture

### Mode contract

Per the `theme-system` skill (three modes, vibrant is dark-based):

- `<html data-mode="light|dark|vibrant">`. The attribute is **always set**, including for light.
- The pre-paint script in `BoilerPlateHTML.astro` stays in `<head>` and reads `localStorage['mode']`. It accepts the three values and falls back to the default (see the open questions).
- **One switcher.** `mode-switcher.js` becomes three-state and still dispatches `mode-change`. `ModeToggle.astro` becomes a labelled radiogroup with three options; `splash/`'s `ModeToggle.astro` is the reference. The slides toggle and `theme-switcher.js` are retired.
- **Tailwind v4 variants** in `global.css`:
  ```css
  @custom-variant dark    (&:where([data-mode="dark"], [data-mode="dark"] *));
  @custom-variant vibrant (&:where([data-mode="vibrant"], [data-mode="vibrant"] *));
  @custom-variant light   (&:where([data-mode="light"], [data-mode="light"] *));
  ```
  Decide in step 0 whether `dark:` should also match vibrant, since vibrant is dark-based. Recommendation: yes. Use `(&:where([data-mode="dark"], [data-mode="vibrant"], …))` for `dark:`, and treat `vibrant:` as additive on top.
- **Remove the OS-driven media queries:** `Header.astro:448`, `Header-Alt.astro:383` and `default-theme.css:374`.
- `color-scheme`: `light` on light; `dark` on dark and vibrant.

### Token tiers

Two tiers, per the `theme-system` skill:

- **Tier 1 (named):** `--color__deep`, `--color__pane`, `--color__ink`, `--color__cyan-400`, `--font__aspekta`, `--space__s` and so on. These are raw values and private to `theme.css`.
- **Tier 2 (semantic):** `--color-background`, `--color-surface`, `--color-ink`, `--font-display`, `--space-m`, and so on. These are re-pointed per mode, and the semantic colours are registered with `@theme inline` so Tailwind generates `bg-background`, `text-foreground`, `border-border`. That fixes finding 1 for every existing use at once.
- **One home.** Split `global.css` into:
  - `src/styles/theme.css`, holding the tokens and mode blocks.
  - `global.css`, which imports Tailwind and `theme.css` and holds the base resets.

### Typography (all modes)

**Faces.** Self-host twf-next's files. Copy them from `twf-next/public/fonts/` with each `LICENSE.txt`; all are SIL OFL 1.1.

| Role | Face | File | Weight axis |
|---|---|---|---|
| Display | **Aspekta** v2.100 (variable; no kerning, so its fit comes from tracking) | `fonts/aspekta/aspekta-wght-normal.woff2` | 100–900 |
| Body | **DM Sans** (variable, optical size) | `fonts/dm-sans/dm-sans-latin-opsz-wght.woff2` | 100–1000 |
| Note (optional) | Newsreader italic, 13 KB subset | `fonts/newsreader/newsreader-italic-subset.woff2` | 360 |

- Preload Aspekta and DM Sans in `<head>` (twf-next does this at `Layout.astro:123-124`).
- `font-display: swap` throughout.
- Remove the Google Fonts request for Inter, Nunito, Quicksand and Fira Code (`BoilerPlateHTML.astro:78-80`) once nothing references them.
- **ITC Avant Garde Gothic** is already self-hosted here. Whether it keeps a role is an open question (see [Open questions](#open-questions)).

**Scale.** Adopt twf-next's fluid steps verbatim (`type.css:298-343`): `--step--3` to `--step-7`, plus `--size-opening`, `--leading-{tight,snug,normal}` and `--track-{tight,snug,normal,wide}`. Also adopt the tune knobs from `tokens.css:342-353`: `--weight-display: 800`, `--track-display: -0.005em`, `--track-body: -0.015em`, and the rest.

**Roles.** Port the `.t-*` role classes from `type.css:370-601`: `t-statement`, `t-display`, `t-figure`, `t-h2`, `t-h3`, `t-quote`, `t-standfirst`, `t-lede`, `t-name`, `t-body`, `t-label`, `t-small`, `t-micro`, `t-cite`, `t-note`.
- Each role sets size, weight, line-height, tracking, colour and measure together. A role never sets margin.
- In `@layer base`, map the bare elements onto roles: `h1` to `t-display`, `h2` to `t-h2`, `h3` to `t-h3`, `p` to `t-body`. That way unconverted pages pick up the new type straight away.

**This supersedes DESIGN.md's rule "keep the 0.03em tracking and 1.7 line-height".**
- That rule never applied at runtime (finding 3).
- twf-next's rule replaces it: tracking tightens as size grows, and hierarchy comes from weight, size and leading together.
- DESIGN.md is updated in the same commit, under its own process rule (DESIGN.md:446-454).

### Spacing and layout (all modes)

- **Scale.** Adopt `--space-3xs` to `--space-3xl` verbatim (`tokens.css:631-639`). `--space-s` is 16px at 360px and 24px at 1440px, and nothing sits between steps.
- **Rhythm.** Adopt `--rhythm-band: var(--space-xl)` and `--rhythm-section: var(--space-3xl)`. The section gap is twice the band gap: "bands cling, sections separate". Also `--gutter: var(--space-s)` and the `--pad-*` tokens.
- **Container.** Add `.wrap { width: min(100% - var(--gutter) * 2, 74rem); margin-inline: auto; }`.
  - Today there are four widths: `max-w-3xl/4xl/6xl/7xl`, used 52/77/66/58 times.
  - Converge on `.wrap` plus a prose measure set by the type roles.
  - Either make `BaseThemeLayout`'s unused `containerClass` prop real or delete it.
- **Tailwind mapping.** Register the steps with `@theme inline` (`--spacing-3xs` … `--spacing-3xl`), so `gap-m`, `py-xl` and `px-s` exist.
  - **Do not** copy twf-next's `@theme { --*: initial }`. It removes Tailwind's default spacing and colour utilities, which would break all 132 files until they are migrated.
  - Phase the defaults out during step 4 instead.
- **Breakpoints.** twf-next uses only 48rem and 64rem. twf_site has six; most are unused, and `responsive/*.css` and `tailwind.plugin.js` are never loaded. Converge on 48rem and 64rem for new work, and leave Tailwind's `sm` and `xl` working until the migration is done.
- **Radius.** Adopt twf-next's roundness dials (`tokens.css:790-837`): cards square, buttons `0.16`. Vibrant may raise the card roundness (see below).

### Dark mode (twf-next's palette)

twf-next has **one mode, and it is dark**. These values come straight from `tokens.css:135-592`.

| Semantic token (twf_site) | Value | twf-next source |
|---|---|---|
| `--color-background` (ground, on `html`) | `#041A26` (`--deep: 4 26 38`) | `--deep` |
| `--color-surface` / `--color-card` | `rgb(8 34 51 / 0.56)`, glass over the ground | `--surface-fill` (`--pane-rgb: 8 34 51`, solidity 0.35) |
| `--color-surface-dense` | `rgb(8 34 51 / 0.69)` | `--surface-fill-dense` |
| `--color-surface-solid` | `rgb(8 34 51 / 0.82)` | `--surface-fill-solid` |
| `--color-foreground` / `--color-ink` | `#ffffff` | `--ink` |
| `--color-muted-foreground` / `--color-ink-dim` | `#ffffffdb` | `--ink-dim` |
| `--color-accent` (interaction and data only) | `#22D3EE` | `--accent` |
| `--color-accent-foreground` | `#062634` | `--on-accent` |
| `--color-border` | `rgb(255 255 255 / 0.14)` | `--surface-edge`, `--edge-rule` |
| `--color-border-accent` | `rgb(34 211 238 / 0.4)` | `--edge-accent` |
| `--color-signal` (shortfall only) | `#ffa28d` | `--signal` |
| `--color-water` | `rgb(68 134 154)` | `--water-rgb` |

**Effects in dark:**
- Type shadow `0 0 12px rgb(4 26 38 / 0.2)`, applied once by inheritance on `main` and removed on surfaces.
- Card shadow `0 6px 18px -8px rgb(4 26 38 / 0.48)`.
- Glass: `backdrop-filter: blur(10px) saturate(1.35)` plus the grain layer from `surface.css:19-68`.
- Focus ring: `2px solid ink` with a `6px` halo.
- **No glows, no orbs, no decorative gradients.** That is twf-next's restraint, and it is what makes dark distinct from vibrant.

**Brand-anchor change.** DESIGN.md calls the site "born dark" on `#042632` (lines 245-248). `#041A26` is a deeper, slightly less green navy from the same family. It still reads as "not slate, not purple", but DESIGN.md's anchor sentence must be rewritten, not just its hex value. The header's hard-coded `#042632` (`Header.astro:401`) becomes `var(--color-background)`.

### Vibrant mode (new; dark-based)

**Principle:** start from the same `#041A26` ground and `#082233` panes as dark, then switch on the layer twf-next forbids: our gradients, glows and glass.
- Every effect is a token that is `none` or transparent outside vibrant. Components declare the effect once, and the mode decides whether it shows.
- This follows the `sites/lossless-slides-site` pattern of "effects switched off by token".

**Gradients.** Collected from the recipes the site already uses most:
```css
[data-mode="vibrant"] {
  --gradient-signature: linear-gradient(135deg, #147EB6 0%, #33A3BC 50%, #5FD7C5 100%); /* the trademark gradient, DESIGN.md:88 */
  --gradient-section-deep:  linear-gradient(to bottom right, #041A26, #172554 55%, #1e3a8a);              /* from-blue-950 via-blue-900 to-indigo-900, re-grounded */
  --gradient-section-tidal: linear-gradient(to bottom right, #041A26, #1e3a8a 50%, #134e4a);              /* from-slate-900 via-blue-900 to-teal-900 (homepage BlindSpotV4) */
  --gradient-card-tint:     linear-gradient(to bottom right, rgb(99 102 241 / .10), rgb(59 130 246 / .10), rgb(6 182 212 / .10));
  --gradient-cta:           linear-gradient(to right, #22d3ee, #3b82f6);                                  /* from-cyan-400 to-blue-500 */
  --gradient-hairline:      linear-gradient(to right, transparent, #22d3ee, transparent);
}
```
In light and dark, every section gradient token resolves to `var(--color-background)`. The hairline token resolves to `var(--color-border)`.

**Glass.** Built from the most common recipes, `bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl` (22 uses) and `bg-white/10 backdrop-blur-sm border-white/20` (42):
- Fill `rgb(255 255 255 / 0.06)` over a `#082233` tint.
- `backdrop-filter: blur(24px) saturate(1.6)`.
- Edge `rgb(255 255 255 / 0.14)`. Hover: fill `0.10`, edge `0.22`.
- Card roundness `0.5`, about 1rem, against square cards in dark.

**Glows:**
- `--glow-orb-a: radial-gradient(closest-side, rgb(37 99 235 / .25), transparent)`; `--glow-orb-b` the same in teal (`rgb(13 148 136 / .2)`).
  - Used by an `.orb` utility at `blur(64px)`, replacing the 55 ad-hoc `blur-3xl` orbs.
  - Slow pulse, only under `prefers-reduced-motion: no-preference`.
  - The `animate-pulse-slow` and `-delay` keyframes are defined globally **once**. Today they are defined locally in only 13 of the 25 files that use them.
- `--shadow-glow: 0 0 24px rgb(34 211 238 / .25)` for CTAs and focus-adjacent emphasis, replacing `shadow-cyan-500/25` and `shadow-blue-400/50`.
- Text glow (`/the-people`'s `@keyframes glow`) stays local to that page and is not a token.

**Guardrails carried over from DESIGN.md:**
- **Blue-green only.** Indigo is allowed as the dark end of the blue range in grounds; violet and purple are not. Retire the purple `partner` button variant (`Button--Variants.astro`).
- **The signature gradient is used once per page,** for a moment that means something.
- **Partner trademarks are never recoloured.**
- **A dark ground takes the base or `--Inverted` TWF mark, never `--Darker`.** `pages/index.astro:19` breaks this today.

### Light mode (open decision)

twf-next has **no light palette**. Its only light rendering is its printable text view (`text-view.css:39-117`): ink `#141414`, dim `#4a4f52`, accent `#114F66`, on-accent `#ffffff`, ground `#ffffff`. Options:

- **A. "Paper"** (recommended starting point). Use twf-next's text-view values as the semantic base, add a faint aqua surface (`#ecfeff`, primary-50) and hairline edges `rgb(4 26 38 / 0.12)`.
  - Same fonts, same spacing; no glows, no section gradients.
  - Cheapest, coherent with twf-next, and readable in print.
- **B. "Daylight water."** A pale tinted ground (`#f0f9ff` to `#ecfeff`), deep-navy ink `#041A26`, and soft gradient section grounds in `secondary-50` to `accent-50`.
  - Keeps some of the brand's water feel, at the cost of designing a second gradient set.
- **C. Defer.** Ship dark and vibrant first, and keep the toggle at two options until light is designed.
  - Honest and fast, but it breaks the three-mode contract for a while.

Whichever is chosen, light gets a **complete** semantic block. Today's blank-token light mode (finding 4) must not survive step 0.

---

## Implementation steps

Each step is one Conventional Commit on `development`. Each step updates DESIGN.md and its dididecks copy (`ai-labs/dididecks-ai/client-sites/the-water-foundation/DESIGN.md`) in the same commit, per DESIGN.md:446-459.

### Step 0: fix the wiring (no visual intent)
1. Create `theme.css` and move the tokens out of `global.css`. Delete `default-theme.css`, `tailwind-v4.css` and `tailwind.plugin.js`. Fold `water-theme.css`'s slide-only needs into `theme.css`.
2. Register the semantic tokens with `@theme inline` (finding 1).
3. Add the `@custom-variant` lines and remove the OS-driven media queries (finding 2).
4. Move `.theme-water`'s font, leading and rounding to global CSS on `html`, or delete them in favour of step 2 (finding 3).
5. Always set `data-mode`. Make the switcher and the pre-paint script three-state. Make the toggle a three-way radiogroup. Retire `theme-switcher.js` and the slides toggle. Route the slide-deck layouts through `BoilerPlateHTML` (closes the slide-deck issue).
6. Give light mode a complete semantic block, even if it is temporary (finding 4).

### Step 1: tokens
Add twf-next's type, spacing, radius, motion and dark-palette tokens, the vibrant effect tokens, and the light block for the chosen option. Nothing in the components changes yet.

### Step 2: typography takeover
1. Add the faces and preloads.
2. Port the `.t-*` roles and map the bare elements onto them in `@layer base`.
3. Map the most common heading recipes onto roles:
   - `text-5xl md:text-6xl` (20 uses) becomes `t-display`.
   - `text-3xl md:text-4xl` (38 uses) becomes `t-h2`.
   - `.water-header` and `.water-header-team` (`global.css:590-716`) and the duplicate in `team-spans.css` are rebuilt on roles.
4. Retire the Google Fonts request.

### Step 3: chrome and homepage
1. Convert the header, footer, `BaseThemeLayout` and the homepage composition (`HeroCenteredLogo--MobilePopOut`, `BlindSpotV4`, `WhoWeAreExtendedV3`) to semantic and effect tokens.
2. Add the shared parts `.surface`, `.glass`, `.orb`, `.section-ground` and `.btn`.
3. This is the first point where all three modes are visibly distinct.

### Step 4: component migration
Convert raw palette classes (`text-blue-100`, `bg-white/10`, `from-blue-950 …`) to semantic utilities and effect tokens, worst first, by count of raw palette classes:

1. `layouts/sections/events/WorkingGroupsSection.astro` (116)
2. `pages/SolutionsAlongtheWaterCycle.astro` (110)
3. `pages/homepage2.astro` (105)
4. `pages/homepage.astro` (94)
5. `pages/solutions.astro` (88)
6. `pages/beliefs/freshwaterandoceanwater/index.astro` (88)
7. `components/basics/RichFactCard.astro` (86)
8. `pages/howwework/index.astro` (85)
9. `pages/fellowship.astro` (74)
10. `pages/beliefs/funds-as-instruments.astro` (62)

Then the long tail. Hex literals and `rgb()`/`rgba()` in scoped CSS are converted in the same pass. Fix the `global.css:473-475` bug, where `.text-accent-800` is set to `accent-600`, and remove the `!important` overrides at lines 478-489 once nothing needs them.

### Step 5: clean-up
Remove Tailwind's default palette and spacing utilities (`@theme { --color-*: initial; }`) once a grep shows no raw palette classes remain. Add a check that fails the build on new raw palette classes or bare hex, similar to twf-next's `tests/unit/utilities.test.js`.

---

## Verification

- `pnpm build` passes with no new warnings, and the built CSS contains rules for `bg-background`, `text-foreground` and `border-border`.
- For each of the three modes, on `/`, `/the-people`, `/solutions`, `/howwework` and one slide deck:
  - Take a Playwright accessibility snapshot, plus one screenshot per mode for visual judgement.
  - No mode shows white-on-white or navy-on-navy.
  - The mode survives a reload.
  - There is no flash on first paint.
- Turning on `prefers-reduced-motion` stops the orb pulses and the reveal motion.
- Fonts: only Aspekta, DM Sans (and Newsreader, if adopted) load. There is no request to `fonts.googleapis.com`.

---

## Open questions

1. **Light mode:** option A, B or C?
2. **Default mode:** keep dark as the default (DESIGN.md: "born dark")? Or default to vibrant, as the Lossless brand sites do? Recommendation: dark stays the default for TWF, with vibrant as the opt-in "energy" mode.
3. **Does ITC Avant Garde Gothic keep a role?** It could serve the wordmark-adjacent display only, or be dropped in favour of Aspekta. twf-next lists it as an alternate face with an unverified "open" licence note, so check the licence before any wider use.
4. **twf-next's copy and layout bans:** no eyebrows (uppercase tracked kickers), no `→` characters in labels, no decorated cards in dark. Adopt them in dark and light only, or site-wide? twf_site uses `uppercase tracking-widest` section titles today (for example `BlindSpotV4.astro:11`).
5. **Indigo:** allowed as the deep end of the blue range in vibrant grounds (as drafted), or removed entirely to honour DESIGN.md's "no third hue"?
6. **twf-next's grain texture on glass:** in dark only, or in vibrant too?
