import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';
import {
  editionFallback,
  formNotInGame,
  paddedWild,
  trainerArtifactMismatch,
} from './honesty';

const HONESTY_KEYS = [
  'honesty.editionFallback',
  'honesty.catalogTypes',
  'honesty.formNotInGame',
  'honesty.evoCurrent',
  'honesty.seoSnapshot',
  'honesty.siblingMix',
  'honesty.speciesCurrent',
  'honesty.nationalPicker',
  'tb.illegal.noLearnset',
  'honesty.importUnchecked',
  'honesty.enOnlySmogon',
  'honesty.maxStatExp',
  'honesty.defaultEdition',
  'honesty.paddedWild',
  'honesty.capUsesRegion',
  'honesty.noStoredMoves',
  'honesty.snagLevelUp',
  'honesty.shadowIdOptional',
  'honesty.starterRandom',
  'honesty.firstEncounterSet',
  'honesty.calcNeutral',
  'honesty.modernEffect',
  'honesty.locationsFrlgField',
  'maps.seoPartial',
] as const;

function localeLeaf(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

describe('honesty flags', () => {
  it('editionFallback when requested vg is absent from present set', () => {
    expect(editionFallback('black-white', new Set(['sword-shield']))).toBe(true);
    expect(editionFallback('sword-shield', new Set(['sword-shield']))).toBe(false);
  });
  it('formNotInGame when genSpecies missing', () => {
    expect(formNotInGame(false)).toBe(true);
    expect(formNotInGame(true)).toBe(false);
  });
  it('paddedWild when wild count < 4 and extra slots filled', () => {
    expect(paddedWild(2, 4)).toBe(true);
    expect(paddedWild(4, 4)).toBe(false);
  });
  it('re-exports trainerArtifactMismatch from trainer-data', () => {
    expect(typeof trainerArtifactMismatch).toBe('function');
  });
});

describe('honesty locale keys', () => {
  it('has honesty / tb.illegal.noLearnset / maps.seoPartial keys in EN and DE', () => {
    for (const key of HONESTY_KEYS) {
      const enVal = localeLeaf(en, key);
      const deVal = localeLeaf(de, key);
      expect(typeof enVal, `en.${key}`).toBe('string');
      expect(String(enVal).length, `en.${key}`).toBeGreaterThan(0);
      expect(typeof deVal, `de.${key}`).toBe('string');
      expect(String(deVal).length, `de.${key}`).toBeGreaterThan(0);
    }
  });
});
