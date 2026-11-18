/**
 * Shared JSON-LD (schema.org) builders.
 *
 * Everything is wired into one entity graph via @id references so search engines
 * and AI answer engines resolve "HSR Utility", "Pakiza" and "Arul" consistently:
 *
 *   Organization (#organization)
 *     ^-- publisher -- WebSite (#website)
 *     ^-- publisher -- MobileApplication (Pakiza)
 *     ^-- publisher -- MobileApplication (Arul)
 *     ^-- publisher -- MobileApplication (AlertPaisa, FinanceApplication)
 *     ^-- about ------ WebPage (per page)
 *
 * Organization carries legalName and address: HSR Utility Apps Private Limited
 * is the registered company behind the HSR Utility brand (owner-confirmed
 * 2026-08-13; name, address and email replaced 2026-08-19). `name` stays the brand
 * — that is what users search for — and legalName carries the registration, which
 * is exactly how schema.org splits them.
 *
 * Deliberate omissions (do NOT "fix" these without real data):
 *   - Organization.telephone — removed 2026-09-09. It is the field lead-gen
 *     scrapers harvest and it put a one-tap Call button in Google's knowledge
 *     panel, which is how a personal number became a support hotline. The number
 *     still appears on the policy pages, which is where compliance wants it.
 *   - Organization.sameAs — no social profiles exist yet.
 *   - aggregateRating / review — only with real Play Store numbers. Inventing one to
 *     force a rich result violates Google's structured-data policy.
 */

import {
  SITE_URL,
  SUPPORT_EMAIL,
  LEGAL_NAME,
  ADDRESS,
  ORG_DESCRIPTION,
  abs,
  ARUL,
  ALERTPAISA,
  type AppFact,
} from './site';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export { SITE_URL, ORG_DESCRIPTION, abs };

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'HSR Utility',
  legalName: LEGAL_NAME,
  url: `${SITE_URL}/`,
  logo: abs('/icon-512.png'),
  email: SUPPORT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    ...ADDRESS,
  },
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
 * An app as an entity, not a rich-result play. These will not light up in the Rich
 * Results Test — that needs offers + aggregateRating, which we only add with honest
 * Play Store numbers. The value is an unambiguous "what is Pakiza" / "what is Arul".
 *
 * `offers` is safe to state: every app is free to download, and that is a fact
 * independent of the premium tier or plan inside it. `applicationCategory` comes
 * from the app's own fact: Lifestyle for the wallpaper apps, Finance for AlertPaisa.
 */
export const appSchema = (app: AppFact) => ({
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  '@id': `${abs(`/${app.slug}`)}#app`,
  name: app.name,
  url: abs(`/${app.slug}`),
  description: app.description,
  applicationCategory: app.applicationCategory,
  operatingSystem: 'ANDROID',
  publisher: { '@id': ORG_ID },
  author: { '@id': ORG_ID },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  ...(app.playUrl ? { installUrl: app.playUrl, downloadUrl: app.playUrl } : {}),
});

export const arulAppSchema = appSchema(ARUL);
export const alertpaisaAppSchema = appSchema(ALERTPAISA);

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

export const webPageSchema = (opts: { path: string; name: string; description: string }) => ({
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
 * FAQPage — built from the SAME array that renders the visible FAQ, so the markup
 * cannot drift from the on-page text (Google's structured-data policy forbids
 * mismatches, and that rule outlived the rich result itself).
 *
 * Reality check: Google retired FAQ rich results on 2026-05-07. This produces no
 * SERP visual. It is kept because AI answer engines still parse it for grounding.
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
