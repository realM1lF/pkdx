/** Spoken eval cases for the local GPT-Live demo.
 * These are contract fixtures, not live API calls. */
import { CHECK_SLOT_LEGALITY } from './check-slot-legality';
import { CHECK_TEAM_COVERAGE } from './check-team-coverage';
import { ITEM_LOCATIONS } from './item-locations';
import { JUDGE_MATCHUP } from './judge-matchup';
import { NUZLOCKE_CAN_CATCH } from './nuzlocke-can-catch';
import { NUZLOCKE_RUN_STATUS } from './nuzlocke-run-status';
import { ROUTE_ENCOUNTERS } from './route-encounters';
import { GET_SPECIES_STATS } from './species-stats';
import { WHERE_TO_FIND } from './where-to-find';
import { normalizeRules } from '@/lib/nuzlocke-rules';
import { DEFAULT_RULES, type RunState } from '@/lib/nuzlocke-store';

export interface StatsSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof GET_SPECIES_STATS;
  args: { species_query: string; game: string | null };
  expect: {
    ok: true;
    slug: string;
    gen: number;
    stats: Record<string, number>;
    forbiddenKeys?: string[];
  };
}

export interface MatchupSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof JUDGE_MATCHUP;
  args: { you_query: string; foe_query: string; game: string | null };
  expect: {
    ok: true;
    youSlug: string;
    foeSlug: string;
    gen: number;
    forbiddenSideKeys?: string[];
    verdictKeys: string[];
  };
}

export interface WhereSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof WHERE_TO_FIND;
  args: { species_query: string; game: string | null };
  expect: { ok: true; slug: string; wildNodeId?: string };
}

export interface RouteSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof ROUTE_ENCOUNTERS;
  args: { route_query: string; game: string | null };
  expect: { ok: true; nodeId: string; wildSlug?: string };
}

export interface ItemSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof ITEM_LOCATIONS;
  args: { item_query: string; game: string | null };
  expect: { ok: true; itemSlug: string; nodeId?: string };
}

export interface LegalitySpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof CHECK_SLOT_LEGALITY;
  args: {
    species_query: string;
    game: string | null;
    moves: string[] | null;
    item: string | null;
    ability: string | null;
    nature: string | null;
  };
  expect: { ok: true; slug: string; legal: boolean; reasonKeys?: string[] };
}

export interface CoverageSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof CHECK_TEAM_COVERAGE;
  args: { game: string | null; members: string[] | null };
  expect: { ok: true; memberCount: number; minGaps?: number };
}

export interface NuzlockeRunStatusSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof NUZLOCKE_RUN_STATUS;
  args: Record<string, never>;
  run: RunState;
  expect: { ok: true; runName: string; levelCap?: number | null };
}

export interface NuzlockeCanCatchSpokenEvalCase {
  id: string;
  lang: 'de' | 'en';
  spoken: string;
  tool: typeof NUZLOCKE_CAN_CATCH;
  args: {
    species_query: string;
    route_query: string;
    player_slot: number | null;
    level: number | null;
    is_shiny: boolean | null;
  };
  run: RunState;
  expect: { ok: true; canCatch: boolean; validationError?: string | null; slug?: string };
}

export type SpokenEvalCase =
  | StatsSpokenEvalCase
  | MatchupSpokenEvalCase
  | WhereSpokenEvalCase
  | RouteSpokenEvalCase
  | ItemSpokenEvalCase
  | LegalitySpokenEvalCase
  | CoverageSpokenEvalCase
  | NuzlockeRunStatusSpokenEvalCase
  | NuzlockeCanCatchSpokenEvalCase;

