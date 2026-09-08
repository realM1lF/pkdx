# Abgleich Google Search Central

Stand 2026-09-08. Quellen verlinkt. Ist = dieses Repo + Live + GSC.

## Sitemap bauen und einreichen

Doku: [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions).

| Regel | Ist | Urteil |
|---|---|---|
| XML urlset 0.9, UTF-8, absolute https-URLs | `generate-sitemap.mjs` | Pass |
| Datei in der Root | `/sitemap.xml` | Pass |
| Auto aus eigener URL-Liste, nicht Crawler-Dump | `seo-routes.mjs` | Pass |
| ≤ 50k URLs / 50 MB | 692 URLs | Pass |
| `priority` / `changefreq` | nicht gesetzt (Google ignoriert) | Pass |
| Nur Canonicals, die in SERPs sollen | `/en/kampf-simulator/` fehlt in der Datei | Pass |
| hreflang: jedes `<url>` listet alle Varianten inkl. sich selbst + x-default | de, en, x-default→en | Pass |
| `lastmod` nur wenn prüfbar wahr | Build-Datum auf allen URLs | Ignore-Feld, kein Fehler |
| `robots.txt` Sitemap-Zeile | vorhanden | Pass |
| GSC-Submit volle URL bei Domain-Property | so eingereicht, danach processed | Pass |
| Submit = Hint, kein Index-Zwang | 692 gelesen, Sitemap-Report indexed 0 (Lag). Page Indexing 211 | Pass, Report nicht verwechseln |

Neue Site, GSC-Links 0 extern. Overview sagt, Sitemap ist nötig. Passt. Discover läuft (14 % der Crawls).

`lastmod` Best practice: echtes Änderungsdatum pro URL oder Tag weglassen.

## Indexierung

Doku: [How Search works](https://developers.google.com/search/docs/fundamentals/how-search-works), [Ask to recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Crawl ≠ Index. Index nie garantiert. Recrawl-Request auch nicht. „Crawled, currently not indexed“ bei erlaubtem Fetch heißt: Google hat gelesen und nicht behalten. Typisch Qualität, Duplikat-Cluster, zu wenig Nutzen.

Page Indexing 211. Filter und Host-Varianten korrekt ausgeschlossen. API-Inspect einzelner URLs am 08.09. widersprach zeitweise. Nicht als „0 im Index“ lesen.

Nicht: robots oder Fetch-Fail auf den Hubs. Account ist indexiert und soll noindex.

## JavaScript / Prerender

Doku: [JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

Prerender/SSR bleibt empfohlen. LocaleLink nutzt `href`, keine Hash-Routes. `SeoHead` setzt Title, Canonical, hreflang, JSON-LD nach Render. `prerender.mjs` speichert das serialisierte Dokument.

Risiko: Team-Hub ist auch nach Prerender fast leer (Empty-State). Soft-404-Nähe. App-Shell-Zähler auf Home („0 Pokémon“) im ersten HTML.

## Title und Snippet

Doku: [Title links](https://developers.google.com/search/docs/appearance/title-link), [Snippets](https://developers.google.com/search/docs/appearance/snippet).

Kein offizielles 50–60 / 160-Limit. Truncation nach Breite. Unique, knapp, Sprache = Seite, kein Stuffing. Snippet oft aus dem Body.

Ist: Tags unique, Sprache passt, kein Stuffing. Home etwas lang. Team/Pokédex austauschbar gegen Wikis.

## Offene Messungen

Erledigt in der UI: Page Indexing (211), Crawl-Stats (Host grün), Links (0/1, Report-Lag), Sicherheit (leer), Sitemap Erfolg.

Offen, nicht blockierend: GSC gerendertes HTML, PSI Lab, Plausible, vollständige 211-Liste, Einzel-Inspect Battle/Nuzlocke/Home nach der UI-Runde.
