# PKDX — Player/UX-Audit

Strukturierte Bestandsaufnahme der App aus Spieler- und Navigationsperspektive.

**Stand:** Juli 2026 · **Repo:** pkdx (Pokédex 2.0)

> **Hinweis Routing:** Alle App-Routen leben unter `/:lang/…` (`/de/…`, `/en/…`).
> Unpräfixierte Legacy-URLs werden per `LangGate` auf die erkannte Sprache umgeleitet.
> In den Tabellen unten sind Pfade ohne Sprachpräfix angegeben — effektiv z. B. `/de/pokedex`.

---

## 1. Routen-Übersicht

| Route | Seite | Lazy-Import |
|-------|--------|-------------|
| `/` | Home (Landing, Preloader, Marketing) | `Home.tsx` |
| `/pokedex` | National Dex Grid/List | `Pokedex.tsx` |
| `/pokemon/:id` | Detail-Dashboard + **Versus-Tab** | `PokemonDetail.tsx` |
| `/maps` | Region-Atlas (5 Regionen) | `Maps.tsx` |
| `/maps/:region` | Interaktive Regionskarte | `MapRegion.tsx` |
| `/nuzlocke` | Run-Hub (Wizard, Join-by-Code) | `Nuzlocke.tsx` |
| `/nuzlocke/:runId` | Run-Deck + **Versus-Tab** | `NuzlockeRun.tsx` |
| `/team` | Team Builder (+ `#team=` Share-Hash) | `TeamBuilder.tsx` |

**Kein eigener `/versus`-Route.** Versus lebt als Tab auf Detail (`?vs=<id>`) und im Nuzlocke-Run.

**Tote Links (nicht in `App.tsx` geroutet):**

- `/nuzlocke/new?region=…` — verlinkt in `RegionCard.tsx` und `DetailDrawer.tsx`, führt zu „Run not found“
- `/nuzlocke/new?region=…&at=…` — gleiches Problem aus dem Map-Drawer

Quelle: `src/App.tsx`

---

## 2. Globale Shell & Navigation

### Navbar (`Navbar.tsx`)

Links: Pokédex · Maps · Nuzlocke · Team · globale Suche (`/` Hotkey) · Shiny-Toggle · DE/EN-Switch.

### Layout (`Layout.tsx`)

Scroll-Reset pro Route, Footer, Back-to-top, Cursor-Spotlight, `SearchCommand` modal.

### Footer (`Footer.tsx`)

Nur **Home**, **Pokédex**, **Random Pokémon** — **keine** Links zu Maps, Nuzlocke, Team, Versus.

### IA-Bewertung

| Stärke | Schwäche |
|--------|----------|
| Klare 4-Säulen-Nav | Footer und Navbar inkonsistent |
| URL-synced Filter (`/pokedex?type=…&gen=…`) | Versus nirgends in Nav/Footer auffindbar |
| Home-Toolkit verlinkt alle Features | Detail-Seite hat keine Querverweise zu Maps/Team |
| Maps ↔ Dex via Where-to-Find & Drawer | **Broken** Nuzlocke-Deep-Links von Maps |
| Team ← Nuzlocke Import | Team-VS-Link mit leerem `?vs=` |

---

## 3. Feature-Inventar pro Bereich

### Home (`/`)

**Dateien:** `Home.tsx`, `home/Hero.tsx`, `SearchGateway.tsx`, `Spotlight.tsx`, `TypeSpectrum.tsx`, `GenerationsRail.tsx`, `Features.tsx`, `StatsBand.tsx`

| Block | Inhalt | Datenquelle |
|-------|--------|-------------|
| Preloader | Session-Pokeball | lokal |
| Hero | 3D/Particle-Backdrop, CTAs → Pokédex, Random Dex | hardcoded Spotlight-IDs |
| Search Gateway | Inline-Suche + Popular-Type-Chips | PokéAPI name index |
| Spotlight | Rotierende Featured Mons | PokéAPI (lazy) |
| Type Spectrum | 18 Typen mit Exemplar-Trios | hardcoded `TYPE_EXEMPLARS` |
| Generations Rail | Gen I–IX → `/pokedex?gen=N` | `GENERATIONS` in `types.ts` |
| Features | 3 Live-Demos + 4 Toolkit-Karten | Demo hardcoded; Links live |
| Stats Band | 1025 / 18 / 9 / 10000+ Sprites | Marketing-Zahlen |

