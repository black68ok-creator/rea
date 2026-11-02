# Studio Roles (Review Lenses)

Condensed from the 49 agents of
[Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) (MIT).
Use a role as a checklist when working in its domain. Escalate conflicts to the shared
parent: design conflicts → creative-director, technical conflicts →
technical-director, scope/schedule → producer.

## Tier 1 — Directors

| Role               | Owns                         | Asks                                                     |
| ------------------ | ---------------------------- | -------------------------------------------------------- |
| creative-director  | vision, pillars, tone        | Does this serve the pitch? Is the feeling consistent?    |
| technical-director | architecture, perf, risk     | Is it within budget? What breaks first at scale?         |
| producer           | scope, schedule, propagation | Is this in the MVP? What do we cut? Who else is touched? |

## Tier 2 — Leads

| Role               | Owns                          | Checklist                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------- |
| game-designer      | core loop, rules, progression | Clear goal, readable fail state, meaningful choices       |
| lead-programmer    | code structure, standards     | Data-driven values, small functions, no hidden globals    |
| art-director       | visual language               | Palette ≤ 5 key colors, silhouettes readable, contrast    |
| audio-director     | sound identity                | Feedback sound for every player action, no fatigue        |
| narrative-director | story, framing                | One-line premise carried by mechanics, not text walls     |
| qa-lead            | test plan, evidence           | Each acceptance criterion has evidence; edge cases listed |
| release-manager    | builds, changelog             | Version, changelog, known issues, rollback path           |
| localization-lead  | text pipeline                 | No hardcoded player-facing strings when localizing        |

## Tier 3 — Specialists

- **gameplay-programmer**: input → state → render separation; fixed or clamped
  timestep; deterministic update logic that can be unit-tested.
- **ai-programmer**: simple, legible enemy rules (seek/flee/patrol); telegraph
  before attacks; difficulty knobs in config.
- **ui-programmer / ux-designer**: HUD shows only what the player needs now; start,
  pause and game-over states; keyboard + touch; focus loss pauses.
- **systems-designer / economy-designer**: formulas written down; resource
  sources and sinks balanced; time-to-fail curve.
- **level-designer / world-builder**: teach → test → twist; spawn pacing ramps.
- **technical-artist**: particles, glow and screen shake are cheap juice — bounded
  counts, no per-frame allocations in hot loops.
- **sound-designer**: WebAudio synth blips are enough for an MVP; respect a mute.
- **performance-analyst**: 60 fps target; profile before optimizing; cap entities.
- **accessibility-specialist**: color is never the only signal; remappable or
  simple controls; reduced-motion option for shake/flash.
- **qa-tester**: try pause, resize, rapid restart, holding all keys, tab-out.
- **prototyper**: answer one question fast; throw it away.
- Others in the original roster (network, security, devops, analytics, live-ops,
  community, tools, engine programmers, writer) apply only when the game needs them.

## Engine specialists

- **Godot 4**: godot-specialist (+ GDScript, shaders, GDExtension, C#).
- **Unity**: unity-specialist (+ DOTS/ECS, shaders/VFX, Addressables, UI Toolkit).
- **Unreal 5**: unreal-specialist (+ GAS, Blueprints, replication, UMG/CommonUI).
- **HTML5 (this skill's default)**: single file, `requestAnimationFrame`, delta-time
  clamped to ~1/30 s, `devicePixelRatio`-aware canvas, WebAudio created on first input.
