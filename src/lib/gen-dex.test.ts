import { describe, expect, it } from 'vitest';
import pokemonSeoJson from '@/data/pokemon-seo.json';
import {
  bstOf,
  genAbilityRows,
  genFor,
  genHasMechanics,
  genMoveOf,
  genStatsOf,
  genTypesOf,
  movePowerForDisplay,
  statKeysForGen,
  statLabelForGen,
  typesForPartyMon,
  moveMetaForDisplay,
  usedApiStatFallback,
} from './gen-dex';
import type { StatKey } from './types';
import { STAT_ORDER } from './types';

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

  it('Gastly stays Ghost/Poison in every edition', () => {
    expect(genTypesOf('red-blue', 'gastly', ['normal'])).toEqual(['ghost', 'poison']);
    expect(genTypesOf('gold-silver', 'gastly', ['normal'])).toEqual(['ghost', 'poison']);
    expect(genTypesOf('scarlet-violet', 'gastly', ['normal'])).toEqual(['ghost', 'poison']);
  });
});

describe('genStatsOf — @pkmn when the species is in that gen, else API fallback', () => {
  it('Alakazam SpA is 135 in BW; SV Paldea dex misses it so the API fallback is used', () => {
    const api = { ...ZERO, 'special-attack': 150 };
    expect(genStatsOf('black-white', 'alakazam', api)['special-attack']).toBe(135);
    expect(genStatsOf('scarlet-violet', 'alakazam', api)['special-attack']).toBe(150);
    expect(usedApiStatFallback('black-white', 'alakazam')).toBe(false);
    expect(usedApiStatFallback('scarlet-violet', 'alakazam')).toBe(true);
  });

  it('FRLG Alakazam BST is the gen3 total (SpD 85) and pokemon-seo.json matches', () => {
    const stats = genStatsOf('firered-leafgreen', 'alakazam', ZERO);
    const frlgBst = bstOf(stats, 3);
    expect(stats['special-defense']).toBe(85);
    expect(frlgBst).toBe(490);
    const seo = pokemonSeoJson as { dex: Record<string, { slug: string; bst: number }> };
    expect(seo.dex['65']?.slug).toBe('alakazam');
    expect(seo.dex['65']?.bst).toBe(frlgBst);
  });
});

function nationalSpecies(vgId: string, lastNum: number) {
  const rows: Array<{ num: number; id: string }> = [];
  for (const sp of genFor(vgId).species) {
    if (!sp.exists || sp.num < 1 || sp.num > lastNum || sp.forme) continue;
    rows.push({ num: sp.num, id: sp.id });
  }
  return rows;
}

describe('bstOf / statKeysForGen — encyclopedia consensus (Serebii RBY, PokéWiki Gen-1 list, Bulbapedia Gen I)', () => {
  it('Gen 1 shows five stats with one Special slot, not SPA+SPD', () => {
    expect([...statKeysForGen(1)]).toEqual(['hp', 'attack', 'defense', 'special-attack', 'speed']);
    expect(statLabelForGen('special-attack', 1)).toBe('SPC');
    expect(statLabelForGen('special-attack', 2)).toBe('SPA');
    expect(statLabelForGen('special-defense', 2)).toBe('SPD');
    expect(statKeysForGen(2)).toEqual(STAT_ORDER);
  });

  it('Mewtwo RB BST is 590 (Special once), GS+ is 680 (SpD 90)', () => {
    const rb = genStatsOf('red-blue', 'mewtwo', ZERO);
    const gs = genStatsOf('gold-silver', 'mewtwo', ZERO);
    expect(rb).toMatchObject({ hp: 106, attack: 110, defense: 90, 'special-attack': 154, speed: 130 });
    expect(rb['special-defense']).toBe(154);
    expect(bstOf(rb, 1)).toBe(590);
    expect(bstOf(rb, 1)).not.toBe(744);
    expect(gs['special-defense']).toBe(90);
    expect(bstOf(gs, 2)).toBe(680);
  });

  it('Charizard RBY BST is 425 (Special 85 once); GS+ is 534 (SpA 109)', () => {
    const rb = genStatsOf('red-blue', 'charizard', ZERO);
    const gs = genStatsOf('gold-silver', 'charizard', ZERO);
    expect(rb['special-attack']).toBe(85);
    expect(rb['special-defense']).toBe(85);
    expect(bstOf(rb, 1)).toBe(425);
    expect(gs['special-attack']).toBe(109);
    expect(gs['special-defense']).toBe(85);
    expect(bstOf(gs, 2)).toBe(534);
  });

  it('Alakazam Gen 1 Special 135 → BST 405; Gen 2 SpD 85 → BST 490; XY SpD 95 → BST 500', () => {
    const rb = genStatsOf('red-blue', 'alakazam', ZERO);
    const gs = genStatsOf('gold-silver', 'alakazam', ZERO);
    const xy = genStatsOf('x-y', 'alakazam', ZERO);
    expect(rb['special-attack']).toBe(135);
    expect(bstOf(rb, 1)).toBe(405);
    expect(gs['special-defense']).toBe(85);
    expect(bstOf(gs, 2)).toBe(490);
    expect(xy['special-defense']).toBe(95);
    expect(bstOf(xy, 6)).toBe(500);
  });

  it('every Gen 1 national-dex species: spa equals spd, displayed BST counts Special once', () => {
    const rows = nationalSpecies('red-blue', 151);
    expect(rows).toHaveLength(151);
    for (const { id } of rows) {
      const block = genStatsOf('red-blue', id, ZERO);
      expect(block['special-attack'], id).toBe(block['special-defense']);
      const five =
        block.hp + block.attack + block.defense + block['special-attack'] + block.speed;
      expect(bstOf(block, 1), id).toBe(five);
      expect(statKeysForGen(1)).not.toContain('special-defense');
    }
  });

  it('every Gen 2 national-dex species uses the six-stat BST (SpA and SpD both count)', () => {
    const rows = nationalSpecies('gold-silver', 251);
    expect(rows.length).toBeGreaterThanOrEqual(251);
    for (const { id } of rows) {
      const block = genStatsOf('gold-silver', id, ZERO);
      const six = STAT_ORDER.reduce((sum, k) => sum + block[k], 0);
      expect(bstOf(block, 2), id).toBe(six);
    }
  });
});

