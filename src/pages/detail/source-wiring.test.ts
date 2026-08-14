/* Detail-page source wiring — we do not own PokéAPI / @pkmn data.
 * These tests prove every surface reads the payload with the exact
 * edition + method + gen the UI selected. No silent fallback to SV. */
import { describe, expect, it } from 'vitest';
import { loadGermanData, nameOfAbility, nameOfMove, nameOfPokemon, nameOfType } from '@/lib/i18n-data';
import { learnsetFor, newestVersionGroup, type LearnMethod } from '@/lib/move-pool';
import { genAbilityRows, genMoveOf, genTypesOf } from '@/lib/gen-dex';
import { flavorsByVersion, pokemonTypes, statOf, totalBaseStats } from '@/lib/pokeapi';
import { POKEMON_TYPES, STAT_ORDER, genOf } from '@/lib/types';
import type { Pokemon, PokemonSpecies } from '@/lib/types';
import { VERSION_GROUPS, versionGroupById } from '@/lib/version-groups';
import { aggregate } from '@/lib/wherefind';
import {
  computeMatchups,
  editionFromGameParam,
  flavorMatchesGames,
  genOfVersionGroup,
  newestMoveVersionGroup,
  resolveMoveVersionGroup,
  VERSION_GROUPS as DETAIL_VGS,
} from './data';

const LEARN_METHODS: LearnMethod[] = ['level-up', 'machine', 'egg', 'tutor'];
const CANONICAL_IDS = VERSION_GROUPS.map((g) => g.id);

function oracleLearnset(p: Pokemon, vg: string, method: LearnMethod) {
  const bySlug = new Map<string, number>();
  for (const m of p.moves) {
    for (const d of m.version_group_details) {
      if (d.version_group.name !== vg || d.move_learn_method.name !== method) continue;
      const prev = bySlug.get(m.move.name);
      const lv = d.level_learned_at;
      if (prev == null || (lv > 0 && lv < prev)) bySlug.set(m.move.name, lv);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, level]) => ({ slug, level, method }))
    .sort((a, b) => a.level - b.level || a.slug.localeCompare(b.slug));
}

function denseMon(): Pokemon {
  const moves: Pokemon['moves'] = [];
  let n = 0;
  for (const vg of CANONICAL_IDS) {
    for (const method of LEARN_METHODS) {
      n += 1;
      const slug = `${method}-${vg}`.slice(0, 40);
      moves.push({
        move: { name: slug, url: '' },
        version_group_details: [
          {
            level_learned_at: method === 'level-up' ? n : 0,
            move_learn_method: { name: method, url: '' },
            version_group: { name: vg, url: '' },
          },
          /* poison: same move also listed on scarlet-violet so a leak is visible */
          {
            level_learned_at: 99,
            move_learn_method: { name: method, url: '' },
            version_group: { name: 'scarlet-violet', url: '' },
          },
        ],
      });
    }
  }
  return {
    id: 0,
    name: 'wiring-dummy',
    height: 17,
    weight: 905,
    base_experience: 267,
    stats: [
      { base_stat: 78, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 84, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 78, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 109, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 85, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 100, effort: 0, stat: { name: 'speed', url: '' } },
    ],
    types: [
      { slot: 1, type: { name: 'fire', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } },
    ],
    abilities: [
      { ability: { name: 'blaze', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'solar-power', url: '' }, is_hidden: true, slot: 3 },
    ],
    moves,
    species: { name: 'charizard', url: '' },
    sprites: { front_default: null, back_default: null, front_shiny: null, back_shiny: null },
  };
}

describe('edition tables stay one list', () => {
  it('detail picker ids === canonical version-groups, newest first', () => {
    expect(DETAIL_VGS.map((g) => g.key)).toEqual([...CANONICAL_IDS].reverse());
  });

  it('newestVersionGroup and newestMoveVersionGroup agree for every pair of editions', () => {
    for (const a of CANONICAL_IDS) {
      for (const b of CANONICAL_IDS) {
        const p = {
          moves: [
            {
              move: { name: 'a', url: '' },
              version_group_details: [
                {
                  level_learned_at: 1,
                  move_learn_method: { name: 'level-up', url: '' },
                  version_group: { name: a, url: '' },
                },
                {
                  level_learned_at: 1,
                  move_learn_method: { name: 'level-up', url: '' },
                  version_group: { name: b, url: '' },
                },
              ],
            },
          ],
        } as Pokemon;
        expect(newestVersionGroup(p)).toBe(newestMoveVersionGroup(p.moves));
      }
    }
  });
});

