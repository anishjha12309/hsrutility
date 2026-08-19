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
 *    are all dead). The phone number was confirmed unchanged in that same pass.
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

/** Display form, and the `tel:` form, which must carry no spaces. */
export const SUPPORT_PHONE = '+91 7827100871';
export const SUPPORT_PHONE_HREF = 'tel:+917827100871';

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
}

export const PAKIZA: AppFact = {
  slug: 'pakiza',
  name: 'Pakiza',
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
 * The freemium line, worded identically wherever it appears. Stays off price and
 * billing period by design.
 *
 * Two words are load-bearing. "Sharing" is scoped to wallpapers because ringtone
 * sharing is not a gated action — it does not exist. And it says "new accounts get
 * a free trial" rather than "after a free trial", because the trial is once per
 * user: someone who subscribed before is charged straight away with no trial.
 */
export const FREEMIUM_LINE =
  'Browsing and previewing is always free. Applying wallpapers, sharing them and setting ringtones are premium, billed through UPI Autopay. New accounts get a free trial.';

export const FREEMIUM_SHORT = 'Free to browse, premium to apply.';
