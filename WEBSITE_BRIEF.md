# HSR Utility — website rebuild brief

Rebuild hsrutility.com from scratch in this repo, replacing the current Astro 4 site. The old
site's visual shell is disposable; its legal/compliance copy is not (see "Content to port").
This file is the complete spec. Where it is silent, use your judgment — favor performance and
restraint over decoration.

## The studio (facts — do not invent beyond these)

- **HSR Utility** is an indie Android studio. Secular studio identity: the studio itself has no
  religious affiliation; it ships apps for specific cultural audiences.
- Domain: `https://hsrutility.com` · Support: `support@hsrutility.com` · © 2026 HSR Utility.
  No legal entity name exists — never invent one (no "Pvt Ltd", no address).
- Two Android apps (Flutter). Deeper facts, if ever needed: `c:\Anish\Pakiza\README.md` and
  `c:\Anish\Arul\README.md`.

### Pakiza — Islamic lifestyle app · **Coming soon to Google Play** (no Play link yet)
- Shorts-style vertical feed of wallpapers: static images + live (video) wallpapers, one-tap apply.
- Curated Islamic ringtone library (browse, preview, set).
- Localized into 11 Indian languages. Light/dark/system theming.
- Offline Jummah + Islamic-calendar reminders (fully local — no location, no push).
- Browsing and previews are always free; applying wallpapers, setting ringtones, and sharing are
  premium via UPI Autopay (one free trial per user, ₹199 thereafter). Don't state a billing
  period — the site should say "free to browse, premium to apply" and stay vague on pricing.
- Icon: `assets/Pakiza.png` — white mosque + gold calligraphy on royal blue.

### Arul — South Indian wallpapers · **Live on Google Play**
- Play link: `https://play.google.com/store/apps/details?id=com.hsrutility.arul`
- Shorts-style wallpaper feed (static + live video), category browse, ringtones,
  upload-your-own-wallpaper submissions.
- Same freemium model as Pakiza (free browse/preview, premium apply/set via UPI Autopay).
- Icon: `assets/arul.png` — gold gopuram (temple tower) on deep crimson.

## Content to port (before deleting old pages)

`src/pages/privacy.astro`, `terms.astro`, `delete-account.astro`, and `support.astro` contain
recently-reviewed, factually-correct copy (Play Store compliance: combined privacy policy for
both apps, ToS, account-deletion flow that leads with in-app instant deletion and email as
fallback). Port this copy faithfully into the new design — reword only for flow, never change
what it promises or claims. The homepage copy may be rewritten freely.

## Stack

- **Astro 5** (static output) + **Tailwind CSS 4** + **Lenis** (smooth scroll) + **GSAP**
  (ScrollTrigger for reveals). No React/Vue — islands of vanilla TS where interactivity is needed.
- Zero-JS by default; every script must earn its bytes. Lenis + GSAP load deferred.
- Self-hosted, subset woff2 fonts only — no external requests of any kind (fonts, CDNs, analytics).
  The site currently has no analytics/cookies; keep it that way (this also keeps the privacy
  policy true).
- Keep the current repo's SEO plumbing approach: sitemap, robots.txt, llms.txt, webmanifest,
  canonical/OG tags, JSON-LD structured data, per-page titles/descriptions.

## Design direction

Reference: **lovart.ai** (screenshots in `design-reference/lovart/`, tokens below). Take its
*confidence* — editorial serif display type, warm near-black, generous space, pill geometry —
not its identity. Do not copy its lime accent, its layout verbatim, or its illustration style.

