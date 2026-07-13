/**
 * Shared JSON-LD (schema.org) builders.
 *
 * Everything is wired into one entity graph via @id references so Google and
 * AI answer engines resolve "HSR Utility" and "Pakiza" as consistent entities:
 *
 *   Organization (#organization)
 *     ^-- publisher -- WebSite (#website)
 *     ^-- publisher -- MobileApplication (Pakiza)
 *     ^-- about ------ WebPage (per page)
 *
 * Deliberate omissions (do NOT "fix" these without real data):
 *   - Organization.sameAs   — no social profiles exist yet; fabricating them is worse than nothing.
 *   - MobileApplication.offers / .aggregateRating / .review — Pakiza is not on Google Play yet.
 *     These are the properties Google requires for a software rich result, but inventing
 *     a rating to force eligibility violates Google's structured-data policy and risks a
 *     manual action. Add them at launch, with real Play Store numbers, and nothing sooner.
 */

export const SITE_URL = 'https://hsrutility.com';

/** Canonical one-line descriptors. Reuse these verbatim everywhere (site copy, schema,
 *  and eventually the Play Store listing) — entity resolution rewards exact repetition. */
export const ORG_DESCRIPTION =
  'HSR Utility builds thoughtfully designed mobile apps for the Muslim community.';
export const APP_DESCRIPTION =
  'Pakiza is an Android app offering HD Islamic wallpapers, status images, and ringtones & nasheeds — free to use, built for the Muslim community.';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site-relative path. */
export const abs = (path: string) => new URL(path, SITE_URL).href;

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'HSR Utility',
  url: `${SITE_URL}/`,
  logo: abs('/icon-512.png'),
  email: 'support@hsrutility.com',
  foundingDate: '2026',
  description: ORG_DESCRIPTION,
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${SITE_URL}/`,
  name: 'HSR Utility',
  description: ORG_DESCRIPTION,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
};

/**
 * Pakiza as an entity, not a rich-result play.
 * This will not light up in the Rich Results Test — that's expected and correct:
 * software rich results require offers + aggregateRating, which we don't have honestly.
 * The value here is giving crawlers and AI engines a clean, unambiguous "what is Pakiza".
 */
export const pakizaAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'Pakiza',
  url: `${SITE_URL}/#apps`,
  description: APP_DESCRIPTION,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'ANDROID',
  softwareVersion: 'Unreleased',
  publisher: { '@id': ORG_ID },
  author: { '@id': ORG_ID },
};

type Crumb = { name: string; path?: string };

/** Breadcrumbs. Google's guidance: the last item may omit `item` (it's the current page). */
export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    ...(crumb.path ? { item: abs(crumb.path) } : {}),
  })),
});

export const webPageSchema = (opts: {
  path: string;
  name: string;
  description: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${abs(opts.path)}#webpage`,
  url: abs(opts.path),
  name: opts.name,
  description: opts.description,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en',
});

/**
 * FAQPage — built from the SAME array that renders the visible FAQ, so the markup can
 * never drift from the on-page text (Google's structured-data policy forbids mismatches,
 * and that rule outlived the rich result itself).
 *
 * Reality check: Google retired FAQ rich results on 2026-05-07. This produces NO SERP
 * visual. It is kept purely because AI answer engines still parse it for grounding.
 */
export const faqPageSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
});
