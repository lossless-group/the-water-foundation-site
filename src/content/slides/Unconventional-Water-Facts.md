---
title: "Unconventional Water Facts"
description: "Think outside the box from our unconventional water facts"
theme: "water"
transition: "slide"
tags: ["data", "research", "insights"]
---

# Unconventional Water Facts Slide

## Prior to proceeding, add to your Context Window:
`src/components/slides/astro-decks/variant-1/slides`
Please review a few slides to understand our patterns and conventions.

## Task at Hand:

This will be our first dynamic slide. The UI will be a smaller or more constraint variant of our FactsGrid component. The data will be imported from our facts collection. 

The presenter should be able to scroll, carousel style, through the FactCards displaying a fact in the fact collection. The fact collection is sorted by index.

> We do not have a Carousel UI, so we will need to improvise the buttons and behaviors. We prefer HTML and CSS for interactivity, and avoid JavaScript where possible.  We never use JSX or any other React related conventions.  We have already added the GSAP library, though we have not used it yet. 

The functionality is similar to what we have at the path:

`src/pages/dive-into/water.astro`

The facts have a schema that generates an Astro collection:
`src/content/facts/schema.ts`

The collection can be found in:
`src/content/facts`

This imports the component

```astro
---
import FactsGrid from '@components/facts/FactsGrid.astro';

const entries = (await getCollection('facts')).sort(
  (a, b) => a.data.index - b.data.index
);
---

  <FactsGrid entries={entries} />
```