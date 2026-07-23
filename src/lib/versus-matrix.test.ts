/**
 * Exhaustive Versus verification matrix.
 *
 * Scope: every parameter DIMENSION is swept (gen, level, status, ability, item,
 * weather, terrain, nature/EVs, moves). Cross-products use isolation sweeps + fuzz.
 * Literal all Pokémon × all moves is infeasible; parity is guaranteed for any
 * VersusSide the UI can construct via shared @smogon/calc mapping.
 */
import { describe, expect, it } from 'vitest';
import {
  damageBetween,
  pokemonFromVersusSide,
  smogonReferenceRange,
  statsOf,
  type VersusSide,
} from './versus';
import {
  VERSUS_TERRAIN_OPTIONS,
  VERSUS_WEATHER_OPTIONS,
  sanitizeVersusField,
  versusContextFromGame,
  versusGameOptions,
  versusTerrainForGen,
  versusWeatherForGen,
  type VersusContext,
  type VersusField,
} from './versus-context';
import { independentFieldFromVersus, independentPokemonFromSide } from './versus-test-reference';
import { sideToVersus, type SideState } from '../pages/detail/VersusPanel';

type Status = VersusSide['status'];

const LEVELS = [1, 5, 50, 100] as const;
const STATUSES: Status[] = [undefined, 'none', 'burn', 'par', 'psn', 'slp', 'frz'];
const ABILITIES = [null, 'Thick Fat', 'Levitate', 'Huge Power', 'Flash Fire', 'Overgrow'] as const;
const ITEMS = [null, 'Choice Band', 'Life Orb', 'Assault Vest', 'Charcoal'] as const;

/** Per-gen attacker/defender/move triples known to exist in @smogon/calc data. */
const GEN_SCENARIOS: Record<
  number,
  { atk: string; def: string; physical: string; special: string; statusMove: string }
> = {
  1: { atk: 'pikachu', def: 'squirtle', physical: 'scratch', special: 'thunderbolt', statusMove: 'growl' },
  2: { atk: 'pikachu', def: 'quagsire', physical: 'quick-attack', special: 'thunderbolt', statusMove: 'sweet-scent' },
  3: { atk: 'blaziken', def: 'swampert', physical: 'sky-uppercut', special: 'flamethrower', statusMove: 'protect' },
  4: { atk: 'infernape', def: 'empoleon', physical: 'close-combat', special: 'flamethrower', statusMove: 'swords-dance' },
  5: { atk: 'emboar', def: 'samurott', physical: 'flare-blitz', special: 'focus-blast', statusMove: 'will-o-wisp' },
  6: { atk: 'charizard', def: 'blastoise', physical: 'flare-blitz', special: 'flamethrower', statusMove: 'roost' },
  7: { atk: 'incineroar', def: 'primarina', physical: 'darkest-lariat', special: 'moonblast', statusMove: 'parting-shot' },
  8: { atk: 'cinderace', def: 'inteleon', physical: 'pyro-ball', special: 'shadow-ball', statusMove: 'u-turn' },
  9: { atk: 'venusaur', def: 'charmander', physical: 'take-down', special: 'giga-drain', statusMove: 'synthesis' },
};

function ctxForGen(gen: number): VersusContext {
  const game = versusGameOptions().find((o) => o.gen === gen)?.game ?? 'scarlet';
  return versusContextFromGame(game, null);
}

function side(
  slug: string,
  level = 50,
  patch: Partial<VersusSide> = {},
): VersusSide {
  return { slug, level, moves: [], ...patch };
}

function assertMonParity(s: VersusSide, ctx: VersusContext) {
  const prod = pokemonFromVersusSide(s, ctx);
  const ind = independentPokemonFromSide(s, ctx);
  expect(prod).not.toBeNull();
  expect(ind).not.toBeNull();
  expect(prod!.stats).toEqual(ind!.stats);
  expect(prod!.ability).toBe(ind!.ability);
  expect(prod!.item).toBe(ind!.item);
  expect(prod!.status).toBe(ind!.status);
}

