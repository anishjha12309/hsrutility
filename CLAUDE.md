# HSR Utility

Astro 5 static site for hsrutility.com (apps: Pakiza, Arul, AlertPaisa). Studio and app facts
live in `src/lib/site.ts` — every page, `src/lib/schema.ts` and `public/llms.txt`
read from it, so change a fact there, never in a page. To ship: `/deploy` skill.

**The app sub-sites are siloed.** Everything under `/pakiza/`, `/arul/` and `/alertpaisa/` carries
that app's own nav, footer and legal links and links to nothing else — one app serves
an Islamic audience and the other a Hindu one, and a page putting them one click apart
invites a reading neither is asking for. The studio home and `llms.txt` are the only
places the app names appear together. `Layout`'s `scope` prop enforces it; adding a
cross-link from an app page, however useful, undoes it. AlertPaisa is a money app with
no `legal` facts: its legal pages live in `src/pages/alertpaisa/`, not `[app]/`.

## Authoring skills and hooks

Everything under `.claude/` is a prompt read by Claude Opus 5. Follow the
[Opus 5 prompting guide][guide] religiously; it carries the rules on scope,
delegation, length, cadence and corrections. Repo-specific additions:

- **80 lines, hard cap, frontmatter included.** Past it, cut to what a competent
  agent would not already know, or split the overflow into a reference file.
- **No verification scaffolding.** Opus 5 self-verifies, so "double-check" and
  "verify before reporting" only buy over-verification. Facts about how a system
  misbehaves are the exception: "always verify the deploy" goes, "`/terms` 308s to
  `/terms/`, so without `curl -L` every grep silently finds nothing" stays.

[guide]: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
