/* Nuzlocke rule helpers — validation, run export (player-ux-audit §Nuzlocke). */
import { fetchEvolutionFamilyIds } from '@/lib/nuzlocke-evolution';
import { routeOrder } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import type { MapNode, RegionId, RegionMap } from '@/lib/regions';
import type { LogDraft, NuzEncounterRow, NuzRules, RunState } from '@/lib/nuzlocke-store';

export type LogValidationError =
  | 'duplicate'
  | 'speciesDupe'
  | 'nicknameRequired'
  | 'giftRoute';

export function normalizeRules(partial?: Partial<NuzRules>): NuzRules {
  return {
    dupes: partial?.dupes ?? true,
    shiny: partial?.shiny ?? true,
    nicknames: partial?.nicknames ?? true,
    soulLink: partial?.soulLink ?? false,
    soulLinkCascade: partial?.soulLinkCascade ?? true,
    releaseOnDeath: partial?.releaseOnDeath ?? true,
    levelCap: typeof partial?.levelCap === 'number' ? partial.levelCap : null,
    autoLevelCap: partial?.autoLevelCap ?? false,
    badgesCleared: Math.max(0, Math.min(8, Math.round(partial?.badgesCleared ?? 0))),
    randomizer: partial?.randomizer ?? false,
  };
}

/** A row consumes the (run, player, route) slot only when it is a real
 * resolution of the first encounter: `duped` rows just document a skipped
 * dupe (route stays open for the re-roll) and shiny rows are clause-free.
 * Mirrors partial unique `nuz_encounters_route_slot_uidx`
 * (`status IS DISTINCT FROM 'duped'` — null/undefined counts as consuming). */
export function isSlotConsuming(e: Pick<NuzEncounterRow, 'status' | 'is_shiny'>): boolean {
  return e.status !== 'duped' && !e.is_shiny;
}

/** Exact species still alive for one player (legacy helper / tests). */
export function speciesAlive(state: RunState, playerId: string, pokemonId: number): boolean {
  return state.encounters.some(
    (e) => e.player_id === playerId && e.pokemon_id === pokemonId && e.status === 'caught',
  );
}

/**
 * Dupes Clause (species / evo-line): any *living* catch in the run whose
 * current or caught form shares the candidate's evolution family blocks the
 * catch — including other players (Schiggy on P1 → no Schillok/Turtok for P2).
 * Dead / missed / lost / duped rows free the line again.
 */
export function evoLineAliveInRun(state: RunState, familyIds: number[]): boolean {
  if (familyIds.length === 0) return false;
  const family = new Set(familyIds);
  return state.encounters.some((e) => {
    if (e.status !== 'caught') return false;
    if (family.has(e.pokemon_id)) return true;
    const caught = e.caught_pokemon_id;
    return typeof caught === 'number' && family.has(caught);
  });
}

/** Map `kind: 'special'` — informational only (Power Plant, Tower, …).
 * Not a reliable gift/static/trade taxonomy; do not hard-block catches on it. */
export function isSpecialNode(node: MapNode | undefined): boolean {
  return node?.kind === 'special';
}

/** @deprecated alias — prefer `isSpecialNode` */
export function isGiftNode(node: MapNode | undefined): boolean {
  return isSpecialNode(node);
}

export async function validateLogDraft(
  state: RunState,
  draft: LogDraft,
  _node?: MapNode,
): Promise<LogValidationError | null> {
  const rules = state.run.rules;
  /* shiny clause: shinies are always catchable — they bypass the route lock
   * AND the dupes clause (Bulbapedia). Requires the shiny rule to be on. */
  const shinyBypass = rules.shiny && !!draft.isShiny;

  const slotTaken = state.encounters.some(
    (e) => e.player_id === draft.playerId && e.route_key === draft.routeKey && isSlotConsuming(e),
  );

  if (draft.status === 'duped') {
    /* a dupe may only be skipped while the route is still unresolved */
    if (slotTaken) return 'duplicate';
    return null;
  }

  if (slotTaken && !shinyBypass) return 'duplicate';

  if (draft.status === 'caught') {
    if (rules.nicknames && !draft.nickname?.trim()) return 'nicknameRequired';

    if (rules.dupes && !shinyBypass) {
      const family = await fetchEvolutionFamilyIds(draft.pokemonId);
      if (evoLineAliveInRun(state, family)) return 'speciesDupe';
    }
  }

  return null;
}

/* ---------- rule presets (§B1) ----------
 * Preset buttons only ever toggle switches that already exist in `NuzRules`
 * — no invented item-ban / randomizer-tier fields. Applying a preset merges
 * over the current rules (owner-editable, same as any other rule toggle). */
export type RulePresetKey = 'classic' | 'hardcoreLite' | 'soulLink';

const PRESET_CLASSIC: Partial<NuzRules> = {
  dupes: true,
  shiny: true,
  nicknames: true,
  releaseOnDeath: true,
  soulLink: false,
  soulLinkCascade: true,
  autoLevelCap: false,
};