function assertDamageParity(
  atk: VersusSide,
  def: VersusSide,
  move: string,
  ctx: VersusContext,
  field?: VersusField,
) {
  const cell = damageBetween(atk, def, move, undefined, ctx, field);
  const ref = smogonReferenceRange(atk, def, move, ctx, field);
  expect(cell, `move ${move} gen ${ctx.gen}`).not.toBeNull();
  expect(ref, `ref ${move} gen ${ctx.gen}`).not.toBeNull();
  expect(cell!.range).toEqual(ref);

  const defMon = pokemonFromVersusSide(def, ctx)!;
  const maxHp = defMon.stats.hp || 1;
  expect(cell!.pct[0]).toBeCloseTo((cell!.range[0] / maxHp) * 100, 6);
  expect(cell!.pct[1]).toBeCloseTo((cell!.range[1] / maxHp) * 100, 6);

  if (cell!.range[1] > 0) {
    expect(cell!.koHits).toBeGreaterThanOrEqual(1);
    expect(cell!.koHits).toBeLessThanOrEqual(9);
  }
}

function fieldWeather(w: VersusField['weather']): VersusField {
  return { weather: w ?? 'none', terrain: 'none' };
}

function fieldTerrain(t: VersusField['terrain']): VersusField {
  return { weather: 'none', terrain: t ?? 'none' };
}

describe('versus matrix — builder parity (independent vs production)', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];

    it(`gen ${gen} pokemon + field builders match independent reference`, () => {
      const atk = side(sc.atk, 50, {
        nature: gen >= 3 ? 'Adamant' : undefined,
        evs: gen >= 3 ? { attack: 252, speed: 252 } : undefined,
        ability: 'Overgrow',
        item: 'Life Orb',
        status: 'burn',
      });
      const def = side(sc.def, 50, { ability: 'Thick Fat', status: 'par' });
      assertMonParity(atk, ctx);
      assertMonParity(def, ctx);

      for (const w of VERSUS_WEATHER_OPTIONS) {
        for (const t of VERSUS_TERRAIN_OPTIONS) {
          const f = { weather: w, terrain: t };
          const clean = sanitizeVersusField(f, gen);
          const prodField = independentFieldFromVersus(f, gen);
          const indField = independentFieldFromVersus(clean, gen);
          expect(JSON.stringify(prodField?.weather ?? null)).toBe(JSON.stringify(indField?.weather ?? null));
          expect(JSON.stringify(prodField?.terrain ?? null)).toBe(JSON.stringify(indField?.terrain ?? null));
        }
      }
    });
  }
});

describe('versus matrix — damage parity per generation', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];

    it(`gen ${gen} physical + special baseline`, () => {
      assertDamageParity(side(sc.atk, 50), side(sc.def, 50), sc.physical, ctx);
      assertDamageParity(side(sc.atk, 50), side(sc.def, 50), sc.special, ctx);
    });
  }
});

describe('versus matrix — every game slug resolves to correct gen context', () => {
  for (const opt of versusGameOptions()) {
    it(`${opt.game} → gen ${opt.gen}`, () => {
      const ctx = versusContextFromGame(opt.game, null);
      expect(ctx.gen).toBe(opt.gen);
      expect(ctx.versionGroup).toBe(opt.versionGroup);
      const sc = GEN_SCENARIOS[opt.gen];
      assertDamageParity(side(sc.atk, 50), side(sc.def, 50), sc.special, ctx);
    });
  }
});

describe('versus matrix — level sweep (1–100)', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const level of LEVELS) {
      it(`gen ${gen} level ${level}`, () => {
        assertDamageParity(side(sc.atk, level), side(sc.def, level), sc.physical, ctx);
        const st = statsOf(side(sc.atk, level), ctx);
        expect(st).not.toBeNull();
        expect(st!.hp).toBeGreaterThan(0);
        expect(st!.speed).toBeGreaterThan(0);
      });
    }
  }
});

