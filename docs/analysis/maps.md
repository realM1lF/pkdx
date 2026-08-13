# Maps-Audit — 2026-08-13

Audit der Maps-Oberfläche und aller Map-Unterseiten (Atlas, Regions-Deck, SEO-Routenseiten Kanto/Hoenn). Kein Production-Code geändert. Evidenz aus Quellcode, Region-/Geo-/SEO-JSONs und einem Live-PokéAPI-Sample (`kanto-route-1-area`, Feebas-Encounters).

**Legende:** **verified** = im Code oder in den Artefakten nachgerechnet. **hypothesized** = plausibel, aber ohne Browser-Smoke oder ohne visuelle Overlay-Prüfung.

---

## Kurzfazit

Die Maps-Pipeline ist für das **Kanto-Default (Feuerrot/Blattgrün)** am saubersten: Slot-Summe pro Angelrute, Static/Gift getrennt, Route-1-Gras 50/50 Taubsi/Rattfratz stimmt mit Bulbapedia/PokéAPI. Der historische Rod-Mix-Bug (Horsea 170 %) ist in `mapdata.ts` und Tests gefixt.

Das größte offene Datenloch ist nicht FRLG, sondern **PokéAPI-`condition_values`**: Tageszeit, Schwarm, Radio (Hoenn-/Sinnoh-Sound) und Headbutt-Baumtypen sind gegenseitig ausschließend, werden aber wie zusätzliche Walk-Slots aufaddiert. Folge: GSC/HGSS-Tabellen mit Raten > 100 %, Schwarm-/Radio-Arten als normales Gras. Johto startet default auf **Gold**, nicht HGSS — genau die Edition, in der dieser Fehler sichtbar wird.

Weitere belastbare Punkte: Hoenn-Karte ohne 13 nummerierte Routen (106–107, 115, 122–123, 125–127, 130–134); Unova mischt BW- und B2W2-Orte ohne `postGame`; SEO-Seiten zeigen Kecleon mit 200–600 %; `?from=region:node` wird gesetzt, aber nie gelesen; Item-Kuratierung außerhalb Kanto/Hoenn ist dünn. Geo-Marker sind 1:1 zu den Schema-Knoten (keine Orphans) — Positionsgenauigkeit auf dem Artwork ist ungeprüft.

---

## Kritische / High Findings

### 1. [high] [verified] `condition_values` werden ignoriert — Raten > 100 %, Schwarm/Radio als Gras

**Evidence:** `src/lib/mapdata.ts` `chanceBucketKey` + `aggregateArea` (Z. 90–104, 352–366) summiert alle `walk`-Slots einer Art, ohne `condition_values`. Der SEO-Generator `scripts/generate-pokemon-seo.mjs` `bucketsFromDetails` (Z. 150–174) ebenso. Live-PokéAPI `kanto-route-1-area` / HeartGold:

| Art | Bedingungen | Angezeigte Rate (Snapshot) |
|---|---|---|
| Rattata (Gold) | morning 30 + day 30 + night 55 | **WALK 115 %** (`src/data/routes-kanto.json`) |
| Poochyena | `swarm-yes` 20+20 | WALK 40 % — als normales Gras |
| Plusle/Minun | `radio-hoenn` | WALK 20 % |
| Shinx | `radio-sinnoh` | WALK 40 % |
| Hoothoot Headbutt | `headbutt-tree-common` 50 + `headbutt-tree-rare` 50 | OTHER **100 %** |

Im Snapshot: **92 Kanto-Zeilen mit chance > 100**, fast nur Gold/Silber/Kristall/HG/SS. FRLG-Route-1 hat leere Conditions → 50/50 korrekt.

**Impact:** Johto-Default ist Gold (`src/data/regions/johto.json` Z. 14). Wer Johto öffnet, sieht inflated Grasraten. Kanto-SEO-Seiten mit HGSS-Toggle zeigen Radio-/Schwarm-Arten als Alltagsgras. Leaderboards (Top/Seltenste) erben dieselben Zahlen.

**Fix-Richtung:** Pro exakter Methode **und** exklusiver Condition-Gruppe (time-*, swarm-yes/no, radio-*, headbutt-tree-*) Slots summieren, dann MAX über exklusive Gruppen. UI: Schwarm/Radio/Headbutt als eigene Chips, nicht WALK. Tests analog zu `mapdata.test.ts` (Rods). Snapshot neu erzeugen.

---

### 2. [high] [verified] Johto-Default ist Gold, Produktvertrag ist HGSS

