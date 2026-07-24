/* Central SEO meta registry (SEO foundation).
 *
 * One entry per static app route (locale-stripped path, e.g. '/pokedex'),
 * with DE + EN title/description. Consumed by:
 *   - <SeoHead /> (src/components/SeoHead.tsx) at runtime — updates
 *     document.title, meta description, Open Graph, canonical + hreflang.
 *   - the prerender pipeline (scripts/prerender.mjs) captures that head
 *     state, so the static HTML carries the same route-specific meta.
 *
 * Canonical + hreflang URLs always use the production origin (never
 * window.location.origin) so prerendered pages are valid regardless of
 * the host they were rendered on. */
import { localePath, stripLocalePrefix } from './locale-link';
import type { Lang } from './i18n-data';

export const SITE_NAME = 'MyPokePanion';
export const SITE_URL = 'https://mypokepanion.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.png`;

export interface LocalizedText {
  de: string;
  en: string;
}

export interface RouteMeta {
  title: LocalizedText;
  description: LocalizedText;
  ogType?: 'website' | 'article';
}

const DEFAULT_META: RouteMeta = {
  title: {
    de: 'MyPokePanion — Interaktiver Pokédex, Teambuilder & Nuzlocke-Tracker',
    en: 'MyPokePanion — Interactive Pokédex, Team Builder & Nuzlocke Tracker',
  },
  description: {
    de: 'Ein lebendiger, interaktiver Pokédex: alle 1.025 Pokémon, 18 Typen, 9 Generationen — plus Teambuilder, Nuzlocke-Tracker, Versus-Calc und interaktive Karten.',
    en: 'A living, breathing Pokédex: 1,025 Pokémon, 18 types, 9 generations — plus team builder, Nuzlocke tracker, Versus calculator and interactive maps.',
  },
};

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': DEFAULT_META,
  '/pokedex': {
    title: {
      de: 'Pokédex — alle 1.025 Pokémon mit Stats, Moves & Sprites',
      en: 'Pokédex — all 1,025 Pokémon with stats, moves & sprites',
    },
    description: {
      de: 'Der komplette Pokédex: 1.025 Pokémon über 9 Generationen filtern und durchsuchen — Stats, Typen, Fähigkeiten, Attacken, Entwicklungen und jede Sprite-Ära seit 1996.',
      en: 'The complete Pokédex: filter and search 1,025 Pokémon across 9 generations — stats, types, abilities, moves, evolutions and every sprite era since 1996.',
    },
  },
  '/items': {
    title: {
      de: 'Pokémon-Items — alle Items mit Effekten & Fundorten',
      en: 'Pokémon Items — every item with effects & locations',
    },
    description: {
      de: 'Alle Pokémon-Items im Überblick: Bälle, Heilitems, Kampfitems und mehr — mit Effekten, Preisen und Fundorten, durchsuchbar und filterbar.',
      en: 'Every Pokémon item at a glance: Poké Balls, healing items, battle items and more — with effects, prices and locations, searchable and filterable.',
    },
  },
  '/maps': {
    title: {
      de: 'Interaktive Pokémon-Karten — Regionen, Routen & Encounter-Tabellen',
      en: 'Interactive Pokémon Maps — regions, routes & encounter tables',
    },
    description: {
      de: 'Interaktive Karten der Pokémon-Regionen: Routen, Orte und Encounter-Tabellen — sieh, welches Pokémon wo auftaucht, inklusive Nuzlocke-relevanter Begegnungen.',
      en: 'Interactive maps of the Pokémon regions: routes, locations and encounter tables — see which Pokémon appears where, including Nuzlocke-relevant encounters.',
    },
  },
  '/nuzlocke': {
    title: {
      de: 'Nuzlocke-Tracker — Runs planen, Encounters & Tode tracken',
      en: 'Nuzlocke Tracker — plan runs, track encounters & deaths',
    },
    description: {
      de: 'Der Nuzlocke-Tracker für deine Challenge-Runs: Encounters pro Route festhalten, Teams verwalten, Tode dokumentieren — mit Regel-Referenz und Encounter-Tabellen.',
      en: 'The Nuzlocke tracker for your challenge runs: record encounters per route, manage teams, log deaths — with rule reference and encounter tables.',
    },
  },
  '/team': {
    title: {
      de: 'Pokémon-Teambuilder — Teams bauen & Typabdeckung prüfen',
      en: 'Pokémon Team Builder — build teams & check type coverage',
    },
    description: {
      de: 'Baue dein Pokémon-Team: Typabdeckung, Schwächen und Resistenzen im Blick, Movesets planen und das Team exportieren — für alle 9 Generationen.',
      en: 'Build your Pokémon team: keep type coverage, weaknesses and resistances in view, plan movesets and export your team — for all 9 generations.',
    },
  },
  '/versus': {
    title: {
      de: 'Versus-Calc — Pokémon Damage Calculator & 1v1-Vergleich',
      en: 'Versus Calc — Pokémon damage calculator & 1v1 comparison',
    },
    description: {
      de: 'Wer gewinnt das Duell? Der Versus-Calc vergleicht zwei Pokémon: Damage-Calculator, Typ-Matchups, Speed-Tiers und Bulk — generationengenau.',
      en: 'Who wins the duel? The Versus calculator compares two Pokémon: damage calculator, type matchups, speed tiers and bulk — accurate per generation.',
    },
  },
  '/about': {
    title: {
      de: 'Über MyPokePanion — inoffizielles Pokémon-Fan-Projekt',
      en: 'About MyPokePanion — unofficial Pokémon fan project',
    },
    description: {
      de: 'MyPokePanion ist ein inoffizielles Fan-Projekt: ein lebendiger Pokédex mit Teambuilder, Nuzlocke-Tracker, Versus-Calc und interaktiven Karten. Erfahre mehr über das Projekt.',
      en: 'MyPokePanion is an unofficial fan project: a living Pokédex with team builder, Nuzlocke tracker, Versus calculator and interactive maps. Learn more about the project.',
    },
  },
  '/feedback': {
    title: {
      de: 'Feedback — MyPokePanion mitgestalten',
      en: 'Feedback — help shape MyPokePanion',
    },
    description: {
      de: 'Dein Feedback zählt: Melde Fehler, schlage Features vor und hilf, MyPokePanion — den interaktiven Pokédex — besser zu machen.',
      en: 'Your feedback matters: report bugs, suggest features and help make MyPokePanion — the interactive Pokédex — even better.',
    },
  },
  '/support': {
    title: {
      de: 'Spenden — MyPokePanion unterstützen',
      en: 'Donate — support MyPokePanion',
    },
    description: {
      de: 'MyPokePanion ist ein kostenloses, inoffizielles Fan-Projekt. Mit einer kleinen Spende hilfst du bei Serverkosten und Weiterentwicklung.',
      en: 'MyPokePanion is a free, unofficial fan project. A small donation helps with server costs and further development.',
    },
  },
  '/account': {
    title: {
      de: 'Account — MyPokePanion',
      en: 'Account — MyPokePanion',
    },
    description: {
      de: 'Verwalte deinen MyPokePanion-Account: Teams und Nuzlocke-Runs geräteübergreifend synchronisieren.',
      en: 'Manage your MyPokePanion account: sync teams and Nuzlocke runs across devices.',
    },
  },
  '/impressum': {
    title: { de: 'Impressum — MyPokePanion', en: 'Legal notice — MyPokePanion' },
    description: {
      de: 'Impressum und Anbieterkennzeichnung von MyPokePanion, einem inoffiziellen Pokémon-Fan-Projekt.',
      en: 'Legal notice and imprint of MyPokePanion, an unofficial Pokémon fan project.',
    },
  },
  '/datenschutz': {
    title: { de: 'Datenschutz — MyPokePanion', en: 'Privacy policy — MyPokePanion' },
    description: {
      de: 'Datenschutzerklärung von MyPokePanion: welche Daten gespeichert werden und welche nicht.',
      en: 'Privacy policy of MyPokePanion: which data is stored and which is not.',
    },
  },
};

/** Registry lookup for a locale-stripped app path; falls back to the default. */
export function metaForPath(rest: string): RouteMeta {
  const key = rest === '' ? '/' : rest;
  return ROUTE_META[key] ?? DEFAULT_META;
}

/** Absolute canonical URL for a route + locale. */
export function canonicalUrl(lang: Lang, rest: string): string {
  return `${SITE_URL}${localePath(lang, rest)}`;
}

export { stripLocalePrefix };
