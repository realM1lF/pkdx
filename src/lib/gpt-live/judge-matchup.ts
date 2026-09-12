/**
 * Domain contract — GPT-Live judge_matchup wrapper.
 *
 * Page call chain (Versus UI — binding):
 *   VersusPanel / Nuzlocke VersusTab → getPokemon + prefetchSlugs → resolveDefaultSet
 *   → sideToVersus @ level 50 → computeMatrix (field none) → speedCheck → judgeMatchup
 *
 * Defaults: level 50, wild-then-assumed movesets, versusContextFromGame(gameHit.games[0], null).
 *
 * Must-not: sim-batch set resolution, simulateMatchup, MicroBattle, calcOverview, @pkmn/sim,
 * or locally invented damage math.
 *
 * Test map: judge-matchup.test.ts, spoken-eval.test.ts, versus.test.ts, versus-matrix.test.ts.
 */
import { genSpecies } from '@/lib/gen-dex';
import { getMove, getPokemon } from '@/lib/pokeapi';
import type { Move, StatKey } from '@/lib/types';
import {
  judgeMatchup,
  speedCheck,
  statsOf,
  type AnswerTier,
  type DamageCell,
  type SpeedCheck,
  type VersusSide,
} from '@/lib/versus';
import { versusContextFromGame } from '@/lib/versus-context';
import {
  blankSide,
  computeMatrix,
  prefetchSlugs,
  resolveDefaultSet,
  sideToVersus,
} from '@/pages/detail/VersusPanel';
import type { GptLiveSessionContext } from './session-context';
import {
  resolveGame,
  resolveSpecies,
  type GameHit,
  type SpeciesHit,
} from './species-stats';

export const JUDGE_MATCHUP = 'judge_matchup';

export const JUDGE_MATCHUP_TOOL = {
  type: 'function' as const,
  name: JUDGE_MATCHUP,
  description:
    'Judge a head-to-head matchup between two species in a named game using the same Versus calc as the website (damage matrix + speed + tier verdict). Use for who-wins / matchup questions.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      you_query: {
        type: 'string',
        description: 'Your side species as spoken, e.g. Glurak, Charizard, 6.',
      },
      foe_query: {
        type: 'string',
        description: 'Opponent species as spoken, e.g. Kleinstein, Geodude, 74.',
      },
      game: {
        type: ['string', 'null'],
        description:
          'Game or edition, e.g. red, rote edition, firered. Null when the session already has a game.',
      },
    },
    required: ['you_query', 'foe_query', 'game'],
    additionalProperties: false as const,
  },
};

export interface KeyCell {
  move: string;
  range: [number, number];
  pct: [number, number];
  koHits: number;
  eff: number;
  category?: string;
}

export type JudgeMatchupOk = {
  ok: true;
  you: SpeciesHit & { stats: Record<string, number>; set: { moves: string[]; source: 'wild' | 'assumed' } };
  foe: SpeciesHit & { stats: Record<string, number>; set: { moves: string[]; source: 'wild' | 'assumed' } };
  game: GameHit;
  speed: SpeedCheck;
  verdict: {
    tier: AnswerTier;
    reason: string;
    bestMove: string | null;
    outHits: number;
    inHits: number;
    outspeed: boolean | null;
    bestEff: number;
  };
  key_cells: {
    you_vs_foe: KeyCell[];
    foe_vs_you: KeyCell[];
  };
  spoken_hint: string;
  semantics: {
    generation: number;
    note: string;
  };
};

export type JudgeMatchupErr = {
  ok: false;
  error: 'unknown_species' | 'unknown_game' | 'not_in_game' | 'invalid_arguments';
  message: string;
  you?: SpeciesHit;
  foe?: SpeciesHit;
  game?: GameHit;
};