describe('learnsetFor — every edition × every method', () => {
  const p = denseMon();
  const cases = CANONICAL_IDS.flatMap((vg) => LEARN_METHODS.map((method) => ({ vg, method })));

  it(`covers ${CANONICAL_IDS.length} editions × ${LEARN_METHODS.length} methods`, () => {
    expect(cases).toHaveLength(CANONICAL_IDS.length * LEARN_METHODS.length);
  });

  it.each(cases)('$vg / $method equals an independent payload filter and does not leak SV', ({ vg, method }) => {
    const got = learnsetFor(p, vg, method);
    expect(got).toEqual(oracleLearnset(p, vg, method));
    if (vg !== 'scarlet-violet') {
      expect(got.every((e) => e.slug.endsWith(vg) || e.slug.includes(vg))).toBe(true);
      expect(got.some((e) => e.level === 99)).toBe(false);
    }
  });

  it('resolveMoveVersionGroup never substitutes a different present edition', () => {
    const moves = p.moves;
    for (const vg of CANONICAL_IDS) {
      expect(resolveMoveVersionGroup(moves, vg)).toBe(vg);
    }
    expect(resolveMoveVersionGroup(moves, 'not-a-game')).toBe('scarlet-violet');
  });
});

describe('stats / types / abilities / names — payload in, payload out', () => {
  const p = denseMon();

  it('statOf reads each base_stat; BST is the sum', () => {
    expect(STAT_ORDER.map((k) => statOf(p, k))).toEqual([78, 84, 78, 109, 85, 100]);
    expect(totalBaseStats(p)).toBe(78 + 84 + 78 + 109 + 85 + 100);
  });

  it('pokemonTypes keeps slot order', () => {
    expect(pokemonTypes(p)).toEqual(['fire', 'flying']);
  });

  it('hidden ability stays flagged, not dropped', () => {
    expect(p.abilities.map((a) => [a.ability.name, a.is_hidden])).toEqual([
      ['blaze', false],
      ['solar-power', true],
    ]);
  });

  it('i18n artifacts resolve the same slugs the API uses', async () => {
    await loadGermanData();
    expect(nameOfPokemon(6, 'de')).toBe('Glurak');
    expect(nameOfPokemon('charizard', 'de')).toBe('Glurak');
    expect(nameOfPokemon('charizard', 'en')).toBe('Charizard');
    expect(nameOfMove('flamethrower', 'de')).toBe('Flammenwurf');
    expect(nameOfAbility('blaze', 'de')).toBe('Großbrand');
    expect(nameOfType('fire', 'de')).toBe('Feuer');
  });

  it('generation comes from the national-dex range, not the move picker', () => {
    expect(genOf(6).gen).toBe(1);
    expect(genOf(155).gen).toBe(2);
    expect(genOf(258).gen).toBe(3);
    expect(genOf(390).gen).toBe(4);
    expect(genOf(495).gen).toBe(5);
    expect(genOf(653).gen).toBe(6);
    expect(genOf(725).gen).toBe(7);
    expect(genOf(813).gen).toBe(8);
    expect(genOf(909).gen).toBe(9);
  });
});

describe('resistances — gen follows the selected edition, chart follows @pkmn', () => {
  it('every canonical edition maps to its version-groups gen', () => {
    for (const vg of CANONICAL_IDS) {
      expect(genOfVersionGroup(vg)).toBe(versionGroupById(vg).gen);
    }
  });

  it('every edition × every defending type uses that gen’s chart', () => {
    for (const vg of CANONICAL_IDS) {
      const gen = genOfVersionGroup(vg);
      for (const def of POKEMON_TYPES) {
        expect(computeMatchups([def], gen)).toEqual(computeMatchups([def], versionGroupById(vg).gen));
      }
    }
  });

  it('Charizard fire/flying: Rock is ×4; Electric is ×2 (not Water/Flying)', () => {
    for (const vg of CANONICAL_IDS) {
      const m = computeMatchups(['fire', 'flying'], genOfVersionGroup(vg));
      expect(m.quad).toContain('rock');
      expect(m.weak).toContain('electric');
      expect(m.quad).not.toContain('electric');
    }
  });
});

