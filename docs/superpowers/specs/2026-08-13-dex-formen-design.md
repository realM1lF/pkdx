# Dex-Formen v1 — strip-only (Detail der Basisart)

Status: v1, 2026-08-13. Die Such-UX in der ersten Fassung dieser Datei ist **nicht** v1.

## Ziel

Formen nur auf der Pokémon-Detailseite der **Basisart**. Glurak zeigt Mega X/Y + Gmax als Leiste. Klick öffnet `/pokemon/{english-slug}` (z. B. `charizard-mega-x`).

Default-Dex bleibt **1025 Arten**. Keine Mega-Zeile im Grid, keine Formen in Suche / CommandSearch / Team-Picker / Versus-Autocomplete. Kein Special-Filter „Formen“.

## Was v1 ist

- Katalog `src/data/dex-forms.json`
- Offizielle Namen `src/data/i18n/form-names.json` + `src/lib/form-names.ts` + `scripts/build-form-names.mjs`
- Identität `src/lib/dex-forms-catalog.ts` (`formIdentity`, `formsForSpecies`, `dexEntryPath`)
- `src/pages/detail/FormStrip.tsx` + Hero-Identität + Title über Slug
- i18n `detail.hero.forms` (EN+DE) plus Form-Kind-Chips (`pokedex.formsMega` …)
- Form-Detail: Dex# = National-ID (`#006` nicht 10034), Gen aus Katalog (Mega = Kalos/Gen 6), Typen/Stats/Learnset live aus PokéAPI. Gmax-Learnset darf leer sein. Sprites nur `<Sprite>`. LocaleLink.

## Was v1 nicht ist

Suche merged keine Formen. Globale Suche indexiert keine Formen. Team-Picker und Versus-Gegner-Autocomplete nicht. Special-Filter „Formen“ ist aus der UI. `filterEntries` merged `formIndex` nicht. Unown, Kampf-Formen, ZA-Megas, Formen in Teams/Nuzlocke: später. Hisui-Lücke `basculin-white-striped` ignorieren.

## Verifikation

- `/de/pokedex` zählt 1025; Suche „mega glurak“ findet kein Mega als Extra-Row
- `/de/pokemon/6` Leiste Mega X/Y + Gmax; Klick Mega X
- `/de/pokemon/charizard-mega-x` H1 Mega-Glurak X, `#006`, Kalos GEN VI, Feuer/Drache
- Team-Picker „mega glurak“ kein Form-Treffer
