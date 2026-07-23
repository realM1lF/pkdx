import { describe, expect, it } from 'vitest';
import { spriteEraForVersus, spriteFallbackChain } from './sprites';

describe('spriteEraForVersus', () => {
  it('maps each calc gen to its own sprite era', () => {
    expect(spriteEraForVersus(1, 95)).toBe('gen1');
    expect(spriteEraForVersus(2, 3)).toBe('gen2');
    expect(spriteEraForVersus(3, 95)).toBe('gen3');
    expect(spriteEraForVersus(4, 3)).toBe('gen4');
    expect(spriteEraForVersus(5, 95)).toBe('gen5');
    expect(spriteEraForVersus(6, 3)).toBe('gen6');
    expect(spriteEraForVersus(7, 95)).toBe('gen7');
    expect(spriteEraForVersus(8, 3)).toBe('gen8');
    expect(spriteEraForVersus(9, 1025)).toBe('gen9');
  });

  it('does not reuse gen5 for later gens (regression: Onix/Venusaur looked identical)', () => {
    expect(spriteEraForVersus(6, 95)).not.toBe('gen5');
    expect(spriteEraForVersus(9, 3)).not.toBe('gen5');
  });
});

describe('gen 8/9 fallback chains', () => {
  it('gen8 primary is SW/SH icon path', () => {
    expect(spriteFallbackChain('gen8', 810)[0]).toContain('generation-viii/icons/810');
  });

  it('gen9 primary is SV path', () => {
    expect(spriteFallbackChain('gen9', 906)[0]).toContain('generation-ix/scarlet-violet/906');
  });

  it('falls back to home then bundled menu for missing gen-native assets', () => {
    const chain = spriteFallbackChain('gen9', 95);
    expect(chain[0]).toContain('generation-ix/scarlet-violet/95');
    expect(chain.some((u) => u.includes('/other/home/95'))).toBe(true);
    expect(chain.some((u) => u.includes('/sprites/pokemon/95.png'))).toBe(true);
  });
});
