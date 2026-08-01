/* Badge-driven auto level cap (§A3) — `nextGymInfo` / `effectiveLevelCap`. */
import { beforeEach, describe, expect, it } from 'vitest';
import { RULE_PRESETS, effectiveLevelCap, gymCapPreview, nextGymInfo, normalizeRules } from './nuzlocke-rules';
import { DEFAULT_RULES, createRun } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';

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

async function makeRun(region: string, rules?: Partial<import('./supabase').NuzRules>): Promise<RunState> {
  const gameByRegion: Record<string, string> = {
    kanto: 'firered',
    johto: 'heartgold',
    hoenn: 'emerald',
    sinnoh: 'platinum',
    unova: 'black',
  };
  const { state } = await createRun({
    name: 'Badge Ladder',
    region,
    game: gameByRegion[region] ?? 'x',
    players: [{ name: 'ANN', color: '#FFD60A' }],
    rules: { ...DEFAULT_RULES, ...rules },
    online: false,
  });
  return state;
}

describe('normalizeRules — badgesCleared', () => {
  it('defaults to 0 and clamps to 0..8', () => {
    expect(normalizeRules().badgesCleared).toBe(0);
    expect(normalizeRules({ badgesCleared: -3 }).badgesCleared).toBe(0);
    expect(normalizeRules({ badgesCleared: 99 }).badgesCleared).toBe(8);
    expect(normalizeRules({ badgesCleared: 4.7 }).badgesCleared).toBe(5);
  });
});

describe('nextGymInfo', () => {
  it('0 badges → the first gym (Pewter/Brock, Lv.14) in Kanto', async () => {
    const state = await makeRun('kanto');
    const info = nextGymInfo(state);
    expect(info).toEqual({ cap: 14, gymNodeId: 'pewter-city', badgesCleared: 0, badgesTotal: 8 });
  });

  it('advances with badgesCleared — badge conquest order, not map visit order', async () => {
    const state = await makeRun('kanto', { badgesCleared: 1 });
    expect(nextGymInfo(state)).toMatchObject({ cap: 21, gymNodeId: 'cerulean-city', badgesCleared: 1 });
  });

  it('Kanto badge 8 is Viridian (Giovanni) despite being visited early on the map', async () => {
    const state = await makeRun('kanto', { badgesCleared: 7 });
    expect(nextGymInfo(state)).toMatchObject({ cap: 50, gymNodeId: 'viridian-city', badgesCleared: 7 });
  });

  it('Johto: Jasmine (Olivine) before Pryce even though Pryce ace is lower', async () => {
    const state = await makeRun('johto', { badgesCleared: 5 });
    expect(nextGymInfo(state)).toMatchObject({ gymNodeId: 'olivine-city' });
    const afterJasmine = await makeRun('johto', { badgesCleared: 6 });
    expect(nextGymInfo(afterJasmine)).toMatchObject({ gymNodeId: 'mahogany-town' });
  });

  it('Sinnoh uses Platinum badge order (Fantina/Hearthome before Maylene)', async () => {
    const state = await makeRun('sinnoh', { badgesCleared: 2 });
    expect(nextGymInfo(state)).toMatchObject({ gymNodeId: 'hearthome-city' });
  });

  it('all 8 badges cleared → null (postgame, honestly uncapped)', async () => {
    const state = await makeRun('kanto', { badgesCleared: 8 });
    expect(nextGymInfo(state)).toBeNull();
  });

  it('freeform region (no mapped gym ladder) → null, never throws', async () => {
    const state = await makeRun('kalos', { autoLevelCap: true });
    expect(() => nextGymInfo(state)).not.toThrow();
    expect(nextGymInfo(state)).toBeNull();
  });
});

describe('gymCapPreview — wizard preview before a run exists', () => {
  it('mirrors nextGymInfo for a plain region id + badge count', () => {
    expect(gymCapPreview('kanto', 0)).toMatchObject({ cap: 14, gymNodeId: 'pewter-city' });
    expect(gymCapPreview('kanto', 3)).toMatchObject({ gymNodeId: 'celadon-city' });
    expect(gymCapPreview('unknown-region', 0)).toBeNull();
  });
});

describe('RULE_PRESETS (§B1) — only ever toggle switches that already exist', () => {
  it('classic: dupes+shiny+nicknames+releaseOnDeath on, soulLink+autoLevelCap off', () => {
    expect(RULE_PRESETS.classic).toMatchObject({
      dupes: true,
      shiny: true,
      nicknames: true,
      releaseOnDeath: true,
      soulLink: false,
      autoLevelCap: false,
    });
  });

  it('hardcoreLite: classic + autoLevelCap on + badgesCleared reset to 0', () => {
    expect(RULE_PRESETS.hardcoreLite).toMatchObject({
      ...RULE_PRESETS.classic,
      autoLevelCap: true,
      badgesCleared: 0,
    });
  });

  it('soulLink: classic + soulLink + soulLinkCascade on', () => {
    expect(RULE_PRESETS.soulLink).toMatchObject({
      ...RULE_PRESETS.classic,
      soulLink: true,
      soulLinkCascade: true,
    });
  });

  it('every preset only sets keys that exist on NuzRules (no invented fields)', () => {
    const validKeys = new Set(Object.keys(normalizeRules()));
    for (const preset of Object.values(RULE_PRESETS)) {
      for (const key of Object.keys(preset)) expect(validKeys.has(key)).toBe(true);
    }
  });
});

describe('effectiveLevelCap', () => {
  it('manual cap applies when autoLevelCap is off', async () => {
    const state = await makeRun('kanto', { autoLevelCap: false, levelCap: 30 });
    expect(effectiveLevelCap(state)).toBe(30);
  });

  it('auto cap prefers the badge-driven next gym over the manual value', async () => {
    const state = await makeRun('kanto', { autoLevelCap: true, levelCap: 30, badgesCleared: 2 });
    expect(effectiveLevelCap(state)).toBe(24); // Vermilion / Lt. Surge
  });

  it('auto cap is null (no cap) once every badge is cleared', async () => {
    const state = await makeRun('kanto', { autoLevelCap: true, badgesCleared: 8 });
    expect(effectiveLevelCap(state)).toBeNull();
  });

  it('auto cap on a freeform region falls back gracefully to null instead of throwing', async () => {
    const state = await makeRun('kalos', { autoLevelCap: true, badgesCleared: 0 });
    expect(() => effectiveLevelCap(state)).not.toThrow();
    expect(effectiveLevelCap(state)).toBeNull();
  });
});