**Evidence:** `src/data/regions/johto.json` Z. 7–14: `versions` GSC+HGSS, `defaultVersion: "gold"`. Produktkontext: Johto = HeartGold/SoulSilver. RegionCard-Ära `GSC · HGSS` (`RegionCard.tsx` Z. 16–22) verschleiert den Default. Original-Geo: `"version": "goldsilver"` (`johto-geo.json`). Interaktive Links für Gold/Silber/Kristall zeigen bewusst die HGSS-Ironmon-Map (`interactive-maps.ts` Z. 62–63).

**Impact:** Erster Eindruck = Gen-2-Tabelle mit Finding 1. HGSS-Inhalte (Johto-Safari, Route 47/48, Klippenhöhle) fehlen in der Node-Liste komplett.

**Fix-Richtung:** `defaultVersion: "heartgold"`. Safari Zone + Route 47/48 als Nodes ergänzen (neue IDs, keine Rename). GSC bleibt als Chip.

---

### 3. [high] [verified] Hoenn-Karte fehlt ein Drittel der nummerierten Routen

**Evidence:** `src/data/regions/hoenn.json` enthält Routen 101–105, 108–114, 116–121, 124, 128–129. **Fehlen 106, 107, 115, 122, 123, 125, 126, 127, 130–134.** Coverage 0.94 bezieht sich auf vorhandene Nodes, nicht auf die Region. Dieselben IDs speisen Nuzlocke (`routeOrder`).

Weitere fehlende Hoenn-Orte (bewusst oder Lücke, siehe unten): Abandoned Ship, Seafloor Cavern, Cave of Origin, Jagged Pass, New Mauville, Trainer Hill, Battle Frontier, Magma/Aqua Hideout, Route 123 Beerenfelder.

**Impact:** Maps und Nuzlocke kennen Dewford↔Slateport-Wasserweg und den Pacifidlog-Ring nicht. SEO-Seiten existieren nur für gemappte Nodes (`HOENN_ROUTE_SLUGS`).

**Fix-Richtung:** Nodes + `route_key`s additiv anlegen (Contract: nicht umbenennen). Geo-Fraktionen + Kanten. Danach SEO-Generator.

---

### 4. [high] [verified] Unova: BW-Default, B2W2-Orte ohne `postGame`, Original-Artwork ist Black 2

**Evidence:** `unova.json` `defaultVersion: "black"` (Z. 13), `postGame: []` für die ganze Region. B2W2-Orte liegen in derselben Timeline-Order 42–50 ohne Flag: Aspertia, Floccesy Ranch, Virbank, Humilau, Routen 19–23. Geo: `"version": "black-2"` / `/maps/unova-original.jpg`. Interaktiv: Team Synergy, Kommentar „spawn data follows PokeMMO, not retail BW“ (`interactive-maps.ts` Z. 142–144).

Fehlende BW-Routen: 15, 17, 18, Village Bridge, Marvelous Bridge, P2 Laboratory, N’s Castle. Fehlende B2W2-Orte: Lentimas, Reversal Mountain, Seaside Cave, Strange House, Clay Tunnel, Castelia Sewers, Pokéstar, Hidden Grotto, …

**Impact:** BW-Nuzlocke-Timeline enthält Eventura/Dausing-Hof. B2W2-Spieler sehen Nuvema als Start. Original-Ansicht ist B2W2-Karte mit BW-Default. Externe Map ≠ Retail.

**Fix-Richtung:** B2W2-only Nodes `postGame: true` oder versions-Filter. Artwork-Variante oder klare Edition-Beschriftung. Interaktiv-Chip: Retail-Quelle oder Warnung lokalisiert.

---

### 5. [high] [verified] SEO-Raten können 200–600 % zeigen; Static-Flag leakt auf Wild-Zeilen

**Evidence:** Snapshot `routes-hoenn.json`: Kecleon Route 119 STATIC **200**, Route 120 STATIC **600** (ORAS 300). Generator `aggregateArea` addiert bei gleichem `id|bucket` (`generate-pokemon-seo.mjs` Z. 232–234) und setzt `isStatic` per gesamter `encounter_details`, nicht pro Bucket (Z. 242). Folge: Kecleon WALK 1 % (RSE-Gras) ist `isStatic: true`. `mapdata.ts` analog: ein Static-Slot markiert die ganze Art (`Z. 353–356`); Drawer zieht sie aus der Wildtabelle (`DetailDrawer.tsx` Z. 186–187).

