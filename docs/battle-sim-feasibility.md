# Machbarkeitsanalyse: Rundenbasierte 1v1-Kampfsimulation im Versus-Bereich

**Ergebnis: GO mit Einschränkungen.** Echte, mechanisch valide 1-gegen-1-Kämpfe sind client-seitig
mit `@pkmn/sim` (der extrahierte Simulator-Kern von Pokémon Showdown) machbar — ohne Server, MIT-lizenziert,
Gen 1–9. Der Preis ist ein lazy-geladener Bundle-Chunk von **~6,6 MB min / ~1,06 MB gzip**. Keine eigene
Engine bauen (NO-GO für Eigenimplementierung auf Basis von @smogon/calc).

Alle Zahlen unten sind empirisch verifiziert (npm-Install + esbuild-Bundle + Lauftest der Battle-API,
nicht nur Doku-Lektüre).

## 1. Bibliotheken

### @smogon/calc 0.11 (bereits installiert)
- **Nur Damage-Math**: `calculate()` liefert Damage-Ranges (16 Rolls), `kochance()`, beschreibbare
  `Field`-Objekte (Wetter, Terrain, Screens, Hazards). Kein Rundenfluss, keine Zugreihenfolge,
  keine PP, keine Status-Verläufe, kein Zufall über die Rolls hinaus.
- Wird in `src/lib/versus.ts` bereits für Matrix/KO-Chips genutzt — bleibt dafür der richtige Baustein,
  ist aber **kein Kampfsimulator** und kann auch nicht zu einem erweitert werden, ohne Showdown nachzubauen.

### @pkmn/sim 0.10.11 (empfohlener Weg)
Automatisch generierte Extraktion von `sim/` aus `smogon/pokemon-showdown` (DER Competitive-Referenz-Simulator).
- **Lizenz**: MIT (Package + Upstream). Unkritisch.
- **Wartung**: Aktiv (0.10.11 aktuell, 226 Versionen, synchron zu pokemon-showdown); 0.x = API kann sich ändern → Version pinnen.
- **Browser**: Ja, explizites Designziel. Empirisch: esbuild `platform=browser` bündelt fehlerfrei;
  einziger `fs`-Import sitzt im Subpath `./tools` (CLI-Runner), nicht im Hauptpfad → unter Vite nur
  `import {Battle} from '@pkmn/sim'` verwenden.
- **Gen-Support**: Gen 1–9 als `genN` Mods (kanonisch; kein Stadium/LGPE/Pet-Mods). Verifiziert:
  Kampf unter `gen9customgame` und `gen1customgame` läuft, `Dex.forGen(1..9)` liefert gen-korrekte Daten.
- **Ohne Server**: Ja. Zwei APIs: (a) `BattleStreams` + `RandomPlayerAI` (async, protokollbasiert) und
  (b) **direkte `new Battle({formatid, p1, p2})` + `battle.choose('p1','move 2')` — synchron, ideal für
  React-State.** Verifiziert mit echtem Kampf (Garchomp vs. Slowbro, Sieger + vollständiges Protokoll-Log).
- **Teams/Sets**: `Teams.import()` frisst das Showdown-Textformat direkt — und das Projekt hat mit
  `src/lib/teambuilder-showdown.ts` bereits einen Showdown-Export/Import. Alternativ Set-Objekte
  `{species, moves, ability, item, nature, evs, ivs, level}` — deckt sich 1:1 mit `VersusSide`
  (`src/lib/versus.ts:46`).
- **Seedbarer RNG** (`seed: [a,b,c,d]`) → reproduzierbare Auto-Sims. `RandomPlayerAI` ist exportiert.
- **Kein Random-Team-Generator** enthalten (ausgelagert in `@pkmn/randoms`) — für 1v1 mit User-Sets irrelevant.

### Bundle-Impact (empirisch, esbuild minify+gzip)
| Paket | min | gzip | Anmerkung |
|---|---|---|---|
| `@pkmn/sim` (komplett, inkl. Deps) | **6,6 MB** | **1,06 MB** | nicht sinnvoll tree-shakebar: alle Gen-Daten werden eager geladen |
| zum Vergleich: aktueller `teambuilder`-Chunk (@smogon/calc + @pkmn/data) | 1,84 MB | 353 KB | bereits im Projekt |
| aktueller `VersusPanel`-Chunk | 46 KB | 12 KB | |

→ Muss **zwingend lazy** (dynamic `import()` beim Betreten des Battle-Modus, eigener Vite-Chunk).
Dann kostet es Initial-Load nichts; ~1 MB gzip Transfer erst bei Nutzung des Features. Auf Netlify
(Brotli/gzip) akzeptabel für ein Opt-in-Feature, wäre als Pflicht-Load indiskutabel.
Daten-Dopplung (sim bringt eigenes Dex mit, overlappt @pkmn/data) ist unvermeidbar.

### Alternativen (verworfen)
- **@pkmn/engine** (Zig/WASM, winzig, 1000× schneller): implementiert nur **Gen 1** (Gen 2 in Arbeit),
  nativer Postinstall-Build, kein Gen 3–9 → scheidet für Gen-Coverage aus.
- **Vollständiges `pokemon-showdown` npm**: schwerer, serverorientiert; `@pkmn/sim` ist genau die dafür
  gedachte Browser-Extraktion.
- **Eigenbau auf @smogon/calc**: NO-GO — Priorität, Status-Verläufe, Fähigkeiten/Items als Event-Handler,
  Multi-Turn-Effekte, Choice-Validierung = Nachbau von Showdown, Validität nie erreichbar.

