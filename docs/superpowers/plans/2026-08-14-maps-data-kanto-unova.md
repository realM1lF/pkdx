# Maps-Daten Kanto–Einall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Karten-Daten (Nodes, Kanten, Geo, Items) für Hoenn → Johto → Sinnoh → Einall → Kanto an die Binding-Version angleichen. Kein SEO, kein Versus, keine Trainer-Parties.

**Architecture:** Shared Region Contract in `src/data/regions/{id}.json` (Maps + Nuzlocke). Geo-Fraktionen in `{id}-geo.json`. Items in `src/data/items-{region}.json`. Wildfang bleibt Live-PokéAPI über `locationSlug`. Pro Region: Fact-checker (read-only) → Cartographer → Fact-checker erneut. Code-Review nur bei TS-Diff.

**Tech Stack:** Node 20, React 19, Vite 7, Vitest, vorhandene `regions.test.ts` / `item-consistency.test.ts`. Sub-Agents: Cursor Grok 4.6 High Fast. Kein Commit ohne expliziten User-Auftrag.

**Spec:** `docs/superpowers/specs/2026-08-14-maps-data-kanto-unova-design.md`

---

## File map

| Datei | Rolle |
|---|---|
| `src/data/regions/{kanto,johto,hoenn,sinnoh,unova}.json` | Nodes, edges, defaultVersion, order, nameDe, locationSlug, postGame |
| `src/data/regions/{id}-geo.json` | node id → `[x,y]` 0..1 auf Original-Artwork |
| `src/data/items-{region}.json` | CuratedItem-Listen keyed nach node.id |
| `src/lib/regions.test.ts` | Contract-Tests (IDs, Kanten, postGame, Defaults) |
| `src/lib/item-consistency.test.ts` | Item-Keys müssen Node-IDs sein (Hoenn/Kanto schon) |
| `src/lib/mapdata.ts` | **nicht** anfassen außer Spec ändert sich |
| `src/data/enriched/*.json` | Trainer **nicht** anfassen |

Node-Shape (additiv, nie Rename):

```json
{
  "id": "abandoned-ship",
  "label": "Abandoned Ship",
  "kind": "dungeon",
  "x": 0,
  "y": 0,
  "order": 62,
  "locationSlug": "abandoned-ship",
  "nameDe": "Schiffswrack"
}
```

`x`/`y` im Schema-Atlas: Nachbarn in derselben JSON als Anker, viewBox `0 0 1200 840`. Geo-Fraktionen unabhängig setzen. `order` = max(order)+1 außer der Graph verlangt eine Lücke (nicht bestehende orders umnummerieren).

Kante:

```json
{ "from": "hoenn-route-108", "to": "abandoned-ship", "kind": "water" }
```

Item:

```json
{
  "itemSlug": "dive-ball",
  "name": "Dive Ball",
  "note": "Abandoned Ship — storage room (Emerald)",
  "pocket": "BALLS"
}
```

Slugs englisch. `name` Display EN (wie bestehende Items-Dateien). `note` nennt Binding-Spiel.

---

### Task 1: Hoenn Fact-inventory

**Files:** keine Writes außer optional Agent-Report im Chat. Read: `src/data/regions/hoenn.json`, `hoenn-geo.json`, `src/data/items-hoenn.json`, `src/lib/regions.test.ts`, Spec.

- [ ] **Step 1: Live-Stand zählen**

Nummerierte Routen 101–134: welche IDs fehlen wirklich? (Stand 14.08.: 106/107/115/122/123/125–127/130–134 sind da, Tests grün.) Geo-Keys vs Node-IDs. Item-Keys vs Node-IDs. Liste Nodes ohne Items.

- [ ] **Step 2: Binding-Liste Smaragd**

Gegen PokéWiki/Bulbapedia **Emerald** (nicht ORAS): spielrelevante Innenräume. Kandidaten aus Spec: Abandoned Ship, Jagged Pass, New Mauville, Seafloor Cavern, Cave of Origin, Magma Hideout, Aqua Hideout. Battle Frontier / Trainer Hill / Contest = Skip.

Pro Kandidat: PokéAPI `location` slug (falls vorhanden), Nachbar-Node für die Kante, Item-Bälle die auf der Karte erscheinen sollen.

- [ ] **Step 3: Report**

Tabelle: id | ADD-Node / ADD-Items / FIX-Geo / OK / SKIP | locationSlug | Kante von/zu | Begründung. Keine erfundenen Koordinaten im Report, nur Anker-Node („östlich Route 108“).

**Done when:** Cartographer kann die Tabelle 1:1 abarbeiten ohne Wiki.

---

### Task 2: Hoenn Cartographer

**Files:**
- Modify: `src/data/regions/hoenn.json`
- Modify: `src/data/regions/hoenn-geo.json`
- Modify: `src/data/items-hoenn.json`
- Modify: `src/lib/regions.test.ts`
- Test: `npx vitest run src/lib/regions.test.ts src/lib/item-consistency.test.ts`

- [ ] **Step 1: Failing tests for every ADD-Node from Task 1**

Pattern (echte IDs aus dem Fact-Report, nicht diese Platzhalter wenn der Report anders lautet):

