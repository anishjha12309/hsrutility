# HSR Utility

Astro 5 static site for hsrutility.com, marketing the Android apps Pakiza and Arul.

- Studio and app facts live in `src/lib/site.ts`. Every page, the JSON-LD in
  `src/lib/schema.ts`, and `public/llms.txt` read from it. Change a fact there,
  never in a page.
- Deploying is covered by the `/deploy` skill. Read it before pushing.

## Authoring skills and hooks

Everything under `.claude/` is a prompt read by Claude Opus 5. Follow the
[Opus 5 prompting guide][guide]; where it and the notes below disagree, re-read the
guide rather than trusting this summary.

[guide]: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5

**80 lines, hard cap, frontmatter included.** A skill over the cap is carrying
material that isn't earning its place — cut, don't reformat. If a skill genuinely
needs more, split the overflow into a reference file it points to.

**No verification scaffolding.** Opus 5 verifies its own work and catches its own
mistakes. "Verify before reporting", "double-check", "add a final verification
step", "use a subagent to confirm" compound with behavior the model already has:
they cost tokens and cause over-verification. Delete them on sight.

This is not a rule against documenting *how* to check something:

- **Delete** — "Always verify the deploy succeeded." It already does.
- **Keep** — "`/terms` 308s to `/terms/`; without `curl -L` the body is empty and
  every grep silently finds nothing."

The second is a fact the model cannot infer and will otherwise get wrong. Write
those as statements of how the system behaves, not orders to be careful. A skill's
value is its non-obvious domain knowledge, not reminders to be diligent.

**Scope it, then stop.** Say what a skill is responsible for and what it is not.
Opus 5 otherwise extends a task with steps nobody asked for. Where a skill could
plausibly keep going — rebuild, redeploy, refactor what it touched — say where it
ends. Prefer "make routine judgment calls yourself; check in only when different
readings lead to materially different work" to either extreme.

**Constrain delegation.** Opus 5 delegates readily and subagents multiply cost on
small work. Never delegate verification, or anything one context finishes in a few
tool calls. If fan-out is genuinely needed, cap the count.

**Calibrate length.** Opus 5 runs long in chat and in files it writes. Effort tunes
thinking, not output length — only an explicit instruction shortens output. Tell
anything that writes reports to match length to substance and skip filler sections,
redundant summaries and boilerplate.

**Describe cadence positively.** For anything that narrates while working, specify
the shape: one sentence before the first tool call, brief updates only on a real
finding or change of direction, a close that leads with the outcome. Positive
examples beat prohibitions — "lead with what changed" lands better than "don't be
verbose".

**Limit correction narration.** A correction is worth stating only when the error
would change the user's code, conclusions, or decisions. Otherwise fix it silently.

**Never tell the model not to think.** "Do not reason about this" increases the
chance of internal XML tags leaking into visible output. Keep thinking on and use a
lower effort level to control cost.

<tone_preference>
Cut a skill to the facts a competent agent would not already know, and stop. The
recurring mistakes are verification steps the model performs anyway, and padding to
look thorough.
</tone_preference>
