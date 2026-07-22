/* Pokédex 2.0 — Team Builder core (team-builder.md, Option A)
 * Pure state/logic module — no React.
 *
 * - 6-slot team model (pokemon, level, moves[4], item, ability, nature, evs)
 * - GAME / version-group selector data (RBY … SV) with gen-aware legality
 *   (@pkmn/data + @pkmn/dex for items/abilities/natures/species/types,
 *    PokéAPI version_group_details for move pools)
 * - Derived legality re-check (illegal slots are FLAGGED, never deleted)
 * - localStorage persistence (`pdx2.teams` + draft) and URL-hash sharing
 * - Nuzlocke import bridge (read-only use of getRunTeam)
 * - Analysis math: defensive synergy (ability-aware), offensive coverage,
 *   Smogon OU meta snapshot (data.pkmn.cc, cached)
 */
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { GenerationNum, Nature, Specie, TypeName } from '@pkmn/data';
import i18n from '@/i18n';
import { nameOfMove } from './i18n-data';
import type { Lang } from './i18n-data';
import { cachedJson, displayName, getPokemon } from './pokeapi';
import type { Pokemon } from './types';
import { POKEMON_TYPES, STAT_ORDER } from './types';
import type { PokemonType, StatKey } from './types';
import { getRunTeam, loadLocalRun, pushToast, readRunIndex } from './nuzlocke-store';
import { readLocalJson, removeLocalKey, writeLocalJson } from './storage';

/* ------------------------------------------------------------------ */
/* Version groups                                                      */
/* ------------------------------------------------------------------ */

export interface VersionGroupInfo {
  /** PokéAPI version-group slug, e.g. 'scarlet-violet' */
  id: string;
  /** display label, e.g. 'SCARLET · VIOLET' */
  label: string;
  /** short chip, e.g. 'SV' */
  short: string;
  gen: GenerationNum;
  /** individual game slugs belonging to this group (nuzlocke `run.game` values) */
  games: string[];
}

export const VERSION_GROUPS: VersionGroupInfo[] = [
  { id: 'red-blue', label: 'RED · BLUE', short: 'RB', gen: 1, games: ['red', 'blue'] },
  { id: 'yellow', label: 'YELLOW', short: 'Y', gen: 1, games: ['yellow'] },
  { id: 'gold-silver', label: 'GOLD · SILVER', short: 'GS', gen: 2, games: ['gold', 'silver'] },
  { id: 'crystal', label: 'CRYSTAL', short: 'C', gen: 2, games: ['crystal'] },
  { id: 'ruby-sapphire', label: 'RUBY · SAPPHIRE', short: 'RS', gen: 3, games: ['ruby', 'sapphire'] },
  { id: 'emerald', label: 'EMERALD', short: 'E', gen: 3, games: ['emerald'] },
  { id: 'firered-leafgreen', label: 'FIRE RED · LEAF GREEN', short: 'FRLG', gen: 3, games: ['firered', 'leafgreen'] },
  { id: 'diamond-pearl', label: 'DIAMOND · PEARL', short: 'DP', gen: 4, games: ['diamond', 'pearl'] },
  { id: 'platinum', label: 'PLATINUM', short: 'PT', gen: 4, games: ['platinum'] },
  { id: 'heartgold-soulsilver', label: 'HEART GOLD · SOUL SILVER', short: 'HGSS', gen: 4, games: ['heartgold', 'soulsilver'] },
  { id: 'black-white', label: 'BLACK · WHITE', short: 'BW', gen: 5, games: ['black', 'white'] },
  { id: 'black-2-white-2', label: 'BLACK 2 · WHITE 2', short: 'B2W2', gen: 5, games: ['black-2', 'white-2'] },
  { id: 'x-y', label: 'X · Y', short: 'XY', gen: 6, games: ['x', 'y'] },
  { id: 'omega-ruby-alpha-sapphire', label: 'OMEGA RUBY · ALPHA SAPPHIRE', short: 'ORAS', gen: 6, games: ['omega-ruby', 'alpha-sapphire'] },
  { id: 'sun-moon', label: 'SUN · MOON', short: 'SM', gen: 7, games: ['sun', 'moon'] },
  { id: 'ultra-sun-ultra-moon', label: 'ULTRA SUN · ULTRA MOON', short: 'USUM', gen: 7, games: ['ultra-sun', 'ultra-moon'] },
  { id: 'lets-go-pikachu-eevee', label: "LET'S GO PIKACHU · EEVEE", short: 'LGPE', gen: 7, games: ['lets-go-pikachu', 'lets-go-eevee'] },
  { id: 'sword-shield', label: 'SWORD · SHIELD', short: 'SWSH', gen: 8, games: ['sword', 'shield'] },
  { id: 'brilliant-diamond-shining-pearl', label: 'BRILLIANT DIAMOND · SHINING PEARL', short: 'BDSP', gen: 8, games: ['brilliant-diamond', 'shining-pearl'] },
  { id: 'legends-arceus', label: 'LEGENDS ARCEUS', short: 'LA', gen: 8, games: ['legends-arceus'] },
  { id: 'scarlet-violet', label: 'SCARLET · VIOLET', short: 'SV', gen: 9, games: ['scarlet', 'violet'] },
];

