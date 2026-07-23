import { describe, expect, it } from 'vitest';
import {
  damageBetween,
  genMatchupsForSide,
  speedCheck,
  statsOf,
  type VersusSide,
} from './versus';
import {
  defaultVersusContext,
  sanitizeVersusField,
  versusContextFromGame,
  versusTerrainForGen,
  versusWeatherForGen,
} from './versus-context';

const ctx9 = defaultVersusContext();

const venusaur = (patch: Partial<VersusSide> = {}): VersusSide => ({
  slug: 'venusaur',
  level: 50,
  moves: [],
  ...patch,
});

const charmander = (patch: Partial<VersusSide> = {}): VersusSide => ({
  slug: 'charmander',
  level: 50,
  moves: [],
  ...patch,
});

describe('versusWeatherForGen', () => {
  it('returns no weather options for gen 1', () => {
    expect(versusWeatherForGen(1)).toEqual([]);
  });

  it('includes hail for gen 3–8 and snow for gen 9', () => {
    expect(versusWeatherForGen(3)).toContain('hail');
    expect(versusWeatherForGen(3)).not.toContain('snow');
    expect(versusWeatherForGen(9)).toContain('snow');
    expect(versusWeatherForGen(9)).not.toContain('hail');
  });
});

describe('versusTerrainForGen', () => {
  it('returns no terrain before gen 6', () => {
    expect(versusTerrainForGen(5)).toEqual([]);
  });

  it('includes all terrain types from gen 6 onward', () => {
    expect(versusTerrainForGen(6)).toEqual(['none', 'electric', 'grassy', 'misty', 'psychic']);
  });
});

describe('sanitizeVersusField', () => {
  it('clears weather for gen 1', () => {
    expect(sanitizeVersusField({ weather: 'sun', terrain: 'grassy' }, 1)).toEqual({
      weather: 'none',
      terrain: 'none',
    });
  });

  it('clears snow below gen 9 and hail in gen 9', () => {
    expect(sanitizeVersusField({ weather: 'snow' }, 8)).toEqual({ weather: 'none', terrain: 'none' });
    expect(sanitizeVersusField({ weather: 'hail' }, 9)).toEqual({ weather: 'none', terrain: 'none' });
  });

  it('keeps terrain from gen 6 when weather is clear', () => {
    expect(sanitizeVersusField({ weather: 'none', terrain: 'grassy' }, 9)).toEqual({
      weather: 'none',
      terrain: 'grassy',
    });
  });
});

describe('statsOf and speedCheck', () => {
  it('matches known gen 9 level 50 neutral spreads', () => {
    expect(statsOf(venusaur(), ctx9)).toMatchObject({
      hp: 155,
      attack: 102,
      speed: 100,
    });
    expect(statsOf(charmander(), ctx9)).toMatchObject({
      hp: 114,
      speed: 85,
    });
  });

  it('applies paralysis speed reduction in speedCheck', () => {
    const normal = speedCheck(venusaur(), charmander(), ctx9);
    const parYou = speedCheck(venusaur({ status: 'par' }), charmander(), ctx9);
    expect(normal!.you).toBe(100);
    expect(parYou!.you).toBe(50);
    expect(parYou!.delta).toBe(-35);
  });
});

describe('damageBetween', () => {
  it('matches screenshot ranges for wild lv50 venusaur vs charmander', () => {
    const body = damageBetween(venusaur(), charmander(), 'take-down', undefined, ctx9);
    expect(body).not.toBeNull();
    expect(Math.round(body!.pct[0])).toBe(49);
    expect(Math.round(body!.pct[1])).toBe(58);
    expect(body!.eff).toBe(1);
    expect(body!.koHits).toBe(2);

    const spin = damageBetween(charmander(), venusaur(), 'fire-spin', undefined, ctx9);
    expect(Math.round(spin!.pct[0])).toBe(19);
    expect(Math.round(spin!.pct[1])).toBe(23);
    expect(spin!.eff).toBe(2);
    expect(spin!.koHits).toBe(3);
  });

  it('reflects Thick Fat as neutral EFF against fire', () => {
    const cell = damageBetween(
      charmander(),
      venusaur({ ability: 'Thick Fat' }),
      'fire-spin',
      undefined,
      ctx9,
    );
    expect(cell!.eff).toBe(1);
    expect(Math.round(cell!.pct[0])).toBeLessThan(15);
  });

  it('applies sun weather to fire damage', () => {
    const clear = damageBetween(charmander(), venusaur(), 'flare-blitz', undefined, ctx9, {
      weather: 'none',
      terrain: 'none',
    });
    const sun = damageBetween(charmander(), venusaur(), 'flare-blitz', undefined, ctx9, {
      weather: 'sun',
      terrain: 'none',
    });
    expect(sun!.pct[1]).toBeGreaterThan(clear!.pct[1] * 1.4);
  });

  it('ignores weather in gen 1 even when requested', () => {
    const ctx1 = versusContextFromGame('red', null);
    const clear = damageBetween(
      { slug: 'pikachu', level: 50, moves: [] },
      { slug: 'squirtle', level: 50, moves: [] },
      'thunderbolt',
      undefined,
      ctx1,
    );
    const sun = damageBetween(
      { slug: 'pikachu', level: 50, moves: [] },
      { slug: 'squirtle', level: 50, moves: [] },
      'thunderbolt',
      undefined,
      ctx1,
      { weather: 'sun' },
    );
    expect(sun!.pct).toEqual(clear!.pct);
  });

  it('boosts grass moves on grassy terrain in gen 9', () => {
    const clear = damageBetween(venusaur(), charmander(), 'giga-drain', undefined, ctx9);
    const grassy = damageBetween(venusaur(), charmander(), 'giga-drain', undefined, ctx9, {
      weather: 'none',
      terrain: 'grassy',
    });
    expect(grassy!.pct[1]).toBeGreaterThan(clear!.pct[1] * 1.2);
  });

  it('requires sleep for Dream Eater to deal damage', () => {
    const awake = damageBetween(
      { slug: 'alakazam', level: 50, moves: [] },
      venusaur(),
      'dream-eater',
      undefined,
      ctx9,
    );
    const asleep = damageBetween(
      { slug: 'alakazam', level: 50, moves: [] },
      venusaur({ status: 'slp' }),
      'dream-eater',
      undefined,
      ctx9,
    );
    expect(awake!.range[1]).toBe(0);
    expect(asleep!.range[1]).toBeGreaterThan(0);
  });
});

describe('genMatchupsForSide', () => {
  it('uses gen 9 type chart for grass/poison', () => {
    const m = genMatchupsForSide(['grass', 'poison'], 9);
    expect(m.weak).toEqual(expect.arrayContaining(['fire', 'flying', 'ice', 'psychic']));
  });

  it('moves ground from weaknesses to immune when Levitate is set', () => {
    const m = genMatchupsForSide(['fire'], 9, 'Levitate');
    expect(m.weak).not.toContain('ground');
    expect(m.immune).toContain('ground');
  });
});
