# Orre Shadows — Tracker + Nuzlocke (Colosseum / XD)

Status: draft (awaiting human review)  
Date: 2026-08-12  
Scope: Shadow checklist + progress for Pokémon Colosseum (48) and XD: Gale of Darkness (83); minimal Orre Nuzlocke integration. Subagent-driven delivery with a mandatory research/data-validator per theme.

## Goals

1. Ship a **usable Shadow tracker** (filter by location/trainer, progress, missed recovery) so players stop relying on giant wiki tables.
2. Ship **Nuzlocke-ready Orre runs** (`colosseum` / `xd`) with snag slots on a shared timeline.
3. Keep **one curated data source of truth**; Tracker and Nuzlocke both join through the same IDs.
4. Every theme goes through a **research/data-validator agent** before and after implementation so numbers, trainers, locations, and UI bindings stay correct.
5. Stay inside pkdx invariants: English slugs, `/:lang` routing, LocaleLink, i18n key parity, Holo-Dex density, no red errors.

## Non-goals (explicit later)

- Purification chamber optimizer / Hoppspross–Shadow Lugia speed tricks as a dedicated helper.
- Full Miror Radar *simulation* (RNG / radar UI). v1 stores recovery facts and short guidance text only.
- Poké Spot encounter tables (XD).
- Orre map canvas / atlas geometry (region is freeform / map-less like Kalos…).
- Versus trainer parties / GC moveset dumps for calc.
- Multiplayer-specific Orre rules beyond existing Nuzlocke multiplayer plumbing.

## Product (v1)

| Surface | What players get |
|---|---|
| Tracker | All shadows for Colo or XD; filters; snagged / missed / remaining; “if missed, where again?” |
| Nuzlocke | New games + region `orre`; timeline ordered by story; logging a snag consumes the location slot |
| Shared data | Same `locationId` / `route_key` / species slugs everywhere |

Reddit signal: fans want **challenge / Nuzlocke planning**, not only a static list. Tracker is still the right data + UX foundation; Nuzlocke sits on top.

## Architecture

### Layers

```
src/data/orre/colosseum.json     curated shadows (48)
src/data/orre/xd.json            curated shadows (83)
src/data/regions/orre.json       freeform region nodes (locations)
src/lib/orre.ts                  loaders, types, selectors
src/lib/orre-progress.ts         tracker localStorage (pdx2.orre.*)
Tracker pages                    UI under /:lang/…
Nuzlocke wizard + run            game + region wiring, snag = encounter
```

### Join contract (binding)

```
Shadow.locationId  ===  Region node.id  ===  Nuzlocke route_key
Shadow.species     ===  English PokéAPI / Dex slug
Shadow.id          ===  stable checklist + progress key
```

Do not invent a second ID space. Display names only via `i18n-data` / i18next at the render edge. Trainer names may stay English (same policy as pret/Kanto trainers).

### Region `orre`

- Lives in **freeform** regions (`regions-freeform` pattern), not the atlas (`REGIONS`).
- Nodes: one per distinct snag/location bucket needed for timeline + filters.
- `x`/`y` = 0, `edges: []` (map-less).
- `versions`: `["colosseum", "xd"]`. One shared node list; add game-specific nodes only when curation proves a location exists in only one game.
- Coverage/speciesCount: derived from curated artifacts in audit scripts, not hand-waved.

### Games

- Wizard + store accept `game: "colosseum" | "xd"`.
- Map to version-group / gen for Team Builder / legality via existing `version-groups` helpers (extend; do not special-case ad hoc in UI).
- SEO: optional guide slugs later; v1 needs working routes and no missing i18n keys, not a full guide series.

## Data model

### Shadow record (both games)

```ts
type OrreGame = 'colosseum' | 'xd';

interface OrreShadow {
  /** Stable id, e.g. colo-shadow-teddiursa */
  id: string;
  species: string;       // slug
  level: number;
  trainer: string;       // EN display string (data model)
  locationId: string;    // === region node.id / route_key
  order: number;         // story progression
  required: boolean;     // story-mandatory vs optional
  reappear?: {
    locationId?: string; // where trainer/shadow returns; omit if N/A
    note: string;        // short EN fact; UI may i18n via keys later
    kind?: 'reappear' | 'miror-radar' | 'story-lock' | 'postgame';
  };
  notes?: string;        // optional EN curator note
}
```

### Artifact file shape

```ts
interface OrreArtifact {
  game: OrreGame;
  source: string;        // provenance blurb
  verifiedAt: string;    // ISO date
  shadows: OrreShadow[];
}
```

Counts are enforced by tests, not comments: **48** Colosseum, **83** XD.

### Tracker progress (`pdx2.orre.*`)

Per game, keyed by `shadow.id`:

```ts
type ShadowStatus = 'remaining' | 'snagged' | 'missed';
// missed still shows reappear guidance; does not delete the entry
```

Solo localStorage only in v1 (account sync out of scope unless it falls out of existing patterns for free).

### Nuzlocke encounter semantics