export type JudgeMatchupResult = JudgeMatchupOk | JudgeMatchupErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function publicStats(block: Record<StatKey, number>, gen: number): Record<string, number> {
  const out: Record<string, number> = {};
  if (gen < 2) {
    out.hp = block.hp;
    out.attack = block.attack;
    out.defense = block.defense;
    out.special = block['special-attack'];
    out.speed = block.speed;
    return out;
  }
  for (const [key, value] of Object.entries(block)) {
    if (key === 'special-attack') out.special_attack = value;
    else if (key === 'special-defense') out.special_defense = value;
    else out[key] = value;
  }
  return out;
}

function sideStats(side: VersusSide, gen: number, ctx: ReturnType<typeof versusContextFromGame>): Record<string, number> | null {
  const raw = statsOf(side, ctx);
  if (!raw) return null;
  return publicStats(raw, gen);
}

function toKeyCell(cell: DamageCell): KeyCell {
  return {
    move: cell.move,
    range: cell.range,
    pct: cell.pct,
    koHits: cell.koHits,
    eff: cell.eff,
    category: cell.category,
  };
}

function inferLang(you: SpeciesHit, foe: SpeciesHit, youQuery: string, foeQuery: string): 'de' | 'en' {
  const fold = (raw: string) => raw.trim().toLowerCase();
  const yq = fold(youQuery);
  const fq = fold(foeQuery);
  if (yq === fold(you.nameDe) || fq === fold(foe.nameDe)) return 'de';
  return 'en';
}

function spokenHint(input: {
  you: SpeciesHit;
  foe: SpeciesHit;
  game: GameHit;
  verdict: JudgeMatchupOk['verdict'];
  speed: SpeedCheck;
}): string {
  const speedLine =
    input.speed.delta > 0
      ? `${input.you.nameEn} outspeeds`
      : input.speed.delta < 0
        ? `${input.foe.nameEn} outspeeds`
        : 'Speed tie';
  return `${input.you.nameEn} vs ${input.foe.nameEn}, ${input.game.label} Gen ${input.game.gen}: ${input.verdict.tier} — ${input.verdict.reason}. ${speedLine}.`;
}

async function fetchMoveDetails(slugs: string[]): Promise<Map<string, Move>> {
  const map = new Map<string, Move>();
  const unique = [...new Set(slugs.filter(Boolean))];
  await Promise.all(
    unique.map(async (slug) => {
      try {
        map.set(slug, await getMove(slug));
      } catch {
        /* move unavailable — assumed stage may skip it */
      }
    }),
  );
  return map;
}

const MATCHUP_LEVEL = 50;

function defaultSetSource(source: ReturnType<typeof resolveDefaultSet>['source']): 'wild' | 'assumed' {
  return source === 'wild' ? 'wild' : 'assumed';
}

