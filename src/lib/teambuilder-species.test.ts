import { describe, expect, it } from 'vitest';
import { defensiveSynergy, emptySlot, legalMoves, slotLegality } from './teambuilder';
import type { Pokemon } from './types';

function mon(
  rows: Array<{ move: string; vg: string; method: string; level: number }>,
): Pokemon {
  const byMove = new Map<string, Pokemon['moves'][number]>();
  for (const r of rows) {
    let slot = byMove.get(r.move);
    if (!slot) {
      slot = { move: { name: r.move, url: '' }, version_group_details: [] };
      byMove.set(r.move, slot);
    }
    slot.version_group_details.push({
      level_learned_at: r.level,
      move_learn_method: { name: r.method, url: '' },
      version_group: { name: r.vg, url: '' },
    });
  }
  return { moves: [...byMove.values()] } as Pokemon;
}

describe('legalMoves — Let\'s Go version-group alias', () => {
  it('returns PokéAPI Let\'s Go details when asked for the app vg id', () => {
    const p = mon([
      { move: 'thunder-shock', vg: 'lets-go-pikachu-lets-go-eevee', method: 'level-up', level: 1 },
      { move: 'ember', vg: 'firered-leafgreen', method: 'level-up', level: 1 },
    ]);
    expect(legalMoves(p, 'lets-go-pikachu-eevee').map((m) => m.name)).toEqual(['thunder-shock']);
    expect(legalMoves(p, 'firered-leafgreen').map((m) => m.name)).toEqual(['ember']);
  });
});

describe('slotLegality — empty learnset flags species', () => {
  it('flags Blaziken as illegal in FRLG when the payload has only Hoenn-edition moves', () => {
    const slot = emptySlot();
    slot.pokemon = 'blaziken';
    slot.pokemonId = 257;
    const payload = mon([
      { move: 'blaze-kick', vg: 'emerald', method: 'level-up', level: 36 },
      { move: 'flamethrower', vg: 'ruby-sapphire', method: 'machine', level: 0 },
    ]);
    const frlg = slotLegality(slot, 'firered-leafgreen', payload);
    expect(frlg.legal).toBe(false);
    expect(frlg.reasons.some((r) => r.key === 'species')).toBe(true);

    const emerald = slotLegality(slot, 'emerald', payload);
    expect(emerald.reasons.some((r) => r.key === 'species')).toBe(false);
    expect(emerald.legal).toBe(true);
  });

  it('keeps Charizard legal in FRLG when the payload has FRLG moves', () => {
    const slot = emptySlot();
    slot.pokemon = 'charizard';
    slot.pokemonId = 6;
    const payload = mon([
      { move: 'ember', vg: 'firered-leafgreen', method: 'level-up', level: 1 },
      { move: 'flamethrower', vg: 'firered-leafgreen', method: 'machine', level: 0 },
    ]);
    const result = slotLegality(slot, 'firered-leafgreen', payload);
    expect(result.reasons.some((r) => r.key === 'species')).toBe(false);
    expect(result.legal).toBe(true);
  });
});

describe('defensiveSynergy — gen-correct type rows', () => {
  const members = [{ types: ['fire' as const], ability: null }];

  it('omits Fairy in FRLG and includes it in SV', () => {
    const frlg = defensiveSynergy(members, 'firered-leafgreen').map((r) => r.type);
    const sv = defensiveSynergy(members, 'scarlet-violet').map((r) => r.type);
    expect(frlg).not.toContain('fairy');
    expect(sv).toContain('fairy');
  });
});
