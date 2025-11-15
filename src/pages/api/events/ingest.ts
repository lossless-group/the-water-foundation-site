import type { APIRoute } from 'astro';
import { JSDOM } from 'jsdom';

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseDateRange(text: string): { start: string; end: string } | null {
  const m = text.match(/(\d{1,2})\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4}).*?(\d{1,2})\s*\2\s*\3/i);
  if (m) {
    const months: Record<string, string> = {
      january: '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
    };
    const day1 = m[1].padStart(2, '0');
    const month = months[m[2].toLowerCase()];
    const year = m[3];
    const day2 = m[4].padStart(2, '0');
    return { start: `${year}-${month}-${day1}`, end: `${year}-${month}-${day2}` };
  }
  const n = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2}).*?(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (n) {
    const s = `${n[1]}-${String(Number(n[2])).padStart(2, '0')}-${String(Number(n[3])).padStart(2, '0')}`;
    const e = `${n[4]}-${String(Number(n[5])).padStart(2, '0')}-${String(Number(n[6])).padStart(2, '0')}`;
    return { start: s, end: e };
  }
  return null;
}

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url') || url.searchParams.get('u') || url.searchParams.get('link');
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const res = await fetch(target);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Fetch failed ${res.status}` }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const title = doc.querySelector('h1')?.textContent?.trim() || doc.title || 'Event';
    const text = doc.body.textContent || '';
    const range = parseDateRange(text) || parseDateRange(title) || null;
    const loc = (text.match(/Johannesburg|South\s*Africa|Pretoria|Cape\s*Town/i)?.[0] || '').replace(/\s+/g, ' ').trim();
    const event_name = title;
    const slug = toSlug(title.replace(/\d{4}/, '').trim());
    const upcoming_dates = range ? `${range.start}--${range.end}` : '';
    const upcoming_location = loc || '';
    const splash_page_path = `/events/${slug}`;
    const event_website = new URL(target).origin;
    const contact_email = 'dive.deep@the-water-foundation.com';
    const share_image = '/ogImageLandscape__The-Water-Foundation.jpg';
    const twf_zinger = 'The Water Foundation is a think tank and capital catalyst, assuring full-stack financial innovations are tackling the urgent challenge of our time.';
    const invite_message = `Meet us at ${event_name}.`;
    const frontmatter = `---\n` +
      `title: "Meet The Water Foundation at ${event_name}"\n` +
      `event_name: "${event_name}"\n` +
      `upcoming_dates: "${upcoming_dates}"\n` +
      `upcoming_location: "${upcoming_location}"\n` +
      `url: https://the-water-foundation.com\n` +
      `splash_page_path: ${splash_page_path}\n` +
      `twf_zinger: "${twf_zinger}"\n` +
      `invite_message: "${invite_message}"\n` +
      `share_image: ${share_image}\n` +
      `contact_email: "${contact_email}"\n` +
      `contact_phone: "+49 177 4543720"\n` +
      `event_website: "${event_website}"\n` +
      `---\n`;
    return new Response(JSON.stringify({ slug, splash_page_path, frontmatter, fields: { title: `Meet The Water Foundation at ${event_name}`, event_name, upcoming_dates, upcoming_location, url: 'https://the-water-foundation.com', splash_page_path, twf_zinger, invite_message, share_image, contact_email, contact_phone: '+49 177 4543720', event_website } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const target = body.url || body.u || body.link;
    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const res = await fetch(target);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Fetch failed ${res.status}` }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const title = doc.querySelector('h1')?.textContent?.trim() || doc.title || 'Event';
    const text = doc.body.textContent || '';
    const range = parseDateRange(text) || parseDateRange(title) || null;
    const loc = (text.match(/Johannesburg|South\s*Africa|Pretoria|Cape\s*Town/i)?.[0] || '').replace(/\s+/g, ' ').trim();
    const event_name = title;
    const slug = toSlug(title.replace(/\d{4}/, '').trim());
    const upcoming_dates = range ? `${range.start}--${range.end}` : '';
    const upcoming_location = loc || '';
    const splash_page_path = `/events/${slug}`;
    const event_website = new URL(target).origin;
    const contact_email = 'dive.deep@the-water-foundation.com';
    const share_image = '/ogImageLandscape__The-Water-Foundation.jpg';
    const twf_zinger = 'The Water Foundation is a think tank and capital catalyst, assuring full-stack financial innovations are tackling the urgent challenge of our time.';
    const invite_message = `Meet us at ${event_name}.`;
    const frontmatter = `---\n` +
      `title: "Meet The Water Foundation at ${event_name}"\n` +
      `event_name: "${event_name}"\n` +
      `upcoming_dates: "${upcoming_dates}"\n` +
      `upcoming_location: "${upcoming_location}"\n` +
      `url: https://the-water-foundation.com\n` +
      `splash_page_path: ${splash_page_path}\n` +
      `twf_zinger: "${twf_zinger}"\n` +
      `invite_message: "${invite_message}"\n` +
      `share_image: ${share_image}\n` +
      `contact_email: "${contact_email}"\n` +
      `contact_phone: "+49 177 4543720"\n` +
      `event_website: "${event_website}"\n` +
      `---\n`;
    return new Response(JSON.stringify({ slug, splash_page_path, frontmatter, fields: { title: `Meet The Water Foundation at ${event_name}`, event_name, upcoming_dates, upcoming_location, url: 'https://the-water-foundation.com', splash_page_path, twf_zinger, invite_message, share_image, contact_email, contact_phone: '+49 177 4543720', event_website } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};