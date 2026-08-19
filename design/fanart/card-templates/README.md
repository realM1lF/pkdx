# Fan-Art Karten-Templates

Wiederverwendbare Bausteine aus `baby-bisasam-pokemon-card.png` — Rahmen, Artwork, Badges, Icons und Layout-Koordinaten.

## Struktur

```
card-templates/
  layout.json              # Koordinaten, Fonts, DE/EN-Labels
  layers/
    frame-gold-holo.png    # Goldener Holo-Rahmen (transparent innen)
    text-panel-frosted.png # Optionale milchige Textfläche unten
    ui-overlay-reference-de.png  # Referenz-UI aus Originalkarte
    artwork/baby-bisasam.png
    badges/basic-de.png
    icons/grass-energy.png, fire-weakness.png, colorless-retreat.png
  examples/                # JSON-Konfigurationen pro Karte
  scripts/
    extract-templates.mjs  # Layer aus Referenz extrahieren
    assemble-card.mjs      # Karte aus JSON zusammensetzen
  output/                  # Generierte Karten
```

## Quick Start

```bash
cd design/fanart

# 1) Layer einmalig aus Referenz extrahieren
node card-templates/scripts/extract-templates.mjs

# 2) Karte aus JSON bauen
node card-templates/scripts/assemble-card.mjs card-templates/examples/baby-bisasam.de.json
node card-templates/scripts/assemble-card.mjs card-templates/examples/baby-bisasam.en.json
```

## Neue Karte anlegen

1. **Artwork** als PNG (1024×1536) nach `layers/artwork/<slug>.png` legen
2. **JSON** in `examples/` kopieren und anpassen:

| Feld | Bedeutung |
|---|---|
| `name` | Kartenname |
| `hp` | KP/HP |
| `type` | z. B. `grass` (für Typ-Symbol) |
| `textPanel` | `true` = milchige Fläche unten, `false` = Full-Art ohne Panel |
| `attacks[]` | Name, Kosten, Schaden, Effekttext |
| `lang` | `de` oder `en` (Labels) |

3. Assemble-Skript ausführen → Ergebnis in `output/`

## Layer im Detail

| Layer | Verwendung |
|---|---|
| `frame-gold-holo.png` | Immer oben drauf — definierter Kartenrand |
| `artwork/*.png` | Illustration (Full-Bleed 1024×1536) |
| `text-panel-frosted.png` | Optional — klassisches TCG-Textfeld |
| `badges/basic-de.png` | „BASIS“-Badge (EN: Text gerendert oder eigenes PNG) |
| `icons/*` | Energie-/Schwäche-/Rückzug-Symbole |

## Anpassungen

- **Koordinaten/Fonts:** `layout.json`
- **Neue Icons:** PNG crop aus Referenzkarte, in `layers/icons/`
- **EN-Badge:** `badges/basic-en.png` anlegen (1024-Canvas, Badge oben links)

## Hinweise

- Bildgröße: **1024 × 1536** (TCG-Hochformat 2.5:3.5)
- Text wird via ImageMagick (`magick`) gerendert — DejaVu Sans als Fallback
- `ui-overlay-reference-de.png` dient nur als Referenz für Positionen, nicht zum automatischen Compositing
- Fan-Art / privat — keine offiziellen Pokémon-Assets
