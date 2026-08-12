# Orre Shadows + Nuzlocke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a verified Shadow tracker (Colosseum 48 / XD 83) plus light Orre Nuzlocke runs that share one curated data contract.

**Architecture:** Curated JSON artifacts under `src/data/orre/` + freeform region `orre`; loaders in `src/lib/orre*.ts`; Tracker UI at `/:lang/orre`; Nuzlocke wizard gains `colosseum`/`xd` via freeform region. Every theme has a research/data-validator gate before merge.

**Tech Stack:** React 19, TypeScript, Vite, i18next, existing Nuzlocke store, vitest.

**Workspace:** `/home/rin/Work/_private/pkdx/.worktrees/orre-shadows` on branch `feat/orre-shadows`. Commits allowed; **no pushes**.

**Spec:** `docs/superpowers/specs/2026-08-12-orre-shadows-nuzlocke-design.md`

---

## File map

| Path | Role |
|---|---|
| `src/lib/orre-types.ts` | Shared types |
| `src/lib/orre.ts` | Loaders + selectors |
| `src/lib/orre-progress.ts` | localStorage progress store |
| `src/lib/orre-data.test.ts` | Count + referential integrity |
| `src/data/orre/colosseum.json` | 48 shadows |
| `src/data/orre/xd.json` | 83 shadows |
| `src/data/orre/PROVENANCE.md` | Sources + conflict resolutions |
| `src/data/regions/orre.json` | Freeform region nodes |
| `src/lib/regions-freeform.ts` | Register `orre` |
| `src/lib/version-groups.ts` | Add Colo/XD games |
| `src/pages/OrreTracker.tsx` | Tracker page |
| `src/App.tsx` | Route `orre` |
| `src/i18n/locales/{en,de}/translation.json` | UI strings |
| `src/pages/nuzlocke/Wizard.tsx` | Uses freeform region versions |
| `src/pages/nuzlocke/*` | Snag picker constrained to shadows for route+game |

---

### Task 1: Types, loaders stub, failing integrity tests

**Files:**
- Create: `src/lib/orre-types.ts`
- Create: `src/lib/orre.ts`
- Create: `src/lib/orre-data.test.ts`
- Create: `src/data/orre/colosseum.json` (empty shadows `[]` stub with meta)
- Create: `src/data/orre/xd.json` (empty shadows `[]` stub with meta)

- [ ] **Step 1: Add types**

```ts
// src/lib/orre-types.ts
export type OrreGame = 'colosseum' | 'xd';

export type ReappearKind = 'reappear' | 'miror-radar' | 'story-lock' | 'postgame';

export interface OrreReappear {
  locationId?: string;
  note: string;
  kind?: ReappearKind;
}

export interface OrreShadow {
  id: string;
  species: string;
  level: number;
  trainer: string;
  locationId: string;
  order: number;
  required: boolean;
  reappear?: OrreReappear;
  notes?: string;
}

export interface OrreArtifact {
  game: OrreGame;
  source: string;
  verifiedAt: string;
  shadows: OrreShadow[];
}

export type ShadowStatus = 'remaining' | 'snagged' | 'missed';
```

- [ ] **Step 2: Stub artifacts + loader**

```ts
// src/lib/orre.ts
import colo from '@/data/orre/colosseum.json';
import xd from '@/data/orre/xd.json';
import type { OrreArtifact, OrreGame, OrreShadow } from './orre-types';

export const ORRE_EXPECTED_COUNTS: Record<OrreGame, number> = {
  colosseum: 48,
  xd: 83,
};

const ARTIFACTS: Record<OrreGame, OrreArtifact> = {
  colosseum: colo as OrreArtifact,
  xd: xd as OrreArtifact,
};

export function artifactFor(game: OrreGame): OrreArtifact {
  return ARTIFACTS[game];
}

export function shadowsFor(game: OrreGame): OrreShadow[] {
  return [...ARTIFACTS[game].shadows].sort((a, b) => a.order - b.order);
}

export function shadowById(game: OrreGame, id: string): OrreShadow | undefined {
  return ARTIFACTS[game].shadows.find((s) => s.id === id);
}

export function shadowsAtLocation(game: OrreGame, locationId: string): OrreShadow[] {
  return shadowsFor(game).filter((s) => s.locationId === locationId);
}

export function allLocationIds(game?: OrreGame): string[] {
  const games: OrreGame[] = game ? [game] : ['colosseum', 'xd'];
  const set = new Set<string>();
  for (const g of games) {
    for (const s of ARTIFACTS[g].shadows) {
      set.add(s.locationId);
      if (s.reappear?.locationId) set.add(s.reappear.locationId);
    }
  }
  return [...set].sort();
}
```

