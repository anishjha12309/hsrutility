/**
 * Single source of truth for studio and app facts.
 *
 * Every page, every JSON-LD block, llms.txt and the manifest read from here, so a
 * fact can only be wrong in one place.
 *
 * TWO HARD RULES:
 *
 * 1. Nothing may hard-code how many apps exist. There will be more. Use APPS,
 *    `appNames()` and `allAppsPhrase()` instead of writing "two apps" or
 *    "Pakiza and Arul" into copy — adding a third app should be an edit to this
 *    file and nothing else.
 *
 * 2. HSR Utility is the BRAND; `LEGAL_NAME` (HSR Utility Apps Private Limited) is
 *    the registered company behind it. Confirmed by the owner on 2026-08-13, after a
 *    Play review note asked for the full company name and a reachable phone number
 *    in every policy — an earlier pass had removed both as invented. The company
 *    name, postal address and phone belong on the legal pages and in the
 *    Organization JSON-LD only. Nav, hero, footer, page titles and meta stay
 *    branded "HSR Utility" — do not swap those. The legal name now contains the
 *    brand string; that does not merge the two — `LEGAL_NAME` still stays out of
 *    nav, hero, footer and titles.
 *
 *    Company name, registered address and support email were all replaced by the
 *    owner on 2026-08-19 (HSR Energy Private Limited / Bengaluru / support@hsrapps.com
 *    are all dead). The phone number was replaced on 2026-09-09 — the previous one
 *    was the owner's personal line, and users found it and rang it for app support.
 *
 * Facts here are verified against the app repos (`c:\Anish\Pakiza`,
 * `c:\Anish\Arul`). Do not add a capability you have not found in that code —
 * "saved favourites" was on this site for months and neither app has ever had it.
 */

export const SITE_URL = 'https://hsrutility.com';
export const SUPPORT_EMAIL = 'support@hsrutility.com';
export const COPYRIGHT_YEAR = 2026;

/** Registered company. Legal pages and JSON-LD only — see hard rule 2 above. */
export const LEGAL_NAME = 'HSR Utility Apps Private Limited';

/**
 * Published support phone. Display form only — there is deliberately no `tel:`
 * href and no `telephone` in the JSON-LD. The number this replaced was the owner's
 * personal line: it was harvested from both, and one-tap dialling turned every
 * policy page into a support hotline the studio has never offered. It is published
 * because Play review and the payment aggregator want a reachable number on the
 * policy pages — not because it is a channel for app questions.
 */
export const SUPPORT_PHONE = '+91 8009191175';

/** Registered address. Field names mirror schema.org PostalAddress. */
export const ADDRESS = {
  streetAddress: 'A3002, Adonia Hiranandani, Garden, South AvenuePowai, Mumbai, Mumbai',
  addressLocality: 'Mumbai',
  addressRegion: 'Maharashtra',
  postalCode: '400076',
  addressCountry: 'IN',
};

/**
 * One entry per rendered line, so pages never hand-assemble the address.
 *
 * Every line but the last carries a trailing comma. The address is one continuous
 * string broken across lines, not a list of independent items — without the comma
 * the street line's final "Mumbai" runs straight into the next line's "Mumbai" and
 * reads as "Mumbai Mumbai". Display-only: ADDRESS itself stays punctuation-free so
 * the schema.org PostalAddress fields are clean.
 */
export const ADDRESS_LINES = [
  `${ADDRESS.streetAddress},`,
  `${ADDRESS.addressLocality}, ${ADDRESS.addressRegion}, ${ADDRESS.postalCode}`,
];

/** Canonical descriptor. Reused verbatim in copy and schema — entity resolution
 *  rewards exact repetition, and it keeps the two from drifting. */
export const ORG_DESCRIPTION =
  'HSR Utility is an indie Android studio making wallpaper and ringtone apps for specific cultural audiences.';

export const abs = (path: string) => new URL(path, SITE_URL).href;

