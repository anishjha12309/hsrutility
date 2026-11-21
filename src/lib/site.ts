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
 * Daily Passbook's copy comes ONLY from its Play listing (`~/AlertPaisa/docs/play-store/
 * 03-listing-text.md`, the full description), which lists exactly what the release
 * build shows, and its legal pages from `~/AlertPaisa/web/src/pages/*.tsx`.
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
  'HSR Utility is an indie Android studio making wallpaper, ringtone and money-management apps for specific audiences.';

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
  /** Eyebrow on the app's landing page, after "HSR Utility — ". */
  category: string;
  /** schema.org applicationCategory for the app's JSON-LD. */
  applicationCategory: string;
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
  /** The closing slab on the app's landing page: how the app is paid for. */
  pricing: { heading: string; body: string };
  /** Where the in-app delete button lives, for the studio pages' per-app lines. */
  deletePath: string;
  /** Where the in-app cancel route lives. */
  cancelPath: string;
  /**
   * The app's own 1200x630 share card in public/, used by every page under /<slug>/.
   * Without it those pages share the studio card (/og.png).
   */
  ogImage?: string;
  /**
   * Only the wallpaper apps have this: it feeds the shared legal templates in
   * src/pages/[app]/. An app without it (Daily Passbook, a money app) writes its own
   * legal pages under src/pages/<slug>/. Use `wallpaperApps()` to iterate the
   * apps that have it.
   */
  legal?: LegalFacts;
}

/** An app that renders through the shared wallpaper legal templates. */
export type WallpaperApp = AppFact & { legal: LegalFacts };

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
  /** What the offline reminder scheduler actually produces. Absent where the app has none. */
  reminders?: string;
  /** True where the invite-and-reward scheme exists. Arul retired its scheme. */
  referrals: boolean;
  /**
   * Privacy-policy items only this app has, audited against the app repo. The
   * policy template appends them, so an app without them reads exactly as before.
   */
  privacy?: {
    /** Month the policy text last changed, when later than the shared template's. */
    updated: string;
    collected: { title: string; body: string }[];
    /** Replaces the reminder-based "Not collected" line. */
    notCollected: string;
    /** Extra clause for the "Internet" permission row. */
    loads: string;
    /** Lead-in to the permission list, where one is asked without a user action. */
    permissionsIntro: string;
    /** Why the pre-Android-10 storage permission exists. */
    media: string;
    /** Why the notification permission is asked, and when. */
    notifications: string;
    /** Why the app runs at startup. */
    startup: string;
    permissions: [string, string][];
    thirdParties: { name: string; purpose: string; url: string }[];
    /** What PostHog measures in this app. */
    posthog: string;
    uses: string[];
  };
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
   own fallback was already ₹199). Corrected in the repo, not worked around here.

   Daily Passbook (added 17 Nov 2026) bills the same way at the same numbers: a ₹2
   one-day trial by UPI AutoPay that is reversed, then ₹199 a month on a PhonePe
   mandate capped at ₹199 (its terms.tsx and refund.tsx). If it ever diverges, give
   it its own constants rather than editing these. */

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

