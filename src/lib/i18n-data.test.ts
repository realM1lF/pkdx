import { describe, expect, it } from 'vitest';
import { nameOfPokemon } from './i18n-data';

describe('nameOfPokemon — catalogued formes', () => {
  it('uses official Mega-Glurak X / Mega Charizard X, not the species name or sprite id', () => {
    expect(nameOfPokemon('charizard-mega-x', 'de')).toBe('Mega-Glurak X');
    expect(nameOfPokemon('charizard-mega-x', 'en')).toBe('Mega Charizard X');
    expect(nameOfPokemon('rattata-alola', 'de')).toBe('Alola-Rattfratz');
    expect(nameOfPokemon('ponyta-galar', 'de')).toBe('Galar-Ponita');
  });

  it('still resolves national-dex ids to species names', () => {
    expect(nameOfPokemon(6, 'en')).toBe('Charizard');
  });
});
