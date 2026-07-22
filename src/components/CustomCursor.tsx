/* CustomCursor — gold dot + trailing ring (Stephen-Scaff-Pattern).
 * Dot folgt instant, Ring mit Lerp-Trägheit; wächst über interaktiven
 * Elementen. Nur fine-pointer Geräte, respektiert reduced-motion.
 * Rein ref/rAF-basiert — keine React-Rerenders pro Mausbewegung. */
import { useEffect, useRef } from 'react';

const INTERACTIVE =
  'a, button, [role="button"], [role="option"], [role="tab"], select, input, textarea, label, summary, [data-cursor-hover]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let shown = false;
    let raf = 0;

    const show = (on: boolean) => {
      shown = on;
      dot.style.opacity = on ? '1' : '0';
      ring.style.opacity = on ? '1' : '0';
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        rx = mx;
        ry = my;
        show(true);
      }
      const hover = Boolean((e.target as Element | null)?.closest?.(INTERACTIVE));
      dot.classList.toggle('is-hover', hover);
      ring.classList.toggle('is-hover', hover);
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) show(false);
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseout', onOut);
      root.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="pdx-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="pdx-cursor-ring" aria-hidden="true" />
    </>
  );
}
