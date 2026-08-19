---
name: deploy
description: Ship the HSR Utility site to hsrutility.com. Builds, commits, pushes to master, and confirms the live result. Use when asked to deploy, publish, ship, push live, or release the site — and when asked whether something is deployed yet. Covers the Cloudflare Pages git integration and the traps that make a live check report the wrong thing.
---

# Deploy hsrutility.com

Scope: build, commit, push, confirm it landed. Changing site content is not part of
this skill — if a deploy needs a content fix first, make the fix as its own task.

## How this site deploys

The Cloudflare Pages project **`hsrutility`** serves `hsrutility.com` (and
`hsrutility-b9y.pages.dev`). It is **git-connected** to
`github.com/anishjha12309/hsrutility`, watching branch **`master`**.

**Pushing to `master` is the deploy.** Cloudflare detects the push, builds, and
promotes to production. Every deployment is tied to a commit SHA.

`wrangler pages deploy` is the wrong tool here — on a git-connected project a
direct upload bypasses the integration and produces a deployment with no commit
behind it, so the dashboard history stops matching the repo. Wrangler is still how
you read deploy state.

There is no `wrangler.toml`, no deploy script in `package.json`, and no CI
workflow. Their absence is the design, not a gap to fill.

## Before pushing

`dist/` is committed to this repo and is not ignored, so it must be rebuilt before
the commit or the shipped HTML disagrees with the source it came from.

Astro prints `Complete!` on some non-fatal paths, so the exit code is the signal:

```bash
npm run build 2>&1 | tail -3; echo "EXIT: ${PIPESTATUS[0]}"
```

This working tree has repeatedly carried uncommitted work from earlier sessions, so
`git add -A` can sweep unrelated changes into the commit. Diff anything you did not
edit yourself, and account for it in the commit message or leave it out.

A push publishes to a live site whose legal pages are what Google Play review
reads. Get the user's go-ahead before pushing unless they have already said to
deploy in this session — approval for one push is not approval for the next.

```bash
git add -A
git commit -F - <<'MSG'
<subject>

<body — what changed and why>
MSG
git push origin master
```

## Confirming it landed

```bash
npx wrangler pages deployment list --project-name hsrutility 2>&1 | grep -F "<sha>"
```

The row carries the commit SHA, a permanent `*.pages.dev` URL, and a status;
`Active` means it is the current production deployment. `npx` fetches wrangler on
demand — it is deliberately not a project dependency.

Four things make a live check report something false:

- **Trailing-slash redirect.** `/terms` returns `308` to `/terms/`. Without
  `curl -L` the body is empty and every grep silently finds nothing — which reads
  identically to "the change is missing".
- **Propagation lag.** The custom domain can serve the previous deployment for a
  window after the new one goes `Active`, and can serve a *mix* across pages
  mid-switch. The deployment's own `*.pages.dev` URL is immutable and never stale,
  so it separates "not deployed" from "not propagated yet".
- **Cloudflare email obfuscation.** Live mailto links are rewritten to
  `/cdn-cgi/l/email-protection#<hex>`, so grepping live HTML for `support@…` misses
  them on a correct page. The JSON-LD block and `llms.txt` are not rewritten.
- **Committed `dist/` is not evidence.** It matches production only if it was
  rebuilt before the commit that shipped. `git show HEAD:dist/...` describes the
  repo, not the site.

A sweep that avoids all four, adjusted to whatever the deploy changed:

```bash
for p in terms privacy support delete-account; do
  echo "── /$p/"
  B=$(curl -sL "https://hsrutility.com/$p/")
  echo "  company: $(echo "$B" | grep -oE 'HSR Utility Apps Private Limited' | sort -u)"
  echo "  stale?   $(echo "$B" | grep -coE 'hsrapps|HSR Energy|HARALURU|Bengaluru') hit(s)"
done
curl -sL https://hsrutility.com/llms.txt | grep -E 'support@|Contact:'
```

## Previewing the build

`astro preview` serves the built `dist/`; `astro dev` does not show you what
deploys.

```bash
npx astro preview --port 4331
```

`$TMPDIR` is unset in this environment's Git Bash, so `> $TMPDIR/log` fails with
`Permission denied` and the server never starts. Redirect to the session scratchpad
path instead. Stop it by port when done:

```powershell
Get-NetTCPConnection -LocalPort 4331 -State Listen |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

## Rolling back

Deployments are immutable and each keeps a permanent URL. Promote an earlier one
from the dashboard, or revert the commit and push — the latter keeps git and the
deploy history in agreement, which is the point of the git integration.

Report what you actually fetched. A passing build says nothing about what the site
is serving.
