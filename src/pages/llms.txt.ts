/**
 * /llms.txt — link index for LLM consumers.
 *
 * Spec: https://llmstxt.org/
 *
 * The human-editable prose template lives at `src/llms/llms.md` (with token
 * documentation in `src/llms/README.md`). This file is the dumb assembler:
 * load template, compute dynamic values, substitute tokens. Edit prose in
 * the markdown — not here.
 *
 * This site is `output: 'static'` (Astro default). The endpoint emits a
 * static dist/llms.txt at build time.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_SEO } from '../lib/seo';
import template from '../llms/llms.md?raw';

type AnyData = Record<string, any>;

function isPublished(data: AnyData): boolean {
  return data.publish !== false && data.private !== true;
}

function entryDateMs(data: AnyData): number {
  const d =
    data.date_modified ??
    data.date_authored_current_draft ??
    data.date_created ??
    data.date_authored_initial_draft ??
    data.date;
  if (!d) return 0;
  const t = d instanceof Date ? d.getTime() : new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Parse the leading date out of an `events` collection entry's
 * `upcoming_dates` (e.g., "2025-11-10--2025-11-21" or "2026-01-19--01-23").
 * Returns ms-since-epoch, 0 if unparseable.
 */
function eventStartMs(data: AnyData): number {
  const raw = data.upcoming_dates as string | undefined;
  if (!raw) return 0;
  const match = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 0;
  const t = new Date(`${match[1]}-${match[2]}-${match[3]}`).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export const GET: APIRoute = async () => {
  const site = import.meta.env.SITE ?? 'https://the-water-foundation.com';
  const base = import.meta.env.BASE_URL ?? '/';
  const root = new URL(base, site).toString().replace(/\/$/, '');

  // ── Strategies ───────────────────────────────────────────────────────
  let strategiesAll: Awaited<ReturnType<typeof getCollection<'strategies'>>> = [];
  try { strategiesAll = await getCollection('strategies'); } catch { strategiesAll = []; }
  const strategies = strategiesAll.filter((e) => isPublished(e.data as AnyData));
  strategies.sort((a, b) => {
    const da = entryDateMs(a.data as AnyData);
    const db = entryDateMs(b.data as AnyData);
    if (da !== db) return db - da;
    const ta = ((a.data as AnyData).title ?? a.id).toLowerCase();
    const tb = ((b.data as AnyData).title ?? b.id).toLowerCase();
    return ta.localeCompare(tb);
  });

  const strategiesLines: string[] = [];
  for (const entry of strategies) {
    const data = entry.data as AnyData;
    const title = data.title ?? entry.id;
    const url = `${root}/strategies/${entry.id}`;
    const lede = data.description ?? data.lede ?? data.summary;
    strategiesLines.push(lede ? `- [${title}](${url}): ${lede}` : `- [${title}](${url})`);
  }

  // ── Slides ───────────────────────────────────────────────────────────
  let slidesAll: Awaited<ReturnType<typeof getCollection<'slides'>>> = [];
  try { slidesAll = await getCollection('slides'); } catch { slidesAll = []; }
  const slides = slidesAll.filter((e) => isPublished(e.data as AnyData));
  slides.sort((a, b) => {
    const ta = ((a.data as AnyData).title ?? a.id).toLowerCase();
    const tb = ((b.data as AnyData).title ?? b.id).toLowerCase();
    return ta.localeCompare(tb);
  });

  const slidesLines: string[] = [];
  for (const entry of slides) {
    const data = entry.data as AnyData;
    const title = data.title ?? entry.id;
    // markdownDecks.ts strips the `.md` and lowercases — match that here.
    const slug = entry.id.replace(/\.md$/, '').toLowerCase();
    const url = `${root}/slides/${slug}`;
    const lede = data.description ?? data.lede ?? data.summary;
    slidesLines.push(lede ? `- [${title}](${url}): ${lede}` : `- [${title}](${url})`);
  }

  // ── Events ───────────────────────────────────────────────────────────
  let eventsAll: Awaited<ReturnType<typeof getCollection<'events'>>> = [];
  try { eventsAll = await getCollection('events'); } catch { eventsAll = []; }
  const events = eventsAll.filter((e) => isPublished(e.data as AnyData));
  events.sort((a, b) => {
    const da = eventStartMs(a.data as AnyData);
    const db = eventStartMs(b.data as AnyData);
    if (da !== db) return db - da;
    const ta = ((a.data as AnyData).title ?? a.id).toLowerCase();
    const tb = ((b.data as AnyData).title ?? b.id).toLowerCase();
    return ta.localeCompare(tb);
  });

  const eventsLines: string[] = [];
  for (const entry of events) {
    const data = entry.data as AnyData;
    const title = data.title ?? entry.id;
    const dates = data.upcoming_dates ?? '';
    const location = data.upcoming_location ?? '';
    const dateLoc = [dates, location].filter(Boolean).join(' · ');
    const zinger = data.invite_message ?? data.twf_zinger ?? data.description ?? '';
    // No per-event detail page in `src/pages/events/` matches the collection
    // entries one-to-one; link to the events index for navigation.
    const url = `${root}/events`;
    const labelExtras = dateLoc ? ` (${dateLoc})` : '';
    eventsLines.push(
      zinger
        ? `- [${title}](${url})${labelExtras}: ${zinger}`
        : `- [${title}](${url})${labelExtras}`,
    );
  }

  const tokens: Record<string, string> = {
    SITE_NAME: SITE_SEO.siteName,
    STRATEGY_COUNT: String(strategies.length),
    SLIDE_COUNT: String(slides.length),
    EVENT_COUNT: String(events.length),
    LLMS_FULL_URL: `${root}/llms-full.txt`,
    LLMS_INDEX_URL: `${root}/llms.txt`,
    STRATEGIES_INDEX: strategiesLines.join('\n').trimEnd(),
    SLIDES_INDEX: slidesLines.join('\n').trimEnd(),
    EVENTS_INDEX: eventsLines.join('\n').trimEnd(),
  };

  const body = template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(tokens, name) ? tokens[name] : match,
  );

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
