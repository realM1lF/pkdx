import { describe, expect, it } from 'vitest';
import type { DexIndexEntry } from '@/lib/types';
import formsArtifact from '@/data/dex-forms.json';
import {
  filterEntries,
  formKindOf,
  hydrateFormCatalog,
  isSpecialToken,
} from './dex-data';
import type { FilterState } from './dex-data';

const SPECIES: DexIndexEntry[] = [
  { id: 6, name: 'charizard', label: 'Charizard', num: '#006', gen: 1 },
  { id: 19, name: 'rattata', label: 'Rattata', num: '#019', gen: 1 },
  { id: 77, name: 'ponyta', label: 'Ponyta', num: '#077', gen: 1 },
  { id: 154, name: 'meganium', label: 'Meganium', num: '#154', gen: 2 },
];

const FORMS: DexIndexEntry[] = [
  { id: 10091, name: 'rattata-alola', label: 'Rattata Alola', num: '#019', gen: 7 },
  { id: 10034, name: 'charizard-mega-x', label: 'Charizard Mega X', num: '#006', gen: 6 },
  { id: 10162, name: 'ponyta-galar', label: 'Ponyta Galar', num: '#077', gen: 8 },
];

const emptyTypes = {};

function names(f: FilterState, index = SPECIES, forms = FORMS): string[] {
  return (filterEntries(index, f, emptyTypes, forms) ?? []).map((e) => e.name);
}

describe('formKindOf', () => {
  it('maps regional / mega / gmax formes', () => {
    expect(formKindOf('Alola')).toBe('alola');
    expect(formKindOf('Galar')).toBe('galar');
    expect(formKindOf('Galar-Zen')).toBe('galar');
    expect(formKindOf('Hisui')).toBe('hisui');
    expect(formKindOf('Paldea')).toBe('paldea');
    expect(formKindOf('Paldea-Combat')).toBe('paldea');
    expect(formKindOf('Mega')).toBe('mega');
    expect(formKindOf('Mega-X')).toBe('mega');
    expect(formKindOf('Mega-Y')).toBe('mega');
    expect(formKindOf('Primal')).toBe('mega');
    expect(formKindOf('Gmax')).toBe('gmax');
    expect(formKindOf('Low-Key-Gmax')).toBe('gmax');
  });

  it('skips totem, ZA/future megas, cosmetic-adjacent caps', () => {
    expect(formKindOf('Alola-Totem')).toBeNull();
    expect(formKindOf('Totem')).toBeNull();
    expect(formKindOf('Mega', 'Future')).toBeNull();
    expect(formKindOf('Mega-Z')).toBeNull();
    expect(formKindOf('Original-Mega')).toBeNull();
    expect(formKindOf('Alola', null, 'Pikachu')).toBeNull();
    expect(formKindOf('Sunny')).toBeNull();
  });
});

describe('isSpecialToken', () => {
  it('accepts forms alongside legendary/mythical', () => {
    expect(isSpecialToken('forms')).toBe(true);
    expect(isSpecialToken('legendary')).toBe(true);
    expect(isSpecialToken('nope')).toBe(false);
  });
});

describe('filterEntries — forms extras', () => {
  const base: FilterState = { q: '', types: [], gen: null, special: [] };

  it('default view excludes rattata-alola and other non-default varieties', () => {
    const slugs = names(base);
    expect(slugs).toEqual(['charizard', 'rattata', 'ponyta', 'meganium']);
    expect(slugs).not.toContain('rattata-alola');
    expect(slugs).not.toContain('charizard-mega-x');
    expect(slugs).not.toContain('ponyta-galar');
  });

  it('forms filter includes rattata-alola as an extra row', () => {
    const slugs = names({ ...base, special: ['forms'] });
    expect(slugs).toContain('rattata');
    expect(slugs).toContain('rattata-alola');
    expect(slugs).toContain('charizard-mega-x');
    expect(slugs).toContain('ponyta-galar');
  });

  it('forms filter keeps meganium as a species row and does not invent a mega', () => {
    const slugs = names({ ...base, special: ['forms'] });
    expect(slugs).toContain('meganium');
    expect(slugs).not.toContain('meganium-mega');
  });
});

describe('hydrateFormCatalog', () => {
  it('turns a form record into a dex row keyed by sprite id', () => {
    const boot = hydrateFormCatalog([
      {
        slug: 'rattata-alola',
        speciesId: 19,
        spriteId: 10091,
        types: ['dark', 'normal'],
        stats: { hp: 30, atk: 56, def: 35, spa: 25, spd: 35, spe: 72 },
        kind: 'alola',
        gen: 7,
      },
    ]);
    expect(boot.index[0]?.name).toBe('rattata-alola');
    expect(boot.summaries.get(10091)?.form).toBe('alola');
    expect(boot.summaries.get(10091)?.speciesId).toBe(19);
    expect(boot.typeSets.dark?.has(10091)).toBe(true);
  });
});

describe('dex-forms artifact', () => {
  it('lists rattata-alola and charizard-mega-x, not ZA meganium-mega', () => {
    const slugs = (formsArtifact as { forms: Array<{ slug: string }> }).forms.map((f) => f.slug);
    expect(slugs).toContain('rattata-alola');
    expect(slugs).toContain('charizard-mega-x');
    expect(slugs).toContain('ponyta-galar');
    expect(slugs).not.toContain('meganium-mega');
  });
});
