/* Detail-page data helpers — type matchups, version groups, species extras.
 * Page-local only (density-addendum §5); shared lib files are untouched. */
import { cachedJson, displayName } from '@/lib/pokeapi';
import i18n from '@/i18n';
import { nameOfItem, nameOfLocation, nameOfMove, nameOfPokemon, nameOfType, type Lang } from '@/lib/i18n-data';
import type { EvolutionDetail, NamedAPIResource, PokemonSpecies, PokemonType } from '@/lib/types';
import { TYPE_COLORS } from '@/lib/types';
import { genHasMechanics } from '@/lib/gen-dex';
import { genSplitMatchupsForSide } from '@/lib/versus';
import { sameVersionGroup } from '@/lib/move-pool';
import { VERSION_GROUPS as CANONICAL_VERSION_GROUPS, versionGroupById, versionGroupForGame } from '@/lib/version-groups';

/* ---------- species payload extras (present at runtime, absent from shared type) ---------- */

export interface SpeciesExtras {
  capture_rate?: number;
  base_happiness?: number;
  hatch_counter?: number;
  gender_rate?: number; // -1 = genderless, else eighths female
  growth_rate?: NamedAPIResource;
  egg_groups?: NamedAPIResource[];
}

export function speciesExtras(s: PokemonSpecies | null): SpeciesExtras {
  return (s ?? {}) as PokemonSpecies & SpeciesExtras;
}

/* ---------- ability details (lazy one-line descriptions) ---------- */

export interface AbilityPayload {
  name: string;
  effect_entries: Array<{ short_effect: string; language: NamedAPIResource }>;
  flavor_text_entries?: Array<{ flavor_text: string; language: NamedAPIResource }>;
}

export interface AbilityShort {
  text: string;
  enFallback: boolean;
}

function flattenFlavor(text: string): string {
  return text.replace(/[\f\n\r]+/g, ' ');
}

export function pickAbilityShort(a: AbilityPayload, lang: Lang): AbilityShort {
  if (lang === 'de') {
    const fl = a.flavor_text_entries?.filter((f) => f.language.name === 'de').pop();
    if (fl) return { text: flattenFlavor(fl.flavor_text), enFallback: false };
  }
  const en = a.effect_entries.find((e) => e.language.name === 'en');
  const fl = a.flavor_text_entries?.filter((f) => f.language.name === 'en').pop();
  const text = en?.short_effect ?? (fl ? flattenFlavor(fl.flavor_text) : '');
  return { text, enFallback: lang === 'de' && Boolean(text) };
}

export function getAbilityShort(name: string, lang: Lang = 'en'): Promise<AbilityShort> {
  return cachedJson<AbilityPayload>(`ability:${name}`, `https://pokeapi.co/api/v2/ability/${name}`).then((a) =>
    pickAbilityShort(a, lang),
  );
}

/* ---------- version groups (move pool picker, newest → oldest) ---------- */

export interface VersionGroup {
  key: string;
  label: string;
}

/** Newest → oldest. Same ids as `version-groups.ts` so BDSP / LA / LGPE / Colo / XD stay selectable. */
export const VERSION_GROUPS: VersionGroup[] = [...CANONICAL_VERSION_GROUPS]
  .reverse()
  .map((g) => ({ key: g.id, label: g.label }));

/* ---------- defensive matchups (gen-correct via Versus / @pkmn/data) ---------- */

export interface Matchups {
  weak: string[]; // ×2 (but less than ×4)
  quad: string[]; // ×4 double weakness (dual types multiply)
  resist: string[]; // ×0.5 (but better than ×0.25)
  quarter: string[]; // ×0.25 double resist
  immune: string[]; // ×0
  extra: Array<{ mult: number; types: string[] }>;
}

/** @pkmn generation for a move-pool version-group slug. Missing/unknown → 9. */
export function genOfVersionGroup(vg?: string | null): number {
  if (!vg) return 9;
  return versionGroupById(vg).gen;
}

