# Maps Trainerliste + Datenfehler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drawer zeigt Trainer am Ort für alle fünf Atlas-Karten. Binding-Datenfehler (Alder, HM07-Node, Johto-E4-Node, Originalbild-Label) sind gegen FRLG/HGSS/BW geprüft. Giovanni-FRLG bleibt Rhyhorn.

**Architecture:** `enriched/{region}.json` keyed nach `node.id` bleibt die einzige Trainerquelle. Neue Helper in `trainer-data.ts`. Drawer-Tab und TrainerPicker konsumieren dieselbe Liste. Johto bekommt einen additiven Liga-Node. Kein SEO, kein pret-Parser.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, i18next, bestehendes Holo-Dex Drawer-Pattern.

**Do not commit** unless the user later asks. User git rule overrides implementer-commit steps.

**Work from:** `/home/rin/Work/_private/pkdx` on branch `feat/maps-trainers-and-data-fixes`.

---

## File map

| Path | Rolle |
|---|---|
| `src/data/enriched/unova.json` | Alder-Party BW |
| `src/data/enriched/johto.json` | E4+Lance von `mt-silver` nach `johto-pokemon-league` |
| `src/data/enriched/kanto.json` | unverändert (Giovanni FRLG ist korrekt) |
| `src/data/items-johto.json` | HM07 von `ice-path` nach `dragons-den` |
| `src/data/regions/johto.json` | Node + Kante `johto-pokemon-league` |
| `src/data/regions/johto-geo.json` | Geo-Key für den neuen Node |
| `src/lib/trainer-data.ts` | `trainersAtNode` |
| `src/lib/trainer-data.test.ts` | Create: Binding-Teams + Node-Join |
| `src/lib/regions.test.ts` | Liga-Node, Geo, HM07-Ort |
| `src/pages/detail/TrainerPicker.tsx` | alle Trainer, Gruppen Rival + Route |
| `src/pages/maps/DetailDrawer.tsx` | Trainer-Tab |
| `src/pages/maps/OriginalCanvas.tsx` + CommandBar | Artwork-Edition-Hinweis |
| `src/lib/maps-geo.ts` | `artworkVersionLabel` aus geo.version |
| `src/i18n/locales/{en,de}/translation.json` | neue Keys, Parität |

---

### Task 1: Binding-Tests + Alder + Giovanni-Pin

**Files:**
- Create: `src/lib/trainer-data.test.ts`
- Modify: `src/data/enriched/unova.json` (Alder only)
- Test: `src/lib/trainer-data.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from 'vitest';
import kanto from '@/data/enriched/kanto.json';
import unova from '@/data/enriched/unova.json';
import { trainersAtNode } from './trainer-data';

function leader(json: typeof kanto, node: string, name: string) {
  return json.nodes[node as keyof typeof json.nodes]?.trainers?.find((t) => t.name === name);
}

describe('FRLG Giovanni Viridian gym (Bulbapedia, FireRed/LeafGreen)', () => {
  it('is five Ground mons ending on Rhyhorn 50, not Rhydon', () => {
    const g = leader(kanto, 'viridian-city', 'Giovanni')!;
    expect(g.class).toBe('Leader');
    expect(g.party.map((m) => [m.species, m.level])).toEqual([
      ['rhyhorn', 45],
      ['dugtrio', 42],
      ['nidoqueen', 44],
      ['nidoking', 45],
      ['rhyhorn', 50],
    ]);
  });
});

describe('BW Champion Alder (Bulbapedia, Black/White league)', () => {
  it('uses Volcarona 77 as ace, no Haxorus, league levels', () => {
    const a = unova.nodes['unova-victory-road'].trainers.find((t) => t.name === 'Alder')!;
    expect(a.class).toBe('Champion');
    expect(a.party.map((m) => [m.species, m.level])).toEqual([
      ['accelgor', 75],
      ['bouffalant', 75],
      ['druddigon', 75],
      ['vanilluxe', 75],
      ['escavalier', 75],
      ['volcarona', 77],
    ]);
    expect(a.party.some((m) => m.species === 'haxorus')).toBe(false);
  });
});
```

`trainersAtNode` may not exist yet. Write the Giovanni/Alder tests against JSON first if the helper is Task 4. Prefer asserting JSON here so Task 1 does not depend on UI.

- [ ] **Step 2: Run tests, confirm Alder fails and Giovanni passes**

Run: `npx vitest run src/lib/trainer-data.test.ts`

- [ ] **Step 3: Replace Alder party in `unova.json`**

Moves (PokéAPI slugs), BW Champion:

- Accelgor 75: `bug-buzz`, `focus-blast`, `me-first`, `energy-ball`
- Bouffalant 75: `head-charge`, `megahorn`, `stone-edge`, `earthquake`
- Druddigon 75: `night-slash`, `outrage`, `superpower`, `payback`
- Vanilluxe 75: `blizzard`, `light-screen`, `flash-cannon`, `acid-armor`
- Escavalier 75: `x-scissor`, `giga-impact`, `iron-head`, `aerial-ace`
- Volcarona 77: `overheat`, `bug-buzz`, `quiver-dance`, `hyper-beam`

