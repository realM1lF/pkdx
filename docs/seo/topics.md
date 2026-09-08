# Offizielle Themen, die vorher fehlten

Stand 2026-09-08 Abend. Jeder Block: Google-Empfehlung, Ist, Tun.
Leitlinie: [Search Essentials](https://developers.google.com/search/docs/essentials), [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
Erscheinen in der Suche ist nie garantiert.

Zahlen: [gsc-2026-09.md](./gsc-2026-09.md). Code-Reihenfolge: [improve.md](./improve.md).

## 1. Page Indexing (ganze Property)

**Google:** Indexierung und Ausschlussgründe stehen im Bericht Seiten. Kategorien wie Crawled not indexed, Soft 404, Alternative mit richtigem Canonical, Weiterleitung, Duplikat, noindex.

**Ist:** 211 indexiert. Ausgeschlossen wie erwartet: Host-Varianten (http/www), Filter-Canonicals, Versus-Duplikate. Stichprobe enthält Dex EN/DE, Team EN, Types, Versus, viele `/pokemon/:id` außerhalb der Sitemap-Kuratierung, plus `/en/account/`, `/en/impressum/`, `/team` ohne Locale. API-Inspect einzelner Hubs am selben Tag widersprach (not indexed). Seitenbericht gilt.

**Tun:** Keine weiteren UI-Summen. Code nach improve.md. Account noindex. Locale-301. Team-Text.

## 2. Crawl-Stats und Server-Logs

**Google:** Crawl-Stats zeigen, ob Googlebot kommt und ob der Host last abweist. 5xx / Timeout drosseln Crawl.

**Ist:** 4489 Anfragen / 90 Tage, 252 ms, Host keine Probleme, 99 % 200. Spike 10.–14.08. JS 66 % / HTML 21 % (Assets). Refresh 86 %. Smartphone-Bot 7 % der Requests, Resource-Load 39 %. Netlify-Logs nicht gezogen.

**Tun:** Kein Host-Fix. Netlify-Logs nur bei künftigem 5xx oder Sitemap-Fehler.

## 3. robots.txt, Header, CSP

**Google:** robots.txt steuert Crawl, nicht Index. Wichtige Ressourcen nicht blocken.

**Ist:** `Allow: /`, Sitemap-Zeile da. AI-Bots extra erlaubt. CSP ohne `unsafe-inline` für Scripts. Sitemap von Google gelesen.

**Tun:** robots nicht verschärfen. Nach CSP-Änderung `npm run build && node scripts/check-csp.mjs`. noindex nur wo gewollt (Account), nicht auf Hubs.

## 4. Host, HTTPS, Redirects

**Google:** Eine Canonical-Host-Variante. 301 zur Sitemap-URL. Keine Ketten.

**Ist:** Domain-Property. Root 302 nach Language. www/http in „Weiterleitung“, Host beide grün. `/team` ohne Locale indexiert. Cross-Locale-Battle-Slugs ohne 301.

**Tun:** 301 in improve.md. Sitemap.xml und robots.txt vor dem SPA-Catch-all. Root-302 bleibt (Language).

## 5. Soft 404

**Google:** Leere HTML bei 200 wirkt wie Soft 404.

**Ist:** Team indexiert trotz Empty-State. Home „0“-Zähler. User hat Soft 404 nicht als Top-Grund geliefert. Nähe bleibt.

**Tun:** Team- und Home-Prerender härten. Soft-404-Zähler nicht erneut abfragen, außer er taucht nach Deploys auf.

## 6. Canonical und hreflang im Live-HTML

**Google:** Canonical in HTML, hreflang-Cluster vollständig, x-default = Fallback.

**Ist:** `SeoHead` setzt de/en/x-default→en. Shell `index.html`: Canonical `/`, x-default `/`. Filter-URLs: Google akzeptiert Canonical (UI-Kategorie). Cross-Slug Versus/Battle: eigene Canonicals, falsch.

**Tun:** 301 statt zweiter Canonical. Shell-x-default auf `/en/` wenn eine URL ohne Prerender ausgeliefert wird.

## 7. Structured Data

**Google:** Nur Typen, die zum sichtbaren Inhalt passen. Nicht lügen.

**Ist:** Organization, WebSite+SearchAction (Target immer EN-Dex `?q=`), BreadcrumbList, FAQPage auf Nuzlocke, SoftwareApplication. Erster Inspect Battle/Dex: Breadcrumb PASS. Image-Search tot.

**Tun:** SearchAction nach Sprache. FAQ nur wo Q&A sichtbar. Kein FAQ auf Team-Empty.

## 8. Parameter und Facetten

**Google:** Facetten nicht als eigene Index-Ziele. Canonical auf die saubere URL.

**Ist:** Dex `?type=` steht in „Alternative mit richtigem kanonischem Tag“. Versus `?you=6` als Weiterleitung. Gut.

**Tun:** Im Code absichern, nicht in Sitemap, keine Filter-Titles. Typ-Hubs `/types/` und `/typen/` sind die Seiten.

## 9. Bilder, Video, News, Discover

**Google:** Alt, crawlbare Datei-URLs. Video/News-Sitemap nur bei solchem Content.

**Ist:** `<Sprite>` Alt mit Name+Ära. Image-Search 3 Imp. Kein News.

**Tun:** Keine Image-Sitemap. Discover ignorieren.

## 10. Page Experience / CWV

**Google:** LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1. Mobile first.

**Ist:** GSC-Leistung: Mobile Pos ~14, Desktop ~64. PSI Home mobile: CrUX keine Daten. Lab nicht notiert. Crawl 252 ms Host.

**Tun:** Lab-Zahlen optional nachtragen. Kein Umbau nur wegen Labor.

## 11. JavaScript, gerendertes HTML

**Google:** Erst HTML crawlen, dann rendern. Prerender hilft. Links als `<a href>`.

**Ist:** Prerender Pflicht. LocaleLink = href. Live-Fetch: Battle/Nuzlocke Text, Team dünn. Crawl 66 % JS = Assets.

**Tun:** Nach Deploy GSC Live-HTML nur wenn eine Hub-URL leer wirkt. Sonst Pipeline so lassen.

## 12. Volles On-Page (8 Dimensionen)

**Google:** Suchworte in Title, H1, sichtbarem Text. Eine H1.

**Ist:** Battle passt zu den Queries. Team H1 ohne Body, trotzdem indexiert. Home H1 trifft keine Query. Dex indexiert mit wenig Lead.

**Tun:** seo-onpage nur Battle, Nuzlocke, Team, Home. Nicht 692 URLs.

## 13. Keyword-Research

**Google:** Worte der Nutzer. GSC zeigt, wofür ihr erscheint.

**Ist:** Nur GSC-Queries. Brand 0 Zeilen.

**Tun:** Zielworte bleiben die Battle-Queries. Kein extra Tool für den Fix.

## 14. Kannibalisierung

**Google:** Eine Canonical pro Inhalt. Sitemap nur die bevorzugte URL.

**Ist:** Battle-Doppel-Slug. Versus DE-Slug unter EN. `/en/versus/charizard-vs-blastoise/` als Duplikat geführt (gewünschte EN-URL). Dex-Filter vs `/types/`. `/team` vs `/en/team/`.

**Tun:** 301 Cross-Slug. Versus-Hub vs Matchup trennen. Keine zweite Simulator-Landing.

## 15. Helpful content / E-E-A-T

**Google:** People-first. Who / How / Why. Keine Search-Engine-first-Masse.

**Ist:** About crawled not indexed (API). Battle erklärt die Engine. Team-Hub hilft Erstbesuchern kaum. Account im Index hilft nicht.

**Tun:** Team-Text. About verlinkt lassen. Keine AI-Masse.

## 16. Prerender vs Hydration

**Google:** Inhalt im ersten HTML.

**Ist:** Pipeline da. Home 0. Team empty. Dex-Grid ohne Intro. Dex und Team trotzdem indexiert.

**Tun:** Wie Abschnitt 5. Index allein ersetzt keinen Nutzen.

## 17. Backlinks und Links-Bericht

**Google:** Anderen von der Site erzählen. Links kaufen ist Spam.

**Ist:** UI: 0 extern, 1 intern. Unvollständig. Discover läuft über Sitemap (14 % Discovery-Crawl).

**Tun:** Kein Linkkauf. Communities ehrlich (Nuzlocke, Showdown-Kreis), kein Doorway. Report nicht als „keine internen Links“ lesen.

## 18. Brand

**Google:** Wiedererkennung hilft.

**Ist:** 0 Queries `mypokepanion`.

**Tun:** Name auf Home-Title, About, Footer. Kein Stuffing.

## 19. Konkurrenz / Intent

**Google:** Substantial value. Nicht kopieren.

**Ist:** Head-Query Battle → Pokémon Showdown. Winkel: 1v1, Gen, Nuzlocke-Prep, kein Ladder.

**Tun:** Kein Showdown-Klon. Differenz im ersten Screen lassen.

## 20. International (DE)

**Google:** hreflang. Sprache der Seite = Title.

**Ist:** `/:lang` Pflicht. DE-Volumen klein, Pos besser. SearchAction immer EN. DE-Slugs unter `/en/` indexiert oder als Duplikat gesehen.

**Tun:** SearchAction DE. 301 Cross-Slug. Entity-IDs bleiben englische Slugs im Datenmodell, URL-Locale muss zur Slug-Sprache der Versus-Paare passen (bereits so designed in `seo-routes.mjs`).

## 21. Flächen außerhalb der Sitemap

**Google:** Unverlinktes ohne Sitemap findet Google oft nicht. Hier findet es SPA-Routen trotzdem.

**Ist:** Orre/TCG unknown, nicht in `seo-routes`. Account und nacktes `/team` indexiert ohne Sitemap-Absicht. Pokémon-IDs außerhalb `POKEMON_SEO_IDS` indexiert.

**Tun:** Account noindex. Orre/TCG: ganz oder gar nicht. Keine nachträgliche Massenaufnahme der gefundenen IDs in die Sitemap.

## 22. Pokémon- und Map-Unterseiten

**Google:** Jede URL eigener Nutzen. Scaled content abuse bei Masse ohne Mehrwert.

**Ist:** Sitemap 35 Dex-IDs plus Maps/Matchups. Index enthält Forms und hohe IDs. Das ist Entdeckung, kein Freibrief für 1025 Seiten.

**Tun:** Keine neuen Massen-IDs. Bestehende kuratierte Seiten: Encounter/Calc im HTML. AGENTS.md §8.

## 23. Search Appearance (Sitelinks, FAQ)

**Google:** Sitelinks kaum steuerbar. FAQ nur bei sichtbaren Fragen + FAQPage.

**Ist:** FAQ-Schema auf Nuzlocke. Battle-Q&A sichtbar, Schema-Parität prüfen. Sitelinks: keine Daten.

**Tun:** Battle-Q&A an `faqPageSchema` wenn die Fragen im HTML stehen. Nicht erzwingen.

## 24. Analytics neben GSC

**Google:** GSC für Suche. Verhalten ist Produkt.

**Ist:** Plausible in CSP. Zahlen nicht gezogen.

**Tun:** Optional Landings 28 Tage gegen GSC-Top-Pages. Nicht blockierend.

## 25. Manuelle Maßnahmen, Sicherheit

**Google:** Bei leer nichts tun.

**Ist:** Keine Probleme erkannt.

**Tun:** Fertig.

## 26. Crawlable Links

**Google:** `<a href>`.

**Ist:** LocaleLink bindend. Trotzdem indexierte URLs ohne Locale (`/team`) und Cross-Slug Versus.

**Tun:** Neue CTAs nur mit href. 301 für die Lecks.

## 27. Spam / scaled content

**Google:** Massenautomation für Rankings ist Spam.

**Ist:** Projekt verbietet Doorway. Risiko: Matchup-Generator und „Google hat die ID schon, also sitemap“.

**Tun:** Neue programmatische URL nur mit eigenem Fakten-Satz. Sonst nicht prerendern, nicht in `seo-routes`.

## Reihenfolge

1. Code: improve.md 1–3 (noindex Account, 301, Team/Home-Text).
2. Sitemap lastmod + `_redirects`.
3. SearchAction DE, Filter-Canonical hart.
4. Recrawl nur geänderter Hubs.
5. Ausbau nur nach [expand.md](./expand.md).