export const DEFAULT_VERSION_GROUP = 'scarlet-violet';

export function versionGroupById(id: string): VersionGroupInfo {
  return VERSION_GROUPS.find((v) => v.id === id) ?? VERSION_GROUPS[VERSION_GROUPS.length - 1];
}

/** nuzlocke `run.game` ('firered', 'heartgold', …) → version-group id ('firered-leafgreen', …) */
export const GAME_TO_VERSION_GROUP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const vg of VERSION_GROUPS) for (const g of vg.games) map[g] = vg.id;
  return map;
})();

export function versionGroupForGame(game: string | null | undefined): string | null {
  if (!game) return null;
  return GAME_TO_VERSION_GROUP[game] ?? null;
}

/* ------------------------------------------------------------------ */
/* Gen-aware data layer (@pkmn/data + @pkmn/dex)                       */
/* ------------------------------------------------------------------ */

const gens = new Generations(Dex);

export function genFor(vgId: string) {
  return gens.get(versionGroupById(vgId).gen);
}

/** gen-aware species lookup by PokéAPI slug ('mr-mime') or display name */
export function genSpecies(vgId: string, nameOrSlug: string | null | undefined): Specie | undefined {
  if (!nameOrSlug) return undefined;
  const gen = genFor(vgId);
  const direct = gen.species.get(nameOrSlug);
  if (direct?.exists) return direct;
  const byDisplay = gen.species.get(displayName(nameOrSlug));
  if (byDisplay?.exists) return byDisplay;
  return undefined;
}

/** gen-correct types for a species (e.g. Magnemite: pure Electric in gen 1) */
export function genTypesOf(vgId: string, nameOrSlug: string, fallback: PokemonType[]): PokemonType[] {
  const sp = genSpecies(vgId, nameOrSlug);
  if (sp?.exists && sp.types.length) return sp.types.map((t) => t.toLowerCase() as PokemonType);
  return fallback;
}

/** abilities available to the species in this gen ('' filtered out — gen 1/2 have none) */
export function genAbilitiesOf(vgId: string, nameOrSlug: string | null | undefined): string[] {
  const sp = genSpecies(vgId, nameOrSlug);
  if (!sp?.exists) return [];
  return [sp.abilities[0], sp.abilities[1], sp.abilities.H]
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map(String);
}

/** all items existing in this gen (held items arrive gen 2) */
export function genItems(vgId: string): string[] {
  const gen = genFor(vgId);
  const out: string[] = [];
  for (const it of gen.items) if (it.exists && it.name && !it.isNonstandard) out.push(it.name);
  return out.sort((a, b) => a.localeCompare(b));
}

/** all natures existing in this gen (gen 3+) */
export function genNatures(vgId: string): Nature[] {
  const gen = genFor(vgId);
  const out: Nature[] = [];
  for (const n of gen.natures) if (n.exists) out.push(n);
  return out;
}

export function genHasMechanics(vgId: string): { abilities: boolean; items: boolean; natures: boolean; evs: boolean } {
  const g = versionGroupById(vgId).gen;
  return { abilities: g >= 3, items: g >= 2, natures: g >= 3, evs: g >= 3 };
}

