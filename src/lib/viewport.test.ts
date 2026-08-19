import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { applyZoom } from './page-zoom';
import {
  isBelowBreakpoint,
  isAtOrAboveBreakpoint,
  scaledBreakpoint,
  remPx,
} from './viewport';

describe('viewport', () => {
  const html = { style: { fontSize: '' }, dataset: {} as Record<string, string> };

  beforeEach(() => {
    html.style.fontSize = '';
    html.dataset = {};
    vi.stubGlobal('window', { innerWidth: 1000 });
    vi.stubGlobal('document', { documentElement: html });
    vi.stubGlobal('getComputedStyle', () => ({ fontSize: html.style.fontSize || '16px' }));
    applyZoom(100);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('scaledBreakpoint multiplies by zoom percent', () => {
    applyZoom(150);
    expect(scaledBreakpoint(768)).toBeCloseTo(1152);
  });

  it('isBelowBreakpoint respects zoom scaling', () => {
    vi.stubGlobal('window', { innerWidth: 1000 });
    applyZoom(100);
    expect(isBelowBreakpoint(768)).toBe(false);
    expect(isAtOrAboveBreakpoint(768)).toBe(true);

    applyZoom(150);
    expect(isBelowBreakpoint(768)).toBe(true);
    expect(isAtOrAboveBreakpoint(768)).toBe(false);
  });

  it('remPx scales with root font-size', () => {
    applyZoom(200);
    vi.stubGlobal('getComputedStyle', () => ({ fontSize: '32px' }));
    expect(remPx(1)).toBeCloseTo(32);
    expect(remPx(0.5)).toBeCloseTo(16);
  });
});
