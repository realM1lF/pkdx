/* First-paint gates for Core Web Vitals.
 * A prerendered #root already has the LCP element; covering it with the
 * home preloader or the Suspense pokeball makes Lighthouse measure the
 * spinner instead of the hero. */

let firstPaintDone = false;
let bootCaptured = false;
let bootPrerendered = false;

export function markFirstPaintDone(): void {
  firstPaintDone = true;
}

/** Snapshot #root *before* React commits. Layout children must not look like a prerender. */
export function captureBootPrerender(hasMarkup: boolean): void {
  if (bootCaptured) return;
  bootCaptured = true;
  bootPrerendered = hasMarkup;
}

export function isBootPrerendered(): boolean {
  return bootPrerendered;
}

/** Test-only: vitest workers reuse the module graph. */
export function resetFirstPaintForTests(): void {
  firstPaintDone = false;
  bootCaptured = false;
  bootPrerendered = false;
}

export function isFirstPaintPrerender(root: { hasChildNodes(): boolean } | null): boolean {
  const prerendered = bootCaptured ? bootPrerendered : isPrerenderedRoot(root);
  return !firstPaintDone && prerendered;
}

export function isPrerenderedRoot(root: { hasChildNodes(): boolean } | null): boolean {
  return Boolean(root?.hasChildNodes());
}

export function shouldShowHomePreloader(input: { sessionDone: boolean; prerendered: boolean }): boolean {
  if (input.prerendered) return false;
  return !input.sessionDone;
}

export function shouldCoverPaintWithFallback(input: { prerendered: boolean }): boolean {
  return !input.prerendered;
}