Stub JSON example:

```json
{
  "game": "colosseum",
  "source": "stub — pending curation",
  "verifiedAt": "2026-08-12",
  "shadows": []
}
```

- [ ] **Step 3: Write failing integrity tests**

```ts
// src/lib/orre-data.test.ts
import { describe, expect, it } from 'vitest';
import { anyRegionById } from './regions-freeform';
import {
  ORRE_EXPECTED_COUNTS,
  allLocationIds,
  artifactFor,
  shadowsFor,
} from './orre';
import type { OrreGame } from './orre-types';

const GAMES: OrreGame[] = ['colosseum', 'xd'];

describe('orre artifacts', () => {
  for (const game of GAMES) {
    it(`${game} has exact shadow count`, () => {
      expect(artifactFor(game).shadows).toHaveLength(ORRE_EXPECTED_COUNTS[game]);
    });

    it(`${game} has unique ids and orders`, () => {
      const shadows = shadowsFor(game);
      expect(new Set(shadows.map((s) => s.id)).size).toBe(shadows.length);
      expect(new Set(shadows.map((s) => s.order)).size).toBe(shadows.length);
    });

    it(`${game} locationIds exist on region orre`, () => {
      const region = anyRegionById('orre');
      expect(region).toBeTruthy();
      const nodeIds = new Set(region!.nodes.map((n) => n.id));
      for (const s of shadowsFor(game)) {
        expect(nodeIds.has(s.locationId), `${s.id} location ${s.locationId}`).toBe(true);
        if (s.reappear?.locationId) {
          expect(nodeIds.has(s.reappear.locationId), `${s.id} reappear`).toBe(true);
        }
      }
    });
  }

  it('allLocationIds are covered by region nodes', () => {
    const region = anyRegionById('orre');
    expect(region).toBeTruthy();
    const nodeIds = new Set(region!.nodes.map((n) => n.id));
    for (const id of allLocationIds()) {
      expect(nodeIds.has(id)).toBe(true);
    }
  });
});
```

Note: region `orre` does not exist yet — tests fail until Tasks 2–4. That is intentional for TDD across tasks; Task 1 may temporarily comment the region assertions **only if** needed to keep CI green on stubs — prefer leaving them failing on the feature branch until data lands. On this branch, run `npx vitest run src/lib/orre-data.test.ts` and expect FAIL on counts.

- [ ] **Step 4: Commit**

```bash
git add src/lib/orre-types.ts src/lib/orre.ts src/lib/orre-data.test.ts src/data/orre/colosseum.json src/data/orre/xd.json
git commit -m "$(cat <<'EOF'
feat(orre): add shadow artifact types and integrity tests

Stub Colo/XD JSON and expected 48/83 counts so curation can be validated.
EOF
)"
```

---

### Task 2: Research/Data-Validator — Colosseum 48

**Role:** Research/Data-Validator (not a blind implementer).

**Files:**
- Modify: `src/data/orre/colosseum.json`
- Create/Update: `src/data/orre/PROVENANCE.md`

- [ ] **Step 1: Gather sources**

Primary:
- Bulbapedia: “List of Shadow Pokémon in Pokémon Colosseum”
- PokéWiki DE equivalent if available
- Cross-check trainer/location against a second source (wiki table or GameCube dump notes)

