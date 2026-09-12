import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { Pokemon } from '@/lib/types';
import { executeRegisteredTool } from './registry';
import {
  CHECK_SLOT_LEGALITY,
  checkSlotLegalityFromArgs,
  checkSlotLegalityPair,
} from './check-slot-legality';

const ROOT = resolve(import.meta.dirname, '../../..');

function mon(
  rows: Array<{ move: string; vg: string; method?: string; level: number }>,
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
      move_learn_method: { name: r.method ?? 'level-up', url: '' },
      version_group: { name: r.vg, url: '' },
    });
  }
  return { moves: [...byMove.values()] } as Pokemon;
}

const charizardPayload = mon([
  { move: 'ember', vg: 'firered-leafgreen', level: 1 },
  { move: 'flamethrower', vg: 'firered-leafgreen', method: 'machine', level: 0 },
]);

const blazikenPayload = mon([
  { move: 'blaze-kick', vg: 'emerald', level: 36 },
  { move: 'flamethrower', vg: 'ruby-sapphire', method: 'machine', level: 0 },
]);

const lucarioPayload = mon([{ move: 'aura-sphere', vg: 'diamond-pearl', level: 1 }]);

vi.mock('@/lib/pokeapi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pokeapi')>();
  return {
    ...actual,
    getPokemon: vi.fn(async (slug: string) => {
      if (slug === 'charizard') return charizardPayload;
      if (slug === 'blaziken') return blazikenPayload;
      if (slug === 'lucario') return lucarioPayload;
      throw new Error(`unknown pokemon ${slug}`);
    }),
  };
});

describe('checkSlotLegalityPair — mirrors teambuilder-species cases', () => {
  it('keeps Charizard legal in FRLG with FRLG moves', async () => {
    const result = await checkSlotLegalityPair('Charizard', 'firered', {
      moves: ['flamethrower', 'ember'],
      item: null,
      ability: null,
      nature: null,
    });
    expect(result).toMatchObject({
      ok: true,
      legal: true,
      species: { slug: 'charizard' },
      game: { versionGroup: 'firered-leafgreen' },
      moves_checked: ['flamethrower', 'ember'],
    });
  });

  it('flags Blaziken in FRLG as noLearnset when the payload has no FRLG moves', async () => {
    const result = await checkSlotLegalityPair('Blaziken', 'firered', {
      moves: null,
      item: null,
      ability: null,
      nature: null,
    });
    expect(result).toMatchObject({ ok: true, legal: false, species: { slug: 'blaziken' } });
    if (result.ok) {
      expect(result.reasons.some((r) => r.key === 'noLearnset')).toBe(true);
      expect(result.reasons.some((r) => r.key === 'species')).toBe(false);
    }
  });

  it('flags Lucario in FRLG as species-not-in-game', async () => {
    const result = await checkSlotLegalityPair('Lucario', 'firered', {
      moves: null,
      item: null,
      ability: null,
      nature: null,
    });
    expect(result).toMatchObject({ ok: false, error: 'not_in_game', species: { slug: 'lucario' } });
  });

  it('flags an illegal move in the wrong version group', async () => {
    const result = await checkSlotLegalityPair('Charizard', 'firered', {
      moves: ['aura-sphere'],
      item: null,
      ability: null,
      nature: null,
    });
    expect(result).toMatchObject({ ok: true, legal: false, species: { slug: 'charizard' } });
    if (result.ok) {
      expect(result.reasons.some((r) => r.key === 'move' && r.param === 'aura-sphere')).toBe(true);
    }
  });

  it('resolves German move names', async () => {
    const result = await checkSlotLegalityPair('Glurak', 'feuerrot', {
      moves: ['Flammenwurf'],
      item: null,
      ability: null,
      nature: null,
    });
    expect(result).toMatchObject({
      ok: true,
      legal: true,
      moves_checked: ['flamethrower'],
    });
  });
});

describe('check_slot_legality registry', () => {
  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      CHECK_SLOT_LEGALITY,
      {
        species_query: 'Charizard',
        game: 'firered',
        moves: ['flamethrower'],
        item: null,
        ability: null,
        nature: null,
      },
      {},
    );
    expect(result).toMatchObject({ ok: true, legal: true, species: { slug: 'charizard' } });
    expect(await checkSlotLegalityFromArgs(
      {
        species_query: 'Charizard',
        game: 'firered',
        moves: ['flamethrower'],
        item: null,
        ability: null,
        nature: null,
      },
      {},
    )).toEqual(result);
  });
});

describe('wrapper contract', () => {
  it('calls slotLegality from teambuilder.ts', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/check-slot-legality.ts'), 'utf8');
    expect(src).toContain('slotLegality');
    expect(src).toContain('resolveSpecies');
    expect(src).toContain('resolveGame');
    expect(src).not.toMatch(/saveTeam\s*\(/);
  });
});
