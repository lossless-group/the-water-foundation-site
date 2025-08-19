import type { APIRoute } from 'astro';

// Simple server-side image proxy to avoid client-side CORS/request policy issues.
// Usage: /api/image?url=<encoded-absolute-url>
export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) {
    return new Response('Missing url param', { status: 400 });
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        // Some CDNs require a UA; provide a minimal UA to reduce 403s
        'User-Agent': 'WaterFoundationSite/1.0 (+https://example.org)',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      // Redirect to a local fallback to ensure we never render blanks
      return Response.redirect('/heroes/imageOf__Whale-pair-under-wave.jpeg', 302);
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const cacheControl = 'public, max-age=3600';

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
      },
    });
  } catch {
    return Response.redirect('/heroes/imageOf__Whale-pair-under-wave.jpeg', 302);
  }
};