Do not touch Shauntal/Marshal/Grimsley/Caitlin. Do not change Giovanni.

- [ ] **Step 4: Tests green**

- [ ] **Step 5: Do not commit**

---

### Task 2: HM07 an dragons-den

**Files:**
- Modify: `src/data/items-johto.json`
- Modify: `src/lib/regions.test.ts` (or `src/lib/item-consistency.test.ts` / trainer-data.test.ts)

- [ ] **Step 1: Failing test**

```ts
import itemsJohto from '@/data/items-johto.json';

it('HGSS HM07 Waterfall is at dragons-den (Clair after the den), not ice-path', () => {
  const ice = itemsJohto['ice-path'] ?? [];
  const den = itemsJohto['dragons-den'] ?? [];
  const isHm07 = (i: { itemSlug?: string; moveSlug?: string; name?: string }) =>
    i.moveSlug === 'waterfall' || i.itemSlug === 'hm-water' || /HM07/i.test(i.name ?? '');
  expect(ice.filter(isHm07)).toHaveLength(0);
  expect(den.filter(isHm07)).toHaveLength(1);
});
```

- [ ] **Step 2: Watch it fail** (`npx vitest run` on that file)

- [ ] **Step 3: Move the HM07 object from `ice-path` to `dragons-den`.** Keep other ice-path balls. Keep the Clair note. Do not duplicate TM59 already on dragons-den.

- [ ] **Step 4: Green. No commit.**

---

### Task 3: Johto Pokémon-Liga Node

**Files:**
- Modify: `src/data/regions/johto.json`, `src/data/regions/johto-geo.json`, `src/data/enriched/johto.json`, `src/lib/regions.test.ts`

- [ ] **Step 1: Failing tests in `regions.test.ts`**

```ts
it('Johto league is johto-pokemon-league, not mt-silver', () => {
  const ids = nodeIds('johto');
  expect(ids.has('johto-pokemon-league')).toBe(true);
  const n = regionById('johto')!.nodes.find((x) => x.id === 'johto-pokemon-league')!;
  expect(n.nameDe).toBe('Pokémon Liga');
  expect(n.label).toBe('Pokémon League');
  expect(n.kind).toBe('special');
  expect(n.locationSlug).toBe('indigo-plateau');
  expect(n.postGame).toBeFalsy();
  expect(hasEdge('johto', 'tohjo-falls', 'johto-pokemon-league')).toBe(true);
  expect(johtoGeo.nodes['johto-pokemon-league']).toEqual(expect.any(Array));
});
```

Plus in trainer-data.test.ts: Will/Koga/Bruno/Karen/Lance live on `johto-pokemon-league`; `mt-silver` trainers empty or no E4.

- [ ] **Step 2: Fail because node missing**

- [ ] **Step 3: Add node** `order: 56`, schematic `x: 1188, y: 360`, `labelPos: "left"`. Geo `[0.97, 0.48]` (east of Johto, between Mt. Silver and Tohjo on the GS rip). Edge `{ from: "tohjo-falls", to: "johto-pokemon-league", kind: "land" }`. Move the five E4/Champ objects in `enriched/johto.json` from `mt-silver` to `johto-pokemon-league`. If `mt-silver` has no trainers left, drop the node key from enriched or leave `"trainers": []` — prefer delete the empty `mt-silver` key so `hasTrainersAtNode('johto','mt-silver')` is false.

Never rename `mt-silver`.

- [ ] **Step 4: Geo orphan test still green (`has a geo marker for every johto node`). Green. No commit.**

---

### Task 4: `trainersAtNode` + Picker-Gruppen

**Files:**
- Modify: `src/lib/trainer-data.ts`, `src/pages/detail/TrainerPicker.tsx`
- Modify: `src/i18n/locales/en/translation.json`, `src/i18n/locales/de/translation.json`
- Test: `src/lib/trainer-data.test.ts`, optionally `src/pages/detail/TrainerPicker.test.tsx` if that pattern exists; otherwise test grouping via a small exported helper `trainerGroupKey(t)` in `trainer-data.ts` to keep logic out of JSX.

- [ ] **Step 1: Failing tests**

```ts
it('kanto-route-1 has route trainers in the same join as gyms', () => {
  const list = trainersAtNode('kanto', 'kanto-route-1');
  expect(list.length).toBeGreaterThan(0);
  expect(list.some((t) => t.class === 'Leader')).toBe(false);
});

it('groups rivals and route trainers separately from leaders', () => {
  expect(trainerGroupKey({ class: 'Youngster', name: 'Ben', party: [], node: 'x' })).toBe('route');
  expect(trainerGroupKey({ class: 'Rival', name: 'Rival', party: [], node: 'x' })).toBe('rival');
  expect(trainerGroupKey({ class: 'Leader', name: 'Brock', party: [], node: 'x' })).toBe('leaders');
});
```

