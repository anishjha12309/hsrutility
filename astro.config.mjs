import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin. Required by @astrojs/sitemap and by the canonical/OG
  // tags in Layout.astro — without it, Astro.site is undefined and both break.
  site: 'https://hsrutility.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  build: {
    // Inline the stylesheet rather than shipping a separate render-blocking <link>.
    // Astro's default ('auto') only inlines under 4kB; ours is larger but still small
    // enough that inlining beats an extra round trip on a throttled mobile connection.
    inlineStylesheets: 'always',
  },
});
