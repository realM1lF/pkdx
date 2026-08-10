# Nuzlocke ↔ Linked Teams + Evolution

Status: approved (2026-08-01)  
Scope: per-player Team Builder teams linked to a Nuzlocke run; caught vs current species for evolutions.

## Goals

1. Creating/joining a run ensures **one Team Builder team per player**, named `{runName} — {playerName}`.
2. Linked team **roster = that player's active party** (max 6). Box does not appear as TB slots.
3. Linked team is a **full set editor** (level, ability, moves, item, nature, EVs) but **roster/species are locked** (come from the run).
4. Evolution happens **only in Nuzlocke**. Timeline/route shows the **caught** species; Team/Box/Versus/linked TB show the **current** species.
5. **Edit ownership:** online (`multi`) → only `myPlayerId` may edit that player's linked team. Solo (couch on one device) → any local player's linked team is editable.
6. **No login required.** Soft UX hint for online runs. Mid-run account creation must not break links.

## Non-goals

- Mega/form change as a separate flow (same mechanism as evolution later if needed).
- Sharing another player's full set across accounts (sets stay on that player's TB storage).
- Changing the TB 6-slot shape.

## Data model

### Encounter (`NuzEncounterRow`)

| Field | Meaning |
|---|---|
| `caught_pokemon_id` | Species logged at catch time. Immutable after create. Timeline/route display. |
| `pokemon_id` | **Current** species (post-evolution). Team, Box, Versus, linked TB. |
| `level`, `nickname`, `status`, `in_party`, `is_shiny`, … | Unchanged semantics. |

**Migration / normalize:** if `caught_pokemon_id` missing → treat as `pokemon_id` and persist on next write.

**Dupes clause:** evolution-family, run-wide — claiming rows (default: living
`caught`; optional `dupesDead` / `dupesEncounter`) whose
`pokemon_id` or `caught_pokemon_id` shares the candidate's evo line blocks the
catch (Schiggy → blocks Schillok/Turtok for everyone). Shiny clause still bypasses.

### Team (`Team` in teambuilder)

New optional link fields:

```ts
linkedRunId?: string;
linkedPlayerId?: string;
```

`TeamSlot` gains:

```ts
encounterId?: string | null; // stable join key for set preservation
```

Version group is forced from `versionGroupForGame(run.game)` when linked.

### Source of truth

| Concern | SoT | Mirror |
|---|---|---|
| Party roster / death / box | Encounter (`in_party`, `status`) | Linked team slots projected |
| Caught vs current species | Encounter | TB slot species from `pokemon_id` |
| Level | Encounter | Dual-write to TB slot on edit either side |
| Moves / ability / item / nature / EVs | Linked Team slot (keyed by `encounterId`) | — |

## Lifecycle

### createRun / joinRun

- After players exist + membership set: `ensureLinkedTeams(runState)`.
- Idempotent: find existing team by `(linkedRunId, linkedPlayerId)`; create if missing; repair name/VG.
- Join mid-run: only ensures **my** player team (and repair others as read-only projections when state is visible locally).

### Party sync (`syncLinkedTeamRoster`)

Triggered after: log, update status, party DnD, swap, evolve, remote encounter apply (local viewer).

Algorithm:

1. `party = partyOf(state, playerId)` (ordered).
2. Load linked team; keep a map `encounterId → previous slot set fields`.
3. Rebuild 6 slots: for each party member, reuse prior set by `encounterId` if present; else empty set with species/level/nickname/shiny from encounter.
4. Clear leftover slots.
5. `saveTeam` (and draft if currently open).

Boxing preserves set data inside the team's unused… **No** — boxed mons leave the 6 slots. Preserve sets in a side map on the team:

```ts
// on Team
linkedSetBag?: Record<encounterId, CompactSlotSet>;
```

When leaving party → stash set into `linkedSetBag[encounterId]`.  
When returning → restore from bag.  
On permanent delete of encounter → drop bag entry.

### Evolution

- API: `evolveEncounter(runId, encId, toPokemonId)`.
- Validates `toPokemonId` is in the evolution chain of `caught_pokemon_id` (or current chain reachable from caught).
- Sets `pokemon_id = toPokemonId`; does **not** change `caught_pokemon_id`.
- UI: EncounterMenu → “Evolve…” picker (chain nodes ≠ current).
- Timeline sprites/labels use `caught_pokemon_id`; TeamGrid/Box use `pokemon_id`.

### Level edits

- Nuzlocke UI: allow level edit on encounter (party/box menu or inline).
- TB SlotEditor level → `updateEncounter({ level })` then slot mirror.
- Cap / auto level-cap rules unchanged.

## Auth & edge cases

| Case | Behaviour |
|---|---|
| Guest solo | Linked teams in `pdx2.teams` local only. |
| Guest multi | Anonymous identity for run membership (existing). Linked team local to that browser/`myPlayerId`. |
| Account created mid-run | `bootCloudSync` / hydrate: linked teams keep same `id`; LWW merge by `updatedAt`. Membership `pdx2.nuz.memberships` unchanged. Solo run cloud push already exists — keep `linked*` fields inside team payload. |
| Login on second device | Cloud hydrate teams + solo runs; `ensureLinkedTeams` after hydrate repairs missing links. Multi: re-join/claim access via invite if needed (existing `ensureRunAccess`). |
| Storage cleared | Multi: re-claim via invite code; `ensureLinkedTeams` recreates empty linked teams; sets lost unless cloud had them. |
| Archive run | Linked teams remain but marked/read-only OR stay editable sets with roster frozen — **decision: keep teams, stop auto party sync, badge “archived run”**. Restore re-enables sync. |
| Delete run forever | Delete linked teams for that `linkedRunId` (local + cloudDeleteTeam when authed). |
| Duplicate solo run | New run ids + new linked teams; copy encounters with new ids; copy set bag keyed by new encounter ids when possible. |
| Rename run/player | Update linked team names on next `ensureLinkedTeams` / rename hooks. |
| Import `?fromRun=` | Prefer opening the linked team for `myPlayerId` instead of snapshot-duplicating; if missing, ensure then open. |

## UI

### Nuzlocke

- TeamGrid: show current species; optional small “caught: X” if evolved.
- EncounterMenu: Evolve, Edit level.
- Timeline: always caught species.
- Soft hint in Wizard for online: account recommended (i18n).

### Team Builder

- Hub: badge “Nuzlocke” on linked teams; link back to `/nuzlocke/:runId`.
- Open linked team: lock species picker / remove / duplicate-as-free; allow full set fields.
- Foreign multi team (not `myPlayerId`): open read-only.
- Clear-team / randomize roster actions disabled when linked.

## i18n

All new strings in EN + DE (`nuz.evolve.*`, `tb.linked.*`, wizard soft hint). German: official terms, no du-form.

## Testing

1. normalizeEncounter backfill.
2. evolveEncounter: timeline vs party ids; rejects off-chain.
3. ensureLinkedTeams idempotent; one team per player.
4. roster sync + set bag survives box trip.
5. multi edit guard vs solo couch.
6. deleteRunForever removes linked teams.
7. level dual-write.

## Security

- No `using (true)` policies.
- Encounter column `caught_pokemon_id` needs Supabase migration (nullable int, client backfill).
- RLS unchanged (membership-scoped writes).
