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
import { resolveTypeParam, typeName } from './seo-types';
import { ITEMS_SEO, localizeItemPath, resolveItemParam } from './seo-items';
import { localizeTypePath } from './seo-types';
import { localizeRoutePath, resolveRouteParam, routeMetaGen } from './seo-routes-kanto';
import META_GEN from '@/data/seo-meta-gen.json';

const META_POKEMON = META_GEN.pokemon as unknown as Record<
  string,
  { nameDe: string; nameEn: string; locDe: string | null; locEn: string | null; topChance: number | null }
>;

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
  '/maps/kanto/route-1': {
    title: {
      de: 'Route 1 (Kanto) – Pokémon & Fundorte in Feuerrot/Blattgrün',
      en: 'Route 1 (Kanto) – Pokémon & Locations in FireRed/LeafGreen',
    },
    description: {
      de: 'Alle Pokémon auf Route 1 in Feuerrot/Blattgrün: Taubsi & Rattfratz mit Fangraten, Levels, Items, Best-Catch-Tipp und Nuzlocke-Hinweisen.',
      en: 'Every Pokémon on Kanto Route 1 in FireRed/LeafGreen: Pidgey & Rattata catch rates, levels, items, best-catch advice and Nuzlocke notes.',
    },
    ogType: 'article',
  },
  '/pokemon/25': {
    title: {
      de: 'Pikachu #25 – Fundorte, Attacken & Entwicklung (Feuerrot/Blattgrün)',
      en: 'Pikachu #25 – Locations, Moves & Evolution (FireRed/LeafGreen)',
    },
    description: {
      de: 'Pikachu in Feuerrot/Blattgrün: Fundorte (Vertania-Wald 5 %, Kraftwerk 25 %), Level-Attacken, Entwicklung zu Raichu und Antworten auf die häufigsten Fragen.',
      en: 'Pikachu in FireRed/LeafGreen: locations (Viridian Forest 5%, Power Plant 25%), level-up moves, evolution to Raichu and answers to common questions.',
    },
    ogType: 'article',
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

/* ---------- generated meta: type pages + item detail pages (SEO rollout) ---------- */

const TYPES_OVERVIEW_META: RouteMeta = {
  title: {
    de: 'Alle 18 Pokémon-Typen — Stärken, Schwächen & Konter',
    en: 'All 18 Pokémon types — strengths, weaknesses & counters',
  },
  description: {
    de: 'Die komplette Typen-Übersicht: alle 18 Pokémon-Typen mit Stärken, Schwächen, Resistenzen und den besten Kontern — berechnet aus der offiziellen Typen-Tabelle.',
    en: 'The complete type overview: all 18 Pokémon types with strengths, weaknesses, resistances and the best counters — computed from the official type chart.',
  },
};

function typeDetailMeta(slug: string): RouteMeta {
  const de = typeName(slug, 'de');
  const en = typeName(slug, 'en');
  return {
    title: {
      de: `${de}-Typ – Stärken, Schwächen & beste Konter`,
      en: `${en} type – strengths, weaknesses & best counters`,
    },
    description: {
      de: `Was ist effektiv gegen ${de}? Alle Stärken, Schwächen, Resistenzen und Immunitäten des ${de}-Typs — mit den besten Konter-Typen, Beispiel-Pokémon und Versus-Calc.`,
      en: `What is super effective against ${en}? All strengths, weaknesses, resistances and immunities of the ${en} type — with the best counter types, example Pokémon and the Versus calculator.`,
    },
    ogType: 'article',
  };
}

function itemDetailMeta(slug: string): RouteMeta {
  const e = ITEMS_SEO[slug];
  return {
    title: {
      de: `${e.nameDe} (${e.nameEn}) – Wirkung, Fundorte & ob es sich lohnt`,
      en: `${e.nameEn} – effect, locations & whether it’s worth it`,
    },
    description: {
      de: `${e.nameDe}: ${e.effectDe} Wirkung, Fundorte und Einschätzung — plus Antworten auf die häufigsten Fragen zum Item.`,
      en: `${e.nameEn}: ${e.effectEn} Effect, locations and our verdict — plus answers to the most common questions about the item.`,
    },
    ogType: 'article',
  };
}

/** Generated meta: Kanto location pages (name + top encounter from the snapshot). */
function kantoRouteMeta(nodeId: string): RouteMeta {
  const m = routeMetaGen(nodeId);
  const nameDe = m?.nameDe ?? nodeId;
  const nameEn = m?.nameEn ?? nodeId;
  const topDe = m?.topNameDe ?? '';
  const topEn = m?.topNameEn ?? '';
  return {
    title: {
      de: `${nameDe} (Kanto) – Pokémon & Fundorte in Feuerrot/Blattgrün`,
      en: `${nameEn} (Kanto) – Pokémon & Locations in FireRed/LeafGreen`,
    },
    description: {
      de: `Alle Pokémon auf ${nameDe} in Feuerrot/Blattgrün: ${m?.speciesCount ?? ''} Arten mit Fangraten und Levels${topDe ? ` — häufigster Fang: ${topDe}` : ''}. Dazu Items, Trainer und die Unterschiede zwischen beiden Editionen.`,
      en: `Every Pokémon on ${nameEn} in FireRed/LeafGreen: ${m?.speciesCount ?? ''} species with catch rates and levels${topEn ? ` — most common: ${topEn}` : ''}. Plus items, trainers and the differences between the two versions.`,
    },
    ogType: 'article',
  };
}

/** Generated meta for the 25 curated Pokémon detail pages. */
function pokemonSeoMeta(id: number): RouteMeta {
  const m = META_POKEMON[String(id)];
  const nameDe = m?.nameDe ?? `#${id}`;
  const nameEn = m?.nameEn ?? `#${id}`;
  return {
    title: {
      de: `${nameDe} #${id} – Fundorte, Schwächen & Entwicklung (Feuerrot/Blattgrün)`,
      en: `${nameEn} #${id} – Locations, Weaknesses & Evolution (FireRed/LeafGreen)`,
    },
    description: {
      de: m?.locDe
        ? `${nameDe} in Feuerrot/Blattgrün: Fundorte (u. a. ${m.locDe}${m.topChance ? ` ${m.topChance} %` : ''}), Schwächen & Resistenzen aus der Typentabelle, Entwicklung und Antworten auf die häufigsten Fragen.`
        : `${nameDe} in Feuerrot/Blattgrün: Schwächen & Resistenzen aus der Typentabelle, Entwicklung, Verfügbarkeit und Antworten auf die häufigsten Fragen.`,
      en: m?.locEn
        ? `${nameEn} in FireRed/LeafGreen: locations (incl. ${m.locEn}${m.topChance ? ` ${m.topChance}%` : ''}), weaknesses & resistances from the type chart, evolution and answers to common questions.`
        : `${nameEn} in FireRed/LeafGreen: weaknesses & resistances from the type chart, evolution, availability and answers to common questions.`,
    },
    ogType: 'article',
  };
}

/**
 * Pokémon detail meta ONLY when the id carries SEO content (curated pilot
 * ROUTE_META or a generated entry for the 25 rollout Pokémon) — null for
 * every other dex id, so callers keep their generic title fallback.
 */
export function pokemonSeoMetaForParam(param: string): RouteMeta | null {
  const key = `/pokemon/${param}`;
  if (ROUTE_META[key]) return ROUTE_META[key];
  if (/^\d+$/.test(param) && META_POKEMON[param]) return pokemonSeoMeta(Number(param));
  return null;
}

/** Registry lookup for a locale-stripped app path; falls back to the default. */
export function metaForPath(rest: string): RouteMeta {
  const key = rest === '' ? '/' : rest;
  if (ROUTE_META[key]) return ROUTE_META[key];
  if (key === '/typen' || key === '/types') return TYPES_OVERVIEW_META;
  const typeMatch = key.match(/^\/(typen|types)\/([^/]+)$/);
  if (typeMatch) {
    const slug = resolveTypeParam(typeMatch[2]);
    if (slug) return typeDetailMeta(slug);
  }
  const itemMatch = key.match(/^\/items\/([^/]+)$/);
  if (itemMatch) {
    const slug = resolveItemParam(itemMatch[1]);
    if (slug) return itemDetailMeta(slug);
  }
  const kantoMatch = key.match(/^\/maps\/kanto\/([^/]+)$/);
  if (kantoMatch) {
    const nodeId = resolveRouteParam(kantoMatch[1]);
    if (nodeId) return kantoRouteMeta(nodeId);
  }
  const pokemonMatch = key.match(/^\/pokemon\/(\d+)$/);
  if (pokemonMatch) {
    const id = Number(pokemonMatch[1]);
    if (META_POKEMON[String(id)]) return pokemonSeoMeta(id);
  }
  return DEFAULT_META;
}

/**
 * Locale-aware rest path: type and item pages use localized slugs
 * ('/typen/wasser' ↔ '/types/water', '/items/ep-teiler' ↔ '/items/exp-share'),
 * so canonical + hreflang URLs must translate the rest path per locale.
 */
export function restForLang(rest: string, lang: Lang): string {
  return localizeRoutePath(localizeItemPath(localizeTypePath(rest, lang), lang), lang);
}

/** Absolute canonical URL for a route + locale. */
export function canonicalUrl(lang: Lang, rest: string): string {
  return `${SITE_URL}${localePath(lang, rest)}`;
}

export { stripLocalePrefix };
