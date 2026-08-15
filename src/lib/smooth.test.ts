import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('lenis', () => ({
  default: class LenisStub {
    on() {}
    off() {}
    stop() {}
    start() {}
    destroy() {}
    raf() {}
    scrollTo() {}
  },
}));

describe('onLenisReady', () => {
  afterEach(async () => {
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { destroyLenis } = await import('./smooth');
    destroyLenis();
  });

  it('fires immediately when Lenis already exists and again for late subscribers after init', async () => {
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('window', {
      matchMedia: () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      }),
      requestAnimationFrame: () => 1,
      cancelAnimationFrame() {},
    });
    const { initLenis, onLenisReady, getLenis, destroyLenis } = await import('./smooth');
    destroyLenis();

    const late: unknown[] = [];
    const unsub = onLenisReady((l) => late.push(l));
    expect(late).toEqual([]);

    const created = initLenis();
    expect(created).toBeTruthy();
    expect(late).toHaveLength(1);
    expect(late[0]).toBe(getLenis());

    const immediate: unknown[] = [];
    onLenisReady((l) => immediate.push(l));
    expect(immediate).toHaveLength(1);
    expect(immediate[0]).toBe(created);

    unsub();
    vi.unstubAllGlobals();
  });
});
