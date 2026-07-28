/* Micro-battle controller — framework-free wrapper around @pkmn/sim.
 *
 * Architecture: the controller owns the engine battle, a deterministic RNG
 * (sim PRNG, seeded), the AI strategies and the protocol→event parser.
 * React never touches @pkmn/sim directly; the view (BattleView) consumes
 * BattleSnapshot + BattleEvent only. @pkmn/sim is imported dynamically so it
 * never lands in the main bundle — only in the lazy battle chunk.
 *
 * Determinism: pass a fixed 4-word seed (sim PRNG format) in tests; the UI
 * uses crypto-random seeds. The random AI also draws from the battle PRNG so
 * a seed fully determines a battle.
 *
 * Greedy AI heuristic (documented per mission): for every enabled AI move the
 * expected damage is the mean of the @smogon/calc damage range against the
 * current player Pokémon (current HP/status/boosts, versus field mapped into
 * the calc Field). If the best option KOs (expected ≥ current HP) it is taken.
 * If the best expected damage is trivial (<10% of the target's max HP) and an
 * unused status/setup move exists, that status move is used once instead
 * (setup > pointless chip). Otherwise the highest-expectation move wins;
 * ties resolve to the lower slot index (deterministic). */

import { calculate, Field, Generations, Move as CalcMove, Pokemon as CalcPokemon } from '@smogon/calc';
import type { StatsTable } from '@smogon/calc';
import type { Battle as SimBattle, ID, PokemonSet, PRNGSeed } from '@pkmn/sim';
import type { GenerationNum } from '@pkmn/data';
import { genEffectivenessOf } from '../effectiveness';
import type {
  AiMode,
  BattleEvent,
  BattleSetup,
  BattleSideSetup,
  BattleSnapshot,
  BattleTerrain,
  BattleWeather,
  MoveOption,
  SideId,
  SideSnapshot,
} from './types';

type Sim = typeof import('@pkmn/sim');

const toID = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

const clampLevel = (lv: number) => Math.min(100, Math.max(1, Math.round(lv) || 1));

/** PokéAPI StatKey → sim/calc stat key */
const EV_KEY: Record<string, keyof StatsTable> = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  speed: 'spe',
};

const STATUS_TO_SIM: Record<string, string> = {
  burn: 'brn',
  par: 'par',
  psn: 'psn',
  slp: 'slp',
  frz: 'frz',
};

/* ---------- generation-gated field mechanics ---------- */

const WEATHER_RULES: Record<Exclude<BattleWeather, 'none'>, { id: string; minGen: number; maxGen: number }> = {
  sun: { id: 'sunnyday', minGen: 2, maxGen: 9 },
  rain: { id: 'raindance', minGen: 2, maxGen: 9 },
  sand: { id: 'sandstorm', minGen: 2, maxGen: 9 },
  hail: { id: 'hail', minGen: 3, maxGen: 8 },
  snow: { id: 'snow', minGen: 9, maxGen: 9 },
};

const TERRAIN_RULES: Record<Exclude<BattleTerrain, 'none'>, { id: string; minGen: number; maxGen: number }> = {
  electric: { id: 'electricterrain', minGen: 6, maxGen: 9 },
  grassy: { id: 'grassyterrain', minGen: 6, maxGen: 9 },
  misty: { id: 'mistyterrain', minGen: 6, maxGen: 9 },
  psychic: { id: 'psychicterrain', minGen: 6, maxGen: 9 },
};

/* ---------- calc Field mapping (for the greedy AI) ---------- */

const SIM_WEATHER_TO_CALC: Record<string, 'Sun' | 'Rain' | 'Sand' | 'Hail' | 'Snow'> = {
  sunnyday: 'Sun',
  raindance: 'Rain',
  sandstorm: 'Sand',
  hail: 'Hail',
  snow: 'Snow',
};

const SIM_TERRAIN_TO_CALC: Record<string, 'Electric' | 'Grassy' | 'Misty' | 'Psychic'> = {
  electricterrain: 'Electric',
  grassyterrain: 'Grassy',
  mistyterrain: 'Misty',
  psychicterrain: 'Psychic',
};

