import { describe, expect, it } from 'vitest';
import {
  captureBootPrerender,
  isBootPrerendered,
  isFirstPaintPrerender,
  isPrerenderedRoot,
  markFirstPaintDone,
  resetFirstPaintForTests,
  shouldCoverPaintWithFallback,
  shouldShowHomePreloader,
} from './cwv-paint';

describe('shouldShowHomePreloader', () => {
  it('never covers a prerendered first paint', () => {
    expect(shouldShowHomePreloader({ sessionDone: false, prerendered: true })).toBe(false);
  });

  it('shows only on a bare SPA shell before the session flag', () => {
    expect(shouldShowHomePreloader({ sessionDone: false, prerendered: false })).toBe(true);
    expect(shouldShowHomePreloader({ sessionDone: true, prerendered: false })).toBe(false);
  });
});

describe('shouldCoverPaintWithFallback', () => {
  it('keeps prerendered markup visible while a lazy route chunk loads', () => {
    expect(shouldCoverPaintWithFallback({ prerendered: true })).toBe(false);
  });

  it('covers a bare shell so the previous footer cannot flash', () => {
    expect(shouldCoverPaintWithFallback({ prerendered: false })).toBe(true);
  });
});

describe('isPrerenderedRoot', () => {
  it('is true when #root already has server markup', () => {
    expect(isPrerenderedRoot({ hasChildNodes: () => true })).toBe(true);
    expect(isPrerenderedRoot({ hasChildNodes: () => false })).toBe(false);
    expect(isPrerenderedRoot(null)).toBe(false);
  });
});

describe('isFirstPaintPrerender', () => {
  it('is only true before the first client paint is marked done', () => {
    resetFirstPaintForTests();
    const root = { hasChildNodes: () => true };
    expect(isFirstPaintPrerender(root)).toBe(true);
    markFirstPaintDone();
    expect(isFirstPaintPrerender(root)).toBe(false);
    resetFirstPaintForTests();
  });
});

describe('captureBootPrerender', () => {
  it('freezes the empty-shell snapshot so a later Layout commit cannot fake prerender', () => {
    resetFirstPaintForTests();
    captureBootPrerender(false);
    expect(isBootPrerendered()).toBe(false);
    expect(shouldShowHomePreloader({ sessionDone: false, prerendered: isBootPrerendered() })).toBe(true);
    captureBootPrerender(true);
    expect(isBootPrerendered()).toBe(false);
    expect(isFirstPaintPrerender({ hasChildNodes: () => true })).toBe(false);
    resetFirstPaintForTests();
  });

  it('keeps a real prerender snapshot even after React fills #root', () => {
    resetFirstPaintForTests();
    captureBootPrerender(true);
    expect(isBootPrerendered()).toBe(true);
    expect(shouldShowHomePreloader({ sessionDone: false, prerendered: isBootPrerendered() })).toBe(false);
    expect(isFirstPaintPrerender({ hasChildNodes: () => false })).toBe(true);
    resetFirstPaintForTests();
  });
});
