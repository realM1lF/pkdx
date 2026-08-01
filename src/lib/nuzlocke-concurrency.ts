/* Nuzlocke multiplayer concurrency — pure, unit-testable helpers.
 * Architecture (binding, see docs/superpowers/plans/2026-08-01-nuzlocke-multiplayer-concurrency.md):
 * Postgres = source of truth · client = optimistic + outbox · Realtime = fan-out.
 * No CRDT/OT — slot claims must reject, not merge.
 *
 * Phase 1.1 — outbox merge on hydrate (`mergeRemoteWithOutbox`)
 * Phase 1.2 — op-generation / stale retry guard (`nextOpGen` / `isCurrentOp`)
 *             + status monotonicity helper (`isStatusDowngrade`, fully wired in 1.4)
 * Phase 1.3 — Dupes Clause TOCTOU interim (`pickDupeLoser` / `findEvoLineDupeViolations`),
 *             wired into `nuzlocke-store.ts`'s `reconcileEvoLineDupes`
 * Phase 1.4 — realtime apply hygiene: PK dedupe (already in `applyRemoteEncounter`)
 *             + `isStatusDowngrade` now guards every non-outbox remote apply
 * Phase 2.1/2.2 — SoulLink cascade target selection (`livingCascadeTargets`),
 *             mirrored server-side by the `nuz_apply_encounter_status` RPC
 *             (supabase/migrations/07_nuz_apply_encounter_status.sql)
 */
import type { NuzEncounterRow, NuzEncounterStatus } from './supabase';

/* ---------- outbox (Phase 1.1) ---------- */

export type OutboxOpKind = 'insert' | 'patch' | 'delete';

export interface OutboxOp {
  kind: OutboxOpKind;
  /** local value of the row this write is carrying — the merge uses this
   * instead of whatever `refreshRemote` fetched, since the server has either
   * not seen the write yet (insert) or not caught up to it (patch) */
  snapshot: NuzEncounterRow;
  /** opGen this write was enqueued at (informational — the actual stale
   * guard for side-effects lives in `nextOpGen`/`isCurrentOp` below) */
  gen: number;
}

/** Keyed by `enc.id` (== the `syncKey` `persistWithRetry` uses for encounter
 * writes) — one durable entry per row with an unacked write in flight. */
export type Outbox = Map<string, OutboxOp>;

export interface MergeRemoteWithOutboxArgs {
  /** freshly fetched server rows — the base of truth */
  remote: NuzEncounterRow[];
  /** current local mirror; only used as a fallback snapshot source if an
   * outbox entry were ever missing one (defensive, should not happen) */
  localEncounters: NuzEncounterRow[];
  outbox: ReadonlyMap<string, OutboxOp>;
}

export interface MergeRemoteWithOutboxResult {
  encounters: NuzEncounterRow[];
  /** outbox keys the merge kept local data for (still meaningfully pending
   * against this particular server snapshot) */
  keptKeys: string[];
}

/** `refreshRemote`'s merge rule: server rows are the base, but any row with
 * a still-in-flight local write overrides (insert/patch) or excludes
 * (delete) the server value. A blind `state = remote` would otherwise drop
 * optimistic inserts/patches on every hydrate/reconnect before they ack. */
export function mergeRemoteWithOutbox({
  remote,
  localEncounters,
  outbox,
}: MergeRemoteWithOutboxArgs): MergeRemoteWithOutboxResult {
  const localById = new Map(localEncounters.map((e) => [e.id, e]));
  const keptKeys: string[] = [];
  const merged: NuzEncounterRow[] = [];

  for (const row of remote) {
    const op = outbox.get(row.id);
    if (!op) {
      merged.push(row);
      continue;
    }
    keptKeys.push(row.id);
    if (op.kind === 'delete') continue; /* pending delete — drop the server row too */
    merged.push(op.snapshot ?? localById.get(row.id) ?? row);
  }

  /* pending inserts the server hasn't produced a row for yet */
  const seen = new Set(merged.map((e) => e.id));
  for (const [id, op] of outbox) {
    if (seen.has(id) || op.kind !== 'insert') continue;
    const snapshot = op.snapshot ?? localById.get(id);
    if (!snapshot) continue;
    merged.push(snapshot);
    keptKeys.push(id);
  }

  return { encounters: merged, keptKeys };
}

/* ---------- op generation / stale retry guard (Phase 1.2) ---------- */

export type OpGenMap = Map<string, number>;

/** Allocate the next generation for `syncKey` and record it as current.
 * Call once per write attempt (not per retry step) so a newer write always
 * outranks an older one still retrying in the background. */
export function nextOpGen(map: OpGenMap, syncKey: string): number {
  const gen = (map.get(syncKey) ?? 0) + 1;
  map.set(syncKey, gen);
  return gen;
}

/** Whether `gen` is still the most recent write enqueued for `syncKey`.
 * `false` means a newer write has since superseded it, so this one's
 * success/failure side effects (clearing pending, toasting) must be skipped —
 * only the current generation may touch shared state. */
