import { describe, expect, it } from 'vitest';
import {
  genAbilityRows,
  genHasMechanics,
  genMoveOf,
  movePowerForDisplay,
  genStatsOf,
  genTypesOf,
  typesForPartyMon,
} from './gen-dex';
import type { StatKey } from './types';

const ZERO: Record<StatKey, number> = {
  hp: 0,
  attack: 0,
  defense: 0,
  'special-attack': 0,
  'special-defense': 0,
  speed: 0,
};

describe('genTypesOf — species types follow the edition gen', () => {
  it('Magnemite is Electric-only in RB, Electric/Steel from GS', () => {
    expect(genTypesOf('red-blue', 'magnemite', ['normal'])).toEqual(['electric']);
    expect(genTypesOf('yellow', 'magnemite', ['normal'])).toEqual(['electric']);
    expect(genTypesOf('gold-silver', 'magnemite', ['normal'])).toEqual(['electric', 'steel']);
    expect(genTypesOf('scarlet-violet', 'magnemite', ['normal'])).toEqual(['electric', 'steel']);
  });

  it('Clefable is Normal through Gen 5, Fairy from XY', () => {
    expect(genTypesOf('black-white', 'clefable', ['normal'])).toEqual(['normal']);
    expect(genTypesOf('x-y', 'clefable', ['normal'])).toEqual(['fairy']);
    expect(genTypesOf('scarlet-violet', 'clefable', ['normal'])).toEqual(['fairy']);
  });

  it('typesForPartyMon keeps Clefable Normal in BW even if the API fallback is Fairy', () => {
    expect(typesForPartyMon('black-white', 'clefable', ['fairy'])).toEqual(['normal']);
  });
});

describe('genStatsOf — @pkmn when the species is in that gen, else API fallback', () => {
  it('Alakazam SpA is 135 in BW; SV Paldea dex misses it so the API fallback is used', () => {
    const api = { ...ZERO, 'special-attack': 150 };
    expect(genStatsOf('black-white', 'alakazam', api)['special-attack']).toBe(135);
    expect(genStatsOf('scarlet-violet', 'alakazam', api)['special-attack']).toBe(150);
  });
});

describe('genAbilityRows — mechanics gates', () => {
  it('Gen 1–2 and LGPE/LA expose no abilities', () => {
    expect(genHasMechanics('red-blue').abilities).toBe(false);
    expect(genHasMechanics('gold-silver').abilities).toBe(false);
    expect(genHasMechanics('lets-go-pikachu-eevee').abilities).toBe(false);
    expect(genHasMechanics('legends-arceus').abilities).toBe(false);
    expect(genAbilityRows('red-blue', 'charizard')).toEqual([]);
    expect(genAbilityRows('lets-go-pikachu-eevee', 'charizard')).toEqual([]);
  });

  it('Charizard Gen 3+ has Blaze; Hidden Solar Power from Gen 5', () => {
    const e = genAbilityRows('emerald', 'charizard');
    expect(e.map((a) => a.slug)).toEqual(['blaze']);
    expect(e.every((a) => !a.hidden)).toBe(true);

    const bw = genAbilityRows('black-white', 'charizard');
    expect(bw.map((a) => [a.slug, a.hidden])).toEqual([
      ['blaze', false],
      ['solar-power', true],
    ]);
  });
});

describe('genMoveOf — historical power / category', () => {
  it('Thunderbolt is 95 through Gen 5 and 90 from XY', () => {
    expect(genMoveOf('firered-leafgreen', 'thunderbolt')?.power).toBe(95);
    expect(genMoveOf('black-white', 'thunderbolt')?.power).toBe(95);
    expect(genMoveOf('x-y', 'thunderbolt')?.power).toBe(90);
    expect(genMoveOf('scarlet-violet', 'thunderbolt')?.power).toBe(90);
  });

  it('Bite is Normal in Gen 1 and Dark from Gen 2', () => {
    expect(genMoveOf('red-blue', 'bite')?.type).toBe('normal');
    expect(genMoveOf('gold-silver', 'bite')?.type).toBe('dark');
  });

  it('movePowerForDisplay prefers genMoveOf when a version group is set', () => {
    expect(movePowerForDisplay('firered-leafgreen', 'thunderbolt', 90)).toBe(95);
    expect(movePowerForDisplay(undefined, 'thunderbolt', 90)).toBe(90);
    expect(movePowerForDisplay('x-y', 'thunderbolt', 95)).toBe(90);
  });
});