/* ------------------------------------------------------------------ */
/* Team state model                                                    */
/* ------------------------------------------------------------------ */

export interface TeamSlot {
  /** stable slot id (drag & drop keys) */
  id: string;
  /** PokéAPI slug, e.g. 'garchomp' */
  pokemon: string | null;
  pokemonId: number | null;
  nickname: string | null;
  level: number; // 1..100
  moves: [string | null, string | null, string | null, string | null];
  item: string | null;
  ability: string | null;
  nature: string | null;
  evs: Record<StatKey, number>;
}

export interface Team {
  id: string;
  name: string;
  versionGroup: string;
  slots: TeamSlot[]; // 6
  updatedAt: number;
}

export const TEAM_SIZE = 6;
export const MAX_LEVEL = 100;
export const MAX_EV_PER_STAT = 252;
export const MAX_EV_TOTAL = 510;

function slotId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `slot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function zeroEvs(): Record<StatKey, number> {
  return { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 };
}

export function emptySlot(): TeamSlot {
  return {
    id: slotId(),
    pokemon: null,
    pokemonId: null,
    nickname: null,
    level: 50,
    moves: [null, null, null, null],
    item: null,
    ability: null,
    nature: null,
    evs: zeroEvs(),
  };
}

export function emptyTeam(name = 'Untitled Team'): Team {
  return {
    id: slotId(),
    name,
    versionGroup: DEFAULT_VERSION_GROUP,
    slots: Array.from({ length: TEAM_SIZE }, emptySlot),
    updatedAt: Date.now(),
  };
}

export function filledSlots(team: Team): TeamSlot[] {
  return team.slots.filter((s) => s.pokemon != null && s.pokemonId != null);
}

export function evTotal(slot: TeamSlot): number {
  return STAT_ORDER.reduce((sum, k) => sum + (slot.evs[k] || 0), 0);
}

/* ------------------------------------------------------------------ */
/* Move legality (PokéAPI version_group_details)                       */
/* ------------------------------------------------------------------ */

export type LearnMethod = 'level-up' | 'machine' | 'tutor' | 'egg' | 'other';

export interface LegalMoveOption {
  /** PokéAPI move slug */
  name: string;
  label: string;
  method: LearnMethod;
  /** highest level_learned_at across this version group (level-up only) */
  level: number;
}

const METHOD_ORDER: Record<LearnMethod, number> = { 'level-up': 0, machine: 1, tutor: 2, egg: 3, other: 4 };

function normalizeMethod(m: string): LearnMethod {
  if (m === 'level-up') return 'level-up';
  if (m === 'machine') return 'machine';
  if (m === 'tutor') return 'tutor';
  if (m === 'egg') return 'egg';
  return 'other';
}

/** All moves learnable in this version group, best-method-first, alpha inside groups. */
export function legalMoves(pokemon: Pokemon, vgId: string): LegalMoveOption[] {
  const out: LegalMoveOption[] = [];
  for (const m of pokemon.moves) {
    const details = m.version_group_details.filter((d) => d.version_group.name === vgId);
    if (!details.length) continue;
    let method: LearnMethod = 'other';
    let level = 0;
    for (const d of details) {
      const nm = normalizeMethod(d.move_learn_method.name);
      if (METHOD_ORDER[nm] < METHOD_ORDER[method]) method = nm;
      if (d.level_learned_at > level) level = d.level_learned_at;
    }
    out.push({ name: m.move.name, label: displayName(m.move.name), method, level });
  }
  out.sort((a, b) => METHOD_ORDER[a.method] - METHOD_ORDER[b.method] || a.label.localeCompare(b.label));
  return out;
}

/* ------------------------------------------------------------------ */
/* Legality re-check (derived — flags, never deletes)                  */
/* ------------------------------------------------------------------ */

export type LegalityReasonKey =
  | 'species'
  | 'level'
  | 'move'
  | 'noItems'
  | 'item'
  | 'noAbilities'
  | 'ability'
  | 'noNatures'
  | 'nature'
  | 'noEvs';

export interface LegalityReason {
  key: LegalityReasonKey;
  /** move slug / item / ability display — resolved at the render edge */
  param?: string;
}

export interface SlotLegality {
  legal: boolean;
  /** structured codes — localized via legalityReasonText at the render edge */
  reasons: LegalityReason[];
}

/** localized one-line reason (uppercase chip style).
 * item/ability params come from the (English) @pkmn data and are kept as-is;
 * move params are PokéAPI slugs → localized via nameOfMove. */
export function legalityReasonText(r: LegalityReason, lang: Lang): string {
  const name = r.param == null ? '' : r.key === 'move' ? nameOfMove(r.param, lang) : r.param;
  return i18n.t(`tb.illegal.${r.key}`, { lng: lang, name }).toUpperCase();
}

/**
 * Re-check a slot against the current version group.
 * `pokemon` = the PokéAPI payload when loaded (move pool check needs it).
 * While the payload is loading, the slot is treated as legal (no flicker).
 */
export function slotLegality(slot: TeamSlot, vgId: string, pokemon: Pokemon | undefined): SlotLegality {
  const reasons: LegalityReason[] = [];
  if (!slot.pokemon || slot.pokemonId == null) return { legal: true, reasons };

  const sp = genSpecies(vgId, slot.pokemon);
  if (!sp?.exists) reasons.push({ key: 'species' });

  if (slot.level < 1 || slot.level > MAX_LEVEL) reasons.push({ key: 'level' });

  if (pokemon) {
    const legal = new Set(legalMoves(pokemon, vgId).map((m) => m.name));
    for (const mv of slot.moves) {
      if (mv && !legal.has(mv)) reasons.push({ key: 'move', param: mv });
    }
  }

  const mech = genHasMechanics(vgId);
  if (slot.item) {
    if (!mech.items) reasons.push({ key: 'noItems' });
    else if (!genFor(vgId).items.get(slot.item)?.exists) reasons.push({ key: 'item', param: slot.item });
  }
  if (slot.ability) {
    if (!mech.abilities) reasons.push({ key: 'noAbilities' });
    else {
      const ok = genAbilitiesOf(vgId, slot.pokemon).some((a) => a.toLowerCase() === slot.ability!.toLowerCase());
      if (!ok) reasons.push({ key: 'ability', param: slot.ability });
    }
  }
  if (slot.nature) {
    if (!mech.natures) reasons.push({ key: 'noNatures' });
    else if (!genFor(vgId).natures.get(slot.nature)?.exists) reasons.push({ key: 'nature' });
  }
  if (!mech.evs && evTotal(slot) > 0) reasons.push({ key: 'noEvs' });

  return { legal: reasons.length === 0, reasons };
}

/* ------------------------------------------------------------------ */
/* Defensive synergy (ability-aware, gen-correct chart)                */
/* ------------------------------------------------------------------ */

/** ability slug → types it grants immunity to */
const IMMUNE_ABILITIES: Record<string, PokemonType[]> = {
  levitate: ['ground'],
  'earth-eater': ['ground'],
  'flash-fire': ['fire'],
  'well-baked-body': ['fire'],
  'water-absorb': ['water'],
  'dry-skin': ['water'],
  'storm-drain': ['water'],
  'volt-absorb': ['electric'],
  'lightning-rod': ['electric'],
  'motor-drive': ['electric'],
  'sap-sipper': ['grass'],
  'wonder-guard': [], // special-cased below
};

/** ability slug → { types, mult } resist modifiers */
const RESIST_ABILITIES: Record<string, { types: PokemonType[]; mult: number }> = {
  'thick-fat': { types: ['fire', 'ice'], mult: 0.5 },
  heatproof: { types: ['fire'], mult: 0.5 },
  'water-bubble': { types: ['fire'], mult: 0.5 },
  filter: { types: [...POKEMON_TYPES], mult: 0.75 }, // super-effective only (applied conditionally)
  'solid-rock': { types: [...POKEMON_TYPES], mult: 0.75 },
  'prism-armor': { types: [...POKEMON_TYPES], mult: 0.75 },
};

const CONDITIONAL_SE_MULT = new Set(['filter', 'solid-rock', 'prism-armor']);

export interface TeamMemberDefense {
  types: PokemonType[];
  /** ability slug ('levitate') or null */
  ability: string | null;
}

function toTypeName(t: PokemonType): TypeName {
  return (t.charAt(0).toUpperCase() + t.slice(1)) as TypeName;
}

/** raw chart multiplier (gen-correct) of attacking type vs defending type */
export function chartEff(atk: PokemonType, def: PokemonType, vgId: string): number {
  const chart = genFor(vgId).types.get(toTypeName(atk));
  const eff = chart?.effectiveness[toTypeName(def)];
  return typeof eff === 'number' ? eff : 1;
}

/** effectiveness of attacking type vs one member (gen chart + ability) */
export function effectivenessVsMember(atk: PokemonType, member: TeamMemberDefense, vgId: string): number {
  let eff = 1;
  for (const def of member.types) eff *= chartEff(atk, def, vgId);
  const ability = member.ability?.toLowerCase().replace(/ /g, '-') ?? null;
  if (ability) {
    if (ability === 'wonder-guard') {
      if (eff <= 1) return 0;
    } else {
      const imm = IMMUNE_ABILITIES[ability];
      if (imm?.includes(atk)) return 0;
      const res = RESIST_ABILITIES[ability];
      if (res && res.types.includes(atk)) {
        if (CONDITIONAL_SE_MULT.has(ability) ? eff > 1 : true) eff *= res.mult;
      }
    }
  }
  return eff;
}

export interface DefenseRow {
  type: PokemonType;
  weak: number;
  resist: number;
  immune: number;
  /** 0 neutral · 1 covered-ish · 2 danger (weak > resist+immune) · 3 critical (≥2 weak, 0 resist/immune) */
  severity: 0 | 1 | 2 | 3;
}

export function defensiveSynergy(members: TeamMemberDefense[], vgId: string): DefenseRow[] {
  return POKEMON_TYPES.map((type) => {
    let weak = 0;
    let resist = 0;
    let immune = 0;
    for (const m of members) {
      const eff = effectivenessVsMember(type, m, vgId);
      if (eff === 0) immune += 1;
      else if (eff > 1) weak += 1;
      else if (eff < 1) resist += 1;
    }
    let severity: DefenseRow['severity'] = 0;
    if (weak >= 2 && resist + immune === 0) severity = 3;
    else if (weak > resist + immune) severity = 2;
    else if (weak > 0) severity = 1;
    return { type, weak, resist, immune, severity };
  });
}

/** worst cases first: "3× WEAK GROUND · 0 RESIST" */
export function worstCases(rows: DefenseRow[]): DefenseRow[] {
  return rows
    .filter((r) => r.severity >= 2)
    .sort((a, b) => b.severity - a.severity || b.weak - a.weak || a.type.localeCompare(b.type));
}

/* ------------------------------------------------------------------ */
/* Offensive coverage                                                  */
/* ------------------------------------------------------------------ */

export interface TeamMove {
  /** move slug */
  name: string;
  type: PokemonType;
  /** true if it belongs to a member sharing its type (STAB) */
  stab: boolean;
}

export interface CoverageResult {
  /** per defending type: moves that hit it super-effectively */
  se: Record<PokemonType, string[]>;
  /** defending types nothing in the team hits super-effectively */
  gaps: PokemonType[];
  /** distinct STAB types on damaging moves */
  stabTypes: PokemonType[];
}

export function offensiveCoverage(moves: TeamMove[], vgId: string): CoverageResult {
  const se = {} as Record<PokemonType, string[]>;
  const gaps: PokemonType[] = [];
  for (const def of POKEMON_TYPES) {
    const hitters: string[] = [];
    for (const mv of moves) {
      if (chartEff(mv.type, def, vgId) > 1) hitters.push(mv.name);
    }
    se[def] = hitters;
    if (!hitters.length) gaps.push(def);
  }
  const stabTypes = [...new Set(moves.filter((m) => m.stab).map((m) => m.type))];
  return { se, gaps, stabTypes };
}

/* ------------------------------------------------------------------ */
/* Smogon meta snapshot (gen9 OU via data.pkmn.cc)                     */
/* ------------------------------------------------------------------ */

export const SMOGON_OU_URL = 'https://data.pkmn.cc/sets/gen9ou.json';
const SMOGON_CACHE_KEY = 'meta-gen9ou';

export interface SmogonSet {
  name: string;
  moves: string[][];
  items: string[];
  abilities: string[];
  natures: string[];
  evs: Array<Partial<Record<StatKey, number>>>;
  level: number | null;
  teraTypes: string[];
}

export interface SmogonSpeciesEntry {
  species: string;
  sets: SmogonSet[];
  /** usage weight 0..1 within the tier (may be missing) */
  weight: number | null;
}

type SmogonDump = Record<string, { sets?: Record<string, unknown>; weight?: number }>;

export function fetchMetaDump(): Promise<SmogonDump> {
  return cachedJson<SmogonDump>(SMOGON_CACHE_KEY, SMOGON_OU_URL);
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

/** Showdown short stat ids → our StatKey (pkmn.cc spreads use short keys) */
const SHORT_STAT: Record<string, StatKey> = {
  hp: 'hp',
  atk: 'attack',
  def: 'defense',
  spa: 'special-attack',
  spd: 'special-defense',
  spe: 'speed',
};

function parseSpread(v: unknown): Partial<Record<StatKey, number>> {
  const out: Partial<Record<StatKey, number>> = {};
  if (!v || typeof v !== 'object') return out;
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val !== 'number') continue;
    const key = SHORT_STAT[k] ?? (STAT_ORDER.includes(k as StatKey) ? (k as StatKey) : undefined);
    if (key) out[key] = val;
  }
  return out;
}

/** defensive parser — tolerates missing/extra fields, name variants */
export function parseMetaEntry(dump: SmogonDump, speciesDisplay: string): SmogonSpeciesEntry | null {
  const candidates = [
    speciesDisplay,
    speciesDisplay.replace(/-/g, ' '),
    speciesDisplay.split('-')[0],
    speciesDisplay.split(/[- ]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('-'),
    speciesDisplay.split(/[- ]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
  ];
  let raw: { sets?: Record<string, unknown>; weight?: number } | undefined;
  let matched = '';
  for (const c of candidates) {
    if (dump[c]) {
      raw = dump[c];
      matched = c;
      break;
    }
  }
  if (!raw?.sets) return null;
  const sets: SmogonSet[] = [];
  for (const [name, v] of Object.entries(raw.sets)) {
    const s = v as Record<string, unknown>;
    const moves = Array.isArray(s.moves)
      ? (s.moves as unknown[]).map((slot) => asStringArray(slot))
      : [];
    /* evs may be one spread object or an array of spreads; keys are short ('atk') or long */
    const evsRaw = Array.isArray(s.evs) ? (s.evs as unknown[]) : s.evs ? [s.evs] : [];
    const evs = evsRaw.map(parseSpread).filter((e) => Object.keys(e).length > 0);
    sets.push({
      name,
      moves,
      items: asStringArray(s.items),
      abilities: asStringArray(s.abilities),
      natures: asStringArray(s.natures),
      evs,
      level: typeof s.level === 'number' ? s.level : null,
      teraTypes: asStringArray(s.teraTypes ?? s.teraType),
    });
  }
  if (!sets.length) return null;
  return { species: matched, sets, weight: typeof raw.weight === 'number' ? raw.weight : null };
}

/** convert a Smogon spread into our EV record */
export function smogonEvs(spread: Partial<Record<StatKey, number>> | undefined): Record<StatKey, number> {
  const out = zeroEvs();
  if (spread) for (const k of STAT_ORDER) if (typeof spread[k] === 'number') out[k] = spread[k]!;
  return out;
}

/* ------------------------------------------------------------------ */
/* localStorage persistence (`pdx2.teams`)                             */
/* ------------------------------------------------------------------ */

const LS_TEAMS = 'pdx2.teams';
const LS_DRAFT = 'pdx2.teams.draft';

function readJson<T>(key: string, fallback: T): T {
  return readLocalJson(key, fallback);
}

function writeJson(key: string, value: unknown): boolean {
  return writeLocalJson(key, value);
}

export function loadTeams(): Team[] {
  const list = readJson<Team[]>(LS_TEAMS, []);
  return Array.isArray(list) ? list.filter((t) => t && Array.isArray(t.slots)) : [];
}

/** upsert by id; returns the new list */
export function saveTeam(team: Team): Team[] {
  const list = loadTeams();
  const next = { ...team, updatedAt: Date.now() };
  const idx = list.findIndex((t) => t.id === team.id);
  const updated = [...list];
  if (idx >= 0) updated[idx] = next;
  else updated.unshift(next);
  if (!writeJson(LS_TEAMS, updated)) {
    pushToast('sync', i18n.t('tb.toast.storageFailed'));
    return list;
  }
  return updated;
}

export function deleteTeam(id: string): Team[] {
  const list = loadTeams().filter((t) => t.id !== id);
  if (!writeJson(LS_TEAMS, list)) pushToast('sync', i18n.t('tb.toast.storageFailed'));
  return list;
}

export function loadDraft(): Team | null {
  const d = readJson<Team | null>(LS_DRAFT, null);
  return d && Array.isArray(d.slots) ? d : null;
}

export function saveDraft(team: Team | null): void {
  if (team) {
    if (!writeJson(LS_DRAFT, team)) pushToast('sync', i18n.t('tb.toast.storageFailed'));
  } else {
    removeLocalKey(LS_DRAFT);
  }
}

/* ------------------------------------------------------------------ */
/* URL-hash share encoding (compact tuple → deflate/base64url)         */
/* ------------------------------------------------------------------ */

type CompactSlot = [
  pokemon: string | null,
  pokemonId: number | null,
  nickname: string | null,
  level: number,
  moves: (string | null)[],
  item: string | null,
  ability: string | null,
  nature: string | null,
  evs: number[],
];

type CompactTeam = [version: 1, name: string, versionGroup: string, slots: CompactSlot[]];

function compactTeam(team: Team): CompactTeam {
  return [
    1,
    team.name,
    team.versionGroup,
    team.slots.map((s) => [
      s.pokemon,
      s.pokemonId,
      s.nickname,
      s.level,
      s.moves,
      s.item,
      s.ability,
      s.nature,
      STAT_ORDER.map((k) => s.evs[k] || 0),
    ]),
  ];
}

function expandTeam(c: CompactTeam): Team | null {
  if (!Array.isArray(c) || c[0] !== 1 || !Array.isArray(c[3])) return null;
  const slots = c[3].slice(0, TEAM_SIZE).map((s): TeamSlot => {
    const base = emptySlot();
    base.pokemon = typeof s[0] === 'string' ? s[0] : null;
    base.pokemonId = typeof s[1] === 'number' ? s[1] : null;
    base.nickname = typeof s[2] === 'string' ? s[2] : null;
    base.level = typeof s[3] === 'number' ? Math.min(MAX_LEVEL, Math.max(1, s[3])) : 50;
    const mv = Array.isArray(s[4]) ? s[4] : [];
    base.moves = [mv[0] ?? null, mv[1] ?? null, mv[2] ?? null, mv[3] ?? null];
    base.item = typeof s[5] === 'string' ? s[5] : null;
    base.ability = typeof s[6] === 'string' ? s[6] : null;
    base.nature = typeof s[7] === 'string' ? s[7] : null;
    const evArr = Array.isArray(s[8]) ? s[8] : [];
    base.evs = zeroEvs();
    STAT_ORDER.forEach((k, i) => {
      base.evs[k] = typeof evArr[i] === 'number' ? evArr[i] : 0;
    });
    return base;
  });
  while (slots.length < TEAM_SIZE) slots.push(emptySlot());
  return {
    id: slotId(),
    name: typeof c[1] === 'string' && c[1] ? c[1] : 'Shared Team',
    versionGroup: typeof c[2] === 'string' ? c[2] : DEFAULT_VERSION_GROUP,
    slots,
    updatedAt: Date.now(),
  };
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encodeTeamHash(team: Team): Promise<string> {
  const json = JSON.stringify(compactTeam(team));
  const bytes = new TextEncoder().encode(json);
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([bytes as unknown as BlobPart]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      const buf = await new Response(stream).arrayBuffer();
      return `z${b64urlEncode(new Uint8Array(buf))}`;
    } catch {
      /* fall through to raw */
    }
  }
  return `j${b64urlEncode(bytes)}`;
}

export async function decodeTeamHash(payload: string): Promise<Team | null> {
  try {
    const kind = payload[0];
    const body = payload.slice(1);
    let bytes = b64urlDecode(body);
    if (kind === 'z') {
      const stream = new Blob([bytes as unknown as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    } else if (kind !== 'j') {
      return null;
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as CompactTeam;
    return expandTeam(parsed);
  } catch {
    return null;
  }
}

export const TEAM_HASH_PREFIX = '#team=';

/** read & clear a `#team=…` hash (one-shot import on page load) */
export function consumeTeamHash(): string | null {
  if (typeof window === 'undefined') return null;
  const h = window.location.hash;
  if (!h.startsWith(TEAM_HASH_PREFIX)) return null;
  const payload = h.slice(TEAM_HASH_PREFIX.length);
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return payload || null;
}

