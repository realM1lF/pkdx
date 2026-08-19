/* page-zoom — programmatic page zoom via root font-size + data-zoom attribute.
 * Breakpoint compensation is handled at build time (postcss-zoom-media.mjs).
 * Real browser zoom is not scriptable; CSS `zoom` is avoided (portal bugs).
 *
 * Press Start 2P micro labels and compact rounded-pill chips keep Tailwind
 * text-[Npx] (fixed px, utilities layer) — not rem text-micro* — so density
 * texture stays stable while layout scales. */

export const ZOOM_STORAGE_KEY = 'pdx2.zoom';
export const ZOOM_MIN = 50;
export const ZOOM_MAX = 250;
export const ZOOM_STEP = 10;
export const ZOOM_BASE_PX = 16;
export const ZOOM_DEFAULT = 100;
export const ZOOM_DEFAULT_DESKTOP = 130;
export const ZOOM_DESKTOP_MIN_WIDTH = 768;
export const ZOOM_CHANGE_EVENT = 'pdx2:zoomchange';

/** First-visit default — 130 % on desktop (md+), 100 % on smaller viewports. */
export function defaultZoomPercent(): number {
  if (typeof window === 'undefined') return ZOOM_DEFAULT;
  try {
    if (window.matchMedia(`(min-width: ${ZOOM_DESKTOP_MIN_WIDTH}px)`).matches) {
      return ZOOM_DEFAULT_DESKTOP;
    }
  } catch {
    /* matchMedia unavailable — fall through */
  }
  return ZOOM_DEFAULT;
}

/** Allowed zoom levels — kept in sync with postcss-zoom-media.mjs */
export const ZOOM_LEVELS: readonly number[] = Array.from(
  { length: (ZOOM_MAX - ZOOM_MIN) / ZOOM_STEP + 1 },
  (_, i) => ZOOM_MIN + i * ZOOM_STEP,
);

export function clampZoom(value: number): number {
  if (!Number.isFinite(value)) return 100;
  const stepped = Math.round(value / ZOOM_STEP) * ZOOM_STEP;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, stepped));
}

export function readZoom(): number {
  if (typeof window === 'undefined') return ZOOM_DEFAULT;
  try {
    const raw = localStorage.getItem(ZOOM_STORAGE_KEY);
    if (raw == null) return clampZoom(defaultZoomPercent());
    return clampZoom(Number(raw));
  } catch {
    return clampZoom(defaultZoomPercent());
  }
}

export function applyZoom(percent: number): void {
  const zoom = clampZoom(percent);
  const root = document.documentElement;
  root.dataset.zoom = String(zoom);
  root.style.fontSize = zoom === 100 ? '' : `${(ZOOM_BASE_PX * zoom) / 100}px`;
}

export function persistZoom(percent: number): void {
  try {
    localStorage.setItem(ZOOM_STORAGE_KEY, String(clampZoom(percent)));
  } catch {
    /* private mode — zoom still works for the session */
  }
}

export function dispatchZoomChange(): void {
  window.dispatchEvent(new CustomEvent(ZOOM_CHANGE_EVENT));
}

export function setZoom(percent: number): void {
  applyZoom(percent);
  persistZoom(percent);
  dispatchZoomChange();
}

export function getZoomPercent(): number {
  if (typeof document === 'undefined') return 100;
  const fromDom = Number(document.documentElement.dataset.zoom);
  return Number.isFinite(fromDom) && fromDom > 0 ? fromDom : readZoom();
}
