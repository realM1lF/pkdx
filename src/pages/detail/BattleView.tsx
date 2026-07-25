/* BattleView — lazy 1:1 micro-battle arena for the Versus tab.
 * Loaded via React.lazy so @pkmn/sim never enters the main bundle.
 * The view is dumb: all battle logic lives in src/lib/battle/engine.ts,
 * this file only renders BattleSnapshot + BattleEvent and forwards clicks. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Play, RotateCcw, Shuffle, Skull, X, Zap } from 'lucide-react';
import Sprite from '@/components/Sprite';
import PokeballLoader from '@/components/PokeballLoader';
import { MicroBattle } from '@/lib/battle/engine';
import type { AiMode, BattleEvent, BattleSideSetup, BattleSnapshot } from '@/lib/battle/types';
import { nameOfItem, nameOfMove, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { spriteEraForVersus } from '@/lib/sprites';
import { cn } from '@/lib/utils';
import type { VersusContext, VersusField } from '@/lib/versus-context';
import { gameDisplayName } from '@/lib/versus-context';
import { Panel, SegmentedControl } from './ui';

const toID = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

export interface BattleSideInput {
  /** national dex id (sprite) */
  pokemonId: number;
  /** already localized display name from the versus side card */
  displayName: string;
  setup: BattleSideSetup;
}

interface BattleViewProps {
  player: BattleSideInput;
  foe: BattleSideInput;
  ctx: VersusContext;
  /** already sanitized for the version group by the caller */
  field: VersusField;
  onExit: () => void;
}

/* ---------- localization helpers ---------- */

type TFn = (key: string, opts?: Record<string, unknown>) => string;

const SIM_WEATHER_KEY: Record<string, string> = {
  sunnyday: 'sun',
  raindance: 'rain',
  sandstorm: 'sand',
  hail: 'hail',
  snow: 'snow',
};

const SIM_TERRAIN_KEY: Record<string, string> = {
  electricterrain: 'electric',
  grassyterrain: 'grassy',
  mistyterrain: 'misty',
  psychicterrain: 'psychic',
};

/** sim move/item id → original PokéAPI slug (only the configured sets are mappable) */
function useEntityMaps(player: BattleSideInput, foe: BattleSideInput) {
  return useMemo(() => {
    const moveSlug = new Map<string, string>();
    for (const slug of [...player.setup.moves, ...foe.setup.moves]) moveSlug.set(toID(slug), slug);
    const itemSlug = new Map<string, string>();
    for (const item of [player.setup.item, foe.setup.item]) {
      if (item) itemSlug.set(toID(item), item);
    }
    return { moveSlug, itemSlug };
  }, [player, foe]);
}

/* ---------- HP bar ---------- */

