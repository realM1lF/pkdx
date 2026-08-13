/* Micro-battle engine tests — standalone Node/vitest (no app import chain,
 * no supabase). All battles are seeded via the sim PRNG → fully deterministic. */
import { describe, expect, it } from 'vitest';
import { MicroBattle, parseProtocolLine, simVendorImportUrl } from './engine';
import type { BattleSetup, BattleSideSetup } from './types';

const side = (over: Partial<BattleSideSetup>): BattleSideSetup => ({
  species: 'pikachu',
  level: 50,
  moves: ['thunderbolt', 'quick-attack', 'growl', 'thunder-wave'],
  ...over,
});

const setup = (over: Partial<BattleSetup>): BattleSetup => ({
  gen: 9,
  player: side({}),
  ai: side({ species: 'charizard', moves: ['flamethrower', 'air-slash', 'slash', 'dragon-dance'] }),
  ...over,
});

const SEED: [number, number, number, number] = [42, 7, 1987, 9001];

/** drive a battle to the end with deterministic player choices (first enabled move) */
async function runToEnd(mb: MicroBattle, maxTurns = 300) {
  let snap = mb.snapshot();
  let guard = 0;
  while (snap.phase === 'running' && guard++ < maxTurns) {
    const move = snap.moves.find((m) => !m.disabled) ?? snap.moves[0];
    snap = mb.playerMove(move?.index ?? 1);
  }
  return snap;
}

