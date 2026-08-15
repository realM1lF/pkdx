/* Lenis smooth-scroll singleton (design.md §8) — disabled for reduced motion. */
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId = 0;
const readyListeners = new Set<(instance: Lenis) => void>();

function lenisPreventNode(node: Element): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return (
    node.hasAttribute('data-lenis-prevent') ||
    node.classList.contains('vs-combo') ||
    node.closest('.vs-combo') != null
  );
}

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    allowNestedScroll: true,
    prevent: lenisPreventNode,
  });
  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  for (const cb of readyListeners) cb(lenis);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Subscribe to the singleton. Fires now if Lenis already booted (idle race). */
export function onLenisReady(cb: (instance: Lenis) => void): () => void {
  if (lenis) {
    cb(lenis);
    return () => {};
  }
  readyListeners.add(cb);
  return () => {
    readyListeners.delete(cb);
  };
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