/** protocol lines that never become log events (preamble + channel plumbing) */
const NOISE_VERBS = new Set([
  '',
  't:',
  'gametype',
  'player',
  'gen',
  'tier',
  'rule',
  'rated',
  'clearpoke',
  'poke',
  'teamsize',
  'teampreview',
  'start',
  'upkeep',
  'split',
  'seed',
  'debug',
  'request',
  'error',
  'l',
  'html',
  'uhtml',
  'rawhtml',
  'bigerror',
  'chat',
  'join',
  'leave',
  'name',
  'inactive',
  'inactiveoff',
  'warning',
  '-nothing',
  '-hitcount',
  '-singleturn',
  '-singlemove',
]);

/* minimal structural view of the sim ChoiceRequest union (the official union
 * type isn't exported conveniently; we only read these fields) */
interface SimMoveRequestEntry {
  move: string;
  id: string;
  pp: number;
  maxpp: number;
  disabled?: boolean | string;
}

interface SimChoiceRequest {
  wait?: boolean;
  teamPreview?: boolean;
  active?: { moves?: SimMoveRequestEntry[] }[];
}

function choiceRequestOf(battle: SimBattle, side: 'p1' | 'p2'): SimChoiceRequest | null {
  return (battle[side].activeRequest as SimChoiceRequest | null) ?? null;
}

function sideOfIdent(ident: string): SideId | undefined {
  if (ident.startsWith('p1')) return 'player';
  if (ident.startsWith('p2')) return 'ai';
  return undefined;
}

function nameOfIdent(ident: string): string {
  const i = ident.indexOf(': ');
  return i >= 0 ? ident.slice(i + 2) : ident;
}

