import { describe, expect, it } from 'vitest';
import { battleLandingRedirectTo, battleLandingRest } from './battle-landing-redirect';

describe('battleLandingRest', () => {
  it('maps each locale to its own battle slug', () => {
    expect(battleLandingRest('de')).toBe('/kampf-simulator');
    expect(battleLandingRest('en')).toBe('/battle-simulator');
  });
});

describe('battleLandingRedirectTo', () => {
  it('sends the wrong EN slug to the English rest (query + hash kept)', () => {
    expect(battleLandingRedirectTo('en', '/en/kampf-simulator/', '?a=6&b=9', '#arena')).toBe(
      '/en/battle-simulator/?a=6&b=9#arena',
    );
    expect(battleLandingRedirectTo('en', '/en/kampf-simulator')).toBe('/en/battle-simulator/');
  });

  it('sends the wrong DE slug to the German rest', () => {
    expect(battleLandingRedirectTo('de', '/de/battle-simulator/')).toBe('/de/kampf-simulator/');
    expect(battleLandingRedirectTo('de', '/de/battle-simulator')).toBe('/de/kampf-simulator/');
  });

  it('leaves the locale-correct slug alone', () => {
    expect(battleLandingRedirectTo('en', '/en/battle-simulator/')).toBeNull();
    expect(battleLandingRedirectTo('de', '/de/kampf-simulator/')).toBeNull();
  });

  it('ignores non-battle rests and unknown langs', () => {
    expect(battleLandingRedirectTo('en', '/en/versus/charizard-vs-blastoise/')).toBeNull();
    expect(battleLandingRedirectTo('fr', '/fr/kampf-simulator/')).toBeNull();
    expect(battleLandingRedirectTo(undefined, '/kampf-simulator')).toBeNull();
  });
});
