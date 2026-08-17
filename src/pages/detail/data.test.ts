/* Detail-page defensive matchups must follow @pkmn/data via the Versus
 * helpers — not a hardcoded Gen-VI+ chart. Versus tests are the oracle. */
import { describe, expect, it } from 'vitest';
import { genSplitMatchupsForSide } from '@/lib/versus';
import { VERSION_GROUPS as CANONICAL_VERSION_GROUPS } from '@/lib/version-groups';
import { loadGermanData, nameOfLocation, nameOfMove, nameOfPokemon } from '@/lib/i18n-data';
import type { EvolutionDetail, NamedAPIResource } from '@/lib/types';
import { computeMatchups, defaultMatchupAbility, editionFromGameParam, evoCondition, flavorMatchesGames, genOfVersionGroup, newestMoveVersionGroup, pickAbilityShort, presentEditionIds, resolveMoveVersionGroup, VERSION_GROUPS } from './data';

function allAttacking(m: ReturnType<typeof computeMatchups>): string[] {
  return [...m.quad, ...m.weak, ...m.resist, ...m.quarter, ...m.immune, ...m.extra.flatMap((e) => e.types)];
}

describe('computeMatchups — same buckets as genSplitMatchupsForSide', () => {
  it('grass/poison gen 9: weak to fire/flying/psychic/ice, no bug quad', () => {
    const m = computeMatchups(['grass', 'poison'], 9);
    expect(m).toEqual(genSplitMatchupsForSide(['grass', 'poison'], 9));
    expect(m.weak).toEqual(expect.arrayContaining(['fire', 'flying', 'ice', 'psychic']));
    expect(m.quad).not.toContain('bug');
    expect(m.weak).not.toContain('bug');
  });

  it('gen 1 psychic: ghost does not hit the modern way (immune, not ×2)', () => {
    const m = computeMatchups(['psychic'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['psychic'], 1));
    expect(m.immune).toContain('ghost');
    expect(m.weak).not.toContain('ghost');
    expect(m.quad).not.toContain('ghost');
  });

  it('gen 9 psychic: ghost is a ×2 weakness (modern chart)', () => {
    const m = computeMatchups(['psychic'], 9);
    expect(m.weak).toContain('ghost');
    expect(m.immune).not.toContain('ghost');
  });

  it('gen 1 grass/poison: bug is ×4 (gen-1 Bug vs Poison/Grass), not neutral', () => {
    const m = computeMatchups(['grass', 'poison'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['grass', 'poison'], 1));
    expect(m.quad).toContain('bug');
  });

  it('keeps dual-type ×4 in the quad row (water/flying vs electric)', () => {
    const m = computeMatchups(['water', 'flying'], 9);
    expect(m).toEqual(genSplitMatchupsForSide(['water', 'flying'], 9));
    expect(m.quad).toContain('electric');
    expect(m.weak).not.toContain('electric');
  });
});

describe('computeMatchups — default ability immunities (Versus DefenseColumn / Smogon)', () => {
  it('Gengar + Levitate: Ground is immune, not neutral', () => {
    const types = ['ghost', 'poison'];
    const bare = computeMatchups(types, 3);
    expect(bare.immune).not.toContain('ground');
    const withLev = computeMatchups(types, 3, 'levitate');
    expect(withLev).toEqual(genSplitMatchupsForSide(types, 3, 'levitate'));
    expect(withLev.immune).toContain('ground');
    expect(withLev.weak).not.toContain('ground');
  });

  it('Gen 1 ignores Levitate (no abilities)', () => {
    const m = computeMatchups(['ghost', 'poison'], 1, 'levitate');
    expect(m.immune).not.toContain('ground');
  });

  it('Lightning Rod is not an Electric immunity before Gen 5', () => {
    expect(computeMatchups(['water'], 4, 'lightning-rod').immune).not.toContain('electric');
    expect(computeMatchups(['water'], 5, 'lightning-rod').immune).toContain('electric');
  });

  it('Levitate grants Ground immunity even when Ground is neutral', () => {
    expect(computeMatchups(['electric'], 3, 'levitate').immune).toContain('ground');
  });

  it('hyphenated genAbilityRows slugs match (Volt Absorb)', () => {
    const m = computeMatchups(['electric'], 3, 'volt-absorb');
    expect(m.immune).toContain('electric');
    expect(m.resist).not.toContain('electric');
  });
});

