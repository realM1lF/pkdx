/* Description-data lookup (Batch E, EP2) — lazy layer over the committed
 * artifacts src/data/desc/{moves,items,abilities}.json (build-desc-data.mjs).
 *
 * LAZY BY DESIGN: the JSONs ship as separate chunks and load via dynamic
 * import on first modal open — nothing lands in the entry bundle. Each chunk
 * is fetched once and cached for the session.
 *
 * FALLBACK RULE: German fields (de/fde/effectShortDe) are omitted in the
 * artifact when PokéAPI has no German text (newer items/abilities, some
 * side-game moves) — consumers fall back to the EN text and flag it via the
 * `deAvailable` marker instead of hiding the description.
 *
 * SLUG INVARIANT: keys are PokéAPI slugs; the team builder stores items and
 * abilities as EN display names, so convert with entitySlug() first. */

import { useEffect, useState } from 'react';
import type { Lang } from './i18n-data';

/* ---------- artifact types ---------- */

export interface MoveDesc {
  /** EN display name */
  n: string;
  /** DE display name (only when it differs from EN) */
  de?: string;
  /** type slug */
  t: string;
  /** damage class: physical | special | status */
  dc: string;
  /** move target slug */
  target: string;
  power?: number;
  acc?: number;
  pp?: number;
  priority?: number;
  /** extra crit stages (0 = normal ratio) */
  crit?: number;
  /** % chance of the additional effect */
  effectChance?: number;
  /** shortest EN flavor from the newest version group with EN text */
  fen?: string;
  /** shortest DE flavor from the newest version group with DE text */
  fde?: string;
}

export interface ItemDesc {
  n: string;
  de?: string;
  /** item category slug (healing, pokeballs, held-items, berries, …) */
  category: string;
  cost?: number;
  /** 1 when PokéAPI has NO official sprite — lexicon hides these rows */
  nospr?: 1;
  fen?: string;
  fde?: string;
}

export interface AbilityDesc {
  n: string;
  de?: string;
  /** EN short effect text */
  effectShort?: string;
  /** DE short effect text */
  effectShortDe?: string;
  fen?: string;
  fde?: string;
}

export type DescKind = 'move' | 'item' | 'ability';
export type AnyDesc = MoveDesc | ItemDesc | AbilityDesc;

/* ---------- slug helper ---------- */

/** 'Swords Dance' → 'swords-dance' · "King's Rock" → 'kings-rock'
 * (items/abilities are stored as EN display names; slugs drop apostrophes) */
export function entitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ---------- lazy chunk loaders (one dynamic import per kind, cached) ---------- */

const CHUNKS = {
  move: () => import('@/data/desc/moves.json'),
  item: () => import('@/data/desc/items.json'),
  ability: () => import('@/data/desc/abilities.json'),
} as const;

let moveCache: Promise<Record<string, MoveDesc>> | null = null;
let itemCache: Promise<Record<string, ItemDesc>> | null = null;
let abilityCache: Promise<Record<string, AbilityDesc>> | null = null;

export function loadMoveDescs(): Promise<Record<string, MoveDesc>> {
  moveCache ??= CHUNKS.move().then((m) => m.default as unknown as Record<string, MoveDesc>);
  return moveCache;
}

export function loadItemDescs(): Promise<Record<string, ItemDesc>> {
  itemCache ??= CHUNKS.item().then((m) => m.default as unknown as Record<string, ItemDesc>);
  return itemCache;
}

export function loadAbilityDescs(): Promise<Record<string, AbilityDesc>> {
  abilityCache ??= CHUNKS.ability().then((m) => m.default as unknown as Record<string, AbilityDesc>);
  return abilityCache;
}

/** graceful null when the slug is unknown (fan-data gaps, future entities) */
export async function getMoveDesc(slug: string): Promise<MoveDesc | null> {
  return (await loadMoveDescs())[slug] ?? null;
}

export async function getItemDesc(slug: string): Promise<ItemDesc | null> {
  return (await loadItemDescs())[slug] ?? null;
}

export async function getAbilityDesc(slug: string): Promise<AbilityDesc | null> {
  return (await loadAbilityDescs())[slug] ?? null;
}

/* ---------- display resolution ---------- */

