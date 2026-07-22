/* Nuzlocke rule helpers — validation, run export (player-ux-audit §Nuzlocke). */
import type { MapNode } from '@/lib/regions';
import type { LogDraft, NuzRules, RunState } from '@/lib/nuzlocke-store';

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
    releaseOnDeath: partial?.releaseOnDeath ?? true,
  };
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
  if (state.encounters.some((e) => e.player_id === draft.playerId && e.route_key === draft.routeKey)) {
    return 'duplicate';
  }

  const rules = state.run.rules;

  if (draft.status === 'caught') {
    if (rules.nicknames && !draft.nickname?.trim()) return 'nicknameRequired';

    const shinyBypass = rules.shiny && draft.isShiny;
    if (rules.dupes && !shinyBypass && speciesAlive(state, draft.playerId, draft.pokemonId)) {
      return 'speciesDupe';
    }

    if (isGiftNode(node) && draft.offRoute) return 'giftRoute';
  }

  return null;
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
