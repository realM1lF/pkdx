import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  clampZoom,
  readZoom,
  applyZoom,
  defaultZoomPercent,
  ZOOM_DEFAULT_DESKTOP,
  ZOOM_LEVELS,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  ZOOM_STORAGE_KEY,
} from './page-zoom';

describe('page-zoom', () => {
  const store: Record<string, string> = {};
  const html = { style: { fontSize: '' }, dataset: {} as Record<string, string> };

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    html.style.fontSize = '';
    html.dataset = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    });
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { documentElement: html });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defines allowed zoom levels 50–250 step 10', () => {
    expect(ZOOM_LEVELS[0]).toBe(ZOOM_MIN);
    expect(ZOOM_LEVELS[ZOOM_LEVELS.length - 1]).toBe(ZOOM_MAX);
    expect(ZOOM_LEVELS).toHaveLength((ZOOM_MAX - ZOOM_MIN) / ZOOM_STEP + 1);
  });

  it('clampZoom snaps to step and bounds', () => {
    expect(clampZoom(73)).toBe(70);
    expect(clampZoom(999)).toBe(ZOOM_MAX);
    expect(clampZoom(10)).toBe(ZOOM_MIN);
    expect(clampZoom(Number.NaN)).toBe(100);
  });

  it('readZoom defaults to 100 without matchMedia', () => {
    expect(readZoom()).toBe(100);
  });

  it('readZoom defaults to 130 on desktop when unset', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: true }),
    });
    expect(defaultZoomPercent()).toBe(ZOOM_DEFAULT_DESKTOP);
    expect(readZoom()).toBe(ZOOM_DEFAULT_DESKTOP);
  });

  it('readZoom reads persisted value', () => {
    store[ZOOM_STORAGE_KEY] = '150';
    expect(readZoom()).toBe(150);
  });

  it('applyZoom sets data-zoom and font-size', () => {
    applyZoom(150);
    expect(html.dataset.zoom).toBe('150');
    expect(html.style.fontSize).toBe('24px');
    applyZoom(100);
    expect(html.dataset.zoom).toBe('100');
    expect(html.style.fontSize).toBe('');
  });
});
