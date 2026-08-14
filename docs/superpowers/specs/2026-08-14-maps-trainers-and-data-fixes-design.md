# Maps: Trainerliste + Datenfehler — Design

Status: 2026-08-14. Ausführung: Subagent-Driven auf Branch `feat/maps-trainers-and-data-fixes`.

## Ziel

Auf den fünf Atlas-Karten (Kanto, Johto, Hoenn, Sinnoh, Einall) sieht der Spieler am Ort die Trainer, die in `enriched/{region}.json` hängen. Bekannte Datenfehler werden gegen die Binding-Version geprüft und nur dann geändert, wenn die Quelle das Team wirklich falsch hat. Keine SEO-Seiten.

## Binding-Versionen

Kanto = FRLG, Johto = HGSS, Hoenn = Smaragd, Sinnoh = Platin, Einall = Schwarz/Weiß.

## Was der Spieler merkt

1. Drawer bekommt einen dritten Tab **Trainer**, neben Fundorte und Items. Zeile 36–44px, `<Sprite>` fürs Ace, Name + Klasse, Party-Sprites, Klick öffnet Versus wie der bestehende Button.
2. Versus-Picker listet nicht nur Arenaleiter. Routen-Trainer und Rivalen aus derselben JSON erscheinen in eigenen Gruppen.
3. Johto-Top-Vier und Lance hängen nicht mehr am Silberberg. Neuer Node `johto-pokemon-league` (kein Rename).
4. HM Wasserfall hängt an `dragons-den`, nicht am Eispfad. Notiz bleibt: Clair nach dem Test in der Drachenhöhle (HGSS).
5. Alder (BW-Champ) hat das Liga-Team mit Volcarona 77, nicht Haxorus 53.
6. Originalansicht sagt ehrlich, welches Bild das ist (Gold/Silber, Schwarz 2, …), getrennt vom Default-Chip (HeartGold, Schwarz).

## Bewusst nicht in diesem Slice

- SEO-Prerender, `seo-routes.mjs`, neue Ortsseiten (Einall bleibt 0 Seiten).
- pret-Parser für Smaragd/HGSS/Platin/BW. Johto–Einall-Routen haben weiterhin keine Routen-Trainer in der JSON. Der Tab zeigt dann den ehrlichen Leertext. Kanto hat die 368 schon.
- Geo-Pins neu auf dem Originalbild klicken. Marker bleiben interpoliert. Kein neues Artwork im Repo (kein HGSS-/BW-Rip ohne Credits-Klärung).
- Leere Item-Zellen nachfüllen.
- Kalos+ Karten, Node-IDs umbenennen, `route_key` ändern.

## Datenprüfung (nicht raten)

**Giovanni Viridian Gym, FRLG (Bulbapedia Viridian Gym, Abschnitt FireRed and LeafGreen):** 5 Mons, Ace ist Rhyhorn 50, nicht Rhydon. Reihenfolge: Rhyhorn 45, Dugtrio 42, Nidoqueen 44, Nidoking 45, Rhyhorn 50. Das steht so in `enriched/kanto.json`. Das Inventar vom 13.08. lag falsch (Rhydon ist Rot/Blau bzw. Manga, nicht FRLG-Arena). **Nicht umschreiben.** Test pinnt das FRLG-Team, damit niemand es „repariert“.

**Alder, BW Liga (Bulbapedia Alder, Abschnitt Pokémon Black and White, Champion):** Accelgor 75, Bouffalant 75, Druddigon 75, Vanilluxe 75, Escavalier 75, Volcarona 77. Moves wie auf der Wiki-Seite (Bug Buzz / Focus Blast / Me First / Energy Ball usw.). Aktuelle JSON hat Haxorus und Level ~50: **ersetzen**.

**HM07 Johto:** Item-Notiz ist schon HGSS-korrekt. Node ist falsch (`ice-path`). Ziel-Node `dragons-den` existiert.

**Johto-E4:** JSON-Key `mt-silver`. Silberberg ist Red (postGame). Liga ist davor. Neuer Node, E4+Lance dorthin verschieben. `mt-silver` bleibt für Red/Items.

## Vertrag

- Englische Slugs/IDs. Neuer Node nur additiv: `johto-pokemon-league`.
- LocaleLink, i18n EN+DE, offizielle DE-Begriffe (Top Vier, Champ, Arenaleiter).
- `<Sprite>`, `data-lenis-prevent` am Drawer-Scroll (schon da).
- Fehler nie rot.
- Trainer-Namen/Klassen bleiben Englisch (AGENTS.md §6).
- Dieselbe `enriched/`-Datei füttert Drawer, Nuzlocke-Versus, Detail-Versus. Kein zweiter Join.

## UI

Tab-Label: `maps.trainersTab` = `TRAINERS {{count}}` / `TRAINER {{count}}`.
Leer: `maps.noTrainers` kurz, sachlich.
Versus-Button-Text: von „Leader“ auf Trainer verallgemeinern (`maps.planVersus`).
Picker-Gruppen: Leaders, E4 & Champion, Boss, Rival, Route (Rest). Filter `important` fällt weg.

## Tests

- FRLG Giovanni-Arena: 5 Mons, letztes Rhyhorn 50.
- Alder: 6 Mons, Ace Volcarona 77, kein Haxorus.
- HM07 nur unter `dragons-den`, nicht unter `ice-path`.
- `johto-pokemon-league` in region + geo, Kante zu `tohjo-falls`, E4 nicht mehr an `mt-silver`.
- `trainersAtNode('kanto', 'kanto-route-1')` length > 0.
- Picker-Gruppierung: Youngster/Lass landen in Route, nicht in Leaders.
- Geo-Keys = Node-IDs nach dem neuen Johto-Node.
