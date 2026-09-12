/**
 * Domain contract — GPT-Live check_team_coverage wrapper.
 *
 * Page call chain (Team Builder AnalysisDeck — binding):
 *   filled slots → genTypesOf + moveTypeForCoverage + offensiveCoverage + defensiveSynergy
 *
 * Uses resolveSpecies + resolveGame. Members from spoken queries or browser team snapshot.
 * Must-not: parallel coverage math, saveTeam, or Smogon meta.
 *
 * Test map: check-team-coverage.test.ts, teambuilder-species.test.ts, spoken-eval.test.ts.
 */
import { genSpecies, genTypesOf } from '@/lib/gen-dex';
import { getMove, getPokemon } from '@/lib/pokeapi';
import type { Move, PokemonType } from '@/lib/types';
import {
  defaultMoveset,
  defensiveSynergy,
  moveTypeForCoverage,
  offensiveCoverage,
  type CoverageResult,
  type DefenseRow,
  type TeamMemberDefense,
  type TeamMove,
  type TeamSlot,
  worstCases,
} from '@/lib/teambuilder';
import type { GptLiveSessionContext } from './session-context';
import { parseTeamSnapshot, snapshotFilledSlots, type GptLiveTeamSnapshot } from './team-snapshot';
import { resolveGame, resolveSpecies, type GameHit, type SpeciesHit } from './species-stats';

export const CHECK_TEAM_COVERAGE = 'check_team_coverage';

export const CHECK_TEAM_COVERAGE_TOOL = {
  type: 'function' as const,
  name: CHECK_TEAM_COVERAGE,
  description:
    'Analyze offensive type coverage and defensive synergy for 1–6 spoken species or the browser team snapshot in a named game. Read-only.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      game: {
        type: ['string', 'null'],
        description:
          'Game or edition, e.g. firered, rote edition. Null when the session already has a game.',
      },
      members: {
        type: ['array', 'null'],
        items: { type: 'string' },
        description:
          'One to six species names as spoken. Null to use the team snapshot posted from the browser.',
      },
    },
    required: ['game', 'members'],
    additionalProperties: false as const,
  },
};

export type CoverageMember = SpeciesHit & { moves: string[] };

export type TeamCoverageOk = {
  ok: true;
  game: GameHit;
  member_count: number;
  members: CoverageMember[];
  offense: CoverageResult;
  defense: DefenseRow[];
  worst_defense: DefenseRow[];
  spoken_hint: string;
  source: 'spoken' | 'snapshot';
};

export type TeamCoverageErr = {
  ok: false;
  error: 'unknown_species' | 'unknown_game' | 'not_in_game' | 'no_team' | 'invalid_arguments';
  message: string;
  species?: SpeciesHit;
  game?: GameHit;
};

export type CheckTeamCoverageResult = TeamCoverageOk | TeamCoverageErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function nullableStringArray(value: unknown): string[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  return value.filter((row): row is string => typeof row === 'string');
}

function slugifyAbility(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.toLowerCase().replace(/ /g, '-');
}

async function buildMovesForSlot(
  slot: TeamSlot,
  pokemon: Awaited<ReturnType<typeof getPokemon>>,
  vgId: string,
): Promise<string[]> {
  const fromSlot = slot.moves.filter((m): m is string => Boolean(m));
  if (fromSlot.length) return fromSlot.slice(0, 4);
  return defaultMoveset(pokemon, slot.level ?? 50, vgId);
}