export function isCurrentOp(map: OpGenMap, syncKey: string, gen: number): boolean {
  return (map.get(syncKey) ?? 0) === gen;
}

/* ---------- status monotonicity (Phase 1.2, fully wired in 1.4) ---------- */

/** Finality rank — higher = harder to walk back. `dead`/`lost` are terminal;
 * a stale or out-of-order apply must never silently downgrade one back to
 * `caught` (or any less-final state). */
const STATUS_RANK: Record<NuzEncounterStatus, number> = {
  caught: 0,
  missed: 1,
  duped: 1,
  lost: 2,
  dead: 3,
};

/** True when `next` is less final than `prev` (e.g. `dead` → `caught`) — the
 * signal a stale/out-of-order write should not be allowed to win. */
export function isStatusDowngrade(prev: NuzEncounterStatus, next: NuzEncounterStatus): boolean {
  return STATUS_RANK[next] < STATUS_RANK[prev];
}

/* ---------- SoulLink cascade target selection (Phase 2.1/2.2) ----------
 * The exact partner set a death/miss cascade must touch: every OTHER
 * player's still-`caught` encounter on the same route. Both the client
 * cascade (`checkCascade`/`checkMissCascade` in nuzlocke-store.ts) and the
 * server RPC (`nuz_apply_encounter_status`) implement this same rule
 * independently — kept here as one pure, unit-testable definition so the
 * client side of it isn't only exercised indirectly through the store. */
export function livingCascadeTargets(
  encounters: NuzEncounterRow[],
  trigger: Pick<NuzEncounterRow, 'id' | 'route_key' | 'player_id'>,
): NuzEncounterRow[] {
  return encounters.filter(
    (e) =>
      e.id !== trigger.id &&
      e.route_key === trigger.route_key &&
      e.player_id !== trigger.player_id &&
      e.status === 'caught',
  );
}

/* ---------- Dupes Clause TOCTOU interim (Phase 1.3) ----------
 * `validateLogDraft`'s evo-line check (nuzlocke-rules.ts) only sees rows the
 * client already knows about. Two players who each pass that check within
 * the same network round trip — plain latency, no malice — can still land
 * two 'caught' rows in the same evolution family before either client learns
 * about the other's write. Closing this for real needs a server-side
 * transaction (an RPC that validates the family inside the same TX as the
 * insert — plan Phase 2 §2.3); until then, `nuzlocke-store.ts` re-runs this
 * scan after every insert either client learns about (its own ack, every
 * remote realtime catch) and downgrades the loser to `duped` client-side. */

/** Deterministic tie-break for two `caught` rows that turned out to collide
 * on the same evolution family: the later `created_at` loses (Dupes Clause
 * is first-come); a dead-heat tie (identical timestamp) falls back to the
 * larger id string. Every online client computes this from the same synced
 * `created_at`/`id` fields, so all of them agree on the same loser without
 * coordinating — whichever client's write lands first, the other's is a
 * harmless no-op PATCH to the same value. */
export function pickDupeLoser(a: NuzEncounterRow, b: NuzEncounterRow): NuzEncounterRow {
  if (a.created_at !== b.created_at) return a.created_at > b.created_at ? a : b;
  return a.id > b.id ? a : b;
}

/** Scan every living (`caught`, non-shiny — shinies are clause-free)
 * encounter for evolution-family collisions and return the rows that must be
 * downgraded to `duped`. `familyOf(pokemonId)` should read the same sync
 * cache `fetchEvolutionFamilyIds` populates (`cachedEvolutionFamilyIds` in
 * nuzlocke-evolution.ts) — a species with no cache entry yet degrades to a
 * singleton family, which still catches an exact-species dupe (same id) and
 * simply defers a cross-stage dupe (e.g. Schiggy vs. Schillok) until that
 * species' family has been fetched at least once (the caller fetches the
 * trigger row's family right before calling this). */
export function findEvoLineDupeViolations(
  encounters: NuzEncounterRow[],
  familyOf: (pokemonId: number) => number[] | undefined,
): NuzEncounterRow[] {
  const living = encounters.filter((e) => e.status === 'caught' && !e.is_shiny);
  const winnerByFamily = new Map<number, NuzEncounterRow>();
  const losers: NuzEncounterRow[] = [];
  for (const e of living) {
    const speciesId =
      typeof e.caught_pokemon_id === 'number' && e.caught_pokemon_id > 0 ? e.caught_pokemon_id : e.pokemon_id;
    const family = familyOf(speciesId) ?? familyOf(e.pokemon_id) ?? [speciesId];
    const key = Math.min(...family);
    const incumbent = winnerByFamily.get(key);
    if (!incumbent) {
      winnerByFamily.set(key, e);
      continue;
    }
    const loser = pickDupeLoser(incumbent, e);
    winnerByFamily.set(key, loser === incumbent ? e : incumbent);
    losers.push(loser);
  }
  return losers;
}
