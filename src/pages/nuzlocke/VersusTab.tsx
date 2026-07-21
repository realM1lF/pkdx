/* VERSUS tab in the Nuzlocke run deck (versus.md UI 2).
 * Left: own-Pokémon picker (team + box, player filter). Right: opponent —
 * autocomplete OR key-trainer list from enriched kanto.json (gym leaders first).
 * Same matrix components as the detail-page tab, plus BEST ANSWER RANKING:
 * every own mon ranked SAFE / OK / RISKY / AVOID with a one-line reason. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Crown, Shield, Skull, Swords, Users } from 'lucide-react';
import Sprite from '@/components/Sprite';
import PokeballLoader from '@/components/PokeballLoader';
import { useTranslation } from 'react-i18next';
import { getPokemon, padNum } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { Pokemon } from '@/lib/types';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { boxedOf, myPlayerId, partyOf } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import {
  TIER_ORDER,
  damageBetween,
  judgeMatchup,
  legalMoveSlugs,
  speedCheck,
  statsOf,
  trainerIndex,
  wildMoveset,
} from '@/lib/versus';
import type { AnswerTier, AnswerVerdict, EnrichedTrainer, MovesetSource, VersusSide } from '@/lib/versus';
import kantoJson from '@/data/enriched/kanto.json';
import { Panel, SegmentedControl } from '../detail/ui';
import { typeRgb } from '../detail/data';
import {
  DamageMatrix,
  DefensiveProfiles,
  MoveSlots,
  OpponentAutocomplete,
  SpeedCheckBanner,
  StatDelta,
  blankSide,
  computeMatrix,
  resolveDefaultSet,
  sideToVersus,
  useDexIndex,
  useMoveDetails,
  usePokemonById,
} from '../detail/VersusPanel';
import type { SideState } from '../detail/VersusPanel';
import '../detail/versus.css';

const TRAINERS = trainerIndex(kantoJson as unknown as Parameters<typeof trainerIndex>[0]);

/* ---------- own-mon model ---------- */

interface OwnMon {
  enc: NuzEncounterRow;
  playerName: string;
  playerColor: string;
  label: string; // nickname ?? species
}

function ownMonsOf(state: RunState, playerFilter: string, nameOf: (id: number) => string): OwnMon[] {
  const players = playerFilter === 'all' ? state.players : state.players.filter((p) => p.id === playerFilter);
  const out: OwnMon[] = [];
  for (const pl of players) {
    const rows = [...partyOf(state, pl.id), ...boxedOf(state, pl.id)];
    for (const enc of rows) {
      out.push({ enc, playerName: pl.name, playerColor: pl.color, label: enc.nickname ?? nameOf(enc.pokemon_id) });
    }
  }
  return out;
}

/* ---------- foe model ---------- */

interface FoeRef {
  slug: string;
  label: string;
  level: number;
  moves: string[]; // exact trainer moves, [] → wild resolution
  source: MovesetSource;
  context: string; // e.g. "ERIKA · Leader"
}

/* ================================================================== */

