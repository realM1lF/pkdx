import { describe, expect, it } from 'vitest';
import {
  damageBetween,
  damageRowKind,
  genMatchupsForSide,
  koLabelFromHits,
  pokemonFromVersusSide,
  speedCheck,
  statsOf,
  type VersusSide,
} from './versus';
import { genHasMechanics } from './teambuilder';
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

/* ================================================================== */
/* calc-parity fix list (verifier): multihit, ramping, OHKO, sash,      */
/* slug normalization, VG mechanic overrides                            */
/* ================================================================== */

describe('genHasMechanics version-group overrides', () => {
  it('LGPE has no abilities and no held items', () => {
    expect(genHasMechanics('lets-go-pikachu-eevee')).toMatchObject({
      abilities: false,
      items: false,
      evs: false,
    });
  });

  it('Legends: Arceus has no abilities and no held items', () => {
    expect(genHasMechanics('legends-arceus')).toMatchObject({ abilities: false, items: false });
  });

  it('mainline generations stay unchanged', () => {
    expect(genHasMechanics('red-blue')).toEqual({ abilities: false, items: false, natures: false, evs: false });
    expect(genHasMechanics('gold-silver')).toMatchObject({ items: true, abilities: false });
    expect(genHasMechanics('scarlet-violet')).toEqual({ abilities: true, items: true, natures: true, evs: true });
  });
});

describe('buildMon item/ability slug normalization', () => {
  it('maps PokéAPI slugs to calc display names instead of dropping them', () => {
    const mon = pokemonFromVersusSide(venusaur({ item: 'life-orb', ability: 'thick-fat' }), ctx9);
    expect(mon).not.toBeNull();
    expect(mon!.item).toBe('Life Orb');
    expect(mon!.ability).toBe('Thick Fat');
  });

  it('display names keep working unchanged', () => {
    const mon = pokemonFromVersusSide(venusaur({ item: 'Choice Band', ability: 'Overgrow' }), ctx9);
    expect(mon!.item).toBe('Choice Band');
    expect(mon!.ability).toBe('Overgrow');
  });
});

describe('multi-hit moves (Bullet Seed & co)', () => {
  it('exposes per-hit range, hit count span and the full total', () => {
    const cell = damageBetween(venusaur(), charmander(), 'bullet-seed', undefined, ctx9);
    expect(cell).not.toBeNull();
    expect(cell!.multihit).toBeTruthy();
    expect(cell!.multihit!.hits).toEqual([2, 5]);
    const [hitLo, hitHi] = cell!.multihit!.hitRange;
    expect(hitLo).toBeGreaterThan(0);
    expect(hitHi).toBeGreaterThanOrEqual(hitLo);
    /* cell range = total across the hit span: 2×min … 5×max */
    expect(cell!.range).toEqual([hitLo * 2, hitHi * 5]);
    expect(cell!.multihit!.total).toEqual(cell!.range);
  });

  it('fixed-count multihit (Double Kick) reports 2–2 hits', () => {
    const cell = damageBetween(
      { slug: 'hitmonlee', level: 50, moves: [] },
      charmander(),
      'double-kick',
      undefined,
      ctx9,
    );
    expect(cell!.multihit!.hits).toEqual([2, 2]);
  });
});

