/**
 * Fencing against Cloudflare's Email Address Obfuscation.
 *
 * That feature (Scrape Shield) rewrites any address it finds in served HTML into
 * `<a href="/cdn-cgi/l/email-protection#..." class="__cf_email__">[email protected]</a>`
 * and leans on an injected script to decode it in the browser. On hsrutility.com it
 * shows up as the support address randomly reading "[email protected]" — worse than
 * cosmetic in the two places that matter most: the in-app policy reader, where the
 * decoder is one more thing that has to load before a Play reviewer sees a contact
 * address, and any reader that does not run scripts, where the address is simply
 * absent.
 *
 * Cloudflare skips anything between `<!--email_off-->` and `<!--/email_off-->`.
 *
 * GETTING THE COMMENT INTO THE OUTPUT IS THE WHOLE DIFFICULTY, and Astro offers
 * three ways that look equivalent and are not:
 *
 *   1. A literal `<!--email_off-->` in template position survives.
 *   2. A literal one inside a JSX expression — a ternary, a `.map()` — is STRIPPED.
 *   3. `set:html="<!--email_off-->"` on its own is ESCAPED, and the page then ships
 *      a visible `&lt;!--email_off--&gt;` while Cloudflare, which honours only a real
 *      comment, rewrites the address anyway. Worst of the three.
 *
 * A comment inside a LARGER html string passed to `set:html` does survive intact,
 * which is what this helper produces and why every fence on the site goes through
 * it rather than being written by hand at the call site.
 *
 * After touching any of this, confirm with:
 *   grep -o '<!--email_off-->' dist/support/index.html | wc -l
 * A count of zero, or an `&lt;` anywhere near it, means it regressed.
 *
 * The other half of the fix is a dashboard toggle (Scrape Shield → Email Address
 * Obfuscation → off), which is the owner's call. This works whether or not that
 * happens, and keeps working if it is ever switched back on.
 */
export const fenceEmail = (html: string) => `<!--email_off-->${html}<!--/email_off-->`;