/** parse one engine protocol line → structured event (null = noise/dup) */
export function parseProtocolLine(line: string, p1Name: string, p2Name: string): BattleEvent | null {
  if (!line || line === '|') return null;
  const parts = line.split('|');
  const verb = parts[1] ?? '';
  if (NOISE_VERBS.has(verb)) return null;
  const raw = line;
  const side = sideOfIdent(parts[2] ?? '');
  const name = parts[2] ? nameOfIdent(parts[2]) : undefined;
  const fromIdx = parts.findIndex((p) => p.startsWith('[from]'));
  const from = fromIdx >= 0 ? parts[fromIdx].slice(6).trim() : undefined;

  switch (verb) {
    case 'turn':
      return { kind: 'turn', turn: Number(parts[2]), raw };
    case 'switch':
    case 'drag':
      return { kind: 'switch', side, name, raw };
    case 'move': {
      const moveName = parts[3] ?? '';
      return { kind: 'move', side, name, moveName, moveId: toID(moveName), raw };
    }
    case '-damage': {
      if (parts.some((p) => p.includes('fnt'))) return null; // KO shown via faint event
      if (!from) return null; // plain HP change → visible on the HP bar
      if (from.startsWith('item:')) {
        const itemName = from.slice(5).trim();
        return { kind: 'damageFrom', side, name, from: 'item', itemName, itemId: toID(itemName), raw };
      }
      return { kind: 'damageFrom', side, name, from: toID(from), raw };
    }
    case '-heal': {
      if (from?.startsWith('item:')) {
        const itemName = from.slice(5).trim();
        return { kind: 'healItem', side, name, itemName, itemId: toID(itemName), raw };
      }
      if (from?.startsWith('move:')) return { kind: 'heal', side, name, from: 'move', raw };
      return { kind: 'heal', side, name, from: from ? toID(from) : undefined, raw };
    }
    case '-supereffective':
      return { kind: 'supereffective', side, name, raw };
    case '-resisted':
      return { kind: 'resisted', side, name, raw };
    case '-immune':
      return { kind: 'immune', side, name, raw };
    case '-crit':
      return { kind: 'crit', side, name, raw };
    case '-miss':
      return { kind: 'miss', side, name, raw }; // parts[2] = attacker
    case '-ohko':
      return { kind: 'ohko', side, name, raw };
    case '-status':
      return { kind: 'status', side, name, status: parts[3], raw };
    case '-curestatus':
      return { kind: 'curestatus', side, name, status: parts[3], raw };
    case '-boost':
      return { kind: 'boost', side, name, stat: parts[3], amount: Number(parts[4]) || 1, raw };
    case '-unboost':
      return { kind: 'unboost', side, name, stat: parts[3], amount: Number(parts[4]) || 1, raw };
    case 'faint':
      return { kind: 'faint', side, name, raw };
    case '-weather': {
      if (parts.some((p) => p === '[upkeep]')) return null; // decay ticks are noise
      return { kind: 'weather', weather: toID(parts[2] ?? ''), raw };
    }
    case '-fieldstart': {
      const label = (parts[2] ?? '').replace(/^move:\s*/i, '').replace(/^terrain:\s*/i, '');
      return { kind: 'terrain', terrain: toID(label), raw };
    }
    case '-fieldend': {
      const label = (parts[2] ?? '').replace(/^move:\s*/i, '').replace(/^terrain:\s*/i, '');
      return { kind: 'terrain', terrain: toID(label) || 'none', raw };
    }
    case '-sidestart':
    case '-sideend': {
      // |-sidestart|p1: Player|move: Light Screen — the raw protocol line must
      // never reach the UI, so map it to a structured event with a clean label
      const label = (parts[3] ?? '')
        .replace(/^(move|ability|item):\s*/i, '')
        .trim();
      return {
        kind: verb === '-sidestart' ? 'sideStart' : 'sideEnd',
        side,
        effectId: toID(label),
        effectName: label,
        raw,
      };
    }
    case '-activate': {
      const effect = parts[3] ?? '';
      if (effect.startsWith('item:')) {
        const itemName = effect.slice(5).trim();
        return { kind: 'activate', side, name, itemName, itemId: toID(itemName), raw };
      }
      // non-item effect (move/ability/confusion/…) — strip the protocol prefix
      // so the view can localize a generic sentence instead of raw engine text
      const label = effect.replace(/^(move|ability):\s*/i, '').trim();
      return { kind: 'activate', side, name, effectId: toID(label), effectName: label, text: label, raw };
    }
    case '-enditem': {
      const itemName = (parts[3] ?? '').trim();
      return { kind: 'activate', side, name, itemName, itemId: toID(itemName), text: 'consumed', raw };
    }
    case '-cant':
    case 'cant':
      return { kind: 'cant', side, name, from: toID(parts[3] ?? ''), raw };
    case '-mustrecharge':
      return { kind: 'cant', side, name, from: 'recharge', raw };
    case '-fail':
      return { kind: 'fail', side, name, raw };
    case '-message':
      return { kind: 'raw', text: parts[2] ?? '', raw };
    case 'win':
      return { kind: 'win', winner: parts[2] === p1Name ? 'player' : parts[2] === p2Name ? 'ai' : 'tie', raw };
    case 'tie':
      return { kind: 'win', winner: 'tie', raw };
    default:
      // unmapped engine line — the view renders it as muted fallback text
      return { kind: 'raw', text: line.replace(/^\|/, '').split('|').join(' · '), raw };
  }
}

/* ================================================================== */

export interface MicroBattleOptions {
  aiMode: AiMode;
  /** 4-word sim PRNG seed; random when omitted */
  seed?: [number, number, number, number];
  onEvent?: (event: BattleEvent) => void;
  /** injected for tests — defaults to `await import('@pkmn/sim')` */
  simLoader?: () => Promise<Sim>;
}

/** prebundled sim asset (scripts/bundle-sim.mjs) — outside the rollup graph */
const SIM_VENDOR_URL = '/vendor/pkmn-sim.mjs';

/** Browser: static vendor bundle (lazy, separate download). Tests (vitest,
 * node): the real @pkmn/sim package — the vendor URL doesn't resolve there. */
async function defaultSimLoader(): Promise<Sim> {
  if (import.meta.env?.MODE === 'test') {
    const pkg = '@pkmn/sim'; // indirect so vite build-time analysis skips it
    return import(/* @vite-ignore */ pkg);
  }
  return import(/* @vite-ignore */ SIM_VENDOR_URL) as Promise<Sim>;
}

export function randomSeed(): [number, number, number, number] {
  const buf = new Uint16Array(4);
  const c = globalThis.crypto;
  if (c?.getRandomValues) c.getRandomValues(buf);
  else for (let i = 0; i < 4; i++) buf[i] = Math.floor(Math.random() * 65536);
  return [buf[0], buf[1], buf[2], buf[3]];
}