```ts
describe('hoenn remaining map data', () => {
  it('includes story dungeons from the fact inventory', () => {
    const ids = nodeIds('hoenn');
    for (const id of FACT_ADD_NODE_IDS) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it('wires each new dungeon to its neighbor', () => {
    for (const [a, b] of FACT_NEW_EDGES) {
      expect(hasEdge('hoenn', a, b), `${a}–${b}`).toBe(true);
    }
  });
});
```

Run: `npx vitest run src/lib/regions.test.ts` — FAIL auf fehlende IDs.

- [ ] **Step 2: Add nodes, edges, nameDe, locationSlug**

Nur IDs aus dem Report. `kind: "dungeon"` für Innenräume, `"route"` für Routen. `locationSlug` exakt PokéAPI. `nameDe` offizieller DE-Name (Schiffswrack, Steilpass, Neu Mauville, Tiefseehöhle, Urzeithöhle, Magma Hideout / Team Magmas Versteck, Aqua Hideout / Team Aquas Versteck — Fact-checker pinnt den Wiki-Namen).

Schema-`x`/`y`: zwischen den Nachbarn auf viewBox 1200×840, nicht (0,0) aufeinander stapeln.

- [ ] **Step 3: Geo fractions**

Jeder neue Node in `hoenn-geo.json`. Artwork `version` bleibt `rubysapphire` (bestehend). Fraktionen 0..1, Anker = Nachbar-Marker. Keine Orphans: jeder Node-ID ein Geo-Key, kein Geo-Key ohne Node.

- [ ] **Step 4: Items**

`items-hoenn.json`: Keys nur existierende node.ids. Meer-Routen 106/107/115/122/123/125–134 und neue Dungeons: sichtbare Bälle + Key/HM/TM laut Emerald. Hidden mit `"hidden": true`. Nicht ORAS-Exklusives. Nicht NPCs als Item erfinden.

- [ ] **Step 5: Tests green**

`npx vitest run src/lib/regions.test.ts src/lib/item-consistency.test.ts`

- [ ] **Step 6: Self-review, no commit**

Kein `route_key` Rename. Kein SEO. Kein enriched-Trainer. Coverage-Zahl in hoenn.json nur anfassen wenn sie aus bestehender Logik kommt, sonst liegen lassen.

---

### Task 3: Hoenn verify

**Files:** read-only plus Fix-Dispatch wenn Lücken.

- [ ] Fact-checker: Report vs Diff. Jede ADD-Zeile im Tree? Items Binding Emerald? locationSlug existiert?
- [ ] Code-Reviewer nur bei TS-Diff in `regions.test.ts` / mapdata. JSON-only: Spec-Review reicht.
- [ ] Fail → Cartographer-Fix, dann erneut. Kein „close enough“.

---

### Task 4: Johto (gleiche Pipeline)

Binding **HeartGold/SoulSilver**. Default ist bereits `heartgold`. Audit-Reste prüfen, nicht annehmen: Safari, Route 47/48, Cliff Cave stehen bereits in Tests.

Fact-inventory: fehlende HGSS-Orte (Tohjo Falls, Embedded Tower, Safari-Innen? nur wenn eigener locationSlug). Items: `items-johto.json` ist dünn (Stand Audit: 22 auf 8 Orten). Füllen analog Hoenn.

Files: `johto.json`, `johto-geo.json`, `items-johto.json`, `regions.test.ts`.

---

### Task 5: Sinnoh

Binding **Platin**. Default `platinum`. Kandidaten: Kampfzone (Fight/Survival/Resort Area), Routen 219–230, Distortionswelt, Alter Friedhof, Sendoff-Frühling — Fact-checker entscheidet ADD vs SKIP (PokéAPI slug?). Items `items-sinnoh.json`. Geo-Artwork ist Diamond; Marker trotzdem setzen, nicht Artwork tauschen.

---

### Task 6: Einall

Binding **Schwarz/Weiß**. Default `black` bleibt. B2W2-only: `postGame: true` (Aspertia-Cluster steht teils schon so in Tests). Fehlende BW-Routen 15/17/18, Village Bridge, Marvelous Bridge, P2 Lab, N’s Castle: Fact-checker. Keine Humilau-als-8.-Arena-Logik anfassen (Nuzlocke, anderer Lauf). Items `items-unova.json`.

---

### Task 7: Kanto

Schon tief. Fact-inventory: Pokémon-Villa, Silph Co., Untergrundpfad, Tower-Kante (`pokemon-tower` isoliert?). Sevii = SKIP. Items nur wo Node leer und FRLG Bälle hat. `enriched/kanto.json` Items nicht duplizieren wenn curated+enriched Union sie schon zeigt.

---

## Globale Verbote

- `git commit` / `git push` nur nach User-Auftrag
- `mapdata.ts` Encounter-Aggregation nicht umbauen
- SEO-Generator, `routes-*.json`, Versus, Trainer-Parties
- Node-IDs umbenennen (`kalos-kalos-route-1`-Muster nicht nachmachen)
- Hardcodierte UI-Strings; `nameDe` auf den Node, Item-`name` bleibt EN wie die Datei
- Lenis/Drawer/Sprite-Refactors