| File | Shows |
|---|---|
| `desktop-01-hero.png` | Hero: eyebrow → serif headline with underlined typewriter slots → pill CTA; lime announcement bar |
| `desktop-02-product-demo.png` | Product demo in large rounded card on painterly background |
| `desktop-03-section.png` | Floating pill navbar; section pattern: mono eyebrow / huge serif H2 / muted subtitle |
| `desktop-04-feature-cards.png` | Alternating feature rows: media collage with scattered floating elements + canvas-style "Image 960×720" annotations |
| `desktop-05-section.png` | Text-edit feature demo, masonry reference cards |
| `desktop-06-section.png` | Further section rhythm |
| `desktop-07-footer.png` | Footer: mono column headers, sparse links, theme pill (Auto/moon/sun) + language pill; big rounded CTA band with wireframe globe |
| `mobile-01-hero.png` | Mobile hero, stacked; full-width pill CTA |
| `mobile-02-menu-open.png` | Full-screen mobile menu: oversized links, chevron submenu, theme pill, X close |

### Measured lovart.ai tokens (reference data, not our palette)

- Background `#100F09` (warm near-black) · text `#F5F4EF` (warm cream) · muted `#C9C8C5`
- Accent (theirs): lime `#E1FF67` — **do not reuse**
- Display serif: custom ("featureDisplay"), fallback Georgia — H2 56/70, H1 48/52.8, H3 36/46.8,
  weight 400, slight positive letter-spacing on H1
- Body/UI sans 16–18px; eyebrows are letter-spaced uppercase mono, split into per-character
  spans for staggered reveal
- Buttons: pill (radius 999px), cream bg, dark text · nav pill height 56px, sticky
- Section padding-bottom ≈160px · content max-widths 1360–1600px
- Transitions: 0.5s cubic-bezier(0.4,…) for large moves, 0.15–0.2s for hovers

### HSR Utility palette (starting point — refine, keep WCAG AA)

Dark (default): bg `#0F0E0B`, surface `#17150F`, text `#F5F3EC`, muted `#A8A49A`,
accent gold `#C9A84C` (existing brand gold — bridges both app icons' gold; use sparingly:
links, eyebrows, focus rings, small accents — not large fills).
Light: bg `#F7F5EF` (paper cream), text `#14130E`, same gold tuned for contrast.

Type: an editorial display serif for headlines (e.g. Fraunces or Instrument Serif), a clean
sans for body/UI (e.g. Inter), a mono for eyebrows/labels (e.g. IBM Plex Mono). Final choice
yours — must be self-hostable, subset, with `font-display: swap` and the display face preloaded.