describe('computeMatchups — resist / wonder-guard abilities (Smogon, Serebii ability pages)', () => {
  it('Snorlax + Thick Fat: Fire and Ice become ×½, not neutral', () => {
    const bare = computeMatchups(['normal'], 3);
    expect(bare.resist).not.toContain('fire');
    expect(bare.resist).not.toContain('ice');
    const m = computeMatchups(['normal'], 3, 'thick-fat');
    expect(m).toEqual(genSplitMatchupsForSide(['normal'], 3, 'thick-fat'));
    expect(m.resist).toContain('fire');
    expect(m.resist).toContain('ice');
    expect(m.weak).not.toContain('fire');
  });

  it('Gen 1 ignores Thick Fat (no abilities)', () => {
    const m = computeMatchups(['normal'], 1, 'thick-fat');
    expect(m.resist).not.toContain('fire');
    expect(m.resist).not.toContain('ice');
  });

  it('Shedinja + Wonder Guard: non-SE types are immune', () => {
    const m = computeMatchups(['bug', 'ghost'], 3, 'wonder-guard');
    expect(m.immune).toContain('water');
    expect(m.immune).toContain('grass');
    expect(m.resist).not.toContain('water');
    expect(m.weak).toEqual(expect.arrayContaining(['fire', 'flying', 'rock', 'ghost', 'dark']));
    expect(m.quad).toEqual([]);
  });

  it('Aggron + Filter: SE hits drop to ×3 / ×1½, not the raw ×4 / ×2 chips', () => {
    const bare = computeMatchups(['steel', 'rock'], 4);
    expect(bare.quad).toEqual(expect.arrayContaining(['fighting', 'ground']));
    expect(bare.weak).toContain('water');
    const m = computeMatchups(['steel', 'rock'], 4, 'filter');
    expect(m.quad).toEqual([]);
    expect(m.weak).not.toContain('water');
    expect(m.extra).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ mult: 3, types: expect.arrayContaining(['fighting', 'ground']) }),
        expect.objectContaining({ mult: 1.5, types: expect.arrayContaining(['water']) }),
      ]),
    );
  });
});

describe('defaultMatchupAbility — first non-hidden, edition-gated', () => {
  const gengar = [
    { slug: 'cursed-body', hidden: false },
    { slug: 'levitate', hidden: true },
  ];
  const bronzong = [
    { slug: 'levitate', hidden: false },
    { slug: 'heatproof', hidden: false },
    { slug: 'heavy-metal', hidden: true },
  ];

  it('uses the first non-hidden ability (Bronzong Levitate, not Heatproof)', () => {
    expect(defaultMatchupAbility(bronzong, 'diamond-pearl')).toBe('levitate');
  });

  it('does not default to a hidden ability', () => {
    expect(defaultMatchupAbility(gengar, 'black-white')).toBe('cursed-body');
    expect(defaultMatchupAbility([{ slug: 'sheer-force', hidden: true }], 'x-y')).toBeNull();
  });

  it('returns null when the edition has no abilities (RBY, Let\'s Go)', () => {
    expect(defaultMatchupAbility(bronzong, 'red-blue')).toBeNull();
    expect(defaultMatchupAbility(bronzong, 'lets-go-pikachu-eevee')).toBeNull();
  });
});

describe('computeMatchups — types missing or different before gen 6', () => {
  it('gen 1: steel, dark and fairy do not appear in any bucket', () => {
    const m = computeMatchups(['normal'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['normal'], 1));
    const types = allAttacking(m);
    expect(types).not.toContain('steel');
    expect(types).not.toContain('dark');
    expect(types).not.toContain('fairy');
  });

  it('gen 2 steel: resists dark/ghost, fairy absent; gen 9 steel does not resist them', () => {
    const g2 = computeMatchups(['steel'], 2);
    expect(g2).toEqual(genSplitMatchupsForSide(['steel'], 2));
    expect(g2.resist).toContain('dark');
    expect(g2.resist).toContain('ghost');
    expect(allAttacking(g2)).not.toContain('fairy');

    const g9 = computeMatchups(['steel'], 9);
    expect(g9).toEqual(genSplitMatchupsForSide(['steel'], 9));
    expect(g9.resist).not.toContain('dark');
    expect(g9.resist).not.toContain('ghost');
    /* Fairy is on the gen-9 chart (absent in gen 2). Bucket follows
     * genSplitMatchupsForSide / @pkmn/data, not a hand-maintained SE list. */
    expect(allAttacking(g9)).toContain('fairy');
  });
});