**Fehlt vs. typische Player-Erwartung:** Living Dex, TCG (Roadmap locked), kein direkter Einstieg „Continue last run“.

---

### Pokédex (`/pokedex`)

**Dateien:** `Pokedex.tsx`, `components/pokedex/*`, `dex-data.ts`

| Feature | Details |
|---------|---------|
| Filter | Suche, Typ (multi), Gen 1–9, Legendary/Mythical, Sort (ID, Name, Height, Weight, BST) |
| Density | Comfort / Compact / List — persisted |
| Infinite scroll | 96er Batches |
| Offline | Gold-Banner, cached dex |
| Shiny | Global + URL `?shiny=1` |

**Daten:** PokéAPI `pokemon` + `pokemon-species`; Typ-Filter via `/type/{t}`; Legendary/Mythical via **hardcoded ID-Sets** in `dex-data.ts` (nicht live aus Species-Flags).

**Fehlt:** Formen (Regional, Mega, Gigantamax), Catch-Status, Sort nach Typ/BST ohne Warte-Gate bei großen Filtern ist ok aber spürbar.

---

### Pokémon Detail (`/pokemon/:id`)

**Dateien:** `PokemonDetail.tsx`, `detail/*`

#### Tab OVERVIEW

| Panel | Inhalt | Quelle |
|-------|--------|--------|
| HeroPanel | Artwork, Cry, Shiny, Flavor, Quick Facts | PokéAPI pokemon + species |
| CombatPanel | 6 Stats, Radar, BST-Ring | PokéAPI base stats |
| MovesPanel | Move-Tabelle nach Method/Version | PokéAPI moves + `getMove` |
| SideStack | Abilities, Type-Matchup-Matrix, Breeding | PokéAPI + **hardcoded CHART** in `detail/data.ts` |
| EvolutionPanel | Family tree, conditions | PokéAPI evolution-chain |
| WhereToFind | Spawn-Orte → Map deep links | PokéAPI `pokemon/{id}/encounters` → `regions.json` slug mapping |
| SpriteMuseum | Multi-Era Sprite-Grid | PokeAPI Sprites CDN via `sprites.ts` |
| PrevNextStrip | Dex-Navigation | lokal MAX_DEX_ID |

#### Tab VERSUS (`?vs=<opponentId>`)

**Dateien:** `detail/VersusPanel.tsx`, `lib/versus.ts`

| Feature | Details |
|---------|---------|
| Gegner-Picker | Autocomplete (National Dex) | PokéAPI |
| Damage-Matrix | OHKO-Chips, Effektivität, Speed check | **@smogon/calc Gen 9** |
| Movesets | Wild (level-up pool) → Assumed (STAB-Heuristik) | PokéAPI moves + `getMove` |
| Tuning | Level, Nature, EVs, custom moves | lokal |

**Kein Trainer-Picker** auf der Detail-Versus-Seite (nur Wild/Assumed). Trainer-Daten nur im Nuzlocke-Versus (Kanto).

**Fehlt:** Items/Abilities im Kampf, Wetter, Status, Gen-spezifische Mechanik, Link „Add to Team“.

---

### Maps (`/maps`, `/maps/:region`)

**Dateien:** `Maps.tsx`, `MapRegion.tsx`, `maps/*`, `lib/regions.ts`, `lib/mapdata.ts`, `data/regions/*.json`, `data/items-*.json`

| Feature | Details |
|---------|---------|
| Atlas | 5 Regionen (Kanto–Unova), Soon-Card für Kalos+ | lokale JSON |
| Schematic Canvas | Zoom, Minimap, Method-Filter (WALK/SURF/FISH/OTHER) | SVG + PokéAPI |
| Original Canvas | **Nur Kanto** (`kanto-geo.json`) | lokal |
| Detail Drawer | Encounters, Items-Tab, Link zu Dex | PokéAPI locations + **curated items JSON** |
| Version switch | Pro Region (`?v=`) | PokéAPI pro game version |
| Deep links | `?node=` fly-to | URL-synced |