- [ ] **Step 2: Write full `colosseum.json`**

Every shadow must include: `id`, `species` (EN slug), `level`, `trainer`, `locationId` (`orre-…` kebab), `order` (unique 1..n story order), `required`, `reappear` when the game allows recovery (kind + note + locationId when known).

Rules:
- `id` = `colo-shadow-{species}` or `colo-shadow-{species}-{n}` if duplicate species
- `locationId` must be stable kebab under `orre-` prefix
- If multiple shadows share one map label, **split** locationIds (`orre-phenac-city-miror-b` vs `orre-phenac-city`) so Nuzlocke 1-slot-per-route stays honest
- Do not invent purification tips

- [ ] **Step 3: Document in PROVENANCE.md**

List sources, date, any conflicts and chosen resolution.

- [ ] **Step 4: Commit data only**

```bash
git add src/data/orre/colosseum.json src/data/orre/PROVENANCE.md
git commit -m "$(cat <<'EOF'
data(orre): curate Colosseum shadow list (48)

Verified trainer/location/order against wiki sources for the tracker contract.
EOF
)"
```

**Exit criteria:** `artifactFor('colosseum').shadows.length === 48`, unique ids/orders, every field populated per schema. Region check may still fail until Task 4.

---

### Task 3: Research/Data-Validator — XD 83

Same as Task 2 for `src/data/orre/xd.json`.

- Ids: `xd-shadow-{species}` (+ suffix if needed)
- Include Miror Radar recovery as `reappear.kind: 'miror-radar'` with short EN note
- Commit separately

**May run in parallel with Task 2** after Task 1 schema exists.

---

### Task 4: Freeform region `orre` + register + fix integrity tests

**Files:**
- Create: `src/data/regions/orre.json`
- Modify: `src/lib/regions-freeform.ts`
- Modify: `src/lib/regions.ts` — extend `versionChipLabel` / ensure `versionLabel` works for `colosseum`/`xd` (optional SHORT_VERSIONS entries `CO` / `XD`)

- [ ] **Step 1: Build `orre.json` from union of locationIds** in both artifacts (Research/Validator reviews labels).

Shape matches Kalos freeform:

```json
{
  "region": "orre",
  "name": "Orre",
  "nameDe": "Orre",
  "gen": "III",
  "accent": "#C4A35A",
  "viewBox": "0 0 1200 840",
  "versions": ["colosseum", "xd"],
  "defaultVersion": "colosseum",
  "coverage": 1,
  "speciesCount": 0,
  "nodes": [
    {
      "id": "orre-example",
      "label": "Example",
      "nameDe": "Beispiel",
      "kind": "city",
      "x": 0,
      "y": 0,
      "order": 1,
      "locationSlug": null
    }
  ],
  "edges": []
}
```

`speciesCount`: set to unique species across both games after curation.

- [ ] **Step 2: Register in `regions-freeform.ts`**

```ts
import orreJson from '@/data/regions/orre.json';
// add to FREEFORM_REGIONS array and FreeformRegionId union
```

- [ ] **Step 3: Run** `npx vitest run src/lib/orre-data.test.ts` — all pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(orre): add freeform Orre region for snag route_keys

Joins curated shadow locationIds to Nuzlocke timeline nodes.
EOF
)"
```

---

### Task 5: Progress store

**Files:**
- Create: `src/lib/orre-progress.ts`
- Create: `src/lib/orre-progress.test.ts`

```ts
const KEY = 'pdx2.orre.progress';

type ProgressMap = Record<string, Partial<Record<string, ShadowStatus>>>;
// game -> shadowId -> status (omit or 'remaining' = remaining)