export const ARUL: AppFact = {
  slug: 'arul',
  name: 'Arul',
  category: 'South Indian wallpapers',
  applicationCategory: 'LifestyleApplication',
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
  pricing: { heading: 'Free to browse, premium to apply', body: FREEMIUM_LINE },
  deletePath: 'Settings → Delete account',
  cancelPath: 'Settings → your plan → Cancel',
  legal: {
    submissions: 'a wallpaper',
    referrals: false,
    // Audited against the Arul repo on 2026-11-18: merged manifest, the Worker's
    // rashifal, geo and push routes, and the analytics docs.
    privacy: {
      updated: 'November 2026',
      collected: [
        {
          title: 'Rashifal birth details',
          body: 'If you use Rashifal: the birth date, birth time (optional) and birth place you enter, the time zone of that place, and the moon sign worked out from them. They are used only to show your daily rashifal, never appear in analytics, and are deleted with your account.',
        },
        {
          title: 'Notifications',
          body: 'A push-notification token and an app-installation ID from Firebase Cloud Messaging, linked to your account, so we can send you devotional updates and offers. You can switch notifications off in Android settings at any time.',
        },
        {
          title: 'Approximate region',
          body: 'Your country and state, worked out from your IP address when the app first opens. It picks the artwork you see first and is read in aggregate analytics. Never your city, coordinates or postcode.',
        },
      ],
      notCollected:
        'No precise location — the app never requests the location permission. No phone number, no contacts. Jaap counts are not stored on our servers.',
      loads: 'Loading wallpapers, ringtones, status clips, jaap chants, your rashifal and your account.',
      permissionsIntro:
        'Notifications are asked once, after you first sign in. Every other permission is requested when you choose an action that needs it. None is asked at launch:',
      media:
        'Registering a ringtone you set, saving a status clip to your gallery, and picking a file when you submit a wallpaper. Unused on Android 10 and newer.',
      notifications:
        'Devotional updates and offers we send, the Quick Access shortcut bar, and the playback control while a jaap chant plays. Asked once, after you first sign in, never at launch.',
      startup: 'Putting the Quick Access shortcut bar back after a restart.',
      permissions: [
        [
          'Foreground service (media playback)',
          'Keeping a jaap chant you started playing, with its notification control, after you leave the app. It stops when the chant stops.',
        ],
      ],
      thirdParties: [
        {
          name: 'Google Firebase — Cloud Messaging',
          purpose: 'Delivering push notifications.',
          url: 'https://firebase.google.com/support/privacy',
        },
      ],
      posthog: 'Product analytics for sign-in, the free trial and the main features.',
      uses: [
        'Showing your daily rashifal from the birth details you give.',
        'Sending notifications about new content and offers.',
      ],
    },
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


export const DAILYPASSBOOK: AppFact = {
  slug: 'dailypassbook',
  name: 'Daily Passbook',
  category: 'Money management',
  applicationCategory: 'FinanceApplication',
  packageId: 'app.awaazpay.android',
  // Every word below comes from the Play listing's full description. It is
  // SMS-based money management: never call it an "SMS reader", "SMS alerts" or
  // "text to voice" (Play's SMS policy). The release build hides the widget,
  // summaries, categories, backup and Alert Reliability — do not mention them.
  tagline: 'Your money, tracked without typing',
  description:
    'Daily Passbook is an Android app that builds a passbook of your bank debits and credits from the transaction messages on your phone, tracks your UPI autopays and EMIs, and reminds you before each one is due.',
  status: 'live',
  statusLabel: 'Live on Google Play',
  playUrl: 'https://play.google.com/store/apps/details?id=app.awaazpay.android',
  icon: 'dailypassbook.png',
  iconAlt:
    'Daily Passbook app icon — a white chat bubble with a cyan rupee sign, sound waves and a calendar check, on navy',
  hue: '38 198 218',
  featuresHeading: 'Every payment, accounted for.',
  chips: ['10 languages', 'No ads', 'History stays on your phone'],
  features: [
    {
      title: 'One passbook',
      body: 'Every debit and credit from your bank messages, grouped by account, with search and dates. Nothing to type in.',
    },
    {
      title: 'Autopays and EMIs',
      body: 'Your UPI autopay mandates, EMIs and subscriptions in one place, each with its due date.',
    },
    {
      title: 'Reminders before every due date',
      body: 'Alerts before autopay, EMI and bill due dates, including the reminder messages your bank sends — so a payment never surprises you.',
    },
    {
      title: 'Hear every debit and credit',
      body: 'Each debit or credit is announced as it happens, in your chosen voice language. It works even when your phone is on Do Not Disturb, and you can turn it off.',
    },
    {
      title: 'Export your passbook',
      body: 'Share your passbook as a PDF or a CSV file whenever you need it.',
    },
    {
      title: 'Refer & Earn',
      body: 'Invite friends and get 30 days of premium free for each friend who subscribes.',
    },
    {
      title: 'Ten languages',
      body: 'English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam and Punjabi.',
    },
    {
      title: 'Your history stays on your phone',
      body: 'Reading, parsing and your payment history stay on your phone, and the app has no ads. Personal messages are ignored, and one-time passcode messages are never sent.',
    },
  ],
  pricing: {
    heading: 'A plan, from day one',
    body: `A plan is required to use the app, and you sign in with Truecaller or your phone number. Start with a ${TRIAL_DAYS}-day trial for ${MANDATE_VERIFY_AMOUNT} — the ${MANDATE_VERIFY_AMOUNT} is refunded — then ${MONTHLY_PRICE} a month by UPI AutoPay through ${PAYMENT_PROVIDER}. Cancel any time in the app.`,
  },
  deletePath: 'Settings → Need Help → Delete Account',
  cancelPath: 'Settings → Premium → Cancel Plan',
  ogImage: '/dailypassbook-og.png',
  shots: [
    {
      file: 'dailypassbook-passbook',
      caption: 'One passbook',
      alt: 'Daily Passbook screenshot: "A passbook that fills itself — Every debit and credit from your bank messages, by account", showing the Passbook screen with total credits and debits, account cards and a list of transactions.',
    },
    {
      file: 'dailypassbook-autopays',
      caption: 'All your autopays',
      alt: 'Daily Passbook screenshot: "All your AutoPays in one place — UPI mandates and subscriptions with due dates", showing the Your Autopays screen with voice settings, a monthly total, an upcoming-payments banner and each autopay with its due date.',
    },
    {
      file: 'dailypassbook-transaction',
      caption: 'Full details',
      alt: 'Daily Passbook screenshot: "Every detail, one tap away — Amount, reference and date for each payment", showing a Transaction Details dialog over the passbook.',
    },
    {
      file: 'dailypassbook-upcoming',
      caption: 'Reminders before dues',
      alt: 'Daily Passbook screenshot: "Reminded before every due date — No AutoPay, EMI or bill catches you off guard", showing the Upcoming Payments screen with a total, due dates, days left, and Dismiss and Mark Paid buttons.',
    },
    {
      file: 'dailypassbook-voice',
      caption: 'Spoken alerts',
      alt: 'Daily Passbook screenshot: "Hear your money move — Each debit and credit spoken in your language", showing the Voice settings sheet with switches for credit, debit and upcoming-payment announcements and a voice language picker.',
    },
    {
      file: 'dailypassbook-languages',
      caption: '10 languages',
      alt: 'Daily Passbook screenshot: "In your own language — The app and its voice in 10 Indian languages", showing the Select Language sheet with English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam and Punjabi.',
    },
  ],
};

export const APPS: AppFact[] = [ARUL, DAILYPASSBOOK];

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

/** The apps that render through the shared wallpaper legal templates in src/pages/[app]/. */
export const wallpaperApps = (): WallpaperApp[] =>
  APPS.filter((a): a is WallpaperApp => a.legal !== undefined);

/** The apps that do not — each writes its own legal pages under src/pages/<slug>/. */
export const otherApps = () => APPS.filter((a) => a.legal === undefined);

/** "Pakiza or Arul" · with three: "Pakiza, Arul, or Daily Passbook". */
export const appNamesOr = (apps: AppFact[] = APPS) =>
  new Intl.ListFormat('en', { style: 'long', type: 'disjunction' }).format(apps.map((a) => a.name));

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
