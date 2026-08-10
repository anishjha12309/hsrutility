import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin. Required by @astrojs/sitemap and by the canonical/OG tags in
  // Layout.astro — without it, Astro.site is undefined and both break.
  site: 'https://hsrutility.com',

  integrations: [sitemap()],

  // Tailwind 4 ships as a Vite plugin; the old @astrojs/tailwind integration is
  // deprecated and was removed in the rebuild.
  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    // Inline the stylesheet rather than shipping a separate render-blocking <link>.
    // Astro's default ('auto') only inlines under 4kB; ours is larger but still small
    // enough that inlining beats an extra round trip on a throttled mobile connection.
    inlineStylesheets: 'always',
  },

  image: {
    // App icons are the only raster images on the site. AVIF first, WebP fallback.
    responsiveStyles: true,
  },
});
