import { describe, expect, it } from 'vitest';
import { pokemonSlugRedirects, slugifyDeName } from './pokemon-slug-redirects';

describe('slugifyDeName', () => {
  it('uses official-style ASCII slugs', () => {
    expect(slugifyDeName('Glurak')).toBe('glurak');
    expect(slugifyDeName('Königstein')).toBe('koenigstein');
    expect(slugifyDeName('Mr. Mime')).toBe('mr-mime');
  });
});

describe('pokemonSlugRedirects', () => {
  it('maps EN slug and DE name to the numeric canonical in both locales', () => {
    const rules = pokemonSlugRedirects([{ id: 25, slug: 'pikachu', nameDe: 'Pikachu' }]);
    expect(rules).toEqual([
      { from: '/de/pokemon/pikachu', to: '/de/pokemon/25/', status: 301 },
      { from: '/en/pokemon/pikachu', to: '/en/pokemon/25/', status: 301 },
    ]);
  });

  it('adds a distinct German-name alias', () => {
    const rules = pokemonSlugRedirects([{ id: 6, slug: 'charizard', nameDe: 'Glurak' }]);
    expect(rules).toContainEqual({ from: '/de/pokemon/glurak', to: '/de/pokemon/6/', status: 301 });
    expect(rules).toContainEqual({ from: '/en/pokemon/charizard', to: '/en/pokemon/6/', status: 301 });
  });

  it('does not emit a self-redirect for numeric ids', () => {
    const rules = pokemonSlugRedirects([{ id: 25, slug: '25', nameDe: '25' }]);
    expect(rules).toEqual([]);
  });
});