export const RULE_PRESETS: Record<RulePresetKey, Partial<NuzRules>> = {
  classic: PRESET_CLASSIC,
  hardcoreLite: { ...PRESET_CLASSIC, autoLevelCap: true, badgesCleared: 0 },
  soulLink: { ...PRESET_CLASSIC, soulLink: true, soulLinkCascade: true },
};

/* ---------- level cap ---------- */

/** Gym-leader ace levels per map node (mirror of the `Leader` entries in
 * src/data/enriched/*.json — kept inline so the run chunk stays lean). */
const GYM_ACE: Record<RegionId, Record<string, number>> = {
  kanto: {
    'pewter-city': 14, // Brock
    'cerulean-city': 21, // Misty
    'vermilion-city': 24, // Lt. Surge
    'celadon-city': 29, // Erika
    'fuchsia-city': 43, // Koga
    'saffron-city': 43, // Sabrina
    'cinnabar-island': 47, // Blaine
    'viridian-city': 50, // Giovanni
  },
  johto: {
    'violet-city': 13, // Falkner
    'azalea-town': 16, // Bugsy
    'goldenrod-city': 18, // Whitney
    'ecruteak-city': 25, // Morty
    'cianwood-city': 30, // Chuck
    'mahogany-town': 34, // Pryce
    'olivine-city': 35, // Jasmine
    'blackthorn-city': 40, // Clair
  },
  hoenn: {
    'rustboro-city': 15, // Roxanne
    'dewford-town': 19, // Brawly
    'mauville-city': 23, // Wattson
    'lavaridge-town': 26, // Flannery
    'petalburg-city': 31, // Norman
    'fortree-city': 33, // Winona
    'mossdeep-city': 41, // Tate & Liza
    'sootopolis-city': 46, // Wallace
  },
  sinnoh: {
    'oreburgh-city': 14, // Roark
    'eterna-city': 22, // Gardenia
    'veilstone-city': 22, // Maylene
    'pastoria-city': 30, // Crasher Wake
    'hearthome-city': 30, // Fantina
    'canalave-city': 41, // Byron
    'snowpoint-city': 44, // Candice
    'sunyshore-city': 50, // Volkner
  },
  unova: {
    'striaton-city': 14, // Cilan/Chili/Cress
    'nacrene-city': 20, // Lenora
    'castelia-city': 23, // Burgh
    'nimbasa-city': 27, // Elesa
    'driftveil-city': 31, // Clay
    'mistralton-city': 31, // Skyla
    'icirrus-city': 35, // Brycen
    'humilau-city': 40, // Drayden
  },
};

/** Explicit badge-conquest order (not map visit order, not ace-level sort).
 * Sinnoh follows Platinum (Fantina before Maylene). Johto: Jasmine before Pryce.
 * Ace levels in `GYM_ACE` are still approximate per mainline version — owners
 * can override with a manual cap when a rom/version differs. */
const GYM_BADGE_ORDER: Record<RegionId, readonly string[]> = {
  kanto: [
    'pewter-city',
    'cerulean-city',
    'vermilion-city',
    'celadon-city',
    'fuchsia-city',
    'saffron-city',
    'cinnabar-island',
    'viridian-city',
  ],
  johto: [
    'violet-city',
    'azalea-town',
    'goldenrod-city',
    'ecruteak-city',
    'cianwood-city',
    'olivine-city',
    'mahogany-town',
    'blackthorn-city',
  ],
  hoenn: [
    'rustboro-city',
    'dewford-town',
    'mauville-city',
    'lavaridge-town',
    'petalburg-city',
    'fortree-city',
    'mossdeep-city',
    'sootopolis-city',
  ],
  sinnoh: [
    'oreburgh-city',
    'eterna-city',
    'hearthome-city',
    'veilstone-city',
    'pastoria-city',
    'canalave-city',
    'snowpoint-city',
    'sunyshore-city',
  ],
  unova: [
    'striaton-city',
    'nacrene-city',
    'castelia-city',
    'nimbasa-city',
    'driftveil-city',
    'mistralton-city',
    'icirrus-city',
    'humilau-city',
  ],
};

function orderedGyms(region: RegionMap): { nodeId: string; ace: number }[] {
  const gyms = GYM_ACE[region.region];
  const order = GYM_BADGE_ORDER[region.region];
  if (!gyms || !order) return [];
  const out: { nodeId: string; ace: number }[] = [];
  for (const nodeId of order) {
    const ace = gyms[nodeId];
    if (typeof ace === 'number') out.push({ nodeId, ace });
  }
  return out;
}

export interface NextGymInfo {
  /** ace level of the next unbeaten gym — the level cap while it applies */
  cap: number;
  gymNodeId: string;
  badgesCleared: number;
  badgesTotal: number;
}