/* ------------------------------------------------------------------ */
/* Nuzlocke import bridge                                              */
/* ------------------------------------------------------------------ */

export interface ImportableRun {
  id: string;
  name: string;
  game: string;
  mode: 'local' | 'online';
  status: string;
  /** resolved version-group id (null = unmapped game) */
  versionGroup: string | null;
}

/** list local + online runs (from the nuzlocke store index — read-only) */
export function listImportableRuns(): ImportableRun[] {
  const out: ImportableRun[] = [];
  for (const id of readRunIndex()) {
    const state = loadLocalRun(id);
    if (!state) continue;
    out.push({
      id,
      name: state.run.name,
      game: state.run.game,
      mode: state.mode === 'multi' ? 'online' : 'local',
      status: state.run.status,
      versionGroup: versionGroupForGame(state.run.game),
    });
  }
  return out;
}

export interface ImportedTeamMember {
  pokemonId: number;
  pokemon: string; // api slug
  nickname: string | null;
  level: number;
}

export interface ImportedRunTeam {
  runName: string;
  player: string;
  color: string;
  members: ImportedTeamMember[];
  versionGroup: string | null;
}

/** alive team per player (≤6) via the nuzlocke store; resolves slugs via PokéAPI */
export async function importRunTeams(runId: string): Promise<ImportedRunTeam[]> {
  const state = loadLocalRun(runId);
  const players = await getRunTeam(runId);
  const vg = versionGroupForGame(state?.run.game);
  const runName = state?.run.name ?? 'Nuzlocke Run';
  const out: ImportedRunTeam[] = [];
  for (const p of players) {
    const members: ImportedTeamMember[] = [];
    for (const m of p.members.slice(0, TEAM_SIZE)) {
      let slug = '';
      try {
        slug = (await getPokemon(m.pokemon_id)).name;
      } catch {
        slug = String(m.pokemon_id);
      }
      members.push({
        pokemonId: m.pokemon_id,
        pokemon: slug,
        nickname: m.nickname,
        level: Math.min(MAX_LEVEL, Math.max(1, m.level || 1)),
      });
    }
    out.push({ runName, player: p.player, color: p.color, members, versionGroup: vg });
  }
  return out;
}

