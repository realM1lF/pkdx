/* MyPokePanion — Showdown text format bridge (community standard #1)
 * Export/import of the de-facto team interchange format used by Pokémon
 * Showdown, PokéPaste and every calc (smogon/pokemon-showdown sim/TEAMS.md).
 *
 *   Nickname (Species) (M) @ Item
 *   Ability: Levitate
 *   Level: 50
 *   Shiny: Yes
 *   EVs: 4 HP / 252 Atk / 252 Spe
 *   Adamant Nature
 *   - Earthquake
 *
 * The data model stays English: species are resolved to PokéAPI slugs/ids,
 * moves are stored as PokéAPI slugs, items/abilities/natures as English
 * display names (same convention as the Smogon APPLY SET path).
 * Roundtrip-safe: export(parse(export(team))) === export(team).
 */
import i18n from '@/i18n';
import type { Lang } from './i18n-data';
import { cachedJson, displayName } from './pokeapi';
import { emptySlot, evTotal, MAX_LEVEL, TEAM_SIZE, zeroEvs } from './teambuilder';
import type { Team, TeamSlot } from './teambuilder';
import { STAT_ORDER } from './types';
import type { StatKey } from './types';

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

/** Showdown short stat labels in canonical spread order */
const EV_LABEL: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

function slotToShowdown(slot: TeamSlot): string {
  if (!slot.pokemon) return '';
  const species = displayName(slot.pokemon);
  const head = slot.nickname ? `${slot.nickname} (${species})` : species;
  const lines: string[] = [slot.item ? `${head} @ ${slot.item}` : head];
  if (slot.ability) lines.push(`Ability: ${slot.ability}`);
  /* always explicit (Showdown accepts Level: 100) — keeps export→import lossless */
  lines.push(`Level: ${slot.level}`);
  if (slot.shiny) lines.push('Shiny: Yes');
  if (evTotal(slot) > 0) {
    const parts = STAT_ORDER.filter((k) => (slot.evs[k] || 0) > 0).map(
      (k) => `${slot.evs[k]} ${EV_LABEL[k]}`,
    );
    if (parts.length) lines.push(`EVs: ${parts.join(' / ')}`);
  }
  if (slot.nature) lines.push(`${slot.nature} Nature`);
  for (const m of slot.moves) if (m) lines.push(`- ${displayName(m)}`);
  return lines.join('\n');
}

/** whole team → Showdown text (blank line between sets, trailing newline) */
export function teamToShowdown(team: Team): string {
  return (
    team.slots
      .map(slotToShowdown)
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
}

/* ------------------------------------------------------------------ */
/* Import                                                              */
/* ------------------------------------------------------------------ */

export interface ShowdownWarning {
  key: 'empty' | 'noSpecies' | 'tooMany';
  param?: string;
}

export interface ShowdownImport {
  /** always TEAM_SIZE entries — unparsed/extra blocks stay empty slots */
  slots: TeamSlot[];
  /** number of successfully parsed pokémon */
  count: number;
  warnings: ShowdownWarning[];
}

export function showdownWarningText(w: ShowdownWarning, lang: Lang): string {
  return i18n.t(`tb.sd.warn.${w.key}`, { lng: lang, name: w.param ?? '' }).toUpperCase();
}

/** 'Mr. Mime' / 'nidoran-f' / 'Flabébé' → 'mrmime' / 'nidoranf' / 'flabebe' */
function normalizeName(s: string): string {
  return s
    .replace(/♀/g, 'f')
    .replace(/♂/g, 'm')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** 'Swords Dance' → 'swords-dance' (PokéAPI move slug — same rule as TeamBuilder) */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EV_TOKEN: Record<string, StatKey> = {
  hp: 'hp',
  atk: 'attack',
  def: 'defense',
  spa: 'special-attack',
  spd: 'special-defense',
  spe: 'speed',
};

/** '252 Atk / 4 SpD / 252 Spe' → ev record (clamped, multiples of 4) */
function parseEvs(text: string): Record<StatKey, number> {
  const evs = zeroEvs();
  for (const part of text.split('/')) {
    const m = part.trim().match(/^(\d{1,3})\s+([A-Za-z]{2,3})$/);
    if (!m) continue;
    const key = EV_TOKEN[m[2].toLowerCase()];
    if (!key) continue;
    evs[key] = Math.max(0, Math.min(252, Number(m[1])));
  }
  return evs;
}

interface RawSet {
  nickname: string | null;
  species: string;
  item: string | null;
  ability: string | null;
  level: number | null;
  shiny: boolean;
  evs: Record<StatKey, number> | null;
  nature: string | null;
  moves: string[];
}

/** 'Nick (Species) (M) @ Leftovers' → parts (gender is parsed & dropped — not modeled) */
function parseHeader(line: string): { nickname: string | null; species: string; item: string | null } {
  let rest = line.trim();
  let item: string | null = null;
  const at = rest.indexOf(' @ ');
  if (at >= 0) {
    item = rest.slice(at + 3).trim() || null;
    rest = rest.slice(0, at).trim();
  }
  rest = rest.replace(/\s+\((?:M|F)\)$/i, '');
  const m = rest.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (m) return { nickname: m[1].trim() || null, species: m[2].trim(), item };
  return { nickname: null, species: rest, item };
}

function parseBlock(lines: string[]): RawSet | null {
  const head = parseHeader(lines[0]);
  if (!head.species) return null;
  const set: RawSet = { ...head, ability: null, level: null, shiny: false, evs: null, nature: null, moves: [] };
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('- ')) {
      if (set.moves.length < 4) set.moves.push(line.slice(2).trim());
      continue;
    }
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.slice(0, colon).trim().toLowerCase();
      const value = line.slice(colon + 1).trim();
      switch (key) {
        case 'ability':
          set.ability = value || null;
          break;
        case 'level': {
          const n = Number(value);
          if (Number.isFinite(n)) set.level = Math.max(1, Math.min(MAX_LEVEL, Math.round(n)));
          break;
        }
        case 'shiny':
          set.shiny = /^y(es)?/i.test(value) || value === '1' || /^true/i.test(value);
          break;
        case 'evs':
          set.evs = parseEvs(value);
          break;
        /* recognized but not modeled (IV editor comes later; tera/dmax are Showdown-only) */
        case 'ivs':
        case 'tera type':
        case 'happiness':
        case 'dynamax level':
        case 'gigantamax':
        case 'hidden power':
          break;
        default:
          break;
      }
      continue;
    }
    const nature = line.match(/^([A-Za-z]+)\s+Nature$/i);
    if (nature) set.nature = nature[1];
  }
  return set;
}

