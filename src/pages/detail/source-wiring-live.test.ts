/* Live PokéAPI wiring — real payloads, every canonical edition × method.
 * Skips only if the network is down. Failure = we drifted from the source. */
import { describe, expect, it } from 'vitest';
import { genAbilityRows, genMoveOf, genTypesOf } from '@/lib/gen-dex';
import { learnsetFor, sameVersionGroup, type LearnMethod } from '@/lib/move-pool';
import { pokemonTypes, statOf, totalBaseStats } from '@/lib/pokeapi';
import { STAT_ORDER } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import type { Pokemon } from '@/lib/types';
import { VERSION_GROUPS } from '@/lib/version-groups';

const LEARN_METHODS: LearnMethod[] = ['level-up', 'machine', 'egg', 'tutor'];
const SAMPLE = ['6', '25', '36', '81', '94', '133', '808', 'growlithe-hisui'] as const;

function oracle(p: Pokemon, vg: string, method: LearnMethod) {
  const bySlug = new Map<string, number>();
  for (const m of p.moves) {
    for (const d of m.version_group_details) {
      if (!sameVersionGroup(d.version_group.name, vg) || d.move_learn_method.name !== method) continue;
      const prev = bySlug.get(m.move.name);
      const lv = d.level_learned_at;
      if (prev == null || (lv > 0 && lv < prev)) bySlug.set(m.move.name, lv);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, level]) => ({ slug, level, method }))
    .sort((a, b) => a.level - b.level || a.slug.localeCompare(b.slug));
}

async function fetchPokemon(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`PokéAPI ${res.status} for ${id}`);
  return res.json() as Promise<Pokemon>;
}

describe('live PokéAPI — sample species, all editions × methods', () => {
  it(
    'learnsetFor / stats / types / abilities equal the payload for every sample',
    async () => {
      const loaded: Array<{ id: string; p: Pokemon }> = [];
      for (const id of SAMPLE) {
        loaded.push({ id, p: await fetchPokemon(id) });
      }

      expect(loaded.map((x) => x.p.name)).toEqual([
        'charizard',
        'pikachu',
        'clefable',
        'magnemite',
        'gengar',
        'eevee',
        'meltan',
        'growlithe-hisui',
      ]);

      for (const { id, p } of loaded) {
        expect(pokemonTypes(p)).toEqual(
          [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
        );
        expect(STAT_ORDER.map((k) => statOf(p, k))).toEqual(
          STAT_ORDER.map((k) => p.stats.find((s) => s.stat.name === k)?.base_stat ?? 0),
        );
        expect(totalBaseStats(p)).toBe(p.stats.reduce((s, x) => s + x.base_stat, 0));
        expect(p.abilities.some((a) => a.is_hidden) || p.abilities.length >= 1).toBe(true);

        for (const vg of VERSION_GROUPS) {
          for (const method of LEARN_METHODS) {
            expect(learnsetFor(p, vg.id, method), `${id} ${vg.id} ${method}`).toEqual(
              oracle(p, vg.id, method),
            );
          }
        }
      }

      const charizard = loaded[0]!.p;
      const frlg = learnsetFor(charizard, 'firered-leafgreen', 'level-up').map((e) => e.slug);
      const sv = learnsetFor(charizard, 'scarlet-violet', 'level-up').map((e) => e.slug);
      expect(frlg).toContain('wing-attack');
      expect(frlg).not.toContain('air-slash');
      expect(sv).toContain('air-slash');
      expect(sv).not.toContain('wing-attack');
      expect(learnsetFor(charizard, 'scarlet-violet', 'machine').some((e) => e.slug === 'tera-blast')).toBe(
        true,
      );
      expect(learnsetFor(charizard, 'firered-leafgreen', 'machine').some((e) => e.slug === 'tera-blast')).toBe(
        false,
      );

      const hisui = loaded[7]!.p;
      expect(learnsetFor(hisui, 'legends-arceus', 'level-up').length).toBeGreaterThan(0);
      expect(learnsetFor(hisui, 'red-blue', 'level-up')).toEqual([]);

      const magnemite = loaded[3]!.p;
      const apiMag = pokemonTypes(magnemite) as PokemonType[];
      expect(genTypesOf('red-blue', magnemite.name, apiMag)).toEqual(['electric']);
      expect(genTypesOf('gold-silver', magnemite.name, apiMag)).toEqual(['electric', 'steel']);

      const clefable = loaded[2]!.p;
      const apiCle = pokemonTypes(clefable) as PokemonType[];
      expect(genTypesOf('black-white', clefable.name, apiCle)).toEqual(['normal']);
      expect(genTypesOf('x-y', clefable.name, apiCle)).toEqual(['fairy']);

      expect(genAbilityRows('red-blue', charizard.name)).toEqual([]);
      expect(genAbilityRows('emerald', charizard.name).map((a) => a.slug)).toEqual(['blaze']);
      expect(genMoveOf('firered-leafgreen', 'thunderbolt')?.power).toBe(95);
      expect(genMoveOf('x-y', 'thunderbolt')?.power).toBe(90);
    },
    60_000,
  );
});
