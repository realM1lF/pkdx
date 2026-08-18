import { beforeEach, describe, expect, it } from 'vitest';
import {
  addToBox,
  addToTeamOrBox,
  demoteToBox,
  emptyTeam,
  filledBoxSlots,
  normalizeTeam,
  promoteFromBox,
  removeBoxSlot,
} from './teambuilder';

function installMemoryLocalStorage(): void {
  const map = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      get length() {
        return map.size;
      },
      clear() {
        map.clear();
      },
      getItem(key: string) {
        return map.has(key) ? map.get(key)! : null;
      },
      setItem(key: string, value: string) {
        map.set(String(key), String(value));
      },
      removeItem(key: string) {
        map.delete(key);
      },
      key(i: number) {
        return [...map.keys()][i] ?? null;
      },
    },
    configurable: true,
  });
}

beforeEach(() => {
  installMemoryLocalStorage();
});

describe('teambuilder box helpers', () => {
  it('addToTeamOrBox fills team first then box', () => {
    let team = emptyTeam();
    for (let i = 1; i <= 6; i++) {
      const r = addToTeamOrBox(team, { pokemon: `mon-${i}`, pokemonId: i });
      expect(r.target).toBe('team');
      team = r.team;
    }
    const seventh = addToTeamOrBox(team, { pokemon: 'gengar', pokemonId: 94, moves: ['shadow-ball'] });
    expect(seventh.target).toBe('box');
    expect(filledBoxSlots(seventh.team)).toHaveLength(1);
    expect(seventh.team.box?.[0].pokemon).toBe('gengar');
  });

  it('promoteFromBox moves reserve into first free slot', () => {
    let team = emptyTeam();
    for (let i = 1; i <= 6; i++) {
      team = addToTeamOrBox(team, { pokemon: `mon-${i}`, pokemonId: i }).team;
    }
    team = addToBox(team, { pokemon: 'gengar', pokemonId: 94 });
    const boxId = team.box![0].id;
    team = { ...team, slots: team.slots.map((s, i) => (i === 0 ? { ...s, pokemon: null, pokemonId: null } : s)) };
    const next = promoteFromBox(team, boxId);
    expect(next).not.toBeNull();
    expect(next!.slots[0].pokemon).toBe('gengar');
    expect(filledBoxSlots(next!)).toHaveLength(0);
  });

  it('demoteToBox and removeBoxSlot work for free teams', () => {
    let team = emptyTeam();
    team = addToTeamOrBox(team, { pokemon: 'pikachu', pokemonId: 25 }).team;
    const slotId = team.slots[0].id;
    team = demoteToBox(team, slotId)!;
    expect(filledBoxSlots(team)).toHaveLength(1);
    expect(team.slots[0].pokemon).toBeNull();
    team = removeBoxSlot(team, team.box![0].id);
    expect(filledBoxSlots(team)).toHaveLength(0);
  });

  it('normalizeTeam defaults missing box to []', () => {
    const raw = emptyTeam();
    delete (raw as { box?: unknown }).box;
    const norm = normalizeTeam(raw)!;
    expect(norm.box).toEqual([]);
  });
});
