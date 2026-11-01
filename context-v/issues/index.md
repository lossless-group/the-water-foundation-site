# Issues

* [Issue of Empty Fellowship Program Page](Issue-of-Empty-Fellowship-Program-Page.md) - `/our-fellowship-program` builds to a zero-byte HTML file — the route ships, but there is nothing in it.
* [Issue of Slide Decks Bypassing the Mode System](Issue-of-Slide-Decks-Bypassing-the-Mode-System.md) - The two slide-deck layouts declare their own `<html>` and never set `data-mode`, so the eight `/slides/*` pages ignore light/dark entirely.
