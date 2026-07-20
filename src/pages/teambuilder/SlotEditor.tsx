/* SlotEditor — per-slot expander (team-builder.md): 4 version-legal move slots,
 * item · ability · nature (all gen-gated) · compact EV presets + sliders. */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Eraser } from 'lucide-react';
import { displayName } from '@/lib/pokeapi';
import {
  MAX_EV_PER_STAT,
  MAX_EV_TOTAL,
  evTotal,
  genAbilitiesOf,
  genHasMechanics,
  genItems,
  genNatures,
  legalMoves,
  versionGroupById,
  zeroEvs,
} from '@/lib/teambuilder';
import type { LegalMoveOption, SlotLegality, TeamSlot } from '@/lib/teambuilder';
import { STAT_LABELS, STAT_ORDER } from '@/lib/types';
import type { Pokemon, StatKey } from '@/lib/types';
import { cn } from '@/lib/utils';
import MiniAutocomplete from './MiniAutocomplete';

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
  return (
    <MiniAutocomplete
      items={options}
      filter={(m, q) => m.label.toLowerCase().includes(q) || m.name.includes(q)}
      onSelect={(m) => onChange(m.name)}
      keyOf={(m) => m.name}
      placeholder="ADD MOVE…"
      displayValue={value ? displayName(value) : undefined}
      onClear={value ? () => onChange(null) : undefined}
      disabled={disabled}
      maxResults={60}
      renderItem={(m) => (
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">{m.label}</span>
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

interface SlotEditorProps {
  slot: TeamSlot;
  pokemon: Pokemon | undefined;
  versionGroup: string;
  legality: SlotLegality;
  onPatch: (slotId: string, patch: Partial<TeamSlot>) => void;
}

export default function SlotEditor({ slot, pokemon, versionGroup, legality, onPatch }: SlotEditorProps) {
  const vg = versionGroupById(versionGroup);
  const mech = genHasMechanics(versionGroup);
  const moveOptions = useMemo(() => (pokemon ? legalMoves(pokemon, versionGroup) : []), [pokemon, versionGroup]);
  const abilityOptions = useMemo(
    () => (mech.abilities ? genAbilitiesOf(versionGroup, slot.pokemon) : []),
    [mech.abilities, versionGroup, slot.pokemon],
  );
  const natureOptions = useMemo(() => (mech.natures ? genNatures(versionGroup) : []), [mech.natures, versionGroup]);
  const itemOptions = useMemo(() => (mech.items ? genItems(versionGroup) : []), [mech.items, versionGroup]);

  const total = evTotal(slot);
  const patch = (p: Partial<TeamSlot>) => onPatch(slot.id, p);

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
          {/* ---------- moves (span 6) ---------- */}
          <div className="md:col-span-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="tb-micro-gold">MOVES · {vg.short} LEGAL</span>
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
                    disabled={!pokemon}
                  />
                </div>
              ))}
            </div>
            {!pokemon && <p className="tb-micro mt-2">LOADING MOVE POOL…</p>}
            {pokemon && moveOptions.length === 0 && (
              <p className="tb-micro-gold mt-2">NO MOVES IN THIS VERSION GROUP</p>
            )}
            {!legality.legal && (
              <div className="mt-3 rounded-[8px] border border-gold/50 bg-gold/10 p-2">
                <div className="tb-micro-gold tb-illegal-flag mb-1 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  ILLEGAL IN {vg.label}
                </div>
                <ul className="space-y-0.5">
                  {legality.reasons.map((r) => (
                    <li key={r} className="text-[10px] font-semibold uppercase tracking-wide text-gold/90">
                      · {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ---------- item / ability / nature / nickname / level (span 3) ---------- */}
          <div className="space-y-3 md:col-span-3">
            <div>
              <span className="tb-micro">NICKNAME</span>
              <input
                value={slot.nickname ?? ''}
                onChange={(e) => patch({ nickname: e.target.value || null })}
                placeholder={slot.pokemon ? displayName(slot.pokemon) : ''}
                maxLength={18}
                className="tb-input mt-1 !py-1.5 !text-[12px]"
              />
            </div>
            <div>
              <span className="tb-micro">LEVEL</span>
              <input
                type="number"
                min={1}
                max={100}
                value={slot.level}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) patch({ level: Math.max(1, Math.min(100, Math.round(n))) });
                }}
                className="tb-input mt-1 !py-1.5 !text-[12px] tabular-nums"
              />
            </div>
            <div>
              <span className="tb-micro">ITEM {mech.items ? `· GEN ${vg.gen}` : '· N/A THIS GEN'}</span>
              {mech.items ? (
                <MiniAutocomplete
                  items={itemOptions}
                  filter={(it, q) => it.toLowerCase().includes(q)}
                  onSelect={(it) => patch({ item: it })}
                  keyOf={(it) => it}
                  placeholder="ADD ITEM…"
                  displayValue={slot.item ?? undefined}
                  onClear={slot.item ? () => patch({ item: null }) : undefined}
                  maxResults={40}
                  renderItem={(it) => <span className="truncate">{it}</span>}
                />
              ) : (
                <p className="tb-micro mt-1.5">NO HELD ITEMS BEFORE GEN II</p>
              )}
            </div>
            <div>
              <span className="tb-micro">ABILITY {mech.abilities ? '' : '· N/A THIS GEN'}</span>
              {mech.abilities ? (
                <MiniAutocomplete
                  items={abilityOptions}
                  filter={(a, q) => a.toLowerCase().includes(q)}
                  onSelect={(a) => patch({ ability: a })}
                  keyOf={(a) => a}
                  placeholder="SELECT ABILITY…"
                  displayValue={slot.ability ?? undefined}
                  onClear={slot.ability ? () => patch({ ability: null }) : undefined}
                  maxResults={4}
                  renderItem={(a) => <span>{a}</span>}
                />
              ) : (
                <p className="tb-micro mt-1.5">NO ABILITIES BEFORE GEN III</p>
              )}
            </div>
            <div>
              <span className="tb-micro">NATURE {mech.natures ? '' : '· N/A THIS GEN'}</span>
              {mech.natures ? (
                <MiniAutocomplete
                  items={natureOptions}
                  filter={(n, q) => n.name.toLowerCase().includes(q)}
                  onSelect={(n) => patch({ nature: n.name })}
                  keyOf={(n) => n.name}
                  placeholder="SELECT NATURE…"
                  displayValue={slot.nature ?? undefined}
                  onClear={slot.nature ? () => patch({ nature: null }) : undefined}
                  maxResults={30}
                  renderItem={(n) => (
                    <span className="flex w-full items-center justify-between gap-2">
                      <span>{n.name}</span>
                      {n.plus && n.minus ? (
                        <span className="tb-chip shrink-0 !px-1.5 !py-0 !text-[8px]">
                          +{STAT_LABELS[statKeyOf(n.plus)]} −{STAT_LABELS[statKeyOf(n.minus)]}
                        </span>
                      ) : (
                        <span className="tb-micro !text-[8px]">NEUTRAL</span>
                      )}
                    </span>
                  )}
                />
              ) : (
                <p className="tb-micro mt-1.5">NO NATURES BEFORE GEN III</p>
              )}
            </div>
          </div>

          {/* ---------- EVs (span 3) ---------- */}
          <div className="md:col-span-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="tb-micro-gold">EVs</span>
              <span className={cn('tb-micro tabular-nums', total > MAX_EV_TOTAL - 4 && 'text-gold')}>
                {total}/{MAX_EV_TOTAL}
              </span>
            </div>
            {mech.evs ? (
              <>
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
                        onChange={(e) => setEv(k, Number(e.target.value))}
                        aria-label={`${STAT_LABELS[k]} EVs`}
                      />
                      <span className="text-right font-display text-[11px] font-bold tabular-nums text-tx-secondary">
                        {slot.evs[k] || 0}
                      </span>
                    </label>
                  ))}
                </div>
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
                    aria-label="Reset EVs"
                  >
                    <Eraser size={9} />
                    RESET
                  </button>
                </div>
              </>
            ) : (
              <p className="tb-micro">NO EVs BEFORE GEN III (STAT EXP)</p>
            )}
          </div>
        </div>
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
