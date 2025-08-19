/*
  Server-only Unsplash API utilities.
  Do NOT import this in client-side code. Use from API routes or server-side Astro.
*/

export type UnsplashPhoto = {
  id: string;
  description: string | null;
  alt: string | null;
  width: number;
  height: number;
  color?: string | null;
  blur_hash?: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
};

export type NormalizedPhoto = {
  id: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  creditUrl: string;
  src: string; // images.unsplash.com URL with params applied
};

const UNSPLASH_BASE = 'https://api.unsplash.com';

function requireEnv(name: string): string {
  const v = import.meta.env[name as keyof ImportMetaEnv] as unknown as string | undefined;
  if (!v) {
    console.warn(`Missing environment variable ${name}, using fallback`);
    return 'demo-key'; // Fallback for build environments
  }
  return v;
}

function authHeaders() {
  const accessKey = requireEnv('UNSPLASH_ACCESS_KEY');
  return { Authorization: `Client-ID ${accessKey}` };
}

export type SearchOptions = {
  perPage?: number;
  page?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
};

export async function searchPhotos(query: string, opts: SearchOptions = {}): Promise<UnsplashPhoto[]> {
  const accessKey = requireEnv('UNSPLASH_ACCESS_KEY');
  
  // If using fallback key, return empty results instead of making API calls
  if (accessKey === 'demo-key') {
    console.warn('Using demo key, returning empty Unsplash results');
    return [];
  }
  
  const params = new URLSearchParams({
    query,
    per_page: String(opts.perPage ?? 12),
    page: String(opts.page ?? 1),
    orientation: opts.orientation ?? 'landscape',
  });
  const url = `${UNSPLASH_BASE}/search/photos?${params.toString()}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return (data.results ?? []) as UnsplashPhoto[];
}

export type RandomOptions = {
  query?: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
};

export async function getRandomPhoto(opts: RandomOptions = {}): Promise<UnsplashPhoto> {
  const params = new URLSearchParams({
    orientation: opts.orientation ?? 'landscape',
  });
  if (opts.query) params.set('query', opts.query);
  const url = `${UNSPLASH_BASE}/photos/random?${params.toString()}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Unsplash random failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as UnsplashPhoto;
}

export function toNormalized(photo: UnsplashPhoto, w = 1200, h = 800, q = 80): NormalizedPhoto {
  // Build a stable images.unsplash.com URL based on the raw/full URL
  // Prefer "raw" so we can control transforms.
  const raw = new URL(photo.urls.raw);
  raw.searchParams.set('auto', 'format');
  raw.searchParams.set('fit', 'crop');
  raw.searchParams.set('w', String(w));
  raw.searchParams.set('h', String(h));
  raw.searchParams.set('q', String(q));

  return {
    id: photo.id,
    alt: photo.alt ?? photo.description ?? 'Unsplash image',
    width: w,
    height: h,
    credit: photo.user?.name ?? 'Unsplash photographer',
    creditUrl: photo.links?.html ?? `https://unsplash.com/photos/${photo.id}`,
    src: raw.toString(),
  };
}

export async function findFirstNormalized(query: string, w = 1200, h = 800, q = 80): Promise<NormalizedPhoto | null> {
  const results = await searchPhotos(query, { perPage: 1, page: 1, orientation: 'landscape' });
  if (!results.length) {
    // Return a placeholder when no results (e.g., when using demo key)
    return {
      id: 'placeholder',
      alt: `Placeholder image for ${query}`,
      width: w,
      height: h,
      credit: 'Placeholder',
      creditUrl: '#',
      src: `https://via.placeholder.com/${w}x${h}/0891b2/ffffff?text=${encodeURIComponent(query)}`
    };
  }
  return toNormalized(results[0], w, h, q);
}
