# AGENTS.md — HSR Utility

Astro 5 static site for hsrutility.com (apps: Arul, Daily Passbook; Pakiza was removed 18 Nov 2026, its `/pakiza/` URLs return 404).

## Commands

- `npm run dev` · `npm run build` · `npm run preview`

## Rules

- Studio and app facts live in `src/lib/site.ts`; every page, `src/lib/schema.ts` and `public/llms.txt` read
  from it. Change a fact there, never in a page.
- The app sub-sites are siloed. Everything under `/arul/` and `/dailypassbook/` carries that app's own nav,
  footer and legal links and links to nothing else. Only the studio home and `llms.txt` name the apps together.
  `Layout`'s `scope` prop enforces it; never add a cross-link from an app page.
- Daily Passbook is a money app with no `legal` facts: its legal pages live in `src/pages/dailypassbook/`,
  not `[app]/`. Its `packageId` and Play URL stay `app.awaazpay.android`: a published app ID never changes.
- Daily Passbook's old slugs (`/awaazpay/` to 18 Nov 2026, `/alertpaisa/` 18-20 Nov) 301 straight to
  `/dailypassbook/…` from `public/_redirects`, with a fallback in `astro.config.mjs`. Installed builds and the
  consoles still link them, so never remove a redirect. On a rename, repoint every old line to the new slug
  (no chains) and add the current slug's lines.

## Gotchas

- `/terms` 308s to `/terms/`: without `curl -L`, every grep silently finds nothing.

## Owner only

- Pushing to `master` deploys the live site (Cloudflare Pages builds every push). Teammates open a pull
  request; only the owner merges.
- Commit only after the owner approves, with a one-line message.