describe('ramping moves (Rollout, Ice Ball, Fury Cutter, Echoed Voice)', () => {
  it('rollout doubles per hit and reports a cumulative 3-hit KO', () => {
    /* lv30 Geodude vs lv24 Chansey: min-roll cumulative 30/60/120 BP hits
     * (27 → +54 → +108 = 189 ≥ Chansey HP) → "3 Treffer" */
    const cell = damageBetween({ slug: 'geodude', level: 30, moves: [] }, { slug: 'chansey', level: 24, moves: [] }, 'rollout', undefined, ctx9);
    expect(cell).not.toBeNull();
    expect(cell!.ramp).toBeTruthy();
    expect(cell!.ramp!.perHit.length).toBeGreaterThanOrEqual(3);
    const [h1, h2, h3] = cell!.ramp!.perHit;
    expect(h2[0]).toBeGreaterThanOrEqual(h1[0] * 1.8); // ~2× base power
    expect(h3[0]).toBeGreaterThanOrEqual(h2[0] * 1.8);
    /* cumulative min rolls reach the KO exactly at hit 3 */
    const defHp = statsOf({ slug: 'chansey', level: 24 }, ctx9)!.hp;
    expect(h1[0] + h2[0]).toBeLessThan(defHp);
    expect(h1[0] + h2[0] + h3[0]).toBeGreaterThanOrEqual(defHp);
    expect(cell!.ramp!.koHits).toBe(3);
    expect(cell!.koHits).toBe(3); // matrix shows the cumulative label
  });

  it('fury cutter grows until the cumulative KO', () => {
    const cell = damageBetween({ slug: 'scyther', level: 40, moves: [] }, { slug: 'parasect', level: 30, moves: [] }, 'fury-cutter', undefined, ctx9);
    expect(cell!.ramp).toBeTruthy();
    expect(cell!.ramp!.perHit.length).toBeGreaterThanOrEqual(2);
    expect(cell!.ramp!.koHits).toBe(2);
  });

  it('echoed voice adds +40 per turn', () => {
    const cell = damageBetween({ slug: 'eevee', level: 30, moves: [] }, { slug: 'chansey', level: 30, moves: [] }, 'echoed-voice', undefined, ctx9);
    expect(cell!.ramp).toBeTruthy();
    const [h1, h2] = cell!.ramp!.perHit;
    expect(h2[0]).toBeGreaterThan(h1[0]); // second hit hits harder
  });

  it('gen 3 ice ball ramps too (per-gen base power)', () => {
    const ctx3 = versusContextFromGame('emerald', null);
    const cell = damageBetween({ slug: 'spheal', level: 30, moves: [] }, { slug: 'chansey', level: 30, moves: [] }, 'ice-ball', undefined, ctx3);
    expect(cell!.ramp).toBeTruthy();
    expect(cell!.ramp!.perHit.length).toBeGreaterThanOrEqual(2);
  });
});

describe('OHKO moves (Fissure & co)', () => {
  it('returns an explicit OHKO cell with accuracy instead of [0,0]/—', () => {
    const cell = damageBetween({ slug: 'golem', level: 50, moves: [] }, { slug: 'snorlax', level: 50, moves: [] }, 'fissure', undefined, ctx9);
    expect(cell).not.toBeNull();
    expect(cell!.ohko).toEqual({ accuracy: 30 });
    expect(cell!.range).toEqual([0, 0]);
    expect(cell!.koHits).toBe(0);
  });

  it('keeps type immunity visible (Fissure vs Flying)', () => {
    const cell = damageBetween({ slug: 'golem', level: 50, moves: [] }, { slug: 'pidgey', level: 50, moves: [] }, 'fissure', undefined, ctx9);
    expect(cell!.ohko).toBeTruthy();
    expect(cell!.eff).toBe(0);
  });
});

