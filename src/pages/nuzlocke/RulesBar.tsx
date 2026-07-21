/* Nuzlocke run — sticky 48px rules bar (nuzlocke.md §2.2):
 * counters (tween + dot pop) · clause toggles · level cap · route progress. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { boxedOf, kpisOf, pushToast, setRunRules } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { GoldSwitch, InfoTip, PixelLabel, Popover } from './ui';

/* number tween 300ms (§2.2) */
function useCountUp(value: number): number {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return undefined;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 300);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

function Counter({ label, value, dot, gold }: { label: string; value: number; dot: ReactNode; gold?: boolean }) {
  const shown = useCountUp(value);
  return (
    <span className="flex items-center gap-1.5">
      <motion.span key={value} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
        {dot}
      </motion.span>
      <PixelLabel>{label}</PixelLabel>
      <span className={cn('font-display text-[16px] font-bold tabular-nums', gold ? 'text-gold' : 'text-tx-primary')}>{shown}</span>
    </span>
  );
}

export function LevelCapStepper({ cap, onChange, disabled }: { cap: number | null; onChange: (v: number | null) => void; disabled?: boolean }) {
  const { t } = useTranslation();
  return (
    <span className={cn('flex items-center gap-1.5', disabled && 'opacity-40')}>
      <button
        type="button"
        aria-label={t('nuz.rules.lower')}
        disabled={disabled}
        onClick={() => onChange(cap ? Math.max(1, cap - 1) : null)}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted hover:border-gold hover:text-gold disabled:cursor-not-allowed"
      >
        <Minus size={11} />
      </button>
      <span className="w-8 text-center font-display text-[13px] font-bold tabular-nums text-gold">{cap ?? '—'}</span>
      <button
        type="button"
        aria-label={t('nuz.rules.raise')}
        disabled={disabled}
        onClick={() => onChange(Math.min(100, (cap ?? 25) + 1))}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted hover:border-gold hover:text-gold disabled:cursor-not-allowed"
      >
        <Plus size={11} />
      </button>
    </span>
  );
}

/** Shared rules editor — used in the header "Edit rules" popover (owner). */
export function RulesEditor({ state }: { state: RunState }) {
  const { t } = useTranslation();
  const r = state.run.rules;
  const set = (patch: Parameters<typeof setRunRules>[1]) => setRunRules(state.run.id, patch);
  return (
    <div className="w-[240px] space-y-2.5 p-3">
      <PixelLabel className="text-gold">{t('nuz.rules.houseRules')}</PixelLabel>
      <GoldSwitch checked={r.dupes} onChange={(v) => set({ dupes: v })} label={t('nuz.rules.dupesClause')} tip={t('nuz.rules.dupesTip')} />
      <div />
      <GoldSwitch checked={r.shiny} onChange={(v) => set({ shiny: v })} label={t('nuz.rules.shinyClause')} tip={t('nuz.rules.shinyTip')} />
      <div />
      <GoldSwitch checked={r.soulLink} onChange={(v) => set({ soulLink: v })} label={t('nuz.rules.soulLink')} tip={t('nuz.rules.soulLinkTip')} />
      <div className="flex items-center justify-between border-t border-hairline pt-2.5">
        <span className="flex items-center gap-1.5">
          <PixelLabel>{t('nuz.rules.levelCap')}</PixelLabel>
          <InfoTip text={t('nuz.rules.capTip')} />
        </span>
        <LevelCapStepper cap={r.levelCap} onChange={(v) => set({ levelCap: v })} />
      </div>
    </div>
  );
}

