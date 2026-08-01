# Nuzlocke Linked Teams + Evolution — Implementation Plan

> **For agentic workers:** Execute task-by-task. Do not commit unless the user asks.

**Goal:** Per-player linked TB teams synced from Nuzlocke parties, plus caught vs current species for evolutions, with auth/mid-run edge cases covered.

**Architecture:** Hybrid SoT — encounter owns identity/party/level/evolution; linked `Team` owns battle sets keyed by `encounterId` (+ `linkedSetBag` for boxed). `ensureLinkedTeams` + `syncLinkedTeamRoster` on lifecycle events.

**Tech Stack:** Existing React/TS store, teambuilder localStorage + cloud-sync, Supabase encounters, vitest.

---

### Task 1 — Encounter model + normalize + evolve API
- [x] Extend `NuzEncounterRow` with `caught_pokemon_id?: number`
- [x] `normalizeEncounter` / apply on load + log
- [x] `evolveEncounter` + chain validation helper
- [x] Tests in new `nuzlocke-evolution.test.ts`
- [x] Supabase migration SQL for column

### Task 2 — Linked team model + sync helpers
- [x] Extend `Team` / `TeamSlot` in teambuilder.ts
- [x] `ensureLinkedTeams`, `syncLinkedTeamRoster`, `findLinkedTeam`, `canEditLinkedTeam`, `deleteLinkedTeamsForRun`
- [x] Unit tests `nuzlocke-linked-teams.test.ts`

### Task 3 — Wire store lifecycle
- [x] createRun / joinRun → ensure
- [x] log/update/party/swap/evolve/remote apply → sync
- [x] archive freeze / restore / deleteForever cleanup
- [x] duplicateAsSolo copies links+sets
- [x] Account hydrate: ensure after cloud boot

### Task 4 — Nuzlocke UI evolution + level
- [x] EncounterMenu evolve + level
- [x] Timeline uses caught id; Team/Box current id
- [x] i18n EN/DE

### Task 5 — Team Builder UI locks + hub
- [x] Roster lock when linked
- [x] Read-only when multi && !mine
- [x] Hub badge + deep link; fromRun opens linked team
- [x] i18n EN/DE

### Task 6 — Verify
- [x] vitest targeted suites green
- [x] `npx tsc -b` clean
