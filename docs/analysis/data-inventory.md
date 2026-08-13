# Dateninventar — 13. August 2026

Was die Oberfläche **anzeigen will**, und ob die Daten dafür da sind.
Kein Feature-Backlog. Keine neuen Spiele. Nur Lücken im bestehenden Vertrag.

Zählung aus JSON und Code, sechs parallele Audits (Nuzlocke, Maps, Team, Versus, Dex/Detail, SEO).

**So lesen:** VOLL = Binding-Version ist da und die UI kann sie zeigen. DÜNN = etwas steht da, aber nur Arenen / wenige Items / falsche Edition. LEER = Region oder Seite existiert, Daten = 0. BEWUSST = absichtlich nicht (leere SEO, ZA-Megas ohne Movesets).

Die eine Zeile: **Kanto ist tief. Johto bis Einall haben Karte und Wildfang, aber fast keine Trainer und kaum Items. Ab Kalos ist Nuzlocke eine Ortsliste ohne Fundorte. Team und Versus rechnen Gen 1–9, füttern sich aber nicht aus denselben Lücken.**

---

## 1. Die Landkarte (Region × Datentyp)

Atlas = Karte mit x/y. Freeform = Textliste, keine Geometrie.

| Region | Karte | Wildfang | Item-Bälle | Arenen + E4 | Routen-Trainer | Level-Cap | Versus-Gegner | Orts-SEO |
|---|---|---|---|---|---|---|---|---|
| Kanto | Atlas 46 | VOLL 1.00 / 203 Arten | VOLL 251 (pret) | VOLL FRLG | VOLL 237 (viele ohne Moves) | VOLL FRLG | DÜNN: Gym/E4 mit Moves, Route ohne | 43 Seiten FRLG |
| Johto | Atlas 47 | VOLL 0.98 / 183 | DÜNN 22 auf 8 Orten | VOLL HGSS | LEER | VOLL HGSS | nur 13 Wiki-Parties | 44 Seiten HGSS |
| Hoenn | Atlas 61 | DÜNN 0.94 / 151 | DÜNN 220, Meer ohne | VOLL Emerald | LEER | VOLL Emerald | nur 13 Wiki | 56 Seiten Smaragd |
| Sinnoh | Atlas 62 | DÜNN 0.89 / 221 | DÜNN 34 auf 6 Orten | VOLL Platin | LEER | VOLL Platin | nur 13 Wiki | 50 Seiten Platin |
| Einall | Atlas 56 | DÜNN 0.92 / 297 | DÜNN 12 auf 4 Orten | VOLL BW (kein B2W2) | LEER | VOLL BW | nur 15 Wiki, kein B2W2 | **0 Seiten** |
| Kalos | Freeform 105 | LEER 0 | LEER | LEER | LEER | LEER | LEER | BEWUSST 0 |
| Alola | Freeform 101 | LEER 0 | LEER | LEER | LEER | LEER | LEER | BEWUSST 0 |
| Galar | Freeform 92 | LEER 0 | LEER | LEER | LEER | LEER | LEER | BEWUSST 0 |
| Hisui | Freeform 89 | LEER 0 | LEER | LEER | LEER | LEER | LEER | BEWUSST 0 |
| Paldea | Freeform 84 | LEER 0 | LEER | LEER | LEER | LEER | LEER | BEWUSST 0 |
| Orre | Freeform 135 | Shadows VOLL (48+83) | LEER | keine Gyms | LEER (keine Parties) | LEER | LEER | 0 (Tracker nicht indexiert) |

Binding-Versionen (AGENTS.md): Kanto = FRLG, Johto = HGSS, Hoenn = Smaragd, Sinnoh = Platin, Einall = Schwarz/Weiß.

Was die Tabelle **nicht** sagt: Team-Builder und Dex-Learnsets laufen über Version Groups, nicht über diese Regionen. Siehe Abschnitt 4 und 5.

---

## 2. Nuzlocke

