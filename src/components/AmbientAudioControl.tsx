/* Header control — toggle R/B Route 1 music + volume popover (default off). */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AMBIENT_CHANGE_EVENT,
  AMBIENT_VOLUME_DEFAULT,
  AMBIENT_VOLUME_MAX,
  readAmbientEnabled,
  readAmbientVolume,
  setAmbientEnabled,
  setAmbientVolume,
} from '@/lib/rb-ambient-audio';

export default function AmbientAudioControl({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [enabled, setEnabledState] = useState(readAmbientEnabled);
  const [volume, setVolumeState] = useState(readAmbientVolume);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onChange = () => {
      setEnabledState(readAmbientEnabled());
      setVolumeState(readAmbientVolume());
    };
    window.addEventListener(AMBIENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(AMBIENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !enabled;
    setEnabledState(next);
    setAmbientEnabled(next);
  };

  const onVolumeInput = (pct: number) => {
    const v = Math.min(AMBIENT_VOLUME_MAX, Math.max(0, pct / 100));
    setVolumeState(v);
    setAmbientVolume(v);
    if (v > 0 && !enabled) {
      setEnabledState(true);
      setAmbientEnabled(true);
    }
  };

  const volumePct = Math.round(volume * 100);

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={t('nav.ambient')}
      className={cn(
        'relative flex h-10 items-center rounded-md border border-hairline bg-surface2',
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? t('nav.ambientOff') : t('nav.ambientOn')}
        className={cn(
          'grid h-10 w-9 place-items-center rounded-l-md transition-colors',
          enabled ? 'text-gold hover:text-gold/90' : 'text-tx-muted hover:text-tx-primary',
        )}
      >
        {enabled ? <Volume2 className="size-[0.9375rem]" strokeWidth={2} /> : <VolumeX className="size-[0.9375rem]" strokeWidth={2} />}
      </button>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('nav.ambientVolume')}
        className="flex h-10 items-center gap-0.5 rounded-r-md border-l border-hairline px-1.5 text-tx-muted transition-colors hover:text-gold"
      >
        <span className="pixel-label min-w-[1.75rem] text-center text-[10px] text-tx-primary">{volumePct}</span>
        <ChevronDown className={cn('size-3 transition-transform', open && 'rotate-180')} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[60] mt-1.5 w-[13.5rem] rounded-md border border-hairline2 bg-surface2 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          <p className="font-pixel text-[8px] tracking-[0.06em] text-gold">{t('nav.ambientPanel')}</p>
          <p className="mt-1.5 text-micro10 leading-snug text-tx-muted">{t('nav.ambientHint')}</p>
          <label className="mt-3 flex items-center gap-2">
            <span className="shrink-0 font-pixel text-[8px] text-tx-muted">{t('nav.ambientVolume')}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={volumePct}
              onChange={(e) => onVolumeInput(Number(e.target.value))}
              className="h-1.5 min-w-0 flex-1 cursor-pointer accent-gold"
            />
            <span className="w-8 shrink-0 text-right font-display text-micro10 tabular-nums text-tx-secondary">{volumePct}%</span>
          </label>
          <button
            type="button"
            onClick={() => onVolumeInput(Math.round(AMBIENT_VOLUME_DEFAULT * 100))}
            className="mt-2 font-pixel text-[8px] text-tx-muted transition-colors hover:text-gold"
          >
            {t('nav.ambientReset')}
          </button>
        </div>
      )}
    </div>
  );
}