**Coverage (audit-Feld in JSON):** Kanto 100%, Johto 98%, Hoenn 94%, Sinnoh 89%, Unova 92%.

**Datenvalidität:**

- Encounters live aus PokéAPI — bekannte Abweichungen zu In-Game-Tabellen möglich
- Items manuell kuratiert — viele Routen zeigen „0 ITEMS“
- Schematic ≠ maßstabsgetreu (bewusst)

**Fehlt:** Kalos–Paldea, HM/Tutor-Gates, Repel-Rates, Time-of-day, Swarm/Radar-spezifische UI.

---

### Team Builder (`/team`)

**Dateien:** `TeamBuilder.tsx`, `teambuilder/*`, `lib/teambuilder.ts`

| Feature | Details |
|---------|---------|
| 6 Slots | Drag-reorder, Pick, Level, 4 Moves, Item, Ability, Nature, EVs | |
| Game selector | RBY → SV (22 version groups) | `@pkmn/data` + `@pkmn/dex` |
| Legality | Per-slot flags (species, moves, items…) | gen-aware |
| Analysis Deck | Defensive Synergy · Offensive Coverage · **Smogon OU Meta** | `@pkmn/data` chart + **data.pkmn.cc gen9ou** |
| Persist | localStorage draft + saved teams | |
| Share | URL hash `#team=` | |
| Import | From Nuzlocke runs | `nuzlocke-store.getRunTeam` |

**Meta-Snapshot:** immer Gen-9-OU — passt nicht zu RBY/HGSS-Teams.

**Fehlt:** IV/HP-Stat, Team vs Team, Export Showdown-Format, „Suggest 6th mon“.

---

### Nuzlocke (`/nuzlocke`, `/nuzlocke/:runId`)

**Dateien:** `Nuzlocke.tsx`, `NuzlockeRun.tsx`, `nuzlocke/*`, `lib/nuzlocke-store.ts`, `lib/supabase.ts`

| Feature | Details |
|---------|---------|
| Hub | Run-Grid, New Run Wizard, Join SOUL-XXXX | |
| Solo | localStorage (`pdx2.nuz.*`) | |
| Multi | Supabase Realtime + Presence | env oder Fallback-Key |
| Timeline | Route-Karten in Map-Order, SoulLink-Overlay | `regions.json` node.order |
| Quick Entry | Route → Species autocomplete | Map encounter data + optional **Full Dex** override |
| Team Grid / Box / Graveyard | Status caught/dead/missed/duped | |
| Rules | Dupes, Shiny, SoulLink, Level Cap (manual) | `DEFAULT_RULES` |
| Feed | Live activity log | |
| Versus Tab | Best-Answer-Ranking vs Trainers (all map regions) or Wild | `data/enriched/{region}.json` + shared VersusPanel |

#### Nuzlocke-Regeln — Unterstützung vs. Realität

| Regel | UI | Durchsetzung |
|-------|-----|--------------|
| One encounter per route | Timeline slots | ✅ blockiert Duplikat-Log |
| Dupes Clause | Toggle + Hint | ⚠️ nur „route already logged“; kein Species-Dupe-Check |
| Shiny Clause | Toggle | ⚠️ deklarativ, keine Shiny-Erkennung |
| Nicknames | Wizard: immer ON, disabled | ⚠️ optional im Form, **nicht erzwungen** |
| Level Cap | Manueller Stepper | ⚠️ nur Gold-Warnung „Above cap“, kein Block |
| SoulLink | Toggle + Pairing-Logik | ✅ Links, Cascade, Feed |
| Fail run | „RUN FAILED — PRESS F“ | ✅ dimmt Timeline |

**Regionen:** Wizard nutzt dieselben 5 wie Maps — **kein** Kalos+.

**Fehlt:** Badge-Progress, Auto level caps per Leader, Death = release enforcement, Gift/Static route rules, Export/share run summary.

---

### Versus (embedded)

Zwei Entry Points:

1. **Detail:** `/pokemon/:id?vs=<foeId>` — freier 1v1-Vergleich
2. **Nuzlocke Run:** Team/Box vs Kanto-Trainer oder Wild + **SAFE/OK/RISKY/AVOID** Ranking

