# Maps-Daten Kanto–Einall — Design

Status: 2026-08-14. Genehmigt: Welle pro Region, Cartographer + Fact-checker, Trainer-Parser später. SEO-Ortseiten und Versus außerhalb.

## Ziel

Karten-Drawer für Kanto, Johto, Hoenn, Sinnoh, Einall: Orte, Kanten, Geo-Marker, Wildfang (Live-PokéAPI), Item-Bälle. Daten passend zur Binding-Version. Vollständig im Sinne der Done-Definition unten, nicht „jedes Indoor-Pixel“.

Live-Wildfang bleibt PokéAPI. Diese Arbeit füllt Nodes und Items, damit die Engine etwas zum Joinen hat.

## Nicht in diesem Lauf

- SEO-Prerender / `routes-*.json` / `seo-routes.mjs`
- Versus, Trainer-Parties, `enriched/*.json` Trainer (Gym/E4 bleiben wie sie sind)
- pret-Parser für Routen-Trainer (Folgelauf, Smaragd zuerst)
- Kalos+
- `route_key` / bestehende Node-IDs umbenennen
- Encounter-Engine in `mapdata.ts` (condition_values, Feebas, Chips: Stand 14.08. bereits da)

## Binding-Versionen

Kanto = FRLG, Johto = HGSS, Hoenn = Smaragd, Sinnoh = Platin, Einall = Schwarz/Weiß. Andere Chips auf derselben Karte bleiben additiv.

## Shared Region Contract

`src/data/regions/{id}.json` ist Karte **und** Nuzlocke-Timeline. Neue Nodes: neue IDs, `order` ans Ende oder sinnvoll in den Graph, `nameDe`, `locationSlug` (PokéAPI `/location`), Kanten, Eintrag in `{id}-geo.json` (`[x,y]` 0..1). Nie umschlüsseln.

## Rollen (pro Welle)

1. **Fact-checker** (zuerst, read-only): Restlücken gegen Binding-Version. Output: ADD-Node / ADD-Items / FIX-Geo / OK / BEWUSST-Skip. Kein Prod-Code.
2. **Cartographer**: nur die ADD/FIX-Liste. Tests analog `src/lib/regions.test.ts`. Kein Commit ohne Auftrag.
3. **Code-Reviewer**: nur wenn TS/Drawer/Types angefasst. Reines JSON: skip. Fact-checker prüft Daten danach erneut.

Sub-Agents: Cursor Grok 4.6 High Fast. Ein Cartographer zur Zeit. Fact-check der Region N darf mit Cartographer N+1 überlappen, sobald N geschrieben ist.

## Reihenfolge

1. Hoenn
2. Johto
3. Sinnoh
4. Einall
5. Kanto

Audit `docs/analysis/maps.md` (13.08.) ist Baseline, **teilweise überholt**. Nummerierte Hoenn-Routen 106–107, 115, 122–123, 125–127, 130–134 plus Geo und Graph-Tests existieren bereits. Fact-checker muss den Live-Stand zählen, nicht die Audit-Tabelle kopieren.

## Done-Definition (Region)

- `defaultVersion` = Binding
- Nummerierte Routen der Binding-Edition als Node + Kante + Geo
- Spielrelevante Innenräume ja (Beispiel Hoenn: Abandoned Ship, Jagged Pass, New Mauville, Seafloor Cavern, Cave of Origin, Magma/Aqua Hideout). Battle Frontier, Sevii, Contest Hall, Trainer Hill: nein
- Einall: B2W2-only Nodes `postGame: true`. Default bleibt `black`
- Items: sichtbare Overworld-Bälle + Key/HM/TM am Node in `src/data/items-{region}.json`. Leere Meer-Routen nach einem Node-Nachzug sind ein Defekt
- Wildfang: `locationSlug` muss zur PokéAPI-Location passen. Raten-Logik nicht neu erfinden
- Geo-Keys = Node-IDs, keine Orphans
- Tests: neue IDs + Kanten in `regions.test.ts`

## Items

Shape: `CuratedItem` in `src/lib/mapdata.ts` (`itemSlug`, `name`, `note` EN-String oder `{en,de}`, `pocket`, optional `hidden`, `moveSlug`). Quelle: PokéWiki/Bulbapedia **Binding-Version**, nicht ORAS auf Smaragd-Nodes. `itemsForNode` liest curated + enriched; enriched-Items nur anfassen wenn der Node schon welche hat. Keine Trainer in enriched.

## Bewusste Lücken (nicht füllen)

Sevii. Battle Frontier. Kalos+. Leere SEO-Seiten. GO. Indoor ohne eigene Location in PokéAPI, wenn kein sinnvoller `locationSlug` existiert: Fact-checker markiert BEWUSST oder hängt den Dungeon an den Parent-Node als Item-Notiz, keine Fake-Location.