## 2. Datenvalidität

„Valid" heißt für Competitive-User: identisch zu Showdown. Genau das liefert @pkmn/sim, weil es
derselbe Code ist: Prioritäten & Speed-Ties, STAB, gen-korrekte Typen-Charts (Gen-1-Spezialfälle,
Steel/Dark ab Gen 2, Fairy ab Gen 6), Crit-Stufen, Burn/Paralysis/Poison/Sleep/Freeze inkl. Verläufe,
Flinch/Confusion/Volatiles, alle Fähigkeiten & Items als Mechanik-Handler, Wetter/Terrain/Screens/Hazards,
Damage-Rolls (217–255/255), Akkuratesse/Evasion, PP & Struggle, Choice-Lock — **per Gen 1–9**.
Verifiziert: Super-Effektivität, Damage-Werte und Faint-Flow im Protokoll-Log korrekt.

**Grenzen:**
- **Keine KI.** Der Sim validiert und führt nur Züge aus; die Zugwahl muss aus der UI kommen:
  manuell (User wählt beide Seiten), `RandomPlayerAI` (mitgeliefert, schwach) oder eigene Heuristik.
  Synergie: die vorhandenen `damageBetween()`-Cells aus `src/lib/versus.ts` sind eine fertige
  „bester Zug"-Heuristik (max pct, Respektierung von Immunität) — deutlich besser als random.
- Keine Doubles/Triples nötig (1v1 = Singles, 1 Aktives → kein Switching nötig, vereinfacht UX massiv).
- Format sollte `genNcustomgame` sein (keine Legality-Validierung) — passt zur Wild-/Assumed-Set-Philosophie
  des Versus-Bereichs; Team-Validierung (`TeamValidator`) wäre optional möglich.
- Protokoll-Log (`battle.log`) muss für die Kampf-Anzeige geparst werden (`|move|`, `|-damage|`,
  `|-status|`, `|faint|`, `|win|` …) oder man liest den State direkt aus (`pokemon.hp`, `pokemon.status`).

## 3. UX-Optionen

- **a) Manueller Runden-Modus** — User wählt pro Runde beide Züge (Move-Buttons je Seite, HP-Balken,
  Log-Ticker). Passt exakt zur bestehenden Head-to-Head-UX von `VersusPanel.tsx` (SideCards links/rechts,
  `DamageMatrix` ab Zeile 899, `SpeedCheckBanner` 1029). Speed-Check kann die Zugreihenfolge erklären.
- **b) Auto-Sim (N Runs)** — „Simuliere 100×", Ausgabe Win-Rate, Ø Runden, Runden-Histogramm (recharts
  ist installiert), Heuristik oder Random auf beiden Seiten, fester Seed optional. Ideal als Erweiterung
  der `judgeMatchup()`-Verdikte (SAFE/RISKY …): „die Prognose, empirisch geprüft".
- **c) Hybrid** — manueller Kampf mit „Auto-Finish"-Button + separater Auto-Sim-Card. Empfohlenes Zielbild.

## 4. Aufwand & Empfehlung

| Arbeitspaket | Size |
|---|---|
| Wrapper `src/lib/battle.ts`: `VersusSide`→`PokemonSet`, Battle-Lifecycle, Choice-Liste, Log→Event-Mapping, Heuristik-Zugwahl | M |
| Battle-Panel in `VersusPanel.tsx` (oder neuer Sub-Tab): Move-Buttons, HP-Balken, Log, Reset | M |
| Lazy-Loading (dynamic import, Suspense, Vite `manualChunks`), Smoke-Tests | S |
| Auto-Sim (N Runs, Seed, Statistik-Card) | S–M (baut auf Wrapper) |

- **Option a) M** · **Option b) S–M** (nach a) · **Hybrid c) M–L gesamt**.
- **Risiken**: (1) Bundle +1,06 MB gzip — mitigiert durch Lazy-Chunk; (2) 0.x-API von @pkmn/sim —
  Version pinnen; (3) Log-Parsing-Aufwand für schicke Anzeige — MVP kann State direkt lesen;
  (4) Choice-Validierung: UI darf nur legale Züge anbieten (Engine wirft sonst) — über `side.requests`
  / aktive `moveSlots` absichern.
- **Empfohlener Pfad**: Phase 1 = Option a (manueller Modus, lazy chunk) als validierbarer MVP;
  Phase 2 = Option b (Auto-Sim gegen die `judgeMatchup()`-Tiers). Kein Eigenbau, kein Server,
  kein zusätzliches Datenpaket nötig.

### Integrations-Anker im bestehenden Code
- `src/lib/versus.ts` — `VersusSide` (Z. 46) mappt 1:1 auf Showdown-Sets; `damageBetween()` (Z. 300)
  als Heuristik-Input; `VersusContext.gen` → `formatid gen{gen}customgame`.
- `src/pages/detail/VersusPanel.tsx` — `sideToVersus()` (Z. 181) als Konverter-Andockpunkt;
  `SideCard` (Z. 654) / `DamageMatrix` (Z. 899) als Layout-Vorlage für das Battle-Panel.
- `src/lib/teambuilder-showdown.ts` — Showdown-Export existiert; `Teams.import()` konsumiert ihn direkt
  (Brücke TeamBuilder ↔ Battle gratis).
- `src/lib/versus-context.ts` — Gen-/Wetter-/Terrain-Auswahl: Gen → formatid; Wetter/Terrain
  initial per `battle.setWeather()/setTerrain()` oder Field-Setup im Custom-Game.
