/* Detail-page defensive matchups must follow @pkmn/data via the Versus
 * helpers — not a hardcoded Gen-VI+ chart. Versus tests are the oracle. */
import { describe, expect, it } from 'vitest';
import { genSplitMatchupsForSide } from '@/lib/versus';
import { VERSION_GROUPS as CANONICAL_VERSION_GROUPS } from '@/lib/version-groups';
import { loadGermanData, nameOfLocation, nameOfMove, nameOfPokemon } from '@/lib/i18n-data';
import type { EvolutionDetail, NamedAPIResource, PokemonType } from '@/lib/types';
import { genAbilityRows, genTypesOf } from '@/lib/gen-dex';
import { clampMatchupAbility, computeMatchups, defaultMatchupAbility, editionFromGameParam, evoCondition, flavorMatchesGames, genOfVersionGroup, matchupAbilityOptions, newestMoveVersionGroup, pickAbilityShort, presentEditionIds, resolveMoveVersionGroup, VERSION_GROUPS } from './data';

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

  it('Snorlax + Immunity: Poison is immune (Bulbapedia / Showdown Immunity)', () => {
    const bare = computeMatchups(['normal'], 3);
    expect(bare.immune).not.toContain('poison');
    const m = computeMatchups(['normal'], 3, 'immunity');
    expect(m).toEqual(genSplitMatchupsForSide(['normal'], 3, 'immunity'));
    expect(m.immune).toContain('poison');
    expect(m.weak).not.toContain('poison');
    expect(m.resist).not.toContain('poison');
  });

  it('Gen 1 ignores Immunity (no abilities)', () => {
    const m = computeMatchups(['normal'], 1, 'immunity');
    expect(m.immune).not.toContain('poison');
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

describe('matchupAbilityOptions — switcher only for distinct defensive tables', () => {
  const bulbasaur = [
    { slug: 'overgrow', hidden: false },
    { slug: 'chlorophyll', hidden: true },
  ];
  const snorlax = [
    { slug: 'immunity', hidden: false },
    { slug: 'thick-fat', hidden: false },
  ];
  const bronzong = [
    { slug: 'levitate', hidden: false },
    { slug: 'heatproof', hidden: false },
    { slug: 'heavy-metal', hidden: true },
  ];
  const shedinja = [{ slug: 'wonder-guard', hidden: false }];
  const rodStatic = [
    { slug: 'lightning-rod', hidden: false },
    { slug: 'static', hidden: false },
  ];

  it('returns [] when every ability matches the bare type chart (Bulbasaur)', () => {
    expect(matchupAbilityOptions(bulbasaur, ['grass', 'poison'], 9, 'scarlet-violet')).toEqual([]);
  });

  it('lists Snorlax Immunity and Thick Fat, default Immunity', () => {
    expect(matchupAbilityOptions(snorlax, ['normal'], 3, 'emerald')).toEqual(['immunity', 'thick-fat']);
    expect(defaultMatchupAbility(snorlax, 'emerald')).toBe('immunity');
  });

  it('lists Bronzong Levitate / Heatproof / Heavy Metal; Heavy Metal equals bare types', () => {
    const types = ['steel', 'psychic'];
    expect(matchupAbilityOptions(bronzong, types, 4, 'diamond-pearl')).toEqual([
      'levitate',
      'heatproof',
      'heavy-metal',
    ]);
    expect(defaultMatchupAbility(bronzong, 'diamond-pearl')).toBe('levitate');
    expect(computeMatchups(types, 4, 'heavy-metal')).toEqual(computeMatchups(types, 4));
  });

  it('returns [] for Shedinja Wonder Guard (single table; chips still use the default)', () => {
    expect(matchupAbilityOptions(shedinja, ['bug', 'ghost'], 3, 'emerald')).toEqual([]);
    expect(defaultMatchupAbility(shedinja, 'emerald')).toBe('wonder-guard');
  });

  it('returns [] and default null in red-blue / Let\'s Go / Legends Arceus', () => {
    expect(matchupAbilityOptions(bronzong, ['steel', 'psychic'], 1, 'red-blue')).toEqual([]);
    expect(matchupAbilityOptions(bronzong, ['steel', 'psychic'], 7, 'lets-go-pikachu-eevee')).toEqual([]);
    expect(matchupAbilityOptions(bronzong, ['steel', 'psychic'], 8, 'legends-arceus')).toEqual([]);
    expect(defaultMatchupAbility(bronzong, 'red-blue')).toBeNull();
    expect(defaultMatchupAbility(bronzong, 'lets-go-pikachu-eevee')).toBeNull();
    expect(defaultMatchupAbility(bronzong, 'legends-arceus')).toBeNull();
  });

  it('Lightning Rod equals bare types in gen 4 and differs in gen 5', () => {
    const types = ['water'];
    expect(computeMatchups(types, 4, 'lightning-rod')).toEqual(computeMatchups(types, 4));
    expect(computeMatchups(types, 5, 'lightning-rod')).not.toEqual(computeMatchups(types, 5));
    expect(matchupAbilityOptions(rodStatic, ['electric'], 4, 'diamond-pearl')).toEqual([]);
    expect(matchupAbilityOptions(rodStatic, ['electric'], 5, 'black-white')).toEqual([
      'lightning-rod',
      'static',
    ]);
  });
});

describe('clampMatchupAbility — invalid selection falls back to default', () => {
  const bronzongOpts = ['levitate', 'heatproof', 'heavy-metal'];

  it('keeps a selection that is still in the option list', () => {
    expect(clampMatchupAbility('heatproof', bronzongOpts, 'levitate')).toBe('heatproof');
  });

  it('clamps onto the default after a version-group change drops the selection', () => {
    expect(clampMatchupAbility('heatproof', [], null)).toBeNull();
    expect(clampMatchupAbility('heatproof', ['immunity', 'thick-fat'], 'immunity')).toBe('immunity');
  });

  it('uses the default when there is no switcher (Shedinja)', () => {
    expect(clampMatchupAbility('wonder-guard', [], 'wonder-guard')).toBe('wonder-guard');
  });
});

function liveSwitcher(slug: string, vg: string, fallbackTypes: PokemonType[]) {
  const types = genTypesOf(vg, slug, fallbackTypes);
  const abilities = genAbilityRows(vg, slug);
  const gen = genOfVersionGroup(vg);
  const options = matchupAbilityOptions(abilities, types, gen, vg);
  const fallback = defaultMatchupAbility(abilities, vg);
  return { types, abilities, gen, options, fallback, picked: clampMatchupAbility(null, options, fallback) };
}

describe('matchupAbilityOptions — live genAbilityRows across editions', () => {
  it('Bulbasaur / Charizard stay off: every ability is a no-op', () => {
    expect(liveSwitcher('bulbasaur', 'scarlet-violet', ['grass', 'poison']).options).toEqual([]);
    expect(liveSwitcher('charizard', 'emerald', ['fire', 'flying']).options).toEqual([]);
    expect(liveSwitcher('charizard', 'black-white', ['fire', 'flying']).options).toEqual([]);
  });

  it('Snorlax keeps Immunity + Thick Fat; Gluttony is the bare-type path from BW', () => {
    const e = liveSwitcher('snorlax', 'emerald', ['normal']);
    expect(e.options).toEqual(['immunity', 'thick-fat']);
    expect(e.fallback).toBe('immunity');
    const bw = liveSwitcher('snorlax', 'black-white', ['normal']);
    expect(bw.abilities.map((a) => a.slug)).toEqual(['immunity', 'thick-fat', 'gluttony']);
    expect(bw.options).toEqual(['immunity', 'thick-fat', 'gluttony']);
  });

  it('Bronzong: Heatproof + Levitate in DP; Heavy Metal joins from BW', () => {
    const dp = liveSwitcher('bronzong', 'diamond-pearl', ['steel', 'psychic']);
    expect(dp.abilities.map((a) => a.slug)).toEqual(['levitate', 'heatproof']);
    expect(dp.options).toEqual(['levitate', 'heatproof']);
    expect(dp.fallback).toBe('levitate');
    const bw = liveSwitcher('bronzong', 'black-white', ['steel', 'psychic']);
    expect(bw.options).toEqual(['levitate', 'heatproof', 'heavy-metal']);
    expect(liveSwitcher('bronzong', 'legends-arceus', ['steel', 'psychic']).options).toEqual([]);
    expect(liveSwitcher('bronzong', 'red-blue', ['steel', 'psychic']).fallback).toBeNull();
  });

  it('Shedinja / Flygon stay on the single defensive ability without a switcher', () => {
    const shed = liveSwitcher('shedinja', 'emerald', ['bug', 'ghost']);
    expect(shed.options).toEqual([]);
    expect(shed.fallback).toBe('wonder-guard');
    expect(JSON.stringify(computeMatchups(shed.types, shed.gen, 'wonder-guard'))).not.toBe(
      JSON.stringify(computeMatchups(shed.types, shed.gen)),
    );
    const fly = liveSwitcher('flygon', 'emerald', ['ground', 'dragon']);
    expect(fly.options).toEqual([]);
    expect(fly.fallback).toBe('levitate');
  });

  it('Gengar never gets a switcher: one ability per era (Levitate, then Cursed Body)', () => {
    const e = liveSwitcher('gengar', 'emerald', ['ghost', 'poison']);
    expect(e.abilities.map((a) => a.slug)).toEqual(['levitate']);
    expect(e.options).toEqual([]);
    expect(e.fallback).toBe('levitate');
    const bw = liveSwitcher('gengar', 'black-white', ['ghost', 'poison']);
    expect(bw.options).toEqual([]);
    expect(bw.fallback).toBe('levitate');
    const sm = liveSwitcher('gengar', 'sun-moon', ['ghost', 'poison']);
    expect(sm.options).toEqual([]);
    expect(sm.fallback).toBe('cursed-body');
  });

  it('Manectric Lightning Rod is a no-op in Emerald and a second table from BW', () => {
    const e = liveSwitcher('manectric', 'emerald', ['electric']);
    expect(e.options).toEqual([]);
    const bw = liveSwitcher('manectric', 'black-white', ['electric']);
    expect(bw.options).toEqual(['static', 'lightning-rod']);
    expect(bw.fallback).toBe('static');
  });

  it('clamps Heatproof onto null when the edition loses abilities', () => {
    const dp = liveSwitcher('bronzong', 'diamond-pearl', ['steel', 'psychic']);
    const la = liveSwitcher('bronzong', 'legends-arceus', ['steel', 'psychic']);
    expect(clampMatchupAbility('heatproof', la.options, la.fallback)).toBeNull();
    expect(clampMatchupAbility('heatproof', dp.options, dp.fallback)).toBe('heatproof');
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