describe('micro-battle engine', () => {
  it('runs a full seeded battle to a winner with a non-empty log; seed reproduces exactly', async () => {
    const a = await MicroBattle.create(setup({}), { aiMode: 'random', seed: SEED });
    const endA = await runToEnd(a);
    expect(endA.phase).toBe('ended');
    expect(['player', 'ai', 'tie']).toContain(endA.winner);
    expect(a.eventLog.length).toBeGreaterThan(0);

    const b = await MicroBattle.create(setup({}), { aiMode: 'random', seed: SEED });
    const endB = await runToEnd(b);
    // same seed → identical event stream and result
    expect(JSON.stringify(b.eventLog)).toBe(JSON.stringify(a.eventLog));
    expect(endB.winner).toBe(endA.winner);
    expect(endB.player.hp).toBe(endA.player.hp);
    expect(endB.ai.hp).toBe(endA.ai.hp);
  });

  it('Growl lowers the foe attack by one stage (engine state + log event)', async () => {
    const mb = await MicroBattle.create(
      setup({
        player: side({ species: 'pikachu', moves: ['growl'] }),
        ai: side({ species: 'charizard', moves: ['growl'] }),
      }),
      { aiMode: 'random', seed: SEED },
    );
    const snap = mb.playerMove(1); // player growls
    expect(snap.ai.boosts.atk).toBe(-1);
    const unboost = mb.eventLog.find((e) => e.kind === 'unboost' && e.side === 'ai' && e.stat === 'atk');
    expect(unboost).toBeTruthy();
    expect(unboost?.amount).toBe(1);
  });

  it('Explosion self-KO ends the battle; the exploding side loses when both faint', async () => {
    // sim behaviour (documented): the self-KO user faints first, so the
    // opposing side is declared winner when both Pokémon go down
    const mb = await MicroBattle.create(
      setup({
        player: side({ species: 'electrode', level: 50, moves: ['explosion'] }),
        ai: side({ species: 'magikarp', level: 5, moves: ['splash'] }),
      }),
      { aiMode: 'random', seed: SEED },
    );
    const snap = mb.playerMove(1);
    expect(snap.phase).toBe('ended');
    expect(snap.player.fainted).toBe(true);
    expect(snap.ai.fainted).toBe(true);
    expect(snap.winner).toBe('ai');
    expect(mb.eventLog.some((e) => e.kind === 'faint' && e.side === 'player')).toBe(true);
    expect(mb.eventLog.some((e) => e.kind === 'win' && e.winner === 'ai')).toBe(true);
  });

  it('Choice Band locks the AI/player into the first move used (request flags)', async () => {
    const mb = await MicroBattle.create(
      setup({
        player: side({
          species: 'machamp',
          level: 20,
          item: 'choice-band',
          ability: 'guts',
          moves: ['close-combat', 'karate-chop', 'strength', 'rock-slide'],
        }),
        ai: side({ species: 'blissey', level: 50, moves: ['growl'] }),
      }),
      { aiMode: 'random', seed: SEED },
    );
    const before = mb.snapshot();
    expect(before.moves.filter((m) => !m.disabled)).toHaveLength(4);
    const after = mb.playerMove(1); // Close Combat → band locks
    const enabled = after.moves.filter((m) => !m.disabled);
    expect(enabled).toHaveLength(1);
    expect(enabled[0].id).toBe('closecombat');
  });

  it('rain boosts a water move vs the same attack without rain (same seed/setup)', async () => {
    const mk = (weather: 'none' | 'rain') =>
      MicroBattle.create(
        setup({
          gen: 3,
          player: side({ species: 'blastoise', moves: ['water-gun', 'tackle', 'bite', 'tail-whip'] }),
          ai: side({ species: 'charizard', moves: ['growl'] }), // growl never damages
          weather,
        }),
        { aiMode: 'random', seed: SEED },
      );
    const dry = await mk('none');
    const dryEnd = dry.playerMove(1); // water gun
    const wet = await mk('rain');
    const wetEnd = wet.playerMove(1);

    const dryDmg = dryEnd.ai.maxHp - dryEnd.ai.hp;
    const wetDmg = wetEnd.ai.maxHp - wetEnd.ai.hp;
    expect(dryDmg).toBeGreaterThan(0);
    expect(wetDmg).toBeGreaterThan(dryDmg);
    // rain logged as active weather, and the start note recorded the gen-3 format
    expect(wet.eventLog.some((e) => e.kind === 'weather' && e.weather === 'raindance')).toBe(true);
    expect(wet.snapshot().weather).toBe('raindance');
  });

  it('weather set as start condition decays via the engine (5 turns)', async () => {
    const mb = await MicroBattle.create(
      setup({
        gen: 9,
        player: side({ species: 'blastoise', moves: ['tail-whip'] }),
        ai: side({ species: 'charizard', moves: ['growl'] }),
        weather: 'rain',
      }),
      { aiMode: 'random', seed: SEED },
    );
    expect(mb.snapshot().weather).toBe('raindance');
    let snap = mb.snapshot();
    for (let i = 0; i < 5 && snap.phase === 'running'; i++) snap = mb.playerMove(1);
    expect(snap.weather).toBe(''); // engine expired the 5-turn rain
    expect(mb.eventLog.some((e) => e.kind === 'weather' && e.weather === 'none')).toBe(true);
  });

  it('greedy AI picks the highest-damage option (4× effective move in set)', async () => {
    const mb = await MicroBattle.create(
      setup({
        player: side({ species: 'geodude', level: 50, moves: ['tackle'] }), // rock/ground → 4× water weak
        ai: side({
          species: 'squirtle',
          level: 50,
          moves: ['tackle', 'water-gun', 'bite', 'tail-whip'],
        }),
      }),
      { aiMode: 'greedy', seed: SEED },
    );
    const snap = mb.playerMove(1);
    const aiMove = [...mb.eventLog].reverse().find((e) => e.kind === 'move' && e.side === 'ai');
    expect(aiMove?.moveId).toBe('watergun');
    expect(snap.player.hp).toBeLessThan(snap.player.maxHp);
  });

  it('greedy AI falls back to an unused status move when damage is pointless chip', async () => {
    // player: lvl 95 Shuckle (massive defenses, harmless Splash);
    // AI: lvl 5 Magikarp — Tackle chip is <10% of Shuckle's max HP
    const mb = await MicroBattle.create(
      setup({
        player: side({ species: 'shuckle', level: 95, moves: ['splash'] }),
        ai: side({ species: 'magikarp', level: 5, moves: ['tackle', 'splash'] }),
      }),
      { aiMode: 'greedy', seed: SEED },
    );
    mb.playerMove(1);
    const aiMove = [...mb.eventLog].reverse().find((e) => e.kind === 'move' && e.side === 'ai');
    expect(aiMove?.moveId).toBe('splash'); // chip < 10% max HP → status fallback
  });

  it('unsupported start weather is ignored with an info note (gen-gating)', async () => {
    const mb = await MicroBattle.create(
      setup({ gen: 2, weather: 'hail' }), // hail is gen 3–8
      { aiMode: 'random', seed: SEED },
    );
    expect(mb.snapshot().weather).toBe('');
    expect(mb.eventLog.some((e) => e.kind === 'info' && e.text === 'fieldIgnoredWeather' && e.from === 'hail')).toBe(
      true,
    );
  });
});

