/* Lenis smooth-scroll singleton (design.md §8) — disabled for reduced motion. */
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId = 0;

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTop(duration = 0.8): void {
  if (lenis) {
    lenis.scrollTo(0, { duration });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function destroyLenis(): void {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}
