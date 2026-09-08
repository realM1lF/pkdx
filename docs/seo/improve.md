# Verbessern

Priorität nach Evidence. Kein Code in diesem Dokument. Nächster Agent arbeitet diese Liste ab, nichts darüber.

Lage: [gsc-2026-09.md](./gsc-2026-09.md). Themen: [topics.md](./topics.md).

## 1. noindex auf Flächen, die nicht in die Suche sollen

`SeoHead` noindex heute nur `/team/:id` und `/overlay/`.

Indexiert und falsch:

- `/en/account/` (Login). noindex, nofollow.
- Optional denselben Schutz für andere Account-only Surfaces, falls sie crawlbar sind.

Impressum darf indexiert bleiben (Impressumspflicht). Kein Traffic-Ziel, kein Aufwand.

## 2. Ein Battle-Slug und ein Team-Host pro Locale

`App.tsx` routet `kampf-simulator` und `battle-simulator` unter jeder `:lang`. Live: `/en/kampf-simulator/` mit eigenem Canonical, 2 Klicks. DE-Slug unter EN bei Versus (`/en/versus/glurak-gegen-turtok/`, `/en/versus/arceus-gegen-mewtu/`).

301:

- `/en/kampf-simulator/` → `/en/battle-simulator/`
- `/de/battle-simulator/` → `/de/kampf-simulator/`
- `https://mypokepanion.com/team` → locale Hub (`/en/team/` oder Language-302 wie Root)
- Versus: DE-Slug unter `/en/` und EN-Slug unter `/de/` auf die richtige Locale-URL

Sitemap bleibt bei den richtigen Slugs. Cross-Locale-Links nur `LocaleLink` / `useLocalePath()`.

## 3. Team-Hub und Home: Substanz im ersten HTML

Team EN ist indexiert und dünn (Empty-State). Home zeigt „0“-Zähler ohne JS. Soft-404-Nähe, auch wenn GSC Soft 404 nicht als Hauptgrund geliefert hat.

Team: sichtbarer Erklärungstext im Prerender (was der Builder tut, Coverage, Export, Legalität), analog Nuzlocke. Home: Zähler füllen oder weglassen. Dex: kurzer Lead über dem Grid, kein zweites Wiki.

`index.html`-Fallback: Canonical `/` und x-default `/`. Darf keine prerenderte URL überschreiben.

## 4. Sitemap-Wartung

Fetch läuft, 692, Erfolg.

- `lastmod` echt oder streichen (`scripts/generate-sitemap.mjs`).
- In `_redirects` `/sitemap.xml` und `/robots.txt` vor `/* → index.html` explizit durchreichen.
- Sitemap-Report `indexed: 0` ignorieren, solange Page Indexing 211 zeigt. Nach Deploys nur Fehlerzeile prüfen.

## 5. Facetten und SearchAction

Filter-URLs sind schon „Alternative mit richtigem Canonical“. Absichern im Code: `?type=`, `?q=`, Versus-Query, Nuzlocke-Wizard canonicalisieren auf den Hub. Nicht in die Sitemap. Keine eigenen Titles pro Filter. Typ-Seiten `/en/types/:slug/` bzw. `/de/typen/:slug/` sind die echten URLs.

`WebSite` SearchAction zeigt immer auf EN-Dex `?q=`. Target nach Sprache (`/de/pokedex?q=`).

## 6. Interne Links und Brand

GSC-Links-Report ist leer/laggig. Trotzdem: Battle und Dex als Hub, beschreibende Anchors, About/Footer mit Namen. Kein Linkkauf. Kein Brand-Stuffing auf Tool-Seiten.

## 7. Home-Title kürzen

`DEFAULT_META` EN ~67 Zeichen. Kürzen, Brand darf bleiben. Kein Keyword-Umbau an Pokédex/Team (Pos 60–80, Impression-Müll).

## 8. Recrawl erst nach Substanz

„Indexierung beantragen“ erst wenn 1–3 live sind. Request ohne Änderung ändert nichts.

## Nicht tun

- Title umschreiben gegen 2382 Dex-Müll-Impressions.
- Massen-Pokémon- oder Matchup-Seiten, weil Google schon IDs außerhalb `POKEMON_SEO_IDS` indexiert. Keine neuen IDs in `seo-routes.mjs` ohne Unique Value (AGENTS.md §8).
- Orre/TCG halb indexieren. Entweder Unique Copy + Sitemap + Prerender oder noindex.
- Destructive GSC (Property löschen, Sitemap delete).
- 692-URL On-Page-Audit oder Swarm über alle prerendered Pages.
