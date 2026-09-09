import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANNOUNCE_DISMISSED,
  ANNOUNCE_EMAIL_LOGIN_KEY,
  ANNOUNCE_ITEM_KEYS,
  applyAnnounceDismissed,
  isAnnounceDismissed,
  persistAnnounceDismissed,
} from './announce-bar';

describe('announce-bar persist', () => {
  const store: Record<string, string> = {};
  const html = { dataset: {} as Record<string, string> };

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    html.dataset = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    });
    vi.stubGlobal('document', { documentElement: html });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is visible when storage is empty', () => {
    expect(isAnnounceDismissed()).toBe(false);
  });

  it('reads the dismissed flag', () => {
    store[ANNOUNCE_EMAIL_LOGIN_KEY] = ANNOUNCE_DISMISSED;
    expect(isAnnounceDismissed()).toBe(true);
  });

  it('ignores other stored values', () => {
    store[ANNOUNCE_EMAIL_LOGIN_KEY] = '1';
    expect(isAnnounceDismissed()).toBe(false);
  });

  it('persist writes the off flag', () => {
    expect(persistAnnounceDismissed()).toBe(true);
    expect(store[ANNOUNCE_EMAIL_LOGIN_KEY]).toBe(ANNOUNCE_DISMISSED);
  });

  it('apply writes storage and html dataset', () => {
    applyAnnounceDismissed();
    expect(store[ANNOUNCE_EMAIL_LOGIN_KEY]).toBe(ANNOUNCE_DISMISSED);
    expect(html.dataset.announce).toBe(ANNOUNCE_DISMISSED);
  });

  it('treats storage throws as not dismissed', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
    });
    expect(isAnnounceDismissed()).toBe(false);
  });

  it('persist returns false when storage throws', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('quota');
      },
    });
    expect(persistAnnounceDismissed()).toBe(false);
  });

  it('keeps announce-init.js on the same storage key', () => {
    const src = readFileSync(new URL('../../public/announce-init.js', import.meta.url), 'utf8');
    expect(src).toContain(`'${ANNOUNCE_EMAIL_LOGIN_KEY}'`);
    expect(src).toContain(`'${ANNOUNCE_DISMISSED}'`);
  });

  it('pins chrome offset to 1.2rem and lists four ticker keys', () => {
    const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
    expect(css).toContain('--announce-h: 1.2rem');
    expect(ANNOUNCE_ITEM_KEYS).toEqual(['emailLogin', 'kalos', 'discord', 'ux']);
  });
});