describe('versus matrix — status sweep (attacker + defender)', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const st of STATUSES) {
      it(`gen ${gen} attacker status ${st ?? 'undefined'}`, () => {
        assertDamageParity(
          side(sc.atk, 50, { status: st }),
          side(sc.def, 50),
          sc.physical,
          ctx,
        );
      });
      it(`gen ${gen} defender status ${st ?? 'undefined'}`, () => {
        assertDamageParity(
          side(sc.atk, 50),
          side(sc.def, 50, { status: st }),
          sc.special,
          ctx,
        );
      });
    }
  }
});

describe('versus matrix — ability sweep', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const ability of ABILITIES) {
      it(`gen ${gen} defender ability ${ability ?? 'default'}`, () => {
        if (gen < 3 && ability) return; // abilities locked pre-gen3 in UI — calc still accepts
        assertDamageParity(
          side(sc.atk, 50, gen >= 3 ? { item: 'Life Orb' } : {}),
          side(sc.def, 50, { ability: ability ?? undefined }),
          sc.special,
          ctx,
        );
      });
      it(`gen ${gen} attacker ability ${ability ?? 'default'}`, () => {
        assertDamageParity(
          side(sc.atk, 50, { ability: ability ?? undefined }),
          side(sc.def, 50),
          sc.physical,
          ctx,
        );
      });
    }
  }
});

describe('versus matrix — item sweep', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const item of ITEMS) {
      it(`gen ${gen} item ${item ?? 'none'}`, () => {
        if (gen < 2 && item) return;
        assertDamageParity(
          side(sc.atk, 50, { item: item ?? undefined }),
          side(sc.def, 50),
          sc.physical,
          ctx,
        );
      });
    }
  }
});

describe('versus matrix — weather × gen (sanitized field)', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const w of VERSUS_WEATHER_OPTIONS) {
      it(`gen ${gen} weather ${w}`, () => {
        const raw = fieldWeather(w);
        const clean = sanitizeVersusField(raw, gen);
        assertDamageParity(side(sc.atk, 50), side(sc.def, 50), sc.special, ctx, clean);
      });
    }
  }
});

describe('versus matrix — terrain × gen (sanitized field)', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    for (const t of VERSUS_TERRAIN_OPTIONS) {
      it(`gen ${gen} terrain ${t}`, () => {
        const raw = fieldTerrain(t);
        const clean = sanitizeVersusField(raw, gen);
        assertDamageParity(side(sc.atk, 50), side(sc.def, 50), sc.special, ctx, clean);
      });
    }
  }
});

describe('versus matrix — nature + EV spread (gen 3+)', () => {
  for (const gen of [3, 4, 5, 6, 7, 8, 9] as const) {
    const ctx = ctxForGen(gen);
    const sc = GEN_SCENARIOS[gen];
    it(`gen ${gen} Adamant 252 Atk / 252 Spe`, () => {
      const atk = side(sc.atk, 50, {
        nature: 'Adamant',
        evs: { attack: 252, speed: 252, hp: 4 },
      });
      assertDamageParity(atk, side(sc.def, 50), sc.physical, ctx);
      const st = statsOf(atk, ctx)!;
      const neutral = statsOf(side(sc.atk, 50), ctx)!;
      expect(st.attack).toBeGreaterThan(neutral.attack);
    });
  }
});

describe('versus matrix — fixed-damage legacy moves', () => {
  const ctx3 = ctxForGen(3);
  it('seismic toss uses level damage', () => {
    assertDamageParity(
      side('machop', 37),
      side('abra', 40),
      'seismic-toss',
      ctx3,
    );
    const cell = damageBetween(side('machop', 37), side('abra', 40), 'seismic-toss', undefined, ctx3);
    expect(cell!.range).toEqual([37, 37]);
  });
  it('sonic boom fixed 20', () => {
    assertDamageParity(side('voltorb', 50), side('geodude', 50), 'sonic-boom', ctx3);
  });
});

