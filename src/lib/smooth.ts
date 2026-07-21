/* Lenis smooth-scroll singleton (design.md §8) — disabled for reduced motion. */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;
let rafId = 0;

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
    prevent: lenisPreventNode,
  });
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
