import { describe, expect, it } from 'vitest';
import { continueTargets } from './continue-targets';

describe('continueTargets', () => {
  it('no data → []', () => {
    expect(continueTargets({})).toEqual([]);
    expect(continueTargets({ run: null, draft: null, teams: [] })).toEqual([]);
  });

  it('only run → one item linking to /nuzlocke/:id', () => {
    expect(
      continueTargets({
        run: { id: 'run-kanto', name: 'SoulLink Kanto', partyIds: [1, 4] },
      }),
    ).toEqual([
      {
        kind: 'run',
        to: '/nuzlocke/run-kanto',
        name: 'SoulLink Kanto',
        partyIds: [1, 4],
      },
    ]);
  });

  it('only team → one item linking to /team (draft wins over saved)', () => {
    expect(
      continueTargets({
        draft: { name: 'OU Draft', partyIds: [6], updatedAt: 1 },
        teams: [{ name: 'Older Save', partyIds: [25], updatedAt: 99 }],
      }),
    ).toEqual([
      {
        kind: 'team',
        to: '/team',
        name: 'OU Draft',
        partyIds: [6],
      },
    ]);

    expect(
      continueTargets({
        teams: [
          { name: 'Old', partyIds: [7], updatedAt: 10 },
          { name: 'Newest', partyIds: [150], updatedAt: 50 },
        ],
      }),
    ).toEqual([
      {
        kind: 'team',
        to: '/team',
        name: 'Newest',
        partyIds: [150],
      },
    ]);
  });

  it('both → two items (run then team)', () => {
    const targets = continueTargets({
      run: { id: 'abc', name: 'Hoenn', partyIds: [258] },
      draft: { name: 'VGC', partyIds: [445] },
    });
    expect(targets).toHaveLength(2);
    expect(targets[0]).toMatchObject({ kind: 'run', to: '/nuzlocke/abc', name: 'Hoenn' });
    expect(targets[1]).toMatchObject({ kind: 'team', to: '/team', name: 'VGC' });
  });
});