/** App edition ids present in a PokéAPI move payload (Let's Go aliases match). */
export function presentEditionIds(apiNames: Iterable<string>): Set<string> {
  const names = [...apiNames];
  const present = new Set<string>();
  for (const g of VERSION_GROUPS) {
    if (names.some((n) => n === g.key || sameVersionGroup(n, g.key))) present.add(g.key);
  }
  return present;
}

function collectApiVgNames(
  moves: Array<{ version_group_details: Array<{ version_group: { name: string } }> }>,
): string[] {
  const names: string[] = [];
  for (const m of moves) for (const d of m.version_group_details) names.push(d.version_group.name);
  return names;
}

/** Newest move-pool version group that teaches this Pokémon anything (VERSION_GROUPS order). */
export function newestMoveVersionGroup(
  moves: Array<{ version_group_details: Array<{ version_group: { name: string } }> }>,
): string | undefined {
  const present = presentEditionIds(collectApiVgNames(moves));
  return VERSION_GROUPS.find((g) => present.has(g.key))?.key;
}

/** Prefer `?game=` edition when that group teaches this Pokémon. */
export function editionFromGameParam(
  game: string | null | undefined,
  available: readonly string[],
  fallback: string,
): string {
  const vg = versionGroupForGame(game);
  if (vg && available.includes(vg)) return vg;
  return fallback;
}

function normFlavorKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Flavor chips use `displayName(version)`; edition games are slugs. */
export function flavorMatchesGames(versionLabel: string, games: readonly string[]): boolean {
  if (!games.length) return true;
  const n = normFlavorKey(versionLabel);
  return games.some((g) => n === normFlavorKey(g) || n === normFlavorKey(displayName(g)));
}

/** Keep a selected VG if it still teaches moves, otherwise the newest available. */
export function resolveMoveVersionGroup(
  moves: Array<{ version_group_details: Array<{ version_group: { name: string } }> }>,
  selected?: string,
): string {
  const newest = newestMoveVersionGroup(moves) ?? '';
  if (!selected) return newest;
  const present = presentEditionIds(collectApiVgNames(moves));
  return present.has(selected) ? selected : newest;
}

/** Same buckets as `genSplitMatchupsForSide` (×4 / ×¼ rows kept). */
export function computeMatchups(defending: string[], gen = 9, ability?: string | null): Matchups {
  return genSplitMatchupsForSide(defending, gen, ability);
}

/** Versus default: first non-hidden ability, never in editions without abilities. */
export function defaultMatchupAbility(
  abilities: Array<{ slug: string; hidden?: boolean }>,
  vgId: string | null | undefined,
): string | null {
  if (!vgId || !genHasMechanics(vgId).abilities) return null;
  return abilities.find((a) => !a.hidden)?.slug ?? null;
}

function matchupSignature(types: string[], gen: number, ability?: string | null): string {
  return JSON.stringify(computeMatchups(types, gen, ability));
}

/** Distinct defensive tables among `abilities`. Empty → no switcher (all no-op, or a single table). */
export function matchupAbilityOptions(
  abilities: Array<{ slug: string; hidden?: boolean }>,
  types: string[],
  gen: number,
  vgId?: string | null,
): string[] {
  if (gen < 3) return [];
  if (vgId && !genHasMechanics(vgId).abilities) return [];
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const a of abilities) {
    const sig = matchupSignature(types, gen, a.slug);
    if (seen.has(sig)) continue;
    seen.add(sig);
    slugs.push(a.slug);
  }
  return slugs.length >= 2 ? slugs : [];
}

/** Keep a valid switcher pick; otherwise the edition default (incl. no-switcher). */
export function clampMatchupAbility(
  selected: string | null | undefined,
  options: readonly string[],
  fallback: string | null,
): string | null {
  if (options.length < 2) return fallback;
  if (selected && options.includes(selected)) return selected;
  return fallback;
}

/* ---------- evolution condition formatting ---------- */

const ITEMS_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

export interface EvoCondition {
  /** short chip label, e.g. "LV 16" */
  label: string;
  /** optional item sprite url */
  itemIcon?: string;
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/** Condense PokéAPI evolution_details into one compact chip (first alternative).
 * Labels are localized (item/type names via the de artifact, connective words
 * via detail.evo.* keys); slugs in the data model stay English. */
export function evoCondition(details: EvolutionDetail[], lang: Lang = 'en'): EvoCondition {
  const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, { lng: lang, ...opts });
  if (!details.length) return { label: '—' };
  const d = details[0];
  const parts: string[] = [];
  let itemIcon: string | undefined;

