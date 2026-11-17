# Handoff: work in progress on this repo

Read this before editing. Two pieces of work touch the same files. Update your row when you
start, finish, or change a shared file. Delete this file once both rows say "done".

## 1. Add AwaazPay (owner OK 17 Nov 2026) — done, pushed to master

Done by the Claude session in `~/AwaazPay`. Owner decisions:

- AwaazPay is set up exactly like Arul: in `APPS`, home card, nav and footer menus, its own
  siloed sub-site `/awaazpay/` (landing page plus privacy-policy, terms, refund-policy,
  how-to-delete-account).
- Its legal pages use the same contact block as Arul's (`LegalContact`: support@hsrutility.com,
  legal name, address, phone).
- AwaazPay is a money app (bank payment alerts spoken aloud, autopay/EMI reminders), not a
  wallpaper app. Its legal text is its own (ported from `~/AwaazPay/web/src/pages/*.tsx`), so the
  wallpaper templates in `src/pages/[app]/` do not render its legal pages.
- Hosts: policies at `https://hsrutility.com/awaazpay/…/`; app server moves to
  `awaazpay-api.hsrutility.com` (a Worker in the AwaazPay repo, not this site).

Files this work changes (merge carefully if you touch them too):

- `src/lib/site.ts`: AWAAZPAY entry; new AppFact fields `category`, `applicationCategory`,
  `pricing`, `deletePath`, `cancelPath`; `legal` now optional (`WallpaperApp` type,
  `wallpaperApps()`, `otherApps()`, `appNamesOr()`); billing block moved above the apps
  (the apps read FREEMIUM_LINE); ORG_DESCRIPTION reworded
- `src/lib/media.ts`, `src/lib/schema.ts` (`applicationCategory` per app, `awaazpayAppSchema`)
- `assets/awaazpay.png` + six `assets/awaazpay-{passbook,autopays,transaction,upcoming,voice,reliability}.png`
- `src/pages/[app]/index.astro` (eyebrow and closing slab read `app.category` / `app.pricing`)
- `src/pages/[app]/{privacy-policy,terms,refund-policy,how-to-delete-account}.astro`
  (`getStaticPaths` uses `wallpaperApps()`, Props `WallpaperApp`)
- `src/pages/awaazpay/{privacy-policy,terms,refund-policy,how-to-delete-account}.astro` (new)
- Studio copy: `src/pages/index.astro`, `support.astro`, `refund-policy.astro`,
  `delete-account.astro`; `public/llms.txt`; `CLAUDE.md`
- `dist/` rebuilt (adds `dist/awaazpay/`)
- Not changed: studio `terms.astro`, `privacy-policy.astro`, `cookie-policy.astro`, `404.astro`
  (they iterate APPS and read correctly with AwaazPay)

Pakiza notes for row 2: the `app.slug === 'pakiza'` branch in `delete-account.astro` now sits
inside the `app.legal` branch; `pakizaAppSchema` is still exported but `index.astro` now uses
`APPS.map(appSchema)`; the home pricing strip and support FAQ build names from
`wallpaperApps()`, so they follow APPS.

Status:

- [x] Pages built and checked locally (build exit 0, 23 pages; `/awaazpay/` silo grep clean)
- [x] Owner OK to push (17 Nov 2026, ~22:25 IST), pushed to master (this commit)
- [x] AwaazPay share card (owner OK 18 Nov 2026): `public/awaazpay-og.png`, new optional AppFact `ogImage`; `Layout.astro` uses `scope.ogImage` on every page of a sub-site that has one (Arul and the studio pages keep `/og.png`)

## 2. Remove Pakiza — not started

Owner reason: one studio site should not put an Islamic and a Hindu app side by side.
When you do it, keep everything AwaazPay adds above. Remove: `PAKIZA` from `APPS`, its assets,
its imports in `media.ts`, its schema in `schema.ts`, `app.slug === 'pakiza'` branches, Pakiza
lines in `support.astro`, `delete-account.astro`, `index.astro` and `llms.txt`, and the
`/pakiza/` pages from `dist/`. The studio share card `public/og.png` (made by `scripts/generate-icons.mjs`) still reads "Pakiza · Arul" and "Wallpapers, live wallpapers and ringtones": regenerate it too. Old Pakiza URLs may still be linked from Play; decide redirects
with the owner.