- Default rule: **one snag slot per `route_key` / location node** (same slot-consuming idea as wild routes).
- Logging: species from shadow list for that location+game; status `caught` / `missed` / existing statuses as applicable.
- Dupes clause: use existing evolution-family logic on species slugs.
- If multiple shadows share one location in data, either (a) split nodes (`orre-phenac-city-a`) so each mandatory snag has a slot, or (b) document multi-shadow locations with ordered sub-slots — **prefer (a)** so `route_key` uniqueness stays simple. Research/validator decides during curation; schema must not force silent collisions.

## Validation gates (blocking)

Automated (vitest and/or `scripts/check-orre-data.mjs`):

1. Exact shadow counts per game.
2. Unique `id` within each artifact.
3. Every `species` resolves in the app name/Dex index.
4. Every `locationId` and `reappear.locationId` exists on region `orre`.
5. Every region node used by at least one shadow for at least one game (or explicitly marked decor — avoid decor in v1).
6. `order` strictly increasing intent: unique per game (or unique within required set — pick one in implementation plan and stick to it; **prefer unique `order` per game**).
7. Consumer smoke: selectors used by Tracker and Nuzlocke return the same records for the same id (no divergent hardcoding of counts in UI strings without reading artifacts).

Manual research checklist (validator agent):

- Cross-check Bulbapedia + PokéWiki lists and trainer assignments.
- Spot-check against GameCube community dumps where available.
- Document conflicts in `docs/ai/` or a short `src/data/orre/PROVENANCE.md`; resolve before merge.
- Confirm German UI uses official terms where applicable; trainer names may remain EN.

## UI / routing (sketch)

- Tracker entry: e.g. `/:lang/orre` or under toolkit / nuzlocke hub — exact path chosen in implementation plan; must use LocaleLink and LangGate.
- Filters: game, location, trainer, status, required-only.
- Missed row shows `reappear` guidance.
- Nuzlocke: region card + game select; timeline from `orre` nodes ordered; encounter picker constrained to shadows for that `route_key` + game.
- Design: Holo-Dex density, gold error hints, `data-lenis-prevent` on inner lists, sprites via `<Sprite>`.

## Agent orchestration

Orchestrator (this session’s lead agent) owns specs, plans, dispatch order, and merge gates.

### Themes (sequential unless noted)

1. **Data contract + artifacts** (schema, Colo 48, XD 83, reappear fields, region `orre`)
2. **Tracker UI + progress store**
3. **Nuzlocke wiring** (games, wizard, snag slots, timeline)
4. **i18n / routing / minimal SEO**
5. **Integration gate** (full validation suite, bilingual smoke, build/tsc)

### Per-theme pipeline (mandatory)

```
Research/Data-Validator → Implementer → Spec reviewer → Code-quality reviewer
```

Rules:

- Implementer **must not invent game facts**; only consume validator-approved artifacts / fixtures.
- Research/Data-Validator runs **before** implementation on data themes and **again after** UI/Nuzlocke themes to assert correct field usage and displayed counts.
- Parallelism: Colo vs XD *research* may run in parallel **after** schema lock; do not parallelize implementers that touch the same files.
- Follow `subagent-driven-development`: fresh subagent per task, two-stage review, no “close enough” on counts.

### Role summary

| Role | Responsibility |
|---|---|
| Orchestrator | Plan, dispatch, resolve blockers, enforce validator gate |
| Research/Data-Validator | Sources, fixtures, count/integrity checks, consumer field audit |
| Implementer | Code + unit tests against approved data |
| Spec reviewer | Matches this design + plan; no extras |
| Code-quality reviewer | pkdx invariants, density, i18n, Lenis, Sprite |

## Testing strategy

- Unit: schema parsers, selectors, progress store, order/filter helpers.
- Data: golden count + referential integrity (above gates).
- Component/light: tracker status toggle; nuzlocke game appears in wizard.
- Manual smoke: `/de/…` and `/en/…`, no missing i18n keys, sprite render for a sample shadow.
- Pre-merge: `npx tsc -b`, `npx vitest run` (at least orre + nuzlocke slices), `npm run build` when touching routes/prerender.

## Risks

| Risk | Mitigation |
|---|---|
| Wiki disagreements on optional shadows / names | PROVENANCE + validator freeze before UI |
| Multiple shadows per “location” break 1-slot rule | Split nodes during curation |
| Version-group mapping for GC games incomplete in `@pkmn` | Cap TB legality gracefully; document; don’t block tracker |
| Scope creep (purification, map, spots) | Non-goals; separate specs later |

## Success criteria

- Tracker shows 48 / 83 with verified trainer + location + recovery info.
- Nuzlocke can start Colo or XD on Orre and log snags on timeline slots.
- All automated orre gates green; bilingual smoke clean.
- No second parallel data path; Maps atlas unchanged.

## Open decisions (resolve in implementation plan, not blockers)

1. Exact URL path for the tracker hub.
2. Whether Colo and XD share one `orre` node list or need game-prefixed node ids (default: shared list where locations coincide; game-specific nodes only when needed).
3. Whether `reappear.note` stays EN curator text in v1 or gets i18n keys immediately (default: EN note in data + thin UI wrapper keys for labels like “Reappears at”).
