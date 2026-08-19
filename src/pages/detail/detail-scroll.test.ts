import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../../..');

function readSrc(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf8');
}

/** Page-embedded dx-scroll panels must chain to Lenis at scroll edges (not trap wheel). */
describe('detail page scroll chaining', () => {
  it('MovesPanel dx-scroll does not use data-lenis-prevent', () => {
    const src = readSrc('src/pages/detail/MovesPanel.tsx');
    const panel = src.match(/dx-scroll[\s\S]*?overflow-auto[\s\S]*?>/)?.[0];
    expect(panel).toBeTruthy();
    expect(panel).not.toContain('data-lenis-prevent');
  });

  it('SpriteMuseum tile grid chains scroll to the page', () => {
    const src = readSrc('src/pages/detail/SpriteMuseum.tsx');
    const grid = src.match(/dx-scroll grid[\s\S]*?overflow-y-auto[\s\S]*?>/)?.[0];
    expect(grid).toBeTruthy();
    expect(grid).not.toContain('data-lenis-prevent');
  });

  it('WhereToFind location list chains scroll to the page', () => {
    const src = readSrc('src/pages/detail/WhereToFind.tsx');
    const list = src.match(/dx-scroll max-h-\[23rem\][\s\S]*?>/)?.[0];
    expect(list).toBeTruthy();
    expect(list).not.toContain('data-lenis-prevent');
  });

  it('EvolutionPanel remains the reference pattern (dx-scroll, no prevent)', () => {
    const src = readSrc('src/pages/detail/EvolutionPanel.tsx');
    const row = src.match(/dx-scroll overflow-x-auto[\s\S]*?>/)?.[0];
    expect(row).toBeTruthy();
    expect(row).not.toContain('data-lenis-prevent');
  });
});
