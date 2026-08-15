/** Run non-critical work after the first paint (Lenis, cloud-sync, chrome). */

export type IdleHost = {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
  setTimeout: (handler: () => void, timeout?: number) => number;
  clearTimeout: (id: number) => void;
};

const defaultHost: IdleHost = {
  get requestIdleCallback() {
    return globalThis.requestIdleCallback?.bind(globalThis);
  },
  get cancelIdleCallback() {
    return globalThis.cancelIdleCallback?.bind(globalThis);
  },
  setTimeout: (handler, timeout) => globalThis.setTimeout(handler, timeout) as unknown as number,
  clearTimeout: (id) => globalThis.clearTimeout(id),
};

/** Playwright sets webdriver. Skip idle chrome so prerender HTML does not
 *  modulepreload supabase / Lenis / Three / auth. */
export function isDeferredChromeAllowed(nav: { webdriver?: boolean } = navigator): boolean {
  return !nav.webdriver;
}

export function scheduleIdle(task: () => void, host: IdleHost = defaultHost): () => void {
  const ric = host.requestIdleCallback;
  if (typeof ric === 'function') {
    const id = ric(() => task(), { timeout: 2000 });
    return () => host.cancelIdleCallback?.(id);
  }
  const id = host.setTimeout(task, 1);
  return () => host.clearTimeout(id);
}
