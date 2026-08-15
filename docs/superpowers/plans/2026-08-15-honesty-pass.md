# Honesty Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every canvas finding except the two `later` rows (Detail Shadow-Picker, Johto+ route trainers): fix silent lies/crashes, then show short EN+DE hints with computable flags.

**Architecture:** One small `src/lib/honesty.ts` exports flag helpers (no React). UI reads flags at the render edge and shows existing Holo-Dex gold/muted 10–11px lines. Data model stays English slugs. Do not invent trainers, regional dex, or a Colo engine.

**Tech Stack:** React 19 + TS, i18next EN+DE parity, vitest TDD, official German game terms, no du-form, no em-dash in copy.

**Source of truth:** `/home/rin/.cursor/projects/home-rin-Work-private-pkdx/canvases/honesty-findings.canvas.tsx` (ids `d1`–`m6`). Skip `v5` and `x1`.

**Do not:** commit `dist/` from a prerender-less local build; apply `15_nuz_encounters_shadow_id.sql`; fill Johto+ trainers; add Detail shadow picker.

**Verify after each wave:** `npx tsc -b` and the wave’s vitest files. After all waves: `npx vitest run` (live test needs network).

---

## File map

| File | Role |
|---|---|
| `src/lib/honesty.ts` + `src/lib/honesty.test.ts` | Flag helpers |
| `src/i18n/locales/{en,de}/translation.json` | All new strings, both locales |
| `src/lib/move-pool.ts` | Let’s Go already aliased; padded-wild source |
| `src/lib/teambuilder.ts` | `noLearnset`, synergy, coverage, LGPE evs |
| `src/lib/effectiveness.ts` / `gen-dex.ts` | `???` skip, `genMoveOf` in coverage |
| `src/pages/detail/*` | Dock fallback, form hint, evo i18n, ability fallback, SEO label |
| `src/pages/Pokedex.tsx` | catalogTypes hint |
| `src/pages/detail/VersusPanel.tsx` | `genMoveOf` BP, padded label, maxStatExp, defaultEdition |
| `src/pages/nuzlocke/*` | Cap hint, noStoredMoves, QuickEntry static filter, duped badge |
| `src/pages/OrreTracker.tsx` | Render `notes`, starter hint |
| `src/pages/maps/DetailDrawer.tsx` | trainerEditionNote |
| `src/data/items-seo.json` + item Q&A | Wrong evo targets, DE copy |
| `scripts/generate-pokemon-seo.mjs` | Re-run after bucket fix (already in repo) |

---

## Shared i18n keys (add in Task 1, both locales)