**Math:** durchgehend Gen-9 `@smogon/calc` (`lib/versus.ts`), auch wenn Run-Game FRLG ist.

**Trainer-Daten:** `src/data/enriched/{region}.json` — Kanto (pret/pokefirered, vollständig), Johto–Unova (Gym/E4/Champion kuratiert). Maps-Drawer verlinkt auf Detail-Versus (`?tab=versus&versusTrainer=`).

#### Community-Wünsche (Versus-Overhaul)

| Wunsch | Status |
|--------|--------|
| Trainer-Daten Johto–Unova (Gym/E4/Champion) | ✅ `johto.json` … `unova.json` |
| Maps → „Gegen Leader planen“ | ✅ `DetailDrawer.tsx` |
| Nuzlocke → Team Builder (sichtbarer Link) | ✅ `RunHeader.tsx` |
| Detail Trainer-Picker | ⚠️ geplant (Phase 3.2) |
| Nuzlocke multi-region Trainer-Modus | ⚠️ geplant (Phase 3.4) |
| Nav/Footer Versus-Auffindbarkeit | ⚠️ geplant (Phase 0.2) |
| Gen-korrekte Calc pro Run | ⚠️ geplant (Phase 1.x) |

---

## 4. Datenquellen-Matrix

| Quelle | Verwendung |
|--------|------------|
| **PokéAPI** | Dex, Detail, Moves, Encounters, Locations, Evolution, Abilities, Sprites-Metadaten |
| **Local JSON** | Region-Geometrie (`data/regions/`), Items (`items-*.json`), Kanto-Trainer (`enriched/kanto.json`), Kanto-Geo |
| **Supabase** | Nuzlocke Multiplayer (optional) |
| **Smogon / @smogon/calc** | Versus damage, KO ranges |
| **data.pkmn.cc** | Team Builder OU meta sets |
| **@pkmn/data + @pkmn/dex** | Team legality, gen-aware types/items/abilities |
| **Hardcoded** | Type charts (detail + versus), Legendary/Mythical IDs, Gen ranges, FIXED_DAMAGE moves, SPECIAL_NAMES |

**Caching:** `pokeapi.ts` — localStorage SWR, 7-Tage-TTL.

---

## 5. Datenvalidität — konkrete Risiken

1. **Gen-Mismatch Versus:** FRLG-Run, aber Gen-9-Schaden und neueste Move-Pools (`newestVersionGroup`) — irreführend für Story-Runs.
2. **Doppelte Type-Charts:** `detail/data.ts` und `versus.ts` — Wartungsrisiko, aber konsistent (Gen VI+).
3. **Move-Genauigkeit:** Heuristik `power × (acc/100)`; null accuracy = 100 angenommen; Legacy-Moves teils Fixed-Damage-Hacks.
4. **Where to Find:** Best rate über **alle** Versionen aggregiert — nicht spiel-spezifisch.
5. **Legendary-Filter:** Hardcoded Sets — können hinter PokéAPI zurückbleiben.
6. **PokéAPI Encounters ≠ ROM:** besonders ältere Gen, Area-Slug-Mapping heuristisch (`WhereToFind.tsx`).
7. **Items:** kuratiert, lückenhaft — „0 ITEMS“ ist oft Datenlücke, nicht „keine Items“.
8. **Smogon Meta:** Gen 9 OU für jedes Team-Game.
9. **Nuzlocke Full Dex toggle:** erlaubt beliebige Species unabhängig von Route-Encounters.

---

## 6. Lücken vs. typische Pokémon-Spielerbedürfnisse

| Bedarf | Status |
|--------|--------|
| Vollständiger National Dex Gen I–IX | ✅ stark |
| Wo finde ich X? | ✅ gut (Detail + Maps), Gen I–V only auf Karten |
| Typ-Schwächen / Coverage | ✅ Detail + Team Builder |
| Run planen (Gym/Leader) | ✅ Maps-Link + regionale Trainer-Daten Johto–Unova; Detail-Trainer-Picker ⚠️ |
| Nuzlocke tracken | ✅ solid für Route/Death/SoulLink, schwache Regel-Durchsetzung |
| Team für In-Game bauen | ✅ gut, Meta eher Competitive-SV |
| Living / Shiny Dex | ❌ Roadmap Phase 06 |
| TCG / Items encyclopedia | ❌ |
| Kalos–Paldea Maps & Runs | ❌ |
| Showdown-Export | ❌ |
| Mobile-first Map deck | ⚠️ Desktop optimiert (body scroll lock) |
| Vollständige DE-Übersetzung | ⚠️ weitgehend, aber nicht vollständig (siehe Language-Switch-Hinweis) |