async function coverageFromSlots(
  game: GameHit,
  slots: TeamSlot[],
  source: 'spoken' | 'snapshot',
): Promise<CheckTeamCoverageResult> {
  const vgId = game.versionGroup;
  const members: CoverageMember[] = [];
  const defenseMembers: TeamMemberDefense[] = [];
  const teamMoves: TeamMove[] = [];
  const moveDetails: Record<string, Move> = {};

  for (const slot of slots) {
    if (!slot.pokemon) continue;
    const species = resolveSpecies(slot.pokemon) ?? {
      id: slot.pokemonId ?? 0,
      slug: slot.pokemon,
      nameEn: slot.pokemon,
      nameDe: slot.pokemon,
    };

    if (!genSpecies(vgId, species.slug)?.exists) {
      return {
        ok: false,
        error: 'not_in_game',
        message: `${species.nameEn} is not in ${game.label}.`,
        species,
        game,
      };
    }

    let pokemon;
    try {
      pokemon = await getPokemon(species.slug);
    } catch {
      return {
        ok: false,
        error: 'unknown_species',
        message: `Could not load ${species.slug}.`,
        species,
        game,
      };
    }

    const fallback = (pokemon.types?.map((t) => t.type.name) ?? []) as PokemonType[];
    const types = genTypesOf(vgId, species.slug, fallback);
    defenseMembers.push({
      types,
      ability: slugifyAbility(slot.ability),
    });

    const moveSlugs = await buildMovesForSlot(slot, pokemon, vgId);
    members.push({ ...species, moves: moveSlugs });

    for (const slug of moveSlugs) {
      if (!moveDetails[slug]) {
        try {
          moveDetails[slug] = await getMove(slug);
        } catch {
          continue;
        }
      }
      const detail = moveDetails[slug];
      if (!detail || detail.damage_class.name === 'status') continue;
      const type = moveTypeForCoverage(vgId, slug, detail.type.name);
      if (!type) continue;
      teamMoves.push({ name: slug, type, stab: types.includes(type) });
    }
  }

  const offense = offensiveCoverage(teamMoves, vgId);
  const defense = defensiveSynergy(defenseMembers, vgId);
  const worst = worstCases(defense);

  return {
    ok: true,
    game,
    member_count: members.length,
    members,
    offense,
    defense,
    worst_defense: worst,
    source,
    spoken_hint: spokenCoverageHint(game, members.length, offense.gaps, worst),
  };
}

function spokenCoverageHint(
  game: GameHit,
  count: number,
  gaps: PokemonType[],
  worst: DefenseRow[],
): string {
  const gapPart = gaps.length ? `${gaps.length} offensive gap(s): ${gaps.slice(0, 4).join(', ')}` : 'no offensive gaps';
  const worstPart = worst.length
    ? `worst defense ${worst[0].type} severity ${worst[0].severity} (${worst[0].weak} weak)`
    : 'no critical defensive holes';
  return `${count} member(s), ${game.label}: ${gapPart}; ${worstPart}.`;
}

export async function checkTeamCoveragePair(
  gameQuery: string,
  memberQueries: string[] | null,
  snapshot: GptLiveTeamSnapshot | null | undefined,
): Promise<CheckTeamCoverageResult> {
  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}".`,
    };
  }

  if (memberQueries && memberQueries.length) {
    const queries = memberQueries.slice(0, 6);
    const slots: TeamSlot[] = [];
    for (const query of queries) {
      const species = resolveSpecies(query);
      if (!species) {
        return {
          ok: false,
          error: 'unknown_species',
          message: `No species matched "${query.trim()}".`,
          game,
        };
      }
      slots.push({
        id: species.slug,
        pokemon: species.slug,
        pokemonId: species.id,
        nickname: null,
        level: 50,
        shiny: false,
        moves: [null, null, null, null],
        item: null,
        ability: null,
        nature: null,
        evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 },
      });
    }
    return coverageFromSlots(game, slots, 'spoken');
  }

  if (!snapshot) {
    return {
      ok: false,
      error: 'no_team',
      message: 'No team snapshot and no spoken members. Name species or open Team Builder first.',
      game,
    };
  }

  const filled = snapshotFilledSlots(snapshot);
  if (!filled.length) {
    return {
      ok: false,
      error: 'no_team',
      message: 'Team snapshot has no filled slots.',
      game,
    };
  }

  return coverageFromSlots(game, filled, 'snapshot');
}

export function checkTeamCoverageFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery' | 'teamSnapshot'> = {},
): Promise<CheckTeamCoverageResult> {
  if (!args || typeof args !== 'object') {
    return Promise.resolve({
      ok: false,
      error: 'invalid_arguments',
      message: 'Expected an object with game and members.',
    });
  }
  const rec = args as Record<string, unknown>;
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || ctx.teamSnapshot?.versionGroup || '';
  if (!gameQuery.trim()) {
    return Promise.resolve({
      ok: false,
      error: 'invalid_arguments',
      message: 'game is required unless the session already has a game.',
    });
  }
  return checkTeamCoveragePair(
    gameQuery,
    nullableStringArray(rec.members),
    ctx.teamSnapshot ?? null,
  );
}

export { parseTeamSnapshot };