export interface ResolvedDesc<T extends AnyDesc = AnyDesc> {
  /** raw artifact record (null when the slug is unknown) */
  raw: T | null;
  /** localized display name (falls back to the EN artifact name) */
  name: string;
  /** EN subline (artifact name — always present when raw exists) */
  nameEn: string | null;
  /** primary description for `lang` (DE → EN fallback rule) */
  text: string | null;
  /** the other language's text, when both exist (powers the in-modal toggle) */
  altText: string | null;
  /** true when a German text exists (false → UI shows the EN-fallback hint) */
  deAvailable: boolean;
}

function textOf(raw: AnyDesc | null, lang: Lang): { text: string | null; alt: string | null; de: boolean } {
  if (!raw) return { text: null, alt: null, de: false };
  // abilities prefer the structured short effect over the flavor text
  const a = raw as AbilityDesc;
  const en = a.effectShort ?? raw.fen ?? null;
  const de = a.effectShortDe ?? raw.fde ?? null;
  return lang === 'de'
    ? { text: de ?? en, alt: de && en && de !== en ? en : null, de: de != null }
    : { text: en ?? de, alt: en && de && de !== en ? de : null, de: de != null };
}

export function resolveMoveDesc(raw: MoveDesc | null, slug: string, lang: Lang): ResolvedDesc<MoveDesc> {
  const { text, alt, de } = textOf(raw, lang);
  return {
    raw,
    name: lang === 'de' && raw?.de ? raw.de : (raw?.n ?? slug),
    nameEn: raw?.n ?? null,
    text,
    altText: alt,
    deAvailable: de,
  };
}

export function resolveItemDesc(raw: ItemDesc | null, slug: string, lang: Lang): ResolvedDesc<ItemDesc> {
  const { text, alt, de } = textOf(raw, lang);
  return {
    raw,
    name: lang === 'de' && raw?.de ? raw.de : (raw?.n ?? slug),
    nameEn: raw?.n ?? null,
    text,
    altText: alt,
    deAvailable: de,
  };
}

export function resolveAbilityDesc(raw: AbilityDesc | null, slug: string, lang: Lang): ResolvedDesc<AbilityDesc> {
  const { text, alt, de } = textOf(raw, lang);
  return {
    raw,
    name: lang === 'de' && raw?.de ? raw.de : (raw?.n ?? slug),
    nameEn: raw?.n ?? null,
    text,
    altText: alt,
    deAvailable: de,
  };
}

/* ---------- react hooks ---------- */

/**
 * Loads a whole desc chunk (cached after first call) and returns the record
 * map — null while loading. For pickers/lexica that render many rows.
 */
export function useDescMap(kind: 'move'): Record<string, MoveDesc> | null;
export function useDescMap(kind: 'item'): Record<string, ItemDesc> | null;
export function useDescMap(kind: 'ability'): Record<string, AbilityDesc> | null;
export function useDescMap(kind: DescKind): Record<string, AnyDesc> | null {
  const [map, setMap] = useState<Record<string, AnyDesc> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const load =
      kind === 'move' ? loadMoveDescs : kind === 'item' ? loadItemDescs : loadAbilityDescs;
    void load().then((m) => {
      if (!cancelled) setMap(m as Record<string, AnyDesc>);
    });
    return () => {
      cancelled = true;
    };
  }, [kind]);
  return map;
}


export interface EntityDescState {
  /** null while the chunk is loading */
  loaded: boolean;
  move: MoveDesc | null;
  item: ItemDesc | null;
  ability: AbilityDesc | null;
}

/**
 * Loads the description record for one entity. `slugOrName` may be a slug or
 * an EN display name (team-builder storage) — normalized via entitySlug().
 */
export function useEntityDesc(kind: DescKind, slugOrName: string | null | undefined): EntityDescState {
  const slug = slugOrName ? entitySlug(slugOrName) : null;
  const [state, setState] = useState<EntityDescState>({ loaded: false, move: null, item: null, ability: null });

  useEffect(() => {
    if (!slug) {
      setState({ loaded: true, move: null, item: null, ability: null });
      return undefined;
    }
    let cancelled = false;
    const done = (patch: Partial<EntityDescState>) => {
      if (!cancelled) setState({ loaded: true, move: null, item: null, ability: null, ...patch });
    };
    if (kind === 'move') void getMoveDesc(slug).then((d) => done({ move: d }));
    else if (kind === 'item') void getItemDesc(slug).then((d) => done({ item: d }));
    else void getAbilityDesc(slug).then((d) => done({ ability: d }));
    return () => {
      cancelled = true;
    };
  }, [kind, slug]);

  return state;
}
