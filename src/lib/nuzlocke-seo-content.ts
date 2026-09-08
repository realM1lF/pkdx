import type { Lang } from './i18n-data';
import type { NuzlockeSeoSlug } from './nuzlocke-seo';

export interface NuzlockeFaqItem {
  q: string;
  a: string;
}

interface NuzlockeSeoContent {
  features: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  games: {
    eyebrow: string;
    title: string;
    body: string;
    freeformNote: string;
  };
  multi: {
    eyebrow: string;
    title: string;
    body: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: NuzlockeFaqItem[];
  };
  links: {
    eyebrow: string;
    title: string;
    satellites: Record<NuzlockeSeoSlug, { label: string; body: string }>;
    maps: { label: string; body: string };
    team: { label: string; body: string };
    versus: { label: string; body: string };
  };
}

export const NUZLOCKE_SEO_CONTENT: Record<Lang, NuzlockeSeoContent> = {
  en: {
    features: {
      eyebrow: 'RUN CONTROL',
      title: 'Keep every Nuzlocke decision visible',
      items: [
        { title: 'Route encounters', body: 'Record the first encounter for each route and see which catches are still open.' },
        { title: 'Team and losses', body: 'Keep the current team, boxed Pokémon and fallen partners in one run log.' },
        { title: 'Rules that fit the run', body: 'Start with the standard rules, then document the clauses your group actually uses.' },
        { title: 'Regional maps', body: 'Use Kanto, Johto, Hoenn, Sinnoh and Unova maps to plan the next route without replacing the real result.' },
        { title: 'Solo and Soul Link', body: 'Track a personal challenge or share a run with partners through an invite code.' },
        { title: 'Free in the browser', body: 'Create a run without an install and return to its team, encounters and losses from the browser.' },
      ],
    },
    games: {
      eyebrow: 'GAME COVERAGE',
      title: 'Supported games and regions',
      body: 'Guided route and encounter tracking is available for the Gen 1–5 regions Kanto, Johto, Hoenn, Sinnoh and Unova. Each run keeps route outcomes next to the team and loss history.',
      freeformNote: 'For Gen 6–9 games, create a freeform run to track your own rules, team and losses without claiming guided route data.',
    },
    multi: {
      eyebrow: 'SHARED RUNS',
      title: 'Soul Link and multiplayer tracking',
      body: 'Create a shared run, invite partners with a code and keep encounters, teams and losses in sync. It supports Soul Link and other group formats without pretending that every group uses the same clauses.',
    },
    faq: {
      eyebrow: 'QUESTIONS & ANSWERS',
      title: 'Nuzlocke tracker FAQ',
      items: [
        { q: 'Which games have guided route tracking?', a: 'Guided tracking is per region. Presets open FireRed (Kanto), HeartGold (Johto), Emerald (Hoenn), Platinum (Sinnoh) and Black/White (Unova).' },
        { q: 'Can I track newer Pokémon games?', a: 'Yes. Runs from Generation 6 onward are freeform. Add locations as the run reaches them. Team and losses still log; there is no built-in encounter table.' },
        { q: 'Can several players use the same run?', a: 'Yes. One invite code adds partners to the same run. Each player keeps a party; encounters and losses sit on the shared log.' },
        { q: 'Does the tracker enforce Nuzlocke rules?', a: 'No. Add the clauses the run uses, such as duplicate, shiny or reset rules. The tracker records decisions rather than choosing a format.' },
        { q: 'Can I record a failed first catch?', a: 'Yes. Save the route outcome that happened. This keeps an area from looking open when the run rules consider its encounter used.' },
        { q: 'Are maps available for Nuzlocke planning?', a: 'Yes. The run region uses the same atlas as the Maps pages, including encounter tables on route nodes. The log still records what actually happened.' },
        { q: 'Can I keep boxed Pokémon and deaths separate?', a: 'Yes. The active party, the box and fallen partners stay on one run, with missed and duped marked on the route log.' },
        { q: 'Do I need to install an app?', a: 'No. The tracker is a website. Create and manage a run in the browser; there is no app-store install.' },
        { q: 'Can Soul Link partners use their own rules?', a: 'Yes. Linked faint and encounter clauses are group decisions. The tracker stores outcomes; it does not pick a Soul Link rule pack.' },
      ],
    },
    links: {
      eyebrow: 'PLAN THE NEXT STEP',
      title: 'Nuzlocke guides and useful tools',
      satellites: {
        'soul-link': { label: 'Soul Link Nuzlocke', body: 'Set up a shared run for linked partners.' },
        firered: { label: 'FireRed Nuzlocke', body: 'Plan a Kanto run with route tracking.' },
        emerald: { label: 'Emerald Nuzlocke', body: 'Prepare a Hoenn run and its encounters.' },
        platinum: { label: 'Platinum Nuzlocke', body: 'Keep a Sinnoh run organized route by route.' },
        heartgold: { label: 'HeartGold Nuzlocke', body: 'Track a Johto run from the first encounter onward.' },
        'black-white': { label: 'Black & White Nuzlocke', body: 'Plan an Unova run with the regional tracker.' },
      },
      maps: { label: 'Interactive maps', body: 'Check routes, locations and encounter tables.' },
      team: { label: 'Team Builder', body: 'Check type coverage before the next major battle.' },
      versus: { label: 'Versus Calc', body: 'Compare matchups and damage for a difficult fight.' },
    },
  },
  de: {
    features: {
      eyebrow: 'RUN-KONTROLLE',
      title: 'Jede Nuzlocke-Entscheidung im Blick',
      items: [
        { title: 'Routen-Begegnungen', body: 'Halte die erste Begegnung jeder Route fest und sieh, welche Fänge noch offen sind.' },
        { title: 'Team und Verluste', body: 'Aktuelles Team, Box-Pokémon und gefallene Partner stehen gemeinsam im Run-Protokoll.' },
        { title: 'Regeln für den eigenen Run', body: 'Mit den Standardregeln starten und die Klauseln dokumentieren, die für die Gruppe gelten.' },
        { title: 'Regionskarten', body: 'Karten für Kanto, Johto, Hoenn, Sinnoh und Einall helfen bei der Routenplanung, ohne das tatsächliche Ergebnis zu ersetzen.' },
        { title: 'Solo und Soul Link', body: 'Führe eine persönliche Challenge oder teile einen Run per Einladungscode mit Partnern.' },
        { title: 'Kostenlos im Browser', body: 'Einen Run ohne Installation anlegen und Team, Begegnungen sowie Verluste im Browser weiterführen.' },
      ],
    },
    games: {
      eyebrow: 'SPIELABDECKUNG',
      title: 'Unterstützte Spiele und Regionen',
      body: 'Geführtes Routen- und Begegnungs-Tracking ist für die Regionen der Generationen 1–5 verfügbar: Kanto, Johto, Hoenn, Sinnoh und Einall. Routenergebnisse stehen dabei neben Team und Verlustprotokoll.',
      freeformNote: 'Für Spiele der Generationen 6–9 lässt sich ein freier Run ohne Routenführer anlegen; Regeln, Team und Verluste werden manuell gepflegt, ohne geführte Regionsdaten vorzutäuschen.',
    },
    multi: {
      eyebrow: 'GEMEINSAME RUNS',
      title: 'Soul Link und Multiplayer-Tracking',
      body: 'Erstelle einen gemeinsamen Run, lade Partner per Code ein und halte Begegnungen, Teams sowie Verluste synchron. Soul Link und andere Gruppenformate bleiben bei den Regeln der Gruppe, statt ein einheitliches Format vorzutäuschen.',
    },
    faq: {
      eyebrow: 'FRAGEN & ANTWORTEN',
      title: 'FAQ zum Nuzlocke-Tracker',
      items: [
        { q: 'Welche Spiele haben geführtes Routen-Tracking?', a: 'Geführtes Tracking folgt der Region. Voreinstellungen öffnen Feuerrot (Kanto), HeartGold (Johto), Smaragd (Hoenn), Platin (Sinnoh) und Schwarz/Weiß (Einall).' },
        { q: 'Kann ich neuere Pokémon-Spiele tracken?', a: 'Ja. Runs ab Generation 6 sind frei. Orte werden ergänzt, sobald der Run sie erreicht. Team und Verluste bleiben im Protokoll, ohne eingebaute Encounter-Tabelle.' },
        { q: 'Können mehrere Personen denselben Run nutzen?', a: 'Ja. Ein Einladungscode fügt Partner zum selben Run hinzu. Jede Person behält eine eigene Party; Begegnungen und Verluste stehen im gemeinsamen Protokoll.' },
        { q: 'Erzwingt der Tracker Nuzlocke-Regeln?', a: 'Nein. Klauseln wie Duplikate, Shinys oder Neustarts werden im Run festgehalten. Der Tracker dokumentiert Entscheidungen, statt ein Format festzulegen.' },
        { q: 'Lässt sich ein verfehlter erster Fang eintragen?', a: 'Ja. Das tatsächliche Routenergebnis bleibt gespeichert. So erscheint ein Gebiet nicht als offen, wenn die Regeln seine Begegnung bereits als genutzt behandeln.' },
        { q: 'Gibt es Karten für die Nuzlocke-Planung?', a: 'Ja. Die Run-Region nutzt denselben Atlas wie die Maps-Seiten, inklusive Encounter-Tabellen an den Routen. Das Protokoll hält fest, was wirklich passiert ist.' },
        { q: 'Können Box-Pokémon und Tode getrennt bleiben?', a: 'Ja. Aktive Party, Box und gefallene Partner bleiben in einem Run. Verpasst und Duplett stehen als eigene Markierungen im Routenprotokoll.' },
        { q: 'Ist eine App-Installation nötig?', a: 'Nein. Der Tracker ist eine Website. Runs entstehen und laufen im Browser, ohne Installation aus einem App Store.' },
        { q: 'Können Soul-Link-Partner eigene Regeln nutzen?', a: 'Ja. Ob Begegnungen und Verluste verknüpft sind, legt die Gruppe fest. Der Tracker speichert Ergebnisse und wählt kein Soul-Link-Regelwerk.' },
      ],
    },
    links: {
      eyebrow: 'NÄCHSTEN SCHRITT PLANEN',
      title: 'Nuzlocke-Guides und hilfreiche Werkzeuge',
      satellites: {
        'soul-link': { label: 'Soul-Link-Nuzlocke', body: 'Gemeinsamen Run für verknüpfte Partner anlegen.' },
        firered: { label: 'Feuerrot-Nuzlocke', body: 'Kanto-Run mit Routen-Tracking planen.' },
        emerald: { label: 'Smaragd-Nuzlocke', body: 'Hoenn-Run und Begegnungen vorbereiten.' },
        platinum: { label: 'Platin-Nuzlocke', body: 'Sinnoh-Run Route für Route organisieren.' },
        heartgold: { label: 'HeartGold-Nuzlocke', body: 'Johto-Run ab der ersten Begegnung festhalten.' },
        'black-white': { label: 'Schwarz/Weiß-Nuzlocke', body: 'Einall-Run mit dem Regions-Tracker planen.' },
      },
      maps: { label: 'Interaktive Karten', body: 'Routen, Orte und Encounter-Tabellen prüfen.' },
      team: { label: 'Teambuilder', body: 'Typabdeckung vor dem nächsten wichtigen Kampf prüfen.' },
      versus: { label: 'Versus-Calc', body: 'Matchups und Schaden für einen schweren Kampf vergleichen.' },
    },
  },
};

export function nuzlockeSeoContent(lang: Lang): NuzlockeSeoContent {
  return NUZLOCKE_SEO_CONTENT[lang];
}
