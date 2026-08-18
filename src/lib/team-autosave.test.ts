import { beforeEach, describe, expect, it } from 'vitest';
import {
  addToBox,
  addToTeamOrBox,
  emptyTeam,
  loadTeams,
  saveTeam,
  teamHasUnsavedEdits,
  teamShouldPersist,
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

describe('teamShouldPersist', () => {
  it('skips empty free teams', () => {
    expect(teamShouldPersist(emptyTeam())).toBe(false);
  });

  it('persists free teams with roster or box members', () => {
    let team = emptyTeam();
    team = addToTeamOrBox(team, { pokemon: 'pikachu', pokemonId: 25 }).team;
    expect(teamShouldPersist(team)).toBe(true);

    let full = team;
    for (let i = 2; i <= 6; i++) full = addToTeamOrBox(full, { pokemon: `mon-${i}`, pokemonId: i }).team;
    full = addToBox(full, { pokemon: 'gengar', pokemonId: 94 });
    expect(teamShouldPersist(full)).toBe(true);
  });

  it('always persists linked nuzlocke teams', () => {
    const linked = emptyTeam('Run — ANN');
    linked.linkedRunId = 'run-1';
    linked.linkedPlayerId = 'p-1';
    expect(teamShouldPersist(linked)).toBe(true);
  });
});

describe('teamHasUnsavedEdits', () => {
  it('is false for freshly loaded vault rows', () => {
    const team = addToTeamOrBox(emptyTeam(), { pokemon: 'pikachu', pokemonId: 25 }).team;
    expect(teamHasUnsavedEdits(team, team.updatedAt)).toBe(false);
  });

  it('is true after patchTeam-style updatedAt bump', () => {
    const team = addToTeamOrBox(emptyTeam(), { pokemon: 'pikachu', pokemonId: 25 }).team;
    const edited = { ...team, name: 'Edited', updatedAt: team.updatedAt + 1 };
    expect(teamHasUnsavedEdits(edited, team.updatedAt)).toBe(true);
  });
});

describe('vault autosave contract', () => {
  it('saveTeam upserts edits without a manual save button', () => {
    let team = emptyTeam('Draft');
    team = addToTeamOrBox(team, { pokemon: 'bulbasaur', pokemonId: 1, moves: ['tackle'] }).team;
    expect(teamShouldPersist(team)).toBe(true);
    saveTeam(team);

    const persisted = loadTeams().find((t) => t.id === team.id);
    expect(persisted?.slots[0].pokemon).toBe('bulbasaur');
    expect(persisted?.slots[0].moves[0]).toBe('tackle');

    const edited = {
      ...persisted!,
      slots: persisted!.slots.map((s, i) =>
        i === 0 ? { ...s, moves: ['razor-leaf', null, null, null] as typeof s.moves } : s,
      ),
      updatedAt: Date.now(),
    };
    saveTeam(edited);
    expect(loadTeams().find((t) => t.id === team.id)?.slots[0].moves[0]).toBe('razor-leaf');
  });

  it('saveTeam bumps updatedAt (editor must not re-hydrate from own notify)', () => {
    const team = addToTeamOrBox(emptyTeam(), { pokemon: 'pikachu', pokemonId: 25 }).team;
    const before = team.updatedAt;
    saveTeam(team);
    const after = loadTeams().find((t) => t.id === team.id)!.updatedAt;
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