---

## 7. Navigation — Dead Ends & fehlende Verknüpfungen

### Dead Ends / Broken

- `/nuzlocke/new?…` → Run not found (`DetailDrawer.tsx`, `RegionCard.tsx`)
- Team Builder VS → `/pokemon/:id?vs=` ohne Gegner (`SlotCard.tsx`)

### Gute Querverbindungen

- Dex card → Detail
- Detail WhereToFind → `/maps/{region}?node=`
- Map encounter row → `/pokemon/:id`
- Nuzlocke Timeline → Map node
- Home Features → alle Haupttools
- Team ← Nuzlocke Import

### Fehlende Links (Player würde suchen)

- Navbar/Footer → Maps, Nuzlocke, Team (Footer)
- Detail → „Open on map“ / „Add to team“ / „Start Nuzlocke here“
- Nuzlocke Run → „Team im Builder öffnen“ im Header ✅ (Overflow-Menü weiterhin)
- Maps Drawer → „Gegen Leader planen“ wenn Trainer-Daten vorhanden ✅
- Versus → kein Menüeintrag; nur über Detail-Tab oder Home-Teaser
- Map Drawer „Add to Nuzlocke“ → broken route statt Wizard mit Prefill

---

## 8. Wichtige Dateireferenzen

| Bereich | Kern-Dateien |
|---------|--------------|
| Routing | `src/App.tsx`, `src/components/LangGate.tsx` |
| Nav/Shell | `src/components/Navbar.tsx`, `Layout.tsx`, `Footer.tsx`, `SearchCommand.tsx` |
| i18n | `src/i18n/`, `src/lib/i18n-data.ts`, `src/lib/locale-link.tsx` |
| PokéAPI Client | `src/lib/pokeapi.ts` |
| Types/Gen | `src/lib/types.ts` |
| Dex logic | `src/components/pokedex/dex-data.ts` |
| Detail panels | `src/pages/PokemonDetail.tsx`, `src/pages/detail/*.tsx` |
| Type matchups (Detail) | `src/pages/detail/data.ts` |
| Versus math | `src/lib/versus.ts`, `src/pages/detail/VersusPanel.tsx` |
| Maps data | `src/lib/regions.ts`, `src/lib/mapdata.ts`, `src/data/regions/*.json` |
| Team Builder | `src/lib/teambuilder.ts`, `src/pages/TeamBuilder.tsx` |
| Nuzlocke store | `src/lib/nuzlocke-store.ts`, `src/lib/supabase.ts` |
| Kanto trainers | `src/data/enriched/kanto.json` |
| Regional trainers | `src/data/enriched/{johto,hoenn,sinnoh,unova}.json`, `src/lib/trainer-data.ts` |
| Nuzlocke Versus | `src/pages/nuzlocke/VersusTab.tsx` |

---

## 9. Kurzfazit

PKDX ist eine **polierte Phase-01+ Trainer-Suite**: starker National Dex (1025), reiches Detail-Dashboard, funktionale Maps für Gen I–V, ernsthafter Team Builder und ein feature-reicher Nuzlocke-Tracker mit optionaler Multiplayer-Sync. **Versus** ist mächtig, aber als Tab versteckt und **gen-technisch auf SV ausgelegt**, während Nuzlocke/Maps oft ältere Spiele meinen.

Die größten UX-Schäden für Spieler: **tote `/nuzlocke/new`-Links**, **Footer ohne Half der App**, **Versus/Team-Gen-Mismatch**, **schwache Nuzlocke-Regel-Durchsetzung** (Nicknames, Level Cap, Dupes), und **fehlende Regionen ab Kalos** in Maps/Runs trotz vollem Dex bis Gen IX.