Wizard kennt Atlas + Freeform. Team-Builder kennt 23 Version Groups / 39 Spiel-Slugs. Die Listen sind **nicht** dieselben.

| Spiel im Wizard | Was der Run wirklich hat |
|---|---|
| FRLG + ältere Kanto-Chips | Karte, Wildfang, 368 Trainer in JSON, Cap FRLG. GS/HGSS-Chip auf Kanto bekommt trotzdem FRLG-Caps (Koga statt Janine). |
| HGSS + GSC | Karte, Wildfang, Cap HGSS. Versus nur 8+E4+Lance. |
| Smaragd + RS/ORAS | Karte, Wildfang, Cap Smaragd (Juan). ORAS teilt Smaragd-Caps. |
| Platin + DP | Karte, Wildfang, Cap Platin. **Kein BDSP.** |
| Schwarz/Weiß + S2W2 | Karte, Wildfang, Cap BW (Opelucid 43). S2W2 teilt BW-Leiter, kein Marlon. |
| x-y, sun-moon, USUM, SWSH, SV | Ortsliste, coverage 0, kein Cap, Versus leer. Chip ist oft die **Version-Group-ID**, nicht `x`/`y`. Versus fällt dann auf Gen 9. |
| Legends Arceus | Ortsliste, coverage 0. Einziger Gen-6–9-Chip, der auch ein Team-Builder-Slug ist. |
| Colo / XD | Shadow-Liste + XD Poké Spots. Tracker getrennt vom Run. Keine Trainer-Parties. |

**LGPE und BDSP:** im Team-Builder wählbar, im Nuzlocke-Wizard nicht.

**Items auf der Route:** liegen für Maps bereit, Nuzlocke liest sie nicht.

**Orre-Tracker** (`/orre`): 48 Colo + 83 XD Shadows, 3 Poké Spots. Teilt nicht `nuz_encounters`. Keine Karte.

Bekannte Datenfehler (nicht „fehlt“, sondern falsch): Kanto Giovanni-Party in enriched (5 Mons / Rhyhorn statt FRLG 6 / Rhydon). Unova-Champ Alder weicht von BW ab. Johto-E4 hängt am Node `mt-silver`.

---

## 3. Maps und Fundorte

Canvas und Drawer: **Live-PokéAPI**, Cache 7 Tage.
SEO-Ortseiten: **Build-Snapshot** `src/data/routes-{kanto,johto,hoenn,sinnoh}.json`. Kein Unova-Snapshot.

| | Canvas / Drawer | Pokémon-Seite „Wo fangen?“ |
|---|---|---|
| Edition `?v=` | ja | ja |
| Tageszeit / Schwarm / Radio / Headbutt | MAX pro Gruppe, eine Zahl, kaum Chips | **nicht getrennt**, Raten können höher aussehen als auf der Karte |
| Gen 8/9 | kein Atlas | SWSH-Areas als EN-Text ohne Kartenlink. SV/Z-A praktisch leer |

Kalos bis Paldea: JSON-Ortslisten für Nuzlocke. `/maps/kalos` ist 404. Soon-Karte auf `/maps` nennt Kalos, Alola, Galar, Paldea. Hisui und Orre stehen dort nicht.

Innen-Dungeons ohne Node (Auswahl): Silph, Pokémon-Villa, Tohjo, Leuchtturm, Abandoned Ship, Old Chateau, Castelia Sewers, N’s Castle. Kein Zufall, die Atlas-JSON hat sie nicht.

Original-Overworld-Bild ≠ Default-Edition (Johto-Bild = Gold/Silber, Default = HeartGold; Einall-Bild = S2W2, Default = Black).

---

## 4. Team-Builder

23 Version Groups (Docs sagen noch 21, Colo+XD fehlen in der Doku). Selector bis Karmesin/Purpur.