export type AppStatus = 'live' | 'coming-soon';

export interface Shot {
  /** Filename in /assets, without extension — see src/lib/media.ts */
  file: string;
  /** Short caption shown under the card. */
  caption: string;
  /** Full alt text. These graphics have text baked in, so describe it. */
  alt: string;
}

export interface AppFact {
  slug: string;
  name: string;
  /** Android applicationId. Named in the app's own legal pages, the way a Play
   *  reviewer expects a policy to identify which package it governs. */
  packageId: string;
  /** Sits under the name in nav and hero. Short. */
  tagline: string;
  /** One sentence. Used for meta description, schema, and the home card. */
  description: string;
  status: AppStatus;
  statusLabel: string;
  playUrl?: string;
  icon: string;
  iconAlt: string;
  /** Accent wash behind the app's icon and hero — drawn from the icon art. */
  hue: string;
  /** Section heading on the app's own page. Written to appeal, not to recite specs. */
  featuresHeading: string;
  features: { title: string; body: string }[];
  /** Short chips under the hero. Every one must be verifiable in the app repo. */
  chips: string[];
  shots: Shot[];
  /** The asymmetries the legal pages have to state accurately. See LegalFacts. */
  legal: LegalFacts;
}

/**
 * The handful of facts where the apps genuinely differ, pulled out so the legal
 * templates can stay app-agnostic instead of branching on `slug`.
 *
 * Every field is audited against the app repo. The apps are NOT symmetric and the
 * differences are deliberate — flattening them into one sentence is how a policy
 * ends up describing a feature the app does not have.
 */
export interface LegalFacts {
  /** What the in-app upload screen accepts. Pakiza's has two tabs, Arul's one. */
  submissions: string;
  /** What the offline reminder scheduler actually produces. */
  reminders: string;
  /** How a wallpaper gets applied — the target-sheet vs system-chooser split. */
  applyBehaviour: string;
  /** Localisations, spelled out for prose. */
  languages: string;
  /**
   * True where the app fetches a display face from Google's font CDN on first
   * launch, which discloses the device IP before sign-in. Pakiza does; Arul
   * bundles its faces and makes no such request. Disclosed because it is true
   * today — if Pakiza ever bundles too, flip this and the entry disappears.
   */
  googleFontsCdn: boolean;
  /** What the catalogue consists of, for the refund policy's free-tier line. */
  catalogue: string;
}

