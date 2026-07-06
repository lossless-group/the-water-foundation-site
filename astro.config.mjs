// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  // Your public domain (without trailing slash)
  site: 'https://the-water-foundation.com',
  // Remove the base path if your site is served from the root domain
  // If your site is served from a subdirectory, include it here (e.g., '/docs')
  base: '/',
  // Configure trailing slashes (choose one)
  // - 'ignore' (default): Match URLs with or without trailing slashes
  // - 'always': Always use trailing slashes
  // - 'never': Never use trailing slashes
  trailingSlash: 'ignore',

  integrations: [
    // @astrojs/sitemap auto-generates sitemap-index.xml + sitemap-0.xml from
    // every prerendered page Astro emits. Filter excludes the llms.txt
    // endpoints (those serve LLMs, not search engines) and the 404 page.
    sitemap({
      filter: (page) =>
        !page.includes('/llms.txt') &&
        !page.includes('/llms-full.txt') &&
        !page.endsWith('/404/') &&
        !page.endsWith('/404'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@layouts': path.resolve('./src/layouts'),
        '@icons': path.resolve('./public/icons'),
        '@sections': path.resolve('./src/layouts/sections'),
        '@components': path.resolve('./src/components'),
        '@infographic': path.resolve('./src/components/infographic'),
        '@core-messages': path.resolve('./src/layouts/sections/core-messages')
      }
    },
    server: {
      fs: {
        // Allow serving files from the monorepo root (for hoisted pnpm dependencies)
        allow: ['../..']
      }
    }
  }
});