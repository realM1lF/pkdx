/* Micro-battle — framework-free types shared by the engine controller
 * (src/lib/battle/engine.ts), the lazy BattleView and the vitest suite.
 * No imports here on purpose: this module must stay dependency-free so the
 * controller can be tested in plain Node without any app import chain. */

/** PokéAPI-flavoured side setup — same shape VersusPanel already resolves
 *  (species slug, move slugs, item/ability slugs, calc nature, UI status). */
export interface BattleSideSetup {
  /** PokéAPI species slug, e.g. 'mr-mime' — the sim normalizes via toID. */
  species: string;
  level: number; // 1–100
  /** ≤4 PokéAPI move slugs; empty slots filtered by the caller. */
  moves: string[];
  item?: string | null;
  ability?: string | null;
  /** calc nature display name, e.g. 'Adamant' — omit for neutral. */
  nature?: string | null;
  evs?: Partial<Record<string, number>>;
  /** pre-battle status from the Versus side card */
  status?: 'burn' | 'par' | 'psn' | 'slp' | 'frz' | null;
}

export type BattleWeather = 'none' | 'sun' | 'rain' | 'sand' | 'snow' | 'hail';
export type BattleTerrain = 'none' | 'electric' | 'grassy' | 'misty' | 'psychic';

export interface BattleSetup {
  /** sim generation 1–9 (mapped from the Versus version group by the caller) */
  gen: number;
  player: BattleSideSetup;
  ai: BattleSideSetup;
  weather?: BattleWeather;
  terrain?: BattleTerrain;
  /** display label of the selected game (for the "ignored mechanic" log note) */
  gameLabel?: string;
}

export type AiMode = 'random' | 'greedy';
export type SideId = 'player' | 'ai';
export type BattleResult = SideId | 'tie';

/* ---------- structured log events (parsed from the engine protocol) ------- */

export type BattleEventKind =
  | 'turn'
  | 'switch' // initial send-out only (1v1, no manual switching)
  | 'move'
  | 'supereffective'
  | 'resisted'
  | 'immune'
  | 'crit'
  | 'miss'
  | 'ohko'
  | 'status'
  | 'curestatus'
  | 'boost'
  | 'unboost'
  | 'faint'
  | 'weather' // start + clear (upkeep ticks are dropped)
  | 'terrain' // start + end
  | 'healItem' // Leftovers & co: |-heal|...|[from] item: X
  | 'heal' // move-based/other recovery (Recover, draining moves, …)
  | 'damageFrom' // residual damage: burn/poison/sand/recoil/…
  | 'activate' // item/effect activation, e.g. Focus Sash
  | 'cant' // fully paralyzed / asleep / frozen / flinch / recharge
  | 'fail'
  | 'info' // controller-generated notes (format, ignored field toggles)
  | 'win'
  | 'raw'; // unmapped engine line — rendered as muted fallback text

export interface BattleEvent {
  kind: BattleEventKind;
  /** primary actor/target side, when identifiable */
  side?: SideId;
  /** engine display name of the involved Pokémon (fallback for unknown species) */
  name?: string;
  /** move reference (sim id + display name) */
  moveId?: string;
  moveName?: string;
  /** item reference (sim id + display name) */
  itemId?: string;
  itemName?: string;
  /** boost/unboost */
  stat?: string;
  amount?: number;
  /** status id: brn | par | psn | tox | slp | frz */
  status?: string;
  /** weather id: raindance | sunnyday | sandstorm | hail | snow | none */
  weather?: string;
  /** terrain id: electricterrain | grassyterrain | mistyterrain | psychicterrain | none */
  terrain?: string;
  /** residual source, e.g. 'brn', 'psn', 'sandstorm', 'recoil' */
  from?: string;
  /** turn number for kind 'turn' */
  turn?: number;
  /** winner for kind 'win' */
  winner?: BattleResult;
  /** free text for info/raw */
  text?: string;
  /** original engine line (debug/fallback) */
  raw: string;
}

/* ---------- UI snapshot ---------- */

export interface SideSnapshot {
  speciesName: string; // engine display name
  speciesNum: number; // national dex # (sprite id)
  level: number;
  hp: number;
  maxHp: number;
  fainted: boolean;
  /** sim status id ('' = healthy) */
  status: string;
  boosts: Record<string, number>;
}

export interface MoveOption {
  /** 1-based choice index for the sim */
  index: number;
  id: string;
  name: string; // engine display name
  pp: number;
  maxPp: number;
  disabled: boolean;
}

export interface BattleSnapshot {
  phase: 'running' | 'ended';
  turn: number;
  player: SideSnapshot;
  ai: SideSnapshot;
  /** current player options (empty when not awaiting input / battle over) */
  moves: MoveOption[];
  awaitingPlayer: boolean;
  winner: BattleResult | null;
  weather: string; // sim weather id or ''
  terrain: string; // sim terrain id or ''
}
