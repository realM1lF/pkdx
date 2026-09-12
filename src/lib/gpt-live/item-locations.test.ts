import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { executeRegisteredTool } from './registry';
import { ITEM_LOCATIONS, itemIndexEntryCount, itemLocationsFromArgs, itemLocationsPair } from './item-locations';

const ROOT = resolve(import.meta.dirname, '../../..');

describe('itemLocationsPair', () => {
  it('finds Potion on Route 1 from the curated index', () => {
    expect(itemIndexEntryCount()).toBeGreaterThan(0);
    const result = itemLocationsPair('Potion', 'firered');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.locations.some((l) => l.nodeId === 'kanto-route-1')).toBe(true);
  });

  it('resolves German Trank', () => {
    const result = itemLocationsPair('Trank', 'firered');
    expect(result).toMatchObject({ ok: true, itemSlug: 'potion' });
  });

  it('rejects unknown items without guessing', () => {
    expect(itemLocationsPair('NotAnItemEver', 'firered')).toMatchObject({
      ok: false,
      error: 'unknown_item',
    });
  });

  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      ITEM_LOCATIONS,
      { item_query: 'Potion', game: 'firered' },
      {},
    );
    expect(result).toMatchObject({ ok: true, itemSlug: 'potion' });
  });

  it('allows null game for item-only lookup', () => {
    const result = itemLocationsFromArgs({ item_query: 'Potion', game: null }, {});
    expect(result.ok).toBe(true);
  });
});

describe('wrapper contract', () => {
  it('builds a reverse index over itemsForNode', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/item-locations.ts'), 'utf8');
    expect(src).toContain('itemsForNode');
    expect(src).toContain('buildItemIndex');
    expect(src).not.toContain('pokeapi.co');
  });
});
