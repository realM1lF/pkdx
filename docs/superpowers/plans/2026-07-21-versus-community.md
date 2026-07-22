# Versus Community Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Versus wird auffindbar, gen-/spieltreu, kampfnäher (Item/Ability/Weather/Status) und regional nutzbar (Kanto–Unova Trainer) — ohne Team-vs-Team-Kämpfe.

**Architecture:** `versus.ts` bekommt einen `VersusContext` (gen, versionGroup, optional region/game). Calc, Move-Pools und UI lesen denselben Context. Trainer-Daten liegen pro Region in `src/data/enriched/{region}.json` (Gym/E4/Champion zuerst, Wild-Fallback wie Kanto). Shared UI-Komponenten (`TrainerPicker`, Prefill-API) verbinden Detail, Nuzlocke, Team Builder und Maps.

**Tech Stack:** React 19, `@smogon/calc`, `@pkmn/data`, bestehende `teambuilder.ts` Version-Mapping, i18n DE/EN.

**Out of scope:** Team-vs-Team, `@pkmn/sim`, volle Turn-Simulation.

---

## Phase 0 — Quick Wins & Contracts

### Task 0.1: VersusContext-Typen und Hilfsfunktionen

**Files:**
- Create: `src/lib/versus-context.ts`
- Modify: `src/lib/teambuilder.ts` (export `versionGroupForGame` if not already)
- Test: `npm run build`

- [ ] **Step 1:** Neue Datei `versus-context.ts`:

```typescript
import type { RegionId } from './regions';
import { versionGroupForGame } from './teambuilder';

export interface VersusContext {
  /** @smogon/calc generation 1–9 */
  gen: number;
  versionGroup: string;
  game: string | null;
  region: RegionId | null;
}

const GAME_GEN: Record<string, number> = {
  red: 1, blue: 1, yellow: 1,
  gold: 2, silver: 2, crystal: 2,
  ruby: 3, sapphire: 3, emerald: 3,
  firered: 3, leafgreen: 3,
  diamond: 4, pearl: 4, platinum: 4,
  heartgold: 4, soulsilver: 4,
  black: 5, white: 5, 'black-2': 5, 'white-2': 5,
  // modern defaults → 9
};

export function defaultVersusContext(): VersusContext {
  return { gen: 9, versionGroup: 'scarlet-violet', game: null, region: null };
}

export function versusContextFromGame(game: string | null | undefined, region?: RegionId | null): VersusContext {
  const vg = versionGroupForGame(game) ?? 'scarlet-violet';
  const gen = game ? (GAME_GEN[game] ?? 9) : 9;
  return { gen, versionGroup: vg, game: game ?? null, region: region ?? null };
}
```

- [ ] **Step 2:** Build: `npm run build` — grün.

- [ ] **Step 3:** Commit: `feat(versus): add VersusContext helpers`

---

