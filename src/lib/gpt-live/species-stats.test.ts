import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSpeciesStats, getSpeciesStatsFromArgs, resolveGame, resolveSpecies } from './species-stats';

const ROOT = resolve(import.meta.dirname, '../../..');

describe('resolveSpecies', () => {
  it('maps Glurak and Charizard to the same species', () => {
    const de = resolveSpecies('Glurak');
    const en = resolveSpecies('Charizard');
    const num = resolveSpecies('6');
    expect(de).toMatchObject({ id: 6, slug: 'charizard', nameDe: 'Glurak', nameEn: 'Charizard' });
    expect(en).toEqual(de);
    expect(num).toEqual(de);
  });

  it('accepts other German names', () => {
    expect(resolveSpecies('Bisasam')?.slug).toBe('bulbasaur');
    expect(resolveSpecies('Mewtu')?.slug).toBe('mewtwo');
  });
});

describe('resolveGame', () => {
  it('maps rote Edition / red to Red-Blue (Gen I)', () => {
    expect(resolveGame('in der roten Edition')).toMatchObject({ versionGroup: 'red-blue', gen: 1 });
    expect(resolveGame('rote Edition')).toMatchObject({ versionGroup: 'red-blue', gen: 1 });
    expect(resolveGame('red')).toMatchObject({ versionGroup: 'red-blue', gen: 1 });
    expect(resolveGame('gelb')).toMatchObject({ versionGroup: 'yellow', gen: 1 });
  });

  it('maps later editions', () => {
    expect(resolveGame('feuerrot')).toMatchObject({ versionGroup: 'firered-leafgreen', gen: 3 });
    expect(resolveGame('karmesin')).toMatchObject({ versionGroup: 'scarlet-violet', gen: 9 });
  });
});

describe('getSpeciesStats', () => {
  it('returns Gen I Special 85 and Speed 100 for Glurak in Red', () => {
    const result = getSpeciesStats('Glurak', 'rote Edition');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats).toEqual({
      hp: 78,
      attack: 84,
      defense: 78,
      special: 85,
      speed: 100,
    });
    expect(result.stats).not.toHaveProperty('special_attack');
    expect(result.bst).toBe(425);
    expect(result.semantics.special_is_unified).toBe(true);
    expect(result.semantics.attack_speed_means).toBe('speed');
    expect(result.types).toEqual(['fire', 'flying']);
  });

  it('uses the later SpA/SpD split for Gold/Silver Charizard', () => {
    const result = getSpeciesStats('Charizard', 'gold');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.special_attack).toBe(109);
    expect(result.stats.special_defense).toBe(85);
    expect(result.stats.speed).toBe(100);
    expect(result.stats).not.toHaveProperty('special');
    expect(result.bst).toBe(534);
    expect(result.semantics.special_is_unified).toBe(false);
  });

  it('rejects a species that is not in the requested game', () => {
    const result = getSpeciesStats('Lucario', 'red');
    expect(result).toMatchObject({ ok: false, error: 'not_in_game' });
  });

  it('rejects unknown names and games', () => {
    expect(getSpeciesStats('NotAMon', 'red')).toMatchObject({ ok: false, error: 'unknown_species' });
    expect(getSpeciesStats('Glurak', 'not-a-game')).toMatchObject({ ok: false, error: 'unknown_game' });
  });

  it('parses tool arguments', () => {
    const result = getSpeciesStatsFromArgs({ species_query: 'Glurak', game: 'red' });
    expect(result.ok).toBe(true);
    expect(getSpeciesStatsFromArgs({})).toMatchObject({ ok: false, error: 'invalid_arguments' });
  });
});

describe('bundle safety', () => {
  it('keeps the OpenAI key on the server module only', () => {
    const server = readFileSync(resolve(ROOT, 'src/lib/gpt-live/server-api.ts'), 'utf8');
    expect(server).toContain('OPENAI_API_KEY');
    expect(server).toContain('https://api.openai.com/v1/live/sessions');

    for (const rel of [
      'src/pages/GptLiveDemo.tsx',
      'src/lib/gpt-live/webrtc.ts',
      'src/lib/gpt-live/enabled.ts',
      'src/App.tsx',
    ]) {
      const src = readFileSync(resolve(ROOT, rel), 'utf8');
      expect(src, rel).not.toContain('OPENAI_API_KEY');
      expect(src, rel).not.toContain('server-api');
    }
  });

  it('gates the demo on DEV plus an explicit vite flag', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/enabled.ts'), 'utf8');
    expect(src).toContain("import.meta.env.DEV");
    expect(src).toContain("import.meta.env.VITE_GPT_LIVE_DEMO === 'true'");
  });
});
