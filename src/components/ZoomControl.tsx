/* ZoomControl — browser-style page zoom next to the language switch.
 * Real browser zoom is not scriptable, so we emulate it with the CSS `zoom`
 * property on <html> (same visual result; layout, media queries and rem
 * units all scale). Persisted in localStorage, range 50–150% in 10% steps. */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const KEY = 'pdx2.zoom';
const MIN = 50;
const MAX = 150;
const STEP = 10;

function readZoom(): number {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? Number(raw) : 100;
    return Number.isFinite(v) ? Math.min(MAX, Math.max(MIN, v)) : 100;
  } catch {
    return 100;
  }
}

function applyZoom(v: number) {
  /* `zoom` is intentionally NOT TS-typed on CSSStyleDeclaration in older
   * lib.dom versions — cast. Supported by Chromium/Safari and Firefox 126+. */
  (document.documentElement.style as CSSStyleDeclaration & { zoom?: string }).zoom =
    v === 100 ? '' : String(v / 100);
}

export default function ZoomControl({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState<number>(readZoom);

  useEffect(() => {
    applyZoom(zoom);
    try {
      localStorage.setItem(KEY, String(zoom));
    } catch {
      /* private mode — zoom still works for the session */
    }
  }, [zoom]);

  const bump = (delta: number) =>
    setZoom((z) => Math.min(MAX, Math.max(MIN, Math.round((z + delta) / STEP) * STEP)));

  return (
    <div
      role="group"
      aria-label={t('nav.zoom')}
      className={cn(
        'flex h-10 items-center rounded-md border border-hairline bg-surface2 px-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => bump(-STEP)}
        disabled={zoom <= MIN}
        aria-label={t('nav.zoomOut')}
        className="grid h-7 w-7 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-tx-muted"
      >
        <Minus size={13} strokeWidth={2} />
      </button>
      <span className="pixel-label min-w-[38px] text-center text-[9px] text-tx-primary" aria-live="polite">
        {zoom}%
      </span>
      <button
        type="button"
        onClick={() => bump(STEP)}
        disabled={zoom >= MAX}
        aria-label={t('nav.zoomIn')}
        className="grid h-7 w-7 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-tx-muted"
      >
        <Plus size={13} strokeWidth={2} />
      </button>
    </div>
  );
}
