import type { Lang } from './i18n-data';
import type { NuzlockeSeoSlug } from './nuzlocke-seo';

export interface NuzlockeFaqItem {
  q: string;
  a: string;
}

interface NuzlockeSeoContent {
  walkthrough: {
    eyebrow: string;
    title: string;
    body: string;
    items: Array<{ title: string; body: string }>;
  };
  features: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  games: {
    eyebrow: string;
    title: string;
    body: string;
    freeformTitle: string;
    freeformNote: string;
  };
  multi: {
    eyebrow: string;
    title: string;
    body: string;
    body2: string;
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
    battle: { label: string; body: string };
  };
}

export const NUZLOCKE_SEO_CONTENT: Record<Lang, NuzlockeSeoContent> = {
  en: {
    walkthrough: {
      eyebrow: 'START A RUN',
      title: 'How this Nuzlocke tracker logs a run',
      body: 'The tracker records what happened on the route. Open a run, log the first encounter, keep the party and the box, and mark a faint when a partner falls.',
      items: [
        { title: 'Create the run', body: 'Pick a region preset or a freeform log. Add the clauses the group actually uses: duplicate, shiny, nickname or reset rules stay on the run, not in the console game.' },
        { title: 'Log the first encounter', body: 'Each route stores the first species that appeared and the outcome. A missed catch still closes the route when the rules treat that encounter as used.' },
        { title: 'Keep party, box and losses', body: 'The active six, boxed Pokémon and fallen partners sit on one run. That split keeps a wipe from looking like an open box.' },
        { title: 'Read the map, log what happened', body: 'The same regional atlas as the Maps pages shows encounter tables. The log still stores what the run did, not the most common spawn.' },
      ],
    },
    features: {
      eyebrow: 'RUN CONTROL',
      title: 'What the run log actually stores',
      items: [
        { title: 'Route encounters', body: 'Record the first encounter for each route and see which catches are still open.' },
        { title: 'Team and losses', body: 'Keep the current team, boxed Pokémon and fallen partners in one run log.' },
        { title: 'Rules that fit the run', body: 'Start with the standard rules, then document the clauses the group actually uses.' },
        { title: 'Regional maps', body: 'Kanto, Johto, Hoenn, Sinnoh and Unova maps show encounter tables. The log still stores what the run did.' },
        { title: 'Solo and Soul Link', body: 'Track a personal challenge or share a run with partners through an invite code.' },
        { title: 'Runs in the browser', body: 'Create a run without an install and return to its team, encounters and losses from the browser.' },
      ],
    },
    games: {
      eyebrow: 'GAME COVERAGE',
      title: 'Kanto through Unova have guided routes',
      body: 'Guided route and encounter tracking is available for the Gen 1 to 5 regions Kanto, Johto, Hoenn, Sinnoh and Unova. Presets open FireRed, HeartGold, Emerald, Platinum and Black/White. Each run keeps route outcomes next to the team and loss history.',
      freeformTitle: 'Later games stay freeform',
      freeformNote: 'For Gen 6 to 9 games, create a freeform run to track rules, team and losses without claiming a built-in encounter table. Locations are added as the run reaches them.',
    },
    multi: {
      eyebrow: 'SHARED RUNS',
      title: 'Soul Link and multiplayer tracking',
      body: 'Create a shared run, invite partners with a code and keep encounters, teams and losses in sync. It supports Soul Link and other group formats without pretending that every group uses the same clauses.',
      body2: 'Each player keeps a party. Linked faint and encounter rules are group decisions. The tracker stores the outcome. It does not pick a Soul Link pack or force a cascade.',
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
      title: 'Game pages, maps and the team builder',
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
      battle: { label: '1v1 battle simulator', body: 'Replay a gym or boss 1v1 before the run risks a faint.' },
    },
  },
  de: {
    walkthrough: {
      eyebrow: 'EINEN RUN STARTEN',
      title: 'So protokolliert dieser Nuzlocke-Tracker einen Run',
      body: 'Der Tracker hält fest, was auf der Route passiert ist. Run anlegen, erste Begegnung eintragen, Party und Box pflegen, einen K.O. markieren, wenn ein Partner fällt.',
      items: [
        { title: 'Run anlegen', body: 'Regions-Voreinstellung oder freies Protokoll wählen. Die Klauseln der Gruppe gehören zum Run: Duplikate, Schillernde, Spitznamen oder Neustarts stehen hier, nicht im Konsolenspiel.' },
        { title: 'Erste Begegnung eintragen', body: 'Jede Route speichert die erste erschienene Spezies und das Ergebnis. Ein verfehlter Fang schließt die Route, wenn die Regeln diese Begegnung als genutzt werten.' },
        { title: 'Party, Box und Verluste trennen', body: 'Die aktiven sechs, Box-Pokémon und gefallene Partner stehen in einem Run. So sieht ein Wipe nicht wie eine offene Box aus.' },
        { title: 'Karte lesen, Ergebnis eintragen', body: 'Derselbe Regionsatlas wie auf den Maps-Seiten zeigt Encounter-Tabellen. Das Protokoll speichert, was der Run getan hat, nicht den häufigsten Spawn.' },
      ],
    },
    features: {
      eyebrow: 'RUN-KONTROLLE',
      title: 'Was das Run-Protokoll speichert',
      items: [
        { title: 'Routen-Begegnungen', body: 'Erste Begegnung jeder Route festhalten und offene Fänge sehen.' },
        { title: 'Team und Verluste', body: 'Aktuelles Team, Box-Pokémon und gefallene Partner stehen gemeinsam im Run-Protokoll.' },
        { title: 'Regeln für den eigenen Run', body: 'Mit den Standardregeln starten und die Klauseln dokumentieren, die für die Gruppe gelten.' },
        { title: 'Regionskarten', body: 'Karten für Kanto, Johto, Hoenn, Sinnoh und Einall zeigen Encounter-Tabellen. Das Protokoll speichert, was der Run getan hat.' },
        { title: 'Solo und Soul Link', body: 'Persönliche Challenge führen oder einen Run per Einladungscode mit Partnern teilen.' },
        { title: 'Läuft im Browser', body: 'Einen Run ohne Installation anlegen und Team, Begegnungen sowie Verluste im Browser weiterführen.' },
      ],
    },
    games: {
      eyebrow: 'SPIELABDECKUNG',
      title: 'Kanto bis Einall mit geführten Routen',
      body: 'Geführtes Routen- und Begegnungs-Tracking ist für die Regionen der Generationen 1 bis 5 verfügbar: Kanto, Johto, Hoenn, Sinnoh und Einall. Voreinstellungen öffnen Feuerrot, HeartGold, Smaragd, Platin und Schwarz/Weiß. Routenergebnisse stehen neben Team und Verlustprotokoll.',
      freeformTitle: 'Spätere Spiele bleiben frei',
      freeformNote: 'Für Spiele der Generationen 6 bis 9 einen freien Run anlegen. Regeln, Team und Verluste ohne eingebaute Encounter-Tabelle. Orte werden ergänzt, sobald der Run sie erreicht.',
    },
    multi: {
      eyebrow: 'GEMEINSAME RUNS',
      title: 'Soul Link und Multiplayer-Tracking',
      body: 'Einen gemeinsamen Run anlegen, Partner per Code einladen und Begegnungen, Teams sowie Verluste synchron halten. Soul Link und andere Gruppenformate bleiben bei den Regeln der Gruppe, statt ein einheitliches Format vorzutäuschen.',
      body2: 'Jede Person behält eine eigene Party. Ob Begegnungen und K.O.s verknüpft sind, legt die Gruppe fest. Der Tracker speichert das Ergebnis. Er wählt kein Soul-Link-Regelwerk und erzwingt keine Kaskade.',
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
      title: 'Spielseiten, Karten und der Teambuilder',
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
      battle: { label: '1v1-Kampf-Simulator', body: 'Arenakampf oder Boss als 1v1 prüfen, bevor der Run ein K.O. riskiert.' },
    },
  },
};

export function nuzlockeSeoContent(lang: Lang): NuzlockeSeoContent {
  return NUZLOCKE_SEO_CONTENT[lang];
}