describe('Focus Sash / Sturdy at the defender', () => {
  const attacker = (): VersusSide => ({ slug: 'charizard', level: 70, moves: [] });
  const frailDefender = (patch: Partial<VersusSide> = {}): VersusSide => ({ slug: 'pidgey', level: 20, moves: [], ...patch });

  it('caps the guaranteed OHKO: Focus Sash turns it into a guaranteed 2HKO', () => {
    const bare = damageBetween(attacker(), frailDefender(), 'air-slash', undefined, ctx9);
    expect(bare!.koHits).toBe(1);
    expect(bare!.koChance).toBe(1);

    const sash = damageBetween(attacker(), frailDefender({ item: 'Focus Sash' }), 'air-slash', undefined, ctx9);
    expect(sash!.survivesFirstHit).toBe(true);
    expect(sash!.koHits).toBe(2);
    expect(sash!.koChance).toBe(1); // sash leaves 1 HP → the second hit always finishes
  });

  it('Sturdy (gen 5+) behaves like Focus Sash', () => {
    const sturdy = damageBetween(attacker(), frailDefender({ ability: 'Sturdy' }), 'air-slash', undefined, ctx9);
    expect(sturdy!.koHits).toBe(2);
    expect(sturdy!.koChance).toBe(1);
  });

  it('gen 4 Sturdy does NOT block regular damage (only OHKO moves)', () => {
    const ctx4 = versusContextFromGame('platinum', null);
    const sturdy = damageBetween(attacker(), frailDefender({ ability: 'Sturdy' }), 'air-slash', undefined, ctx4);
    expect(sturdy!.koHits).toBe(1);
    expect(sturdy!.koChance).toBe(1);
  });

  it('a partial OHKO chance drops to 0 with Focus Sash', () => {
    /* find a matchup with a partial OHKO roll: scale the level until 0<chance<1 */
    let partialLv = 0;
    for (let lv = 30; lv <= 70; lv++) {
      const c = damageBetween(attacker(), frailDefender({ level: lv }), 'air-slash', undefined, ctx9);
      if (c && c.koHits === 1 && c.koChance > 0 && c.koChance < 1) {
        partialLv = lv;
        break;
      }
    }
    expect(partialLv).toBeGreaterThan(0);
    const sash = damageBetween(attacker(), frailDefender({ level: partialLv, item: 'Focus Sash' }), 'air-slash', undefined, ctx9);
    expect(sash!.koChance).toBe(0);
    expect(sash!.koHits).toBeGreaterThanOrEqual(2);
  });

  it('multi-hit moves ignore the sash (later hits finish the KO)', () => {
    const cell = damageBetween(
      { slug: 'venusaur', level: 70, moves: [] },
      frailDefender({ item: 'Focus Sash' }),
      'bullet-seed',
      undefined,
      ctx9,
    );
    expect(cell!.multihit).toBeTruthy();
    expect(cell!.koHits).toBe(1); // 2+ hits per use: hit 1 pops the sash, hit 2 KOs
  });
});

describe('damageRowKind (immune ≠ status)', () => {
  it('labels gen-5 Sludge vs Empoleon as immune, not status', () => {
    const ctx5 = versusContextFromGame('black', null);
    const cell = damageBetween(
      { slug: 'muk', level: 50, moves: ['sludge'] },
      { slug: 'empoleon', level: 50, moves: [] },
      'sludge',
      undefined,
      ctx5,
    );
    expect(cell).toBeTruthy();
    expect(cell!.category?.toLowerCase()).toBe('special');
    expect(cell!.eff).toBe(0);
    expect(cell!.range).toEqual([0, 0]);
    expect(damageRowKind(cell)).toBe('immune');
  });

  it('keeps true status moves as status', () => {
    const ctx5 = versusContextFromGame('black', null);
    const cell = damageBetween(
      { slug: 'muk', level: 50, moves: ['toxic'] },
      { slug: 'empoleon', level: 50, moves: [] },
      'toxic',
      undefined,
      ctx5,
    );
    expect(damageRowKind(cell)).toBe('status');
  });

  it('keeps a damaging cell as damage even when the roll is small', () => {
    expect(
      damageRowKind({
        move: 'sludge',
        range: [20, 24],
        pct: [10, 12],
        koHits: 9,
        koChance: 0,
        eff: 0.5,
        category: 'special',
      }),
    ).toBe('damage');
  });
});

describe('koLabelFromHits (plain-language chips)', () => {
  it('localizes the common hit buckets in DE and EN', async () => {
    const i18n = (await import('@/i18n')).default;
    const de = (await import('@/i18n/locales/de/translation.json')).default;
    if (!i18n.hasResourceBundle('de', 'translation')) {
      i18n.addResourceBundle('de', 'translation', de, true, true);
    }

    expect(koLabelFromHits(0, 'de')).toBe('—');
    expect(koLabelFromHits(1, 'de')).toBe('1× für KO');
    expect(koLabelFromHits(2, 'de')).toBe('2× nutzen für KO');
    expect(koLabelFromHits(3, 'de')).toBe('3× nutzen für KO');
    expect(koLabelFromHits(4, 'de')).toBe('4×+ für KO');
    expect(koLabelFromHits(9, 'de')).toBe('9×+ für KO');

    expect(koLabelFromHits(1, 'en')).toBe('1× for KO');
    expect(koLabelFromHits(2, 'en')).toBe('Use 2× for KO');
    expect(koLabelFromHits(4, 'en')).toBe('4×+ for KO');
  });
});
