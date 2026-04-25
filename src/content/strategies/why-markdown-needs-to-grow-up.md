---
title: Why Markdown Needs to Grow Up
description: Thoughts on why the markdown ecosystem is fragmented and what LFM is trying to fix.
---

# Why Markdown Needs to Grow Up

Markdown is simultaneously the best and worst content format. Best because it's plain text, version-controllable, AI-friendly, and learnable in ten minutes.[^a1b2c3] Worst because the moment you need anything beyond headings and paragraphs, you fall off a cliff into fragmented, incompatible extension ecosystems.[^d4e5f6]

## The Core Tension

Every library picks ONE syntax for triggering components and refuses the others:

- **MDX** requires JSX. Content authors shouldn't need to know React.
- **Markdoc** requires `{% tag %}`. Beautiful system, locked to one syntax.
- **remark-directive** requires `:::name{}`. Expressive, but unfamiliar.
- **Obsidian** uses code fences. Works in their app, breaks everywhere else.

Each library treats its chosen syntax as a *philosophy* rather than a *preference*.[^g7h8i9] That's the problem.

## What We're Building

LFM's response is not to pick a side but to build a normalizer that accepts multiple trigger syntaxes and renders them the same way. An author writing `:::callout{type="warning"}` and `> [!warning]` is doing the exact same thing. The syntax is just a trigger. The underlying operation is identical.

> [!tip] The Key Insight
> Publish a package when multiple sites need identical processing logic. Copy a pattern when each site customizes it. Not everything needs to be shared, and not everything should be copied.

## Where This Matters Most

For us, it's investment memos, market analyses, and technical specifications. Documents that need:

- Rich citations with source attribution
- Floated images with captions (like a textbook)
- Embedded media (YouTube, Figma, Loom)
- Collapsible sections for detailed appendices
- Mermaid diagrams inline with prose

None of these are exotic requirements. They're basic needs for serious content.[^j0k1l2] And yet no single markdown library handles all of them without dropping into raw HTML or JSX.

[^a1b2c3]: 2024. [CommonMark Spec](https://spec.commonmark.org/). Published: 2024-01-28
[^d4e5f6]: 2023. [The State of Markdown Tooling](https://unifiedjs.com/learn/guide/introduction-to-unified/). Published: 2023-06-15
[^g7h8i9]: 2022. [Markdoc: A Powerful, Flexible Markdown-based Authoring Framework](https://markdoc.dev/). Published: 2022-05-11
[^j0k1l2]: 2025. [Why We Built Our Own Markdown Pipeline](https://lossless.group). Published: 2025-03-25
