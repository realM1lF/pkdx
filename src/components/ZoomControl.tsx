/* ZoomControl — browser-style page zoom next to the language switch.
 * Scales via root font-size (rem-based Tailwind) + build-time breakpoint compensation.
 * Deliberately NOT CSS `zoom` — breaks portal dropdowns / coordinate UI. */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  readZoom,
  setZoom,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from '@/lib/page-zoom';

export default function ZoomControl({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [zoom, setZoomState] = useState<number>(readZoom);

  useEffect(() => {
    setZoom(zoom);
  }, [zoom]);

  const bump = (delta: number) =>
    setZoomState((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) / ZOOM_STEP) * ZOOM_STEP)));

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
        onClick={() => bump(-ZOOM_STEP)}
        disabled={zoom <= ZOOM_MIN}
        aria-label={t('nav.zoomOut')}
        className="grid h-7 w-7 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-tx-muted"
      >
        <Minus className="size-[0.8125rem]" strokeWidth={2} />
      </button>
      <span className="pixel-label min-w-[2.375rem] text-center text-[9px] text-tx-primary" aria-live="polite">
        {zoom}%
      </span>
      <button
        type="button"
        onClick={() => bump(ZOOM_STEP)}
        disabled={zoom >= ZOOM_MAX}
        aria-label={t('nav.zoomIn')}
        className="grid h-7 w-7 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-tx-muted"
      >
        <Plus className="size-[0.8125rem]" strokeWidth={2} />
      </button>
    </div>
  );
}