function buildSet(side: BattleSideSetup, gen: number): PokemonSet {
  /* Gen 1/2: "EVs" represent stat experience. @smogon/calc enforces max stat
   * exp (+63) internally for gen 1/2 stats; the sim instead derives stat exp
   * from set.evs (trunc(evs/4), see battle.statModify). evs 255 → +63, so the
   * packed team matches the calc exactly (e.g. lv50 Gyarados HP 201, not 170).
   * DVs are already max: the sim masks ivs to even (30 = DV 15) in gen ≤2. */
  const statExpMaxed = gen < 3;
  const set: PokemonSet = {
    name: '',
    species: side.species,
    item: '',
    ability: '',
    nature: '',
    gender: '',
    level: clampLevel(side.level),
    moves: side.moves.filter(Boolean).slice(0, 4),
    evs: statExpMaxed
      ? { hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255 }
      : { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  };
  if (!set.moves.length) set.moves = ['tackle'];
  // generation gates — the engine would ignore these anyway, but passing
  // unknown ids to old-gen dexes can throw, so strip them up front
  if (gen >= 2 && side.item) set.item = side.item;
  if (gen >= 3 && side.ability) set.ability = side.ability;
  if (gen >= 3 && side.nature) set.nature = side.nature;
  if (gen >= 3 && side.evs) {
    for (const [k, v] of Object.entries(side.evs)) {
      const key = EV_KEY[k] ?? k;
      if (['hp', 'atk', 'def', 'spa', 'spd', 'spe'].includes(key)) {
        set.evs[key as keyof StatsTable] = Math.min(252, Math.max(0, Math.round(v || 0)));
      }
    }
  }
  return set;
}

export class MicroBattle {
  private sim!: Sim;
  private battle!: SimBattle;
  private logPos = 0;
  private prevLine = '';
  private readonly events: BattleEvent[] = [];
  /** status/setup moves already tried, per sim side (each is used at most once) */
  private readonly usedStatusMoves: Record<'p1' | 'p2', Set<string>> = {
    p1: new Set<string>(),
    p2: new Set<string>(),
  };
  private calcGen: ReturnType<typeof Generations.get> | null = null;
  /** last attacking move per sim side — the sim's -supereffective/-resisted
   * lines carry no multiplier, so we recompute it from move type × defender
   * types (dual types multiply → ×4 / ×¼ shown in the log) */
  private readonly lastMove: Record<'p1' | 'p2', string | null> = { p1: null, p2: null };

  readonly setup: BattleSetup;
  readonly aiMode: AiMode;
  readonly seed: [number, number, number, number];
  private readonly onEvent?: (event: BattleEvent) => void;

  private constructor(
    setup: BattleSetup,
    aiMode: AiMode,
    seed: [number, number, number, number],
    onEvent?: (event: BattleEvent) => void,
  ) {
    this.setup = setup;
    this.aiMode = aiMode;
    this.seed = seed;
    this.onEvent = onEvent;
  }

  static async create(setup: BattleSetup, opts: MicroBattleOptions): Promise<MicroBattle> {
    const seed = opts.seed ?? randomSeed();
    const mb = new MicroBattle(setup, opts.aiMode, seed, opts.onEvent);
    mb.sim = await (opts.simLoader ? opts.simLoader() : defaultSimLoader());
    mb.initBattle();
    return mb;
  }

  private emit(event: BattleEvent) {
    this.events.push(event);
    this.onEvent?.(event);
  }

  private get formatId(): string {
    const gen = Math.min(9, Math.max(1, this.setup.gen));
    return `gen${gen}customgame`;
  }

  private initBattle() {
    const { sim, setup, seed } = this;
    const gen = Math.min(9, Math.max(1, setup.gen));
    this.battle = new sim.Battle({
      formatid: this.formatId as ID,
      // sim PRNG accepts the 4-word gen5 seed as comma-separated string
      seed: seed.join(',') as PRNGSeed,
      p1: { name: 'Player', team: sim.Teams.pack([buildSet(setup.player, gen)]) },
      p2: { name: 'Rival', team: sim.Teams.pack([buildSet(setup.ai, gen)]) },
    });

    // team preview only exists in gen ≥5 — resolve it when the engine asks
    let guard = 0;
    while (guard++ < 4) {
      const pending = (['p1', 'p2'] as const).filter((s) => choiceRequestOf(this.battle, s)?.teamPreview);
      if (!pending.length) break;
      for (const s of pending) this.battle.choose(s, 'default');
    }

    // starting field: versus weather/terrain toggles, generation-gated
    const source = this.battle.p1.pokemon[0];
    const weather = setup.weather ?? 'none';
    if (weather !== 'none') {
      const rule = WEATHER_RULES[weather];
      const ok = gen >= rule.minGen && gen <= rule.maxGen && this.battle.field.setWeather(rule.id, source);
      if (!ok) this.emitInfo('fieldIgnoredWeather', weather);
    }
    const terrain = setup.terrain ?? 'none';
    if (terrain !== 'none') {
      const rule = TERRAIN_RULES[terrain];
      const ok = gen >= rule.minGen && gen <= rule.maxGen && this.battle.field.setTerrain(rule.id, source);
      if (!ok) this.emitInfo('fieldIgnoredTerrain', terrain);
    }

    // pre-battle status from the versus side cards
    for (const [sideKey, sideSetup] of [
      ['p1', setup.player],
      ['p2', setup.ai],
    ] as const) {
      const code = sideSetup.status ? STATUS_TO_SIM[sideSetup.status] : undefined;
      if (code) this.battle[sideKey].pokemon[0].setStatus(code, null, null, true);
    }

    this.resetPPUps();

    this.emit({ kind: 'info', text: 'start', from: this.formatId, raw: '' });
    this.drain();
  }

  /**
   * @pkmn/sim hardcodes 3 PP-Ups per move in the Pokemon constructor (there is
   * no per-set ppUps mechanism — Teams.pack can't carry it). Wild mons and the
   * versus trainer sets use no PP-Ups, so rewrite every slot to the base PP
   * (Thunderbolt 15 instead of 24) for wild fidelity.
   */
  private resetPPUps() {
    for (const side of [this.battle.p1, this.battle.p2]) {
      for (const mon of side.pokemon) {
        for (const slots of [mon.baseMoveSlots, mon.moveSlots]) {
          for (const slot of slots) {
            const move = this.battle.dex.moves.get(slot.id);
            if (!move?.pp) continue;
            const base = this.battle.calculatePP(move, 0);
            slot.maxpp = base;
            slot.pp = Math.min(slot.pp, base);
          }
        }
      }
      /* the initial choice request was already built with PP-Up values —
       * patch it too; later requests are rebuilt from the fixed move slots */
      const reqMoves = (side.activeRequest as SimChoiceRequest | null)?.active?.[0]?.moves;
      if (reqMoves) {
        for (const m of reqMoves) {
          const move = this.battle.dex.moves.get(m.id);
          if (!move?.pp) continue;
          const base = this.battle.calculatePP(move, 0);
          m.maxpp = base;
          m.pp = Math.min(m.pp, base);
        }
      }
    }
  }

  private emitInfo(text: string, from?: string) {
    this.emit({ kind: 'info', text, from, raw: '' });
  }

  /* ---------- log draining ---------- */

  private drain() {
    const log = this.battle.log;
    for (let i = this.logPos; i < log.length; i++) {
      const line = log[i];
      // the sim log interleaves per-channel copies → identical consecutive lines
      if (line === this.prevLine) continue;
      this.prevLine = line;
      const ev = parseProtocolLine(line, 'Player', 'Rival');
      if (ev) {
        if (ev.kind === 'move' && ev.side && ev.moveId) {
          this.lastMove[ev.side === 'player' ? 'p1' : 'p2'] = ev.moveId;
        } else if ((ev.kind === 'supereffective' || ev.kind === 'resisted') && ev.side) {
          ev.mult = this.effectivenessOfLastHit(ev.side);
        }
        this.emit(ev);
      }
    }
    this.logPos = log.length;
  }

  /** type effectiveness of the last move hit against `defSide` (gen chart,
   * current defender types — dual types multiply, so Gyarados logs ×4) */
  private effectivenessOfLastHit(defSide: SideId): number | undefined {
    const defSim = defSide === 'player' ? 'p1' : 'p2';
    const atkSim = defSide === 'player' ? 'p2' : 'p1';
    const moveId = this.lastMove[atkSim];
    if (!moveId) return undefined;
    const moveType = this.battle.dex.moves.get(moveId)?.type;
    if (!moveType) return undefined;
    const defTypes = this.battle[defSim].pokemon[0]?.getTypes() ?? [];
    if (!defTypes.length) return undefined;
    const gen = Math.min(9, Math.max(1, this.setup.gen)) as GenerationNum;
    return genEffectivenessOf(gen, moveType.toLowerCase(), defTypes.map((t) => t.toLowerCase()));
  }

  /* ---------- public API ---------- */

  get eventLog(): readonly BattleEvent[] {
    return this.events;
  }

  get awaitingPlayer(): boolean {
    if (this.battle.ended) return false;
    const req = choiceRequestOf(this.battle, 'p1');
    return Boolean(req && !req.wait && !req.teamPreview);
  }

  private sideSnapshot(side: 'p1' | 'p2'): SideSnapshot {
    const p = this.battle[side].pokemon[0];
    return {
      speciesName: p.species.name,
      speciesNum: p.species.num,
      level: p.level,
      hp: p.hp,
      maxHp: p.maxhp,
      fainted: p.fainted,
      status: p.status,
      boosts: { ...p.boosts },
    };
  }

  private requestMoves(side: 'p1' | 'p2'): MoveOption[] {
    const req = choiceRequestOf(this.battle, side);
    const moves = req?.active?.[0]?.moves;
    if (moves?.length) {
      return moves.map((m: SimMoveRequestEntry, i: number) => ({
        index: i + 1,
        id: m.id,
        name: m.move,
        pp: m.pp,
        maxPp: m.maxpp,
        disabled: Boolean(m.disabled) || m.pp <= 0,
      }));
    }
    // fallback (no live request): raw move slots — PP state stays correct
    return this.battle[side].pokemon[0].moveSlots.map((m, i) => ({
      index: i + 1,
      id: m.id,
      name: m.move,
      pp: m.pp,
      maxPp: m.maxpp,
      disabled: Boolean(m.disabled) || m.pp <= 0,
    }));
  }

  snapshot(): BattleSnapshot {
    const ended = this.battle.ended;
    const winner = ended
      ? this.battle.winner === 'Player'
        ? 'player'
        : this.battle.winner === 'Rival'
          ? 'ai'
          : 'tie'
      : null;
    return {
      phase: ended ? 'ended' : 'running',
      turn: this.battle.turn,
      player: this.sideSnapshot('p1'),
      ai: this.sideSnapshot('p2'),
      moves: ended ? [] : this.requestMoves('p1'),
      awaitingPlayer: this.awaitingPlayer,
      winner,
      weather: this.battle.field.weather,
      terrain: this.battle.field.terrain,
    };
  }

  /** player commits a move (1-based slot); the AI answers; the turn resolves. */
  playerMove(index: number): BattleSnapshot {
    if (!this.awaitingPlayer) return this.snapshot();
    this.battle.choose('p1', `move ${index}`);
    if (!this.battle.ended) {
      const req = choiceRequestOf(this.battle, 'p2');
      if (req && !req.wait && !req.teamPreview) {
        this.battle.choose('p2', this.pickAiChoice());
      }
    }
    this.drain();
    return this.snapshot();
  }

  /**
   * Batch mode for simulations: drive BOTH sides with the greedy heuristic
   * until the battle ends. Deterministic for a fixed seed — the greedy picker
   * breaks ties by slot order and only the sim PRNG (seeded) rolls damage,
   * accuracy and speed ties. `maxTurns` guards against endless stall
   * (e.g. double recovery loops); a battle cut off this way counts as a tie.
   */
  autoBattle(maxTurns = 200): BattleSnapshot {
    let guard = 0;
    while (!this.battle.ended && guard++ < maxTurns) {
      let acted = false;
      for (const side of ['p1', 'p2'] as const) {
        if (this.battle.ended) break;
        const req = choiceRequestOf(this.battle, side);
        if (req && !req.wait && !req.teamPreview) {
          const options = this.requestMoves(side).filter((m) => !m.disabled);
          this.battle.choose(side, `move ${options.length ? this.greedyPick(options, side) : 1}`);
          acted = true;
        }
      }
      this.drain();
      if (!acted) break; // no side can move — defensive exit, should not happen
    }
    this.drain();
    return this.snapshot();
  }

  /* ---------- AI ---------- */

  private aiOptions(): MoveOption[] {
    return this.requestMoves('p2').filter((m) => !m.disabled);
  }

  private pickAiChoice(): string {
    const options = this.aiOptions();
    if (!options.length) return 'move 1';
    if (this.aiMode === 'random') {
      // engine PRNG → the battle stays fully seed-deterministic
      const pick = this.battle.prng.sample(options);
      return `move ${pick.index}`;
    }
    return `move ${this.greedyPick(options, 'p2')}`;
  }

  private greedyPick(options: MoveOption[], side: 'p1' | 'p2'): number {
    const foe = this.battle[side === 'p1' ? 'p2' : 'p1'].pokemon[0];
    const scored = options.map((opt) => ({ opt, expected: this.expectedDamage(opt.id, side) }));
    let best = scored[0];
    for (const s of scored) if (s.expected > best.expected) best = s;
    // secure the KO whenever an option is expected to finish
    if (best.expected >= foe.hp) return best.opt.index;
    // setup/status over pointless chip damage (<10% of max HP) — each status
    // move is tried at most once per battle, then we fall back to best damage
    if (best.expected < foe.maxhp * 0.1) {
      const used = this.usedStatusMoves[side];
      const status = scored.find((s) => s.expected <= 0 && !used.has(s.opt.id));
      if (status) {
        used.add(status.opt.id);
        return status.opt.index;
      }
    }
    return best.opt.index;
  }

  /** mean of the @smogon/calc damage range for a move used by `side` vs its foe */
  private expectedDamage(moveId: string, side: 'p1' | 'p2' = 'p2'): number {
    const gen = this.genForCalc();
    const move = gen.moves.get(moveId as ID);
    if (!move || !move.basePower) return 0; // status / OHKO / unknown
    const genNum = Math.min(9, Math.max(1, this.setup.gen));
    const attacker = this.calcMon(genNum, side);
    const defender = this.calcMon(genNum, side === 'p1' ? 'p2' : 'p1');
    if (!attacker || !defender) return 0;
    const result = calculate(gen, attacker, defender, new CalcMove(gen, moveId), this.calcField());
    // result.damage: number | number[] | number[][] (multi-hit) — mean of min/max roll
    const dmg = result.damage;
    if (typeof dmg === 'number') return dmg;
    const flat = (dmg as unknown[]).flat(Infinity).filter((n): n is number => typeof n === 'number');
    if (!flat.length) return 0;
    return (Math.min(...flat) + Math.max(...flat)) / 2;
  }

  private genForCalc(): ReturnType<typeof Generations.get> {
    if (!this.calcGen) {
      const gen = Math.min(9, Math.max(1, this.setup.gen));
      this.calcGen = Generations.get(gen as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
    }
    return this.calcGen;
  }

  private calcMon(genNum: number, side: 'p1' | 'p2'): CalcPokemon | null {
    const p = this.battle[side].pokemon[0];
    const setup = side === 'p1' ? this.setup.player : this.setup.ai;
    try {
      return new CalcPokemon(this.genForCalc(), p.species.name, {
        level: p.level,
        item: genNum >= 2 && setup.item ? setup.item : undefined,
        ability: genNum >= 3 && setup.ability ? setup.ability : undefined,
        nature: genNum >= 3 && setup.nature ? setup.nature : undefined,
        evs: buildSet(setup, genNum).evs,
        status: (p.status || undefined) as 'brn' | 'par' | 'psn' | 'slp' | 'frz' | undefined,
        boosts: { ...p.boosts },
        curHP: p.hp,
      });
    } catch {
      return null; // species unknown to the calc (e.g. gen mismatch) → 0 damage
    }
  }

  private calcField(): Field {
    const weather = SIM_WEATHER_TO_CALC[this.battle.field.weather];
    const terrain = SIM_TERRAIN_TO_CALC[this.battle.field.terrain];
    return new Field({ weather, terrain });
  }
}