function HpBar({ hp, max }: { hp: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (hp / max) * 100)) : 0;
  return (
    <div className="h-1.5 overflow-hidden rounded-pill border border-hairline bg-abyss">
      <div
        className={cn(
          'h-full rounded-pill transition-[width] duration-500 ease-out',
          pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-gold' : 'bg-red-500',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- one log line ---------- */

function LogLine({
  e,
  t,
  names,
  moveName,
  itemName,
  effectName,
  gameLabel,
}: {
  e: BattleEvent;
  t: TFn;
  names: Record<'player' | 'ai', string>;
  moveName: (e: BattleEvent) => string;
  itemName: (e: BattleEvent) => string;
  effectName: (e: BattleEvent) => string;
  gameLabel: string;
}) {
  const name = e.side ? names[e.side] : (e.name ?? '');
  const key = `versus.battle.log`;
  let text: string;
  switch (e.kind) {
    case 'turn':
      return (
        <p className="pixel-label mt-2 text-[8px] text-gold/80 first:mt-0">
          {t(`${key}.turn`, { n: e.turn })}
        </p>
      );
    case 'switch':
      text = t(`${key}.switch`, { name });
      break;
    case 'move':
      text = t(`${key}.move`, { name, move: moveName(e) });
      break;
    case 'supereffective':
      text = t(`${key}.supereffective`);
      break;
    case 'resisted':
      text = t(`${key}.resisted`);
      break;
    case 'immune':
      text = t(`${key}.immune`, { name });
      break;
    case 'crit':
      text = t(`${key}.crit`);
      break;
    case 'miss':
      text = t(`${key}.miss`, { name });
      break;
    case 'ohko':
      text = t(`${key}.ohko`);
      break;
    case 'status':
      text = t(`${key}.status`, { name, status: t(`versus.battle.status.${e.status}`) });
      break;
    case 'curestatus':
      text = t(`${key}.curestatus`, { name, status: t(`versus.battle.status.${e.status}`) });
      break;
    case 'boost':
      text = t(e.amount && e.amount > 1 ? `${key}.boostSharp` : `${key}.boost`, {
        name,
        stat: t(`versus.battle.stat.${e.stat}`, { defaultValue: e.stat }),
      });
      break;
    case 'unboost':
      text = t(e.amount && e.amount > 1 ? `${key}.unboostSharp` : `${key}.unboost`, {
        name,
        stat: t(`versus.battle.stat.${e.stat}`, { defaultValue: e.stat }),
      });
      break;
    case 'faint':
      text = t(`${key}.faint`, { name });
      break;
    case 'weather': {
      const w = e.weather ?? '';
      if (w === 'none' || w === '') text = t(`${key}.weatherEnd`);
      else text = t(`${key}.weather.${SIM_WEATHER_KEY[w] ?? w}`, { defaultValue: e.weather });
      break;
    }
    case 'terrain': {
      const tr = e.terrain ?? '';
      if (tr === 'none' || tr === '') text = t(`${key}.terrainEnd`);
      else text = t(`${key}.terrain.${SIM_TERRAIN_KEY[tr] ?? tr}`, { defaultValue: e.terrain });
      break;
    }
    case 'sideStart':
    case 'sideEnd': {
      // structured side condition — per-effect i18n, generic localized fallback
      const group = e.kind === 'sideStart' ? 'sideStart' : 'sideEnd';
      const team = e.side ? t(`versus.battle.team.${e.side}`) : t('versus.battle.team.generic');
      const effect = effectName(e);
      text = t(`versus.battle.${group}.${e.effectId}`, {
        team,
        defaultValue: t(`versus.battle.${group}.generic`, { team, effect }),
      });
      break;
    }
    case 'healItem':
      text = t(`${key}.healItem`, { name, item: itemName(e) });
      break;
    case 'heal':
      text = t(`${key}.heal`, { name });
      break;
    case 'damageFrom':
      text = t(`${key}.damageFrom`, {
        name,
        source:
          e.from === 'item'
            ? itemName(e)
            : t(`versus.battle.from.${e.from}`, { defaultValue: e.from ?? '' }),
      });
      break;
    case 'activate':
      text = e.itemName
        ? t(e.text === 'consumed' ? `${key}.itemConsumed` : `${key}.activateItem`, { name, item: itemName(e) })
        : t(`${key}.activate`, { name, effect: effectName(e) });
      break;
    case 'cant':
      text = t(`${key}.cant.${e.from}`, { name, defaultValue: t(`${key}.cant.generic`, { name }) });
      break;
    case 'fail':
      text = t(`${key}.fail`);
      break;
    case 'info':
      if (e.text === 'start') text = t(`${key}.start`, { format: e.from ?? '' });
      else if (e.text === 'fieldIgnoredWeather')
        text = t(`${key}.fieldIgnored`, {
          what: t(`versus.weather.${e.from}`, { defaultValue: e.from }),
          game: gameLabel,
        });
      else if (e.text === 'fieldIgnoredTerrain')
        text = t(`${key}.fieldIgnored`, {
          what: t(`versus.terrain.${e.from}`, { defaultValue: e.from }),
          game: gameLabel,
        });
      else text = e.text ?? '';
      break;
    case 'win':
      text = e.winner === 'tie' ? t(`${key}.tie`) : t(`${key}.win`, { name: e.winner ? names[e.winner] : '' });
      break;
    case 'raw':
    default:
      // unmapped engine line — generic muted fallback, engine text unchanged
      return <p className="text-[10px] italic text-tx-muted">{e.text || e.raw}</p>;
  }
  return <p className="leading-snug text-tx-secondary">{text}</p>;
}

/* ---------- the arena ---------- */

export default function BattleView({ player, foe, ctx, field, onExit }: BattleViewProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [phase, setPhase] = useState<'setup' | 'battle'>('setup');
  const [aiMode, setAiMode] = useState<AiMode>('random');
  const [starting, setStarting] = useState(false);
  const [snap, setSnap] = useState<BattleSnapshot | null>(null);
  const [events, setEvents] = useState<BattleEvent[]>([]);
  const battleRef = useRef<MicroBattle | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const maps = useEntityMaps(player, foe);

  const gameLabel = ctx.game ? t(`versus.games.${ctx.game}`, { defaultValue: gameDisplayName(ctx.game) }) : t('versus.gameDefault');

  const names = useMemo(
    () => ({
      player: snap ? nameOfPokemon(snap.player.speciesNum, lang) : player.displayName,
      ai: snap ? nameOfPokemon(snap.ai.speciesNum, lang) : foe.displayName,
    }),
    [snap, lang, player.displayName, foe.displayName],
  );

  const moveName = (e: BattleEvent) => {
    const slug = e.moveId ? maps.moveSlug.get(e.moveId) : undefined;
    return slug ? nameOfMove(slug, lang) : (e.moveName ?? '');
  };
  const itemName = (e: BattleEvent) => {
    const slug = e.itemId ? maps.itemSlug.get(e.itemId) : undefined;
    return slug ? nameOfItem(slug, lang) : (e.itemName ?? '');
  };
  const effectName = (e: BattleEvent) => {
    // side conditions / non-item activations are usually moves from the
    // configured sets — localize via the move map, else keep the clean label
    const slug = e.effectId ? maps.moveSlug.get(e.effectId) : undefined;
    return slug ? nameOfMove(slug, lang) : (e.effectName ?? e.text ?? '');
  };
  const optionName = (id: string, fallback: string) => {
    const slug = maps.moveSlug.get(id);
    return slug ? nameOfMove(slug, lang) : fallback;
  };

  /* keep the log pinned to the newest line */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events.length]);

  const start = async () => {
    if (starting) return;
    setStarting(true);
    setEvents([]);
    setSnap(null);
    try {
      const mb = await MicroBattle.create(
        {
          gen: ctx.gen,
          player: player.setup,
          ai: foe.setup,
          weather: field.weather ?? 'none',
          terrain: field.terrain ?? 'none',
          gameLabel,
        },
        { aiMode, onEvent: (e) => setEvents((prev) => [...prev, e]) },
      );
      battleRef.current = mb;
      setSnap(mb.snapshot());
      setPhase('battle');
    } finally {
      setStarting(false);
    }
  };

  const choose = (index: number) => {
    const mb = battleRef.current;
    if (!mb) return;
    setSnap(mb.playerMove(index));
  };

  const rematch = () => {
    battleRef.current = null;
    void start();
  };

  const result = snap?.winner ?? null;

  /* mobile: the battle phase renders below the fold — scroll it into view */
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase !== 'battle') return;
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [phase]);

  return (
    <div ref={rootRef} className="scroll-mt-24">
    <Panel
      eyebrow={t('versus.battle.eyebrow')}
      title={t('versus.battle.title')}
      right={
        <button
          type="button"
          onClick={onExit}
          aria-label={t('versus.battle.close')}
          className="inline-flex h-6 w-6 items-center justify-center rounded-pill border border-hairline text-tx-muted transition-colors hover:border-hairline2 hover:text-tx-secondary"
        >
          <X size={11} />
        </button>
      }
    >
      {phase === 'setup' ? (
        <div className="flex flex-col items-center gap-3 px-4 py-6">
          <SegmentedControl
            id="battle-ai-mode"
            size="sm"
            ariaLabel={t('versus.battle.modeLabel')}
            value={aiMode}
            onChange={(v) => setAiMode(v as AiMode)}
            options={[
                { value: 'random', label: (
                  <>
                    <Shuffle size={10} /> {t('versus.battle.modeRandom')}
                  </>
                ) },
                { value: 'greedy', label: (
                  <>
                    <Skull size={10} /> {t('versus.battle.modeGreedy')}
                  </>
                ) },
            ]}
          />
          <p className="max-w-md text-center font-sans text-[11px] leading-relaxed text-tx-muted">
            {t(aiMode === 'random' ? 'versus.battle.modeRandomHint' : 'versus.battle.modeGreedyHint')}
          </p>
          <p className="rounded-pill border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase text-gold">
            {t('versus.battle.formatNote', { gen: ctx.gen, game: gameLabel })}
          </p>
          <button
            type="button"
            onClick={() => void start()}
            disabled={starting}
            className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-gold bg-gold px-4 font-display text-[11px] font-extrabold uppercase tracking-wider text-abyss transition-all hover:shadow-[0_0_18px_rgba(246,201,69,0.45)] disabled:cursor-wait disabled:opacity-60"
          >
            {starting ? <PokeballLoader variant="inline" className="h-4 w-4" /> : <Play size={11} />}
            {t('versus.battle.start')}
          </button>
        </div>
      ) : !snap ? (
        <div className="flex items-center justify-center p-8">
          <PokeballLoader variant="inline" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-3">
          {/* ---------- arena: player left, foe right ---------- */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: 'player' as const, input: player, side: snap.player },
                { key: 'ai' as const, input: foe, side: snap.ai },
              ]
            ).map(({ key, input, side }) => (
              <div
                key={key}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md border border-hairline bg-surface1/70 px-2 pb-2 pt-1.5',
                  side.fainted && 'opacity-50',
                )}
              >
                <span className="pixel-label text-[7px] text-tx-muted">
                  {t(key === 'player' ? 'versus.you' : 'versus.foe')} · Lv. {side.level}
                </span>
                <Sprite
                  id={input.pokemonId}
                  name={names[key]}
                  era={spriteEraForVersus(ctx.gen, input.pokemonId)}
                  back={key === 'player' && ctx.gen <= 5}
                  className="h-16 w-16"
                />
                <span className="max-w-full truncate font-display text-[11px] font-bold uppercase tracking-wide text-tx-primary">
                  {names[key]}
                </span>
                {side.status && (
                  <span className="rounded-pill border border-ember/50 bg-ember/10 px-1.5 font-sans text-[8px] font-bold uppercase text-ember">
                    {t(`versus.battle.status.${side.status}`)}
                  </span>
                )}
                <div className="w-full">
                  <HpBar hp={side.hp} max={side.maxHp} />
                  <span className="mt-0.5 block text-right font-sans text-[9px] tabular-nums text-tx-muted">
                    {side.hp}/{side.maxHp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- active field chips ---------- */}
          {(snap.weather || snap.terrain) && (
            <div className="flex flex-wrap items-center gap-1">
              {snap.weather && SIM_WEATHER_KEY[snap.weather] && (
                <span className="rounded-pill border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase text-gold">
                  {t(`versus.weather.${SIM_WEATHER_KEY[snap.weather]}`)}
                </span>
              )}
              {snap.terrain && SIM_TERRAIN_KEY[snap.terrain] && (
                <span className="rounded-pill border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase text-gold">
                  {t(`versus.terrain.${SIM_TERRAIN_KEY[snap.terrain]}`)}
                </span>
              )}
            </div>
          )}

          {/* ---------- battle log ---------- */}
          <div
            ref={logRef}
            className="h-44 overflow-y-auto rounded-md border border-hairline bg-abyss/70 px-2.5 py-1.5 font-sans text-[11px]"
            data-lenis-prevent
            data-lenis-prevent-wheel
          >
            {events.map((e, i) => (
              <LogLine key={i} e={e} t={t} names={names} moveName={moveName} itemName={itemName} effectName={effectName} gameLabel={gameLabel} />
            ))}
          </div>

          {/* ---------- controls / result ---------- */}
          {result ? (
            <div
              className={cn(
                'flex flex-col items-center gap-2.5 rounded-md border px-3 py-4',
                result === 'ai' ? 'border-red-500/50 bg-red-500/10' : 'border-gold/30 bg-gold/5',
              )}
            >
              <span
                className={cn(
                  'font-display text-lg font-black uppercase tracking-widest',
                  result === 'ai' ? 'text-red-500' : 'text-gold',
                )}
                style={{
                  textShadow:
                    result === 'ai' ? '0 0 20px rgba(239,68,68,0.45)' : '0 0 20px rgba(246,201,69,0.45)',
                }}
              >
                {result === 'player'
                  ? t('versus.battle.resultWin')
                  : result === 'ai'
                    ? t('versus.battle.resultLose')
                    : t('versus.battle.resultTie')}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={rematch}
                  className="inline-flex h-7 items-center gap-1.5 rounded-pill border border-gold bg-gold px-3 font-display text-[10px] font-extrabold uppercase tracking-wider text-abyss transition-all hover:shadow-[0_0_16px_rgba(246,201,69,0.45)]"
                >
                  <RotateCcw size={10} />
                  {t('versus.battle.rematch')}
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex h-7 items-center gap-1.5 rounded-pill border border-hairline px-3 font-sans text-[10px] font-bold uppercase text-tx-secondary transition-colors hover:border-hairline2 hover:text-tx-primary"
                >
                  <Flag size={10} />
                  {t('versus.battle.back')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((slot) => {
                const m = snap.moves[slot];
                if (!m) {
                  return (
                    <div
                      key={slot}
                      className="flex h-9 items-center justify-center rounded-md border border-hairline/50 font-sans text-[10px] text-tx-muted/50"
                    >
                      —
                    </div>
                  );
                }
                const disabled = !snap.awaitingPlayer || m.disabled;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    onClick={() => choose(m.index)}
                    className={cn(
                      'flex h-9 flex-col items-center justify-center rounded-md border font-sans transition-colors',
                      disabled
                        ? 'cursor-not-allowed border-hairline/50 text-tx-muted/50'
                        : 'border-hairline text-tx-primary hover:border-gold/60 hover:bg-gold/10',
                    )}
                  >
                    <span className="flex items-center gap-1 text-[11px] font-semibold leading-none">
                      <Zap size={9} className="text-gold/70" />
                      {optionName(m.id, m.name)}
                    </span>
                    <span className="mt-0.5 text-[8px] uppercase leading-none text-tx-muted">
                      {t('versus.battle.pp', { pp: m.pp, max: m.maxPp })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Panel>
    </div>
  );
}