/** Prefill slot 0 from a versus side and persist as draft (Versus → Team Builder). */
export function prefillTeamFromVersus(
  side: {
    pokemonId: number;
    slug: string;
    level: number;
    moves: (string | null)[];
    ability?: string | null;
    item?: string | null;
    nature?: string | null;
    evs?: Record<StatKey, number>;
  },
  versionGroup: string,
): Team {
  const team = emptyTeam();
  team.versionGroup = versionGroup;
  const slot = team.slots[0];
  slot.pokemonId = side.pokemonId;
  slot.pokemon = side.slug;
  slot.level = side.level;
  slot.moves = side.moves.slice(0, 4) as TeamSlot['moves'];
  slot.ability = side.ability ?? null;
  slot.item = side.item ?? null;
  slot.nature = side.nature ?? null;
  if (side.evs) slot.evs = side.evs;
  saveDraft(team);
  return team;
}

/** build fresh slots from an imported run team */
export function slotsFromImport(team: ImportedRunTeam): TeamSlot[] {
  const slots = emptyTeam().slots;
  team.members.forEach((m, i) => {
    if (i >= TEAM_SIZE) return;
    slots[i] = {
      ...slots[i],
      pokemon: m.pokemon,
      pokemonId: m.pokemonId,
      nickname: m.nickname,
      level: m.level,
    };
  });
  return slots;
}