```
honesty.editionFallback          EN: No data for the linked game. Showing {{edition}}.
                                 DE: Kein Datensatz für das verlinkte Spiel. Anzeige: {{edition}}.
honesty.catalogTypes             EN: Types are current-gen. The gen chip only filters who appears.
                                 DE: Typen sind aktuell. Der Gen-Chip filtert nur die Liste.
honesty.formNotInGame            EN: This form is not in the selected game.
                                 DE: Diese Form gibt es in der gewählten Edition nicht.
honesty.evoCurrent               EN: Evolution methods are current, not edition-scoped.
                                 DE: Entwicklung ist aktuell, nicht editionsbezogen.
honesty.seoSnapshot              EN: FRLG snapshot below. Overview follows the edition dock.
                                 DE: Unten FRLG-Stand. Oben folgt das Editionsdock.
honesty.siblingMix               EN: Rates can mix sibling games. Pick a version.
                                 DE: Raten können Schwesterspiele mischen. Version wählen.
honesty.speciesCurrent           EN: Catch rate, size and breeding are current species data.
                                 DE: Fangrate, Maße und Zucht sind aktuelle Artwerte.
honesty.nationalPicker           EN: National Dex. This list is not filtered to the selected game.
                                 DE: Nationaldex. Liste ist nicht auf das gewählte Spiel gefiltert.
tb.illegal.noLearnset            EN: No learnset in this version group
                                 DE: Kein Learnset in dieser Versionsgruppe
honesty.importUnchecked          EN: Import is not checked against the selected game.
                                 DE: Import prüft nicht gegen das gewählte Spiel.
honesty.enOnlySmogon             EN: Set names are English Smogon labels.
                                 DE: Set-Namen sind englische Smogon-Bezeichnungen.
honesty.maxStatExp               EN: Stats assume max Stat Exp.
                                 DE: Werte mit max. Stat-Exp.
honesty.defaultEdition           EN: Lab defaults to SV. Versus lab defaults to FireRed.
                                 DE: Simulator startet in SV. Versus-Labor in Feuerrot.
honesty.paddedWild               EN: Wild set, coverage padded.
                                 DE: Wild-Set, mit Coverage aufgefüllt.
honesty.capUsesRegion            EN: Cap uses this region’s default edition, not necessarily the game you picked.
                                 DE: Cap folgt der Standard-Edition der Region, nicht zwingend dem gewählten Spiel.
honesty.noStoredMoves            EN: Your side is a level-up estimate. The run does not store moves.
                                 DE: Eigene Seite ist Level-up-Schätzung. Der Run speichert keine Attacken.
honesty.snagLevelUp              EN: Snagged Shadows still calc as level-up, not the Shadow set.
                                 DE: Gesnaggte Schatten rechnen mit Level-up, nicht dem Schatten-Set.
honesty.shadowIdOptional         EN: Cloud Shadow id syncs only if the live database has migration 15.
                                 DE: Cloud-Shadow-id sync’t nur, wenn Migration 15 live liegt.
honesty.starterRandom            EN: Only one starter at Phenac. The other two are post-credits and randomized.
                                 DE: Nur ein Starter in Phenac. Die anderen zwei nach den Credits, zufällig verteilt.
honesty.firstEncounterSet        EN: First-encounter set. Rematch Qwilfish may lack Poison Barb.
                                 DE: Set vom Erstkontakt. Revanche-Baldorfish ggf. ohne Giftstich.
honesty.calcNeutral              EN: Calc uses 31 IVs and a Serious nature. Colosseum rolls both.
                                 DE: Calc nutzt 31 DV und Ernst. Colosseum würfelt beides.
honesty.modernEffect             EN: Effect numbers are modern rules. FRLG may differ — see Q&A.
                                 DE: Wirkungszahlen sind moderne Regeln. FRLG kann abweichen. Siehe Q&A.
honesty.locationsFrlgField       EN: Locations are FRLG field finds only, not shops or Sevii.
                                 DE: Fundorte sind nur FRLG-Gelände, keine Läden oder Sevii-Eilande.
maps.seoPartial                  EN: Red/Blue tables are on the live map, not this page.
                                 DE: Rot/Blau steht auf der Live-Karte, nicht auf dieser Seite.
```

Reuse existing: `desc.enFallback`, `versus.trainerEditionNote`, `versus.trainerMovesFallback`, `versus.rankingHeuristic`, `versus.shadowApproxNote`, `maps.noItems`, `maps.noTrainers*`.

German: official terms, no du-form, no em-dash. If a key above contains "—", replace with a period.

---

### Task 1: Honesty flags + i18n keys

**Files:**
- Create: `src/lib/honesty.ts`, `src/lib/honesty.test.ts`
- Modify: `src/i18n/locales/en/translation.json`, `src/i18n/locales/de/translation.json`

- [ ] **Step 1:** Add failing tests for helpers:

```ts
// src/lib/honesty.test.ts
import { describe, expect, it } from 'vitest';
import {
  editionFallback,
  formNotInGame,
  paddedWild,
  trainerArtifactMismatch,
} from './honesty';

describe('honesty flags', () => {
  it('editionFallback when requested vg is absent from present set', () => {
    expect(editionFallback('black-white', new Set(['sword-shield']))).toBe(true);
    expect(editionFallback('sword-shield', new Set(['sword-shield']))).toBe(false);
  });
  it('formNotInGame when genSpecies missing', () => {
    expect(formNotInGame(false)).toBe(true);
    expect(formNotInGame(true)).toBe(false);
  });
  it('paddedWild when wild count < 4 and extra slots filled', () => {
    expect(paddedWild(2, 4)).toBe(true);
    expect(paddedWild(4, 4)).toBe(false);
  });
});
```

Also import `trainerSourceMismatchesGame` tests already in `trainer-data.test.ts` — do not duplicate; `honesty.ts` may re-export that helper.

- [ ] **Step 2:** `npx vitest run src/lib/honesty.test.ts` — expect FAIL (module missing).

- [ ] **Step 3:** Implement:

```ts
export function editionFallback(requestedVg: string | null | undefined, present: Set<string>): boolean {
  if (!requestedVg) return false;
  return present.size > 0 && !present.has(requestedVg);
}
export function formNotInGame(existsInVg: boolean): boolean {
  return !existsInVg;
}
export function paddedWild(wildCount: number, shownCount: number): boolean {
  return wildCount > 0 && shownCount > wildCount;
}
```