export default function RulesBar({ state, owner }: { state: RunState; owner: boolean }) {
  const { t } = useTranslation();
  const k = kpisOf(state);
  const [capOpen, setCapOpen] = useState(false);
  const cap = state.run.rules.levelCap;
  const pct = k.routesTotal > 0 ? Math.round((k.routesDone / k.routesTotal) * 100) : 0;
  /* boxed = alive catches beyond the party of 6, summed over the crew (§0.4) */
  const boxedTotal = state.players.reduce((n, p) => n + boxedOf(state, p.id).length, 0);

  const toggle = (key: 'dupes' | 'shiny', v: boolean) => {
    setRunRules(state.run.id, { [key]: v });
    pushToast('info', i18n.t('nuz.toast.clause', { clause: i18n.t(`nuz.rules.${key}Clause`), state: i18n.t(v ? 'nuz.on' : 'nuz.off') }).toUpperCase());
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 border-y border-hairline bg-[rgba(13,15,22,0.78)] px-4 backdrop-blur-xl md:-mx-8 md:px-8">
      <div className="mx-auto flex min-h-[48px] max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-1.5 py-1.5">
        {/* counters */}
        <div className="flex items-center gap-4">
          <Counter label={t('nuz.rules.caught')} value={k.caught} dot={<span className="h-2 w-2 rounded-full bg-[#63D96B]" />} />
          <span className="h-4 w-px bg-hairline2" />
          <Counter label={t('nuz.rules.boxed')} value={boxedTotal} dot={<span className="h-2 w-2 rounded-[3px] border border-tx-muted/80 bg-surface3" />} />
          <span className="h-4 w-px bg-hairline2" />
          <Counter label={t('nuz.rules.missed')} value={k.missed} dot={<span className="h-2 w-2 rounded-full border border-gold/70" />} />
          <span className="h-4 w-px bg-hairline2" />
          <Counter
            label={t('nuz.rules.dead')}
            value={k.dead}
            dot={
              <svg width="8" height="8" viewBox="0 0 8 8" className="text-tx-muted">
                <path d="M1 1l6 6M7 1l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
          <span className="h-4 w-px bg-hairline2" />
          <Counter label={t('nuz.rules.links')} value={k.links} gold dot={<img src="/sparkle.svg" alt="" className="h-2.5 w-2.5" />} />
        </div>

        {/* clause toggles */}
        <div className="flex items-center gap-4 border-l border-hairline2 pl-4">
          <span title={owner ? undefined : t('nuz.rules.ownerTip')}>
            <GoldSwitch checked={state.run.rules.dupes} onChange={(v) => toggle('dupes', v)} disabled={!owner} label="DUPES" tip={t('nuz.rules.dupesTip')} />
          </span>
          <span title={owner ? undefined : t('nuz.rules.ownerTip')}>
            <GoldSwitch checked={state.run.rules.shiny} onChange={(v) => toggle('shiny', v)} disabled={!owner} label="SHINY" tip={t('nuz.rules.shinyTip')} />
          </span>
        </div>

        {/* level cap chip */}
        <Popover
          open={capOpen}
          onClose={() => setCapOpen(false)}
          align="right"
          anchor={
            <button
              type="button"
              onClick={() => owner && setCapOpen((o) => !o)}
              title={cap ? t('nuz.rules.capTitle', { cap }) : t('nuz.rules.noCap')}
              className={cn(
                'flex items-center gap-1.5 rounded-full border border-gold/50 px-2.5 py-1',
                owner && 'transition-colors hover:bg-gold/10',
              )}
            >
              <span className="font-display text-[12px] font-bold tabular-nums text-gold">CAP {cap ?? '—'}</span>
            </button>
          }
          className="p-2.5"
        >
          <LevelCapStepper
            cap={cap}
            onChange={(v) => {
              setRunRules(state.run.id, { levelCap: v });
              pushToast('info', v ? i18n.t('nuz.toast.levelCap', { cap: v }) : i18n.t('nuz.toast.levelCleared'));
            }}
          />
        </Popover>

        {/* route progress */}
        <div className="ml-auto flex w-[150px] items-center gap-2">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface3">
            <motion.div
              className="relative h-full rounded-full bg-gold"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            >
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] bg-[length:200%_100%]" />
            </motion.div>
          </div>
          <PixelLabel className="shrink-0">
            {t('nuz.rules.routes', { done: k.routesDone, total: k.routesTotal })}
          </PixelLabel>
        </div>
      </div>
    </div>
  );
}