export const PAKIZA: AppFact = {
  slug: 'pakiza',
  name: 'Pakiza',
  packageId: 'com.hsrutility.pakiza',
  tagline: 'Where every unlock feels considered',
  description:
    'Pakiza is an Islamic lifestyle app for Android — a shorts-style feed of still and live wallpapers, a curated ringtone library, and offline Jummah and Islamic-calendar reminders.',
  status: 'coming-soon',
  statusLabel: 'Coming soon to Google Play',
  icon: 'Pakiza.png',
  iconAlt: 'Pakiza app icon — a white mosque with gold calligraphy on royal blue',
  hue: '38 78 168',
  featuresHeading: 'Everything, one scroll away.',
  chips: ['11 Indian languages', 'Light · Dark · System', 'Free to browse'],
  features: [
    {
      title: 'A feed, not a grid',
      body: 'Wallpapers arrive the way you already scroll — a vertical feed of stills and live video. See one you like, apply it in a tap.',
    },
    {
      title: 'Live wallpapers that move',
      body: 'Video wallpapers sit alongside still ones in the same feed, so there is nothing extra to find and no separate section to learn.',
    },
    {
      title: 'A curated ringtone library',
      body: 'Islamic ringtones, chosen rather than dumped. Browse, preview in place, and set the one you want.',
    },
    {
      title: 'Reminders that stay on your device',
      body: 'Jummah and Islamic-calendar reminders run fully offline. No location, no push service — nothing leaves the phone to make them work.',
    },
    {
      title: 'Reads in your language',
      body: 'Localised into eleven Indian languages, with light, dark and system theming that follows whatever your phone is already doing.',
    },
    {
      // Pakiza's upload screen has two tabs — wallpaper AND ringtone audio.
      // Arul's is wallpaper-only, and that asymmetry is deliberate in the apps.
      title: 'Send one in',
      body: 'Found something worth sharing? Submit a wallpaper or a ringtone from inside the app. Every submission is reviewed by hand before it can appear.',
    },
  ],
  legal: {
    submissions: 'a wallpaper or a ringtone',
    reminders: 'Jummah and Islamic-calendar reminders',
    applyBehaviour:
      'Still wallpapers are applied through the app; live wallpapers hand off to Android’s own wallpaper chooser, which asks you where they should go.',
    languages: 'eleven Indian languages',
    googleFontsCdn: true,
    catalogue: 'Islamic wallpapers, live video wallpapers and ringtones',
  },
  shots: [
    {
      file: 'pakiza-sacred-islamic-wallpapers',
      caption: 'Sacred wallpapers',
      alt: 'Pakiza promotional graphic: "Set Sacred Islamic Wallpapers from Medina & Medina Shareef", showing three phones displaying mosque wallpapers among gold lanterns and a crescent.',
    },
    {
      file: 'pakiza-dynamic-live-wallpapers',
      caption: 'Live wallpapers',
      alt: 'Pakiza promotional graphic for dynamic live wallpapers, showing phones playing moving video wallpapers.',
    },
    {
      file: 'pakiza-spiritual-ringtones',
      caption: 'Ringtone library',
      alt: 'Pakiza promotional graphic for its curated Islamic ringtone library, showing the browse-and-preview screen.',
    },
    {
      file: 'pakiza-language-selection',
      caption: 'Eleven languages',
      alt: 'Pakiza promotional graphic for language selection, showing the app localised into several Indian languages.',
    },
    {
      file: 'pakiza-community-content-upload',
      caption: 'Community uploads',
      alt: 'Pakiza promotional graphic for community content upload, showing the in-app wallpaper submission screen.',
    },
  ],
};

