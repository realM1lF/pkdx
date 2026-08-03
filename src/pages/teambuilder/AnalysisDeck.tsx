/* AnalysisDeck — command deck under the 6-slot row:
 * DEFENSE (lg 8/12): single tall matrix — team header once, all 18 types stacked.
 * OFFENSE (lg 4/12): coverage strip + gap callouts with plain-language hints.
 * META (full width below): Smogon gen9 OU reference sets (template, not game law).
 * All warnings gold, never red (design.md §2.3). */
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, ChevronDown, CloudOff, Crosshair, Gamepad2, Shield, Sparkles, Wrench } from 'lucide-react';
import Sprite from '@/components/Sprite';
import TypeGlyph from '@/components/TypeGlyph';
import { useTranslation } from 'react-i18next';
import { nameOfItem, nameOfMove, nameOfPokemon, nameOfType, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import {
  coverTypesFor,
  effectivenessVsMember,
  genHasMechanics,
  seTypesAgainst,
  versionGroupById,
  worstCases,
} from '@/lib/teambuilder';
import type { CoverageResult, DefenseRow, SmogonSpeciesEntry, SmogonSet, TeamMemberDefense } from '@/lib/teambuilder';
import { POKEMON_TYPES, STAT_LABELS, STAT_ORDER, TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

/** one filled team slot as a matrix column */
export interface MatrixMember extends TeamMemberDefense {
  slotId: string;
  pokemonId: number;
  slug: string;
}

/* ============================== DEFENSIVE MATRIX ============================== */

/** exact glyphs for every multiplier ability-modified matchups can produce
 * (Filter/Solid Rock 4→3, 2→1½, ½→⅜…; Dry Skin 1→1¼, 2→2½, 4→5, ½→⅝…) */
const EFF_LABELS: Record<number, string> = {
  0: '0',
  0.125: '⅛',
  0.25: '¼',
  0.375: '⅜',
  0.5: '½',
  0.625: '⅝',
  0.75: '¾',
  1: '',
  1.25: '1¼',
  1.5: '1½',
  2: '2',
  2.5: '2½',
  3: '3',
  4: '4',
  5: '5',
};

export function effLabel(eff: number): string {
  return EFF_LABELS[eff] ?? String(eff);
}

function effKind(eff: number): 'wk4' | 'wk' | 'nu' | 'rs' | 'im' {
  if (eff === 0) return 'im';
  if (eff >= 4) return 'wk4';
  if (eff > 1) return 'wk';
  if (eff < 1) return 'rs';
  return 'nu';
}

/** tiny colored type chip used inside fix hints */
function FixChip({ type, label }: { type: PokemonType; label?: string }) {
  const lang = useLanguage();
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[8px] font-bold uppercase tracking-wide"
      style={{
        color: TYPE_COLORS[type].base,
        background: `rgba(${TYPE_COLORS[type].rgb},0.14)`,
        boxShadow: `inset 0 0 0 1px rgba(${TYPE_COLORS[type].rgb},0.4)`,
      }}
    >
      <TypeGlyph type={type} size={8} />
      {label ?? nameOfType(type, lang)}
    </span>
  );
}

function WorstCallout({ row, vgId }: { row: DefenseRow; vgId: string }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const cover = coverTypesFor(row.type, vgId);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[8px] border border-gold/50 bg-gold/10 px-2 py-1.5"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={10} className="shrink-0 text-gold" />
        <span className="text-[11px] font-semibold text-gold">
          {t('tb.worstLine', { weak: row.weak, type: nameOfType(row.type, lang), resist: row.resist + row.immune })}
        </span>
        <TypeGlyph type={row.type} size={12} className="ml-auto shrink-0" style={{ color: TYPE_COLORS[row.type].base }} />
      </div>
      {/* concrete fix hint: which types resist / are immune to the threat */}
      <div className="mt-1 flex flex-wrap items-center gap-1 pl-[18px]">
        <Wrench size={8} className="shrink-0 text-tx-muted" aria-hidden />
        <span className="tb-micro !text-[7px]">{t('tb.fixWith')}</span>
        {cover.resists.slice(0, 4).map((ty) => (
          <FixChip key={ty} type={ty} />
        ))}
        {cover.immunes.map((ty) => (
          <FixChip key={ty} type={ty} label={`${nameOfType(ty, lang)} ×0`} />
        ))}
      </div>
    </motion.div>
  );
}

