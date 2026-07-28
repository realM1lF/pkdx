/* Battle-log effectiveness multipliers — the sim's -supereffective/-resisted
 * lines carry no number, so the engine recomputes move type × defender types
 * and attaches `mult` (dual types multiply: ×4 / ×¼ must be visible). */
import { describe, expect, it } from 'vitest';
import { MicroBattle } from './engine';
import type { BattleSetup, BattleSideSetup } from './types';

const side = (over: Partial<BattleSideSetup>): BattleSideSetup => ({
  species: 'pikachu',
  level: 50,
  moves: ['thunderbolt'],
  ...over,
});

const setup = (over: Partial<BattleSetup>): BattleSetup => ({
  gen: 9,
  player: side({}),
  ai: side({ species: 'gyarados', moves: ['splash'] }),
  ...over,
});

const SEED: [number, number, number, number] = [42, 7, 1987, 9001];

describe('battle log — effectiveness multiplier events', () => {
  it('Thunderbolt vs Gyarados (water/flying) logs supereffective ×4', async () => {
    const mb = await MicroBattle.create(setup({}), { aiMode: 'random', seed: SEED });
    mb.playerMove(1);
    const se = mb.eventLog.find((e) => e.kind === 'supereffective' && e.side === 'ai');
    expect(se).toBeTruthy();
    expect(se?.mult).toBe(4);
  });

  it('Thunderbolt vs Appletun (grass/dragon) logs resisted ×¼', async () => {
    const mb = await MicroBattle.create(setup({ ai: side({ species: 'appletun', moves: ['splash'] }) }), {
      aiMode: 'random',
      seed: SEED,
    });
    mb.playerMove(1);
    const rs = mb.eventLog.find((e) => e.kind === 'resisted' && e.side === 'ai');
    expect(rs).toBeTruthy();
    expect(rs?.mult).toBe(0.25);
  });

  it('plain ×2 logs supereffective with mult 2 (no false ×4)', async () => {
    const mb = await MicroBattle.create(setup({ ai: side({ species: 'blastoise', moves: ['splash'] }) }), {
      aiMode: 'random',
      seed: SEED,
    });
    mb.playerMove(1);
    const se = mb.eventLog.find((e) => e.kind === 'supereffective' && e.side === 'ai');
    expect(se).toBeTruthy();
    expect(se?.mult).toBe(2);
  });

  it('immune hits never get a supereffective event (Volt Absorb)', async () => {
    const mb = await MicroBattle.create(
      setup({ ai: side({ species: 'lanturn', moves: ['splash'], ability: 'Volt Absorb' }) }),
      { aiMode: 'random', seed: SEED },
    );
    mb.playerMove(1);
    expect(mb.eventLog.find((e) => e.kind === 'supereffective')).toBeFalsy();
    expect(mb.eventLog.find((e) => e.kind === 'immune')).toBeTruthy();
  });
});
