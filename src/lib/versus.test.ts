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
  fieldMechanicsForVersionGroup,
  sanitizeVersusField,
  versusContextFromGame,
  versusTerrainForVersionGroup,
  versusWeatherForVersionGroup,
} from './versus-context';
import { VERSION_GROUPS } from './version-groups';

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

describe('field mechanics per version group', () => {
  it('gen 1 games have no weather or terrain', () => {
    expect(versusWeatherForVersionGroup('red-blue')).toEqual([]);
    expect(versusTerrainForVersionGroup('yellow')).toEqual([]);
  });

  it('hoenn mainline has weather but no terrain', () => {
    expect(versusWeatherForVersionGroup('emerald')).toContain('hail');
    expect(versusTerrainForVersionGroup('ruby-sapphire')).toEqual([]);
  });

  it('firered-leafgreen has no field toggles (no battle-field weather in practice)', () => {
    expect(fieldMechanicsForVersionGroup('firered-leafgreen')).toEqual({
      weather: [],
      terrain: [],
    });
  });

  it('bdsp has gen-4 weather without terrain', () => {
    expect(versusWeatherForVersionGroup('brilliant-diamond-shining-pearl')).toContain('hail');
    expect(versusTerrainForVersionGroup('brilliant-diamond-shining-pearl')).toEqual([]);
  });

  it('scarlet-violet has snow instead of hail and full terrain', () => {
    expect(versusWeatherForVersionGroup('scarlet-violet')).toContain('snow');
    expect(versusWeatherForVersionGroup('scarlet-violet')).not.toContain('hail');
    expect(versusTerrainForVersionGroup('scarlet-violet')).toContain('grassy');
  });

  it('lets-go and legends arceus have no field toggles', () => {
    for (const id of ['lets-go-pikachu-eevee', 'legends-arceus'] as const) {
      expect(versusWeatherForVersionGroup(id)).toEqual([]);
      expect(versusTerrainForVersionGroup(id)).toEqual([]);
    }
  });
});

describe('sanitizeVersusField', () => {
  it('clears weather for gen 1', () => {
    const ctx = versusContextFromGame('red', null);
    expect(sanitizeVersusField({ weather: 'sun', terrain: 'grassy' }, ctx)).toEqual({
      weather: 'none',
      terrain: 'none',
    });
  });

  it('clears snow below gen 9 and hail in gen 9', () => {
    const ctx8 = versusContextFromGame('sword', null);
    const ctx9 = versusContextFromGame('scarlet', null);
    expect(sanitizeVersusField({ weather: 'snow' }, ctx8)).toEqual({ weather: 'none', terrain: 'none' });
    expect(sanitizeVersusField({ weather: 'hail' }, ctx9)).toEqual({ weather: 'none', terrain: 'none' });
  });

  it('clears terrain for bdsp but keeps weather', () => {
    const ctx = versusContextFromGame('brilliant-diamond', null);
    expect(sanitizeVersusField({ weather: 'rain', terrain: 'grassy' }, ctx)).toEqual({
      weather: 'rain',
      terrain: 'none',
    });
  });

  it('clears all field effects for firered', () => {
    const ctx = versusContextFromGame('firered', null);
    expect(sanitizeVersusField({ weather: 'sun', terrain: 'grassy' }, ctx)).toEqual({
      weather: 'none',
      terrain: 'none',
    });
  });
});

describe('UI field options match sanitize for every version group', () => {
  for (const vg of VERSION_GROUPS) {
    it(`${vg.id}`, () => {
      for (const w of versusWeatherForVersionGroup(vg.id)) {
        const f = sanitizeVersusField({ weather: w, terrain: 'none' }, vg.id);
        expect(f.weather).toBe(w);
      }
      for (const t of versusTerrainForVersionGroup(vg.id)) {
        const f = sanitizeVersusField({ weather: 'none', terrain: t }, vg.id);
        expect(f.terrain).toBe(t);
      }
    });
  }
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

  it('ignores weather for firered-leafgreen even when requested', () => {
    const ctx = versusContextFromGame('firered', null);
    const clear = damageBetween(venusaur(), charmander(), 'flamethrower', undefined, ctx);
    const sun = damageBetween(venusaur(), charmander(), 'flamethrower', undefined, ctx, {
      weather: 'sun',
    });
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