describe('genOfVersionGroup', () => {
  it('maps move-pool version groups to the @pkmn generation number', () => {
    expect(genOfVersionGroup('red-blue')).toBe(1);
    expect(genOfVersionGroup('yellow')).toBe(1);
    expect(genOfVersionGroup('gold-silver')).toBe(2);
    expect(genOfVersionGroup('firered-leafgreen')).toBe(3);
    expect(genOfVersionGroup('x-y')).toBe(6);
    expect(genOfVersionGroup('scarlet-violet')).toBe(9);
  });

  it('defaults to gen 9 when the version group is missing', () => {
    expect(genOfVersionGroup(undefined)).toBe(9);
    expect(genOfVersionGroup('')).toBe(9);
  });
});

describe('detail move-pool version groups (every edition the picker can show)', () => {
  it('lists the same ids as the canonical version-groups table, newest first', () => {
    const detailKeys = VERSION_GROUPS.map((g) => g.key);
    const canonicalIds = [...CANONICAL_VERSION_GROUPS].reverse().map((g) => g.id);
    expect(detailKeys).toEqual(canonicalIds);
  });

  it('newestMoveVersionGroup keeps BDSP / LA / LGPE instead of falling through to SV', () => {
    const only = (vg: string) => [
      { version_group_details: [{ version_group: { name: vg } }] },
    ];
    expect(newestMoveVersionGroup(only('legends-arceus'))).toBe('legends-arceus');
    expect(newestMoveVersionGroup(only('brilliant-diamond-shining-pearl'))).toBe(
      'brilliant-diamond-shining-pearl',
    );
    expect(newestMoveVersionGroup(only('lets-go-pikachu-eevee'))).toBe('lets-go-pikachu-eevee');
    expect(newestMoveVersionGroup(only('lets-go-pikachu-lets-go-eevee'))).toBe('lets-go-pikachu-eevee');
    expect(newestMoveVersionGroup(only('colosseum'))).toBe('colosseum');
    expect(newestMoveVersionGroup(only('xd'))).toBe('xd');
  });

  it('presentEditionIds maps PokéAPI Let\'s Go slug to the app id', () => {
    const present = presentEditionIds(['lets-go-pikachu-lets-go-eevee', 'firered-leafgreen']);
    expect(present.has('lets-go-pikachu-eevee')).toBe(true);
    expect(present.has('firered-leafgreen')).toBe(true);
  });

  it('resolveMoveVersionGroup keeps Let\'s Go when the payload uses the API slug', () => {
    const moves = [
      {
        version_group_details: [{ version_group: { name: 'lets-go-pikachu-lets-go-eevee' } }],
      },
    ];
    expect(resolveMoveVersionGroup(moves, 'lets-go-pikachu-eevee')).toBe('lets-go-pikachu-eevee');
    expect(resolveMoveVersionGroup(moves, undefined)).toBe('lets-go-pikachu-eevee');
  });

  it('resolveMoveVersionGroup keeps a selected older edition when that edition teaches moves', () => {
    const moves = [
      {
        version_group_details: [
          { version_group: { name: 'scarlet-violet' } },
          { version_group: { name: 'firered-leafgreen' } },
          { version_group: { name: 'brilliant-diamond-shining-pearl' } },
        ],
      },
    ];
    expect(resolveMoveVersionGroup(moves, 'firered-leafgreen')).toBe('firered-leafgreen');
    expect(resolveMoveVersionGroup(moves, 'brilliant-diamond-shining-pearl')).toBe(
      'brilliant-diamond-shining-pearl',
    );
    expect(resolveMoveVersionGroup(moves, undefined)).toBe('scarlet-violet');
  });

  it('editionFromGameParam keeps ?game= on a present group and otherwise uses fallback', () => {
    const available = ['firered-leafgreen', 'heartgold-soulsilver', 'scarlet-violet'];
    expect(editionFromGameParam('firered', available, 'scarlet-violet')).toBe('firered-leafgreen');
    expect(editionFromGameParam('heartgold', available, 'scarlet-violet')).toBe('heartgold-soulsilver');
    expect(editionFromGameParam('black', available, 'scarlet-violet')).toBe('scarlet-violet');
    expect(editionFromGameParam(null, available, 'heartgold-soulsilver')).toBe('heartgold-soulsilver');
  });

  it('flavorMatchesGames joins display labels to edition slugs', () => {
    expect(flavorMatchesGames('Firered', ['firered', 'leafgreen'])).toBe(true);
    expect(flavorMatchesGames('Leafgreen', ['firered', 'leafgreen'])).toBe(true);
    expect(flavorMatchesGames('Heartgold', ['firered', 'leafgreen'])).toBe(false);
    expect(flavorMatchesGames('Black 2', ['black-2', 'white-2'])).toBe(true);
    expect(flavorMatchesGames('Omega Ruby', ['omega-ruby', 'alpha-sapphire'])).toBe(true);
    expect(flavorMatchesGames('Lets Go Pikachu', ['lets-go-pikachu', 'lets-go-eevee'])).toBe(true);
    expect(flavorMatchesGames('Scarlet', [])).toBe(true);
  });
});

