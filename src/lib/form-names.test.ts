import { describe, expect, it } from 'vitest';
import { hyphenateRegionalDe, officialFormNames } from './form-names';

describe('hyphenateRegionalDe', () => {
  it('turns PokéAPI regional spaces into official game hyphens', () => {
    expect(hyphenateRegionalDe('Alola Rattfratz')).toBe('Alola-Rattfratz');
    expect(hyphenateRegionalDe('Galar Ponita')).toBe('Galar-Ponita');
    expect(hyphenateRegionalDe('Hisui Fukano')).toBe('Hisui-Fukano');
    expect(hyphenateRegionalDe('Galar Flampivian (Trance)')).toBe('Galar-Flampivian (Trance)');
  });

  it('leaves mega, gigantamax and primal names untouched', () => {
    expect(hyphenateRegionalDe('Mega-Glurak X')).toBe('Mega-Glurak X');
    expect(hyphenateRegionalDe('Gigadynamax-Bisaflor')).toBe('Gigadynamax-Bisaflor');
    expect(hyphenateRegionalDe('Proto-Kyogre')).toBe('Proto-Kyogre');
  });
});

describe('officialFormNames', () => {
  it('uses PokéAPI DE/EN when present, with regional hyphenation', () => {
    expect(
      officialFormNames({
        slug: 'charizard-mega-x',
        kind: 'mega',
        apiDe: 'Mega-Glurak X',
        apiEn: 'Mega Charizard X',
        baseDe: 'Glurak',
      }),
    ).toEqual({ de: 'Mega-Glurak X', en: 'Mega Charizard X' });

    expect(
      officialFormNames({
        slug: 'rattata-alola',
        kind: 'alola',
        apiDe: 'Alola Rattfratz',
        apiEn: 'Alolan Rattata',
        baseDe: 'Rattfratz',
      }),
    ).toEqual({ de: 'Alola-Rattfratz', en: 'Alolan Rattata' });
  });

  it('fills Paldea gaps from PokéWiki when PokéAPI has no German name', () => {
    expect(
      officialFormNames({
        slug: 'wooper-paldea',
        kind: 'paldea',
        apiDe: null,
        apiEn: 'Paldean Wooper',
        baseDe: 'Felino',
      }),
    ).toEqual({ de: 'Paldea-Felino', en: 'Paldean Wooper' });

    expect(
      officialFormNames({
        slug: 'tauros-paldea-blaze-breed',
        kind: 'paldea',
        apiDe: null,
        apiEn: 'Paldean Tauros (Blaze Breed)',
        baseDe: 'Tauros',
      }).de,
    ).toBe('Paldea-Tauros (Flammenvariante)');

    expect(
      officialFormNames({
        slug: 'tauros-paldea-aqua-breed',
        kind: 'paldea',
        apiDe: null,
        apiEn: 'Paldean Tauros (Aqua Breed)',
        baseDe: 'Tauros',
      }).de,
    ).toBe('Paldea-Tauros (Flutenvariante)');

    expect(
      officialFormNames({
        slug: 'tauros-paldea-combat-breed',
        kind: 'paldea',
        apiDe: null,
        apiEn: 'Paldean Tauros (Combat Breed)',
        baseDe: 'Tauros',
      }).de,
    ).toBe('Paldea-Tauros (Gefechtvariante)');
  });
});

describe('form-names artifact', () => {
  it('covers every catalogued forme with official DE and EN names', async () => {
    const catalog = (await import('@/data/dex-forms.json')).default as {
      forms: Array<{ slug: string }>;
    };
    const { formNameOf, formNamesArtifact } = await import('./form-names');
    const names = formNamesArtifact();
    expect(Object.keys(names)).toHaveLength(catalog.forms.length);
    for (const f of catalog.forms) {
      expect(formNameOf(f.slug, 'de'), f.slug).toBeTruthy();
      expect(formNameOf(f.slug, 'en'), f.slug).toBeTruthy();
      expect(formNameOf(f.slug, 'de')).not.toMatch(/^\d+$/);
    }
    expect(formNameOf('charizard-mega-x', 'de')).toBe('Mega-Glurak X');
    expect(formNameOf('charizard-mega-x', 'en')).toBe('Mega Charizard X');
    expect(formNameOf('rattata-alola', 'de')).toBe('Alola-Rattfratz');
    expect(formNameOf('rattata-alola', 'en')).toBe('Alolan Rattata');
    expect(formNameOf('ponyta-galar', 'de')).toBe('Galar-Ponita');
    expect(formNameOf('growlithe-hisui', 'de')).toBe('Hisui-Fukano');
    expect(formNameOf('venusaur-gmax', 'de')).toBe('Gigadynamax-Bisaflor');
    expect(formNameOf('kyogre-primal', 'de')).toBe('Proto-Kyogre');
    expect(formNameOf('wooper-paldea', 'de')).toBe('Paldea-Felino');
    expect(formNameOf('meganium-mega', 'de')).toBeNull();
  });
});