**Theme model:** dark-first with an Auto/Dark/Light pill toggle (footer + mobile menu, like
lovart's). Inline no-flash script (localStorage + `prefers-color-scheme`) before first paint.

## Pages

| Route | Content |
|---|---|
| `/` | Hero (studio positioning), both apps as feature sections (icon, name, one-liner, feature list, CTA: Play link for Arul / "Coming soon" for Pakiza), studio values strip, footer CTA band |
| `/pakiza` | App page: hero with icon, feature sections from the facts above, screenshots placeholder slots, "Coming soon" CTA, links to privacy/terms/delete-account |
| `/arul` | Same shape, with real Play Store CTA |
| `/support` | Ported support content |
| `/privacy`, `/terms`, `/delete-account` | Ported legal content, new shell |
| `404` | On-brand, link home |

## Micro-interactions (the small details are the assignment)

Everything gated behind `prefers-reduced-motion: reduce` → instant/opacity-only fallbacks.

- **Smooth scroll:** Lenis on desktop pointer devices; native scroll on touch. Anchor links ease
  via Lenis. No scroll-jacking — speed close to native.
- **Page transitions:** Astro View Transitions — quick fade/slide (~200–300ms), no spinner, no
  layout shift. Back/forward feels instant.
- **Navbar:** floating pill bar that condenses (padding/blur) after scrolling past the hero;
  active-page indication; "Apps" dropdown on desktop — chevron rotates 180°, panel scales/fades
  from origin with 2-item stagger, closes on outside-click and Esc, fully keyboard-navigable.
- **Hamburger (mobile):** icon morphs to X; full-screen overlay like `mobile-02-menu-open.png` —
  oversized staggered links (~40ms apart), submenu expands with chevron, theme pill at bottom;
  body scroll locked; Esc/overlay-tap closes; focus trapped while open.
- **Hero:** split-text reveal on the display headline (word- or char-stagger, once), eyebrow
  tracks in, CTA rises with slight delay. Runs on load, fast (<900ms total).
- **Scroll reveals:** sections fade/rise once (`once: true`), media cards get subtle parallax
  (a few %, not carnival), app icons float gently.
- **Hover (desktop):** buttons — slight scale + arrow nudge; cards — 1–2° tilt or lift + shadow;
  links — underline slide; app icons — gentle rotate/scale. All 0.15–0.2s.
- **Press (mobile):** visible active states — scale-down ~0.97 on buttons/cards; tap targets ≥44px.
- **Theme toggle:** pill slides between Auto/moon/sun with a spring-ish ease; theme crossfades
  (~250ms) rather than snapping.
- **Focus:** visible `:focus-visible` rings (gold) on every interactive element — never removed.

## Performance — hard acceptance criteria

Lighthouse **≥90 in all four categories** (Performance, Accessibility, Best Practices, SEO),
**mobile and desktop**, measured against the built site (`npm run build` + `npm run preview`,
or serve `dist/`). Iterate with `npx lighthouse` CLI (or the Chrome DevTools MCP
`lighthouse_audit` tool) until every page passes — home, one app page, and one legal page at
minimum. While iterating, fix causes, not scores.

Practical targets that get you there: LCP < 2.5s mobile-throttled; CLS ≈ 0 (explicit dimensions
on all media, no font-swap layout shift); JS kept to Lenis + GSAP + a few small islands; images
through `astro:assets` (AVIF/WebP, responsive srcset, lazy below the fold); inline critical CSS
(current config inlines stylesheets — keep the technique if it still wins).

## Logo integration

The final logo (minimal geometric mark, no letters — being generated separately from the prompt
in the appendix) will land as SVG. Wire it as: `public/favicon.svg`, `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`, navbar mark + wordmark ("HSR Utility" set in the display
face next to the mark), and the OG image. Until the real files arrive, build a clean placeholder
mark to the same spec (rounded-hex outline with negative-space circle, gold on near-black) so
every slot is wired and swapping is a file replacement, not a refactor.

## Scope

Deliver this site at this scope. Make routine judgment calls yourself; check in only when
different readings of this brief would produce materially different sites. Don't add pages,
blog scaffolding, CMS hooks, or analytics that weren't asked for. Leave final human QA
(real-device testing, Play listing links) to Anish.

---

## Appendix — logo generation prompt (for an image tool, not for the site build)

**Primary prompt:**

> Minimalist abstract logo mark for a software studio, a single bold geometric form: a rounded
> hexagon outline with a perfect circle cut out of its center as negative space, slightly
> off-axis for character. Flat vector style, solid warm gold (#C9A84C) mark on a deep warm black
> (#0F0E0B) background, centered with generous margins, crisp edges, perfectly balanced weight.
> No letters, no text, no typography, no gradients, no 3D, no shadows, no photorealism. The mark
> must stay recognizable at 16 pixels. Presented as a clean app-icon tile, top-tier brand
> identity quality, in the spirit of marks by Pentagram or the Linear/Vercel school of geometric
> logo design.

**Variations to try (swap into the "single bold geometric form" clause):**
1. "three rounded bars of increasing width stacked into an upward-pointing chevron"
2. "two interlocking rounded squares forming a pinwheel of negative space"
3. "a circle orbited by a single small dot, connected by a short arc"

**Negative prompt (tools that support one):** letters, text, typography, monogram, gradient,
3D, bevel, photo, mockup, watermark, fine detail.

Ask for SVG or highest-resolution PNG on transparent + on-dark; test every candidate at 16×16
before committing.
