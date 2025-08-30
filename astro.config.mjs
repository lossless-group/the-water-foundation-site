// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
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
    }
  }
});