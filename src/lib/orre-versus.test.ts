import { describe, expect, it } from 'vitest';
import { foeShadowsForVersus, hyperModeAvailable, shadowsVersusAtLocation } from './orre-versus';

describe('foeShadowsForVersus', () => {
  it('lists Mayor House shadows first when the party mon is from that route', () => {
    const { here, elsewhere } = foeShadowsForVersus('colosseum', 'orre-phenac-mayors-house');
    expect(here.map((s) => s.id)).toEqual(['colo-shadow-makuhita']);
    expect(elsewhere.some((s) => s.id === 'colo-shadow-makuhita')).toBe(false);
    expect(elsewhere.length).toBeGreaterThan(40);
  });

  it('includes reappear targets at Deep Colosseum', () => {
    const here = shadowsVersusAtLocation('colosseum', 'orre-deep-colosseum');
    expect(here.some((s) => s.id === 'colo-shadow-suicune')).toBe(true);
  });

  it('puts every shadow in elsewhere when no route is set', () => {
    const { here, elsewhere } = foeShadowsForVersus('colosseum', null);
    expect(here).toEqual([]);
    expect(elsewhere.length).toBeGreaterThan(40);
  });
});

describe('hyperModeAvailable', () => {
  it('is only Colosseum Shadow Rush', () => {
    expect(hyperModeAvailable('colosseum', ['shadow-rush'])).toBe(true);
    expect(hyperModeAvailable('xd', ['shadow-rush'])).toBe(false);
    expect(hyperModeAvailable('colosseum', ['tackle'])).toBe(false);
    expect(hyperModeAvailable('firered-leafgreen', ['shadow-rush'])).toBe(false);
  });
});
