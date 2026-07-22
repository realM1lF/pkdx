/* AnalysisDeck — the command deck (team-builder.md "Analyse-Deck", reworked):
 * DEFENSIVE MATRIX (span 6): 18 attacking types × team members — instantly
 * readable cells (brightness/saturation of the TYPE color, never red),
 * top-3 weakness callouts with concrete fix hints (which types cover it).
 * OFFENSIVE COVERAGE (span 3): SE strip + gap callouts with SE-via hints.
 * META SNAPSHOT (span 3): Smogon gen9 OU sets — visibly labeled as such.
 * All warnings gold, never red (design.md §2.3). */
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, ChevronDown, CloudOff, Crosshair, Gamepad2, Shield, Sparkles, Wrench } from 'lucide-react';
import Sprite from '@/components/Sprite';
import TypeGlyph from '@/components/TypeGlyph';
import { useTranslation } from 'react-i18next';
import { nameOfItem, nameOfMove, nameOfPokemon, nameOfType, useLanguage } from '@/lib/i18n-data';
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

function effLabel(eff: number): string {
  if (eff === 0) return '0';
  if (eff === 1) return '';
  if (eff >= 4) return '4';
  if (eff >= 2) return '2';
  if (eff <= 0.25) return '¼';
  return '½';
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
        <span className="tb-micro-gold !text-[8px]">
          {t('tb.worstLine', { weak: row.weak, type: nameOfType(row.type, lang).toUpperCase(), resist: row.resist + row.immune })}
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
  const colA = rows.slice(0, 9);
  const colB = rows.slice(9);
  const gridCols = `14px repeat(${Math.max(members.length, 1)}, minmax(0,1fr))`;

  const renderRow = (r: DefenseRow) => (
    <div
      key={r.type}
      className={cn('grid items-center gap-[3px] rounded-[4px] py-px pl-1', r.severity >= 2 && 'bg-gold/5 shadow-[inset_2px_0_0_rgba(246,201,69,0.7)]')}
      style={{ gridTemplateColumns: gridCols }}
    >
      <TypeGlyph type={r.type} size={11} style={{ color: TYPE_COLORS[r.type].base }} />
      {members.map((m) => {
        const eff = effectivenessVsMember(r.type, m, vgId);
        return (
          <span
            key={m.slotId}
            data-eff={effKind(eff)}
            className="tb-cell"
            style={{ '--t': TYPE_COLORS[r.type].rgb } as CSSProperties}
            title={t('tb.cellTip', {
              name: nameOfPokemon(m.slug, lang).toUpperCase(),
              eff,
              type: nameOfType(r.type, lang).toUpperCase(),
            })}
          >
            {effLabel(eff)}
          </span>
        );
      })}
    </div>
  );

  return (
    <section className="tb-panel md:col-span-12 lg:col-span-6" aria-label={t('tb.defenseAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Shield size={11} />
          {t('tb.defenseEyebrow')}
        </span>
        <span className="tb-micro !text-[7px]">{t('tb.defenseNote')}</span>
      </div>
      <div className="p-3">
        {/* top-3 weaknesses with fix hints */}
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

        {/* column headers: the team members */}
        <div className="mb-1 grid gap-x-3 sm:grid-cols-2">
          {[0, 1].map((half) => (
            <div
              key={half}
              className={cn('grid items-center gap-[3px] pl-1', half === 1 && 'max-sm:hidden')}
              style={{ gridTemplateColumns: gridCols }}
            >
              <span />
              {members.map((m) => (
                <span key={m.slotId} className="flex justify-center" title={nameOfPokemon(m.slug, lang)}>
                  <Sprite id={m.pokemonId} name={nameOfPokemon(m.slug, lang)} era="default" className="h-5 w-5" skeleton={false} />
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* 18 attacking types × team members */}
        <div className="grid gap-x-3 sm:grid-cols-2">
          <div className="space-y-px">{colA.map(renderRow)}</div>
          <div className="space-y-px max-sm:mt-px">{colB.map(renderRow)}</div>
        </div>

        {/* legend */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline pt-1.5">
          <span className="tb-micro !text-[7px]">{t('tb.legend.weak')}</span>
          <span className="tb-micro !text-[7px]">{t('tb.legend.resist')}</span>
          <span className="tb-micro !text-[7px]">{t('tb.legend.immune')}</span>
          <span className="tb-micro ml-auto !text-[7px]">{t('tb.legend.ability')}</span>
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
    <section className="tb-panel md:col-span-12 lg:col-span-3" aria-label={t8n('tb.offenseAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5">
          <Crosshair size={11} />
          {t8n('tb.offenseEyebrow')}
        </span>
        <span className="tb-micro !text-[7px] tabular-nums">
          {t8n('tb.seCount', { count: covered.length })} {loading && `· ${t8n('tb.sync')}`}
        </span>
      </div>
      <div className="p-3">
        {/* 18-type coverage strip — glyph + hitter count */}
        <div className="mb-2.5 grid grid-cols-6 gap-1">
          {POKEMON_TYPES.map((t) => {
            const hitters = coverage.se[t];
            const isGap = hitters.length === 0;
            return (
              <div
                key={t}
                className={cn(
                  'flex h-[30px] flex-col items-center justify-center rounded-[6px] border transition-all duration-150',
                  isGap
                    ? 'border-gold/60 bg-gold/10 shadow-[0_0_8px_rgba(246,201,69,0.2)]'
                    : 'border-hairline bg-surface2 hover:border-[rgba(var(--t),0.5)]',
                )}
                style={{ '--t': TYPE_COLORS[t].rgb } as CSSProperties}
                title={
                  isGap
                    ? t8n('tb.noAnswerFor', { type: nameOfType(t, lang).toUpperCase() })
                    : t8n('tb.hitBy', { type: nameOfType(t, lang).toUpperCase(), moves: hitters.map((h) => nameOfMove(h, lang)).join(', ') })
                }
              >
                <TypeGlyph
                  type={t}
                  size={11}
                  style={{ color: isGap ? '#F6C945' : TYPE_COLORS[t].base, opacity: isGap ? 1 : 0.85 }}
                />
                <span className={cn('text-[7px] font-bold tabular-nums', isGap ? 'text-gold' : 'text-tx-muted')}>
                  {isGap ? '!' : hitters.length}
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
                  {t8n('tb.noAnswerFor', { type: nameOfType(g, lang).toUpperCase() })}
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
        {/* STAB summary */}
        <div className="border-t border-hairline pt-2">
          <span className="tb-micro !text-[7px]">{t8n('tb.stabCoverage')}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {coverage.stabTypes.length === 0 ? (
              <span className="tb-micro !text-[8px]">{t8n('tb.addDamaging')}</span>
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
}: {
  set: SmogonSet;
  primary: boolean;
  onApply: () => void;
  applied: boolean;
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
                t('tb.applySet')
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
  return (
    <section className="tb-panel md:col-span-12 lg:col-span-3" aria-label={t('tb.metaAria')}>
      <div className="tb-panel-head">
        <span className="tb-micro-gold flex items-center gap-1.5" title={t('tb.metaGenNote')}>
          <Sparkles size={11} />
          {t('tb.metaEyebrow')}
        </span>
        {entry?.weight != null && (
          <span className="tb-chip !text-[8px] text-gold">{t('tb.usage', { pct: (entry.weight * 100).toFixed(1) })}</span>
        )}
      </div>
      <div className="p-3">
        {/* gen-awareness: the meta data is always gen 9 OU — say so, flag mismatch */}
        {teamGen !== 9 && (
          <div
            className="mb-2 flex items-center gap-1.5 rounded-[8px] border border-gold/50 bg-gold/10 px-2 py-1.5"
            title={t('tb.metaGenNote')}
          >
            <AlertTriangle size={10} className="shrink-0 text-gold" />
            <span className="tb-micro-gold !text-[7px]">{t('tb.metaGenMismatch', { gen: teamGen })}</span>
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
          <div className="tb-micro py-2">{focusLabel ? t('tb.noOuSets', { name: focusLabel.toUpperCase() }) : t('tb.focusSlot')}</div>
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