export function loadProgress(): ProgressMap { /* localStorage JSON */ }
export function getStatus(game: OrreGame, id: string): ShadowStatus { /* default remaining */ }
export function setStatus(game: OrreGame, id: string, status: ShadowStatus): void { /* persist */ }
export function counts(game: OrreGame): { snagged: number; missed: number; remaining: number } {
  /* derive from shadowsFor + progress */
}
```

TDD: write tests with mocked localStorage (follow patterns in other `pdx2.*` store tests if present).

Commit: `feat(orre): add shadow tracker progress store`

---

### Task 6: Tracker UI + route + i18n

**Files:**
- Create: `src/pages/OrreTracker.tsx`
- Modify: `src/App.tsx` — lazy route `path="orre"`
- Modify: `src/i18n/locales/en/translation.json` + `de/translation.json`
- Modify: `src/components/Navbar.tsx` **or** link from Nuzlocke hub / Home toolkit (prefer link from Nuzlocke page + optional nav entry `nav.orre`)

UI requirements (Holo-Dex density):
- Game toggle Colo / XD
- Filters: status, location, trainer text, required-only
- Rows 36–44px: sprite via `<Sprite>`, name via `nameOfPokemon`, trainer, location via `nodeName`, status chips
- Missed rows show reappear note
- Inner scroll: `data-lenis-prevent`
- All strings via i18n keys under `orre.*`

Commit: `feat(orre): add Shadow tracker page`

---

### Task 7: Version groups + Nuzlocke wizard

**Files:**
- Modify: `src/lib/version-groups.ts` — add groups:

```ts
{ id: 'colosseum', label: 'COLOSSEUM', short: 'COLO', gen: 3, games: ['colosseum'] },
{ id: 'xd', label: 'XD GALE OF DARKNESS', short: 'XD', gen: 3, games: ['xd'] },
```

(If `@pkmn/dex` lacks these VGs, legality may be best-effort; do not block tracker. Use gen 3 chart.)

- Confirm Wizard already lists FREEFORM_REGIONS — Orre appears automatically once registered.
- Add i18n game labels if wizard uses translation map for versions.

Commit: `feat(nuzlocke): enable Colosseum and XD as Orre games`

---

### Task 8: Nuzlocke snag encounter constraint

**Files:** (inspect existing QuickEntry / EncounterMenu / autocomplete)

- When `run.game` is `colosseum`|`xd` and region is `orre`, species suggestions for a `route_key` = `shadowsAtLocation(game, route_key).map(s => s.species)`.
- Empty location → show “no shadow here” i18n string (should be rare if timeline only lists snag nodes).
- Do not break non-Orre runs.

Add unit test for helper `snagSpeciesForRoute(game, routeKey)`.

Commit: `feat(nuzlocke): constrain Orre encounters to snag list`

---

### Task 9: Research/Data-Validator — consumer audit

**Role:** Research/Data-Validator again.

- [ ] Confirm Tracker displays count badges from `ORRE_EXPECTED_COUNTS` / `shadowsFor`, not hardcoded literals in JSX besides i18n that read from data.
- [ ] Spot-check 5 Colo + 5 XD rows against PROVENANCE sources.
- [ ] Confirm Nuzlocke timeline node count matches unique locationIds used by selected game.
- [ ] Fix any mismatches; commit `fix(orre): …` if needed.
- [ ] Run `npx vitest run src/lib/orre src/lib/orre-progress` and relevant nuzlocke tests; `npx tsc -b`.

---

### Task 10: Integration gate

- [ ] `npx tsc -b` — 0 errors
- [ ] `npx vitest run` — green (full suite)
- [ ] EN/DE key parity for new `orre.*` / nav keys
- [ ] Manual checklist documented in commit body: `/de/orre`, `/en/orre`, start Nuzlocke Orre Colo, log one snag
- [ ] Final commit if needed: `test(orre): integration gate`

---

## Orchestrator notes

- After each task: Spec reviewer → Code-quality reviewer (subagent-driven-development).
- Data tasks (2, 3, 9): Research/Data-Validator is the primary agent; implementer only applies mechanical fixes.
- Tasks 2 and 3 may run in parallel after Task 1.
- Never push. Work only in `.worktrees/orre-shadows`.