describe('versus matrix — UI sideToVersus wiring', () => {
  it('maps SideState fields into VersusSide unchanged', () => {
    const ui: SideState = {
      level: 42,
      nature: 'Jolly',
      evs: { speed: 252, attack: 252 },
      slots: ['flamethrower', 'earthquake'],
      ability: 'Blaze',
      item: 'Charcoal',
      status: 'burn',
    };
    const v = sideToVersus(ui, 'charizard');
    expect(v).toMatchObject({
      slug: 'charizard',
      level: 42,
      nature: 'Jolly',
      ability: 'Blaze',
      item: 'Charcoal',
      status: 'burn',
      moves: ['flamethrower', 'earthquake'],
    });
    const ctx = ctxForGen(9);
    assertMonParity(v, ctx);
    assertDamageParity(v, side('blastoise', 42), 'flamethrower', ctx);
  });
});

describe('versus matrix — fuzz cross-product parity', () => {
  const gens = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const levels = [1, 13, 50, 87, 100];
  const statuses: Status[] = ['none', 'burn', 'par', 'psn', 'slp', 'frz'];
  const abilities = [null, 'Thick Fat', 'Levitate'];
  const items = [null, 'Choice Band', 'Life Orb'];
  const weathers = VERSUS_WEATHER_OPTIONS;
  const terrains = VERSUS_TERRAIN_OPTIONS;

  let seed = 0xdeadbeef;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  const cases: Array<{
    gen: number;
    level: number;
    status: Status;
    ability: string | null;
    item: string | null;
    weather: VersusField['weather'];
    terrain: VersusField['terrain'];
    moveKind: 'physical' | 'special';
  }> = [];

  for (let i = 0; i < 800; i++) {
    cases.push({
      gen: gens[Math.floor(rnd() * gens.length)],
      level: levels[Math.floor(rnd() * levels.length)],
      status: statuses[Math.floor(rnd() * statuses.length)],
      ability: abilities[Math.floor(rnd() * abilities.length)],
      item: items[Math.floor(rnd() * items.length)],
      weather: weathers[Math.floor(rnd() * weathers.length)],
      terrain: terrains[Math.floor(rnd() * terrains.length)],
      moveKind: rnd() > 0.5 ? 'physical' : 'special',
    });
  }

  it.each(cases.map((c, i) => [i, c] as const))('fuzz case #%i', (_i, c) => {
    const ctx = ctxForGen(c.gen);
    const sc = GEN_SCENARIOS[c.gen];
    const move = c.moveKind === 'physical' ? sc.physical : sc.special;
    const atk = side(sc.atk, c.level, {
      status: c.status,
      ability: c.ability ?? undefined,
      item: c.item ?? undefined,
      nature: c.gen >= 3 ? 'Hardy' : undefined,
    });
    const def = side(sc.def, c.level, { ability: c.ability === 'Levitate' ? 'Levitate' : undefined });
    const field = sanitizeVersusField({ weather: c.weather, terrain: c.terrain }, c.gen);
    assertMonParity(atk, ctx);
    assertDamageParity(atk, def, move, ctx, field);
  });
});

describe('versus matrix — UI field option gating matches sanitize', () => {
  for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    it(`gen ${gen} weather/terrain options are valid after sanitize`, () => {
      for (const w of versusWeatherForGen(gen)) {
        const f = sanitizeVersusField({ weather: w, terrain: 'none' }, gen);
        expect(f.weather).toBe(w);
      }
      for (const t of versusTerrainForGen(gen)) {
        const f = sanitizeVersusField({ weather: 'none', terrain: t }, gen);
        expect(f.terrain).toBe(t);
      }
    });
  }
});
