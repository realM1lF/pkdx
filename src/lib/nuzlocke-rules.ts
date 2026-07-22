/* Nuzlocke rule helpers — validation, run export (player-ux-audit §Nuzlocke). */
import { routeOrder } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import type { MapNode, RegionId } from '@/lib/regions';
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
  };
}

/** A row consumes the (run, player, route) slot only when it is a real
 * resolution of the first encounter: `duped` rows just document a skipped
 * dupe (route stays open for the re-roll) and shiny rows are clause-free.
 * Mirrors the partial unique index `nuz_encounters_route_slot_uidx`. */
export function isSlotConsuming(e: Pick<NuzEncounterRow, 'status' | 'is_shiny'>): boolean {
  return e.status !== 'duped' && !e.is_shiny;
}

export function speciesAlive(state: RunState, playerId: string, pokemonId: number): boolean {
  return state.encounters.some(
    (e) => e.player_id === playerId && e.pokemon_id === pokemonId && e.status === 'caught',
  );
}

export function isGiftNode(node: MapNode | undefined): boolean {
  return node?.kind === 'special';
}

export function validateLogDraft(
  state: RunState,
  draft: LogDraft,
  node?: MapNode,
): LogValidationError | null {
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

    if (rules.dupes && !shinyBypass && speciesAlive(state, draft.playerId, draft.pokemonId)) {
      return 'speciesDupe';
    }

    if (isGiftNode(node) && draft.offRoute) return 'giftRoute';
  }

  return null;
}

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

/** Ace level of the next unbeaten gym leader, derived from run progress:
 * the cheapest ace among gyms whose map node lies beyond the furthest
 * resolved route. Returns null when every gym is behind the crew. */
export function nextGymCap(state: RunState): number | null {
  const region = anyRegionById(state.run.region);
  if (!region) return null;
  const gyms = GYM_ACE[region.region];
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

/** Effective level cap: auto (next gym) wins over the manual value; null = off. */
export function effectiveLevelCap(state: RunState): number | null {
  const rules = state.run.rules;
  if (rules.autoLevelCap) return nextGymCap(state);
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