function gymInfoFor(region: RegionMap, badgesCleared: number): NextGymInfo | null {
  const gyms = orderedGyms(region);
  if (gyms.length === 0) return null;
  const badgesTotal = gyms.length;
  const cleared = Math.max(0, Math.min(badgesTotal, badgesCleared));
  const next = gyms[cleared];
  /* every gym cleared → postgame, honestly uncapped rather than guessing */
  if (!next) return null;
  return { cap: next.ace, gymNodeId: next.nodeId, badgesCleared: cleared, badgesTotal };
}

/** Badge-driven auto cap (A3, primary source): the next gym past
 * `rules.badgesCleared`, plus display context (node id, progress) for the
 * rules bar / editor. More honest for hardcore play than guessing progress
 * from route history — the owner explicitly advances badges as gyms fall.
 * Returns null when the region has no mapped gym ladder (freeform regions)
 * or every gym is already cleared. */
export function nextGymInfo(state: RunState): NextGymInfo | null {
  const region = anyRegionById(state.run.region);
  if (!region) return null;
  return gymInfoFor(region, state.run.rules.badgesCleared);
}

/** Same lookup, usable before a run exists yet (New Run wizard preview). */
export function gymCapPreview(regionId: string, badgesCleared: number): NextGymInfo | null {
  const region = anyRegionById(regionId);
  if (!region) return null;
  return gymInfoFor(region, badgesCleared);
}

/** Fallback-only heuristic for regions without a mapped gym ladder: the
 * cheapest ace among gyms whose map node lies beyond the furthest resolved
 * route. Kept for freeform/legacy cases where `nextGymInfo` has nothing to
 * go on — `effectiveLevelCap` prefers the badge-driven cap whenever the
 * region's ladder is known. Returns null when every gym is behind the crew. */
export function nextGymCap(state: RunState): number | null {
  const region = anyRegionById(state.run.region);
  if (!region) return null;
  const gyms = GYM_ACE[region.region];
  if (!gyms) return null;
  const order = routeOrder(region);
  const orderIdx = new Map(order.map((n, i) => [n.id, i]));
  let progress = -1;
  for (const e of state.encounters) {
    if (!isSlotConsuming(e)) continue;
    const i = orderIdx.get(e.route_key);
    if (i !== undefined && i > progress) progress = i;
  }
  let cap: number | null = null;
  for (const [nodeId, ace] of Object.entries(gyms)) {
    const i = orderIdx.get(nodeId);
    if (i === undefined || i <= progress) continue;
    if (cap === null || ace < cap) cap = ace;
  }
  return cap;
}

/** Effective level cap: auto mode prefers the badge-driven next-gym cap
 * (§A3) and only falls back to the route-progress heuristic when the
 * region has no mapped gym ladder at all; null = off (or postgame, once
 * badges run out). Manual value applies when auto is off. */
export function effectiveLevelCap(state: RunState): number | null {
  const rules = state.run.rules;
  if (rules.autoLevelCap) {
    const region = anyRegionById(state.run.region);
    const hasLadder = !!region && orderedGyms(region).length > 0;
    return hasLadder ? (nextGymInfo(state)?.cap ?? null) : nextGymCap(state);
  }
  return typeof rules.levelCap === 'number' ? rules.levelCap : null;
}

export interface RunSummaryOptions {
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
  regionLabel: string;
  gameLabel: string;
}

/** Plain-text run summary for clipboard export. */
export function formatRunSummary(state: RunState, opts: RunSummaryOptions): string {
  const { run, players, encounters } = state;
  const lines: string[] = [
    `# ${run.name}`,
    `${opts.regionLabel} · ${opts.gameLabel} · ${run.status.toUpperCase()}`,
    `Rules: dupes ${run.rules.dupes ? 'ON' : 'OFF'} · shiny ${run.rules.shiny ? 'ON' : 'OFF'} · nicknames ${run.rules.nicknames ? 'ON' : 'OFF'}`,
    '',
  ];

  for (const p of [...players].sort((a, b) => a.slot - b.slot)) {
    lines.push(`## ${p.name}`);
    const mine = encounters.filter((e) => e.player_id === p.id);
    const alive = mine.filter((e) => e.status === 'caught');
    const dead = mine.filter((e) => e.status === 'dead');
    if (alive.length) {
      lines.push('Team:');
      alive.forEach((e) => {
        lines.push(`  • Lv.${e.level} ${opts.nameOf(e.pokemon_id)}${e.nickname ? ` (“${e.nickname}”)` : ''} @ ${opts.routeLabel(e.route_key)}`);
      });
    }
    if (dead.length) {
      lines.push('Graveyard:');
      dead.forEach((e) => {
        lines.push(`  ✕ Lv.${e.level} ${opts.nameOf(e.pokemon_id)}${e.nickname ? ` (“${e.nickname}”)` : ''} @ ${opts.routeLabel(e.route_key)}`);
      });
    }
    if (!alive.length && !dead.length) lines.push('  (no encounters yet)');
    lines.push('');
  }

  return lines.join('\n').trim();
}