export async function judgeMatchupPair(
  youQuery: string,
  foeQuery: string,
  gameQuery: string,
): Promise<JudgeMatchupResult> {
  const you = resolveSpecies(youQuery);
  if (!you) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${youQuery.trim()}" for your side. Use a German or English Pokédex name or a national-dex number.`,
    };
  }

  const foe = resolveSpecies(foeQuery);
  if (!foe) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${foeQuery.trim()}" for the opponent. Use a German or English Pokédex name or a national-dex number.`,
      you,
    };
  }

  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}". Try red, blue, yellow, firered, or another version-group name.`,
      you,
      foe,
    };
  }

  if (!genSpecies(game.versionGroup, you.slug)?.exists) {
    return {
      ok: false,
      error: 'not_in_game',
      message: `${you.nameEn} / ${you.nameDe} is not in ${game.label} (Gen ${game.gen}).`,
      you,
      foe,
      game,
    };
  }

  if (!genSpecies(game.versionGroup, foe.slug)?.exists) {
    return {
      ok: false,
      error: 'not_in_game',
      message: `${foe.nameEn} / ${foe.nameDe} is not in ${game.label} (Gen ${game.gen}).`,
      you,
      foe,
      game,
    };
  }

  const ctx = versusContextFromGame(game.games[0], null);
  const [pYou, pFoe] = await Promise.all([getPokemon(you.slug), getPokemon(foe.slug)]);

  let youSideState = blankSide(MATCHUP_LEVEL);
  let foeSideState = blankSide(MATCHUP_LEVEL);
  const detailSlugs = [
    ...prefetchSlugs(pYou, youSideState.slots, ctx),
    ...prefetchSlugs(pFoe, foeSideState.slots, ctx),
  ];
  const details = await fetchMoveDetails(detailSlugs);

  const youSet = resolveDefaultSet(pYou, MATCHUP_LEVEL, details, ctx);
  const foeSet = resolveDefaultSet(pFoe, MATCHUP_LEVEL, details, ctx);
  youSideState = { ...youSideState, slots: youSet.moves };
  foeSideState = { ...foeSideState, slots: foeSet.moves };

  const youSide: VersusSide = sideToVersus(youSideState, you.slug);
  const foeSide: VersusSide = sideToVersus(foeSideState, foe.slug);

  const outCells = computeMatrix(youSide, foeSide, youSideState.slots, details, ctx)
    .map((row) => row.cell)
    .filter((cell): cell is DamageCell => Boolean(cell));
  const inCells = computeMatrix(foeSide, youSide, foeSideState.slots, details, ctx)
    .map((row) => row.cell)
    .filter((cell): cell is DamageCell => Boolean(cell));

  const speed = speedCheck(youSide, foeSide, ctx);
  if (!speed) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: `Could not compute speed for ${you.slug} vs ${foe.slug} in ${game.label}.`,
      you,
      foe,
      game,
    };
  }

  const lang = inferLang(you, foe, youQuery, foeQuery);
  const verdictRaw = judgeMatchup(outCells, inCells, speed.delta > 0 ? true : speed.delta < 0 ? false : null, lang);

  const youStats = sideStats(youSide, game.gen, ctx);
  const foeStats = sideStats(foeSide, game.gen, ctx);
  if (!youStats || !foeStats) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: `Could not compute stats for ${you.slug} vs ${foe.slug} in ${game.label}.`,
      you,
      foe,
      game,
    };
  }

  const verdict = {
    tier: verdictRaw.tier,
    reason: verdictRaw.reason,
    bestMove: verdictRaw.bestMove,
    outHits: verdictRaw.outHits,
    inHits: verdictRaw.inHits,
    outspeed: verdictRaw.outspeed,
    bestEff: verdictRaw.bestEff,
  };

  const key_cells = {
    you_vs_foe: outCells.map(toKeyCell),
    foe_vs_you: inCells.map(toKeyCell),
  };

  const semantics = {
    generation: game.gen,
    note:
      game.gen < 2
        ? 'Gen I uses one Special stat (not Sp. Atk / Sp. Def). Speed decides initiative.'
        : 'Versus matrix at level 50 with wild-then-assumed default movesets for the selected game.',
  };

  return {
    ok: true,
    you: {
      ...you,
      stats: youStats,
      set: { moves: youSet.moves, source: defaultSetSource(youSet.source) },
    },
    foe: {
      ...foe,
      stats: foeStats,
      set: { moves: foeSet.moves, source: defaultSetSource(foeSet.source) },
    },
    game,
    speed,
    verdict,
    key_cells,
    spoken_hint: spokenHint({ you, foe, game, verdict, speed }),
    semantics,
  };
}

export async function judgeMatchupFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery'> = {},
): Promise<JudgeMatchupResult> {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Expected an object with you_query, foe_query, and game.' };
  }
  const rec = args as Record<string, unknown>;
  const youQuery = stringArg(rec.you_query);
  const foeQuery = stringArg(rec.foe_query);
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || '';
  if (!youQuery.trim() || !foeQuery.trim() || !gameQuery.trim()) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: 'you_query and foe_query are required. game is required unless the session already has a game.',
    };
  }
  return judgeMatchupPair(youQuery, foeQuery, gameQuery);
}