describe('flavor text — language first, then version chip', () => {
  const species = {
    flavor_text_entries: [
      { flavor_text: 'EN red', language: { name: 'en', url: '' }, version: { name: 'red', url: '' } },
      { flavor_text: 'DE rot', language: { name: 'de', url: '' }, version: { name: 'red', url: '' } },
      { flavor_text: 'EN firered', language: { name: 'en', url: '' }, version: { name: 'firered', url: '' } },
    ],
  } as PokemonSpecies;

  it('de prefers German entries; en stays English', () => {
    expect(flavorsByVersion(species, 'de').map((f) => f.text)).toEqual(['DE rot']);
    expect(flavorsByVersion(species, 'en').map((f) => f.text)).toEqual(['EN red', 'EN firered']);
  });

  it('edition games drop flavor chips from other groups', () => {
    const en = flavorsByVersion(species, 'en');
    const frlg = en.filter((f) => flavorMatchesGames(f.version, ['firered', 'leafgreen']));
    expect(frlg.map((f) => f.text)).toEqual(['EN firered']);
    expect(en.filter((f) => flavorMatchesGames(f.version, ['red', 'blue'])).map((f) => f.text)).toEqual(['EN red']);
  });
});

describe('where-to-find — version chip is a hard filter', () => {
  const areas = [
    {
      location_area: { name: 'kanto-route-1-area', url: '' },
      version_details: [
        {
          version: { name: 'firered' },
          max_chance: 20,
          encounter_details: [{ chance: 20, min_level: 2, max_level: 4, method: { name: 'walk' } }],
        },
        {
          version: { name: 'heartgold' },
          max_chance: 45,
          encounter_details: [{ chance: 45, min_level: 2, max_level: 3, method: { name: 'walk' } }],
        },
      ],
    },
  ];

  it('each game slug in the atlas groups only keeps its own rate', () => {
    const fr = aggregate(areas, 'firered');
    const hg = aggregate(areas, 'heartgold');
    expect(fr).toHaveLength(1);
    expect(hg).toHaveLength(1);
    expect(fr[0]!.maxChance).toBe(20);
    expect(hg[0]!.maxChance).toBe(45);
    expect(aggregate(areas, 'black')).toHaveLength(0);
    expect(aggregate(areas, 'scarlet')).toHaveLength(0);
  });

  it('an edition game list keeps sibling games and drops the rest', () => {
    const frlg = aggregate(areas, ['firered', 'leafgreen']);
    expect(frlg).toHaveLength(1);
    expect(frlg[0]!.versions).toEqual(['firered']);
    expect(frlg[0]!.maxChance).toBe(20);
    expect(aggregate(areas, ['black', 'white'])).toHaveLength(0);
  });
});

describe('global edition — types, abilities, move meta, ?game=', () => {
  it('Magnemite matchups follow Electric-only in RB, Electric/Steel from GS', () => {
    const rb = genTypesOf('red-blue', 'magnemite', ['normal']);
    const gs = genTypesOf('gold-silver', 'magnemite', ['normal']);
    expect(rb).toEqual(['electric']);
    expect(gs).toEqual(['electric', 'steel']);
    expect(computeMatchups(rb, 1).immune).not.toContain('poison');
    expect(computeMatchups(gs, 2).immune).toContain('poison');
  });

  it('Charizard has no abilities in RB and Blaze-only in Emerald', () => {
    expect(genAbilityRows('red-blue', 'charizard')).toEqual([]);
    expect(genAbilityRows('emerald', 'charizard').map((a) => a.slug)).toEqual(['blaze']);
  });

  it('Thunderbolt power follows the edition, not current PokéAPI', () => {
    expect(genMoveOf('firered-leafgreen', 'thunderbolt')?.power).toBe(95);
    expect(genMoveOf('x-y', 'thunderbolt')?.power).toBe(90);
  });

  it('?game= stays on a present edition and otherwise uses the newest learnset', () => {
    const available = ['firered-leafgreen', 'heartgold-soulsilver', 'scarlet-violet'];
    expect(editionFromGameParam('firered', available, 'scarlet-violet')).toBe('firered-leafgreen');
    expect(editionFromGameParam('black', available, 'scarlet-violet')).toBe('scarlet-violet');
  });
});
