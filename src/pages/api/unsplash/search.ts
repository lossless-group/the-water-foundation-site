import type { APIRoute } from 'astro';
import { searchPhotos, toNormalized } from '../../../lib/api/unsplash';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('query') ?? '';
  const perPage = Number(url.searchParams.get('perPage') ?? 12);
  const page = Number(url.searchParams.get('page') ?? 1);
  const orientation = (url.searchParams.get('orientation') ?? 'landscape') as
    | 'landscape'
    | 'portrait'
    | 'squarish';
  const w = Number(url.searchParams.get('w') ?? 1200);
  const h = Number(url.searchParams.get('h') ?? 800);
  const q = Number(url.searchParams.get('q') ?? 80);

  if (!query) {
    return new Response(
      JSON.stringify({ error: 'Missing required "query" parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const results = await searchPhotos(query, { perPage, page, orientation });
    const normalized = results.map((p) => toNormalized(p, w, h, q));
    return new Response(
      JSON.stringify({ results: normalized }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // cache for 5 minutes at the edge/CDN if present
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
