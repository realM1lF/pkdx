import { describe, expect, it } from 'vitest';
import { dexEntryPath, formBySlug, formsForSpecies, formIdentity } from './dex-forms-catalog';

describe('dex-forms catalog identity', () => {
  it('maps charizard-mega-x to national #006 and Kalos gen 6, not Paldea', () => {
    const rec = formBySlug('charizard-mega-x');
    expect(rec?.speciesId).toBe(6);
    expect(rec?.spriteId).toBe(10034);
    expect(rec?.kind).toBe('mega');
    expect(rec?.gen).toBe(6);
    const id = formIdentity('charizard-mega-x', 10034);
    expect(id.speciesId).toBe(6);
    expect(id.gen).toBe(6);
    expect(id.slug).toBe('charizard-mega-x');
    expect(id.isForm).toBe(true);
  });

  it('lists Mega X/Y and Gmax as formes of Charizard, not ZA megas', () => {
    const slugs = formsForSpecies(6).map((f) => f.slug);
    expect(slugs).toEqual(['charizard-gmax', 'charizard-mega-x', 'charizard-mega-y']);
  });

  it('treats a national-dex pokemon as the base species', () => {
    const id = formIdentity('charizard', 6);
    expect(id.isForm).toBe(false);
    expect(id.speciesId).toBe(6);
    expect(id.gen).toBe(1);
  });

  it('routes formes by slug and species by national id', () => {
    expect(dexEntryPath({ id: 10034, name: 'charizard-mega-x' })).toBe('/pokemon/charizard-mega-x');
    expect(dexEntryPath({ id: 6, name: 'charizard' })).toBe('/pokemon/6');
  });
});

describe('FormStrip / detail identity', () => {
  it('Charizard strip targets Mega X/Y + Gmax by English slug, national #006', () => {
    const forms = formsForSpecies(6);
    expect(forms.map((f) => f.slug)).toEqual(['charizard-gmax', 'charizard-mega-x', 'charizard-mega-y']);
    for (const f of forms) {
      expect(f.speciesId).toBe(6);
      expect(dexEntryPath({ id: f.spriteId, name: f.slug })).toBe(`/pokemon/${f.slug}`);
      expect(String(f.spriteId)).not.toBe('6');
    }
    expect(formIdentity('charizard-mega-x', 10034).speciesId).toBe(6);
    expect(formIdentity('charizard-mega-x', 10034).gen).toBe(6);
  });
});
