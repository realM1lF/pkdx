import { describe, expect, it } from 'vitest';
import kanto from '@/data/enriched/kanto.json';
import johto from '@/data/enriched/johto.json';
import unova from '@/data/enriched/unova.json';
import itemsJohto from '@/data/items-johto.json';
import {
  hasTrainersAtNode,
  mapsTrainerEmptyKey,
  mapsTrainerTabCount,
  trainerArtifactGame,
  trainerArtifactVersionGroup,
  trainerCoverage,
  trainerGroupKey,
  trainerSourceMismatchesGame,
  trainersAtNode,
} from './trainer-data';

function leader(json: typeof kanto, node: string, name: string) {
  return json.nodes[node as keyof typeof json.nodes]?.trainers?.find((t) => t.name === name);
}

describe('FRLG Giovanni Viridian gym (Bulbapedia, FireRed/LeafGreen)', () => {
  it('is five Ground mons ending on Rhyhorn 50, not Rhydon', () => {
    const g = leader(kanto, 'viridian-city', 'Giovanni')!;
    expect(g.class).toBe('Leader');
    expect(g.party.map((m) => [m.species, m.level])).toEqual([
      ['rhyhorn', 45],
      ['dugtrio', 42],
      ['nidoqueen', 44],
      ['nidoking', 45],
      ['rhyhorn', 50],
    ]);
  });
});

describe('BW Champion Alder (Bulbapedia, Black/White league)', () => {
  it('uses Volcarona 77 as ace, no Haxorus, league levels', () => {
    const a = unova.nodes['unova-victory-road'].trainers.find((t) => t.name === 'Alder')!;
    expect(a.name).toBe('Alder');
    expect(a.class).toBe('Champion');
    expect(a.important).toBe(true);
    expect(a.pos).toBeNull();
    expect(a.party.map((m) => [m.species, m.level])).toEqual([
      ['accelgor', 75],
      ['bouffalant', 75],
      ['druddigon', 75],
      ['vanilluxe', 75],
      ['escavalier', 75],
      ['volcarona', 77],
    ]);
    expect(a.party.some((m) => m.species === 'haxorus')).toBe(false);
    expect(a.party.map((m) => m.moves)).toEqual([
      ['bug-buzz', 'focus-blast', 'me-first', 'energy-ball'],
      ['head-charge', 'megahorn', 'stone-edge', 'earthquake'],
      ['night-slash', 'outrage', 'superpower', 'payback'],
      ['blizzard', 'light-screen', 'flash-cannon', 'acid-armor'],
      ['x-scissor', 'giga-impact', 'iron-head', 'aerial-ace'],
      ['overheat', 'bug-buzz', 'quiver-dance', 'hyper-beam'],
    ]);
  });
});

describe('HGSS HM07 Waterfall (Bulbapedia, HeartGold/SoulSilver)', () => {
  it('HGSS HM07 Waterfall is at dragons-den (Clair after the den), not ice-path', () => {
    const ice = itemsJohto['ice-path'] ?? [];
    const den = itemsJohto['dragons-den'] ?? [];
    const isHm07 = (i: { itemSlug?: string; moveSlug?: string; name?: string }) =>
      i.moveSlug === 'waterfall' || /HM07/i.test(i.name ?? '');
    expect(ice.filter(isHm07)).toHaveLength(0);
    expect(den.filter(isHm07)).toHaveLength(1);
  });
});

describe('HGSS Johto league node (Bulbapedia, HeartGold/SoulSilver)', () => {
  it('places Will, Koga, Bruno, Karen, and Lance on johto-pokemon-league, not mt-silver', () => {
    const nodes = johto.nodes as Record<string, { trainers?: Array<{ name: string; class: string }> }>;
    const league = nodes['johto-pokemon-league']?.trainers ?? [];
    expect(league.map((t) => t.name)).toEqual(['Will', 'Koga', 'Bruno', 'Karen', 'Lance']);
    expect(league.map((t) => t.class)).toEqual([
      'Elite Four',
      'Elite Four',
      'Elite Four',
      'Elite Four',
      'Champion',
    ]);
    expect(hasTrainersAtNode('johto', 'johto-pokemon-league')).toBe(true);

    const silver = nodes['mt-silver']?.trainers ?? [];
    expect(silver.some((t) => t.class === 'Elite Four' || t.class === 'Champion')).toBe(false);
    expect(hasTrainersAtNode('johto', 'mt-silver')).toBe(false);
  });
});