- [ ] **Step 2: Fail (helper missing)**

- [ ] **Step 3: Implement**

```ts
export function trainersAtNode(region: RegionId, nodeId: string): EnrichedTrainer[] {
  return trainersForRegion(region).filter((t) => t.node === nodeId);
}

export function trainerGroupKey(t: { class: string }): 'leaders' | 'e4' | 'boss' | 'rival' | 'route' {
  if (t.class === 'Leader') return 'leaders';
  if (t.class === 'Elite Four' || t.class === 'Champion') return 'e4';
  if (t.class === 'Boss') return 'boss';
  if (t.class === 'Rival') return 'rival';
  return 'route';
}
```

Picker: remove `trainers.filter((tr) => tr.important)`. Add GROUPS for rival and route. Search still filters the full list. i18n:

- en `versus.trainerGroupRival`: `Rivals`
- en `versus.trainerGroupRoute`: `Route trainers`
- de `versus.trainerGroupRival`: `Rivalen`
- de `versus.trainerGroupRoute`: `Routen-Trainer`

- [ ] **Step 4: Green. No commit.**

---

### Task 5: Drawer Trainer-Tab

**Files:**
- Modify: `src/pages/maps/DetailDrawer.tsx`
- Modify: i18n en+de `maps.*`

- [ ] **Step 1: Tests** if a drawer test file exists; otherwise add `src/pages/maps/trainers-drawer.test.ts` that only tests data wiring (`trainersAtNode` counts) plus a lightweight render test if Testing Library is already used in pages. Do not introduce a new test runner. If no RTL in pages, skip render test and keep helper tests; implement UI to match this spec exactly.

Tab type: `'encounters' | 'items' | 'trainers'`.

KPI: leave 4 columns (do not add a fifth). Count lives in the tab label.

Row: 36–44px, `<Sprite>` of ace (reuse `aceSpeciesForNode` or first party member), name, class as muted micro-label, party sprites max 6, `LocaleLink` to `/pokemon/${ace}?tab=versus&versusTrainer=${node.id}&region=${region.region}&game=${version}`.

Empty: `t('maps.noTrainers')`.

en:
- `trainersTab`: `TRAINERS {{count}}`
- `noTrainers`: `No trainers recorded for this place yet.`
- `planVersus`: `Plan versus`

de:
- `trainersTab`: `TRAINER {{count}}`
- `noTrainers`: `An diesem Ort sind keine Trainer erfasst.`
- `planVersus`: `Kampf planen`

German labels: no du-form. Keep `truncate min-w-0`. Inner list already has `data-lenis-prevent` on the scroll parent.

Footer Versus-Button bleibt, sichtbar wenn `hasTrainersAtNode`.

- [ ] **Step 2–4: TDD if render test exists; otherwise implement to spec, run `npx vitest run src/lib/trainer-data.test.ts src/lib/regions.test.ts`. No commit.**

---

### Task 6: Originalbild-Edition ehrlich labeln

**Files:**
- Modify: `src/lib/maps-geo.ts`, `OriginalCanvas.tsx` or `CommandBar.tsx` when view is original
- i18n en+de
- Test: `src/lib/maps-geo.test.ts` (create if missing)

`johto-geo.json` `version: "goldsilver"`, defaultVersion `heartgold`.
`unova-geo.json` `version: "black-2"`, defaultVersion `black`.
`sinnoh-geo.json` `version: "diamond"`, defaultVersion `platinum`.
`hoenn-geo.json` check live (likely ruby/sapphire vs emerald).
`kanto-geo.json` `firered` matches default.

Helper:

```ts
export function artworkVersionId(region: string): string | null {
  return originalGeoFor(region)?.geo.version ?? null;
}
```

Show chip only when `artworkVersionId !== region.defaultVersion`.

en `maps.artworkEdition`: `Image: {{version}}`
de `maps.artworkEdition`: `Bild: {{version}}`

Use existing `versionLabel` / `versionChipLabel` if the geo version string maps; otherwise a small map `goldsilver → Gold/Silber`, `black-2 → Black 2`. Do not swap JPG files.

- [ ] Tests: Johto artwork version is goldsilver and differs from heartgold; Kanto matches firered (no mismatch).
- [ ] No commit.

---

### Task 7: Verify

- [ ] `npx vitest run src/lib/trainer-data.test.ts src/lib/regions.test.ts src/lib/maps-geo.ts src/pages/detail/TrainerPicker.tsx` (adjust globs to files that exist)
- [ ] `npx tsc -b` 0 errors
- [ ] Key parity: grep new i18n keys in both locale files
- [ ] Confirm Giovanni JSON unchanged; Alder JSON has volcarona 77; HM07 not on ice-path; johto-pokemon-league in region+geo+enriched
- [ ] No `seo-routes` / prerender edits
- [ ] No commit unless asked
