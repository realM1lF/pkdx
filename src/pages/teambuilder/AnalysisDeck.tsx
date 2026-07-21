/* AnalysisDeck — the 3-panel command deck (team-builder.md "Analyse-Deck"):
 * DEFENSIVE SYNERGY (span 5) · OFFENSIVE COVERAGE (span 4) · META SNAPSHOT (span 3).
 * All warnings gold, never red (design.md §2.3). */
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, ChevronDown, CloudOff, Crosshair, Shield, Sparkles } from 'lucide-react';
import TypeGlyph from '@/components/TypeGlyph';
import { nameOfMove, nameOfType, useLanguage } from '@/lib/i18n-data';
import { worstCases } from '@/lib/teambuilder';
import type { CoverageResult, DefenseRow, SmogonSpeciesEntry, SmogonSet } from '@/lib/teambuilder';
import { POKEMON_TYPES, STAT_LABELS, STAT_ORDER, TYPE_COLORS } from '@/lib/types';
import { cn } from '@/lib/utils';

/* ============================== DEFENSIVE SYNERGY ============================== */

function DefensePanel({ rows }: { rows: DefenseRow[] }) {
  const worst = worstCases(rows);
  return (
    <section className="tb-panel md:col-span-12 lg:col-span-5" aria-label="Defensive synergy">
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Shield size={11} />
          DEFENSIVE SYNERGY
        </span>
        <span className="tb-micro !text-[7px]">W · R · I PER TYPE</span>
      </div>
      <div className="p-3">
        {/* worst cases first */}
        <div className="mb-2.5 space-y-1" aria-live="polite">
          {worst.length === 0 ? (
            <div className="tb-chip w-full justify-center !py-1.5 text-tx-muted">
              <Check size={10} className="text-gold" />
              NO CRITICAL WEAKNESSES
            </div>
          ) : (
            worst.slice(0, 3).map((w) => (
              <motion.div
                key={w.type}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 rounded-[8px] border border-gold/50 bg-gold/10 px-2 py-1"
              >
                <AlertTriangle size={10} className="shrink-0 text-gold" />
                <span className="tb-micro-gold !text-[8px]">
                  {w.weak}× WEAK {w.type.toUpperCase()} · {w.resist + w.immune} RESIST
                </span>
                <TypeGlyph type={w.type} size={12} className="ml-auto" style={{ color: TYPE_COLORS[w.type].base }} />
              </motion.div>
            ))
          )}
        </div>
        {/* 18-type heatmap */}
        <div className="grid grid-cols-6 gap-1.5">
          {rows.map((r) => (
            <div
              key={r.type}
              data-sev={r.severity}
              className="tb-heat"
              style={{ '--t': TYPE_COLORS[r.type].rgb } as CSSProperties}
              title={`${r.type.toUpperCase()} — ${r.weak} weak · ${r.resist} resist · ${r.immune} immune`}
            >
              <TypeGlyph type={r.type} size={14} style={{ color: TYPE_COLORS[r.type].base }} />
              <span className="text-[8px] font-bold tabular-nums tracking-wider text-tx-muted">
                <span className={cn(r.weak > 0 && 'text-gold')}>{r.weak}</span>
                {'·'}
                <span className={cn(r.resist > 0 && 'text-tx-secondary')}>{r.resist}</span>
                {'·'}
                <span className={cn(r.immune > 0 && 'text-tx-primary')}>{r.immune}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== OFFENSIVE COVERAGE ============================== */

function CoveragePanel({ coverage, loading }: { coverage: CoverageResult; loading: boolean }) {
  const lang = useLanguage();
  const covered = POKEMON_TYPES.filter((t) => coverage.se[t].length > 0);
  return (
    <section className="tb-panel md:col-span-12 lg:col-span-4" aria-label="Offensive coverage">
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Crosshair size={11} />
          OFFENSIVE COVERAGE
        </span>
        <span className="tb-micro !text-[7px] tabular-nums">
          {covered.length}/18 SE {loading && '· SYNC…'}
        </span>
      </div>
      <div className="p-3">
        {/* 18-type coverage strip */}
        <div className="mb-2.5 grid grid-cols-9 gap-1">
          {POKEMON_TYPES.map((t) => {
            const hitters = coverage.se[t];
            const isGap = hitters.length === 0;
            return (
              <div
                key={t}
                className={cn(
                  'flex h-[26px] items-center justify-center rounded-[6px] border transition-all duration-150',
                  isGap
                    ? 'border-gold/60 bg-gold/10 shadow-[0_0_8px_rgba(246,201,69,0.2)]'
                    : 'border-hairline bg-surface2 hover:border-[rgba(var(--t),0.5)]',
                )}
                style={{ '--t': TYPE_COLORS[t].rgb } as CSSProperties}
                title={
                  isGap
                    ? `NO ANSWER FOR ${t.toUpperCase()}`
                    : `${nameOfType(t, lang).toUpperCase()} hit super-effectively by: ${hitters.map((h) => nameOfMove(h, lang)).join(', ')}`
                }
              >
                <TypeGlyph
                  type={t}
                  size={12}
                  style={{ color: isGap ? '#F6C945' : TYPE_COLORS[t].base, opacity: isGap ? 1 : 0.85 }}
                />
              </div>
            );
          })}
        </div>
        {/* gold gap warnings */}
        <div className="mb-2 space-y-1" aria-live="polite">
          {coverage.gaps.length === 0 ? (
            <div className="tb-chip w-full justify-center !py-1 text-tx-muted">
              <Check size={10} className="text-gold" />
              FULL SUPER-EFFECTIVE COVERAGE
            </div>
          ) : (
            coverage.gaps.slice(0, 4).map((g) => (
              <div key={g} className="tb-micro-gold flex items-center gap-1.5 !text-[8px]">
                <AlertTriangle size={9} />
                NO ANSWER FOR {g.toUpperCase()}
              </div>
            ))
          )}
          {coverage.gaps.length > 4 && (
            <div className="tb-micro !text-[8px]">+{coverage.gaps.length - 4} MORE GAPS</div>
          )}
        </div>
        {/* STAB summary */}
        <div className="border-t border-hairline pt-2">
          <span className="tb-micro !text-[7px]">STAB COVERAGE</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {coverage.stabTypes.length === 0 ? (
              <span className="tb-micro !text-[8px]">ADD DAMAGING MOVES</span>
            ) : (
              coverage.stabTypes.map((t) => (
                <span key={t} className="tb-chip !text-[8px]" style={{ color: TYPE_COLORS[t].base }}>
                  <TypeGlyph type={t} size={9} />
                  {t}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== META SNAPSHOT ============================== */

export type MetaState = 'idle' | 'loading' | 'ready' | 'unavailable';

interface MetaPanelProps {
  state: MetaState;
  entry: SmogonSpeciesEntry | null;
  focusLabel: string | null;
  onApplySet: (set: SmogonSet) => void;
  applied: boolean;
}

function SetCard({
  set,
  primary,
  onApply,
  applied,
}: {
  set: SmogonSet;
  primary: boolean;
  onApply: () => void;
  applied: boolean;
}) {
  const [open, setOpen] = useState(primary);
  const evSpread = set.evs[0];
  const evText = evSpread
    ? STAT_ORDER.filter((k) => (evSpread[k] ?? 0) > 0)
        .map((k) => `${evSpread[k]} ${STAT_LABELS[k]}`)
        .join(' · ')
    : null;
  return (
    <div className={cn('rounded-[10px] border p-2', primary ? 'border-gold/40 bg-gold/5' : 'border-hairline bg-surface2')}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 text-left">
        <span className="truncate text-[11px] font-bold uppercase tracking-wide text-tx-primary">{set.name}</span>
        <ChevronDown size={12} className={cn('shrink-0 text-tx-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-1 pt-2 text-[10px] leading-relaxed text-tx-secondary">
              {set.items[0] && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">ITEM</span>
                  <span className="truncate font-semibold">{set.items[0]}</span>
                </div>
              )}
              {set.abilities[0] && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">ABILITY</span>
                  <span className="truncate font-semibold">{set.abilities[0]}</span>
                </div>
              )}
              {set.natures[0] && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">NATURE</span>
                  <span className="font-semibold">{set.natures[0]}</span>
                </div>
              )}
              {evText && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">EVS</span>
                  <span className="text-right font-semibold tabular-nums">{evText}</span>
                </div>
              )}
              <div className="border-t border-hairline pt-1">
                {set.moves.slice(0, 4).map((slot, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="tb-micro w-3 !text-[7px]">{i + 1}</span>
                    <span className="truncate font-semibold text-tx-primary">{slot[0] ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" onClick={onApply} className="tb-btn tb-btn-primary mt-2 w-full justify-center !py-1.5 !text-[9px]">
              {applied ? (
                <>
                  <Check size={10} /> APPLIED
                </>
              ) : (
                'APPLY SET'
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaPanel({ state, entry, focusLabel, onApplySet, applied }: MetaPanelProps) {
  return (
    <section className="tb-panel md:col-span-12 lg:col-span-3" aria-label="Meta snapshot">
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Sparkles size={11} />
          META · OU (Smogon)
        </span>
        {entry?.weight != null && (
          <span className="tb-chip !text-[8px] text-gold">USAGE {(entry.weight * 100).toFixed(1)}%</span>
        )}
      </div>
      <div className="p-3">
        {state === 'unavailable' && (
          <div className="flex items-center gap-2 rounded-[8px] border border-gold/50 bg-gold/10 px-2.5 py-2">
            <CloudOff size={12} className="shrink-0 text-gold" />
            <span className="tb-micro-gold !text-[8px]">META UNAVAILABLE</span>
          </div>
        )}
        {state === 'loading' && <div className="tb-micro py-2">SYNCING OU DATA…</div>}
        {state !== 'unavailable' && state !== 'loading' && !entry && (
          <div className="tb-micro py-2">{focusLabel ? `NO OU SETS FOR ${focusLabel.toUpperCase()}` : 'FOCUS A SLOT TO SCAN META'}</div>
        )}
        {entry && (
          <div className="space-y-2">
            <SetCard set={entry.sets[0]} primary onApply={() => onApplySet(entry.sets[0])} applied={applied} />
            {entry.sets.slice(1, 3).map((s) => (
              <SetCard key={s.name} set={s} primary={false} onApply={() => onApplySet(s)} applied={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================== DECK ============================== */

interface AnalysisDeckProps {
  defenseRows: DefenseRow[];
  coverage: CoverageResult;
  coverageLoading: boolean;
  metaState: MetaState;
  metaEntry: SmogonSpeciesEntry | null;
  metaFocusLabel: string | null;
  onApplySet: (set: SmogonSet) => void;
  appliedSetName: string | null;
}

export default function AnalysisDeck({
  defenseRows,
  coverage,
  coverageLoading,
  metaState,
  metaEntry,
  metaFocusLabel,
  onApplySet,
  appliedSetName,
}: AnalysisDeckProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
      <DefensePanel rows={defenseRows} />
      <CoveragePanel coverage={coverage} loading={coverageLoading} />
      <MetaPanel
        state={metaState}
        entry={metaEntry}
        focusLabel={metaFocusLabel}
        onApplySet={onApplySet}
        applied={appliedSetName === metaEntry?.sets[0]?.name}
      />
    </div>
  );
}
