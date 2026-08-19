# HSR Utility

Astro 5 static site for hsrutility.com, marketing the Android apps Pakiza and Arul.

- Studio and app facts live in `src/lib/site.ts`. Every page, the JSON-LD in
  `src/lib/schema.ts`, and `public/llms.txt` read from it. Change a fact there,
  never in a page.
- Deploying is covered by the `/deploy` skill. Read it before pushing.

## Authoring skills and hooks

Everything under `.claude/` is a prompt, and the model reading it is Claude Opus 5.
Follow the [Opus 5 prompting guide][guide] when writing or editing a skill, a hook,
or this file. The rules below are that guide applied to this repo — when they and
the guide disagree, the guide wins; re-read it rather than trusting this summary.

[guide]: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5

### Do not write verification scaffolding

Opus 5 verifies its own work and catches its own mistakes without being told to.
Instructions like "verify before reporting", "double-check your answer", "add a
final verification step", or "use a subagent to confirm" compound with behavior the
model already has: they burn tokens and cause over-verification without improving
results. Delete them on sight, including any inherited from older harness docs.

This is not a rule against documenting **how** to check something. The distinction:

- **Delete** — "Always verify the deploy succeeded." The model already does.
- **Keep** — "`/terms` 308-redirects to `/terms/`; without `curl -L` the body is
  empty and every grep silently finds nothing."

The second is a fact about this system that the model cannot infer and will
otherwise get wrong. Write those as plain statements of how the thing behaves, not
as orders to be careful. A skill's value is the non-obvious domain knowledge in it,
not reminders to be diligent.

### Scope the task, then stop

State what a skill is responsible for and what it is not. Opus 5 will otherwise
extend a task with steps that were not requested. Where a skill could plausibly
keep going — rebuild, redeploy, refactor the thing it touched — say where it ends.

Prefer "make routine judgment calls yourself; check in only when different readings
lead to materially different work" over either extreme of asking about everything or
deciding everything silently.

### Constrain delegation

Opus 5 delegates readily, and subagents multiply cost on small work. Do not tell a
skill to spawn agents for anything one context can finish in a handful of tool
calls, and never delegate verification. If a skill genuinely needs fan-out, cap the
count explicitly.

### Calibrate length in both directions

Opus 5 runs long by default, in chat responses and in files it writes to disk.
Effort level tunes thinking, not output length — only an explicit instruction
shortens output.

- Tell a skill that writes reports or docs to match length to substance and skip
  filler sections, redundant summaries and boilerplate.
- In a long skill, restate the tone instruction near the end. A rule stated once at
  the top of a long prompt carries less weight than one repeated at the boundary.

### Describe the cadence you want, positively

For anything that narrates while it works, specify the shape: one sentence before
the first tool call, brief updates only on a real finding or a change of direction,
and a closing line that leads with the outcome rather than the process.

Positive examples of the style you want beat prohibitions. "Lead with what changed"
lands better than "don't be verbose".

### Limit correction narration

Opus 5 announces corrections to its own earlier statements more than is useful.
Instruct that a correction is worth stating only when the error would change the
user's code, conclusions, or decisions; otherwise fix it and move on.

### Never tell the model not to think

Rules like "do not reason about this" or "skip thinking" increase the chance of
internal XML tags leaking into visible output. Keep thinking on and use a lower
effort level to control cost.

### Before committing a skill or hook

Read it back against this list. In practice the recurring mistakes are writing
verification steps the model performs anyway, and padding a skill to look thorough.
Both make it worse. Cut a skill to the facts a competent agent would not already
know, and stop.

<tone_preference>
Keep skills and hooks in this repo concise. Prefer the non-obvious fact over the
general reminder.
</tone_preference>
