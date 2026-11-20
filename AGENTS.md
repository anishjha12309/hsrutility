# AGENTS.md — HSR Utility

Astro 5 static site for hsrutility.com (apps: Pakiza, Arul, Daily Passbook).

## Commands

- `npm run dev` · `npm run build` · `npm run preview`

## Rules

- Studio and app facts live in `src/lib/site.ts`; every page, `src/lib/schema.ts` and `public/llms.txt` read
  from it. Change a fact there, never in a page.
- The app sub-sites are siloed. Everything under `/pakiza/`, `/arul/` and `/dailypassbook/` carries that app's
  own nav, footer and legal links and links to nothing else: one app serves an Islamic audience and the other a
  Hindu one, and a page putting them one click apart invites a reading neither is asking for. Only the studio
  home and `llms.txt` name the apps together. `Layout`'s `scope` prop enforces it; never add a cross-link from
  an app page.
- Daily Passbook is a money app with no `legal` facts: its legal pages live in `src/pages/dailypassbook/`,
  not `[app]/`.

## Gotchas

- `/terms` 308s to `/terms/`: without `curl -L`, every grep silently finds nothing.

## Owner only

- Pushing to `master` deploys the live site (Cloudflare Pages builds every push). Teammates open a pull
  request; only the owner merges.
- Commit only after the owner approves, with a one-line message.
