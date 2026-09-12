/**
 * Domain contract — GPT-Live nuzlocke_run_status wrapper.
 *
 * Read-only run snapshot: formatRunSummary, kpisOf, partyOf, effectiveLevelCap,
 * nextGymInfo. Requires a browser-supplied RunState on each tool call.
 *
 * Must-not: writes, invented rule logic, or paraphrased Dupes/SoulLink rules.
 */
import {
  effectiveLevelCap,
  formatRunSummary,
  nextGymInfo,
} from '@/lib/nuzlocke-rules';
import type { RunKpis, RunState } from '@/lib/nuzlocke-store';
import type { GptLiveSessionContext } from './session-context';
import {
  isNoRunError,
  noRunError,
  requireRun,
  runSummaryOptions,
  type NuzlockeNoRunErr,
} from './nuzlocke-run-context';

export const NUZLOCKE_RUN_STATUS = 'nuzlocke_run_status';

export const NUZLOCKE_RUN_STATUS_TOOL = {
  type: 'function' as const,
  name: NUZLOCKE_RUN_STATUS,
  description:
    'Read-only Nuzlocke run status: summary, KPIs, party, level cap, and next gym. Requires an active run loaded in the browser.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
    additionalProperties: false as const,
  },
};

export interface NuzlockePartyRow {
  id: string;
  pokemonId: number;
  nickname: string | null;
  level: number;
  routeKey: string;
}

export interface NuzlockePlayerStatus {
  id: string;
  name: string;
  slot: number;
  party: NuzlockePartyRow[];
  boxedCount: number;
}

export type NuzlockeRunStatusOk = {
  ok: true;
  runId: string;
  runName: string;
  region: string;
  game: string;
  status: string;
  summary: string;
  kpis: RunKpis;
  levelCap: number | null;
  nextGym: ReturnType<typeof nextGymInfo>;
  players: NuzlockePlayerStatus[];
  spoken_hint: string;
};

export type NuzlockeRunStatusErr = NuzlockeNoRunErr;

export type NuzlockeRunStatusResult = NuzlockeRunStatusOk | NuzlockeRunStatusErr;

async function loadRunReaders() {
  const { boxedOf, kpisOf, partyOf } = await import('@/lib/nuzlocke-store');
  return { boxedOf, kpisOf, partyOf };
}

function partyRows(
  state: RunState,
  playerId: string,
  partyOf: Awaited<ReturnType<typeof loadRunReaders>>['partyOf'],
): NuzlockePartyRow[] {
  return partyOf(state, playerId).map((enc) => ({
    id: enc.id,
    pokemonId: enc.pokemon_id,
    nickname: enc.nickname,
    level: enc.level,
    routeKey: enc.route_key,
  }));
}

function spokenHint(input: {
  runName: string;
  kpis: RunKpis;
  levelCap: number | null;
  nextGym: ReturnType<typeof nextGymInfo>;
}): string {
  const capLine =
    input.levelCap !== null
      ? input.nextGym
        ? `Level cap ${input.levelCap} until the next gym.`
        : `Level cap ${input.levelCap}.`
      : 'No level cap is active.';
  return `${input.runName}: ${input.kpis.caught} caught, ${input.kpis.dead} dead, ${input.kpis.routesDone}/${input.kpis.routesTotal} routes. ${capLine}`;
}

export async function nuzlockeRunStatusFromContext(ctx: GptLiveSessionContext): Promise<NuzlockeRunStatusResult> {
  const stateOrErr = requireRun(ctx);
  if (isNoRunError(stateOrErr)) return stateOrErr;
  const state = stateOrErr;
  const { boxedOf, kpisOf, partyOf } = await loadRunReaders();

  const kpis = kpisOf(state);
  const levelCap = effectiveLevelCap(state);
  const gym = nextGymInfo(state);
  const summary = formatRunSummary(state, runSummaryOptions(state, 'en'));

  const players = [...state.players]
    .sort((a, b) => a.slot - b.slot)
    .map((player) => ({
      id: player.id,
      name: player.name,
      slot: player.slot,
      party: partyRows(state, player.id, partyOf),
      boxedCount: boxedOf(state, player.id).length,
    }));

  return {
    ok: true,
    runId: state.run.id,
    runName: state.run.name,
    region: state.run.region,
    game: state.run.game,
    status: state.run.status,
    summary,
    kpis,
    levelCap,
    nextGym: gym,
    players,
    spoken_hint: spokenHint({ runName: state.run.name, kpis, levelCap, nextGym: gym }),
  };
}

export async function nuzlockeRunStatusFromArgs(
  _args: unknown,
  ctx: GptLiveSessionContext,
): Promise<NuzlockeRunStatusResult> {
  if (!ctx.run) return noRunError();
  return nuzlockeRunStatusFromContext(ctx);
}
