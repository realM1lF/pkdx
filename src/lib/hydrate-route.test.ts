import { describe, expect, it } from 'vitest';
import { hydrateRouteId } from './hydrate-route';

describe('hydrateRouteId', () => {
  it('maps locale homes to home so hydration can preload the page module', () => {
    expect(hydrateRouteId('/de')).toBe('home');
    expect(hydrateRouteId('/en')).toBe('home');
    expect(hydrateRouteId('/de/')).toBe('home');
    expect(hydrateRouteId('/en/')).toBe('home');
  });

  it('maps pokedex index routes to pokedex', () => {
    expect(hydrateRouteId('/de/pokedex')).toBe('pokedex');
    expect(hydrateRouteId('/en/pokedex')).toBe('pokedex');
    expect(hydrateRouteId('/en/pokedex/')).toBe('pokedex');
  });

  it('maps prerendered content routes to their lazy page modules', () => {
    expect(hydrateRouteId('/de/maps')).toBe('maps');
    expect(hydrateRouteId('/en/maps/kanto')).toBe('map-region');
    expect(hydrateRouteId('/de/maps/kanto/route-1')).toBe('route-page');
    expect(hydrateRouteId('/en/pokemon/1')).toBe('pokemon');
    expect(hydrateRouteId('/en/team')).toBe('team');
    expect(hydrateRouteId('/de/team/abc-1')).toBe('team');
    expect(hydrateRouteId('/en/team/s/zPAYLOAD')).toBe('team');
    expect(hydrateRouteId('/de/items')).toBe('items');
    expect(hydrateRouteId('/de/items/ep-teiler')).toBe('item-detail');
    expect(hydrateRouteId('/en/types/water')).toBe('type-detail');
    expect(hydrateRouteId('/de/typen')).toBe('types');
    expect(hydrateRouteId('/en/versus/charizard-vs-blastoise')).toBe('matchup');
    expect(hydrateRouteId('/de/kampf-simulator')).toBe('battle');
    expect(hydrateRouteId('/en/nuzlocke/firered')).toBe('nuzlocke-guide');
    expect(hydrateRouteId('/de/nuzlocke')).toBe('nuzlocke');
    expect(hydrateRouteId('/en/about')).toBe('about');
    expect(hydrateRouteId('/de/impressum')).toBe('impressum');
    expect(hydrateRouteId('/de/orre')).toBe('orre');
  });

  it('does not preload private or runtime-only routes', () => {
    expect(hydrateRouteId('/en/nuzlocke/abc123')).toBeNull();
    expect(hydrateRouteId('/de/account')).toBeNull();
    expect(hydrateRouteId('/en/lizenzen')).toBeNull();
  });
});
