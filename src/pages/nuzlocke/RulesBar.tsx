/* Nuzlocke run — sticky 48px rules bar (nuzlocke.md §2.2):
 * counters (tween + dot pop) · clause toggles · route progress. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Minus, Plus } from 'lucide-react';
import { boxedOf, kpisOf, pushToast, setRunRules } from '@/lib/nuzlocke-store';
import type { NuzRules, RunState } from '@/lib/nuzlocke-store';
import { RULE_PRESETS, effectiveLevelCap, nextGymInfo } from '@/lib/nuzlocke-rules';
import type { RulePresetKey } from '@/lib/nuzlocke-rules';
import { nodeIndex, nodeName } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import { useLanguage } from '@/lib/i18n-data';
import { cn } from '@/lib/utils';
import HonestyHint from '@/components/HonestyHint';
import { GoldSwitch, PixelLabel } from './ui';

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

/** Level-cap stepper — manual number or off (null). Shared by editor + wizard. */
export function LevelCapStepper({ value, onChange, disabled }: { value: number | null; onChange: (v: number | null) => void; disabled?: boolean }) {
  const { t } = useTranslation();
  const shown = value ?? 15;
  return (
    <span className={cn('inline-flex items-center gap-1', disabled && 'opacity-40')}>
      <button
        type="button"
        aria-label={t('nuz.rules.lower')}
        disabled={disabled}
        onClick={() => onChange(value === null ? null : value <= 1 ? null : value - 1)}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed"
      >
        <Minus size={11} />
      </button>
      <span className={cn('min-w-[52px] text-center font-display text-[12px] font-bold tabular-nums', value === null ? 'text-tx-muted' : 'text-gold')}>
        {value === null ? t('nuz.rules.noCap') : `LV ${value}`}
      </span>
      <button
        type="button"
        aria-label={t('nuz.rules.raise')}
        disabled={disabled}
        onClick={() => onChange(Math.min(100, shown + 1))}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed"
      >
        <Plus size={11} />
      </button>
    </span>
  );
}

/** Badge-progress stepper (0–8) — owner-editable, drives the auto cap
 * (`nextGymInfo`) while `autoLevelCap` is on. Shared by the rules editor and
 * the New Run wizard preview. */
export function BadgeStepper({
  value,
  onChange,
  total = 8,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  total?: number;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center gap-1', disabled && 'opacity-40')}>
      <button
        type="button"
        aria-label={t('nuz.rules.lowerBadges')}
        disabled={disabled}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed"
      >
        <Minus size={11} />
      </button>
      <span className="min-w-[40px] text-center font-display text-[12px] font-bold tabular-nums text-gold">
        {value}/{total}
      </span>
      <button
        type="button"
        aria-label={t('nuz.rules.raiseBadges')}
        disabled={disabled}
        onClick={() => onChange(Math.min(total, value + 1))}
        className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed"
      >
        <Plus size={11} />
      </button>
    </span>
  );
}

const PRESET_KEYS: RulePresetKey[] = ['classic', 'hardcoreLite', 'soulLink'];

/** Preset buttons (§B1) — merge a canned set of ALREADY-EXISTING toggles
 * onto the current rules. Shared by the rules editor and the wizard. */
export function RulePresetButtons({
  onApply,
  soulLinkDisabled,
}: {
  onApply: (key: RulePresetKey) => void;
  /** disable the SoulLink preset when the crew can't support it (<2 players) */
  soulLinkDisabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESET_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          disabled={key === 'soulLink' && soulLinkDisabled}
          onClick={() => onApply(key)}
          className="rounded-full border border-hairline2 px-2.5 py-1 font-pixel text-[7px] tracking-[0.06em] text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          {t(`nuz.rules.preset.${key}`)}
        </button>
      ))}
    </div>
  );
}

