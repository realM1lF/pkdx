# Projektanalyse — 2026-08-13

Vier parallele Audits. Diskussionsgrundlage, keine Fixes. Status: fertig.

| Datei | Scope | Schärfster Punkt |
|---|---|---|
| [maps.md](./maps.md) | Maps + Unterseiten | GSC/HGSS-Raten ignorieren `condition_values` (Tageszeit/Schwarm/Radio) |
| [security.md](./security.md) | CSP, RLS, Auth, XSS, Headers | Außenhaut dicht; Lücken hinter Session (Self-Join, Signup, owner_id) |
| [nuzlocke.md](./nuzlocke.md) | Solo + Multiplayer | Einall-8. Arena falsch; SoulLink-Undo; Join-Race; Go-Online |
| [improvements.md](./improvements.md) | APIs, Quellen, Spiele inkl. GO | Tiefe der Hauptspiele vor neuen Marken; GO schmal, kein Live-Spawn |

Kein Produktionscode geändert. Nicht committed.
