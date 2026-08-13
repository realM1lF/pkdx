---
description: Dex-Formen sauber integrieren (Mega/Alola/Galar) — Audit, UX, Tests
---

Arbeite in `/home/rin/Work/_private/pkdx`. Sprache mit dem Nutzer: Deutsch.

Lies zuerst und folge:

1. `.agents/skills/pkdx2-project-guide/SKILL.md` und `AGENTS.md`
2. `docs/superpowers/specs/2026-08-13-dex-formen-design.md` (Quelle der Wahrheit)
3. `docs/ai/i18n.md` sobald Namen/Suche angefasst werden

## Auftrag

Formen (Mega inkl. dunkles Mega-Glurak X, Alola, Galar, Hisui, Paldea, Gigantamax) **sauber, verifiziert, logisch, intuitiv** in Dex + Suche (+ Team-Picker soweit Legalität das hergibt) integrieren.

Das ist **kein Grünfeld**. 142 Formen liegen in `src/data/dex-forms.json` hinter dem Dex-Filter `special=forms`. Das Problem ist Auffindbarkeit und korrekte Namen, nicht „Katalog von Null“.

## So vorgehen

1. **Isolation:** `git status`. Unrelated WIP nicht anfassen. Eigenen Branch von `main` oder Stash. Kein Mix mit Papierkorb-Confirm / Navbar / Battle-Sim.
2. **Audit im Code und im Browser** (nicht raten): `/de/pokedex`, Filter Formen, Glurak, Suche ohne Filter, Detail-Slug `charizard-mega-x`, globale Suche. Spec-Abschnitt „Warum es sich fehlt anfühlt“ gegen den Ist-Stand prüfen.
3. **Kurzes UX-Design** dem Nutzer zeigen, bevor du große UI-Änderungen machst. Default bleibt 1025 Arten.
4. **TDD** für Lookup, Filter, Suche. Erst Tests, dann Code.
5. **Bauen** entlang der Spec-Produktregeln. English slugs. Offizielle DE-Namen. `<Sprite>`. LocaleLink. i18n EN+DE. Keine erfundenen ZA-Mega-Movesets.
6. **Verifizieren** mit der Tabelle in der Spec. `npx tsc -b` und die genannten Vitest-Pfade wirklich laufen lassen. Beide Locales, keine missing-key Warnings.

Nicht committen oder pushen, außer der Nutzer das ausdrücklich will.