| Datentyp | Was wirklich geladen wird | Lücke |
|---|---|---|
| Learnsets | PokéAPI, exakter `version_group` | LGPE-Slug in der App ≠ PokéAPI (`lets-go-pikachu-eevee` vs `lets-go-pikachu-lets-go-eevee`) → Move-Pool leer. SWSH/SV ohne DLC-VGs (Armor, Tundra, Teal, Indigo). |
| Species / Items / Fähigkeiten | `@pkmn/data` **pro Generation**, nicht pro Spiel | BDSP bekommt SWSH-Dex. Colo/XD bekommen Hoenn-Dex. Copy sagt „legal für dieses Spiel“. |
| Smogon-Sets | OU der Generation (`gen1ou` … `gen9ou`, plus `gen7letsgoou`, `gen8bdspou`) | VGC `gen9vgc2025` liegt live, Code listet es, **Fetch nie**. Usage-Stats-URL nie geholt. Chip tot. |
| Mega / Z / Dyna / Tera | Stein/Kristall als Item | keine Form, kein Z-Move, kein Dynamax-Feld, Tera im Dump aber nicht im Slot |
| Z-A / Champions | — | PokéAPI-VGs existieren, Selector nicht |
| Sample Teams / Randbats | — | keine UI |

Picker: Nationaldex 1–1025. Mega/Alola nur über Showdown-Paste, nicht über +.

---

## 5. Versus und Kampf

Calc und Sim: Gen 1–9, nur 1v1. Kein Doubles, kein VGC, kein Trick Room.

Gegner-Set, drei Stufen:

1. Trainer-Party mit Moves aus `enriched/`
2. letzte 4 Level-up-Attacken (Wild)
3. Heuristik, wenn Level-up leer. **Kein Smogon-Set.** Smogon nur im Team-Builder.

| Region | Trainer in JSON | Davon im Picker | Mit Moves |
|---|---|---|---|
| Kanto | 368 pret | nur Leader/E4/Champ/Boss (Rivals important, Klasse Rival → unsichtbar) | 67 Trainer voll, Rest oft `moves: []` |
| Johto / Hoenn / Sinnoh | je 13 | die 13 | Wiki, alle mit Moves |
| Einall | 15 | die 15 | Wiki BW, kein B2W2 |
| Orre + Kalos+ | 0 | — | — |

Nuzlocke-Versus: kein Auto-Ziel „nächste Arena“, kein Battle-Sim (nur Matrix). Standalone `/versus`: 35 SEO-Paare, immer Gen 9 Level 50 Wild.

---

## 6. Pokédex und Pokémon-Seite

| Modul | Stand | Lücke |
|---|---|---|
| Arten-Liste | 1025, `summaries.json` lückenlos | — |
| Formen | 142 hinter Schalter (50 Mega/Primal, 34 Gmax, 18 Alola, 20 Galar, 16 Hisui, 4 Paldea) | ZA-Megas, Unown, Kampf-Formen bewusst raus |
| Stats / Typen | Live PokéAPI | — |
| Typentabelle | dieselbe Quelle wie Versus, Gen aus Move-VG | SEO-HTML fest Gen 3 (FRLG) |
| Learnset-Tabs | 17 VGs RB…SV | **kein** LGPE, BDSP, Hisui, Colo, XD im Picker |
| Wo fangen? | Edition-Filter ja | keine `condition_values`; Gen 8 ohne Karte; Gen 9 leer |
| Entwicklung | Kette live | nur erste Variante; manche Trigger EN |
| Fähigkeiten | Namen DE 313/313 | lange Effekte EN; Kurz-DE nur 191/313 |
| Getragenes Item | PokéAPI hat `held_items` | **nicht gerendert** |
| Sprites | `<Sprite>` Gen 1–9 | Gen 8/9-Museum nutzt vorhandene Icon-Builder nicht |
| Schreie | latest + legacy | Formen oft ohne Datei |

---

## 7. SEO-Seiten

Prerender: **648 URLs** (324 Pfade × DE/EN). Das ist kuratiert, kein Vollkatalog.

