/**
 * Static SEO registry for The Water Foundation site.
 *
 * The site name and base URL live here so endpoints (llms.txt, llms-full.txt,
 * future RSS, etc.) can read them without hardcoding strings. Page-level title
 * and description are still passed per-page via BoilerPlateHTML props — this
 * registry is only the static, site-wide defaults.
 */

export interface SiteSEO {
  siteName: string;
  baseUrl?: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImageLandscape: string;
  defaultImagePortrait: string;
}

export const SITE_SEO: SiteSEO = {
  siteName: 'The Water Foundation',
  baseUrl: import.meta.env.SITE ?? 'https://the-water-foundation.com',
  defaultTitle:
    'The Water Foundation — Water Independence for 1 Billion People by 2035',
  defaultDescription:
    'Water underpins 70% of global GDP and 100% of food production, yet receives less than .01% of institutional capital. Based in Dubai, Delhi, Vaduz, and Munich, The Water Foundation is working to ensure water resilience through blended, unsiloed financial strategies.',
  defaultImageLandscape: '/ogImageLandscape__The-Water-Foundation.jpg',
  defaultImagePortrait: '/ogImagePortrait__The-Water-Foundation.jpg',
};