export default function VersusTab({ state, nameOf }: { state: RunState; nameOf: (id: number) => string }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const index = useDexIndex();
  const isKanto = state.run.region === 'kanto';
  const idOf = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of index) map.set(e.name, e.id);
    return (slug: string) => map.get(slug) ?? 0;
  }, [index]);

  /* ----- own selection ----- */
  const [playerFilter, setPlayerFilter] = useState<string>(() => myPlayerId(state.run.id) ?? 'all');
  const ownMons = useMemo(() => ownMonsOf(state, playerFilter, nameOf), [state, playerFilter, nameOf]);
  const [selEncId, setSelEncId] = useState<string | null>(null);
  const sel = ownMons.find((m) => m.enc.id === selEncId) ?? ownMons[0] ?? null;

  /* ----- foe selection ----- */
  const [foeMode, setFoeMode] = useState<'trainers' | 'wild'>(isKanto ? 'trainers' : 'wild');
  const [foeRef, setFoeRef] = useState<FoeRef | null>(null);
  const { pokemon: foePokemon, status: foeStatus } = usePokemonById(foeRef?.slug ?? null);

  /* ----- own side state (level defaults to catch level, editable for what-ifs) ----- */
  const [you, setYou] = useState<SideState>(() => blankSide(5));
  const [youCustom, setYouCustom] = useState(false);
  const [youSource, setYouSource] = useState<MovesetSource>('wild');
  const { pokemon: youPokemon, status: youStatus } = usePokemonById(sel?.enc.pokemon_id ?? null);

  /* reset own side when the pick changes (derived-state-during-render) */
  const [prevSel, setPrevSel] = useState(sel?.enc.id);
  if (prevSel !== sel?.enc.id) {
    setPrevSel(sel?.enc.id);
    setYou(blankSide(sel?.enc.level ?? 5));
    setYouCustom(false);
    setYouSource('wild');
  }

  /* ----- foe side state ----- */
  const [foe, setFoe] = useState<SideState>(() => blankSide(5));
  const [foeCustom, setFoeCustom] = useState(false);
  const [foeSource, setFoeSource] = useState<MovesetSource>('wild');

  const [prevFoe, setPrevFoe] = useState(foeRef);
  if (prevFoe !== foeRef) {
    setPrevFoe(foeRef);
    if (foeRef) {
      setFoe({ ...blankSide(foeRef.level), slots: foeRef.moves });
      setFoeCustom(foeRef.moves.length > 0);
      setFoeSource(foeRef.source);
    } else {
      setFoe(blankSide(5));
      setFoeCustom(false);
      setFoeSource('wild');
    }
  }

  /* ----- move details (slots + level-up pools for default resolution) ----- */
  const wanted = useMemo(() => {
    const set = new Set<string>([...you.slots, ...foe.slots].filter(Boolean));
    for (const p of [youPokemon, foePokemon]) {
      if (!p) continue;
      for (const e of p.moves) {
        if (e.version_group_details.some((d) => d.move_learn_method.name === 'level-up')) set.add(e.move.name);
      }
    }
    return [...set];
  }, [youPokemon, foePokemon, you.slots, foe.slots]);
  const details = useMoveDetails(wanted);

  /* wild/assumed default resolution while slots aren't customized */
  useEffect(() => {
    if (youCustom || !youPokemon) return;
    const def = resolveDefaultSet(youPokemon, you.level, details);
    if (def.moves.length) {
      setYou((s) => ({ ...s, slots: def.moves }));
      setYouSource(def.source);
    }
  }, [youPokemon, you.level, details, youCustom]);

  useEffect(() => {
    if (foeCustom || !foePokemon) return;
    const def = resolveDefaultSet(foePokemon, foe.level, details);
    if (def.moves.length) {
      setFoe((s) => ({ ...s, slots: def.moves }));
      setFoeSource(def.source);
    }
  }, [foePokemon, foe.level, details, foeCustom]);

  /* ----- computed matchup ----- */
  const youV = useMemo(() => (youPokemon ? sideToVersus(you, youPokemon.name) : null), [you, youPokemon]);
  const foeV = useMemo(() => (foePokemon ? sideToVersus(foe, foePokemon.name) : null), [foe, foePokemon]);
  const check = useMemo(() => (youV && foeV ? speedCheck(youV, foeV) : null), [youV, foeV]);
  const youRows = useMemo(() => (youV && foeV ? computeMatrix(youV, foeV, you.slots, details) : []), [youV, foeV, you.slots, details]);
  const foeRows = useMemo(() => (youV && foeV ? computeMatrix(foeV, youV, foe.slots, details) : []), [youV, foeV, foe.slots, details]);
  const youStats = useMemo(() => (youV ? statsOf(youV) : null), [youV]);
  const foeStats = useMemo(() => (foeV ? statsOf(foeV) : null), [foeV]);

  const youName = sel ? sel.label : '—';
  // label re-resolves live from the slug so language toggles update it
  const foeName = foeRef
    ? nameOfPokemon(foeRef.slug, lang)
    : foePokemon
      ? nameOfPokemon(foePokemon.id, lang)
      : t('versus.foe');

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ================= LEFT — own picker ================= */}
      <Panel eyebrow="YOUR SIDE" title="Team + Box" className="col-span-12 lg:col-span-3" bodyClassName="flex max-h-[640px] flex-col p-2">
        {/* player filter */}
        <div className="mb-2 flex flex-wrap gap-1">
          <FilterChip active={playerFilter === 'all'} onClick={() => setPlayerFilter('all')}>
            <Users size={9} className="mr-1" /> ALL
          </FilterChip>
          {state.players.map((p) => (
            <FilterChip key={p.id} active={playerFilter === p.id} onClick={() => setPlayerFilter(p.id)}>
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
              {p.name.toUpperCase()}
            </FilterChip>
          ))}
        </div>
        <div className="nz-slim-scroll min-h-0 flex-1 overflow-auto" data-lenis-prevent>
          {ownMons.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center gap-2">
              <img src="/pokeball.svg" alt="" className="h-8 w-8 opacity-50" />
              <p className="px-4 text-center font-sans text-[11px] text-gold">No catches yet — log encounters first.</p>
            </div>
          )}
          {ownMons.map((m) => {
            const active = sel?.enc.id === m.enc.id;
            return (
              <button
                key={m.enc.id}
                type="button"
                onClick={() => setSelEncId(m.enc.id)}
                className={cn(
                  'flex h-[40px] w-full items-center gap-2 rounded-md border-b border-hairline px-1.5 text-left transition-colors duration-150',
                  active ? 'bg-gold/10 shadow-[inset_2px_0_0_#F6C945]' : 'hover:bg-surface2',
                )}
              >
                <Sprite id={m.enc.pokemon_id} name={m.label} className="h-7 w-7 shrink-0" skeleton={false} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans text-[12px] font-semibold text-tx-primary">{m.label}</span>
                  <span className="block truncate font-sans text-[9px] text-tx-muted">{nameOf(m.enc.pokemon_id)}</span>
                </span>
                <span className="pixel-label shrink-0 text-[7px] text-gold">LV{m.enc.level}</span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.playerColor }} title={m.playerName} />
              </button>
            );
          })}
        </div>
      </Panel>

      {/* ================= RIGHT — foe + matchup + ranking ================= */}
      <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-9">
        <Panel
          eyebrow="OPPONENT"
          title={foeRef ? foeRef.context : 'Pick a target'}
          className="min-h-[150px]"
          right={
            isKanto ? (
              <SegmentedControl
                id="foe-mode"
                size="xs"
                ariaLabel="Opponent source"
                value={foeMode}
                onChange={(v) => setFoeMode(v as 'trainers' | 'wild')}
                options={[
                  { value: 'trainers', label: 'TRAINERS' },
                  { value: 'wild', label: 'ANY POKÉMON' },
                ]}
              />
            ) : undefined
          }
        >
          {foeMode === 'wild' || !isKanto ? (
            <div className="p-3">
              <OpponentAutocomplete
                index={index}
                onPick={(id) => {
                  const entry = index.find((e) => e.id === id);
                  setFoeRef({
                    slug: entry?.name ?? String(id),
                    label: entry?.name ?? String(id),
                    level: you.level,
                    moves: [],
                    source: 'wild',
                    context: `${entry?.label ?? 'Pokémon'} · wild`,
                  });
                }}
                placeholder="SEARCH ANY POKÉMON…"
              />
              <p className="mt-2 font-sans text-[10px] text-tx-muted">
                Wild opponents use their 4 most recent level-up moves at the set level.
              </p>
            </div>
          ) : (
            <TrainerPicker
              idOf={idOf}
              onPick={(t, member) => {
                setFoeRef({
                  slug: member.species,
                  label: member.species,
                  level: member.level,
                  moves: member.moves ?? [],
                  source: (member.moves?.length ?? 0) > 0 ? 'trainer' : 'wild',
                  context: `${t.name.toUpperCase()} · ${t.class}`,
                });
              }}
            />
          )}
        </Panel>

        {/* matchup zone */}
        {!sel && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-hairline bg-surface1/60">
            <span className="font-sans text-[12px] text-tx-muted">Pick one of your Pokémon on the left.</span>
          </div>
        )}
        {sel && !foeRef && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-hairline bg-surface1/60">
            <span className="font-sans text-[12px] text-gold">Pick an opponent — a key trainer above, or any Pokémon.</span>
          </div>
        )}

        {sel && foeRef && (
          <>
            {/* head row: compact side headers */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SideHeader
                title="YOU"
                loading={youStatus === 'loading'}
                pokemon={youPokemon}
                fallbackId={sel.enc.pokemon_id}
                name={youName}
                level={you.level}
                onLevel={(lv) => setYou((s) => ({ ...s, level: lv }))}
              />
              <SideHeader
                title="FOE"
                loading={foeStatus === 'loading'}
                pokemon={foePokemon}
                name={foeName}
                level={foe.level}
                onLevel={(lv) => setFoe((s) => ({ ...s, level: lv }))}
              />
            </div>

            <SpeedCheckBanner check={check} youName="YOU" foeName={foeName.toUpperCase()} />

            {(youStatus === 'loading' || foeStatus === 'loading') && (
              <div className="flex h-24 items-center justify-center">
                <PokeballLoader variant="inline" />
              </div>
            )}

            {youPokemon && foePokemon && (
              <>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <Panel eyebrow="YOUR OFFENSE" title={`${youName} → ${foeName}`} bodyClassName="p-1">
                    <DamageMatrix rows={youRows} heading="MOVE" />
                    <div className="border-t border-hairline p-2">
                      <MoveSlots
                        slots={you.slots}
                        pool={legalMoveSlugs(youPokemon)}
                        details={details}
                        onChange={(slots) => {
                          setYouCustom(true);
                          setYouSource('custom');
                          setYou((s) => ({ ...s, slots }));
                        }}
                        onReset={() => setYouCustom(false)}
                        source={youSource}
                      />
                    </div>
                  </Panel>
                  <Panel eyebrow="FOE OFFENSE" title={`${foeName} → ${youName}`} bodyClassName="p-1">
                    <DamageMatrix rows={foeRows} heading="MOVE" />
                    <div className="border-t border-hairline p-2">
                      <MoveSlots
                        slots={foe.slots}
                        pool={legalMoveSlugs(foePokemon)}
                        details={details}
                        onChange={(slots) => {
                          setFoeCustom(true);
                          setFoeSource('custom');
                          setFoe((s) => ({ ...s, slots }));
                        }}
                        onReset={() => setFoeCustom(false)}
                        source={foeSource}
                      />
                    </div>
                  </Panel>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <Panel eyebrow="STAT DELTA" title="Level-Adjusted">
                    <StatDelta you={youStats} foe={foeStats} />
                  </Panel>
                  <Panel eyebrow="DEFENSIVE PROFILES" title="Type Matchups">
                    <DefensiveProfiles
                      youTypes={youPokemon.types.map((t) => t.type.name)}
                      foeTypes={foePokemon.types.map((t) => t.type.name)}
                      youName="YOU"
                      foeName="FOE"
                    />
                  </Panel>
                </div>

                <BestAnswerRanking
                  mons={ownMons}
                  foe={foeV}
                  foeName={foeName}
                  selectedId={sel.enc.id}
                  onSelect={(encId) => setSelEncId(encId)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/* pieces                                                              */
/* ================================================================== */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-[20px] items-center rounded-pill border px-2 font-sans text-[9px] font-bold uppercase transition-colors duration-150',
        active ? 'border-gold/60 bg-gold/10 text-gold' : 'border-hairline text-tx-muted hover:text-tx-secondary',
      )}
    >
      {children}
    </button>
  );
}

/* ---------- compact side header (sprite + level) ---------- */

function SideHeader({
  title,
  loading,
  pokemon,
  fallbackId,
  name,
  level,
  onLevel,
}: {
  title: string;
  loading: boolean;
  pokemon: Pokemon | null;
  fallbackId?: number;
  name: string;
  level: number;
  onLevel: (lv: number) => void;
}) {
  const types = pokemon?.types.map((t) => t.type.name) ?? [];
  const id = pokemon?.id ?? fallbackId ?? 0;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-hairline bg-surface1 p-2.5">
      <div className="relative grid h-[52px] w-[52px] shrink-0 place-items-center">
        {types[0] && (
          <div
            aria-hidden
            className="vs-aura"
            style={{ background: `radial-gradient(circle at 50% 55%, rgba(${typeRgb(types[0])},0.35), transparent 70%)` }}
          />
        )}
        {id > 0 && <Sprite id={id} name={name} className="relative z-10 h-11 w-11" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="pixel-label text-[7px] text-tx-muted">{title}</span>
          <span className="truncate font-display text-[13px] font-bold uppercase text-tx-primary">{name}</span>
          {id > 0 && <span className="pixel-label shrink-0 text-[7px] text-gold">{padNum(id)}</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="pixel-label text-[7px] text-tx-muted">LV</span>
          <input
            type="number"
            min={1}
            max={100}
            value={level}
            onChange={(e) => onLevel(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            className="vs-input w-12 text-center tabular-nums"
            aria-label={`${title} level`}
          />
          {loading && <span className="pixel-label text-[7px] text-tx-muted">SYNC…</span>}
        </div>
      </div>
      <Swords size={12} className="shrink-0 text-gold/50" />
    </div>
  );
}

/* ---------- trainer list (gym leaders first, expandable parties) ---------- */

const GROUPS: Array<{ key: string; label: string; icon: ReactNode; match: (t: EnrichedTrainer) => boolean }> = [
  { key: 'leaders', label: 'GYM LEADERS', icon: <Shield size={9} />, match: (t) => t.class === 'Leader' },
  { key: 'e4', label: 'ELITE FOUR & CHAMPION', icon: <Crown size={9} />, match: (t) => t.class === 'Elite Four' || t.class === 'Champion' },
  { key: 'rival', label: 'RIVAL', icon: <Swords size={9} />, match: (t) => t.class === 'Rival' },
  { key: 'boss', label: 'ROCKET BOSS', icon: <Skull size={9} />, match: (t) => t.class === 'Boss' },
  { key: 'other', label: 'OTHER KEY TRAINERS', icon: <Users size={9} />, match: (t) => !['Leader', 'Elite Four', 'Champion', 'Rival', 'Boss'].includes(t.class) },
];

function TrainerPicker({
  idOf,
  onPick,
}: {
  idOf: (slug: string) => number;
  onPick: (t: EnrichedTrainer, member: { species: string; level: number; moves?: string[] }) => void;
}) {
  const lang = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const important = useMemo(() => TRAINERS.filter((t) => t.important), []);
  return (
    <div className="nz-slim-scroll max-h-[300px] overflow-auto" data-lenis-prevent>
      {GROUPS.map((g) => {
        const rows = important.filter(g.match);
        if (!rows.length) return null;
        return (
          <div key={g.key}>
            <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-1.5 text-gold">
              {g.icon}
              <span className="pixel-label text-[7px]">{g.label}</span>
            </div>
            {rows.map((t, i) => {
              const key = `${t.node}:${t.name}:${i}`;
              const open = openKey === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    className="flex h-[36px] w-full items-center gap-2 border-b border-hairline/60 px-3 text-left transition-colors duration-150 hover:bg-surface2"
                  >
                    <span className="min-w-0 flex-1 truncate font-sans text-[12px] font-semibold text-tx-primary">
                      {t.name}
                      <span className="ml-2 font-sans text-[9px] font-normal uppercase text-tx-muted">
                        {t.node.replace(/^kanto-/, '').replace(/-/g, ' ')}
                      </span>
                    </span>
                    <span className="flex shrink-0 -space-x-1.5">
                      {t.party.slice(0, 6).map((m, j) => (
                        <PartySprite key={j} id={idOf(m.species)} />
                      ))}
                    </span>
                    <ChevronDown size={11} className={cn('shrink-0 text-tx-muted transition-transform duration-150', open && 'rotate-180')} />
                  </button>
                  {open && (
                    <div className="grid grid-cols-2 gap-1 border-b border-hairline bg-abyss/40 p-2 sm:grid-cols-3">
                      {t.party.map((m, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => onPick(t, m)}
                          className="flex h-[30px] items-center gap-1.5 rounded-md border border-hairline px-1.5 transition-colors duration-150 hover:border-gold/50 hover:bg-gold/15"
                        >
                          <PartySprite id={idOf(m.species)} big />
                          <span className="min-w-0 flex-1 truncate text-left font-sans text-[11px] font-semibold text-tx-primary">
                            {nameOfPokemon(m.species, lang)}
                          </span>
                          <span className="pixel-label shrink-0 text-[7px] text-gold">LV{m.level}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PartySprite({ id, big = false }: { id: number; big?: boolean }) {
  if (!id) return <span className={cn('inline-block rounded-full bg-surface3', big ? 'h-6 w-6' : 'h-5 w-5')} />;
  return (
    <Sprite
      id={id}
      name="party member"
      className={cn('shrink-0 rounded-full bg-surface2 ring-1 ring-hairline', big ? 'h-6 w-6' : 'h-5 w-5')}
      skeleton={false}
    />
  );
}

/* ---------- BEST ANSWER RANKING ---------- */

interface RankedRow {
  mon: OwnMon;
  verdict: AnswerVerdict;
}

function BestAnswerRanking({
  mons,
  foe,
  foeName,
  selectedId,
  onSelect,
}: {
  mons: OwnMon[];
  foe: VersusSide | null;
  foeName: string;
  selectedId: string | null;
  onSelect: (encId: string) => void;
}) {
  const [rows, setRows] = useState<RankedRow[]>([]);
  const [pending, setPending] = useState(0);
  const pokeCache = useRef(new Map<number, Pokemon>());

  useEffect(() => {
    if (!foe || !mons.length) {
      setRows([]);
      setPending(0);
      return;
    }
    let cancelled = false;
    setPending(mons.length);
    (async () => {
      /* fetch all own species payloads with limited concurrency */
      const queue = mons.filter((m) => !pokeCache.current.has(m.enc.pokemon_id));
      const BATCH = 6;
      for (let i = 0; i < queue.length; i += BATCH) {
        await Promise.allSettled(
          queue.slice(i, i + BATCH).map((m) =>
            getPokemon(m.enc.pokemon_id).then((p) => {
              pokeCache.current.set(m.enc.pokemon_id, p);
            }),
          ),
        );
        if (cancelled) return;
      }
      const out: RankedRow[] = [];
      for (const m of mons) {
        const p = pokeCache.current.get(m.enc.pokemon_id);
        if (!p) continue;
        /* own best answer ≈ current default set (last-4 level-up moves) */
        const set = wildMoveset(p, m.enc.level);
        const side: VersusSide = { slug: p.name, level: m.enc.level, moves: set };
        const outCells = set.map((s) => damageBetween(side, foe, s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
        const inCells = foe.moves.map((s) => damageBetween(foe, side, s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
        const sc = speedCheck(side, foe);
        const verdict = judgeMatchup(outCells, inCells, sc ? sc.delta > 0 : null);
        out.push({ mon: m, verdict });
      }
      if (cancelled) return;
      out.sort((a, b) => TIER_ORDER[a.verdict.tier] - TIER_ORDER[b.verdict.tier] || b.verdict.score - a.verdict.score);
      setRows(out);
      setPending(0);
    })();
    return () => {
      cancelled = true;
    };
  }, [foe, mons]);

  const tiers = useMemo(() => {
    const counts = new Map<AnswerTier, number>();
    for (const r of rows) counts.set(r.verdict.tier, (counts.get(r.verdict.tier) ?? 0) + 1);
    return (['SAFE', 'OK', 'RISKY', 'AVOID'] as AnswerTier[]).map((t) => ({ tier: t, n: counts.get(t) ?? 0 }));
  }, [rows]);

  return (
    <Panel
      eyebrow="BEST ANSWER RANKING"
      title={`vs ${foeName}`}
      right={
        <div className="flex items-center gap-1.5">
          {tiers.map(({ tier, n }) => (
            <span key={tier} className="vs-rank" data-tier={tier}>
              {tier} {n}
            </span>
          ))}
        </div>
      }
    >
      {pending > 0 && (
        <div className="flex h-20 items-center justify-center gap-2">
          <PokeballLoader variant="inline" />
          <span className="pixel-label text-[8px] text-tx-muted">RANKING {mons.length} MONS…</span>
        </div>
      )}
      {pending === 0 && rows.length === 0 && (
        <div className="flex h-20 items-center justify-center">
          <span className="font-sans text-[11px] text-tx-muted">No ranked answers yet.</span>
        </div>
      )}
      {pending === 0 && rows.length > 0 && (
        <div className="nz-slim-scroll max-h-[320px] overflow-auto" data-lenis-prevent>
          {rows.map((r, i) => (
            <motion.button
              key={r.mon.enc.id}
              type="button"
              data-you={r.mon.enc.id === selectedId}
              onClick={() => onSelect(r.mon.enc.id)}
              className="vs-rankrow w-full text-left"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i, 10) * 0.03 }}
            >
              <span className="vs-rank" data-tier={r.verdict.tier}>
                {r.verdict.tier}
              </span>
              <Sprite id={r.mon.enc.pokemon_id} name={r.mon.label} className="h-7 w-7" skeleton={false} />
              <span className="min-w-0">
                <span className="block truncate font-sans text-[12px] font-semibold text-tx-primary">{r.mon.label}</span>
                <span className="block font-sans text-[9px] text-tx-muted">
                  LV{r.mon.enc.level} · {r.mon.playerName}
                </span>
              </span>
              <span className="truncate font-sans text-[11px] text-tx-secondary" title={r.verdict.reason}>
                {r.verdict.reason}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </Panel>
  );
}