| Familie | Anzahl DE+EN | Was fehlt |
|---|---|---|
| Home, Dex-Index, Items-Index, Types-Hub | je 2 | — |
| Pokémon Unique-SEO | 70 (35 Arten, FRLG) | 990 Arten ohne eigene Meta |
| Item-Detail | 50 (25 Items) | ~1085 usable Items im Katalog, Index zeigt max 240 Kacheln |
| Typen-Detail | 36 (18 Typen) | Chart nur Gen 9, im Gegensatz zum Pokémon-SEO-Block (Gen 3) |
| Versus-Paare | 70 (35 Paare, Gen 9) | restliche Matchups SPA |
| Ortsseiten Kanto/Hoenn/Johto/Sinnoh | 86+112+88+100 | Städte ohne Wild bewusst ohne Seite |
| Ortsseiten Einall | **0** | Karte ist da, coverage 0.92 |
| Ortsseiten Kalos+ | **0** | coverage 0, nicht bauen |
| Nuzlocke-Guides | 12 (6 Guides) | Unova-Guide ja, Unova-Ortsseiten nein. Kein Orre-Guide |
| Orre, Account, Legal | 0 Prerender | Orre hat Daten, keine Meta |

---

## 8. Items (drei Schichten, drei Mengen)

Nicht durcheinanderwerfen.

| Schicht | Zahl | Wo |
|---|---|---|
| Katalog `desc/items.json` | 1085 usable (2165 Keys) | `/items` |
| SEO-Artikel | 25 | `/items/exp-share` usw. |
| Map-Bälle | Kanto 251, Hoenn 220, Johto 22, Sinnoh 34, Einall 12 | Drawer auf der Karte |

Enriched Item-Bälle aus dem ROM: **nur Kanto** (272, pret/FRLG). Johto–Einall: 0 in `enriched/`.

---

## 9. Was nicht fehlt, sondern woanders liegt

Diese Dinge sind **kein** fehlendes JSON, auch wenn die UI dünn wirkt:

- Weiterspielen auf Home: localStorage, kein Datensatz.
- Account / Cloud: Auth, kein Dex.
- Deutsche Namen für Pokémon/Attacken/Typen/Items: Build-Artefakte, stehen.
- Typchart Versus vs Dex: seit 13.08. dieselbe Engine. SEO-HTML bleibt Gen 3, weil FRLG-Text.
- Smogon-Sets nach Spiel: OU pro Gen lädt. VGC und Usage laden nicht.

---

## 10. Nicht wild adden

Neue Infos nur, wenn sie eine **leere Zelle in Abschnitt 1** füllen oder eine **falsche Binding-Version** ersetzen.

Nicht als Nächstes: GO-Live, Sleep, UNITE, TCG, Champions-Client, leere Kalos-SEO, fünfte ROM-Hack-Linie, Gen-10-Vorbereitung.

Dieselbe Lücke nicht zweimal füllen. Smaragd-Trainer gehören in `enriched/hoenn.json`. Dann ziehen Maps-Drawer, Nuzlocke-Versus und „gegen die Route“ sie automatisch. Eine extra Hoenn-Trainer-Seite ohne denselben Join auf `node.id` ist Wildwuchs.

---

## 11. Füllreihenfolge (nur Daten)

1. **Smaragd-Routen-Trainer + Item-Bälle** nach Kanto-Muster (`enriched/hoenn.json`). Größte leere Zelle, die Versus und Maps sofort nutzen.
2. **HeartGold, dann Platin**, analog.
3. **Einall-Orts-SEO** (Karte und Wildfang sind da, Seiten fehlen). Optional Item-Bälle.
4. **wherefind** auf dieselbe MAX-Logik wie die Karte (Tageszeit). Kein neues Spiel.
5. Team-Builder-Löcher nur wenn sie lügen: LGPE-Slug, oder Copy „legal für dieses Spiel“ vs Gen-weite Items.
6. Kalos-Karte erst, wenn XY-Fundorte wirklich da sind. Sonst bleibt coverage 0.

Quelle langer Analyse: `docs/analysis/improvements.md`. Spieler-Klartext: `docs/ideas/2026-08-13-produktideen.md`.
