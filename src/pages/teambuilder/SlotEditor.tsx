/* SlotEditor — per-slot expander (team-builder.md): 4 version-legal move slots,
 * item · ability · nature (all gen-gated) · compact EV presets + sliders. */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, ChevronDown, CloudOff, Eraser, Info, Sparkles } from 'lucide-react';
import EntityDescModal, { ItemIcon, useEntityModal } from '@/components/EntityDescModal';
import { useDescMap } from '@/lib/desc-data';
import { nameOfAbility, nameOfItem, nameOfMove, nameOfNature, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { Lang } from '@/lib/i18n-data';
import {
  MAX_EV_PER_STAT,
  MAX_EV_TOTAL,
  evTotal,
  genAbilitiesOf,
  genHasMechanics,
  genItems,
  genNatures,
  legalMoves,
  legalityReasonText,
  smogonFormatForVersionGroup,
  smogonFormatLabel,
  versionGroupById,
  zeroEvs,
} from '@/lib/teambuilder';
import type { LegalMoveOption, SlotLegality, SmogonSet, SmogonSpeciesEntry, TeamSlot } from '@/lib/teambuilder';
import { STAT_LABELS, STAT_ORDER } from '@/lib/types';
import type { Pokemon, StatKey } from '@/lib/types';
import { cn } from '@/lib/utils';
import { statsOf } from '@/lib/versus';
import type { VersusContext } from '@/lib/versus';
import MiniAutocomplete from './MiniAutocomplete';

/** 'Aguav Berry' → 'aguav-berry' · "King's Rock" → 'kings-rock'
 * (items/abilities/natures are stored as EN display names; slugs drop apostrophes) */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** picker display: EN shows the stored name untouched, DE resolves via the slug artifact */
function localName(en: string, lang: Lang, lookup: (slug: string, lang: Lang) => string): string {
  return lang === 'de' ? lookup(slugify(en), lang) : en;
}

const METHOD_CHIP: Record<LegalMoveOption['method'], string> = {
  'level-up': 'LV',
  machine: 'TM',
  tutor: 'TUT',
  egg: 'EGG',
  other: '—',
};

interface MoveSlotPickerProps {
  value: string | null;
  options: LegalMoveOption[];
  onChange: (move: string | null) => void;
  disabled?: boolean;
}

function MoveSlotPicker({ value, options, onChange, disabled }: MoveSlotPickerProps) {
  const lang = useLanguage();
  const { t } = useTranslation();
  return (
    <MiniAutocomplete
      items={options}
      filter={(m, q) => m.label.toLowerCase().includes(q) || m.name.includes(q) || nameOfMove(m.name, lang).toLowerCase().includes(q)}
      onSelect={(m) => onChange(m.name)}
      keyOf={(m) => m.name}
      placeholder={t('tb.editor.addMove')}
      displayValue={value ? nameOfMove(value, lang) : undefined}
      onClear={value ? () => onChange(null) : undefined}
      disabled={disabled}
      maxResults={60}
      renderItem={(m) => (
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">{nameOfMove(m.name, lang)}</span>
          <span className="tb-chip shrink-0 !px-1.5 !py-0 !text-[8px]">
            {m.method === 'level-up' ? `LV ${m.level}` : METHOD_CHIP[m.method]}
          </span>
        </span>
      )}
    />
  );
}

/* ---------- EV presets (density-addendum: compact presets) ---------- */

interface EvPreset {
  label: string;
  apply: () => Record<StatKey, number>;
}

function evSpread(parts: Array<[StatKey, number]>): Record<StatKey, number> {
  const out = zeroEvs();
  for (const [k, v] of parts) out[k] = v;
  return out;
}

const EV_PRESETS: EvPreset[] = [
  { label: '252 ATK · 252 SPE', apply: () => evSpread([['attack', 252], ['speed', 252], ['hp', 4]]) },
  { label: '252 SPA · 252 SPE', apply: () => evSpread([['special-attack', 252], ['speed', 252], ['hp', 4]]) },
  { label: '252 HP · 252 ATK', apply: () => evSpread([['hp', 252], ['attack', 252], ['defense', 4]]) },
  { label: '252 HP · 252 DEF', apply: () => evSpread([['hp', 252], ['defense', 252], ['special-defense', 4]]) },
  { label: '252 HP · 252 SPD', apply: () => evSpread([['hp', 252], ['special-defense', 252], ['defense', 4]]) },
];

export type MetaState = 'idle' | 'loading' | 'ready' | 'unavailable';

function SetCard({
  set,
  primary,
  onApply,
  applied,
  applyLabel,
  readOnly,
}: {
  set: SmogonSet;
  primary: boolean;
  onApply: () => void;
  applied: boolean;
  applyLabel?: string;
  readOnly: boolean;
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
                {set.moves.slice(0, 4).map((mv, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="tb-micro w-3 !text-[7px]">{i + 1}</span>
                    <span className="truncate font-semibold text-tx-primary">{mv[0] ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
            {!readOnly && (
              <button type="button" onClick={onApply} className="tb-btn tb-btn-primary mt-2 w-full justify-center !py-1.5 !text-[9px]">
                {applied ? (
                  <>
                    <Check size={10} /> {t('tb.applied')}
                  </>
                ) : (
                  applyLabel ?? t('tb.applySet')
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlotMetaSets({
  species,
  versionGroup,
  state,
  entry,
  format,
  appliedSetName,
  readOnly,
  onApplySet,
}: {
  species: string;
  versionGroup: string;
  state: MetaState;
  entry: SmogonSpeciesEntry | null;
  format: string | null;
  appliedSetName: string | null;
  readOnly: boolean;
  onApplySet: (set: SmogonSet) => void;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const preferred = smogonFormatForVersionGroup(versionGroup);
  const sourceFormat = format ?? preferred;
  const sourceLabel = smogonFormatLabel(sourceFormat);
  const fallback = format != null && format !== preferred;
  const applyLabel = fallback ? t('tb.applyAsTemplate') : undefined;
  return (
    <div aria-label={t('tb.metaAria')}>
      <div className="mb-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span className="tb-micro-gold flex min-w-0 items-center gap-1.5" title={t('team.meta.help', { format: sourceLabel })}>
          <Sparkles size={10} className="shrink-0" />
          {t('team.meta.eyebrow', { format: sourceLabel })}
        </span>
        {appliedSetName && (
          <span className="tb-chip !border-gold/60 !bg-gold/10 !text-[8px] !text-gold">{t('tb.setApplied')}</span>
        )}
        {entry?.weight != null && (
          <span className="tb-chip !text-[8px] text-gold">{t('tb.usage', { pct: (entry.weight * 100).toFixed(1) })}</span>
        )}
      </div>
      {fallback && (
        <p className="mb-1.5 text-[10px] leading-snug text-gold/90">{t('team.meta.fallback', { format: sourceLabel })}</p>
      )}
      {state === 'unavailable' && (
        <div className="flex items-center gap-1.5 text-[10px] text-gold/90">
          <CloudOff size={11} className="shrink-0" />
          {t('team.meta.unavailable')}
        </div>
      )}
      {state === 'loading' && <div className="tb-micro py-1">{t('team.meta.syncing')}</div>}
      {state !== 'unavailable' && state !== 'loading' && !entry && (
        <p className="text-[10px] text-tx-muted">{t('team.meta.noSets', { name: nameOfPokemon(species, lang), format: sourceLabel })}</p>
      )}
      {entry && (
        <div className="grid gap-2">
          <SetCard
            set={entry.sets[0]}
            primary
            onApply={() => onApplySet(entry.sets[0])}
            applied={appliedSetName === entry.sets[0]?.name}
            applyLabel={applyLabel}
            readOnly={readOnly}
          />
          {entry.sets.slice(1, 3).map((s) => (
            <SetCard
              key={s.name}
              set={s}
              primary={false}
              onApply={() => onApplySet(s)}
              applied={appliedSetName === s.name}
              applyLabel={applyLabel}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SlotEditorProps {
  slot: TeamSlot;
  pokemon: Pokemon | undefined;
  versionGroup: string;
  legality: SlotLegality;
  readOnly?: boolean;
  onPatch: (slotId: string, patch: Partial<TeamSlot>) => void;
  metaState: MetaState;
  metaEntry: SmogonSpeciesEntry | null;
  metaFormat: string | null;
  appliedSetName: string | null;
  onApplySet: (set: SmogonSet) => void;
}

export default function SlotEditor({
  slot,
  pokemon,
  versionGroup,
  legality,
  readOnly = false,
  onPatch,
  metaState,
  metaEntry,
  metaFormat,
  appliedSetName,
  onApplySet,
}: SlotEditorProps) {
  const lang = useLanguage();
  const { t } = useTranslation();
  const vg = versionGroupById(versionGroup);
  const mech = genHasMechanics(versionGroup);
  const moveOptions = useMemo(() => (pokemon ? legalMoves(pokemon, versionGroup) : []), [pokemon, versionGroup]);
  const abilityOptions = useMemo(
    () => (mech.abilities ? genAbilitiesOf(versionGroup, slot.pokemon) : []),
    [mech.abilities, versionGroup, slot.pokemon],
  );
  const natureOptions = useMemo(() => (mech.natures ? genNatures(versionGroup) : []), [mech.natures, versionGroup]);
  const itemOptions = useMemo(() => (mech.items ? genItems(versionGroup) : []), [mech.items, versionGroup]);
  /* lazy desc chunk: powers the picker's 1-line item descriptions (null while loading) */
  const itemDescs = useDescMap('item');
  const entityModal = useEntityModal();

  const total = evTotal(slot);
  const versusCtx = useMemo<VersusContext>(
    () => ({ gen: vg.gen, versionGroup, game: null, region: null }),
    [vg.gen, versionGroup],
  );
  /* Final battle stats @ level (max IVs) — so FP=0 isn't mistaken for base stats. */
  const finalStats = useMemo(() => {
    if (!slot.pokemon) return null;
    return statsOf(
      {
        slug: slot.pokemon,
        level: slot.level,
        nature: slot.nature ?? undefined,
        evs: mech.evs ? slot.evs : undefined,
        ability: slot.ability,
        item: slot.item,
      },
      versusCtx,
    );
  }, [slot.pokemon, slot.level, slot.nature, slot.evs, slot.ability, slot.item, mech.evs, versusCtx]);

  const patch = (p: Partial<TeamSlot>) => {
    if (readOnly) return;
    onPatch(slot.id, p);
  };

  const setMove = (i: number, move: string | null) => {
    const moves = [...slot.moves] as TeamSlot['moves'];
    moves[i] = move;
    patch({ moves });
  };

  const setEv = (key: StatKey, raw: number) => {
    const next = Math.max(0, Math.min(MAX_EV_PER_STAT, Math.round(raw / 4) * 4));
    const others = total - (slot.evs[key] || 0);
    const clamped = Math.min(next, Math.max(0, MAX_EV_TOTAL - others));
    patch({ evs: { ...slot.evs, [key]: clamped } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="tb-panel mt-2 grid grid-cols-1 gap-4 p-4 md:grid-cols-12">
          {readOnly && (
            <div className="md:col-span-12">
              <span className="tb-micro-gold">{t('tb.linked.readOnly')}</span>
            </div>
          )}
          {/* ---------- moves (span 6) ---------- */}
          <div className="md:col-span-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="tb-micro-gold">{t('tb.editor.movesLegal', { vg: vg.short })}</span>
              <span className="tb-micro">{slot.moves.filter(Boolean).length}/4</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {slot.moves.map((m, i) => (
                <div key={i} className="relative">
                  <span className="tb-micro absolute -top-1.5 left-2 z-10 bg-surface1 px-1 !text-[7px]">{i + 1}</span>
                  <MoveSlotPicker
                    value={m}
                    options={moveOptions}
                    onChange={(mv) => setMove(i, mv)}
                    disabled={!pokemon || readOnly}
                  />
                </div>
              ))}
            </div>
            {!pokemon && <p className="tb-micro mt-2">{t('tb.editor.loadingPool')}</p>}
            {pokemon && moveOptions.length === 0 && (
              <p className="tb-micro-gold mt-2">{t('tb.editor.noMoves')}</p>
            )}
            {!legality.legal && (
              <div className="mt-3 rounded-[8px] border border-gold/50 bg-gold/10 p-2">
                <div className="tb-micro-gold tb-illegal-flag mb-1 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  {t('tb.slot.illegalIn', { vg: vg.label })}
                </div>
                <ul className="space-y-0.5">
                  {legality.reasons.map((r) => {
                    const text = legalityReasonText(r, lang);
                    return (
                      <li key={text} className="text-[10px] font-semibold uppercase tracking-wide text-gold/90">
                        · {text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {slot.pokemon && (
              <div className="mt-4 border-t border-hairline pt-3">
                <SlotMetaSets
                  species={slot.pokemon}
                  versionGroup={versionGroup}
                  state={metaState}
                  entry={metaEntry}
                  format={metaFormat}
                  appliedSetName={appliedSetName}
                  readOnly={readOnly}
                  onApplySet={onApplySet}
                />
              </div>
            )}
          </div>

          {/* ---------- item / ability / nature / nickname / level (span 3) ---------- */}
          <div className="space-y-3 md:col-span-3">
            <div>
              <span className="tb-micro">{t('tb.editor.nickname')}</span>
              <input
                value={slot.nickname ?? ''}
                onChange={(e) => patch({ nickname: e.target.value || null })}
                placeholder={slot.pokemon ? nameOfPokemon(slot.pokemon, lang) : ''}
                maxLength={18}
                disabled={readOnly}
                className="tb-input mt-1 !py-1.5 !text-[12px] disabled:opacity-50"
              />
            </div>
            <div>
              <span className="tb-micro">{t('tb.editor.level')}</span>
              <input
                type="number"
                min={1}
                max={100}
                value={slot.level}
                disabled={readOnly}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) patch({ level: Math.max(1, Math.min(100, Math.round(n))) });
                }}
                className="tb-input mt-1 !py-1.5 !text-[12px] tabular-nums disabled:opacity-50"
              />
            </div>
            <div>
              <span className="tb-micro flex items-center gap-1">
                {t('tb.editor.item')} {mech.items ? t('tb.editor.genLabel', { gen: vg.gen }) : t('tb.editor.naThisGen')}
                {mech.items && slot.item && (
                  <button
                    type="button"
                    onClick={() => entityModal.open('item', slot.item!)}
                    aria-label={t('desc.openDesc', { name: localName(slot.item, lang, nameOfItem) })}
                    title={t('desc.openDesc', { name: localName(slot.item, lang, nameOfItem) })}
                    className="rounded-sm p-0.5 text-tx-muted transition-colors hover:text-gold"
                  >
                    <Info size={10} />
                  </button>
                )}
              </span>
              {mech.items ? (
                <MiniAutocomplete
                  items={itemOptions}
                  filter={(it, q) => it.toLowerCase().includes(q) || localName(it, lang, nameOfItem).toLowerCase().includes(q)}
                  onSelect={(it) => patch({ item: it })}
                  keyOf={(it) => it}
                  placeholder={t('tb.editor.addItem')}
                  displayValue={slot.item ? localName(slot.item, lang, nameOfItem) : undefined}
                  onClear={slot.item && !readOnly ? () => patch({ item: null }) : undefined}
                  disabled={readOnly}
                  maxResults={40}
                  renderItem={(it) => {
                    const slug = slugify(it);
                    const d = itemDescs?.[slug];
                    const line = d ? (lang === 'de' ? (d.fde ?? d.fen) : (d.fen ?? d.fde)) : null;
                    return (
                      <span className="flex min-w-0 items-center gap-2">
                        <ItemIcon slug={slug} name={it} size={20} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{localName(it, lang, nameOfItem)}</span>
                          {line && <span className="block truncate text-[10px] font-normal text-tx-muted">{line}</span>}
                        </span>
                      </span>
                    );
                  }}
                />
              ) : (
                <p className="tb-micro mt-1.5">{t('tb.editor.noItems')}</p>
              )}
            </div>
            <div>
              <span className="tb-micro flex items-center gap-1">
                {t('tb.editor.ability')} {mech.abilities ? '' : t('tb.editor.naThisGen')}
                {mech.abilities && slot.ability && (
                  <button
                    type="button"
                    onClick={() => entityModal.open('ability', slot.ability!)}
                    aria-label={t('desc.openDesc', { name: localName(slot.ability, lang, nameOfAbility) })}
                    title={t('desc.openDesc', { name: localName(slot.ability, lang, nameOfAbility) })}
                    className="rounded-sm p-0.5 text-tx-muted transition-colors hover:text-gold"
                  >
                    <Info size={10} />
                  </button>
                )}
              </span>
              {mech.abilities ? (
                <MiniAutocomplete
                  items={abilityOptions}
                  filter={(a, q) => a.toLowerCase().includes(q) || localName(a, lang, nameOfAbility).toLowerCase().includes(q)}
                  onSelect={(a) => patch({ ability: a })}
                  keyOf={(a) => a}
                  placeholder={t('tb.editor.selectAbility')}
                  displayValue={slot.ability ? localName(slot.ability, lang, nameOfAbility) : undefined}
                  onClear={slot.ability && !readOnly ? () => patch({ ability: null }) : undefined}
                  disabled={readOnly}
                  maxResults={4}
                  renderItem={(a) => <span>{localName(a, lang, nameOfAbility)}</span>}
                />
              ) : (
                <p className="tb-micro mt-1.5">{t('tb.editor.noAbilities')}</p>
              )}
            </div>
            <div>
              <span className="tb-micro">
                {t('tb.editor.nature')} {mech.natures ? '' : t('tb.editor.naThisGen')}
              </span>
              {mech.natures ? (
                <MiniAutocomplete
                  items={natureOptions}
                  filter={(n, q) => n.name.toLowerCase().includes(q) || localName(n.name, lang, nameOfNature).toLowerCase().includes(q)}
                  onSelect={(n) => patch({ nature: n.name })}
                  keyOf={(n) => n.name}
                  placeholder={t('tb.editor.selectNature')}
                  displayValue={slot.nature ? localName(slot.nature, lang, nameOfNature) : undefined}
                  onClear={slot.nature && !readOnly ? () => patch({ nature: null }) : undefined}
                  disabled={readOnly}
                  maxResults={30}
                  renderItem={(n) => (
                    <span className="flex w-full items-center justify-between gap-2">
                      <span>{localName(n.name, lang, nameOfNature)}</span>
                      {n.plus && n.minus ? (
                        <span className="tb-chip shrink-0 !px-1.5 !py-0 !text-[8px]">
                          +{STAT_LABELS[statKeyOf(n.plus)]} −{STAT_LABELS[statKeyOf(n.minus)]}
                        </span>
                      ) : (
                        <span className="tb-micro !text-[8px]">{t('tb.editor.neutral')}</span>
                      )}
                    </span>
                  )}
                />
              ) : (
                <p className="tb-micro mt-1.5">{t('tb.editor.noNatures')}</p>
              )}
            </div>
          </div>

          {/* ---------- EVs + battle stats @ level (span 3) ---------- */}
          <div className="md:col-span-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="tb-micro-gold">{t('tb.editor.evs')}</span>
                <span
                  className="inline-flex text-tx-muted transition-colors hover:text-gold"
                  title={t('tb.editor.evsTip')}
                  aria-label={t('tb.editor.evsTip')}
                >
                  <Info size={10} />
                </span>
              </span>
              {mech.evs ? (
                <span className={cn('tb-micro tabular-nums', total > MAX_EV_TOTAL - 4 && 'text-gold')}>
                  {t('tb.editor.evsTotal', { used: total, max: MAX_EV_TOTAL })}
                </span>
              ) : (
                <span className="tb-micro">{t('tb.editor.noEvs')}</span>
              )}
            </div>
            <p className="mb-2 text-[10px] leading-snug text-tx-muted">{t('tb.editor.statsAtLevel', { level: slot.level })}</p>
            {mech.evs ? (
              <>
                <div className="tb-ev-row mb-1 !gap-2 opacity-70">
                  <span />
                  <span />
                  <span className="tb-micro !text-[7px] text-right">{t('tb.editor.evCol')}</span>
                  <span className="tb-micro !text-[7px] text-right text-gold">{t('tb.editor.statCol')}</span>
                </div>
                <div className="space-y-1.5">
                  {STAT_ORDER.map((k) => (
                    <label key={k} className="tb-ev-row">
                      <span className="tb-micro !text-[8px]">{STAT_LABELS[k]}</span>
                      <input
                        type="range"
                        min={0}
                        max={MAX_EV_PER_STAT}
                        step={4}
                        value={slot.evs[k] || 0}
                        disabled={readOnly}
                        onChange={(e) => setEv(k, Number(e.target.value))}
                        aria-label={t('tb.editor.evAria', { stat: STAT_LABELS[k] })}
                      />
                      <span className="text-right font-display text-[11px] font-bold tabular-nums text-tx-muted">
                        {slot.evs[k] || 0}
                      </span>
                      <span className="text-right font-display text-[12px] font-bold tabular-nums text-tx-primary">
                        {finalStats?.[k] ?? '—'}
                      </span>
                    </label>
                  ))}
                </div>
                {!readOnly && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {EV_PRESETS.map((p) => (
                      <button key={p.label} type="button" onClick={() => patch({ evs: p.apply() })} className="tb-chip transition-all hover:border-gold/60 hover:text-gold">
                        {p.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => patch({ evs: zeroEvs() })}
                      className="tb-chip transition-all hover:border-gold/60 hover:text-gold"
                      aria-label={t('tb.editor.resetEvs')}
                    >
                      <Eraser size={9} />
                      {t('tb.editor.reset')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                {STAT_ORDER.map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-2 border-b border-hairline pb-1">
                    <span className="tb-micro !text-[8px]">{STAT_LABELS[k]}</span>
                    <span className="font-display text-[12px] font-bold tabular-nums text-tx-primary">
                      {finalStats?.[k] ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      <EntityDescModal {...entityModal.props} />
    </motion.div>
  );
}

/** @pkmn StatID ('atk','spe',…) → our StatKey */
function statKeyOf(id: string): StatKey {
  switch (id) {
    case 'atk':
      return 'attack';
    case 'def':
      return 'defense';
    case 'spa':
      return 'special-attack';
    case 'spd':
      return 'special-defense';
    case 'spe':
      return 'speed';
    default:
      return 'hp';
  }
}