`mapdata.ts` cappt auf 100 (`Z. 366`); der SEO-Generator nicht. Drawer und SEO-Seite können also **widersprechen**.

**Impact:** Prerendered HTML (Crawler) zeigt unmögliche Prozente. 1 %-Gras-Kecleon verschwindet im Drawer unter „Besonders“.

**Fix-Richtung:** Generator: MAX statt +=, cap 100, `isStatic` nur für STATIC-Bucket. Mehrere Devon-Scope-Kecleon als N×100 % Statics oder ein Eintrag „N Kecleon (Devon-Scope)“. Drawer: Art splitten, wenn Walk+Static.

---

### 6. [high] [verified] Feebas als 50 % FISH auf Route 119

**Evidence:** PokéAPI `feebas-tile-fishing:50` auf `hoenn-route-119-area` (R/S/E). `FISH_METHODS` enthält `feebas-tile-fishing` (`mapdata.ts` Z. 74–77). Snapshot: `feebas:FISH:50`. Im Spiel: nur 6 zufällige Kacheln, Angel (meist Angel) — nicht 50 % der ganzen Route.

**Impact:** Leaderboard/„häufigster Fang“ und SEO-Q&A können Barschwa als alltäglichen Fang listen. Verstößt gegen die Encounter-Regel „nicht über exklusive Methoden/Kontexte summieren bzw. flatten“.

**Fix-Richtung:** Eigene Methode/Hint „Barschwa-Kachel“, aus Wild-Leaderboards nehmen (wie Static).

---

### 7. [high] [verified] `methodTop` / KPI „Beste“ nutzt die Art-Max-Chance für jedes Bucket

**Evidence:** `loadNodeData` (`mapdata.ts` Z. 428–433): `bestRate` inkl. Statics; `methodTop[m] = e.maxChance` für **jedes** Bucket der Art. ScoutTooltip zeigt z. B. „W 70 %“, obwohl Walk 20 % und Fish 70 % sind (`ScoutTooltip.tsx` Z. 79–85). Drawer-KPI „Beste“ (`DetailDrawer.tsx` Z. 267) = `nd.bestRate` inkl. Pokéflöte-Relaxo 100 %. `spawnLeaders` filtert Static korrekt (`Z. 571`).

**Impact:** Tooltip und Filter-Dimming lügen bei gemischten Methoden. Route 12: BEST 100 % wegen Relaxo, Grasraten unsichtbar in der KPI.

**Fix-Richtung:** `methodTop` aus per-Bucket-Chance (nicht Art-Max). `bestRate` nur `!isStatic`.

---

## Medium / Low

### 8. [medium] [verified] Deep-Link `?from=region:node` ist tot

`DetailDrawer.tsx` Z. 55 setzt `/pokemon/${id}?from=${region}:${node}`. `PokemonDetail.tsx` liest `vs`, `game`, `tab`, `versusTrainer`, `region` — **nicht** `from`. Architektur (`docs/ai/architecture.md` Z. 76) verspricht den Contract. Kein Back-Link, kein Highlight in Where-to-Find.

`?node=` / `?v=` auf `/maps/:region` funktionieren (`MapRegion.tsx` Z. 78–88, 138–151). SEO-Seiten verlinken die Karte mit `?node=` und teils `?v=` (`RoutePage.tsx` Z. 585 vs. Z. 691 ohne `v`).

---

### 9. [medium] [verified] SEO vs. Map-Canvas: verschiedene Modelle, widersprüchliche Texte

- SEO: eine Zeile pro Art×Bucket, Snapshot, FR/Smaragd-Framing. Map: Live-PokéAPI, eine Zeile pro Art, kombinierte Methoden.
- Headbutt: Generator → OTHER (`generate-pokemon-seo.mjs` Z. 135–140, kein Headbutt-Fall); `mapdata.ts` → WALK (Z. 78–81).
- i18n behauptet noch „Summe der Encounter-Slots“ (`de/translation.json` `seo.route.encounterSource` Z. 2657, `seo.routeHoenn` Z. 2809, Route-1-Pilot Z. 2192), obwohl die *intendierte* Semantik MAX-pro-Methode ist (und GSC/HGSS durch Finding 1 tatsächlich summiert).
- Route-1-Q&A: „Nur zwei Arten“ (`seo.route1.qa`) bleibt stehen, während der Versionstoggle HGSS-Tabellen mit Sentret/Hoothoot/Radio einblendet.
- Stale Copy: `seo.route1.route22Note` „Eine eigene Seite folgt“ — Route 22 hat längst eine Seite.
- Hoenn-Q&A vergleicht Rubin vs. Saphir (`RoutePage.tsx` Z. 148–149), Framing ist Smaragd. Smaragd-exklusive Arten (z. B. Tropius 119) stehen nicht im Diff.
- `speciesCount` in der Q&A zählt Statics mit (`RoutePage.tsx` Z. 323–333 vs. `frWildRows` nur für Top/Seltenste).
- Best-Catch = max BST inkl. Gifts (`Z. 371–377`).