describe('protocol parser', () => {
  it('maps core lines and drops channel duplicates/noise', () => {
    expect(parseProtocolLine('|turn|3', 'Player', 'Rival')).toMatchObject({ kind: 'turn', turn: 3 });
    expect(
      parseProtocolLine('|move|p1a: Pikachu|Quick Attack|p2a: Charizard', 'Player', 'Rival'),
    ).toMatchObject({ kind: 'move', side: 'player', moveId: 'quickattack' });
    expect(parseProtocolLine('|-heal|p2a: Blissey|194/330|[from] item: Leftovers', 'Player', 'Rival')).toMatchObject(
      { kind: 'healItem', itemId: 'leftovers' },
    );
    expect(parseProtocolLine('|-weather|RainDance|[upkeep]', 'Player', 'Rival')).toBeNull();
    expect(parseProtocolLine('|t:|1784926018', 'Player', 'Rival')).toBeNull();
    expect(parseProtocolLine('|-damage|p1a: Pikachu|14/110', 'Player', 'Rival')).toBeNull(); // bar shows it
    expect(parseProtocolLine('|-damage|p1a: Pikachu|14/110|[from] brn', 'Player', 'Rival')).toMatchObject({
      kind: 'damageFrom',
      from: 'brn',
    });
    expect(parseProtocolLine('|tie', 'Player', 'Rival')).toMatchObject({ kind: 'win', winner: 'tie' });
  });

  it('maps side conditions to structured events instead of raw protocol leaks', () => {
    expect(
      parseProtocolLine('|-sidestart|p1: Player|move: Light Screen', 'Player', 'Rival'),
    ).toMatchObject({ kind: 'sideStart', side: 'player', effectId: 'lightscreen', effectName: 'Light Screen' });
    expect(parseProtocolLine('|-sideend|p2: Rival|move: Tailwind', 'Player', 'Rival')).toMatchObject({
      kind: 'sideEnd',
      side: 'ai',
      effectId: 'tailwind',
    });
    expect(parseProtocolLine('|-sidestart|p2: Rival|Stealth Rock', 'Player', 'Rival')).toMatchObject({
      kind: 'sideStart',
      side: 'ai',
      effectId: 'stealthrock',
    });
    // non-item -activate: protocol prefix stripped, no raw engine text
    expect(
      parseProtocolLine('|-activate|p1a: Pikachu|move: Light Screen', 'Player', 'Rival'),
    ).toMatchObject({ kind: 'activate', effectId: 'lightscreen', text: 'Light Screen' });
  });

  it('Light Screen surfaces as a sideStart event in a real battle', async () => {
    const mb = await MicroBattle.create(
      setup({
        player: side({ species: 'alakazam', moves: ['light-screen'] }),
        ai: side({ species: 'magikarp', level: 5, moves: ['splash'] }),
      }),
      { aiMode: 'random', seed: SEED },
    );
    mb.playerMove(1);
    const ev = mb.eventLog.find((e) => e.kind === 'sideStart');
    expect(ev).toMatchObject({ side: 'player', effectId: 'lightscreen' });
    // and no raw protocol line leaks through as an unmapped fallback
    expect(mb.eventLog.some((e) => e.kind === 'raw' && e.raw.includes('sidestart'))).toBe(false);
  });
});