### Task 0.2: Nav & Footer — Versus auffindbar

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/i18n/locales/de/translation.json`, `en/translation.json`
- Test: manuell `/de/pokemon/25?vs=6`

- [ ] **Step 1:** Navbar-Link „Versus“ → `localePath('/pokemon/25?vs=6')` (Pikachu vs Charizard Teaser, wie Home).
- [ ] **Step 2:** Footer-Spalte „Tools“ oder bestehende Spalte: Link Versus + Maps/Nuzlocke/Team falls noch fehlend.
- [ ] **Step 3:** i18n Keys `nav.versus`, `footer.versus`.
- [ ] **Step 4:** Build grün, Commit: `feat(versus): add nav and footer discoverability`

---

### Task 0.3: Team Builder VS-Link mit Gegner

**Files:**
- Modify: `src/pages/teambuilder/SlotCard.tsx`
- Modify: `src/pages/TeamBuilder.tsx` (focused slot / team context if needed)

- [ ] **Step 1:** VS-Link: wenn ein anderer Slot Pokémon hat → `?vs={otherId}`; sonst leerer Gegner ok aber Link zu `/pokemon/{id}?tab=versus` ohne broken state.
- [ ] **Step 2:** Optional: erster befüllter Slot ≠ current als Default-Gegner.
- [ ] **Step 3:** Commit: `fix(team): pass opponent id in versus link`

---

### Task 0.4: Add-to-Team aus Versus

**Files:**
- Modify: `src/lib/teambuilder.ts`
- Modify: `src/pages/detail/VersusPanel.tsx`
- Modify: `src/pages/nuzlocke/VersusTab.tsx` (optional gleicher Button)
- Modify: i18n

- [ ] **Step 1:** In `teambuilder.ts`:

```typescript
export function prefillTeamFromVersus(side: {
  pokemonId: number;
  slug: string;
  level: number;
  moves: (string | null)[];
  ability?: string | null;
  item?: string | null;
  nature?: string | null;
  evs?: Record<StatKey, number>;
}, versionGroup: string): Team {
  const team = emptyTeam();
  team.versionGroup = versionGroup;
  const slot = team.slots[0];
  slot.pokemonId = side.pokemonId;
  slot.pokemon = side.slug;
  slot.level = side.level;
  slot.moves = side.moves.slice(0, 4) as TeamSlot['moves'];
  slot.ability = side.ability ?? null;
  slot.item = side.item ?? null;
  slot.nature = side.nature ?? null;
  if (side.evs) slot.evs = side.evs;
  saveDraft(team);
  return team;
}
```

- [ ] **Step 2:** VersusPanel Button „Ins Team übernehmen“ → `navigate(localePath('/team'))` nach `saveDraft`.
- [ ] **Step 3:** i18n `versus.addToTeam`.
- [ ] **Step 4:** Commit: `feat(versus): add to team builder prefill`

---

## Phase 1 — Gen-aware Calc

### Task 1.1: Parametrisierte Calc in versus.ts

**Files:**
- Modify: `src/lib/versus.ts` (major)
- Create: `src/lib/versus.test.ts` (optional vitest if exists; else build-only)

- [ ] **Step 1:** Ersetze `const GEN = Generations.get(9)` durch `getGen(ctx: VersusContext)` Cache `Map<number, Generation>`.
- [ ] **Step 2:** `buildMon(side, ctx)`, `damageBetween(...)`, `statsOf`, `speedCheck` — alle nehmen `VersusContext`.
- [ ] **Step 3:** `newestVersionGroup()` in Move-Pool-Funktionen durch `ctx.versionGroup` ersetzen: `legalMoveSlugs`, `wildMoveset`, `resolveDefaultSet`, `pickTopMoves`.
- [ ] **Step 4:** Export `versusContextFromRun(state: RunState)` Wrapper.
- [ ] **Step 5:** Build grün, Commit: `feat(versus): gen-aware calc and move pools`

---

### Task 1.2: Detail VersusPanel — Context + Badge

**Files:**
- Modify: `src/pages/detail/VersusPanel.tsx`
- Modify: `src/pages/PokemonDetail.tsx` (optional game query)

- [ ] **Step 1:** Prop `context?: VersusContext` — Default `defaultVersusContext()`.
- [ ] **Step 2:** Game-Selector (compact): RBY/FRLG/etc. → updates context, recomputes matrix.
- [ ] **Step 3:** Badge: „Calc: Gen {n} · {gameLabel}“ wenn nicht Gen 9.
- [ ] **Step 4:** Alle `computeMatrix`/`damageBetween` Calls mit context.
- [ ] **Step 5:** Commit: `feat(versus): detail panel gen selector`

---

### Task 1.3: Nuzlocke VersusTab — Run-Game Context

**Files:**
- Modify: `src/pages/nuzlocke/VersusTab.tsx`

- [ ] **Step 1:** `const ctx = versusContextFromGame(state.run.game, state.run.region)`.
- [ ] **Step 2:** Ranking + matrix durchreichen.
- [ ] **Step 3:** Banner wenn Gen 9 calc auf Gen 3 game würde irreführen — jetzt korrekt gelabelt.
- [ ] **Step 4:** Commit: `feat(versus): nuzlocke run uses game-accurate calc`

---

## Phase 2 — Battle Context (Item / Ability / Weather / Status)

### Task 2.1: VersusSide erweitern

**Files:**
- Modify: `src/lib/versus.ts`
- Modify: `src/lib/versus-context.ts` (weather presets enum)

```typescript
export interface VersusSide {
  slug: string;
  level: number;
  nature?: string;
  evs?: Partial<Record<StatKey, number>>;
  ivs?: Partial<Record<StatKey, number>>;
  moves: string[];
  ability?: string | null;
  item?: string | null;
  status?: 'none' | 'burn' | 'par' | 'psn' | 'slp' | 'frz' | null;
}
export type VersusField = {
  weather?: 'none' | 'sun' | 'rain' | 'sand' | 'snow' | 'hail';
  terrain?: 'none' | 'electric' | 'grassy' | 'misty' | 'psychic';
};
```

- [ ] **Step 1:** Types + `buildMon` setzt ability/item via calc API.
- [ ] **Step 2:** `damageBetween(..., field?: VersusField)` — `@smogon/calc` field option.
- [ ] **Step 3:** Status: Burn auf damage, Par auf speed (calc handles when passed).
- [ ] **Step 4:** Commit: `feat(versus): item ability weather status in calc`

---

### Task 2.2: TUNE UI — Item, Ability, Field

**Files:**
- Modify: `src/pages/detail/VersusPanel.tsx`
- Reuse: patterns from `src/pages/teambuilder/SlotEditor.tsx`

- [ ] **Step 1:** Expand TUNE: Ability dropdown (`genAbilitiesOf`), Item dropdown (`genItemsOf`) — versionGroup from context.
- [ ] **Step 2:** Field presets row: Clear / Sun / Rain / Sand (i18n labels).
- [ ] **Step 3:** Status chips on defender (optional attacker): burn/par/psn.
- [ ] **Step 4:** Nuzlocke VersusTab: at least Item/Ability on own side TUNE (level already editable).
- [ ] **Step 5:** Commit: `feat(versus): tune panel battle modifiers`

---

## Phase 3 — Trainer Picker & Regional Data

### Task 3.1: Trainer-Loader & shared TrainerPicker

**Files:**
- Create: `src/lib/trainer-data.ts`
- Create: `src/pages/detail/TrainerPicker.tsx`
- Modify: `src/lib/versus.ts` (`trainerIndex` bleibt, region param)

```typescript
import kanto from '@/data/enriched/kanto.json';
// lazy imports per region