describe('genAbilityRows — mechanics gates', () => {
  it('LGPE has no EVs (Awakening values, not mainline EVs)', () => {
    expect(genHasMechanics('lets-go-pikachu-eevee').evs).toBe(false);
  });

  it('Gen 1–2 and LGPE/LA expose no abilities', () => {
    expect(genHasMechanics('red-blue').abilities).toBe(false);
    expect(genHasMechanics('gold-silver').abilities).toBe(false);
    expect(genHasMechanics('lets-go-pikachu-eevee').abilities).toBe(false);
    expect(genHasMechanics('legends-arceus').abilities).toBe(false);
    expect(genAbilityRows('red-blue', 'charizard')).toEqual([]);
    expect(genAbilityRows('lets-go-pikachu-eevee', 'charizard')).toEqual([]);
  });

  it('every Gen 1 species has an empty ability list', () => {
    for (const { id } of nationalSpecies('red-blue', 151)) {
      expect(genAbilityRows('red-blue', id), id).toEqual([]);
    }
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

  it('Bite category follows type then the Gen 4 split: physical → special → physical', () => {
    expect(genMoveOf('red-blue', 'bite')?.category).toBe('physical');
    expect(genMoveOf('gold-silver', 'bite')?.category).toBe('special');
    expect(genMoveOf('emerald', 'bite')?.category).toBe('special');
    expect(genMoveOf('diamond-pearl', 'bite')?.category).toBe('physical');
  });

  it('Swift is Physical through Gen 3 (Normal) and Special from the Gen 4 split', () => {
    expect(genMoveOf('red-blue', 'swift')?.category).toBe('physical');
    expect(genMoveOf('firered-leafgreen', 'swift')?.category).toBe('physical');
    expect(genMoveOf('diamond-pearl', 'swift')?.category).toBe('special');
  });

  it('Disable accuracy is 55 through Gen 3, 80 in DP, 100 from BW', () => {
    expect(genMoveOf('red-blue', 'disable')?.accuracy).toBe(55);
    expect(genMoveOf('firered-leafgreen', 'disable')?.accuracy).toBe(55);
    expect(genMoveOf('diamond-pearl', 'disable')?.accuracy).toBe(80);
    expect(genMoveOf('black-white', 'disable')?.accuracy).toBe(100);
  });

  it('moveMetaForDisplay never fills modern PokéAPI stats when @pkmn has no gen entry', () => {
    const api = {
      type: { name: 'normal' },
      damage_class: { name: 'special' },
      power: 80,
      accuracy: 100,
      pp: 10,
    };
    const missing = moveMetaForDisplay('red-blue', 'tera-blast', api);
    expect(missing.ready).toBe(true);
    expect(missing.power).toBeNull();
    expect(missing.accuracy).toBeNull();
    expect(missing.pp).toBeNull();
    expect(missing.type).toBe('');
  });

  it('moveMetaForDisplay still uses @pkmn when the move exists in that gen', () => {
    const api = {
      type: { name: 'electric' },
      damage_class: { name: 'special' },
      power: 90,
      accuracy: 100,
      pp: 15,
    };
    const tb = moveMetaForDisplay('firered-leafgreen', 'thunderbolt', api);
    expect(tb.power).toBe(95);
    expect(tb.type).toBe('electric');
  });

  it('movePowerForDisplay prefers genMoveOf when a version group is set', () => {
    expect(movePowerForDisplay('firered-leafgreen', 'thunderbolt', 90)).toBe(95);
    expect(movePowerForDisplay(undefined, 'thunderbolt', 90)).toBe(90);
    expect(movePowerForDisplay('x-y', 'thunderbolt', 95)).toBe(90);
  });
});