export const ARUL: AppFact = {
  slug: 'arul',
  name: 'Arul',
  packageId: 'com.hsrutility.arul',
  tagline: 'Six collections, endlessly scrollable',
  description:
    'Arul is an Android app for South Indian devotional wallpapers — a shorts-style feed of still and live wallpapers across six collections, plus ringtones and a place to send in your own.',
  status: 'live',
  statusLabel: 'Live on Google Play',
  playUrl: 'https://play.google.com/store/apps/details?id=com.hsrutility.arul',
  icon: 'arul.png',
  iconAlt: 'Arul app icon — a gold gopuram temple tower on deep crimson',
  hue: '158 26 40',
  featuresHeading: 'Built around the feed.',
  chips: ['Six collections', '6 Indian languages', 'Free to browse'],
  features: [
    {
      title: 'A feed, not a grid',
      body: 'A vertical feed of South Indian devotional wallpapers — stills and live video together. Scroll, stop, apply.',
    },
    {
      title: 'Six collections',
      body: 'Amman, Ayyappan, Murugan, Perumal, Sivan and Temples. When you know what you came for, skip the feed and go straight to it.',
    },
    {
      // Still wallpapers use the app's own target sheet; LIVE wallpapers hand off
      // to Android's chooser, which decides the target itself. Do not flatten this.
      title: 'Home screen, lock screen, or both',
      body: 'Pick where a still wallpaper lands before you apply it. Live wallpapers hand off to Android’s own chooser, which asks you there.',
    },
    {
      title: 'Ringtones alongside',
      body: 'The same library approach as the wallpapers: browse, preview, set. No hunting through file managers.',
    },
    {
      title: 'Send one in',
      body: 'Have a wallpaper worth sharing? Submit it from inside the app. Every submission is reviewed by hand before it can appear.',
    },
    {
      title: 'Reminders that stay on your device',
      body: 'Weekly and festival reminders run fully offline. No location, no push service — nothing leaves the phone to make them work.',
    },
    {
      title: 'Reads in your language',
      body: 'Localised into six Indian languages, so the app speaks the language the art belongs to.',
    },
  ],
  legal: {
    submissions: 'a wallpaper',
    reminders: 'weekly and festival reminders',
    applyBehaviour:
      'Still wallpapers let you pick home screen, lock screen or both before you apply; live wallpapers hand off to Android’s own wallpaper chooser, which asks you there.',
    languages: 'six Indian languages',
    googleFontsCdn: false,
    catalogue: 'South Indian devotional wallpapers, live video wallpapers and ringtones',
  },
  shots: [
    {
      file: 'arul-sacred-wallpaper-collections',
      caption: 'Six collections',
      alt: 'Arul promotional graphic: "Six sacred collections — Amman, Ayyappan, Murugan, Perumal, Sivan, Temples", showing two phones browsing devotional wallpapers with the apply-wallpaper sheet open.',
    },
    {
      file: 'arul-full-hd-live-wallpapers',
      caption: 'Full HD live wallpapers',
      alt: 'Arul promotional graphic for full HD live wallpapers, showing phones playing high-definition moving wallpapers.',
    },
    {
      file: 'arul-devotional-live-wallpapers',
      caption: 'Devotional live wallpapers',
      alt: 'Arul promotional graphic for devotional live wallpapers, showing animated deity wallpapers on phone screens.',
    },
    {
      file: 'arul-temple-night-wallpapers',
      caption: 'Temple wallpapers',
      alt: 'Arul promotional graphic for temple wallpapers, showing illuminated South Indian temple imagery on phone screens.',
    },
    {
      file: 'arul-wallpaper-preview-and-apply',
      caption: 'Preview, then apply',
      alt: 'Arul promotional graphic for wallpaper preview and apply, showing the sheet that lets you choose home screen, lock screen or both.',
    },
    {
      file: 'arul-sacred-ringtones',
      caption: 'Ringtone library',
      alt: 'Arul promotional graphic for its devotional ringtone library, showing the browse-and-preview screen.',
    },
    {
      file: 'arul-language-and-community-uploads',
      caption: 'Languages & uploads',
      alt: 'Arul promotional graphic for language selection and community uploads, showing localisation options and the wallpaper submission screen.',
    },
  ],
};

export const APPS: AppFact[] = [PAKIZA, ARUL];

/* ── Copy helpers ─────────────────────────────────────────────────────────────
   Everything that would otherwise bake the app count into a sentence. */

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];

/** "one" / "two" / "three" … falls back to digits past seven. */
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** "Pakiza and Arul" · with three: "Pakiza, Arul, and Sahil". */
export const appNames = (apps: AppFact[] = APPS) =>
  new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(apps.map((a) => a.name));

/** "Both apps" while there are exactly two; "All our apps" once there are more. */
export const allAppsPhrase = (apps: AppFact[] = APPS) =>
  apps.length === 2 ? 'Both apps' : 'All our apps';

/** Lowercase form for mid-sentence use. */
export const allAppsPhraseLower = (apps: AppFact[] = APPS) =>
  apps.length === 2 ? 'both apps' : 'all our apps';

/** "our Android apps Pakiza and Arul" — for the legal pages' defined term. */
export const appsLegalPhrase = (apps: AppFact[] = APPS) =>
  `our Android ${apps.length === 1 ? 'application' : 'applications'} ${appNames(apps)}`;

export const liveApps = () => APPS.filter((a) => a.status === 'live');
export const upcomingApps = () => APPS.filter((a) => a.status === 'coming-soon');

