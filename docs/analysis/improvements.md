# Verbesserungsanalyse — 2026-08-13

Stand: Live mypokepanion.com, Repo `/home/rin/Work/_private/pkdx`. Kein Produktionscode geändert. Das Player-UX-Audit (Juli 2026) ist an mehreren Stellen überholt (eigene `/versus`-Route, Showdown-Import/Export, Footer-Links, Gen-6–9-Text-Nuzlocke, Orre-Tracker, Auto-Level-Cap, Dupes auf Evolutionslinie). Diese Datei baut darauf auf und zählt Geschifftes nicht als neu.

## These (1 Absatz: wo die Seite einzigartig ist und wo sie wachsen sollte)

MyPokePanion ist kein Lexikon, sondern ein zweisprachiges Operationsdeck: dieselbe `route_key` verbindet Karte, Nuzlocke-Slot, Trainer-Moveset und Versus-Zelle. Genau das fehlt den Wikis und genau das sollte wachsen. Der Dex bis 1025, der Team-Builder mit 21 Version Groups, `@smogon/calc` plus `@pkmn/sim` und der Orre-Shadow-Tracker sind schon da. Die Lücke sitzt in der Tiefe der Hauptspiele, nicht in neuen Marken. Johto bis Einall haben 13 kuratierte Gym/E4-Trainer statt 368 ROM-genauer Parties wie Kanto. Kalos bis Paldea existieren als Freeform-Listen ohne Geometrie und ohne Encounter-Coverage. PokéAPI liefert für SWSH/SV/Z-A weiter keine belastbaren Fundorte. Wachstum heißt: pret-Pipelines für Emerald/HGSS/Platinum klonen, Gen-6–9-Karten als eigenen Datensatz bauen, Competitive-Meta an die gewählte Version Group koppeln. Kein GO-Live-Spawn, kein Sleep/UNITE/Masters-Lexikon, kein Stack-Rewrite.

## Quick wins (4–8, je 1 Absatz)

**1. Smogon-Sets und Usage an die Team-Version koppeln.** `src/lib/teambuilder.ts` lädt fest `https://data.pkmn.cc/sets/gen9ou.json`. Ein RBY- oder HGSS-Team bekommt SV-OU-Vorschläge. data.pkmn.cc hat `/sets/{format}.json` und `/stats/{format}.json` für gen1ou bis gen9vgc. Mapping: `version-groups.ts` → Showdown-Format-ID, Cache wie heute über `cachedJson`. Joins Team → Versus (ASSUMED SET) ohne neues Modell. Aufwand klein, Datenqualität hoch, Legal: Sets © Smogon, Attribution wie bisher, CSP listet `data.pkmn.cc` und `pkmn.github.io` schon.

**2. pret-Parser für Emerald, dann HGSS, dann Platinum.** Kanto beweist den Vertrag: `enriched/{region}.json` keyed nach `node.id`, Versus-Tab und Maps-Drawer konsumieren dasselbe. Johto/Hoenn/Sinnoh/Unova haben je 13 Gym/E4/Champion-Einträge aus Bulbapedia (`scripts/enrich-trainers.mjs` validiert nur). pret/pokeemerald ist fertig (`src/data/trainers.h` + `trainer_parties.h`). pokeheartgold und pokeplatinum sind WIP, die Trainer-Tabellen sind trotzdem dumpbar. Erst Emerald-Route-Trainer (nicht nur Roxanne), dann HGSS, dann Platinum. Trainer-Namen bleiben Englisch (bekanntes Remainder). Aufwand mittel, Qualität ROM-genau, Legal wie pokefirered: Fair-Use-Fan-Referenz, kein ROM im Repo.

**3. SEO-Routen Johto und Sinnoh nach dem Kanto/Hoenn-Muster.** `scripts/seo-routes.mjs` prerendert Kanto- und Hoenn-Location-Pages plus 35 Dex-IDs, 25 Items, 35 Matchups. Johto (coverage 0.98) und Sinnoh (0.89) haben schon Schematic + Original-Geo. Dieselbe Pipeline (`seo-meta-gen.json`, lokalisierte Slugs, Encounter-Aggregation mit MAX pro Bucket) füllt Index-Lücken, ohne neue Seitenfamilie. Unova danach. Kalos+ nicht prerendern, solange coverage 0 ist (scaled-content-Risiko).

