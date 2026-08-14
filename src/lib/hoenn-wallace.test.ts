import { describe, expect, it } from 'vitest';
import hoenn from '@/data/enriched/hoenn.json';

/**
 * Emerald Champion Wallace — confirmed 2026-08-15:
 * - Bulbapedia Wallace, Pokémon Emerald Champion table:
 *   https://bulbapedia.bulbagarden.net/wiki/Wallace#Pokémon_Emerald
 * - pret/pokeemerald `sParty_Wallace` (TRAINER_CLASS_CHAMPION):
 *   https://github.com/pret/pokeemerald/blob/master/src/data/trainer_parties.h
 *
 * Both agree on species, levels, and in-game move slot order.
 * Informal walkthroughs list the same four moves per mon but swap slot
 * order on Wailord (Water Spout first) and Tentacruel (Sludge Bomb first).
 * Prefer the Bulbapedia Emerald Champion table (matches pret).
 *
 * Data model stays English ("Wallace"). DE display "Wassili" is render-only.
 */

function everGrande() {
  return hoenn.nodes['ever-grande-city'].trainers;
}

function champion() {
  return everGrande().find((t) => t.class === 'Champion');
}

describe('Hoenn Emerald Champion Wallace (Bulbapedia / pret/pokeemerald)', () => {
  it('is Wallace at ever-grande-city, not Steven (Ruby/Sapphire)', () => {
    const champ = champion();
    expect(champ).toBeDefined();
    expect(champ!.name).toBe('Wallace');
    expect(champ!.class).toBe('Champion');
    expect(champ!.important).toBe(true);
    expect(champ!.pos).toBeNull();
    expect(everGrande().some((t) => t.name === 'Steven')).toBe(false);
  });

  it('uses the Emerald Champion party and move slots', () => {
    const champ = champion()!;
    expect(champ.party.map((m) => [m.species, m.level, m.moves])).toEqual([
      ['wailord', 57, ['rain-dance', 'water-spout', 'double-edge', 'blizzard']],
      ['tentacruel', 55, ['toxic', 'hydro-pump', 'sludge-bomb', 'ice-beam']],
      ['ludicolo', 56, ['giga-drain', 'surf', 'leech-seed', 'double-team']],
      ['whiscash', 56, ['earthquake', 'surf', 'amnesia', 'hyper-beam']],
      ['gyarados', 56, ['dragon-dance', 'earthquake', 'hyper-beam', 'surf']],
      ['milotic', 58, ['recover', 'surf', 'ice-beam', 'toxic']],
    ]);
  });

  it('leaves Juan and the Elite Four unchanged', () => {
    const juan = hoenn.nodes['sootopolis-city'].trainers.find((t) => t.name === 'Juan')!;
    expect(juan.class).toBe('Leader');
    expect(juan.party.map((m) => [m.species, m.level, m.moves])).toEqual([
      ['luvdisc', 41, ['water-pulse', 'attract', 'sweet-kiss', 'flail']],
      ['whiscash', 41, ['rain-dance', 'water-pulse', 'amnesia', 'earthquake']],
      ['sealeo', 43, ['encore', 'body-slam', 'hail', 'ice-ball']],
      ['crawdaunt', 43, ['crabhammer', 'water-pulse', 'taunt', 'leer']],
      ['kingdra', 46, ['water-pulse', 'double-team', 'ice-beam', 'rest']],
    ]);

    const e4 = everGrande().filter((t) => t.class === 'Elite Four');
    expect(e4.map((t) => t.name)).toEqual(['Sidney', 'Phoebe', 'Glacia', 'Drake']);
    expect(e4.map((t) => t.party.map((m) => [m.species, m.level]))).toEqual([
      [
        ['mightyena', 46],
        ['shiftry', 48],
        ['cacturne', 49],
        ['crawdaunt', 49],
        ['absol', 51],
      ],
      [
        ['duskull', 48],
        ['banette', 49],
        ['sableye', 49],
        ['banette', 50],
        ['dusclops', 51],
      ],
      [
        ['sealeo', 48],
        ['glalie', 49],
        ['sealeo', 50],
        ['glalie', 52],
        ['walrein', 53],
      ],
      [
        ['shelgon', 48],
        ['altaria', 49],
        ['kingdra', 50],
        ['flygon', 52],
        ['salamence', 54],
      ],
    ]);
  });
});
