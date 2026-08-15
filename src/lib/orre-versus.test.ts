import { describe, expect, it } from 'vitest';
import {
  foeShadowsForVersus,
  hyperModeAvailable,
  orreGameFromRunGame,
  ownShadowMoveSlugs,
  shadowsVersusAtLocation,
  trackerStatusFromEncounter,
} from './orre-versus';

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

describe('orre nuzlocke bridge', () => {
  it('maps run game slugs to Orre games', () => {
    expect(orreGameFromRunGame('colosseum')).toBe('colosseum');
    expect(orreGameFromRunGame('xd')).toBe('xd');
    expect(orreGameFromRunGame('firered')).toBeNull();
  });

  it('maps encounter status to tracker status without downgrading a death', () => {
    expect(trackerStatusFromEncounter('caught')).toBe('snagged');
    expect(trackerStatusFromEncounter('missed')).toBe('missed');
    expect(trackerStatusFromEncounter('dead')).toBeNull();
    expect(trackerStatusFromEncounter('duped')).toBeNull();
  });

  it('returns curated own-side shadow moves when a shadow id is set', () => {
    const moves = ownShadowMoveSlugs('colosseum', 'colo-shadow-makuhita', 'orre-phenac-mayors-house');
    expect(moves.length).toBeGreaterThan(0);
    expect(ownShadowMoveSlugs('colosseum', null, 'orre-phenac-mayors-house')).toEqual([]);
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