---

### 10. [medium] [verified] Versions-Mix auf Kanto, unvollständige Region

Kanto-Default `firered` ist korrekt. Zusätzlich RBY + GSC + HGSS (`kanto.json` Z. 7–18). Atlas-KPI `speciesCount: 203` mischt alle Editionen (`RegionCard.tsx` Z. 111). Label `GEN I` trotz FRLG-Default. Fehlende FRLG-Orte: Pokémon-Villa, Silph Co., Untergrundpfad, Sevii-Inseln (letzteres in Item-SEO-Texten bewusst dokumentiert). `pokemon-tower` hat **keine Kante** (isolierter Node, `kanto.json` Edges nur Lavandia↔Routen).

Original-Kanto-Artwork: FRLG (`kanto-geo.json` version `firered`) — passt zum Default.

---

### 11. [medium] [verified] Item-Löcher außerhalb Kanto/Hoenn

| Region | Nodes mit kuratierten Items | Items gesamt | Nodes ohne Items |
|---|---|---|---|
| Kanto | 28 / 46 | 100 + Enriched-Union | 18 |
| Hoenn | 40 / 48 | 220 | 8 |
| Johto | 8 / 43 | 22 | 35 |
| Sinnoh | 6 / 46 | 34 | 40 |
| Unova | 4 / 50 | 12 | 46 |

Enriched Hoenn deckt nur 9 Nodes; 39 Regions-Nodes ohne Trainer/Items aus Enrichment. Union-Logik `itemsForNode` / `seoItemsForNode` (`mapdata.ts` Z. 186–277) ist für Kanto/Hoenn korrekt (historischer Widerspruch Drawer vs. SEO ist gefixt).

---

### 12. [medium] [verified] Sinnoh-Lücken trotz Platinum-Default

Default `platinum` ist korrekt. Geo-Artwork `"version": "diamond"`. Fehlende Platinum-Orte u. a.: Kampfzone (Fight/Survival/Resort Area), Routen 219–230, Distortionswelt, Alter Friedhof/Old Chateau, Trophäengarten, Sendoff-Frühling, Amity Square. `postGame` nur Turnback Cave + Stark Mountain.

---

### 13. [medium] [verified] i18n: englische Editionsnamen, Hardcodes, DE-Reste

- `versionLabel` / `versionChipLabel` (`regions.ts` Z. 135–156) → „FIRE RED“, „HEARTGOLD“ in deutschem Drawer (`maps.edition`, `maps.noWild`).
- Hardcoded EN `aria-label` auf Canvas/Minimap (`MapCanvas.tsx` Z. 131, `OriginalCanvas.tsx` Z. 360, `Minimap.tsx` Z. 60).
- Original-Marker „POST“ statt i18n (`OriginalCanvas.tsx` Z. 253–256).
- DE: `maps.live` „Live-pokÉapi-daten“, `maps.topSpawns` „Top-spawns“, `maps.postGame` „Post-game“, `seo.route.encountersTitle` „Encounter-Tabelle“, `bestCatchEyebrow` „BEST CATCH“.
- `maps.howDataBody`: „Nichts hiervon ist ein Screenshot — alles SVG“ — Original-Ansicht ist VGMaps/PokéWiki-Rip (`OriginalCanvas.tsx` Z. 46–54).
- `methodSurf`: „Surfer“ (Attackenname) statt Methodenlabel „Surfen“.
- `SoonCard` „KALOS · ALOLA · GALAR · PALDEA“ hardcodiert (`RegionCard.tsx` Z. 191).
- Trainer auf SEO-Seiten: `tr.class` + `tr.name` englisch — dokumentierte Ausnahme (pret).

`nameDe` ist auf allen 5 Atlas-Nodes gesetzt (0 Lücken). **hypothesized:** „Dausing-Hof“ vs. offiziell „Dausing-Hofgut“.

---

### 14. [medium] [hypothesized] Lenis auf Mobile-Drawer

