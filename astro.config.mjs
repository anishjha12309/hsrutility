import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin. Required by @astrojs/sitemap and by the canonical/OG tags in
  // Layout.astro — without it, Astro.site is undefined and both break.
  site: 'https://hsrutility.com',

  integrations: [sitemap()],

  // /privacy was the studio-wide policy until 2026-08-20, when each app got its own
  // and this slug was re-scoped to /privacy-policy for the website. Every already
  // installed Pakiza and Arul build still opens https://hsrutility.com/privacy/ in
  // its in-app reader, so the slug has to keep resolving — a 404 inside a Play
  // reviewer's policy screen is the worst possible way to find this out. Astro emits
  // a static redirect page for it in a static build.
  //
  // The app's sub-site was /awaazpay/ (until 2026-11-18), then /alertpaisa/ (until
  // 2026-11-20), now /dailypassbook/. Installed builds, the Play listing, Truecaller and
  // Meta link the old pages, so every old address keeps resolving, straight to the
  // current page. Never remove one.
  //
  // In production `public/_redirects` answers these with a real 301 before any file is
  // served; the meta-refresh pages Astro builds from this list are only a fallback (local
  // preview, another host). Add a new old address to both.
  redirects: {
    '/privacy': '/privacy-policy',
    '/awaazpay': '/dailypassbook/',
    '/awaazpay/privacy-policy': '/dailypassbook/privacy-policy/',
    '/awaazpay/terms': '/dailypassbook/terms/',
    '/awaazpay/refund-policy': '/dailypassbook/refund-policy/',
    '/awaazpay/how-to-delete-account': '/dailypassbook/how-to-delete-account/',
    '/alertpaisa': '/dailypassbook/',
    '/alertpaisa/privacy-policy': '/dailypassbook/privacy-policy/',
    '/alertpaisa/terms': '/dailypassbook/terms/',
    '/alertpaisa/refund-policy': '/dailypassbook/refund-policy/',
    '/alertpaisa/how-to-delete-account': '/dailypassbook/how-to-delete-account/',
  },


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