/* ================================================================== */
/* calc parity: gen 1/2 stat experience + PP fidelity                   */
/* ================================================================== */
import { Generations, Pokemon as CalcPokemon } from '@smogon/calc';

describe('gen 1/2 stat-exp parity with @smogon/calc', () => {
  /* @smogon/calc enforces max stat exp (+63) internally for gen 1/2; the sim
   * derives stat exp from set.evs. The teampack must max it (evs 255 → +63)
   * so sim stats == calc stats — otherwise the versus matrix undershoots
   * gen 1/2 damage by ~7–10 points (KO-label flips). */
  it.each([1, 2] as const)('gen %i: sim HP == calc HP (lv50 Gyarados 201, not 170)', async (gen) => {
    const mb = await MicroBattle.create(
      {
        gen,
        player: side({ species: 'gyarados', moves: ['surf'] }),
        ai: side({ species: 'zapdos', moves: ['thunder'] }),
      },
      { aiMode: 'random', seed: SEED },
    );
    const calcGy = new CalcPokemon(Generations.get(gen), 'gyarados', { level: 50 });
    expect(mb.snapshot().player.maxHp).toBe(201);
    expect(mb.snapshot().player.maxHp).toBe(calcGy.stats.hp);
  });

  it('gen 3+ keeps EV 0 default (lv50 Gyarados 170-ish, no stat exp)', async () => {
    const mb = await MicroBattle.create(
      {
        gen: 3,
        player: side({ species: 'gyarados', moves: ['surf'] }),
        ai: side({ species: 'zapdos', moves: ['thunder'] }),
      },
      { aiMode: 'random', seed: SEED },
    );
    const calcGy = new CalcPokemon(Generations.get(3), 'gyarados', { level: 50 });
    expect(mb.snapshot().player.maxHp).toBe(calcGy.stats.hp);
    expect(mb.snapshot().player.maxHp).toBeLessThan(201);
  });
});

describe('move PP fidelity', () => {
  /* @pkmn/sim hardcodes 3 PP-Ups per move (no per-set mechanism); wild/versus
   * mons use none, so the controller rewrites slots to base PP. */
  it('Thunderbolt uses base PP 15, not the PP-Up 24', async () => {
    const mb = await MicroBattle.create(
      setup({ player: side({ moves: ['thunderbolt'] }) }),
      { aiMode: 'random', seed: SEED },
    );
    const tb = mb.snapshot().moves.find((m) => m.id === 'thunderbolt');
    expect(tb).toBeTruthy();
    expect(tb!.maxPp).toBe(15);
    expect(tb!.pp).toBe(15);
  });

  it('base PP also holds in gen 1 (Thunderbolt 15)', async () => {
    const mb = await MicroBattle.create(
      { gen: 1, player: side({ moves: ['thunderbolt'] }), ai: side({ species: 'charizard', moves: ['slash'] }) },
      { aiMode: 'random', seed: SEED },
    );
    const tb = mb.snapshot().moves.find((m) => m.id === 'thunderbolt');
    expect(tb!.maxPp).toBe(15);
  });
});

describe('sim vendor URL (Vite public-dir import)', () => {
  it('is an absolute same-origin URL, not a /public path Vite would rewrite with ?import', () => {
    expect(simVendorImportUrl('http://localhost:3000')).toBe('http://localhost:3000/vendor/pkmn-sim.mjs');
    expect(simVendorImportUrl('http://localhost:3000/')).toBe('http://localhost:3000/vendor/pkmn-sim.mjs');
    expect(simVendorImportUrl('http://localhost:3000')).not.toMatch(/\?/);
  });
});
