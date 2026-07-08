/**
 * /llms-full.txt — concatenated raw markdown of every published strategy,
 * slide deck, and event entry on the-water-foundation.com.
 *
 * Spec: https://llmstxt.org/
 *
 * The human-editable prose template lives at `src/llms/llms-full.md` (with
 * token documentation in `src/llms/README.md`). This file is the dumb
 * assembler: load template, gather corpus bodies with metadata headers,
 * substitute tokens. Edit prose in the markdown — not here.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_SEO } from '../lib/seo';
import template from '../llms/llms-full.md?raw';

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

function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value as any);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

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

  let strategiesAll: Awaited<ReturnType<typeof getCollection<'strategies'>>> = [];
  try { strategiesAll = await getCollection('strategies'); } catch { strategiesAll = []; }
  const strategies = strategiesAll.filter((e) => isPublished(e.data as AnyData));

  let slidesAll: Awaited<ReturnType<typeof getCollection<'slides'>>> = [];
  try { slidesAll = await getCollection('slides'); } catch { slidesAll = []; }
  const slides = slidesAll.filter((e) => isPublished(e.data as AnyData));

  let eventsAll: Awaited<ReturnType<typeof getCollection<'events'>>> = [];
  try { eventsAll = await getCollection('events'); } catch { eventsAll = []; }
  const events = eventsAll.filter((e) => isPublished(e.data as AnyData));

  type Kind = 'strategy' | 'slide' | 'event';
  type Tagged = {
    kind: Kind;
    entry:
      | (typeof strategies)[number]
      | (typeof slides)[number]
      | (typeof events)[number];
  };

  const sortByDateThenTitle = <T extends { id: string; data: AnyData }>(arr: T[]) =>
    [...arr].sort((a, b) => {
      const da = entryDateMs(a.data);
      const db = entryDateMs(b.data);
      if (da !== db) return db - da;
      const ta = (a.data.title ?? a.id).toLowerCase();
      const tb = (b.data.title ?? b.id).toLowerCase();
      return ta.localeCompare(tb);
    });

  const sortEvents = <T extends { id: string; data: AnyData }>(arr: T[]) =>
    [...arr].sort((a, b) => {
      const da = eventStartMs(a.data);
      const db = eventStartMs(b.data);
      if (da !== db) return db - da;
      const ta = (a.data.title ?? a.id).toLowerCase();
      const tb = (b.data.title ?? b.id).toLowerCase();
      return ta.localeCompare(tb);
    });

  const stream: Tagged[] = [];
  for (const entry of sortByDateThenTitle(strategies)) stream.push({ kind: 'strategy', entry });
  for (const entry of [...slides].sort((a, b) => {
    const ta = (a.data.title ?? a.id).toLowerCase();
    const tb = (b.data.title ?? b.id).toLowerCase();
    return ta.localeCompare(tb);
  })) {
    stream.push({ kind: 'slide', entry });
  }
  for (const entry of sortEvents(events)) stream.push({ kind: 'event', entry });

  const bodyParts: string[] = [];
  for (const { kind, entry } of stream) {
    const data = entry.data as AnyData;
    const title = data.title ?? entry.id;

    let url = '';
    let sourcePath = entry.id;
    let lastModified: string | undefined;
    let extraHeaders: string[] = [];

    if (kind === 'strategy') {
      url = `${root}/strategies/${entry.id}`;
      sourcePath = `src/content/strategies/${entry.id}.md`;
      lastModified = isoDate(data.date);
    } else if (kind === 'slide') {
      const slug = entry.id.replace(/\.md$/, '').toLowerCase();
      url = `${root}/slides/${slug}`;
      sourcePath = `src/content/slides/${entry.id}.md`;
      lastModified = isoDate(data.date);
    } else if (kind === 'event') {
      url = `${root}/events`;
      sourcePath = `src/content/events/${entry.id}.md`;
      if (data.upcoming_dates) extraHeaders.push(`- Upcoming dates: ${data.upcoming_dates}`);
      if (data.upcoming_location) extraHeaders.push(`- Location: ${data.upcoming_location}`);
      if (data.event_website) extraHeaders.push(`- Event website: ${data.event_website}`);
    }

    bodyParts.push('---');
    bodyParts.push('');
    bodyParts.push(`## ${title}`);
    bodyParts.push('');
    bodyParts.push(`- Kind: \`${kind}\``);
    bodyParts.push(`- Source path: \`${sourcePath}\``);
    bodyParts.push(`- Canonical URL: ${url}`);
    if (lastModified) bodyParts.push(`- Last modified: ${lastModified}`);
    for (const h of extraHeaders) bodyParts.push(h);
    bodyParts.push('');
    bodyParts.push(entry.body ?? '');
    bodyParts.push('');
  }

  const tokens: Record<string, string> = {
    SITE_NAME: SITE_SEO.siteName,
    STRATEGY_COUNT: String(strategies.length),
    SLIDE_COUNT: String(slides.length),
    EVENT_COUNT: String(events.length),
    LLMS_INDEX_URL: `${root}/llms.txt`,
    CORPUS_BODIES: bodyParts.join('\n').trimEnd(),
  };

  const body = template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(tokens, name) ? tokens[name] : match,
  );

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
