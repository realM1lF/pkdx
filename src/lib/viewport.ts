import * as React from 'react';
import {
  getZoomPercent,
  ZOOM_CHANGE_EVENT,
} from '@/lib/page-zoom';

/** Breakpoint threshold scaled by current page zoom (mirrors postcss-zoom-media). */
export function scaledBreakpoint(px: number): number {
  return px * (getZoomPercent() / 100);
}

export function isBelowBreakpoint(px: number): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < scaledBreakpoint(px);
}

export function isAtOrAboveBreakpoint(px: number): boolean {
  return !isBelowBreakpoint(px);
}

export function useLayoutBreakpoint(px: number): boolean {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== 'undefined' ? isAtOrAboveBreakpoint(px) : false,
  );

  React.useEffect(() => {
    const update = () => setMatches(isAtOrAboveBreakpoint(px));
    update();
    window.addEventListener('resize', update);
    window.addEventListener(ZOOM_CHANGE_EVENT, update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener(ZOOM_CHANGE_EVENT, update);
    };
  }, [px]);

  return matches;
}

/** Mobile layout tier — 768px Tailwind `md` breakpoint. */
export function useIsMobile(): boolean {
  return !useLayoutBreakpoint(768);
}

function coarsePointerActive(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Touch-first devices — disable drag reorder, grab cursors, etc. */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = React.useState(coarsePointerActive);

  React.useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return coarse;
}

/** Read root rem size in CSS pixels (respects page zoom). */
export function rootFontPx(): number {
  if (typeof document === 'undefined') return 16;
  const size = getComputedStyle(document.documentElement).fontSize;
  const parsed = parseFloat(size);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 16;
}

/** Convert rem count to current CSS pixels (respects page zoom). */
export function remPx(rem: number): number {
  return rem * rootFontPx();
}

/** Reactive rem→px for JS layout math (scroll widths, inline heights). */
export function useRemPx(rem: number): number {
  const [px, setPx] = React.useState(() => remPx(rem));

  React.useEffect(() => {
    const update = () => setPx(remPx(rem));
    update();
    window.addEventListener('resize', update);
    window.addEventListener(ZOOM_CHANGE_EVENT, update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener(ZOOM_CHANGE_EVENT, update);
    };
  }, [rem]);

  return px;
}
