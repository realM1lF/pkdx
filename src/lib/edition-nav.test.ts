import { describe, expect, it } from 'vitest';
import {
  FIRST_GAME_BY_GEN,
  gameSlugOf,
  keepEditionSearch,
  pokemonHref,
  resolveVersionGroup,
  versusHref,
} from './edition-nav';
import { versusContextFromGame } from './versus-context';

describe('resolveVersionGroup', () => {
  it('maps a game slug to its version group', () => {
    expect(resolveVersionGroup('firered')).toBe('firered-leafgreen');
  });

  it('accepts a version-group id as-is', () => {
    expect(resolveVersionGroup('firered-leafgreen')).toBe('firered-leafgreen');
  });

  it('maps Orre game slugs', () => {
    expect(resolveVersionGroup('colosseum')).toBe('colosseum');
    expect(resolveVersionGroup('xd')).toBe('xd');
  });

  it('returns null for empty or unknown values', () => {
    expect(resolveVersionGroup(null)).toBeNull();
    expect(resolveVersionGroup(undefined)).toBeNull();
    expect(resolveVersionGroup('not-a-game')).toBeNull();
  });
});

describe('gameSlugOf', () => {
  it('returns the first game of a version group', () => {
    expect(gameSlugOf('firered-leafgreen')).toBe('firered');
  });

  it('returns a game slug unchanged', () => {
    expect(gameSlugOf('firered')).toBe('firered');
  });

  it('returns null for unknown values', () => {
    expect(gameSlugOf(null)).toBeNull();
    expect(gameSlugOf('not-a-game')).toBeNull();
  });
});

describe('pokemonHref', () => {
  it('appends ?game= when a game is given', () => {
    expect(pokemonHref(25, { game: 'firered' })).toBe('/pokemon/25?game=firered');
  });

  it('keeps from and v when provided', () => {
    expect(pokemonHref(81, { game: 'firered', from: 'kanto:kanto-route-10', v: 'firered' })).toBe(
      '/pokemon/81?game=firered&from=kanto%3Akanto-route-10&v=firered',
    );
  });

  it('omits game when absent', () => {
    expect(pokemonHref(25)).toBe('/pokemon/25');
  });

  it('normalizes a version-group id to a game slug', () => {
    expect(pokemonHref(6, { game: 'firered-leafgreen' })).toBe('/pokemon/6?game=firered');
  });

  it('accepts a dexEntryPath and keeps the slug', () => {
    expect(pokemonHref('/pokemon/charizard-mega-x', { game: 'x' })).toBe('/pokemon/charizard-mega-x?game=x');
  });
});

describe('versusHref', () => {
  it('normalizes a version-group id to a game slug', () => {
    expect(versusHref({ you: 6, game: 'firered-leafgreen' })).toBe('/versus?you=6&game=firered');
  });

  it('includes vs when set', () => {
    expect(versusHref({ you: 6, vs: 9, game: 'firered' })).toBe('/versus?you=6&vs=9&game=firered');
  });
});

describe('keepEditionSearch', () => {
  it('keeps only game and drops versus params', () => {
    const q = new URLSearchParams('game=firered&vs=6&tab=versus&versusTrainer=brock');
    expect(keepEditionSearch(q)).toBe('game=firered');
  });

  it('returns empty string when game is missing', () => {
    expect(keepEditionSearch(new URLSearchParams('vs=6'))).toBe('');
  });
});

describe('FIRST_GAME_BY_GEN', () => {
  it('maps each generation to its first main-series game slug', () => {
    expect(FIRST_GAME_BY_GEN[1]).toBe('red');
    expect(FIRST_GAME_BY_GEN[2]).toBe('gold');
    expect(FIRST_GAME_BY_GEN[3]).toBe('ruby');
    expect(FIRST_GAME_BY_GEN[4]).toBe('diamond');
    expect(FIRST_GAME_BY_GEN[5]).toBe('black');
    expect(FIRST_GAME_BY_GEN[6]).toBe('x');
    expect(FIRST_GAME_BY_GEN[7]).toBe('sun');
    expect(FIRST_GAME_BY_GEN[8]).toBe('sword');
    expect(FIRST_GAME_BY_GEN[9]).toBe('scarlet');
  });
});

describe('surface href recipes', () => {
  it('Nuzlocke party/box and Orre tracker pass only the game slug', () => {
    expect(pokemonHref(25, { game: 'firered' })).toBe('/pokemon/25?game=firered');
    expect(pokemonHref(296, { game: 'colosseum' })).toBe('/pokemon/296?game=colosseum');
    expect(pokemonHref(216, { game: 'xd' })).toBe('/pokemon/216?game=xd');
  });

  it('Maps encounter row keeps game, from, and v', () => {
    expect(pokemonHref(81, { game: 'firered', from: 'kanto:kanto-route-10', v: 'firered' })).toBe(
      '/pokemon/81?game=firered&from=kanto%3Akanto-route-10&v=firered',
    );
  });

  it('Team VS normalizes a version-group id to a game slug', () => {
    expect(versusHref({ you: 6, game: 'firered-leafgreen' })).toBe('/versus?you=6&game=firered');
  });

  it('Pokédex gen-filter uses the first game of that generation', () => {
    expect(pokemonHref(36, { game: FIRST_GAME_BY_GEN[5] })).toBe('/pokemon/36?game=black');
  });
});

describe('versusContextFromGame — version-group ids', () => {
  it('keeps firered-leafgreen on gen 3 instead of falling back to SV', () => {
    const ctx = versusContextFromGame('firered-leafgreen');
    expect(ctx.versionGroup).toBe('firered-leafgreen');
    expect(ctx.gen).toBe(3);
    expect(ctx.game).toBe('firered');
  });
});