  if (d.item) {
    parts.push(nameOfItem(d.item.name, lang));
    itemIcon = `${ITEMS_BASE}/${d.item.name}.png`;
  }
  if (d.trigger.name === 'trade') parts.push(t('detail.evo.trade'));
  if (d.trigger.name === 'use-item' && !d.item) parts.push(t('detail.evo.useItem'));
  if (d.min_happiness != null && d.trigger.name !== 'trade') parts.push(t('detail.evo.friendship'));
  if (d.min_affection != null) parts.push(t('detail.evo.affection'));
  if (d.known_move_type)
    parts.push(t('detail.evo.typedMove', { type: nameOfType(d.known_move_type.name, lang) }));
  if (d.min_level != null) parts.push(t('detail.evo.level', { level: d.min_level }));
  if (d.time_of_day) parts.push(t(`detail.evo.${d.time_of_day === 'night' ? 'night' : 'day'}`));
  if (d.trigger.name === 'shed') parts.push(t('detail.evo.shed'));
  /* EP4.2 — remaining condition dimensions */
  if (d.held_item) {
    parts.push(t('detail.evo.heldItem', { item: nameOfItem(d.held_item.name, lang) }));
    if (!itemIcon) itemIcon = `${ITEMS_BASE}/${d.held_item.name}.png`;
  }
  if (d.known_move) parts.push(t('detail.evo.knownMove', { move: nameOfMove(d.known_move.name, lang) }));
  if (d.min_beauty != null) parts.push(t('detail.evo.beauty'));
  if (d.location) parts.push(t('detail.evo.location', { location: nameOfLocation(d.location.name, lang) }));
  if (d.gender != null) parts.push(t(d.gender === 1 ? 'detail.evo.female' : 'detail.evo.male'));
  if (d.needs_overworld_rain) parts.push(t('detail.evo.rain'));
  if (d.party_species) parts.push(t('detail.evo.partySpecies', { name: nameOfPokemon(d.party_species.name, lang) }));
  if (d.party_type) parts.push(t('detail.evo.partyType', { type: nameOfType(d.party_type.name, lang) }));
  if (d.relative_physical_stats != null && d.relative_physical_stats !== 0)
    parts.push(t(d.relative_physical_stats > 0 ? 'detail.evo.atkGtDef' : 'detail.evo.atkLtDef'));
  if (d.trade_species) parts.push(t('detail.evo.tradeSpecies', { name: nameOfPokemon(d.trade_species.name, lang) }));
  if (d.turn_upside_down) parts.push(t('detail.evo.upsideDown'));
  // rare triggers (spin, tower-of-darkness, …) fall back to the English slug label
  if (!parts.length) parts.push(titleCase(d.trigger.name));
  return { label: parts.join(' · '), itemIcon };
}

/* ---------- misc ---------- */

export function typeRgb(type: string): string {
  return TYPE_COLORS[type as PokemonType]?.rgb ?? '169,176,181';
}

/* locale-aware decimal (de: "0,7 m" · en: "0.7 m") */
const NF1 = {
  en: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  de: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
};

const NF01 = {
  en: new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }),
  de: new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }),
};

export function formatHeight(dm: number, lang: Lang = 'en'): string {
  return `${NF1[lang].format(dm / 10)} m`;
}

export function formatWeight(hg: number, lang: Lang = 'en'): string {
  return `${NF1[lang].format(hg / 10)} kg`;
}

export function genderLabel(rate: number | undefined, lang: Lang = 'en'): string {
  if (rate == null) return '—';
  if (rate < 0) return i18n.t('detail.side.genderless', { lng: lang });
  const female = (rate / 8) * 100;
  const pct = (v: number) => `${NF01[lang].format(v)} %`;
  return `${pct(100 - female)} ♂ · ${pct(female)} ♀`;
}
