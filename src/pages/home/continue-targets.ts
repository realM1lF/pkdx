export type ContinueKind = 'run' | 'team';

export interface ContinueTarget {
  kind: ContinueKind;
  to: string;
  name: string;
  partyIds: number[];
}

export interface ContinueRunSource {
  id: string;
  name: string;
  partyIds?: number[];
}

export interface ContinueTeamSource {
  id: string;
  name: string;
  updatedAt?: number;
  partyIds?: number[];
}

export function continueTargets(input: {
  run?: ContinueRunSource | null;
  draft?: ContinueTeamSource | null;
  teams?: ContinueTeamSource[];
}): ContinueTarget[] {
  const out: ContinueTarget[] = [];
  if (input.run) {
    out.push({
      kind: 'run',
      to: `/nuzlocke/${input.run.id}`,
      name: input.run.name,
      partyIds: input.run.partyIds ?? [],
    });
  }
  const team = pickContinueTeam(input.draft, input.teams);
  if (team) {
    out.push({
      kind: 'team',
      to: `/team/${team.id}`,
      name: team.name,
      partyIds: team.partyIds ?? [],
    });
  }
  return out;
}

function pickContinueTeam(
  draft?: ContinueTeamSource | null,
  teams?: ContinueTeamSource[],
): ContinueTeamSource | null {
  if (draft) return draft;
  if (!teams?.length) return null;
  return teams.reduce((best, t) => ((t.updatedAt ?? 0) > (best.updatedAt ?? 0) ? t : best));
}
