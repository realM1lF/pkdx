import { describe, expect, it } from 'vitest';
import { emptySlot, slotLegality } from './teambuilder';

describe('slotLegality — catalogued formes', () => {
  it('flags Mega Charizard X as an illegal species in RBY', () => {
    const slot = emptySlot();
    slot.pokemon = 'charizard-mega-x';
    slot.pokemonId = 10034;
    const result = slotLegality(slot, 'red-blue', undefined);
    expect(result.legal).toBe(false);
    expect(result.reasons.some((r) => r.key === 'species')).toBe(true);
  });

  it('does not flag Mega Charizard X as missing in ORAS', () => {
    const slot = emptySlot();
    slot.pokemon = 'charizard-mega-x';
    slot.pokemonId = 10034;
    const result = slotLegality(slot, 'omega-ruby-alpha-sapphire', undefined);
    expect(result.reasons.some((r) => r.key === 'species')).toBe(false);
  });
});