`DetailDrawer` `overflow-y-auto` ohne `data-lenis-prevent` (`DetailDrawer.tsx` Z. 310). LeftRail ebenso (`LeftRail.tsx` Z. 88). Desktop: `lenis?.stop()` (`MapRegion.tsx` Z. 116–127). Lenis `allowNestedScroll: true` (`smooth.ts` Z. 24). AGENTS.md §3.6 verlangt `data-lenis-prevent`. Ohne Browser-Smoke nicht bewiesen, dass der Drawer auf Mobile unscrollbar ist.

---

### 15. [medium] [verified] Externe Interaktiv-Links: falsches Spiel / Non-Retail

- Sinnoh Diamond/Pearl → URL `https://pkmnmap.com/Platinum/` mit Label „Diamond & Pearl“ (`interactive-maps.ts` Z. 124–132).
- Hoenn R/S → Emerald-Map, im Tooltip als Emerald deklariert (Z. 98–114) — ehrlich gelabelt, inhaltlich RS≠E.
- Unova → PokeMMO (Z. 142–144).
- Johto GSC → HGSS-Ironmon.

---

### 16. [low] [verified] SEO-Coverage-Lücken (kein Wild = keine Seite)

Kanto ohne Seite: Lavender Town, Indigo Plateau (Pewter nur GSC/HGSS-Headbutt im Snapshot, bewusst kein FRLG-Page). Hoenn ohne Seite: Oldale, Mauville, Mt. Chimney. Tests pinnten das (`seo-routes-kanto.test.ts` Z. 67–76). Kein Bug, aber Atlas „Als Seite öffnen“ fehlt dort.

---

### 17. [low] [verified] Sprite-Regeln

Pokémon in Drawer/Rail/SEO über `<Sprite>`. Item-Sprites sind `<img>` auf PokéAPI-Item-PNGs (`DetailDrawer.tsx` Z. 32–45) — Regel gilt für Pokémon, kein Verstoß. Empty-Items: `/pokeball.svg` `<img>` (Z. 421). LeftRail `Sprite name={leader.slug}` (EN-Slug als alt) — nit.

---

### 18. [nit] [verified] `overworld` / LGPE-Methoden unklassifiziert

PokéAPI Route 1 trägt `lets-go-*` / `overworld`. `methodBucket` → OTHER. LGPE ist kein Kanto-Chip (bewusst, Testkommentar AP5). Ungefährlich, solange kein Chip existiert.

---

### 19. [nit] [hypothesized] Geo-Koordinaten vs. Artwork

Alle 5 Regionen: 0 fehlende Geo-Keys, 0 Extra-Keys, Fraktionen in 0..1. Visuelles Overlay (PIL, `architecture.md` Z. 90–92) nicht gelaufen. Unova-B2W2-Artwork + BW-Nodes und Sinnoh-Diamond-Artwork + Platinum-Nodes sind die wahrscheinlichsten Verschieber.

---

## Datenlücken (bewusst vs Bug)

| Lücke | Einschätzung |
|---|---|
| Sevii-Inseln | **Bewusst.** Item-SEO sagt explizit, die Kanto-Karte deckt sie nicht ab. |
| Kalos/Alola/Galar/Paldea | **Bewusst.** SoonCard; JSON existiert unter `src/data/regions/` liegt aber nicht in `REGIONS`. |
| Pewter/Lavender/Indigo ohne FRLG-SEO-Seite | **Bewusst.** Keine FRLG-Wilddaten; Snapshot-Test. |
| Trainer-Namen englisch | **Bewusst.** AGENTS.md §6. |
| Hoenn-Enrichment nur 9 Nodes | **Teil-Rollout**, wirkt wie Lücke (keine Trainer auf den meisten SEO-Seiten). |
| Johto/Sinnoh/Unova-Items dünn | **Unfertig**, ehrliches Empty „noch nicht kuratiert“. |
| Johto-Safari, R47/48 | **Bug/Gap** relativ zum HGSS-Vertrag, nicht als bewusst dokumentiert. |
| Hoenn R106–107, 115, 122–134 | **Gap**, nicht dokumentiert. |
| Unova R15/17/18, B2W2-Mischung | **Gap** + Versions-Mix. |
| Distortionswelt / Kampfzone | **Gap** relativ zu Platinum. |
| Pokémon-Villa, Silph Co. | **Gap** (FRLG-relevant). |
| ORAS auf Hoenn-Map | **Bewusst additiv** (wie HGSS auf Kanto). Default Smaragd ist korrekt. |
| GSC auf Kanto-Map | **Bewusst** (Postgame); Datenqualität durch Finding 1 schlecht. |