export function trainersForRegion(region: RegionId): EnrichedTrainer[] { ... }
```

- [ ] **Step 1:** `trainer-data.ts` — lädt JSON per region, cached.
- [ ] **Step 2:** Extract Trainer UI aus `VersusTab.tsx` → `TrainerPicker.tsx` (filter: Leader/E4/Boss).
- [ ] **Step 3:** Commit: `refactor(versus): shared trainer loader and picker`

---

### Task 3.2: Detail Versus — Trainer-Modus

**Files:**
- Modify: `src/pages/detail/VersusPanel.tsx`

- [ ] **Step 1:** Segmented: „Dex“ | „Trainer“ (region selector wenn kein Run).
- [ ] **Step 2:** Trainer pick → foe side mit `source: trainer`, exakte moves.
- [ ] **Step 3:** Commit: `feat(versus): trainer picker on detail tab`

---

### Task 3.3: Trainer-Enrichment Script (Gym/E4/Champion)

**Files:**
- Create: `scripts/enrich-trainers.mjs`
- Create: `src/data/enriched/johto.json`
- Create: `src/data/enriched/hoenn.json`
- Create: `src/data/enriched/sinnoh.json`
- Create: `src/data/enriched/unova.json`

**Daten-Scope:** Pro Region mindestens 8 Gym Leader + E4 (4) + Champion — species, level, moves aus Bulbapedia/pret-Referenz. Kein vollständiges Route-Trainer-Roster in v1.

- [ ] **Step 1:** Script-Dokumentation in Script-Header + `docs/ai/architecture.md` Abschnitt.
- [ ] **Step 2:** `johto.json` — Schema identisch zu `kanto.json` (`nodes` keyed by region node ids aus `data/regions/johto.json`).
- [ ] **Step 3:** `hoenn.json`, `sinnoh.json`, `unova.json` analog.
- [ ] **Step 4:** Validate: each leader node id exists in regions JSON.
- [ ] **Step 5:** Commit: `feat(versus): regional gym trainer data johto-unova`

---

### Task 3.4: Nuzlocke VersusTab multi-region

**Files:**
- Modify: `src/pages/nuzlocke/VersusTab.tsx`

- [ ] **Step 1:** Replace hardcoded `kantoJson` with `trainersForRegion(state.run.region)`.
- [ ] **Step 2:** Non-kanto runs: trainer mode enabled with regional data.
- [ ] **Step 3:** Empty state wenn Region noch keine Daten → Wild-only + Hinweis.
- [ ] **Step 4:** Commit: `feat(versus): nuzlocke trainer mode all map regions`

---

## Phase 4 — Integration Hooks

### Task 4.1: Maps → Versus

**Files:**
- Modify: `src/pages/maps/DetailDrawer.tsx` (or equivalent)
- Modify: `src/pages/MapRegion.tsx`

- [ ] **Step 1:** Button „Gegen Leader planen“ wenn node Gym/city with trainers → `/pokemon/{firstTeamMon}?vs={leaderAce}&game={v}` oder Nuzlocke run versus tab deep link.
- [ ] **Step 2:** Query params: `?versusTrainer={nodeId}` optional für Detail Versus.
- [ ] **Step 3:** Commit: `feat(maps): link to versus trainer planning`

---

### Task 4.2: Nuzlocke ↔ Team Builder

**Files:**
- Modify: `src/pages/nuzlocke/VersusTab.tsx`
- Modify: `src/pages/nuzlocke/RunHeader.tsx`

- [ ] **Step 1:** „Team im Builder öffnen“ → import run team via existing `getRunTeam` + navigate `/team`.
- [ ] **Step 2:** RunHeader link wenn nicht vorhanden.
- [ ] **Step 3:** Commit: `feat(nuzlocke): export team to builder from versus`

---

### Task 4.3: Type-Chart Konsolidierung (optional, low risk)

**Files:**
- Modify: `src/lib/versus.ts`
- Modify: `src/pages/detail/data.ts`

- [ ] **Step 1:** Export `TYPE_CHART` from single module `src/lib/type-chart.ts`.
- [ ] **Step 2:** Import in both detail and versus.
- [ ] **Step 3:** Commit: `refactor(types): unify type chart module`

---

## Phase 5 — i18n, QA, Docs

### Task 5.1: i18n sweep

**Files:** all new UI strings in DE + EN under `versus.*`, `nav.versus`, `footer.versus`

- [ ] **Step 1:** Keys für Gen badge, field weather, trainer mode, add to team, maps link.
- [ ] **Step 2:** Commit: `i18n(versus): de en strings for community overhaul`

---

### Task 5.2: Final verification

- [ ] **Step 1:** `npm run build`
- [ ] **Step 2:** Smoke: Detail ?vs=, Nuzlocke versus tab Kanto + Johto run, Team add prefill, Nav link
- [ ] **Step 3:** Update `docs/player-ux-audit.md` Versus section (status ✅/⚠️)
- [ ] **Step 4:** Commit: `docs: update player ux audit versus status`

---

## Abhängigkeiten

```
0.1 VersusContext → 1.1 Gen calc → 2.1 Battle fields → 2.2 TUNE UI
0.2 Nav (parallel)
0.3 TB VS link (parallel)
0.4 Add-to-team (parallel)
3.3 Regional JSON → 3.1 Loader → 3.2 Detail trainer + 3.4 Nuzlocke multi-region
4.x Integration after 1.x + 3.x
```

## Self-Review (Spec Coverage)

| Community-Wunsch | Task |
|------------------|------|
| Auffindbarkeit Nav/Footer | 0.2 |
| Gen-Mismatch | 1.1–1.3 |
| Trainer-Picker Detail | 3.2 |
| Items/Abilities/Weather/Status | 2.1–2.2 |
| Trainer Johto–Unova | 3.3–3.4 |
| Add to Team | 0.4 |
| TB VS Link fix | 0.3 |
| Maps/Nuzlocke hooks | 4.1–4.2 |
| Team vs Team | ❌ out of scope |

---

## Execution

Branch: `feat/versus-community`

Subagent-driven: one task at a time, build after each phase, commit per task.