type SpeciesIndex = Map<string, { id: number; slug: string }>;

interface NameIndexResponse {
  results: Array<{ name: string; url: string }>;
}

/** Showdown's plain species name → the PokéAPI slug of its DEFAULT form
 * (PokéAPI names default forms explicitly: 'deoxys-normal', 'giratina-altered'…).
 * Applied only when the target slug actually exists in the index. */
const DEFAULT_FORM_ALIAS: Record<string, string> = {
  deoxys: 'deoxys-normal',
  wormadam: 'wormadam-plant',
  giratina: 'giratina-altered',
  shaymin: 'shaymin-land',
  basculin: 'basculin-red-striped',
  darmanitan: 'darmanitan-standard',
  tornadus: 'tornadus-incarnate',
  thundurus: 'thundurus-incarnate',
  landorus: 'landorus-incarnate',
  enamorus: 'enamorus-incarnate',
  keldeo: 'keldeo-ordinary',
  meloetta: 'meloetta-aria',
  meowstic: 'meowstic-male',
  indeedee: 'indeedee-male',
  basculegion: 'basculegion-male',
  oinkologne: 'oinkologne-male',
  maushold: 'maushold-family-of-four',
  squawkabilly: 'squawkabilly-green-plumage',
  palafin: 'palafin-zero',
  tatsugiri: 'tatsugiri-curly',
  dudunsparce: 'dudunsparce-two-segment',
  urshifu: 'urshifu-single-strike',
  toxtricity: 'toxtricity-amped',
  eiscue: 'eiscue-ice',
  morpeko: 'morpeko-full-belly',
  gimmighoul: 'gimmighoul-chest',
};

/**
 * Full species index — includes alternate forms (rotom-wash, urshifu-rapid-strike…),
 * which live above the national-dex id range and are NOT part of bootNameIndex.
 * Cached via the shared PokéAPI SWR cache.
 */
async function speciesIndex(): Promise<SpeciesIndex> {
  const res = await cachedJson<NameIndexResponse>('name-index-all', 'https://pokeapi.co/api/v2/pokemon?limit=2000');
  const map: SpeciesIndex = new Map();
  for (const r of res.results) {
    const id = Number(r.url.replace(/\/$/, '').split('/').pop());
    if (!Number.isFinite(id) || id < 1) continue;
    const rec = { id, slug: r.name };
    const bySlug = normalizeName(r.name);
    const byLabel = normalizeName(displayName(r.name));
    if (!map.has(bySlug)) map.set(bySlug, rec);
    if (!map.has(byLabel)) map.set(byLabel, rec);
  }
  for (const [alias, slug] of Object.entries(DEFAULT_FORM_ALIAS)) {
    const target = map.get(normalizeName(slug));
    if (target && !map.has(alias)) map.set(alias, target);
  }
  return map;
}

/**
 * Parse Showdown text into 6 slots. Species resolve against the PokéAPI
 * name index (async boot cache); unknown species produce a warning and an
 * empty slot. Supports Showdown folder dumps ('=== [format] name ==='
 * header lines are skipped — only the first team of a dump is imported).
 */
export async function parseShowdownTeam(text: string): Promise<ShowdownImport> {
  const warnings: ShowdownWarning[] = [];
  const clean = text
    .split('\n')
    .filter((l) => !/^\s*===.*===\s*$/.test(l))
    .join('\n');
  const blocks = clean
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return { slots: Array.from({ length: TEAM_SIZE }, emptySlot), count: 0, warnings: [{ key: 'empty' }] };
  }

  const index = await speciesIndex();
  const resolved: TeamSlot[] = [];

  for (const block of blocks) {
    const set = parseBlock(block.split('\n'));
    if (!set) continue;
    const hit = index.get(normalizeName(set.species));
    if (!hit) {
      warnings.push({ key: 'noSpecies', param: set.species });
      continue;
    }
    const slot = emptySlot();
    slot.pokemon = hit.slug;
    slot.pokemonId = hit.id;
    slot.nickname = set.nickname;
    slot.level = set.level ?? 50;
    slot.shiny = set.shiny;
    slot.item = set.item;
    slot.ability = set.ability;
    slot.nature = set.nature;
    if (set.evs) slot.evs = set.evs;
    set.moves.forEach((m, i) => {
      if (i < 4) slot.moves[i] = slugify(m);
    });
    resolved.push(slot);
  }

  if (resolved.length > TEAM_SIZE) warnings.push({ key: 'tooMany', param: String(resolved.length) });
  if (resolved.length === 0 && !warnings.length) warnings.push({ key: 'empty' });

  const count = Math.min(resolved.length, TEAM_SIZE);
  const slots = resolved.slice(0, TEAM_SIZE);

  while (slots.length < TEAM_SIZE) slots.push(emptySlot());
  return { slots, count, warnings };
}