function DefensePanel({ rows, members, vgId }: { rows: DefenseRow[]; members: MatrixMember[]; vgId: string }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const worst = worstCases(rows);
  /* type label + one cell per filled member — single tall matrix, team header once */
  const gridCols = `minmax(72px, 88px) repeat(${Math.max(members.length, 1)}, minmax(0,1fr))`;

  return (
    <section className="tb-panel md:col-span-12 lg:col-span-8" aria-label={t('tb.defenseAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Shield size={11} />
          {t('tb.defenseEyebrow')}
        </span>
      </div>
      <div className="p-3">
        <p className="mb-2 text-[11px] leading-snug text-tx-secondary">{t('tb.defenseHelp')}</p>

        {/* top weaknesses with plain-language fix hints */}
        <div className="mb-2.5 space-y-1.5" aria-live="polite">
          {worst.length === 0 ? (
            <div className="tb-chip w-full justify-center !py-1.5 text-tx-muted">
              <Check size={10} className="text-gold" />
              {t('tb.noCritWeak')}
            </div>
          ) : (
            worst.slice(0, 3).map((w) => <WorstCallout key={w.type} row={w} vgId={vgId} />)
          )}
        </div>

        {/* legend before the grid — read first, then scan numbers */}
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[8px] border border-hairline bg-surface2/60 px-2 py-1.5">
          <span className="tb-micro !text-[8px]">{t('tb.legend.weak')}</span>
          <span className="tb-micro !text-[8px]">{t('tb.legend.resist')}</span>
          <span className="tb-micro !text-[8px]">{t('tb.legend.immune')}</span>
          <span className="tb-micro ml-auto !text-[8px]">{t('tb.legend.ability')}</span>
        </div>

        {/* one team header */}
        <div className="mb-1 grid items-end gap-[3px] pl-1" style={{ gridTemplateColumns: gridCols }}>
          <span className="tb-micro !text-[7px]">{t('tb.defenseColType')}</span>
          {members.map((m) => {
            const name = nameOfPokemon(m.slug, lang);
            return (
              <LocaleLink
                key={m.slotId}
                to={`/pokemon/${m.pokemonId}`}
                className="group/m flex min-w-0 flex-col items-center gap-0.5 outline-none transition-colors hover:text-gold focus-visible:text-gold"
                title={name}
                aria-label={t('tb.slot.openDetail', { name })}
              >
                <Sprite id={m.pokemonId} name={name} era="default" className="h-6 w-6" skeleton={false} />
                <span className="w-full truncate text-center text-[8px] font-semibold uppercase tracking-wide text-tx-muted transition-colors group-hover/m:text-gold">
                  {name}
                </span>
              </LocaleLink>
            );
          })}
        </div>

        {/* all 18 attacking types in one column */}
        <div className="space-y-px">
          {rows.map((r) => (
            <div
              key={r.type}
              className={cn(
                'grid items-center gap-[3px] rounded-[4px] py-0.5 pl-1',
                r.severity >= 2 && 'bg-gold/5 shadow-[inset_2px_0_0_rgba(246,201,69,0.7)]',
              )}
              style={{ gridTemplateColumns: gridCols }}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <TypeGlyph type={r.type} size={12} className="shrink-0" style={{ color: TYPE_COLORS[r.type].base }} />
                <span className="truncate text-[10px] font-semibold uppercase tracking-wide" style={{ color: TYPE_COLORS[r.type].base }}>
                  {nameOfType(r.type, lang)}
                </span>
              </span>
              {members.map((m) => {
                const eff = effectivenessVsMember(r.type, m, vgId);
                return (
                  <span
                    key={m.slotId}
                    data-eff={effKind(eff)}
                    className="tb-cell"
                    style={{ '--t': TYPE_COLORS[r.type].rgb } as CSSProperties}
                    title={t('tb.cellTip', {
                      name: nameOfPokemon(m.slug, lang),
                      eff,
                      type: nameOfType(r.type, lang),
                    })}
                  >
                    {effLabel(eff)}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== OFFENSIVE COVERAGE ============================== */

function CoveragePanel({ coverage, loading, vgId }: { coverage: CoverageResult; loading: boolean; vgId: string }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const covered = POKEMON_TYPES.filter((t) => coverage.se[t].length > 0);
  return (
    <section className="tb-panel md:col-span-12 lg:col-span-4" aria-label={t8n('tb.offenseAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Crosshair size={11} />
          {t8n('tb.offenseEyebrow')}
        </span>
        <span className="tb-micro !text-[8px] tabular-nums">
          {t8n('tb.seCount', { count: covered.length })} {loading && `· ${t8n('tb.sync')}`}
        </span>
      </div>
      <div className="p-3">
        <p className="mb-2 text-[11px] leading-snug text-tx-secondary">{t8n('tb.offenseHelp')}</p>

        {/* 18-type coverage strip — glyph + hitter count */}
        <div className="mb-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-6 lg:grid-cols-3">
          {POKEMON_TYPES.map((t) => {
            const hitters = coverage.se[t];
            const isGap = hitters.length === 0;
            return (
              <div
                key={t}
                className={cn(
                  'flex min-h-[40px] flex-col items-center justify-center gap-0.5 rounded-[6px] border px-1 py-1 transition-all duration-150',
                  isGap
                    ? 'border-gold/60 bg-gold/10 shadow-[0_0_8px_rgba(246,201,69,0.2)]'
                    : 'border-hairline bg-surface2 hover:border-[rgba(var(--t),0.5)]',
                )}
                style={{ '--t': TYPE_COLORS[t].rgb } as CSSProperties}
                title={
                  isGap
                    ? t8n('tb.noAnswerFor', { type: nameOfType(t, lang) })
                    : t8n('tb.hitBy', { type: nameOfType(t, lang), moves: hitters.map((h) => nameOfMove(h, lang)).join(', ') })
                }
              >
                <span className="flex items-center gap-1">
                  <TypeGlyph
                    type={t}
                    size={11}
                    style={{ color: isGap ? '#F6C945' : TYPE_COLORS[t].base, opacity: isGap ? 1 : 0.85 }}
                  />
                  <span className={cn('truncate text-[8px] font-bold uppercase', isGap ? 'text-gold' : 'text-tx-secondary')}>
                    {nameOfType(t, lang)}
                  </span>
                </span>
                <span className={cn('text-[8px] font-bold tabular-nums', isGap ? 'text-gold' : 'text-tx-muted')}>
                  {isGap ? t8n('tb.gapMark') : t8n('tb.seHits', { count: hitters.length })}
                </span>
              </div>
            );
          })}
        </div>
        {/* gold gap callouts + which move types would close them */}
        <div className="mb-2 space-y-1" aria-live="polite">
          {coverage.gaps.length === 0 ? (
            <div className="tb-chip w-full justify-center !py-1 text-tx-muted">
              <Check size={10} className="text-gold" />
              {t8n('tb.fullCoverage')}
            </div>
          ) : (
            coverage.gaps.slice(0, 3).map((g) => (
              <div key={g} className="rounded-[6px] border border-gold/40 bg-gold/5 px-1.5 py-1">
                <div className="tb-micro-gold flex items-center gap-1.5 !text-[8px]">
                  <AlertTriangle size={9} />
                  {t8n('tb.noAnswerFor', { type: nameOfType(g, lang) })}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1 pl-[15px]">
                  <span className="tb-micro !text-[7px]">{t8n('tb.seVia')}</span>
                  {seTypesAgainst(g, vgId).slice(0, 4).map((ty) => (
                    <FixChip key={ty} type={ty} />
                  ))}
                </div>
              </div>
            ))
          )}
          {coverage.gaps.length > 3 && (
            <div className="tb-micro !text-[8px]">{t8n('tb.moreGaps', { count: coverage.gaps.length - 3 })}</div>
          )}
        </div>
        {/* STAB summary — plain language + optional acronym */}
        <div className="border-t border-hairline pt-2">
          <span className="tb-micro !text-[8px]">{t8n('tb.stabCoverage')}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {coverage.stabTypes.length === 0 ? (
              <span className="text-[10px] text-tx-muted">{t8n('tb.addDamaging')}</span>
            ) : (
              coverage.stabTypes.map((t) => (
                <span key={t} className="tb-chip !text-[8px]" style={{ color: TYPE_COLORS[t].base }}>
                  <TypeGlyph type={t} size={9} />
                  {nameOfType(t, lang)}
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
  teamGen: number;
  onApplySet: (set: SmogonSet) => void;
  applied: boolean;
}

function SetCard({
  set,
  primary,
  onApply,
  applied,
  applyLabel,
}: {
  set: SmogonSet;
  primary: boolean;
  onApply: () => void;
  applied: boolean;
  /** override CTA (e.g. "use as template" when team gen ≠ 9) */
  applyLabel?: string;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
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
                  <span className="tb-micro !text-[7px]">{t('tb.item')}</span>
                  {/* Smogon set data is en-only (NON-GOAL); item/ability names localize when a slug matches */}
                  <span className="truncate font-semibold">{nameOfItem(set.items[0].toLowerCase().replace(/ /g, '-'), lang)}</span>
                </div>
              )}
              {set.abilities[0] && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">{t('tb.ability')}</span>
                  <span className="truncate font-semibold">{set.abilities[0]}</span>
                </div>
              )}
              {set.natures[0] && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">{t('tb.nature')}</span>
                  <span className="font-semibold">{set.natures[0]}</span>
                </div>
              )}
              {evText && (
                <div className="flex justify-between gap-2">
                  <span className="tb-micro !text-[7px]">{t('tb.evs')}</span>
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
                  <Check size={10} /> {t('tb.applied')}
                </>
              ) : (
                applyLabel ?? t('tb.applySet')
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaPanel({ state, entry, focusLabel, teamGen, onApplySet, applied }: MetaPanelProps) {
  const { t } = useTranslation();
  const mismatched = teamGen !== 9;
  return (
    <section className="tb-panel md:col-span-12" aria-label={t('tb.metaAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5" title={t('tb.metaGenNote')}>
          <Sparkles size={11} />
          {t('tb.metaEyebrow')}
        </span>
        <span className="flex items-center gap-1.5">
          {applied && (
            <span className="tb-chip !border-gold/60 !bg-gold/10 !text-[8px] !text-gold">{t('tb.setApplied')}</span>
          )}
          {entry?.weight != null && (
            <span className="tb-chip !text-[8px] text-gold">{t('tb.usage', { pct: (entry.weight * 100).toFixed(1) })}</span>
          )}
        </span>
      </div>
      <div className="p-3">
        <p className="mb-2 text-[11px] leading-snug text-tx-secondary">{t('tb.metaHelp')}</p>
        {/* gen-awareness: the meta data is always gen 9 OU — say so, flag mismatch */}
        {mismatched && (
          <div
            className="mb-2 flex items-center gap-1.5 rounded-[8px] border border-gold/50 bg-gold/10 px-2 py-1.5"
            title={t('tb.metaGenNote')}
          >
            <AlertTriangle size={10} className="shrink-0 text-gold" />
            <span className="tb-micro-gold !text-[8px]">{t('tb.metaGenMismatch', { gen: teamGen })}</span>
          </div>
        )}
        {state === 'unavailable' && (
          <div className="flex items-center gap-2 rounded-[8px] border border-gold/50 bg-gold/10 px-2.5 py-2">
            <CloudOff size={12} className="shrink-0 text-gold" />
            <span className="tb-micro-gold !text-[8px]">{t('tb.metaUnavailable')}</span>
          </div>
        )}
        {state === 'loading' && <div className="tb-micro py-2">{t('tb.syncingOu')}</div>}
        {state !== 'unavailable' && state !== 'loading' && !entry && (
          <div className="text-[11px] text-tx-muted">
            {focusLabel ? t('tb.noOuSets', { name: focusLabel }) : t('tb.focusSlot')}
          </div>
        )}
        {entry && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <SetCard
              set={entry.sets[0]}
              primary
              onApply={() => onApplySet(entry.sets[0])}
              applied={applied}
              applyLabel={mismatched ? t('tb.applyAsTemplate') : undefined}
            />
            {entry.sets.slice(1, 3).map((s) => (
              <SetCard
                key={s.name}
                set={s}
                primary={false}
                onApply={() => onApplySet(s)}
                applied={false}
                applyLabel={mismatched ? t('tb.applyAsTemplate') : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================== DECK ============================== */

interface AnalysisDeckProps {
  versionGroup: string;
  members: MatrixMember[];
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
  versionGroup,
  members,
  defenseRows,
  coverage,
  coverageLoading,
  metaState,
  metaEntry,
  metaFocusLabel,
  onApplySet,
  appliedSetName,
}: AnalysisDeckProps) {
  const { t } = useTranslation();
  const vg = versionGroupById(versionGroup);
  const mech = genHasMechanics(versionGroup);
  const mechChips: Array<{ label: string; on: boolean }> = [
    { label: t('tb.mech.items'), on: mech.items },
    { label: t('tb.mech.abilities'), on: mech.abilities },
    { label: t('tb.mech.natures'), on: mech.natures },
    { label: t('tb.mech.evs'), on: mech.evs },
  ];
  return (
    <div className="mt-4">
      {/* gen-awareness strip: which game this analysis runs against */}
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1">
        <span className="tb-micro-gold flex items-center gap-1.5 !text-[8px]">
          <Gamepad2 size={10} />
          {t('tb.analysisFor', { game: vg.label, gen: vg.gen })}
        </span>
        <span className="flex items-center gap-1">
          {mechChips.map((c) => (
            <span
              key={c.label}
              className={cn('tb-chip !px-1.5 !py-0 !text-[7px]', c.on ? 'text-tx-secondary' : 'border-gold/40 text-gold/80')}
              title={c.on ? undefined : t('tb.mech.naTip')}
            >
              {c.label}
              {!c.on && ' ×'}
            </span>
          ))}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <DefensePanel rows={defenseRows} members={members} vgId={versionGroup} />
        <CoveragePanel coverage={coverage} loading={coverageLoading} vgId={versionGroup} />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
        <MetaPanel
          state={metaState}
          entry={metaEntry}
          focusLabel={metaFocusLabel}
          teamGen={vg.gen}
          onApplySet={onApplySet}
          applied={appliedSetName === metaEntry?.sets[0]?.name}
        />
      </div>
    </div>
  );
}