function spokenEvalRun(partial?: {
  encounters?: RunState['encounters'];
  rules?: Partial<typeof DEFAULT_RULES>;
}): RunState {
  return {
    run: {
      id: 'spoken-eval-run',
      invite_code: null,
      name: 'Kanto Eval',
      game: 'firered',
      region: 'kanto',
      status: 'active',
      created_at: '2026-01-01T00:00:00.000Z',
      rules: normalizeRules({ ...DEFAULT_RULES, nicknames: false, autoLevelCap: true, badgesCleared: 0, ...partial?.rules }),
    },
    mode: 'solo',
    players: [
      {
        id: 'p1',
        run_id: 'spoken-eval-run',
        name: 'ANN',
        color: '#FFD60A',
        slot: 1,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'p2',
        run_id: 'spoken-eval-run',
        name: 'BOB',
        color: '#45C8FF',
        slot: 2,
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ],
    encounters: partial?.encounters ?? [],
  };
}

export const STATS_SPOKEN_EVALS: StatsSpokenEvalCase[] = [
  {
    id: 'glurak-red-attack-speed-de',
    lang: 'de',
    spoken: 'Wie viel Attack Speed hat Glurak in der roten Edition?',
    tool: GET_SPECIES_STATS,
    args: { species_query: 'Glurak', game: 'rote Edition' },
    expect: {
      ok: true,
      slug: 'charizard',
      gen: 1,
      stats: { hp: 78, attack: 84, defense: 78, special: 85, speed: 100 },
      forbiddenKeys: ['special_attack', 'special_defense'],
    },
  },
  {
    id: 'charizard-red-en',
    lang: 'en',
    spoken: 'What are Charizard’s base stats in Red?',
    tool: GET_SPECIES_STATS,
    args: { species_query: 'Charizard', game: 'red' },
    expect: {
      ok: true,
      slug: 'charizard',
      gen: 1,
      stats: { hp: 78, attack: 84, defense: 78, special: 85, speed: 100 },
      forbiddenKeys: ['special_attack'],
    },
  },
  {
    id: 'glurak-gold-split-de',
    lang: 'de',
    spoken: 'Welche Spezialwerte hat Glurak in Gold?',
    tool: GET_SPECIES_STATS,
    args: { species_query: 'Glurak', game: 'gold' },
    expect: {
      ok: true,
      slug: 'charizard',
      gen: 2,
      stats: { special_attack: 109, special_defense: 85, speed: 100 },
      forbiddenKeys: ['special'],
    },
  },
  {
    id: 'bisasam-yellow-en',
    lang: 'en',
    spoken: 'Bulbasaur special and speed in Yellow',
    tool: GET_SPECIES_STATS,
    args: { species_query: 'Bulbasaur', game: 'yellow' },
    expect: {
      ok: true,
      slug: 'bulbasaur',
      gen: 1,
      stats: { special: 65, speed: 45 },
      forbiddenKeys: ['special_attack'],
    },
  },
];

export const MATCHUP_SPOKEN_EVALS: MatchupSpokenEvalCase[] = [
  {
    id: 'glurak-vs-kleinstein-red-de',
    lang: 'de',
    spoken: 'Wer gewinnt Glurak versus Kleinstein in der roten Edition?',
    tool: JUDGE_MATCHUP,
    args: { you_query: 'Glurak', foe_query: 'Kleinstein', game: 'rote Edition' },
    expect: {
      ok: true,
      youSlug: 'charizard',
      foeSlug: 'geodude',
      gen: 1,
      forbiddenSideKeys: ['special_attack', 'special_defense'],
      verdictKeys: ['tier', 'reason', 'bestMove', 'outHits', 'inHits', 'outspeed', 'bestEff'],
    },
  },
  {
    id: 'charizard-vs-geodude-red-en',
    lang: 'en',
    spoken: 'Who wins Charizard versus Geodude in Red?',
    tool: JUDGE_MATCHUP,
    args: { you_query: 'Charizard', foe_query: 'Geodude', game: 'red' },
    expect: {
      ok: true,
      youSlug: 'charizard',
      foeSlug: 'geodude',
      gen: 1,
      forbiddenSideKeys: ['special_attack', 'special_defense'],
      verdictKeys: ['tier', 'reason', 'bestMove', 'outHits', 'inHits', 'outspeed', 'bestEff'],
    },
  },
];

export const WHERE_SPOKEN_EVALS: WhereSpokenEvalCase[] = [
  {
    id: 'taubsi-firered-de',
    lang: 'de',
    spoken: 'Wo finde ich Taubsi in Feuerrot?',
    tool: WHERE_TO_FIND,
    args: { species_query: 'Taubsi', game: 'feuerrot' },
    expect: { ok: true, slug: 'pidgey', wildNodeId: 'kanto-route-1' },
  },
  {
    id: 'pikachu-feuerrote-de',
    lang: 'de',
    spoken: 'Kann ich Pikachu in der feuerroten Edition fangen?',
    tool: WHERE_TO_FIND,
    args: { species_query: 'Pikachu', game: 'feuerrote Edition' },
    expect: { ok: true, slug: 'pikachu', wildNodeId: 'viridian-forest' },
  },
];

export const ROUTE_SPOKEN_EVALS: RouteSpokenEvalCase[] = [
  {
    id: 'route-1-firered-en',
    lang: 'en',
    spoken: 'What spawns on Route 1 in FireRed?',
    tool: ROUTE_ENCOUNTERS,
    args: { route_query: 'Route 1', game: 'firered' },
    expect: { ok: true, nodeId: 'kanto-route-1', wildSlug: 'pidgey' },
  },
];

export const ITEM_SPOKEN_EVALS: ItemSpokenEvalCase[] = [
  {
    id: 'trank-firered-de',
    lang: 'de',
    spoken: 'Wo bekomme ich einen Trank in Feuerrot?',
    tool: ITEM_LOCATIONS,
    args: { item_query: 'Trank', game: 'feuerrot' },
    expect: { ok: true, itemSlug: 'potion', nodeId: 'kanto-route-1' },
  },
];

export const LEGALITY_SPOKEN_EVALS: LegalitySpokenEvalCase[] = [
  {
    id: 'glurak-flammenwurf-frlg-de',
    lang: 'de',
    spoken: 'Ist Glurak mit Flammenwurf in Feuerrot legal?',
    tool: CHECK_SLOT_LEGALITY,
    args: {
      species_query: 'Glurak',
      game: 'feuerrot',
      moves: ['Flammenwurf'],
      item: null,
      ability: null,
      nature: null,
    },
    expect: { ok: true, slug: 'charizard', legal: true },
  },
  {
    id: 'charizard-flamethrower-frlg-en',
    lang: 'en',
    spoken: 'Is Charizard with Flamethrower legal in FireRed?',
    tool: CHECK_SLOT_LEGALITY,
    args: {
      species_query: 'Charizard',
      game: 'firered',
      moves: ['Flamethrower'],
      item: null,
      ability: null,
      nature: null,
    },
    expect: { ok: true, slug: 'charizard', legal: true },
  },
  {
    id: 'blaziken-frlg-en',
    lang: 'en',
    spoken: 'Is Blaziken legal in FireRed?',
    tool: CHECK_SLOT_LEGALITY,
    args: {
      species_query: 'Blaziken',
      game: 'firered',
      moves: null,
      item: null,
      ability: null,
      nature: null,
    },
    expect: { ok: true, slug: 'blaziken', legal: false, reasonKeys: ['noLearnset'] },
  },
];

export const NUZLOCKE_RUN_STATUS_SPOKEN_EVALS: NuzlockeRunStatusSpokenEvalCase[] = [
  {
    id: 'nuz-status-de',
    lang: 'de',
    spoken: 'Wie steht mein Nuzlocke-Run?',
    tool: NUZLOCKE_RUN_STATUS,
    args: {},
    run: spokenEvalRun(),
    expect: { ok: true, runName: 'Kanto Eval', levelCap: 14 },
  },
  {
    id: 'nuz-status-en',
    lang: 'en',
    spoken: 'What is my Nuzlocke run status?',
    tool: NUZLOCKE_RUN_STATUS,
    args: {},
    run: spokenEvalRun(),
    expect: { ok: true, runName: 'Kanto Eval', levelCap: 14 },
  },
];

export const NUZLOCKE_CAN_CATCH_SPOKEN_EVALS: NuzlockeCanCatchSpokenEvalCase[] = [
  {
    id: 'nuz-catch-open-de',
    lang: 'de',
    spoken: 'Darf ich Taubsi auf Route 1 fangen?',
    tool: NUZLOCKE_CAN_CATCH,
    args: { species_query: 'Taubsi', route_query: 'Route 1', player_slot: 1, level: 5, is_shiny: false },
    run: spokenEvalRun(),
    expect: { ok: true, canCatch: true, validationError: null, slug: 'pidgey' },
  },
  {
    id: 'nuz-catch-open-en',
    lang: 'en',
    spoken: 'Can I catch Pidgey on Route 1?',
    tool: NUZLOCKE_CAN_CATCH,
    args: { species_query: 'Pidgey', route_query: 'Route 1', player_slot: 1, level: 5, is_shiny: false },
    run: spokenEvalRun(),
    expect: { ok: true, canCatch: true, validationError: null, slug: 'pidgey' },
  },
  {
    id: 'nuz-catch-dupe-de',
    lang: 'de',
    spoken: 'Darf ich Turtok auf Route 22 fangen?',
    tool: NUZLOCKE_CAN_CATCH,
    args: { species_query: 'Turtok', route_query: 'Route 22', player_slot: 2, level: 5, is_shiny: false },
    run: spokenEvalRun({
      encounters: [
        {
          id: 'e1',
          run_id: 'spoken-eval-run',
          player_id: 'p1',
          route_key: 'kanto-route-1',
          pokemon_id: 7,
          caught_pokemon_id: 7,
          nickname: 'Shell',
          level: 5,
          status: 'caught',
          note: null,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
    }),
    expect: { ok: true, canCatch: false, validationError: 'speciesDupe', slug: 'blastoise' },
  },
];

export const COVERAGE_SPOKEN_EVALS: CoverageSpokenEvalCase[] = [
  {
    id: 'charizard-geodude-coverage-frlg-de',
    lang: 'de',
    spoken: 'Welche Typlücken hat mein Team aus Glurak und Kleinstein in Feuerrot?',
    tool: CHECK_TEAM_COVERAGE,
    args: { game: 'feuerrot', members: ['Glurak', 'Kleinstein'] },
    expect: { ok: true, memberCount: 2, minGaps: 1 },
  },
  {
    id: 'charizard-geodude-coverage-frlg-en',
    lang: 'en',
    spoken: 'What type gaps does Charizard and Geodude have in FireRed?',
    tool: CHECK_TEAM_COVERAGE,
    args: { game: 'firered', members: ['Charizard', 'Geodude'] },
    expect: { ok: true, memberCount: 2, minGaps: 1 },
  },
];
