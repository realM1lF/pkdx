/* Open Lobby (Option A): host-only online create, next free slot, own rename. */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_RULES,
  MAX_PLAYERS,
  createRun,
  getRunState,
  myPlayerId,
  nextPlayerSlot,
  renamePlayer,
  resolveCreateCrew,
} from './nuzlocke-store';

function installMemoryLocalStorage(): void {
  const map = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      get length() {
        return map.size;
      },
      clear: () => map.clear(),
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => {
        map.set(String(k), String(v));
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
      key: (i: number) => [...map.keys()][i] ?? null,
    },
  });
}

beforeEach(() => {
  installMemoryLocalStorage();
});

describe('resolveCreateCrew', () => {
  const crew = [
    { name: 'HOST', color: '#FFD60A' },
    { name: 'FAKE', color: '#45C8FF' },
  ];

  it('online → host only (no placeholder seats)', () => {
    expect(resolveCreateCrew(crew, true)).toEqual([crew[0]]);
  });

  it('offline → full local crew', () => {
    expect(resolveCreateCrew(crew, false)).toEqual(crew);
  });
});

describe('nextPlayerSlot', () => {
  it('empty → 0', () => {
    expect(nextPlayerSlot([])).toBe(0);
  });

  it('dense slots → next index', () => {
    expect(nextPlayerSlot([{ slot: 0 }, { slot: 1 }])).toBe(2);
  });

  it('gap → fills lowest free slot', () => {
    expect(nextPlayerSlot([{ slot: 0 }, { slot: 2 }])).toBe(1);
  });

  it('full → MAX_PLAYERS sentinel', () => {
    expect(nextPlayerSlot([{ slot: 0 }, { slot: 1 }, { slot: 2 }, { slot: 3 }])).toBe(MAX_PLAYERS);
  });
});

describe('createRun offline crew', () => {
  it('keeps multiple local players on one device', async () => {
    const { state } = await createRun({
      name: 'Local Duo',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(state.players).toHaveLength(2);
    expect(state.players.map((p) => p.slot)).toEqual([0, 1]);
    expect(myPlayerId(state.run.id)).toBe(state.players[0].id);
  });
});

describe('renamePlayer', () => {
  it('renames own membership slot', async () => {
    const { state } = await createRun({
      name: 'Rename Me',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const mine = state.players[0].id;
    expect(renamePlayer(state.run.id, mine, '  ANNIE  ')).toBe(true);
    expect(getRunState(state.run.id)!.players[0].name).toBe('ANNIE');
  });

  it('refuses other players and empty names', async () => {
    const { state } = await createRun({
      name: 'No Steal',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const other = state.players[1].id;
    expect(renamePlayer(state.run.id, other, 'HACKER')).toBe(false);
    expect(getRunState(state.run.id)!.players[1].name).toBe('BOB');
    expect(renamePlayer(state.run.id, state.players[0].id, '   ')).toBe(false);
  });
});

describe('MAX_PLAYERS', () => {
  it('cap stays 4', () => {
    expect(MAX_PLAYERS).toBe(4);
  });
});