describe('trainersAtNode', () => {
  it('kanto-route-3 has route trainers in the same join as gyms', () => {
    // FRLG Route 1 has no trainers; Route 3 has Youngster Ben and is the first numbered route with battles.
    const list = trainersAtNode('kanto', 'kanto-route-3');
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((t) => t.class === 'Leader')).toBe(false);
  });

  it('places Lance on johto-pokemon-league and leaves mt-silver empty', () => {
    const league = trainersAtNode('johto', 'johto-pokemon-league');
    expect(league.some((t) => t.name === 'Lance')).toBe(true);
    expect(trainersAtNode('johto', 'mt-silver')).toEqual([]);
  });
});

describe('trainerGroupKey', () => {
  it('groups rivals and route trainers separately from leaders', () => {
    expect(trainerGroupKey({ class: 'Youngster' })).toBe('route');
    expect(trainerGroupKey({ class: 'Rival' })).toBe('rival');
    expect(trainerGroupKey({ class: 'Leader' })).toBe('leaders');
    expect(trainerGroupKey({ class: 'Elite Four' })).toBe('e4');
    expect(trainerGroupKey({ class: 'Champion' })).toBe('e4');
    expect(trainerGroupKey({ class: 'Boss' })).toBe('boss');
  });
});

describe('trainerCoverage', () => {
  it('marks kanto as routes and later regions as key-battles only', () => {
    expect(trainerCoverage('kanto')).toBe('routes');
    expect(trainerCoverage('johto')).toBe('key-battles');
    expect(trainerCoverage('hoenn')).toBe('key-battles');
    expect(trainerCoverage('sinnoh')).toBe('key-battles');
    expect(trainerCoverage('unova')).toBe('key-battles');
  });
});

describe('maps trainer honesty (gap ≠ zero trainers)', () => {
  it('hides a 0 count when the region only has key battles', () => {
    expect(mapsTrainerTabCount('sinnoh', 0)).toBeNull();
    expect(mapsTrainerTabCount('johto', 0)).toBeNull();
    expect(mapsTrainerTabCount('kanto', 0)).toBe(0);
    expect(mapsTrainerTabCount('sinnoh', 2)).toBe(2);
  });

  it('uses the gap copy for key-battle regions, not a fake empty location', async () => {
    expect(mapsTrainerEmptyKey('sinnoh')).toBe('maps.noTrainersKeyBattles');
    expect(mapsTrainerEmptyKey('kanto')).toBe('maps.noTrainers');
    const de = (await import('@/i18n/locales/de/translation.json')).default;
    const en = (await import('@/i18n/locales/en/translation.json')).default;
    expect(de.maps.noTrainersKeyBattles).not.toMatch(/Keine Trainer an diesem Ort/i);
    expect(en.maps.noTrainersKeyBattles).not.toMatch(/No trainers at this place/i);
    expect(de.maps.noTrainersKeyBattles).toMatch(/fehlen/i);
    expect(en.maps.noTrainersKeyBattles).toMatch(/missing|not in the data/i);
  });
});

describe('trainerArtifactGame', () => {
  it('reads the enriched JSON game field per region', () => {
    expect(trainerArtifactGame('kanto')).toBe('firered');
    expect(trainerArtifactGame('johto')).toBe('heartgold');
    expect(trainerArtifactGame('hoenn')).toBe('emerald');
    expect(trainerArtifactGame('sinnoh')).toBe('platinum');
    expect(trainerArtifactGame('unova')).toBe('black-white');
  });
});

describe('trainerArtifactVersionGroup', () => {
  it('maps artifact games to version groups, including VG ids', () => {
    expect(trainerArtifactVersionGroup('kanto')).toBe('firered-leafgreen');
    expect(trainerArtifactVersionGroup('johto')).toBe('heartgold-soulsilver');
    expect(trainerArtifactVersionGroup('hoenn')).toBe('emerald');
    expect(trainerArtifactVersionGroup('sinnoh')).toBe('platinum');
    expect(trainerArtifactVersionGroup('unova')).toBe('black-white');
  });
});

describe('trainerSourceMismatchesGame', () => {
  it('flags Crystal vs Johto HGSS and Diamond vs Sinnoh Platinum', () => {
    expect(trainerSourceMismatchesGame('johto', 'crystal')).toBe(true);
    expect(trainerSourceMismatchesGame('sinnoh', 'diamond')).toBe(true);
  });

  it('does not flag matching artifact editions', () => {
    expect(trainerSourceMismatchesGame('hoenn', 'emerald')).toBe(false);
    expect(trainerSourceMismatchesGame('kanto', 'firered')).toBe(false);
    expect(trainerSourceMismatchesGame('unova', 'black')).toBe(false);
  });
});
