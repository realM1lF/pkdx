# Produktideen — 13. August 2026

Klartext für uns. Kein Fachchinesisch. Was der Spieler merkt, steht zuerst.

Quelle der langen Analyse: `docs/analysis/improvements.md`.
Dieses Dokument erklärt dieselben Ideen so, dass man sie entscheiden kann.

**Aktueller Satz (wird gebaut):** Punkte 1–6.
**Später:** Smaragd-Trainer, Karten ab Kalos, GO-Leiste, Living Dex, Arena, ein ROM-Hack.

---

## Was die Seite sein soll

Kein Wikipedia. Ein Werkzeug beim Spielen:

- Wo fange ich das?
- Wen treffe ich auf der Route?
- Hält mein Team den nächsten Kampf?
- Was passiert im Nuzlocke, wenn jemand stirbt?

Kanto kann das schon gut (echte Trainer und Items aus dem Spiel).
Johto bis Einall haben oft nur die acht Arenen.
Ab Kalos gibt es im Nuzlocke Textlisten, keine Karte.

Wachsen = Hauptspiele tiefer machen. Nicht nebenbei Sleep, UNITE oder TCG aufmachen.

---

## Punkte 1–6 (aktueller Bau)

### 1. Vorschläge passend zum gewählten Spiel

**Heute:** Der Team-Builder lädt immer moderne Smogon-Sets (Karmesin/Purpur, OU).
Ein Team für Rot/Blau oder HeartGold bekommt trotzdem heutige Moves und Items.

**Soll:** Die Sets gehören zum ausgewählten Spiel. Gen 1 → alte OU-Sets, Gen 4 → HGSS/Platin-Sets, Gen 9 → SV plus optional VGC.

**Nicht:** Eine zweite Kampf-Engine. Nur die Vorschlags-Datei wechseln.

### 2. „Wo fangen?“ nach Edition

**Heute:** Auf der Pokémon-Seite werden Fundorte über alle Versionen zusammengemixt. Die beste Rate gewinnt. Feuerrot und HeartGold liegen in einer Zeile.

**Soll:** Nur die Edition zählen, die ausgewählt ist (wie `?v=` auf der Karte). Geschenke, Tausch und statische Begegnungen bleiben in der Extra-Sektion.

### 3. Typentabelle wie im Versus-Rechner

**Heute:** Versus rechnet typengerecht pro Generation (Geist vs. Psycho in Gen 1 usw.).
Die Dex-Seite hat eine fest verdrahtete moderne Tabelle. Beide können widersprechen.

**Soll:** Dieselbe Typen-Logik wie Versus, abhängig von der gewählten Generation auf der Dex-Seite.

### 4. Weiterspielen auf der Startseite

**Heute:** Home hat Held, Suche, Toolkit. Kein „hier warst du zuletzt“.

**Soll:** Eine kompakte Zeile: letzter Nuzlocke-Run und/oder letztes Team. Klick führt dorthin. Kein neues Backend, Daten liegen schon lokal.

### 5. Formen im Dex

**Heute:** Die Liste zeigt 1025 Arten. Alola-Rattfratz, Mega-Glurak, Galar-Ponyta fehlen als eigene Zeilen.

**Soll:** Standard bleibt die 1025 Arten. Ein Filter oder eine zweite Ansicht zeigt Regionalformen, Megas, Gigantamax. English slug bleibt die ID. Keine erfundenen Movesets für Z-A-Megas, wenn die API sie noch nicht hat.

### 6. Eigene Seiten für Johto- und Sinnoh-Routen

**Heute:** Kanto und Hoenn haben Google-Seiten pro Ort (`/maps/kanto/route-1`). Johto und Sinnoh haben schon Karten, aber kaum solche Unterseiten.

**Soll:** Dieselbe Art Seiten bauen (DE/EN-Slugs, Encounter-Tabelle, Meta ≤ 160 Zeichen). Nur Orte mit echten Fundorten. Kalos nicht in diesem Satz.

---

## Danach (nicht in diesem Bau)

### Echte Trainer von der Route (Smaragd zuerst)

Kanto kennt hunderte Trainer mit exaktem Team.
Hoenn/Johto/Sinnoh oft nur Arenaleiter per Wiki.
Als Nächstes: Smaragd auslesen wie Feuerrot, dann HeartGold, dann Platin.
Dann kann Versus gegen den nächsten Routen-Trainer planen.

### Karten ab Kalos

Kalos/Alola als Schema-Karte (Orts-IDs im Nuzlocke schon da).
Galar und Paldea sind offene Felder, keine nummerierten Routen.
Hisui und Z-A andere Fund-Logik. Nicht als Kanto-Karte faken.

### Pokémon GO (schmal)

Kein Live-Spawn, kein Scanner, keine zweite App.
Optional: auf der Pokémon-Seite ein Chip „gerade Raid-Boss / Community Day / Liga“, aus einer gespeicherten Datei.
Nach ein paar Monaten messen. Tot = wieder raus.

### Living Dex

Haken gefangen / shiny / Form. Zuerst nur im Browser.
Kein Login bei Pokémon HOME (kein öffentliches API).

### TCG-Arena

Karten ziehen, sammeln, kämpfen. Zweites Produkt.
Erst wenn Hoenn-Trainer und Kalos-Karten stehen, oder gar nicht.

### Ein ROM-Hack (z. B. Radical Red)

Eine Linie, auf der Kanto-Karte, eigene Trainer.
Erst nach den Smaragd-Trainern. Keine fünf Hacks parallel.

### Orre

Tracker ist da. Als Nächstes echte GC-Trainer für Versus. Keine erfundene Landkarte.

---

## Bewusst nicht

- Pokémon Sleep, UNITE, Masters
- Showdown als eingebetteten Client
- Chatbot, der Movesets erfindet
- Leere Orts-Seiten nur für Google
- Stack wechseln (React, Vite, Tailwind)
- Orts-IDs (`route_key`) umbenennen

---

## Reihenfolge

1. Punkte 1–6 (dieser Satz)
2. Smaragd-Trainer wie Kanto
3. HeartGold- und Platin-Trainer
4. Kalos-Schema-Karte
5. GO-Leiste mit Notausgang