**4. Where-to-Find versionsscharf machen.** `WhereToFind.tsx` aggregiert Raten über alle Versionen, Best-Rate gewinnt. Die Encounter-Payload von PokéAPI trägt `version` schon. Filter auf die im Dex/Maps gewählte Version (`?v=` existiert). Gift/Static bleiben in der Extra-Sektion. Kein neues API. Sofort spürbar für FRLG- vs. RBY-Spieler.

**5. Formen im Dex, nicht als neue Seite.** Grid filtert 1025 Species, keine Regionalformen, keine Megas, keine Gigantamax. PokéAPI `pokemon-species.varieties` plus `@pkmn/dex` Formen sind da. ZA-Megas (Hawlucha-Mega, neue Raichu-X/Y usw.) liegen als Form-Slugs vor, Movesets in PokéAPI sind im April 2026 noch leer (Issue #1506). UI: Compact-Row 36–44px, `<Sprite>`, English slug bleibt die ID. Champions und Z-A brauchen genau diese Formen, nicht National-Dex 1026+.

**6. Home: letzter Run / letztes Team.** Navbar und Footer kennen Nuzlocke, Team, Versus, Orre. Home hat keinen „Continue“. `pdx2.nuz.*` und gespeicherte Teams liegen lokal. Eine Zeile im Toolkit (LocaleLink auf `/nuzlocke/:runId` bzw. `/team`) senkt den Wiedereinstieg. Kein neues Backend.

**7. Map-Items aus pret, nicht weiter von Hand.** Kanto 100 kuratierte Items plus pret-Enrichment, Hoenn 220, Johto 22, Sinnoh 34, Unova 12. „0 ITEMS“ ist oft Datenlücke. pokeemerald/pokeheartgold haben Item-Ball-Tabellen analog firered. Parser schreibt in `items-{region}.json` bzw. enriched, keyed nach bestehendem `node.id`. Nie `route_key` umbenennen.

**8. Detail-Typchart auf `@pkmn/data` ziehen.** Versus ist gen-korrekt. Die Detail-Seite nutzt noch eine fest verdrahtete Gen-VI+-Matrix in `detail/data.ts`. Ein Import von `genMatchupsForSide` schließt die Doppelquelle. Aufwand Stunden, nicht Wochen.

## Datenquellen-Matrix (Tabelle: Quelle, was, Lizenz/ToS, Aufwand, Empfehlung)

| Quelle | Was | Lizenz / ToS | Aufwand | Empfehlung |
|---|---|---|---|---|
| PokéAPI (pokeapi.co) | Species, Moves, Items, DE-Namen, Encounters Gen 1–7 | BSD-3 API, Daten © Nintendo, Fair Use | schon angebunden | **Kern behalten.** Gen 8/9 Encounters fehlen. SWSH-PRs liefen Q2/Q3 2026 (#1459 geschlossen, PRs #1550–#1613). SV/Z-A/Kitakami weiter leer. Nicht als Kalos–Paldea-Kartenquelle verkaufen. |
| PokeAPI/sprites + cries | Sprites, Schreie | Repo-Nutzung, Artwork © Nintendo | gebündelt 1–1025 | **Behalten.** Neue ZA-Mega-Sprites erst spiegeln, wenn IDs stabil sind. Immer `<Sprite>`. |
| @pkmn/data, @pkmn/dex, @pkmn/sim, @smogon/calc | Legality, Typen, Damage, 1v1-Sim | MIT | schon angebunden | **Behalten, pinnen.** Kein Showdown-Client (AGPLv3). Keine Eigen-Engine. |
| data.pkmn.cc / @pkmn/smogon | Sets, Usage, Sample Teams, Randbats (stündlich) | Code MIT, Stats Public Domain, Analyses/Sets © Smogon | klein (URL-Swap) | **Quick win.** Format an `VERSION_GROUPS` koppeln. VGC: `gen9vgc*` / 2026-Regeln, nicht nur OU. |
| smogon.com/stats | Monatliche Raw-Stats (Stand 2026-07 vorhanden) | Community, kein offizielles API | klein als Fallback | Nur wenn pkmn.cc Format fehlt. Nicht scrapen, statische JSON ziehen. |
| pret/pokefirered | 368 Kanto-Trainer, Items, NPCs | Decomp, Daten © Nintendo | schon da | **Goldstandard.** Muster für die nächsten Regionen. |
| pret/pokeemerald | Trainer, Parties, Items, Wild-Encounters | wie firered, ROM-genau | mittel (Parser) | **Als Nächstes.** Emerald ist der Nuzlocke-Default. |
| pret/pokeheartgold, pokeplatinum | Trainer/Items, WIP-Decomp | wie oben | mittel–hoch | **Danach.** Tabellen nutzbar, Build nicht 1:1 „fertig“. pokeblack-white nur referenzieren, nicht als Pipeline-Start. |
| veekun/pokedex + PokeAPI/pokedex-Fork | CSV-Dumps bis Gen 7, Gen 8/9 manuell | MIT Code, Daten © Nintendo, „at your own legal risk“ | niedrig als Abgleich | **Abgleich, nicht Runtime.** PokéAPI ist der Nachfolger. |
| Bulbapedia / PokéWiki | Trainer-Teams, Version-Fakten | Wiki-Lizenz + Nintendo-IP, Scraping grau | schon kuratiert | **Nur Verifikation** (AGENTS.md: korrekte Version). Kein Bulk-Scrape. Trainer-Namen/Klassen bleiben EN. |
| Serebii | Encounters, Events | Proprietär, Scraping unerwünscht | — | **Nicht anbinden.** Einzelseiten zum Gegenlesen. |
| VGMaps / PokéWiki-Karten | Original-Overworld Gen 1–5 | Credits in `public/maps/CREDITS.txt` | schon da | **Behalten.** Kalos–Paldea: erst Lizenz klären, bevor eine sechste Original-Karte ins Repo kommt. |
| pkmnmap, MapGenie, Ironmon | Externe Interaktiv-Karten | Drittanbieter, Links sterben (MapGenie HGSS 2026 tot) | schon verlinkt | **Outbound-Link, kein Import.** |
| PokeMMO-Data (PokeMMOZone / PokeMMO-Tools) | PokeMMO-Locations, Obtainable-Listen | Community-JSON, Client-Dumps grau, PokeMMO-ToS | mittel | **Nicht Kern.** Optional später als Game-Overlay auf bestehenden 5 Regionen, nie die Main-Series-Tabellen überschreiben. |
| Radical Red / Unbound / Renegade Platinum (Community-JSON, Nuzlocke-Redux-Art) | Hack-Encounters + Boss-Parties | Hack-Autoren, Nintendo-IP, oft ohne klare Lizenz | hoch | **Große Wette, eine Hack-Linie.** Radical Red sitzt auf Kanto-`route_key`. Erst nach Emerald-pret. |
| PokeMiners Game Master | GO-Stats, Moves, Buddy, PvP | „educational use only“, Inhalt © Niantic/TPC, kein Lizenzgrant | mittel | **Nur statischer Snapshot, build-time.** Kein Live-Fetch gegen Niantic. |
| pokemon-go-api (GitHub Pages) | GO-Dex, Raids aus GM + LeekDuck | Fan-API, Quellen gemischt | klein | **Experiment**, wenn GO-Overlay kommt. Ausfall einkalkulieren. |
| ScrapedDuck / leak-duck | Raids, Events, Research, Rocket, Eggs | ScrapedDuck AGPL-3.0, Nutzung mit LeekDuck-Erlaubnis, kein Paywall/Ads | klein | **Erlaubt für Event-Chips**, Credit Pflicht. AGPL gilt fürs Scraping-Tool, nicht automatisch für unser MIT-fernes Frontend, wenn nur JSON konsumiert wird. Trotzdem Credit + ToS-Review vor Merge. |
| pogoapi.net | Statische GO-JSON (released, types, raids) | Fan, inoffiziell | klein | Zweite Wahl hinter PokeMiners-Snapshot. |
| LeekDuck (direkt scrapen) | Events | Ohne Erlaubnis: nein | — | **Vermeiden.** ScrapedDuck ist der geduldete Weg. |
| Niantic / GO Live-API, Scanner, Nest-Live-Maps | Live-Spawns, IV, Despawn | ToS-Bruch, Ban-Risiko für Nutzer, für uns Abmahn-Risiko | — | **Vermeiden.** |
| TCGdex (api.tcgdex.net) | TCG + TCG Pocket, DE-Namen, self-hostbar | MIT DB, Kartenbilder © TPCi | mittel (Arena-Plan) | **Falls Arena**, wie in `docs/plan-arena.md` entschieden. Bilder build-time spiegeln, nie hotlinken. |
| pokemontcg.io / Scrydex | TCG-Karten | Key, Rate-Limit, Vendor-Risiko | — | Fallback hinter TCGdex. |
| Limitless TCG / Pocket-JSON-Repos | Pocket-Sets, Turniere | Gescraped, lizenziert unklar | — | Nur wenn Arena Pocket-Sets braucht und TCGdex Lücken hat. |
| Neroli / api.sleepapi.net | Sleep-Produktion, Rezepte | Apache-2.0 Code, sleepapi.net stirbt 2027-01-01 | hoch | **Nicht integrieren.** Anderes Spiel, anderer Loop. |
| UNITE / Masters EX Community-APIs | Kits, Kitsune, Relics | Inoffiziell, schnell tot | hoch | **Nicht integrieren.** |
| Pokémon HOME | Box, Living Dex | Kein öffentliches API | — | Living Dex lokal/Account, kein HOME-Login. |
| Pokémon Champions (offiziell, Switch 2026-04-08, Mobile 2026-06-17) | Offizielle Competitive-Schicht, Megas | Kein öffentliches API, ToS unbekannt für Tools | hoch | **Beobachten.** Nicht zweite Engine. Wenn `@pkmn/sim` ein Champions-Format bekommt, Version Group ergänzen. |

## Pokémon GO (klare Empfehlung)

**Empfehlung: experimentieren, schmal. Nicht integrieren als zweite App. Live-Spawns vermeiden.**

GO ist das größte Parallel-Pokémon, aber es ist kein Nuzlocke- und kein Karten-Spiel im Sinne des Shared Region Contract. `route_key` wie `kanto-route-1` hat in GO keine Bedeutung. Ein GO-Modus, der Maps/Nuzlocke verbiegt, zerstört das Ops-Deck.

**Nützlich (wenn überhaupt):**

- Typen-Overlap und STAB. Dieselben 18 Typen, andere Move-IDs. Ein Chip „GO-Typen“ auf der Detail-Seite, gespeist aus einem gebündelten Game-Master-Snapshot, ohne Niantic-Live-Call.
- Raid- und Event-Kalender (aktueller Boss, Community Day, Spotlight). Quelle: ScrapedDuck/LeekDuck mit Credit, stündlich bis täglich gebündelt, nicht client-seitig gescraped. Zeigt sich als schmale Leiste, nicht als neue IA-Säule.
- PvP-Cups (Great/Ultra/Master, Limited Cups): League-Caps, Moves, Shadow-Bonus. Das ist Team-Builder-nah. Eigene GO-Sets, nie in `@smogon/calc` pressen. Calc und Sim sind Main-Series. Eine GO-PvP-Formel (Attack/Defense/HP-Scaling, CMP) ist ein separates Modul oder ein Outbound-Link.
- Buddy-Distanz, Candy-Kosten, Transfer-Kosten: Living-Dex-adjacent, nur wenn ein Catch-Tracker kommt.

**Falle:**

- Live-Spawn-Karten, IV-Scanner, Nest-Heatmaps, Discord-Bots mit Despawn-Timern. Niantic hat kein öffentliches Spawn-API. Alles „live“ kommt aus unauthorisiertem Client-Zugriff. ToS (unofficial software / unauthorized access) trifft den Betreiber und indirekt Nutzer. Scanner sterben regelmäßig. Das Produkt würde Support und Legal-Risiko kaufen, keinen Ops-Wert.
- PokeMiners als Runtime-Dependency. Das Repo sagt „educational use only“, Inhalt gehört Niantic/TPC. Ein Commit-Snapshot im eigenen `src/data/go/` mit Datum und Disclaimer ist ehrlicher als ein Live-Fetch.
- GO-Sprites und 3D-Assets aus `PokeMiners/pogo_assets` ins Bundle. Artwork-Risiko höher als Tabellendaten. Main-Series-Sprites über `<Sprite>` reichen.
- Raid-Damage-Rechner, der vorgibt, Versus zu sein. Versus ist `@smogon/calc` / `@pkmn/sim`. GO-Raids sind ein anderes Kampfsystem.

**Stance 2026:** Kein `/go`-Atlas, kein Spawn-Layer auf Kanto. Optional ein Feature-Flag „GO overlay“ auf Pokémon-Detail (Raid-Boss-Chip, PvP-League-IV-Floor, Event-Hinweis) aus gebündeltem JSON. Nach 90 Tagen messen: Klicks vs. Support-Last. Wenn die Leiste tot ist, entfernen. Wenn sie lebt, bleibt sie ein Overlay, kein Vertragspartner von `route_key`.

## Weitere Spiele / Modi

**Kalos, Alola, Galar, Hisui, Paldea.** Nuzlocke-Wizard kennt sie als Freeform (`src/lib/regions-freeform.ts`, `x/y = 0`, `edges: []`, coverage 0). Maps zeigt eine Soon-Card. PokéAPI hat für XY/ORAS/SM/USUM Locations, für SWSH/SV/Z-A Encounters praktisch nicht. Schematic für Kalos/Alola ist machbar wie Unova: handgezeichnete Nodes, `route_key` jetzt in den JSONs schon vergeben, **nicht umschlüsseln**. Galar Wild Area und Paldea sind offene Felder, kein Routengraph. Dort reicht erst eine Zonenliste plus Overlay, kein gefälschtes Kanto-Schema. Hisui (Legends) ist Distortion/Outbreak, nicht Walk/Surf/Fish. Eigene Method-Buckets, sonst lügt die Maps-UI.

**Legends Z-A (Release 2025-10-16, DLC Mega Dimension 2025-12-10, HOME-Anbindung Frühjahr 2026).** Lumiose, Wild Zones, Mega, Royale. Kein klassischer Routen-Nuzlocke. `VERSION_GROUPS` endet bei `scarlet-violet`. Z-A als eigene Group erst, wenn `@pkmn/dex` und PokéAPI Learnsets tragen. Heute: Mega-Formen im Dex, kein `/maps/lumiose`. Encounter-API fehlt (PokeAPI #1459-Kommentar, Stand März 2026: ZA und Mega Dimensions ohne Locations).

**Orre (Colosseum / XD).** Tracker und Nuzlocke-Join (`Shadow.locationId === node.id === route_key`) sind seit 2026-08-12 da. Bewusst ohne Karten-Geometrie, ohne Versus-Trainer-Parties, ohne Radar-Sim. Nächster sinnvoller Schritt: GC-Trainer-Parties in `enriched/orre.json` für den Versus-Tab, nicht eine Fake-Karte mit x/y=0. Poké-Spots sind schon im Tracker. Purification-Optimizer bleibt Non-Goal.

**Let’s Go, BDSP, LGPE.** Version Groups existieren im Team-Builder. Maps/Nuzlocke mappen Kanto/Sinnoh auf FRLG/DPPt-Geometrie. Let’s-Go-Encounters (Let’s Go, Partner) und BDSP-Underground sind eigene Method-Buckets. Erst wenn PokéAPI oder ein pret-naher Dump sie trägt. Kein eigener Atlas.

**PokeMMO.** Dieselben fünf Regionen, andere Tabellen, PvP-Tiers. Community-JSON existiert. PokeMMO-ToS und Client-Dumps sind grau. Nur als optionales `run.game = pokemmo` mit Overlay-JSON, nie als Default. Erst wenn Nutzer das aktiv verlangen.

**ROM-Hacks (Radical Red, Unbound, Renegade Platinum, Inclement Emerald).** Das ist die Nuzlocke-Szene, die Tracker wie Nuzlocke Redux füttert. Radical Red passt auf Kanto-`route_key` plus Extra-Bosse. Unbound braucht eine neue Freeform-Region. Lizenz der Hack-Daten ist fast immer „Community-Tabelle, kein Grant“. Eine Hack-Linie nach Emerald-pret, als `run.game` mit eigenem Encounter/Trainer-Overlay. Kein Hack-Marktplatz.

**Competitive: Showdown bleibt die Engine, Champions ist der neue Client.** Versus und die 1v1-Arena laufen. Random Battles: `pkmn/randbats` stündlich auf data.pkmn.cc, eigener Modus „Randbat-Set ziehen“ im Team-Builder, Sim kann das Team fressen. VGC Doubles: `@pkmn/sim` kann Doubles, die UI ist 1v1. Ein Doubles-Feld ist eine große Wette, kein Quick Win. Pokémon Champions (2026, Megas, Singles/Doubles, offiziell) hat kein öffentliches API. PokeDD und ähnliche Tools entstehen. Wir kopieren sie nicht. Wir warten auf Format-Support in `@pkmn/*`.

**TCG / TCG Pocket.** `docs/plan-arena.md` ist gelockt und unverifiziert im Code. TCGdex MIT + DE, Bilder © TPCi. Pocket hängt an derselben Quelle (`series/tcgp`). Das ist eine zweite Produktseele (Packs, Pity, Sammlung). Es joined Team/Versus nur über Dex-IDs auf der Karte. Nicht parallel zu Kalos-Karten und pret-Emerald starten.

**Sleep, UNITE, Masters EX.** Eigene Metas, eigene APIs, eigene Spieler. Kein `route_key`, kein `@smogon/calc`. Outbound-Links im Footer reichen. Sleep-API wandert 2027 zu Neroli. UNITE-Kits veralten pro Patch.

## Große Wetten (3–5)

**A. Gen-6–9-Karten ohne PokéAPI-Illusion.** Kalos/Alola als Schematic im bestehenden Atlas (`REGIONS` erweitern, Freeform-JSONs haben die IDs schon). Encounters aus Community-Dumps (veekun-Fork, Serebii nur zum Abgleich, später PokéAPI wenn SWSH-PRs durch sind). Galar/Paldea als Zonen-Deck, nicht als 1200×840-Lügengraph. Hisui und Z-A eigene Oberflächen. Aufwand: Quartal plus, bindet Maps↔Nuzlocke↔Where-to-Find. Risiko: Encounter-Qualität. Ohne das bleibt Gen 6–9 ein Textmodus mit coverage 0.

**B. Volle pret-Trainer für Hoenn/Johto/Sinnoh, dann Versus „gegen die Route“.** Heute plant der Nuzlocke-Versus-Tab gegen 13 wichtige Trainer plus Wild. Kanto kann 368 Parties. Nach Emerald-Parser: jeder Node im Drawer „Gegen Trainer planen“, Detail-`TrainerPicker` füllt sich. Das ist der härteste Ops-Hebel im bestehenden Vertrag. Aufwand hoch (Mapping Trainer→`node.id`, Double-Battles, Items am Gürtel). Legal vertretbar wie firered.

**C. Living Dex + Catch-Status, lokal first.** Audit Phase 06, nicht gebaut. Account-Sync existiert für Teams/Runs. Ein `pdx2.dex.*` (caught/shiny/form) mit optionalem Cloud-Row, kein HOME-API. Joins Dex-Grid, Detail, Orre-Checklist-Muster. GO-Catch parallel nur als zweites Flag, sonst vermischt sich National Dex mit GO-released. Aufwand mittel–hoch, SEO-neutral, Retention-hoch.

**D. Arena (TCG-Loop) wie geplant, oder bewusst streichen.** Packs → Sammlung → 6er aus eigenen Karten → `@pkmn/sim`. Legal mit Disclaimer und Bild-Kill-Switch lösbar (`plan-arena.md`). Es verdoppelt aber IA, Bundle und Support. Solange Maps ab Kalos und Trainer ab Route 110 dünn sind, ist Arena Ego, nicht Ops. Entscheidung: nach B oder gar nicht in den nächsten zwei Quartalen.

**E. Eine ROM-Hack-Linie (Radical Red) als First-Class Game.** Overlay auf Kanto-Geometrie, eigene Trainer/Encounters, Nuzlocke-Wizard-Option, Versus gegen Boss-Tiers. Das differenziert gegen PokéWiki und gegen Nuzlocke Redux (die haben Guides, nicht Calc+Sim+DE/EN+Multiplayer). Aufwand hoch, Datenpflege dauerhaft, Lizenz weich. Nur eine Linie, nicht fünf Hacks.

## Was wir NICHT tun sollten

- Stack nicht anfassen (Node 20, React 19, Vite 7, Tailwind 3.4, i18next, Supabase).
- `route_key` / Node-IDs nicht umbenennen, auch nicht für schönere Kalos-Slugs (`kalos-kalos-route-1` ist hässlich und bindend).
- Keine Live-GO-Spawns, keine Niantic-nahen Clients, keine Scanner-Partnerschaften.
- Keinen Showdown-Client und keine AGPL-Assets einbetten.
- Keine zweite Damage-Engine für GO, UNITE, Sleep, Pocket.
- Kein AI-Chatbot auf Dex-Texten. Prerender und Q&A-Module existieren. Halluzinierte Movesets zerstören Versus-Vertrauen.
- Keine Massen-SEO-Seiten für Kalos-Routen oder 1000 Items ohne Unique Value. Pattern: Kanto/Hoenn Location + 35 Dex + 25 Items. Mehr nur bei echten Encounters.
- Keine `dangerouslySetInnerHTML`, kein `unsafe-inline` Script, keine `using (true)`-RLS.
- PokeMMO, Randomizer-ROM-Dumps und Memory-Reader nicht in die Codebase.
- architecture.md behauptet noch, `@pkmn/sim` sei verworfen. Das ist falsch (Arena und `src/lib/battle/engine.ts` leben). Docs später richten, nicht die Architektur zurückdrehen.
- Gen 10 / unangekündigte Mainline nicht vorbereiten. Z-A ist Gen-9-Kalos-Remake-artig, nicht Dex 1026.

## Vorschlag Prioritäten-Quartal (Q1 interne Reihenfolge, nicht Kalenderzwang)

1. **Aufräumen, das der Spieler merkt:** Version-aware Where-to-Find, Smogon-Format = gewählte Version Group (OU + ein VGC-Format), Detail-Typchart = `@pkmn/data`, Home-Continue, Formen-Rows im Dex (Species + bekannte Varieties, ZA-Megas ohne Move-Claim).
2. **Emerald-pret-Pipeline:** Parser → `enriched/hoenn.json` voll, Items aus ROM, Versus/Maps/Nuzlocke ohne API-Änderung. Validation wie `enrich-trainers.mjs`, plus Tests auf Node-Join.
3. **SEO-Johto (und Sinnoh, wenn 2 läuft):** Location-Pages nach bestehendem Generator, DE/EN-Parität, Meta ≤ 160 Zeichen, keine Copy-Duplikate zu Dex-Q&A.
4. **HGSS- und Platinum-Trainer** analog, kleiner als Emerald weil Decomp WIP. Ziel: Gym/E4 bleibt kuratiert als Fallback, Route-Trainer wo der Dump sauber ist.
5. **Kalos-Schematic v1:** Nodes aus bestehendem `kalos.json` layouten, Encounters nur wo PokéAPI XY sie hat. Alola danach. Galar/Paldea/Hisui/Z-A nicht in diesem Quartal auf die Atlas-Karte zwingen.
6. **GO-Overlay Feature-Flag:** ein gebündelter Raid/Event/PvP-JSON-Satz, Detail-Chips, Credit LeekDuck/ScrapedDuck/PokeMiners. Kein Atlas. Kill-Switch nach Review.
7. **Nicht in Q1:** Arena-Code, Living Dex Cloud, Radical Red, PokeMMO, Doubles-VGC-UI, Sleep/UNITE/Masters, Champions-Client, Orre-Karte.

Legal-Linie für alles oben: Fan-Projekt, non-commercial, Disclaimer bleibt auf Legal-Seiten und bei Arena/GO-Overlays sichtbar. Datenmodell Englisch, Render-Rand DE/EN. Nintendo kann Assets und Daten jederzeit beanstanden. Deshalb: Pret- und PokéAPI-Tabellen vor Artwork-Bergen, Snapshots statt Live-Scraper, Takedown = Datei löschen ohne Architekturbruch.