Add all i18n keys above in EN+DE (key parity).

- [ ] **Step 4:** Tests green. `npx tsc -b`.

- [ ] **Step 5:** Commit `test(honesty): flag helpers and locale keys`

---

### Task 2: Crash and silent-number fixes (wave 1)

**Files:**
- Modify: `src/lib/teambuilder.ts` (`defensiveSynergy` already uses `genTypeSlugs`; `offensiveCoverage` / `coverTypesFor` / `seTypesAgainst` still 18 types)
- Modify: coverage consumers in `src/pages/teambuilder/AnalysisDeck.tsx`
- Modify: `src/lib/effectiveness.ts` or synergy loop — skip type `???`
- Modify: `src/pages/detail/VersusPanel.tsx` MoveSlots `sub: mv?.power` → `genMoveOf(versionGroup, slug)?.power`
- Modify: `src/pages/nuzlocke/QuickEntry.tsx` — filter `isStatic` like `mapdata.ts`
- Modify: edition dock / moves picker — `sameVersionGroup` when building `present`
- Modify: `src/data/items-seo.json` + DE Q&A strings for Blattstein/Wasserstein/Sonnenstein
- Run: `node scripts/generate-pokemon-seo.mjs` (and hoenn/johto/sinnoh if that is how the script is invoked) so `routes-*.json` Baldorfish is OTHER not FISH
- Modify: Left-rail / `bestRate` / `spawnLeaders` in maps — exclude swarm OTHER from “häufigster Fang”

**Canvas ids:** `t4` `t5` `t6` `v1` `n3` `d2` `i1` `i2` `i3` `m1` `m3`

- [ ] **Step 1:** Failing tests first:
  - `defensiveSynergy` / offense: FRLG rows must not include `fairy` or `???` (extend `teambuilder-species.test.ts`)
  - Bite in RBY coverage is Normal (use `genMoveOf`)
  - QuickEntry / a small helper: static rows excluded from % mix — extract if needed
  - `items-seo` Blattstein targets must not include `#69` / `bellsprout`; Wasserstein not `#270` / `lotad`
  - `seo-bucket` already tests swarm→OTHER; after regen assert `routes-johto.json` johto-route-32 heartgold qwilfish method !== FISH or is OTHER
  - Let’s Go: a unit on whatever builds the dock `present` set includes `lets-go-pikachu-eevee` when payload has `lets-go-pikachu-lets-go-eevee`

- [ ] **Step 2:** Run those tests — FAIL.

- [ ] **Step 3:** Minimal fixes. Official DE Q&A: Myrapla→Duflor (Sonnenstein); Blattstein-Ziele Duflor/Ultrigaria/Owei. Wasserstein-Ziel Lombrero; add missing Seeschaum location if enriched has two.

- [ ] **Step 4:** `npx vitest run src/lib/teambuilder-species.test.ts src/lib/teambuilder-abilities.test.ts src/lib/items-seo-exp-share.test.ts scripts/seo-bucket.test.mjs` plus any new tests. `npx tsc -b`.

- [ ] **Step 5:** Commit `fix: stop silent wrong numbers and ??? crash`

---

### Task 3: Small honest fixes (wave 2)

**Canvas ids:** `d6` `d11` `t2` `t3` `n4` `o3` `i6`

- [ ] **Step 1:** Tests:
  - `slotLegality` empty learnset → `{ key: 'noLearnset' }` not `species` (Deoxys-shaped payload in FRLG). Update `teambuilder-species.test.ts`.
  - `genHasMechanics('lets-go-pikachu-eevee').evs` should be false OR UI hides EV block when not real EVs — prefer mechanics flag + test.
  - OrreTracker renders `notes` when present (component test if cheap; else grep-guard + manual). Prefer a pure helper `shadowNotesToShow(shadow)`.

- [ ] **Step 2:** FAIL then implement:
  - Add `noLearnset` to `LegalityReasonKey` + `tb.illegal.noLearnset`
  - Ability short line: if DE missing, show `desc.enFallback` (same as modal)
  - Evo chips: `nameOfMove` / `nameOfPokemon` instead of `titleCase`
  - Box: `duped` gets its own badge/key, not Missed
  - OrreTracker: render existing `notes` / `reappear.note`
  - DE leftovers: Fuchsia→Fuchsania, Indigo Plateau→Indigo-Plateau / Siegesstraße as official, group Boosts→i18n, breadcrumb `items` via t()

- [ ] **Step 3:** Tests green. Commit `fix: honest labels for learnset, notes, and DE leftovers`

