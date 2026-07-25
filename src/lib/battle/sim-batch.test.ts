/* Batch-simulation tests — the matchup-page pipeline (autoBattle greedy vs
 * greedy, seed schema, set resolution) on the real engine. Seeded → fully
 * deterministic. */
import { describe, expect, it } from 'vitest';
import { MicroBattle } from './engine';
import { matchupSeed, resolveMatchupSet, simulateMatchup, type MatchupSet } from './sim-batch';
import type { Pokemon } from '../types';

const set = (species: string, moves: string[]): MatchupSet => ({
  species,
  level: 50,
  moves,
  source: 'wild',
  versionGroup: 'scarlet-violet',
});

describe('matchupSeed', () => {
  it('is stable per (slug, battleIndex) and differs across indices/slugs', () => {
    expect(matchupSeed('charizard-vs-blastoise', 0)).toEqual([13335, 8239, 26282, 33536]);
    expect(matchupSeed('charizard-vs-blastoise', 0)).toEqual(matchupSeed('charizard-vs-blastoise', 0));
    expect(matchupSeed('charizard-vs-blastoise', 1)).not.toEqual(matchupSeed('charizard-vs-blastoise', 0));
    expect(matchupSeed('mewtwo-vs-mew', 0)).not.toEqual(matchupSeed('charizard-vs-blastoise', 0));
    for (const w of matchupSeed('charizard-vs-blastoise', 7)) {
      expect(w).toBeGreaterThanOrEqual(0);
      expect(w).toBeLessThanOrEqual(0xffff);
    }
  });
});

describe('MicroBattle.autoBattle (greedy vs greedy)', () => {
  it('ends with a winner and reproduces exactly for the same seed', async () => {
    const setup = {
      gen: 9,
      player: { species: 'blastoise', level: 50, moves: ['hydro-pump', 'aqua-tail', 'shell-smash', 'iron-defense'] },
      ai: { species: 'charizard', level: 50, moves: ['slash', 'flamethrower', 'scary-face', 'fire-spin'] },
    };
    const seed = matchupSeed('charizard-vs-blastoise', 0);
    const a = await MicroBattle.create(setup, { aiMode: 'greedy', seed });
    const endA = a.autoBattle();
    expect(endA.phase).toBe('ended');
    expect(endA.winner).toBe('player'); // hydro pump 2HKO vs resisted flamethrower

    const b = await MicroBattle.create(setup, { aiMode: 'greedy', seed });
    const endB = b.autoBattle();
    expect(JSON.stringify(b.eventLog)).toBe(JSON.stringify(a.eventLog));
    expect(endB.winner).toBe(endA.winner);
    expect(endB.turn).toBe(endA.turn);
  });

  it('drives BOTH sides greedily (no player input needed) and caps runaway stalls', async () => {
    const mb = await MicroBattle.create(
      {
        gen: 9,
        player: { species: 'chansey', level: 50, moves: ['soft-boiled'] },
        ai: { species: 'blissey', level: 50, moves: ['soft-boiled'] },
      },
      { aiMode: 'greedy', seed: matchupSeed('stall-test', 0) },
    );
    const end = mb.autoBattle(50);
    expect(end.turn).toBeLessThanOrEqual(50);
  });
});

describe('simulateMatchup', () => {
  it('accounts every battle exactly once (wins + ties = battle count)', async () => {
    const stats = await simulateMatchup(
      set('blastoise', ['hydro-pump', 'aqua-tail', 'shell-smash', 'iron-defense']),
      set('charizard', ['slash', 'flamethrower', 'scary-face', 'fire-spin']),
      'charizard-vs-blastoise',
      undefined,
      10,
    );
    expect(stats.winsA + stats.winsB + stats.ties).toBe(10);
    expect(stats.winsA).toBeGreaterThan(stats.winsB);
    expect(stats.medianTurns).toBeGreaterThan(0);
  });
});

describe('resolveMatchupSet', () => {
  /* minimal PokéAPI-shaped payload: 5 level-up moves in scarlet-violet */
  const fakeMon = (slug: string): Pokemon =>
    ({
      name: slug,
      types: [{ slot: 1, type: { name: 'fire' } }],
      stats: [
        { stat: { name: 'attack' }, base_stat: 50 },
        { stat: { name: 'special-attack' }, base_stat: 80 },
      ],
      moves: ['ember', 'growl', 'scratch', 'flamethrower', 'roar', 'fire-blast'].map((m, i) => ({
        move: { name: m },
        version_group_details: [
          { version_group: { name: 'scarlet-violet' }, move_learn_method: { name: 'level-up' }, level_learned_at: i * 10 },
        ],
      })),
    }) as unknown as Pokemon;

  it('takes the last 4 level-up moves at the level (wild stage)', () => {
    const s = resolveMatchupSet(fakeMon('testmon'), 50, new Map());
    expect(s.moves).toEqual(['scratch', 'flamethrower', 'roar', 'fire-blast']);
    expect(s.source).toBe('wild');
    expect(s.versionGroup).toBe('scarlet-violet');
  });

  it('falls back to the newest version group with data when the newest game has none', () => {
    const p = fakeMon('oldmon');
    p.moves = p.moves.map((m) => ({
      ...m,
      version_group_details: m.version_group_details.map((d) => ({
        ...d,
        version_group: { name: 'ultra-sun-ultra-moon', url: '' },
      })),
    }));
    const s = resolveMatchupSet(p, 50, new Map());
    expect(s.moves).toEqual(['scratch', 'flamethrower', 'roar', 'fire-blast']);
    expect(s.versionGroup).toBe('ultra-sun-ultra-moon');
  });
});
