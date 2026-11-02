---
name: game-studio
description: "Run a one-person game studio workflow: brief → stories → build ↔ verify, with director/lead/specialist review lenses. Use when the user wants to brainstorm, design, prototype, or build a game (HTML5 canvas by default, or Godot/Unity/Unreal when configured)."
argument-hint: "[genre/theme hint | 'open'] [--rigor minimal|standard|full] [--engine html|godot|unity|unreal]"
user-invocable: true
---

# Game Studio

Condensed from [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
(MIT, © 2026 Donchitos). The original ships 49 agents and 74 skills; this skill keeps
its pipeline, quality gates and role lenses in one file. Role details:
[references/roles.md](references/roles.md). Brief template:
[references/game-brief-template.md](references/game-brief-template.md).

## Principles

1. **The user decides; the studio asks the right questions.** Question → Options →
   Decision → Draft → Approval. In an autonomous session (no one to ask, or the
   user said "just make it"), log each decision in the brief and proceed.
2. **Rigor is a dial, default `minimal`.** Measured in the original project: more
   documents before code bought traceability, not a better game.
   - `minimal`: one-page brief → stories → code. No GDDs, no ADRs.
   - `standard`: + a GDD per core system (Overview, Player Fantasy, Detailed Rules,
     Formulas, Acceptance Criteria) and ADRs for foundation decisions.
   - `full`: all 8 GDD sections (+ Edge Cases, Dependencies, Tuning Knobs) and
     director review on every gate.
3. **A parse check is not a run.** Anything player-visible is launched and looked at,
   and a screenshot is kept as evidence before the story closes. Never waived.
4. **Data-driven gameplay.** Tuning values live in one config object/file, never as
   magic numbers scattered through logic.
5. **Prove the fun first.** Build the riskiest, least-proven mechanic first. No menus,
   music or polish until the core loop is fun.
6. **Original work only.** Genres and mechanics are fine; recreations of a specific
   existing game (even renamed) are not.

## Pipeline

### 1. Brainstorm → brief (`/brainstorm`)

- From the hint, propose **2–3 one-line concepts** (verb-first, or genre × theme
  mashup). The user picks or combines. This is the one creative question always asked.
- Fill the brief (template in references): working title, pitch, core loop (2–4
  steps), player goal & fail state, **MVP (≤ 7 items — push back if longer)**, out of
  scope, build order (riskiest first), audience/feeling, art & audio direction,
  closest reference game and the slice of it the MVP keeps.
- Show the full brief, ask before writing it to `<game>/design/game-brief.md`.

### 2. Engine (`/setup-engine`)

Default **HTML5 Canvas, single `index.html`, no dependencies**: runs anywhere, easy to
screenshot with Playwright, publishable as an Artifact. Use Godot/Unity/Unreal only
when the user asks; then apply that engine's specialist lens (references/roles.md).

### 3. Stories (`/create-stories`)

Each MVP item becomes one story in `<game>/production/stories.md`:

```
## S01 — <title>          Type: Logic | Integration | Visual/Feel | UI | Config/Data
Acceptance criteria (trace to the brief's goal & fail state):
- [ ] Given … when … then …
Evidence: <unit test | playtest note | screenshot path>
Status: TODO | IN PROGRESS | DONE
```

Order stories by the brief's build order. At `minimal` the build order is the plan.

### 4. Build ↔ verify loop (`/dev-story` ↔ `/story-done`)

For each story:

1. Mark IN PROGRESS. Pick the lens: gameplay-programmer for mechanics, ui-programmer
   for HUD/menus, ai-programmer for enemies, technical-artist for visuals/VFX.
2. Implement only the story's scope. Tuning values go to the config block.
3. **Run and observe**: open the game (Playwright/Chromium for HTML5), drive input,
   take a screenshot to `<game>/production/qa/evidence/<story>.png`, look at it.
4. Check every acceptance criterion against evidence. Required evidence by type:

   | Type        | Evidence                                   | Gate     |
   | ----------- | ------------------------------------------ | -------- |
   | Logic       | automated test (waived at `minimal`)       | blocking |
   | Integration | test or written playtest note              | blocking |
   | Visual/Feel | retained screenshot                        | blocking |
   | UI          | retained screenshot of each touched screen | blocking |
   | Config/Data | smoke check                                | advisory |

5. Mark DONE with a one-line completion note, then take the next story.

### 5. Reviews (optional, scale with rigor)

Run as lenses, or as parallel subagents only when the user asks for them:

- **creative-director**: does it serve the pitch and feeling? Pillar drift?
- **technical-director**: performance budget (60 fps), structure, risk.
- **producer**: scope vs. MVP; anything to cut?
- **qa-lead**: edge cases (pause, resize, focus loss, rapid input, restart), bug list.
- `/balance-check`: difficulty curve, time-to-fail, score pacing.
- `/scope-check`: compare built features to MVP and Out of scope.

### 6. Prototype rules (`/prototype`)

Throwaway, one question ("is this mechanic fun?"), ≤ 1 day, no polish. Verdict
PROCEED / PIVOT / KILL. Prototype code is never refactored into production. Three
PIVOTs on one concept → force a KILL decision; prefer 2–3 competing prototypes.

## Output layout

```
<game>/
  index.html                       # the game (HTML5 default)
  design/game-brief.md             # the one-page brief (design record at minimal)
  production/stories.md            # stories with status and evidence
  production/qa/evidence/*.png     # retained screenshots
```

## Closing block

End each run with: what was built, stories DONE/total, evidence paths, known issues,
and the single next step (e.g. "next: S05 — sound", or "playtest and run
/balance-check").
