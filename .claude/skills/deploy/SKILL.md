---
name: deploy
description: Ship the HSR Utility site to hsrutility.com. Builds, commits, pushes to master, and verifies the live result. Use when asked to deploy, publish, ship, push live, or release the site — and when asked whether something is deployed yet. Covers the Cloudflare Pages git integration and the verification traps that produce false readings.
---

# Deploy hsrutility.com

## How this site actually deploys

The Cloudflare Pages project **`hsrutility`** serves `hsrutility.com` (and
`hsrutility-b9y.pages.dev`). It is **git-connected** to
`github.com/anishjha12309/hsrutility`, watching branch **`master`**.

**Pushing to `master` is the deploy.** Cloudflare detects the push, builds, and
promotes to production automatically. Every deployment in the project history is
tied to a commit SHA.

> **Never run `wrangler pages deploy`.** This is a git-connected project. A direct
> upload sidesteps the integration and creates a deployment with no commit behind
> it, so the dashboard history stops matching the repo. `wrangler` is still the
> right tool for *reading* deploy state — see Verify.

There is no `wrangler.toml`, no deploy script in `package.json`, and no CI
workflow. Do not add one to "fix" the absence — the git integration is the design.

## Preflight

1. **Build must pass.** `npm run build` and confirm the exit code is `0`.
   Astro prints `Complete!` even on some non-fatal paths, so check the code, not
   the text:
   ```bash
   npm run build 2>&1 | tail -3; echo "EXIT: ${PIPESTATUS[0]}"
   ```
   Do not push a tree whose build you have not run.

2. **`dist/` is committed to this repo.** It is not ignored. Always rebuild before
   committing, or you ship stale HTML alongside fresh source and the two disagree.

3. **Read `git status` before staging.** This working tree has a history of
   carrying uncommitted work from earlier sessions. `git add -A` will sweep it
   into your commit. Diff anything you did not personally edit, and if it is
   unrelated to the task, say so in the commit message or ask before including it.

4. **Confirm before pushing.** A push publishes to a live site whose legal pages
   are what Google Play review reads. Get the user's go-ahead unless they have
   already said to deploy in this session.

## Deploy

```bash
npm run build                       # exit 0, verified above
git add -A                          # after reviewing status
git commit -F - <<'MSG'
<subject>

<body — what changed and why>
MSG
git push origin master
```

Cloudflare picks it up within a few seconds; the build takes a minute or two.

## Verify

Confirm the deployment exists and is `Active`:

```bash
npx wrangler pages deployment list --project-name hsrutility 2>&1 | sed -n '4,8p'
```

The top row's **Source** column must show the SHA you just pushed, and Status
must read `Active`. `npx` installs wrangler on demand — it is not a project
dependency, and that is fine.

Then verify the live HTML. **Four traps make this give false readings:**

- **Trailing-slash redirect.** `/terms` returns `308` to `/terms/`. Without
  `curl -L` the body is empty and every grep silently finds nothing. Use
  `curl -sL` and prefer the trailing-slash URL.
- **Propagation lag.** The custom domain can still serve the previous deployment
  for a short window after the new one flips to `Active`. A stale read right after
  a push is usually timing, not a failed deploy. Re-check before concluding
  anything, or hit the deployment's own `*.pages.dev` URL, which is never stale.
- **Cloudflare email obfuscation.** Mailto links on the live site are rewritten to
  `/cdn-cgi/l/email-protection#<hex>`. Grepping live HTML for `support@…` will
  miss them even when the page is correct. Check the email in the JSON-LD block or
  in `llms.txt` instead, which are not rewritten.
- **`dist/` in git ≠ what is live.** The committed `dist/` only matches production
  if it was rebuilt before the commit that shipped. Never infer live content from
  `git show HEAD:dist/...`; fetch the site.

A verification sweep that avoids all four:

```bash
for p in terms privacy support delete-account; do
  echo "── /$p/"
  B=$(curl -sL "https://hsrutility.com/$p/")
  echo "  company: $(echo "$B" | grep -oE 'HSR Utility Apps Private Limited' | sort -u)"
  echo "  stale?   $(echo "$B" | grep -coE 'hsrapps|HSR Energy|HARALURU|Bengaluru|Karnataka') hit(s)"
done
curl -sL https://hsrutility.com/llms.txt | grep -E 'support@|Contact:'
```

Adjust the greps to whatever this deploy changed. Report what you actually
fetched — never call a deploy verified on the strength of the build passing.

## Preview locally before shipping

`astro preview` serves the built `dist/` on a port of your choosing:

```bash
npx astro preview --port 4331
```

Redirect its output to a real path — `$TMPDIR` is unset in this environment's Git
Bash and `> $TMPDIR/log` silently fails with `Permission denied`. Use the session
scratchpad directory instead. Note `astro dev` will not show you what deploys;
only `preview` serves the actual build.

## Rollback

Deployments are immutable and each has a permanent URL. To roll back, either
promote a previous deployment from the dashboard (link is in the `deployment
list` output), or revert the commit and push — the latter keeps git and the
deploy history in agreement, which is the reason this project is git-connected.

## Facts, once

Company name, address, phone, support email and app details all live in
[`src/lib/site.ts`](../../../src/lib/site.ts). Every page, the JSON-LD in
`src/lib/schema.ts`, and `public/llms.txt` read from it. If a deploy is about
changing one of those, change it there — never in a page. `public/llms.txt` is
the one file that restates them by hand, so it needs a matching edit.