const named = (name: string): NamedAPIResource => ({ name, url: '' });

function evoDetail(partial: Partial<EvolutionDetail>): EvolutionDetail {
  return {
    min_level: null,
    item: null,
    trigger: named('level-up'),
    held_item: null,
    time_of_day: '',
    min_happiness: null,
    min_affection: null,
    known_move_type: null,
    location: null,
    gender: null,
    known_move: null,
    min_beauty: null,
    needs_overworld_rain: false,
    party_species: null,
    party_type: null,
    relative_physical_stats: null,
    trade_species: null,
    turn_upside_down: false,
    ...partial,
  };
}

describe('pickAbilityShort', () => {
  const enOnly = {
    name: 'stench',
    effect_entries: [
      { short_effect: 'Has a 10% chance of making the foe flinch.', language: named('en') },
    ],
    flavor_text_entries: [] as Array<{ flavor_text: string; language: NamedAPIResource }>,
  };

  it('marks EN fallback when DE flavor is missing', () => {
    expect(pickAbilityShort(enOnly, 'de')).toEqual({
      text: 'Has a 10% chance of making the foe flinch.',
      enFallback: true,
    });
  });

  it('does not mark fallback for English or when DE flavor exists', () => {
    expect(pickAbilityShort(enOnly, 'en')).toEqual({
      text: 'Has a 10% chance of making the foe flinch.',
      enFallback: false,
    });
    const withDe = {
      ...enOnly,
      flavor_text_entries: [{ flavor_text: 'Lässt den Gegner zurückschrecken.', language: named('de') }],
    };
    expect(pickAbilityShort(withDe, 'de')).toEqual({
      text: 'Lässt den Gegner zurückschrecken.',
      enFallback: false,
    });
  });
});

describe('evoCondition — localized entity names', () => {
  it('uses nameOfMove / nameOfPokemon / nameOfLocation instead of titleCase', async () => {
    await loadGermanData();
    const known = evoCondition([evoDetail({ known_move: named('thunder-punch') })], 'de');
    expect(known.label).toContain(nameOfMove('thunder-punch', 'de'));
    expect(known.label).not.toContain('Thunder Punch');

    const party = evoCondition([evoDetail({ party_species: named('charizard') })], 'de');
    expect(party.label).toContain(nameOfPokemon('charizard', 'de'));
    expect(party.label).not.toContain('Charizard');

    const trade = evoCondition([evoDetail({ trade_species: named('mime-jr') })], 'en');
    expect(trade.label).toContain(nameOfPokemon('mime-jr', 'en'));
    expect(trade.label).toContain('Mime Jr.');

    const loc = evoCondition([evoDetail({ location: named('cerulean-cave') })], 'de');
    expect(loc.label).toContain(nameOfLocation('cerulean-cave', 'de'));
    expect(loc.label).not.toContain('Cerulean Cave');
  });
});