`coverage` / Chip FULL (Kanto 1.0) = „alle *vorhandenen* Nodes haben Encounter-Daten“, nicht „Region vollständig“.

---

## Was stimmt

- **FRLG Route 1:** Taubsi 50 % Lv 2–5, Rattfratz 50 % Lv 2–4, FR=LG. Verified gegen PokéAPI + Snapshot + Pilot-Q&A.
- **Angel-Semantik (FRLG):** Slots pro Rute, dann MAX. Test `mapdata.test.ts` Horsea 70 % statt 170 %. Route 19 Snapshot: Karpador FISH 100 (Angel), Seeper 80 (beste Rute) — nicht mehr 170.
- **Static vs Wild (Drawer + Leaderboard):** `STATIC_METHODS` inkl. pokeflute/npc-trade/devon-scope; Route 12 Relaxo STATIC 100; `spawnLeaders` skippt Static.
- **Defaults:** Kanto `firered`, Hoenn `emerald`, Sinnoh `platinum`, Unova `black` — vier von fünf passen zum Produktvertrag (Johto nicht).
- **Shared Region Contract:** Maps und Nuzlocke lesen dieselben `src/data/regions/*.json`. Keine orphan `route_key`s zwischen den beiden. `nameDe` überall. Geo-IDs = Node-IDs.
- **Deep Links Karte:** `?node=` + `?v=` inkl. URL-Sync und Fly-to.
- **Locale-Routing:** `/:lang/maps`, `LocaleLink`, SEO-Slugs DE/EN (Vertania-Wald / viridian-forest).
- **Item-Union** Kanto/Hoenn nach dem Consistency-Fix.
- **Pokémon-Sprites** über `<Sprite>`, Pixel-Eras.
- **Fehlerfarbe:** Shake gold, nie rot (`MapRegion.tsx` Method-Toggle).
- **Tests:** Rod-Invarianten, Kanto-Slug-Regression, Hoenn-Node-Existenz, Where-to-Find Static-Split.

---

## Empfohlene nächste Checks (Browser-Smoke)

Konkret, beide Locales `/de/…` und `/en/…`, Konsole auf i18next-Missing-Keys:

1. `/de/maps/johto` — Default-Chip Gold? Route 29 Grasraten > 100 %? Auf HeartGold umschalten.
2. `/de/maps/kanto?node=kanto-route-1&v=heartgold` vs `/de/maps/kanto/route-1` HG-Toggle — Poochyena/Shinx/Plusle als Gras? Hoothoot 100 %?
3. `/de/maps/kanto?node=kanto-route-1&v=firered` — 50/50, keine >100 %.
4. `/de/maps/kanto?node=kanto-route-12&v=firered` — Relaxo unter Besonders; KPI BEST; Leaderboard ohne Relaxo.
5. `/de/maps/kanto?node=kanto-route-19&v=firered` — Seeper ≤ 100 %, Ruten nicht gemischt.
6. `/de/maps/hoenn?node=hoenn-route-119&v=emerald` vs `/de/maps/hoenn/route-119` — Barschwa 50 % FISH? Kecleon 200 % auf der SEO-Seite, Drawer ≤ 100 %?
7. `/de/maps/hoenn` — Route 106/115/123 in der Suche? Nuzlocke-Wizard dieselben Lücken.
8. `/de/maps/unova?v=black` — Eventura City sichtbar? `?v=black-2` — Nuvema noch da? Original-Ansicht vs Schema.
9. `/de/pokemon/16?from=kanto:kanto-route-1` — Query ignoriert? Where-to-Find-Link zurück auf die Karte.
10. Mobile (`<1024px`): Drawer-Encounterliste scrollen (Lenis). Original-View Unova/Sinnoh Marker vs Artwork stichprobenartig (Route 1 / Zweiblattdorf / Avenitia).
11. `/de/maps/kanto?node=pokemon-tower` — „Zwischen …“ leer (keine Nachbarn).
12. Interaktiv-Chip Sinnoh `?v=diamond` — landet die URL auf Platinum?

Nach einem Fix von Finding 1: `npx vitest run src/lib/mapdata.test.ts src/lib/seo-routes-kanto.test.ts src/lib/seo-routes-hoenn.test.ts` und Snapshot `npm`-Skript für `routes-kanto.json` / `routes-hoenn.json` neu bauen, dann prerendered `dist/**/maps/**/index.html` auf „200 %“ / „Poochyena“ greppen.