/** Shared rules editor — used in the header "Edit rules" popover (owner). */
export function RulesEditor({ state }: { state: RunState }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const r = state.run.rules;
  const set = (patch: Parameters<typeof setRunRules>[1]) => setRunRules(state.run.id, patch);
  const applyPreset = (key: RulePresetKey) => set(RULE_PRESETS[key]);
  const gymInfo = r.autoLevelCap ? nextGymInfo(state) : null;
  const region = gymInfo ? anyRegionById(state.run.region) : undefined;
  const gymNode = gymInfo && region ? nodeIndex(region).get(gymInfo.gymNodeId) : undefined;
  return (
    <div className="w-[260px] space-y-2.5 p-3">
      <PixelLabel className="text-gold">{t('nuz.rules.houseRules')}</PixelLabel>
      <RulePresetButtons onApply={applyPreset} soulLinkDisabled={state.players.length < 2 && state.mode !== 'multi'} />
      <div />
      <GoldSwitch checked={r.dupes} onChange={(v) => set({ dupes: v })} label={t('nuz.rules.dupesClause')} tip={t('nuz.rules.dupesTip')} />
      {r.dupes && (
        <>
          <div />
          <GoldSwitch checked={r.dupesDead} onChange={(v) => set({ dupesDead: v })} label={t('nuz.rules.dupesDead')} tip={t('nuz.rules.dupesDeadTip')} />
          <div />
          <GoldSwitch checked={r.dupesEncounter} onChange={(v) => set({ dupesEncounter: v })} label={t('nuz.rules.dupesEncounter')} tip={t('nuz.rules.dupesEncounterTip')} />
        </>
      )}
      <div />
      <GoldSwitch checked={r.shiny} onChange={(v) => set({ shiny: v })} label={t('nuz.rules.shinyClause')} tip={t('nuz.rules.shinyTip')} />
      <div />
      <GoldSwitch checked={r.soulLink} onChange={(v) => set({ soulLink: v })} label={t('nuz.rules.soulLink')} tip={t('nuz.rules.soulLinkTip')} />
      {r.soulLink && (
        <>
          <div />
          <GoldSwitch checked={r.soulLinkCascade} onChange={(v) => set({ soulLinkCascade: v })} label={t('nuz.rules.soulLinkCascade')} tip={t('nuz.rules.soulLinkCascadeTip')} />
        </>
      )}
      <div />
      <GoldSwitch checked={r.nicknames} onChange={(v) => set({ nicknames: v })} label={t('nuz.wizard.nicknames')} tip={t('nuz.wizard.nickTip')} />
      <div />
      <GoldSwitch checked={r.releaseOnDeath} onChange={(v) => set({ releaseOnDeath: v })} label={t('nuz.rules.releaseOnDeath')} tip={t('nuz.rules.releaseOnDeathTip')} />
      <div />
      <GoldSwitch checked={r.randomizer} onChange={(v) => set({ randomizer: v })} label={t('nuz.rules.randomizer')} tip={t('nuz.rules.randomizerTip')} />
      <div />
      <GoldSwitch checked={r.autoLevelCap} onChange={(v) => set({ autoLevelCap: v })} label={t('nuz.rules.autoLevelCap')} tip={t('nuz.rules.autoLevelCapTip')} />
      {r.autoLevelCap && (
        <>
          <div />
          <span className="flex items-center justify-between gap-2">
            <PixelLabel>{t('nuz.rules.badges')}</PixelLabel>
            <BadgeStepper value={r.badgesCleared} onChange={(v) => set({ badgesCleared: v })} />
          </span>
          {gymNode && (
            <p className="text-[10px] leading-snug text-tx-muted">
              {t('nuz.rules.nextGymHint', { gym: nodeName(gymNode, lang), cap: gymInfo!.cap })}
            </p>
          )}
        </>
      )}
      <div />
      <span className="flex items-center justify-between gap-2">
        <PixelLabel>{t('nuz.rules.levelCap')}</PixelLabel>
        <LevelCapStepper value={r.levelCap} onChange={(v) => set({ levelCap: v })} disabled={r.autoLevelCap} />
      </span>
      <HonestyHint show truncate>
        {t('honesty.capUsesRegion')}
      </HonestyHint>
    </div>
  );
}

/** Compact "active rules" line (§B4) — only ON rules, pixel chips, no wall
 * of text. Rules already visible as toggles in the counters row (dupes,
 * shiny, level cap) are skipped here to avoid repeating them. */
