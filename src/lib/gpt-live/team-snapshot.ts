/** Team snapshot parsing for GPT-Live read-only team tools (browser POST body). */
import { filledSlots, type Team, type TeamSlot } from '@/lib/teambuilder';

export type GptLiveTeamSnapshot = Pick<Team, 'versionGroup' | 'slots'>;

function isTeamSlot(value: unknown): value is TeamSlot {
  if (!value || typeof value !== 'object') return false;
  const row = value as TeamSlot;
  return typeof row.id === 'string' && Array.isArray(row.moves) && row.moves.length === 4;
}

/** Accept a full Team or a minimal { versionGroup, slots } payload from the browser. */
export function parseTeamSnapshot(raw: unknown): GptLiveTeamSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Record<string, unknown>;
  const versionGroup = typeof rec.versionGroup === 'string' ? rec.versionGroup.trim() : '';
  const slotsRaw = rec.slots;
  if (!versionGroup || !Array.isArray(slotsRaw)) return null;
  const slots = slotsRaw.filter(isTeamSlot);
  if (!slots.length) return null;
  return { versionGroup, slots };
}

export function snapshotFilledSlots(snapshot: GptLiveTeamSnapshot): TeamSlot[] {
  return filledSlots({ id: '', name: '', versionGroup: snapshot.versionGroup, slots: snapshot.slots, updatedAt: 0 });
}