---

### Task 4: Hint surfaces (wave 3)

Wire flags from Task 1 to UI. Gold/muted 10–11px, `text-gold/90` or `text-tx-muted`, no red.

**Canvas ids:** `d1` `d3` `d4` `d7` `d8` `d9` `d10` `t1` `t7` `t8` `v2` `v3` `v4` `n1` `n2` `n5` `o1` `o2` `o4` `i4` `i5` `m2` `m4`

| Flag | Where |
|---|---|
| `editionFallback` | Edition dock when requested game ≠ shown VG |
| `catalogTypes` | Pokedex under gen chip |
| `formNotInGame` | FormStrip / detail when `genSpecies` false |
| `evoCurrent` | Evolution panel once |
| `seoSnapshot` | SEO block header |
| `siblingMix` | Where-to-find when ALL / no single version |
| `speciesCurrent` | Hero facts once |
| `nationalPicker` | Team picker empty state / header |
| `importUnchecked` | Showdown import dialog |
| `enOnlySmogon` | Meta set name row |
| `paddedWild` | MoveSlots when flag (also set source label via Task 2) |
| `maxStatExp` | Versus when gen < 3 |
| `defaultEdition` | BattleLanding only |
| `capUsesRegion` | Nuzlocke cap UI |
| `noStoredMoves` | Nuzlocke Versus your side |
| `snagLevelUp` | when `enc.shadow_id` set but you-side is wildMoveset |
| `shadowIdOptional` | Orre-in-run / cloud, one line |
| `starterRandom` | Orre Phenac / starter notes |
| `firstEncounterSet` | Versus when foe is Qwilfish shadow or any first-encounter note |
| `calcNeutral` | append to `versus.shadowApproxNote` or extra line |
| `modernEffect` | ItemDetailPage when flavor/effect mixed-gen |
| `locationsFrlgField` | Item locations block |
| `trainerArtifact` | Maps DetailDrawer trainers tab (reuse `versus.trainerEditionNote`) |
| `seoPartial` | SEO route pages missing RB / empty trainer section |

- [ ] **Step 1:** For each flag, a tiny test that the helper is true in the known case (already in Task 1) plus i18n key exists in both JSON files (pattern from `orre-shadow-sets.test.ts`).

- [ ] **Step 2:** Render the line only when the flag is true. Do not show on every page unconditionally.

- [ ] **Step 3:** `npx tsc -b`. Smoke: no i18n missing-key if you can run a key-parity test.

- [ ] **Step 4:** Commit `feat: surface honesty hints from computable flags`

---

### Task 5: SEO snapshot regen + Alakazam BST (`d5` `m1` `m4`)

- [ ] **Step 1:** Confirm `pokemon-seo.json` Alakazam BST. Write a test: FRLG Alakazam BST is 490 (SpD 85) or whatever `@pkmn` gen3 says — do not guess; read `genStatsOf('firered-leafgreen', 'alakazam')`.

- [ ] **Step 2:** Fix snapshot generator or the JSON so the SEO block matches FRLG stats. Re-run `node scripts/generate-pokemon-seo.mjs` for each region the script supports so Route 32 Qwilfish is not FISH 90.

- [ ] **Step 3:** Commit generated JSON + test. Do **not** `git add -f dist` unless prerender actually ran with Chromium.

---

### Task 6: Final gate

- [ ] **Step 1:** `npx tsc -b` — 0 errors
- [ ] **Step 2:** `npx vitest run` — only allowed fail is live PokéAPI if offline
- [ ] **Step 3:** Grep canvas ids: every id except `v5` `x1` has a code or i18n touch
- [ ] **Step 4:** Do not push unless the user asks

---

## Out of scope (later)

- `v5` Detail Versus shadow picker
- `x1` Johto–Unova route trainer curation
- Live apply of `15_nuz_encounters_shadow_id.sql`

## Parallelism

Wave 1 tasks that do not share files can run as parallel subagents if file ownership is split:

- Agent A: teambuilder coverage + `???` + Bite (`teambuilder.ts`, AnalysisDeck, tests)
- Agent B: Versus `genMoveOf` BP + paddedWild label (`VersusPanel.tsx`)
- Agent C: QuickEntry static + Box duped (`nuzlocke/`)
- Agent D: items-seo + DE Q&A
- Agent E: Let’s Go dock present + generate-pokemon-seo + spawnLeaders

Wave 2 after wave 1. Wave 3 after flags exist (Task 1 first, always).