function useActiveRuleChips(rules: NuzRules): string[] {
  const { t } = useTranslation();
  const chips: string[] = [];
  if (rules.dupes && rules.dupesDead) chips.push(t('nuz.rules.chipDupesDead'));
  if (rules.dupes && rules.dupesEncounter) chips.push(t('nuz.rules.chipDupesEncounter'));
  if (rules.soulLink) chips.push(t(rules.soulLinkCascade ? 'nuz.rules.chipSoulLinkCascade' : 'nuz.rules.chipSoulLink'));
  if (rules.nicknames) chips.push(t('nuz.rules.chipNicknames'));
  if (rules.releaseOnDeath) chips.push(t('nuz.rules.chipRelease'));
  if (rules.randomizer) chips.push(t('nuz.rules.chipRandomizer'));
  return chips;
}

export default function RulesBar({ state, owner }: { state: RunState; owner: boolean }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const k = kpisOf(state);
  const cap = effectiveLevelCap(state);
  const pct = k.routesTotal > 0 ? Math.round((k.routesDone / k.routesTotal) * 100) : 0;
  /* boxed = alive catches beyond the party of 6, summed over the crew (§0.4) */
  const boxedTotal = state.players.reduce((n, p) => n + boxedOf(state, p.id).length, 0);
  /* B3 — cap chip shows the gym driving it while autoLevelCap is on */
  const gymInfo = state.run.rules.autoLevelCap ? nextGymInfo(state) : null;
  const gymRegion = gymInfo ? anyRegionById(state.run.region) : undefined;
  const gymNode = gymInfo && gymRegion ? nodeIndex(gymRegion).get(gymInfo.gymNodeId) : undefined;
  const gymLabel = gymNode ? nodeName(gymNode, lang) : null;
  const activeChips = useActiveRuleChips(state.run.rules);

  const toggle = (key: 'dupes' | 'shiny', v: boolean) => {
    setRunRules(state.run.id, { [key]: v });
    pushToast('info', i18n.t('nuz.toast.clause', { clause: i18n.t(`nuz.rules.${key}Clause`), state: i18n.t(v ? 'nuz.on' : 'nuz.off') }));
  };

  return (
    <div className="sticky top-16 md:top-[6.25rem] z-30 -mx-4 border-y border-hairline bg-[rgba(13,15,22,0.78)] px-4 backdrop-blur-xl md:-mx-8 md:px-8">
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
          <span title={t('nuz.rules.linksTip')}>
            <Counter label={t('nuz.rules.links')} value={k.links} gold dot={<img src="/sparkle.svg" alt="" className="h-2.5 w-2.5" />} />
          </span>
        </div>

        {/* clause toggles */}
        <div className="flex items-center gap-4 border-l border-hairline2 pl-4">
          <span title={owner ? undefined : t('nuz.rules.ownerTip')}>
            <GoldSwitch checked={state.run.rules.dupes} onChange={(v) => toggle('dupes', v)} disabled={!owner} label={t('nuz.rules.dupesShort')} tip={t('nuz.rules.dupesTip')} />
          </span>
          <span title={owner ? undefined : t('nuz.rules.ownerTip')}>
            <GoldSwitch checked={state.run.rules.shiny} onChange={(v) => toggle('shiny', v)} disabled={!owner} label={t('nuz.rules.shinyShort')} tip={t('nuz.rules.shinyTip')} />
          </span>
          {cap !== null && (
            <span
              className="flex max-w-[190px] items-center gap-1 rounded-full border border-gold/50 px-2 py-0.5"
              title={gymLabel ? t('nuz.rules.capTitleGym', { gym: gymLabel, cap }) : t('nuz.rules.capTitle', { cap })}
            >
              <PixelLabel className="shrink-0 text-gold">{t('nuz.rules.levelCap')}</PixelLabel>
              <span className="shrink-0 font-display text-[12px] font-bold tabular-nums text-gold">{cap}</span>
              {gymLabel && (
                <span className="truncate font-pixel text-[6px] tracking-[0.05em] text-gold/70">
                  · {gymLabel}
                </span>
              )}
            </span>
          )}
        </div>

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

      {/* B4 — compact "active rules" line: only ON rules not already shown above */}
      {activeChips.length > 0 && (
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-1.5 border-t border-hairline/60 py-1">
          <PixelLabel className="shrink-0 text-tx-muted/70">{t('nuz.rules.activeLabel')}</PixelLabel>
          {activeChips.map((c) => (
            <span key={c} className="rounded-full border border-gold/30 bg-gold/5 px-1.5 py-0.5 font-pixel text-[6px] tracking-[0.05em] text-gold/80">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
