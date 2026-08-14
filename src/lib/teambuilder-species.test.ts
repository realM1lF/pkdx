import { describe, expect, it } from 'vitest';
import { genMoveOf } from './gen-dex';
import {
  coverTypesFor,
  defensiveSynergy,
  emptySlot,
  legalMoves,
  moveTypeForCoverage,
  offensiveCoverage,
  seTypesAgainst,
  slotLegality,
} from './teambuilder';
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

describe('slotLegality — empty learnset vs species-not-in-game', () => {
  it('flags Blaziken in FRLG as noLearnset: gen 3 has the species, the FRLG payload has no moves', () => {
    const slot = emptySlot();
    slot.pokemon = 'blaziken';
    slot.pokemonId = 257;
    const payload = mon([
      { move: 'blaze-kick', vg: 'emerald', method: 'level-up', level: 36 },
      { move: 'flamethrower', vg: 'ruby-sapphire', method: 'machine', level: 0 },
    ]);
    const frlg = slotLegality(slot, 'firered-leafgreen', payload);
    expect(frlg.legal).toBe(false);
    expect(frlg.reasons.some((r) => r.key === 'noLearnset')).toBe(true);
    expect(frlg.reasons.some((r) => r.key === 'species')).toBe(false);

    const emerald = slotLegality(slot, 'emerald', payload);
    expect(emerald.reasons.some((r) => r.key === 'species')).toBe(false);
    expect(emerald.reasons.some((r) => r.key === 'noLearnset')).toBe(false);
    expect(emerald.legal).toBe(true);
  });

  it('keeps species when the mon is not in the VG gen, even if the learnset is also empty', () => {
    const slot = emptySlot();
    slot.pokemon = 'lucario';
    slot.pokemonId = 448;
    const payload = mon([
      { move: 'aura-sphere', vg: 'diamond-pearl', method: 'level-up', level: 1 },
    ]);
    const frlg = slotLegality(slot, 'firered-leafgreen', payload);
    expect(frlg.legal).toBe(false);
    expect(frlg.reasons.some((r) => r.key === 'species')).toBe(true);
    expect(frlg.reasons.some((r) => r.key === 'noLearnset')).toBe(false);
  });

  it('flags an in-VG species with an empty learnset as noLearnset, not species', () => {
    const slot = emptySlot();
    slot.pokemon = 'deoxys';
    slot.pokemonId = 386;
    const payload = mon([
      { move: 'psycho-boost', vg: 'diamond-pearl', method: 'level-up', level: 89 },
      { move: 'zen-headbutt', vg: 'scarlet-violet', method: 'machine', level: 0 },
    ]);
    const frlg = slotLegality(slot, 'firered-leafgreen', payload);
    expect(frlg.legal).toBe(false);
    expect(frlg.reasons.some((r) => r.key === 'noLearnset')).toBe(true);
    expect(frlg.reasons.some((r) => r.key === 'species')).toBe(false);
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
    expect(frlg).not.toContain('???');
    expect(sv).toContain('fairy');
  });

  it('omits ??? on Crystal / gen 2', () => {
    const crystal = defensiveSynergy(members, 'crystal').map((r) => r.type);
    expect(crystal).not.toContain('???');
    expect(crystal).not.toContain('fairy');
  });
});

describe('offensive coverage — gen-scoped types', () => {
  const vg = 'firered-leafgreen';

  it('offensiveCoverage / coverTypesFor / seTypesAgainst omit fairy and ??? in FRLG', () => {
    const cov = offensiveCoverage([], vg);
    expect(Object.keys(cov.se)).not.toContain('fairy');
    expect(Object.keys(cov.se)).not.toContain('???');
    expect(cov.gaps).not.toContain('fairy');
    expect(cov.gaps).not.toContain('???');

    const cover = coverTypesFor('fire', vg);
    expect([...cover.resists, ...cover.immunes]).not.toContain('fairy');
    expect([...cover.resists, ...cover.immunes]).not.toContain('???');

    expect(seTypesAgainst('fire', vg)).not.toContain('fairy');
    expect(seTypesAgainst('fire', vg)).not.toContain('???');
  });

  it('Bite in red-blue is Normal and coverage does not treat it as Dark', () => {
    expect(genMoveOf('red-blue', 'bite')?.type).toBe('normal');
    expect(moveTypeForCoverage('red-blue', 'bite', 'dark')).toBe('normal');

    const rby = offensiveCoverage([{ name: 'bite', type: 'normal', stab: false }], 'red-blue');
    const gs = offensiveCoverage([{ name: 'bite', type: 'dark', stab: false }], 'gold-silver');
    expect(rby.se.psychic ?? []).toHaveLength(0);
    expect((gs.se.psychic ?? []).length).toBeGreaterThan(0);
  });
});
