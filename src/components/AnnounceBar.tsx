/* Slim gold news ticker above the navbar.
 * Loop: two identical tracks, translateX(-50%). Pause on hover/focus.
 * Duplicate track is aria-hidden. Dismiss lives in localStorage + data-announce. */
import { useEffect, useState } from 'react';
import { KeyRound, Map, MessageCircle, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { applyAnnounceDismissed, isAnnounceDismissed } from '@/lib/announce-bar';
import { cn } from '@/lib/utils';

const ITEMS = [
  { key: 'emailLogin', Icon: KeyRound },
  { key: 'kalos', Icon: Map },
  { key: 'discord', Icon: MessageCircle },
  { key: 'ux', Icon: Sparkles },
] as const;

function TickerTrack({ hidden }: { hidden?: boolean }) {
  const { t } = useTranslation();
  return (
    <ul
      className={cn('flex shrink-0 items-center', hidden && 'announce-track-dup')}
      aria-hidden={hidden || undefined}
    >
      {ITEMS.map(({ key, Icon }) => (
        <li key={key} className="flex shrink-0 items-center gap-1.5 px-5">
          <Icon size={11} strokeWidth={2.25} aria-hidden className="shrink-0" />
          <span className="whitespace-nowrap font-sans text-[12px] font-semibold leading-none">
            {t(`announce.items.${key}`)}
          </span>
          <span className="ml-3 h-1 w-1 rotate-45 bg-current opacity-45" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export default function AnnounceBar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isAnnounceDismissed()) setVisible(false);
  }, []);

  if (!visible) return null;

  const tooltip = t('announce.tooltip');

  return (
    <>
      <div
        data-announce-bar
        role="region"
        aria-label={t('announce.label')}
        aria-describedby={tip ? 'announce-tooltip' : undefined}
        className="group fixed inset-x-0 top-0 z-[51] h-[1.2rem] overflow-hidden bg-[rgb(43,35,12)] text-[rgb(151,124,44)]"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          if ((e.target as HTMLElement).closest('[data-announce-dismiss]')) {
            setTip(null);
            return;
          }
          setTip({ x: e.clientX, y: e.clientY });
        }}
        onPointerLeave={() => setTip(null)}
      >
        <div className="announce-track">
          <TickerTrack />
          <TickerTrack hidden />
        </div>
        <button
          type="button"
          data-announce-dismiss
          onClick={() => {
            applyAnnounceDismissed();
            setVisible(false);
          }}
          aria-label={t('announce.dismiss')}
          className="absolute inset-y-0 right-0 z-10 grid w-7 place-items-center bg-[rgb(43,35,12)] text-[rgb(151,124,44)] hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[rgb(151,124,44)]"
        >
          <X size={12} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      {tip ? (
        <div
          id="announce-tooltip"
          role="tooltip"
          data-announce-tooltip
          className="pointer-events-none fixed z-[80] -translate-x-1/2 whitespace-nowrap rounded-sm border border-[rgb(151,124,44)]/35 bg-[rgb(43,35,12)] px-2 py-1 font-sans text-[11px] font-semibold leading-none text-[rgb(151,124,44)] shadow-elevate"
          style={{ left: tip.x, top: tip.y + 14 }}
        >
          {tooltip}
        </div>
      ) : null}
    </>
  );
}