/**
/* ── Billing ──────────────────────────────────────────────────────────────────
   Verified against BOTH app repos, 2026-08-20. Do not restate these numbers in a
   page — every one of them is wrong somewhere the moment it exists twice.

   The subscription is a PhonePe UPI Autopay mandate: `maxAmount: 19900` in
   `workers/src/lib/phonepe.ts` in each repo, and `TRIAL_DAYS = 1` in
   `workers/src/routes/payments.ts`. A first-time subscriber goes through a ₹2
   PENNY_DROP that the bank auto-reverses; someone who has already used their one
   trial is charged the full amount as a TRANSACTION instead, with no trial.

   Pakiza's `db/seed.sql` carried ₹49/₹499 until 2026-08-20 — stale values that
   never matched the Worker's real debit, and that nothing in the app read (its
   own fallback was already ₹199). Corrected in the repo, not worked around here. */

export const MONTHLY_PRICE = '₹199';
export const TRIAL_DAYS = 1;

/** The mandate-setup debit. Named on every page that mentions the trial: the user
 *  SEES ₹2 leave the account on a screen that said "free", and an unexplained
 *  debit reads as a scam however well the rest of the page is written. */
export const MANDATE_VERIFY_AMOUNT = '₹2';

export const PAYMENT_PROVIDER = 'PhonePe';

/**
 * The freemium line, worded identically wherever it appears.
 *
 * Two words are load-bearing. "Sharing" is scoped to wallpapers because ringtone
 * sharing is not a gated action — it does not exist. And it says "new accounts get
 * a free trial" rather than "after a free trial", because the trial is once per
 * user: someone who subscribed before is charged straight away with no trial.
 */
export const FREEMIUM_LINE =
  `Browsing and previewing is always free. Applying wallpapers, sharing them and setting ringtones are premium — ${MONTHLY_PRICE} a month, billed through UPI Autopay. New accounts get a free trial; setting up the mandate takes a ${MANDATE_VERIFY_AMOUNT} verification debit that is reversed automatically.`;

export const FREEMIUM_SHORT = 'Free to browse, premium to apply.';

/* ── Per-app legal pages ──────────────────────────────────────────────────────
   Each app is a self-contained sub-site: /<slug> plus the five documents below.

   The apps DO NOT link to one another. Pakiza serves an Islamic audience and Arul
   a Hindu one, and a page that puts the two one click apart invites a reading
   neither app is asking for. The studio home is the single page where both names
   appear — everything under /<slug> carries that app's chrome, that app's legal
   links and nothing else. `Layout`'s `scope` prop is what enforces it.

   Order is deliberate: it is the order the footer and the related-links row render
   in, and privacy leads because it is the one a Play reviewer opens first. */

export interface LegalDoc {
  /** Path segment under /<app-slug>/. Matches the slugs the Play Console fields
   *  and store listings point at — spell them out, never abbreviate. */
  slug: string;
  label: string;
  /** Used in <title> and the related-links row. */
  short: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  { slug: 'privacy-policy', label: 'Privacy Policy', short: 'Privacy' },
  { slug: 'terms', label: 'Terms & Conditions', short: 'Terms' },
  { slug: 'refund-policy', label: 'Refund Policy', short: 'Refunds' },
  { slug: 'how-to-delete-account', label: 'How to Delete Your Account', short: 'Delete account' },
];

/** Trailing slash on purpose. Astro serves these as directories and 308s the
 *  slash-less form — an in-app WebView that follows the redirect shows the user a
 *  URL that is not the one the app asked for, and `curl` without `-L` finds
 *  nothing at all. Every reference to these paths goes through this helper. */
export const legalPath = (app: AppFact, doc: LegalDoc | string) =>
  `/${app.slug}/${typeof doc === 'string' ? doc : doc.slug}/`;

/** The related-links row at the foot of one legal page: its siblings, never itself. */
export const legalSiblings = (app: AppFact, current: string) =>
  LEGAL_DOCS.filter((d) => d.slug !== current).map((d) => ({
    label: d.label,
    href: legalPath(app, d),
  }));
