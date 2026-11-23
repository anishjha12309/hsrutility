---
name: deploy
description: Ship the HSR Utility site to hsrutility.com. Builds, commits, pushes to master, and confirms the live result. Use when asked to deploy, publish, ship, push live, or release the site — and when asked whether something is deployed yet. Covers the Cloudflare Pages git integration and the traps that make a live check report the wrong thing.
---

# Deploy hsrutility.com

Scope: build, commit, push, confirm. Content changes are a separate task.

## The mechanism

Cloudflare Pages project `hsrutility` serves hsrutility.com, git-connected to
`github.com/anishjha12309/hsrutility` on `master`. **Pushing to master is the
deploy** — Cloudflare builds and promotes on its own, and every deployment is tied
to a commit SHA.

`wrangler pages deploy` is wrong here: on a git-connected project a direct upload
bypasses the integration and leaves a deployment with no commit behind it. The
missing `wrangler.toml`, deploy script and CI workflow are the design, not a gap.

## Before pushing

`dist/` is committed and not ignored, so it must be rebuilt or the shipped HTML
disagrees with its source. Astro prints `Complete!` on some non-fatal paths — the
exit code is the signal:

```bash
set -o pipefail; npm run build 2>&1 | tail -3; echo "EXIT: $?"
```

This tree has repeatedly held uncommitted work from earlier sessions, which
`git add -A` sweeps into the commit. Diff whatever you did not edit yourself.

The legal pages here are what Google Play review reads. Get a go-ahead before
pushing — approval for one push is not approval for the next.

## Confirming it landed

```bash
npx wrangler pages deployment list --project-name hsrutility 2>&1 | grep -F "<sha>"
```

The row carries the SHA, a permanent `*.pages.dev` URL and a status; `Active` is
current production. Wrangler is deliberately not a dependency; `npx` fetches it.

Four things make a live check report something false:

- `/terms` 308s to `/terms/`. Without `curl -L` the body is empty and every grep
  finds nothing — indistinguishable from a missing change.
- The custom domain can serve the previous deployment, or a mix across pages, for a
  window after the new one goes `Active`. A deployment's own `*.pages.dev` URL is
  immutable, so it separates "not deployed" from "not propagated yet".
- Live mailto links are rewritten to `/cdn-cgi/l/email-protection#<hex>`, so
  grepping live HTML for `support@…` misses them on a correct page. The JSON-LD and
  `llms.txt` are not rewritten.
- Committed `dist/` matches production only if it was rebuilt before the commit
  that shipped. `git show HEAD:dist/...` describes the repo, not the site.

## Previewing

`astro preview` serves the built `dist/`; `astro dev` does not show what deploys.
Log the server to the session scratchpad. Stop it by port with
`lsof -ti tcp:<port> -sTCP:LISTEN | xargs kill`.

## Rolling back

Deployments are immutable and keep permanent URLs. Promote an earlier one from the
dashboard, or revert the commit and push — the latter keeps git and the deploy
history in agreement, which is the point of the integration.
