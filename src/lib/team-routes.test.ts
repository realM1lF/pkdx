import { describe, expect, it } from 'vitest';
import { addToFirstFreeSlot, decodeTeamHash, emptyTeam, encodeTeamHash, loadTeams, saveTeam } from './teambuilder';
import {
  addableTeams,
  legacyShareRedirectPath,
  readLegacyTeamHash,
  teamEditPath,
  teamForEditPath,
  teamHubPath,
  resolveTeamRoute,
  teamRouteKey,
  teamShareHref,
  teamSharePath,
} from './team-routes';

describe('team routes', () => {
  it('keeps hub, editor and share on distinct paths', () => {
    expect(teamHubPath()).toBe('/team');
    expect(teamEditPath('abc-1')).toBe('/team/abc-1');
    expect(teamSharePath('zPAYLOAD')).toBe('/team/s/zPAYLOAD');
  });

  it('builds a durable share href that keeps the payload in the path', () => {
    expect(teamShareHref('https://mypokepanion.com', 'de', 'zABC')).toBe(
      'https://mypokepanion.com/de/team/s/zABC/',
    );
    expect(teamShareHref('https://mypokepanion.com/', 'en', 'jXYZ')).toBe(
      'https://mypokepanion.com/en/team/s/jXYZ/',
    );
  });

  it('maps a legacy #team= hash onto the share page', () => {
    expect(readLegacyTeamHash('#team=zABC')).toBe('zABC');
    expect(legacyShareRedirectPath('#team=zABC')).toBe('/team/s/zABC');
    expect(legacyShareRedirectPath('#other=1')).toBeNull();
    expect(legacyShareRedirectPath('#team=')).toBeNull();
  });

  it('changes the remount key when hub, editor or share URL changes', () => {
    expect(teamRouteKey(undefined, undefined)).toBe('hub');
    expect(teamRouteKey('abc-1')).toBe('edit:abc-1');
    expect(teamRouteKey(undefined, 'zABC')).toBe('share:zABC');
    expect(teamRouteKey('abc-1')).not.toBe(teamRouteKey('abc-2'));
    expect(teamRouteKey('abc-1')).not.toBe(teamRouteKey(undefined, undefined));
  });

  it('resolves hub, missing editor and share without keeping a previous team', () => {
    const team = emptyTeam('Vault');
    expect(resolveTeamRoute(undefined, undefined, [team], null)).toEqual({ kind: 'hub' });
    expect(resolveTeamRoute(undefined, 'zABC', [team], null)).toEqual({ kind: 'share' });
    expect(resolveTeamRoute('missing', undefined, [team], null)).toEqual({ kind: 'missing' });
    expect(resolveTeamRoute(team.id, undefined, [team], null)).toEqual({ kind: 'edit', team });
  });
});

describe('addableTeams', () => {
  it('drops linked Nuzlocke teams so a Pokédex add cannot be wiped by party sync', () => {
    const regular = emptyTeam('OU');
    const linked = emptyTeam('Kanto — ANN');
    linked.linkedRunId = 'run-1';
    linked.linkedPlayerId = 'p-1';
    expect(addableTeams([regular, linked]).map((t) => t.id)).toEqual([regular.id]);
  });
});

describe('teamForEditPath', () => {
  it('loads the vault row when no draft exists', () => {
    const team = emptyTeam('Vault');
    expect(teamForEditPath(team.id, [team], null)?.name).toBe('Vault');
  });

  it('prefers a newer draft of the same id', () => {
    const vault = emptyTeam('Saved');
    const draft = { ...vault, name: 'Unsaved', updatedAt: vault.updatedAt + 10 };
    expect(teamForEditPath(vault.id, [vault], draft)?.name).toBe('Unsaved');
  });

  it('ignores a draft for a different team', () => {
    const vault = emptyTeam('A');
    const draft = emptyTeam('B');
    expect(teamForEditPath(vault.id, [vault], draft)?.name).toBe('A');
    expect(teamForEditPath('missing', [vault], draft)).toBeNull();
  });
});

describe('pokedex add → vault → editor path', () => {
  it('keeps the added Pokémon on the saved team that /team/:id would open', () => {
    const map = new Map<string, string>();
    const mem = {
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
    };
    Object.defineProperty(globalThis, 'localStorage', { value: mem, configurable: true });

    const team = emptyTeam('My Team');
    const updated = addToFirstFreeSlot(team, { pokemon: 'gengar', pokemonId: 94, moves: ['shadow-ball'] });
    expect(updated).not.toBeNull();
    saveTeam(updated!);

    const opened = teamForEditPath(updated!.id, loadTeams(), null);
    expect(opened?.slots[0].pokemon).toBe('gengar');
    expect(opened?.slots[0].pokemonId).toBe(94);
  });
});

describe('share payload', () => {
  it('round-trips a team through encode → share path → decode', async () => {
    const team = emptyTeam('Share Me');
    team.slots[0] = { ...team.slots[0], pokemon: 'pikachu', pokemonId: 25, moves: ['thunderbolt', null, null, null] };
    const payload = await encodeTeamHash(team);
    expect(teamSharePath(payload)).toBe(`/team/s/${payload}`);
    const decoded = await decodeTeamHash(payload);
    expect(decoded?.name).toBe('Share Me');
    expect(decoded?.slots[0].pokemon).toBe('pikachu');
    expect(decoded?.slots[0].moves[0]).toBe('thunderbolt');
  });
});
