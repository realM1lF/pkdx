import type { Lang } from './i18n-data';
import type { NuzlockeSeoSlug } from './nuzlocke-seo';

export interface NuzlockeGuideContent {
  eyebrow: string;
  h1: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  example: { title: string; body: string };
  faq: Array<{ q: string; a: string }>;
  cta: { title: string; button: string };
  links: {
    map: string;
    backToHub: string;
    related: string;
  };
}

const en: Record<NuzlockeSeoSlug, NuzlockeGuideContent> = {
  'soul-link': {
    eyebrow: 'SHARED RUNS',
    h1: 'Soul Link Nuzlocke tracker for shared challenge runs',
    intro:
      'A Soul Link Nuzlocke needs a record both players can trust. MyPokePanion creates one shared run where partners can record encounters, team members and losses together while keeping their own agreed rules visible.',
    sections: [
      {
        title: 'Track one run with both players',
        body:
          'Create a multiplayer run, share its invite code and let each partner work from the same run state. The tracker is built for the operational side of a Soul Link: route encounters can be logged as the group reaches them, and the current team and fallen Pokémon stay available in the same place. It does not invent a universal ruleset. Decide how your pair handles catches, dupes, shiny clauses and resets, then document those choices in the run.',
      },
      {
        title: 'Keep linked teams and losses understandable',
        body:
          'Soul Link rules usually make one player’s loss matter to the other player too. Use the team and loss records to show what is currently available and what has left the run. This is useful between sessions: before a gym or a new area, both players can review the team rather than relying on separate notes. The tracker records the state of the challenge; it does not judge whether a rule call was correct.',
      },
      {
        title: 'Use the format with the game you actually play',
        body:
          'Soul Link is a multiplayer format, not a game-specific encounter database. Start a shared run for a supported Gen 1–5 region when route guidance helps, or use a freeform run for another game. Map coverage remains honest: Kanto, Johto, Hoenn, Sinnoh and Unova have regional data, while newer generations can still use manual team, rules and loss tracking.',
      },
      {
        title: 'Set the run up before the first catch',
        body:
          'Agree on the basics before opening a route: whether encounters are paired by area, what happens after an unmatched encounter, and how fainted linked partners are handled. Add the rules to the run, invite the second player, then log each area as it is played. That order makes later decisions easier to reconstruct without turning the tracker into a substitute for the group’s agreement.',
      },
    ],
    example: {
      title: 'Example: a two-player first route',
      body:
        'When both players enter their first encounter area, record the pair under that area after the catches are resolved. If one partner faints later, update the loss record according to the rule set the pair chose. Both players can then see why a linked team slot is no longer available.',
    },
    faq: [
      {
        q: 'Can two players edit the same Soul Link run?',
        a: 'Yes. Create a shared run and use its invite code to add partners. Encounters and losses are kept in the shared run state.',
      },
      {
        q: 'Does the tracker enforce Soul Link rules automatically?',
        a: 'No. Soul Link variants differ between groups. The tracker keeps the agreed rules, encounters, team and losses visible instead of imposing a format.',
      },
      {
        q: 'Can a Soul Link use a game without a region map?',
        a: 'Yes. Freeform runs can record rules, team members and losses when guided route data is not available for the game.',
      },
    ],
    cta: { title: 'Set up a shared Soul Link run', button: 'Start shared run' },
    links: { map: '', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
  firered: {
    eyebrow: 'KANTO RUN',
    h1: 'FireRed Nuzlocke tracker for a Kanto challenge run',
    intro:
      'Plan a Pokémon FireRed Nuzlocke with a tracker that keeps Kanto route encounters, the active team and permanent losses together. Start the run in the browser, record each first encounter, and use the Kanto map when planning the next area.',
    sections: [
      {
        title: 'Make each Kanto encounter count',
        body:
          'A FireRed Nuzlocke becomes easier to manage when every area has one clear record. Log the first encounter that counts for your rules, then mark that route as resolved instead of trying to remember it later. The Kanto tracker is designed around route-by-route progress, so catches, boxed Pokémon and losses do not live in separate notes. If your rules include duplicates or static encounters, record the decision your run uses rather than assuming a default.',
      },
      {
        title: 'Use the Kanto map before moving on',
        body:
          'The interactive Kanto map provides routes, locations and encounter information for the region. It is useful for checking where an unclaimed encounter opportunity belongs before entering a new area. The map is planning support, not a promise about what your first encounter will be. Your run log should record the actual result, including failed catches or clauses your rules allow, so the record reflects the playthrough rather than a hypothetical route plan.',
      },
      {
        title: 'Keep team changes and deaths in one record',
        body:
          'FireRed runs often change quickly after a difficult trainer battle. Update the team and loss log when a Pokémon leaves the run, then use the remaining roster for the next decision. Keeping fallen partners visible prevents accidental reuse and gives the run a clear history. The tracker does not calculate a safe battle outcome or prescribe a replacement. It gives the player a current roster, a route record and the surrounding map data for informed planning.',
      },
      {
        title: 'Start with rules that match your challenge',
        body:
          'The familiar Nuzlocke baseline is only a starting point. Before Route 1, decide how to treat starter Pokémon, gifts, duplicate species, shinies and accidental fainting. Add the chosen rules to the run and keep them consistent. This matters more than copying someone else’s format: a clear written rule lets a FireRed run stay fair after a surprise encounter or a difficult loss, and makes a restart or completion record understandable later.',
      },
    ],
    example: {
      title: 'Example: record Route 1 without guessing rates',
      body:
        'After receiving the first usable Poké Balls, enter Route 1 and record the first wild Pokémon that qualifies under the run rules. Whether it is caught, knocked out or skipped by a stated clause, save that outcome for Route 1. The map can then support planning for the next Kanto location without rewriting the result.',
    },
    faq: [
      { q: 'Does this FireRed tracker include Kanto routes?', a: 'Yes. The guided Kanto region data and map can be used alongside a FireRed Nuzlocke run.' },
      { q: 'Can I use it for FireRed and LeafGreen?', a: 'The guide focuses on a FireRed Kanto run. Record the game and any version-specific rule choices in the run notes.' },
      { q: 'Does it choose my first encounter?', a: 'No. The tracker records the encounter that your rules treat as valid. It does not choose encounters or override clauses.' },
    ],
    cta: { title: 'Start a FireRed Nuzlocke in Kanto', button: 'Create FireRed run' },
    links: { map: 'Explore Kanto map', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
  emerald: {
    eyebrow: 'HOENN RUN',
    h1: 'Pokémon Emerald Nuzlocke tracker for Hoenn',
    intro:
      'Keep a Pokémon Emerald Nuzlocke organized from the first Hoenn encounter to the final team decision. MyPokePanion combines route records, team management, losses and the Hoenn map so the state of the challenge remains available between sessions.',
    sections: [
      {
        title: 'Give every Hoenn area a clear result',
        body:
          'Record the first encounter that your Emerald rules allow for each route or location, then keep its outcome with the run. A captured Pokémon, a failed catch and a skipped encounter under a written clause are different outcomes that are easy to confuse after several sessions. The tracker keeps them beside the current team and loss history. That makes it practical to see which areas are still open without treating a map list as proof that an encounter is still available.',
      },
      {
        title: 'Plan with the Hoenn map, then log play',
        body:
          'The Hoenn map links route and location information to Nuzlocke planning. Check the next area before progressing to understand where it fits in the regional journey, then record what actually happens in the run. This distinction matters for a blind or semi-blind challenge: planning can be as detailed or as limited as the player wants. The tracker supports both approaches without inventing encounter odds or claiming a catch that has not occurred.',
      },
      {
        title: 'Review the roster after pivotal battles',
        body:
          'A permanent loss can change an Emerald team’s available types and roles at once. Update the run immediately, move unavailable Pokémon out of the active picture and review the remaining party before the next route. The team log is not a battle simulator and does not guarantee a safe strategy. Its value is a reliable roster: the Pokémon currently usable, the boxed options and the losses are shown in the same place as the route history.',
      },
      {
        title: 'Keep clauses written, not assumed',
        body:
          'Emerald Nuzlocke rules vary around duplicate species, gift Pokémon, static encounters and catches in named sub-areas. Choose the interpretation before it becomes relevant and write it in the run. The record is then useful if a borderline encounter happens later. MyPokePanion deliberately leaves those decisions to the player or group, because a tracker should preserve the challenge rules rather than present one community convention as mandatory.',
      },
    ],
    example: {
      title: 'Example: first encounter on a Hoenn route',
      body:
        'Before stepping into a new Hoenn route, check whether it is still open in the run. Once the first eligible wild encounter occurs, save the result for that route. If a duplicate clause changes the outcome, note the clause used rather than replacing the route entry with a made-up catch.',
    },
    faq: [
      { q: 'Can I track an Emerald run route by route?', a: 'Yes. Use the Hoenn region data to organize encounters by route and keep their outcomes in the run.' },
      { q: 'Does the map force an encounter rule?', a: 'No. Maps provide planning context. The run rules determine which encounter counts.' },
      { q: 'Can I track deaths and boxed Pokémon?', a: 'Yes. The run keeps the current team, stored Pokémon and loss record together.' },
    ],
    cta: { title: 'Start an Emerald Nuzlocke in Hoenn', button: 'Create Emerald run' },
    links: { map: 'Explore Hoenn map', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
  platinum: {
    eyebrow: 'SINNOH RUN',
    h1: 'Pokémon Platinum Nuzlocke tracker for Sinnoh',
    intro:
      'Run a Pokémon Platinum Nuzlocke with the Sinnoh encounter record, team and loss log in one place. Use the browser tracker to document the rules of the challenge and the map to plan the next Sinnoh location without relying on scattered notes.',
    sections: [
      {
        title: 'Record Sinnoh encounters by location',
        body:
          'A clear location record is the foundation of a Platinum Nuzlocke. When an area produces its first eligible encounter, save that result against the route or location in the run. This prevents a common problem: revisiting a route later and forgetting whether its encounter was already used, missed or skipped by a clause. The tracker retains the outcome alongside the team, so the available roster and the remaining encounter opportunities can be reviewed together.',
      },
      {
        title: 'Treat the map as planning context',
        body:
          'The Sinnoh map helps identify routes and locations before the next segment of the run. It supports a route-first planning style, but it does not replace the actual playthrough. The first encounter rule, duplicates clause and treatment of special Pokémon remain choices for the run. Review the map before moving forward, then record the real result afterwards. This keeps the guide useful whether the player wants detailed preparation or only a clean progress log.',
      },
      {
        title: 'Make losses visible before the next decision',
        body:
          'After a faint that ends a Pokémon’s run, record the loss and update the active team. Seeing the loss history beside boxed options avoids accidental reuse and makes the run’s consequences concrete. Platinum challenges can involve long gaps between planning sessions, so a current roster is more useful than a vague memory of who is still legal. MyPokePanion documents the state; it does not claim to solve a battle or recommend a guaranteed safe replacement.',
      },
      {
        title: 'Write down the rules that change availability',
        body:
          'Decide early how the run handles gifts, static Pokémon, underground or special areas, duplicate encounters and revives. There is no single Platinum Nuzlocke ruleset that every player follows. Keeping these choices in the run turns a later edge case into a reference check instead of an argument with past notes. The same approach works for a solo run or a shared format where everyone needs to see the current interpretation.',
      },
    ],
    example: {
      title: 'Example: protect a Sinnoh route record',
      body:
        'Open the run before entering a new Sinnoh location and confirm it has no recorded encounter. Once the first eligible Pokémon appears, save the actual outcome there. If the encounter is lost, the route is still documented as used unless the written rules say otherwise.',
    },
    faq: [
      { q: 'Is Platinum covered by the Sinnoh tracker?', a: 'Yes. Platinum runs can use the Sinnoh regional tracking and map alongside their own rules.' },
      { q: 'Can I use custom clauses for special encounters?', a: 'Yes. Record the clauses in the run. The tracker does not force one interpretation for gifts, statics or duplicates.' },
      { q: 'Does the tracker replace a battle calculator?', a: 'No. It organizes encounter, team and loss information. Use the separate tools when matchup analysis is needed.' },
    ],
    cta: { title: 'Start a Platinum Nuzlocke in Sinnoh', button: 'Create Platinum run' },
    links: { map: 'Explore Sinnoh map', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
  heartgold: {
    eyebrow: 'JOHTO RUN',
    h1: 'Pokémon HeartGold Nuzlocke tracker for Johto',
    intro:
      'A Pokémon HeartGold Nuzlocke is easier to continue when Johto encounters, team changes and losses have one source of truth. Start a browser run, keep its clauses visible and use the Johto map to orient the next route or location.',
    sections: [
      {
        title: 'Keep Johto encounters in the run record',
        body:
          'Log the first eligible encounter for each Johto area according to the rules chosen for the HeartGold run. This gives each route a durable result rather than a note that disappears after a session. If a catch fails, a duplicate clause applies or a player deliberately skips an encounter, record that event in the run. The goal is not to make every run identical. It is to make the player’s own interpretation available when the same route is revisited later.',
      },
      {
        title: 'Plan a route without replacing the playthrough',
        body:
          'The Johto map provides regional route and location context for the next leg of the challenge. Use it to see how an area fits into the route plan, then let the run log show the encounter that actually happens. That separation is useful for players who avoid detailed spoilers as well as those who prepare carefully. The map supports decisions, but it does not decide a valid encounter or change the clauses already written for the HeartGold Nuzlocke.',
      },
      {
        title: 'Update the team when the run changes',
        body:
          'After a loss or a major team swap, update the current roster before planning the next battle. The active team, boxed Pokémon and fallen partners remain part of one record, so a returning player does not need to rebuild the context from memory. This is especially useful in a long-form challenge. The tracker does not promise a winning matchup. It keeps the legal roster and its history clear enough to support the player’s own choices.',
      },
      {
        title: 'Use explicit rules for unusual situations',
        body:
          'HeartGold runs can differ on gifts, static Pokémon, duplicate species and separate named areas. Decide how those cases count before they appear and preserve the decision in the run. A written rule is more helpful than a generic guide claim because it applies consistently to the whole challenge. The same record can support a solo run or a multiplayer group, provided everyone agrees on the clauses before tracking the results.',
      },
    ],
    example: {
      title: 'Example: first eligible Johto encounter',
      body:
        'At a new Johto route, check the run record before entering grass or water. When the first encounter that qualifies under the rules appears, log its outcome against that route. The result remains visible if the party changes long before the route is revisited.',
    },
    faq: [
      { q: 'Can I use the Johto map for a HeartGold Nuzlocke?', a: 'Yes. The Johto map and regional tracker support route and location planning for the run.' },
      { q: 'Can the tracker record a failed first catch?', a: 'Yes. Save the actual result so the route record reflects the challenge rules and playthrough.' },
      { q: 'Are Soul Link rules required for multiplayer?', a: 'No. Shared runs can use the rules the group agrees on, including but not limited to Soul Link formats.' },
    ],
    cta: { title: 'Start a HeartGold Nuzlocke in Johto', button: 'Create HeartGold run' },
    links: { map: 'Explore Johto map', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
  'black-white': {
    eyebrow: 'UNOVA RUN',
    h1: 'Pokémon Black and White Nuzlocke tracker for Unova',
    intro:
      'Track a Pokémon Black or White Nuzlocke from the first Unova encounter onward. MyPokePanion keeps route results, the usable team, losses and written challenge rules together, with the Unova map available for regional planning.',
    sections: [
      {
        title: 'Document each Unova encounter once',
        body:
          'For a Black and White Nuzlocke, record the first encounter that counts in every route or location under the run rules. That one entry answers an important later question: is this area still available, already used or affected by a clause? A failed catch or a duplicate reroll should be represented as the result that occurred, not replaced by a cleaner-looking history. Keeping those facts in the run gives a consistent picture of what the player may still use.',
      },
      {
        title: 'Use the Unova map to prepare the next area',
        body:
          'The Unova map supplies route and location context for planning. It helps establish where the next encounter belongs, while the run log remains the source for the actual first encounter and its outcome. This is intentionally different from an encounter simulator or a walkthrough. Players can decide how much information they want before entering a route, then use the tracker to preserve the real playthrough and the rules that were in force at that moment.',
      },
      {
        title: 'Let the loss log shape the remaining team',
        body:
          'When a Pokémon is no longer legal after a faint, add it to the loss record and update the active team. The remaining party and boxed Pokémon become the practical pool for the next decision. This makes a Black or White run easier to resume after a break and prevents old team lists from obscuring current constraints. MyPokePanion records that state in the browser; it does not enforce a particular difficulty rule or predict the next battle.',
      },
      {
        title: 'Keep your Black and White clauses consistent',
        body:
          'Before beginning, set rules for duplicates, gift Pokémon, static encounters, shinies and any reset policy. Some groups use standard Nuzlocke clauses, while others adapt them for their own challenge. The tracker works best when the selected version and clauses are visible from the beginning. Later edge cases can then be checked against the recorded rule instead of a memory or a rule list that belongs to another player’s Black and White run.',
      },
    ],
    example: {
      title: 'Example: record a new Unova route',
      body:
        'Before entering a new Unova route, look at the run to see whether an encounter has already been assigned to that area. Once the first eligible wild Pokémon appears, record the result. A clause can change what happens next, but the route history should show the chosen ruling.',
    },
    faq: [
      { q: 'Does this guide work for both Pokémon Black and White?', a: 'Yes. Use the Unova tracker for either game and record version-specific choices in the run rules.' },
      { q: 'Can I plan with the Unova map without spoilers?', a: 'Yes. Use as much map detail as suits the challenge. The tracker only needs the actual route result.' },
      { q: 'Can I keep custom reset rules?', a: 'Yes. Document the reset policy with the rest of the run clauses so later decisions stay consistent.' },
    ],
    cta: { title: 'Start a Black or White Nuzlocke in Unova', button: 'Create Unova run' },
    links: { map: 'Explore Unova map', backToHub: 'Open Nuzlocke tracker', related: 'More Nuzlocke guides' },
  },
};

const de: Record<NuzlockeSeoSlug, NuzlockeGuideContent> = {
  'soul-link': {
    eyebrow: 'GEMEINSAME RUNS',
    h1: 'Soul-Link-Nuzlocke-Tracker für gemeinsame Challenge-Runs',
    intro:
      'Eine Soul-Link-Nuzlocke braucht ein Protokoll, auf das sich beide Partner verlassen können. MyPokePanion erstellt einen gemeinsamen Run für Begegnungen, Teams und Verluste und hält zugleich die Regeln der Gruppe sichtbar.',
    sections: [
      { title: 'Ein Run für beide Partner', body: 'Erstelle einen Multiplayer-Run, teile den Einladungscode und arbeite mit einem gemeinsamen Stand. Begegnungen werden beim Erreichen eines Gebiets dokumentiert, Team und gefallene Pokémon bleiben im selben Run sichtbar. Der Tracker schreibt kein einheitliches Soul-Link-Regelwerk vor. Fangpaare, Duplikat-Klausel, Shinys und Neustarts legt die Gruppe fest und hält diese Entscheidungen im Run fest.' },
      { title: 'Verknüpfte Teams und Verluste nachvollziehen', body: 'Bei vielen Soul-Link-Regeln betrifft der Verlust eines Partners auch das andere Team. Team- und Verlustprotokoll zeigen, was noch verfügbar ist und was den Run verlassen hat. Vor einer Arena oder einem neuen Gebiet können beide Spieler den Stand prüfen, statt getrennte Notizen abzugleichen. Der Tracker dokumentiert die Challenge, er bewertet keine Regelauslegung.' },
      { title: 'Mit dem tatsächlich gespielten Spiel nutzen', body: 'Soul Link ist ein Multiplayer-Format, keine spielspezifische Encounter-Datenbank. Für Kanto, Johto, Hoenn, Sinnoh und Einall stehen Regionsdaten bereit; für andere Spiele funktioniert ein freier Run mit Regeln, Team und Verlusten. Die Abdeckung bleibt damit ehrlich: Geführte Routen gibt es für die Regionen der Generationen 1–5, neuere Generationen werden manuell festgehalten.' },
      { title: 'Vor dem ersten Fang vorbereiten', body: 'Kläre vor der ersten Route, wie Paare gebildet werden, was bei einer fehlenden Paar-Begegnung gilt und wie verknüpfte K.-o.-Fälle behandelt werden. Trage die Regeln ein, lade den zweiten Spieler ein und dokumentiere Gebiete erst beim Spielen. So lassen sich spätere Entscheidungen nachvollziehen, ohne dass der Tracker die Absprache der Gruppe ersetzt.' },
    ],
    example: { title: 'Beispiel: erstes Gebiet zu zweit', body: 'Sobald beide Spieler ihr erstes Begegnungsgebiet betreten, wird das Fangpaar nach der Auflösung unter diesem Gebiet eingetragen. Fällt später ein Partner aus, wird der Verlust nach dem vereinbarten Regelwerk erfasst. Beide sehen anschließend, warum ein verknüpfter Teamplatz nicht mehr verfügbar ist.' },
    faq: [
      { q: 'Können zwei Spieler denselben Soul-Link-Run bearbeiten?', a: 'Ja. Ein gemeinsamer Run nutzt einen Einladungscode. Begegnungen und Verluste werden im gemeinsamen Run-Stand geführt.' },
      { q: 'Erzwingt der Tracker Soul-Link-Regeln automatisch?', a: 'Nein. Varianten unterscheiden sich je nach Gruppe. Der Tracker hält Regeln, Begegnungen, Team und Verluste fest, statt ein Format vorzuschreiben.' },
      { q: 'Funktioniert Soul Link ohne geführte Regionskarte?', a: 'Ja. Freie Runs erfassen Regeln, Teammitglieder und Verluste auch dann, wenn für das Spiel keine Routenführung bereitsteht.' },
    ],
    cta: { title: 'Gemeinsamen Soul-Link-Run einrichten', button: 'Gemeinsamen Run starten' },
    links: { map: '', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
  firered: {
    eyebrow: 'KANTO-RUN',
    h1: 'Feuerrot-Nuzlocke-Tracker für einen Kanto-Challenge-Run',
    intro: 'Plane eine Pokémon-Feuerrot-Nuzlocke mit einem Tracker für Kanto-Begegnungen, aktives Team und permanente Verluste. Der Browser-Run dokumentiert die erste Begegnung jeder Route; die Kanto-Karte unterstützt bei der Planung des nächsten Gebiets.',
    sections: [
      { title: 'Jede Kanto-Begegnung festhalten', body: 'Trage die erste Begegnung ein, die nach den eigenen Regeln zählt, und markiere die Route damit als erledigt. So bleiben Fänge, Box-Pokémon und Verluste nicht in getrennten Notizen. Duplikat-Klausel oder statische Begegnungen können nach dem eigenen Regelwerk behandelt werden. Entscheidend ist, die getroffene Entscheidung zu dokumentieren, statt eine vermeintlich allgemeingültige Regel anzunehmen.' },
      { title: 'Die Kanto-Karte vor dem nächsten Gebiet nutzen', body: 'Die interaktive Kanto-Karte zeigt Routen, Orte und Begegnungsinformationen. Sie hilft dabei, ein noch offenes Gebiet vor dem Betreten einzuordnen. Sie verspricht aber nicht, welche erste Begegnung erscheint. Das Run-Protokoll hält das tatsächliche Ergebnis fest, auch einen verfehlten Fang oder eine erlaubte Klausel. Damit bleibt die Historie ein Abbild des Spielstands und nicht nur ein theoretischer Routenplan.' },
      { title: 'Teamwechsel und Tode gemeinsam führen', body: 'Nach einem schweren Trainerkampf wird das Team und bei Bedarf das Verlustprotokoll aktualisiert. Gefallene Partner bleiben sichtbar und werden nicht versehentlich wieder eingesetzt. Der Tracker berechnet keinen sicheren Kampf und schreibt keinen Ersatz vor. Er stellt den aktuellen Kader, die Routenhistorie und die Kartendaten bereit, damit die nächste Entscheidung mit einem verlässlichen Stand getroffen wird.' },
      { title: 'Regeln passend zum eigenen Run festlegen', body: 'Die bekannten Grundregeln sind nur ein Ausgangspunkt. Vor Route 1 sollten Starter, Geschenke, Duplikate, Shinys und versehentliche K.-o.-Fälle geklärt werden. Die Regeln stehen im Run und gelten dadurch später noch genauso. Das ist wichtiger als das Kopieren eines fremden Formats: Eine klare Regel hält die Feuerrot-Nuzlocke bei Überraschungen konsistent und macht einen Abschluss oder Neustart nachvollziehbar.' },
    ],
    example: { title: 'Beispiel: Route 1 ohne erfundene Raten erfassen', body: 'Nach den ersten nutzbaren Pokébällen wird Route 1 betreten und das erste wilde Pokémon eingetragen, das nach den Regeln zählt. Ob es gefangen, besiegt oder durch eine festgelegte Klausel übersprungen wird, bleibt als Ergebnis von Route 1 gespeichert. Die Karte hilft danach beim nächsten Kanto-Ort.' },
    faq: [
      { q: 'Enthält der Feuerrot-Tracker Kanto-Routen?', a: 'Ja. Die geführten Kanto-Regionsdaten und die Karte lassen sich mit einem Feuerrot-Run verwenden.' },
      { q: 'Funktioniert der Guide für Feuerrot und Blattgrün?', a: 'Der Guide ist auf Feuerrot ausgerichtet. Spielversion und abweichende Regeln werden im Run festgehalten.' },
      { q: 'Wählt der Tracker die erste Begegnung aus?', a: 'Nein. Er dokumentiert die Begegnung, die nach den eigenen Regeln gültig ist, und überschreibt keine Klauseln.' },
    ],
    cta: { title: 'Feuerrot-Nuzlocke in Kanto beginnen', button: 'Feuerrot-Run erstellen' },
    links: { map: 'Kanto-Karte öffnen', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
  emerald: {
    eyebrow: 'HOENN-RUN',
    h1: 'Smaragd-Nuzlocke-Tracker für Hoenn',
    intro: 'Halte eine Pokémon-Smaragd-Nuzlocke von der ersten Hoenn-Begegnung bis zur letzten Teamentscheidung geordnet. MyPokePanion verbindet Routenprotokoll, Team, Verluste und Hoenn-Karte, damit der Stand des Runs zwischen Sessions erhalten bleibt.',
    sections: [
      { title: 'Jedem Hoenn-Gebiet ein Ergebnis geben', body: 'Erfasse die erste Begegnung, die nach den Smaragd-Regeln für eine Route oder einen Ort zählt. Ein gefangenes Pokémon, ein verfehlter Fang und eine übersprungene Begegnung durch eine Klausel sind unterschiedliche Ergebnisse. Der Tracker führt sie zusammen mit Team und Verlusten. So wird sichtbar, welche Gebiete noch offen sind, ohne eine Kartenliste mit einer tatsächlich verfügbaren Begegnung zu verwechseln.' },
      { title: 'Mit der Hoenn-Karte planen und Spielstand erfassen', body: 'Die Hoenn-Karte verknüpft Routen und Orte mit der Planung einer Nuzlocke. Vor dem Weitergehen lässt sich das nächste Gebiet einordnen, danach wird der echte Verlauf in den Run eingetragen. Das passt sowohl zu blindem als auch zu vorbereitetem Spielen. Der Tracker erfindet keine Fangraten und behauptet keinen Fang, der nicht stattgefunden hat.' },
      { title: 'Nach wichtigen Kämpfen den Kader prüfen', body: 'Ein permanenter Verlust verändert verfügbare Typen und Rollen im Smaragd-Team. Aktualisiere den Run sofort, verschiebe nicht mehr nutzbare Pokémon aus dem aktiven Bild und prüfe vor der nächsten Route die verbleibende Auswahl. Der Teamlog ist kein Kampf-Simulator und garantiert keine Strategie. Er liefert einen zuverlässigen Kader mit aktivem Team, Box-Optionen und Verlusten neben der Routenhistorie.' },
      { title: 'Klauseln aufschreiben statt voraussetzen', body: 'Duplikate, Geschenke, statische Begegnungen und benannte Teilgebiete werden in Smaragd-Runs unterschiedlich behandelt. Lege die Auslegung fest, bevor sie relevant wird, und schreibe sie in den Run. Das macht spätere Grenzfälle prüfbar. MyPokePanion überlässt die Entscheidung bewusst den Spielern, denn ein Tracker soll Challenge-Regeln erhalten und keine Konvention als Pflicht darstellen.' },
    ],
    example: { title: 'Beispiel: erste Begegnung auf einer Hoenn-Route', body: 'Vor einer neuen Hoenn-Route wird geprüft, ob sie im Run noch offen ist. Sobald die erste gültige wilde Begegnung erscheint, wird das Ergebnis gespeichert. Ändert eine Duplikat-Klausel den Ablauf, wird die genutzte Klausel notiert und kein fiktiver Fang eingetragen.' },
    faq: [
      { q: 'Lässt sich ein Smaragd-Run Route für Route führen?', a: 'Ja. Die Hoenn-Regionsdaten ordnen Begegnungen nach Routen und halten ihre Ergebnisse im Run fest.' },
      { q: 'Erzwingt die Karte eine Begegnungsregel?', a: 'Nein. Die Karte liefert Planungskontext. Welche Begegnung zählt, bestimmen die Regeln des Runs.' },
      { q: 'Können Tode und Box-Pokémon erfasst werden?', a: 'Ja. Der Run führt aktuelles Team, gelagerte Pokémon und Verlustprotokoll gemeinsam.' },
    ],
    cta: { title: 'Smaragd-Nuzlocke in Hoenn beginnen', button: 'Smaragd-Run erstellen' },
    links: { map: 'Hoenn-Karte öffnen', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
  platinum: {
    eyebrow: 'SINNOH-RUN',
    h1: 'Platin-Nuzlocke-Tracker für Sinnoh',
    intro: 'Führe eine Pokémon-Platin-Nuzlocke mit Sinnoh-Begegnungen, Team und Verlustprotokoll an einem Ort. Der Browser-Tracker dokumentiert die Challenge-Regeln; die Sinnoh-Karte hilft bei der Planung des nächsten Orts ohne verstreute Notizen.',
    sections: [
      { title: 'Sinnoh-Begegnungen nach Orten erfassen', body: 'Sobald ein Gebiet seine erste gültige Begegnung liefert, wird das Ergebnis der Route oder dem Ort zugeordnet. Das verhindert, dass beim späteren Wiederbesuch unklar bleibt, ob die Begegnung genutzt, verpasst oder nach einer Klausel übersprungen wurde. Der Tracker hält das Ergebnis neben dem Team fest, sodass verfügbare Pokémon und offene Möglichkeiten gemeinsam geprüft werden können.' },
      { title: 'Die Karte als Planungskontext behandeln', body: 'Die Sinnoh-Karte hilft, Routen und Orte vor dem nächsten Abschnitt einzuordnen. Sie ersetzt nicht den Verlauf der Challenge. Erste-Begegnung-Regel, Duplikat-Klausel und Sonder-Pokémon bleiben Entscheidungen des Runs. Vor dem Weitergehen kann die Karte geprüft werden, danach wird das reale Ergebnis gespeichert. So funktioniert der Guide sowohl bei genauer Vorbereitung als auch bei bewusst wenig Vorwissen.' },
      { title: 'Verluste vor der nächsten Entscheidung sichtbar machen', body: 'Nach einem K.-o.-Fall wird der Verlust eingetragen und das aktive Team aktualisiert. Box-Optionen und gefallene Partner bleiben klar getrennt, damit ein Pokémon nicht versehentlich erneut genutzt wird. Gerade nach einer längeren Pause ist ein aktueller Kader hilfreicher als eine alte Teamliste. MyPokePanion dokumentiert den Stand, löst aber keinen Kampf und empfiehlt keinen garantiert sicheren Ersatz.' },
      { title: 'Regeln für Verfügbarkeit eindeutig notieren', body: 'Geschenke, statische Pokémon, besondere Gebiete, Duplikate und Beleber werden nicht in jeder Platin-Nuzlocke gleich behandelt. Lege die Regeln am Beginn fest und halte sie im Run fest. Spätere Sonderfälle können dann gegen die eigene Regel geprüft werden, nicht gegen eine fremde Liste. Das gilt für Solo-Runs ebenso wie für gemeinsame Formate mit einer gemeinsamen Auslegung.' },
    ],
    example: { title: 'Beispiel: Sinnoh-Route schützen', body: 'Vor einem neuen Sinnoh-Ort wird im Run geprüft, ob bereits eine Begegnung hinterlegt ist. Beim ersten gültigen Pokémon wird das echte Ergebnis gespeichert. Geht die Begegnung verloren, bleibt die Route als genutzt dokumentiert, sofern die eigenen Regeln nichts anderes festlegen.' },
    faq: [
      { q: 'Ist Platin über den Sinnoh-Tracker abgedeckt?', a: 'Ja. Platin-Runs können Sinnoh-Tracking und Karte zusammen mit ihren eigenen Regeln nutzen.' },
      { q: 'Sind eigene Klauseln für besondere Begegnungen möglich?', a: 'Ja. Klauseln werden im Run festgehalten; Geschenke, statische Pokémon und Duplikate werden nicht erzwungen ausgelegt.' },
      { q: 'Ersetzt der Tracker einen Damage-Calculator?', a: 'Nein. Er organisiert Begegnungen, Team und Verluste. Für Matchup-Analysen stehen separate Werkzeuge bereit.' },
    ],
    cta: { title: 'Platin-Nuzlocke in Sinnoh beginnen', button: 'Platin-Run erstellen' },
    links: { map: 'Sinnoh-Karte öffnen', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
  heartgold: {
    eyebrow: 'JOHTO-RUN',
    h1: 'HeartGold-Nuzlocke-Tracker für Johto',
    intro: 'Eine Pokémon-HeartGold-Nuzlocke lässt sich leichter fortsetzen, wenn Johto-Begegnungen, Teamwechsel und Verluste eine gemeinsame Quelle haben. Starte einen Browser-Run, halte Klauseln sichtbar und nutze die Johto-Karte für die nächste Route.',
    sections: [
      { title: 'Johto-Begegnungen im Run-Protokoll führen', body: 'Trage die erste gültige Begegnung jedes Johto-Gebiets nach den eigenen HeartGold-Regeln ein. So erhält jede Route ein dauerhaftes Ergebnis statt einer Notiz, die nach der Session verschwindet. Verfehlte Fänge, Duplikat-Klauseln und bewusst übersprungene Begegnungen werden ebenfalls dokumentiert. Das Ziel ist keine einheitliche Nuzlocke, sondern eine klare Auslegung beim späteren Wiederbesuch der Route.' },
      { title: 'Routen planen, ohne den Spielverlauf zu ersetzen', body: 'Die Johto-Karte liefert Kontext für Routen und Orte des nächsten Challenge-Abschnitts. Sie kann bei der Planung helfen, während der Run die tatsächlich erspielte Begegnung festhält. Das passt sowohl zu Spielern, die Spoiler vermeiden, als auch zu sorgfältiger Vorbereitung. Die Karte entscheidet keine gültige Begegnung und ändert keine Regeln, die bereits für die HeartGold-Nuzlocke festgelegt wurden.' },
      { title: 'Das Team bei Veränderungen aktualisieren', body: 'Nach einem Verlust oder größeren Teamwechsel wird der aktuelle Kader angepasst. Aktives Team, Box-Pokémon und gefallene Partner bleiben in einem Protokoll, sodass der Stand nach Pausen nicht aus dem Gedächtnis rekonstruiert werden muss. Der Tracker verspricht kein gewonnenes Matchup. Er zeigt den legalen Kader und seine Geschichte so klar, dass eigene Entscheidungen auf dem aktuellen Stand beruhen.' },
      { title: 'Sonderfälle mit festen Regeln behandeln', body: 'Geschenke, statische Pokémon, Duplikate und getrennt benannte Gebiete können in HeartGold unterschiedlich zählen. Entscheide das vor dem Auftreten und bewahre die Regel im Run auf. Eine festgehaltene Regel ist hilfreicher als eine allgemeine Behauptung, weil sie für die ganze Challenge konsistent gilt. Dasselbe Prinzip funktioniert für Solo- und Multiplayer-Runs, wenn die Gruppe die Klauseln vorher teilt.' },
    ],
    example: { title: 'Beispiel: erste gültige Johto-Begegnung', body: 'Bei einer neuen Johto-Route wird vor Gras oder Wasser der Run-Stand geprüft. Sobald die erste gültige Begegnung erscheint, wird ihr Ergebnis dieser Route zugeordnet. Das Ergebnis bleibt sichtbar, auch wenn sich das Team lange vor einem Wiederbesuch verändert.' },
    faq: [
      { q: 'Kann die Johto-Karte für eine HeartGold-Nuzlocke genutzt werden?', a: 'Ja. Johto-Karte und Regions-Tracker unterstützen die Routen- und Ortsplanung des Runs.' },
      { q: 'Lässt sich ein verfehlter erster Fang eintragen?', a: 'Ja. Das tatsächliche Ergebnis bleibt gespeichert, damit das Routenprotokoll die Challenge-Regeln und den Verlauf abbildet.' },
      { q: 'Sind Soul-Link-Regeln für Multiplayer Pflicht?', a: 'Nein. Gemeinsame Runs können die Regeln der Gruppe nutzen, einschließlich, aber nicht nur, Soul-Link-Formate.' },
    ],
    cta: { title: 'HeartGold-Nuzlocke in Johto beginnen', button: 'HeartGold-Run erstellen' },
    links: { map: 'Johto-Karte öffnen', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
  'black-white': {
    eyebrow: 'EINALL-RUN',
    h1: 'Schwarz/Weiß-Nuzlocke-Tracker für Einall',
    intro: 'Tracke eine Pokémon-Schwarz- oder Weiß-Nuzlocke ab der ersten Einall-Begegnung. MyPokePanion hält Routen-Ergebnisse, nutzbares Team, Verluste und Challenge-Regeln zusammen; die Einall-Karte unterstützt die regionale Planung.',
    sections: [
      { title: 'Jede Einall-Begegnung einmal dokumentieren', body: 'Für eine Schwarz/Weiß-Nuzlocke wird die erste Begegnung jeder Route oder jedes Ortes festgehalten, die nach den eigenen Regeln zählt. Ein Eintrag beantwortet später die wichtige Frage: Ist das Gebiet noch offen, schon genutzt oder von einer Klausel betroffen? Ein verfehlter Fang oder Duplikat-Reroll wird als tatsächliches Ergebnis gespeichert, nicht durch eine sauberere Geschichte ersetzt. So bleibt sichtbar, welche Pokémon wirklich noch verfügbar sind.' },
      { title: 'Mit der Einall-Karte das nächste Gebiet vorbereiten', body: 'Die Einall-Karte liefert Routen- und Ortskontext für die Planung. Sie ordnet die nächste Begegnung ein, während das Run-Protokoll die reale erste Begegnung und ihr Ergebnis festhält. Das ist bewusst kein Encounter-Simulator oder Walkthrough. Spieler entscheiden selbst, wie viel Information sie vor einer Route möchten, und bewahren danach den echten Verlauf sowie die zu diesem Zeitpunkt geltenden Regeln.' },
      { title: 'Das Verlustprotokoll für den verbleibenden Kader nutzen', body: 'Ist ein Pokémon nach einem K.-o. nicht mehr nutzbar, wird es im Verlustprotokoll eingetragen und das aktive Team angepasst. Team und Box-Pokémon bilden dann die praktische Auswahl für die nächste Entscheidung. Das erleichtert die Fortsetzung einer Schwarz- oder Weiß-Nuzlocke nach einer Pause und verhindert, dass alte Teamlisten aktuelle Einschränkungen überdecken. MyPokePanion dokumentiert den Stand, erzwingt aber keine Schwierigkeitsregel und sagt keinen Kampf voraus.' },
      { title: 'Schwarz/Weiß-Klauseln konsistent halten', body: 'Vor dem Start sollten Duplikate, Geschenke, statische Begegnungen, Shinys und Neustarts geregelt sein. Manche Gruppen nutzen die Standardklauseln, andere passen sie an. Der Tracker ist am hilfreichsten, wenn Spielversion und Regeln von Beginn an sichtbar sind. Spätere Grenzfälle werden dann an der festgehaltenen Regel geprüft, nicht an einer Erinnerung oder einem Regelwerk aus einem anderen Schwarz/Weiß-Run.' },
    ],
    example: { title: 'Beispiel: neue Einall-Route erfassen', body: 'Vor einer neuen Einall-Route zeigt der Run, ob diesem Gebiet bereits eine Begegnung zugeordnet ist. Sobald das erste gültige wilde Pokémon erscheint, wird das Ergebnis gespeichert. Eine Klausel kann den weiteren Ablauf ändern, aber die Routenhistorie hält die gewählte Entscheidung fest.' },
    faq: [
      { q: 'Funktioniert der Guide für Pokémon Schwarz und Weiß?', a: 'Ja. Der Einall-Tracker lässt sich für beide Spiele nutzen; versionsspezifische Entscheidungen stehen in den Run-Regeln.' },
      { q: 'Kann die Einall-Karte ohne viele Spoiler genutzt werden?', a: 'Ja. Der Detailgrad liegt beim Spieler. Für den Tracker zählt nur das tatsächliche Ergebnis der Route.' },
      { q: 'Lassen sich eigene Neustart-Regeln festhalten?', a: 'Ja. Die Neustart-Regel wird zusammen mit den anderen Klauseln dokumentiert, damit spätere Entscheidungen konsistent bleiben.' },
    ],
    cta: { title: 'Schwarz/Weiß-Nuzlocke in Einall beginnen', button: 'Einall-Run erstellen' },
    links: { map: 'Einall-Karte öffnen', backToHub: 'Nuzlocke-Tracker öffnen', related: 'Weitere Nuzlocke-Guides' },
  },
};

export const NUZLOCKE_GUIDE_CONTENT: Record<Lang, Record<NuzlockeSeoSlug, NuzlockeGuideContent>> = { en, de };

export function nuzlockeGuideContent(lang: Lang, slug: NuzlockeSeoSlug): NuzlockeGuideContent {
  return NUZLOCKE_GUIDE_CONTENT[lang][slug];
}
