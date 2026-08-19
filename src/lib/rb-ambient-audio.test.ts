import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  AMBIENT_ENABLED_KEY,
  AMBIENT_VOLUME_DEFAULT,
  AMBIENT_VOLUME_KEY,
  RB_ROUTES1_SRC,
  readAmbientEnabled,
  readAmbientVolume,
  setAmbientEnabled,
  setAmbientVolume,
} from './rb-ambient-audio';

describe('rb-ambient-audio', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
    });
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('points at self-hosted Route 1 loop', () => {
    expect(RB_ROUTES1_SRC).toBe('/audio/rb-routes1.ogg');
  });

  it('defaults to disabled with moderate volume', () => {
    expect(readAmbientEnabled()).toBe(false);
    expect(readAmbientVolume()).toBe(AMBIENT_VOLUME_DEFAULT);
  });

  it('persists enable + volume', () => {
    setAmbientEnabled(true);
    setAmbientVolume(0.5);
    expect(store[AMBIENT_ENABLED_KEY]).toBe('1');
    expect(store[AMBIENT_VOLUME_KEY]).toBe('0.5');
    expect(readAmbientEnabled()).toBe(true);
    expect(readAmbientVolume()).toBe(0.5);
  });
});
