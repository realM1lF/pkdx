# Nuzlocke Live Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Nuzlocke runs account-centric and live across devices: the hub discovers all runs of the logged-in user, run lifecycle (create/update/delete/archive) propagates in realtime, and localStorage is only an offline cache — never the source of truth.

**Architecture:** Keep the existing `RunEntry`/`goLive` realtime per run. Add an **account-level discovery layer** that loads `nuz_run_members` for the user and subscribes to membership + run changes. Solo runs of logged-in users are upserted into `nuz_runs` (owner membership) so they appear on every device; `nuz_solo_runs` remains for guests only. Archive state moves to `nuz_run_members.archived`. Deleting a run deletes the server row (owner) or the membership (member), and realtime removes it everywhere.

**Tech Stack:** React 19, TypeScript, Supabase (Postgres + Realtime), localStorage as cache.

---

### Task 1: Account run discovery + live membership sync

**Files:**
- Modify: `src/lib/nuzlocke-store.ts` (`hubRefresh`, `useHubRuns`, new `syncAccountRuns`, `watchAccountRuns`)
- Modify: `src/lib/cloud-sync.ts` (call account sync on auth change; stop offering migration for logged-in users)
- Test: `src/lib/nuzlocke-account-sync.test.ts`

**Context:** The hub currently only reads `readRunIndex()` (localStorage). We need it to also load the user's runs from Supabase and keep them in sync live.

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/nuzlocke-account-sync.test.ts
// - logged-in user: hub lists runs from nuz_run_members even if not in localStorage
// - realtime INSERT on nuz_run_members adds run to hub
// - realtime DELETE on nuz_run_members removes run from hub
// - realtime UPDATE on nuz_runs (name/status/rules) refreshes run in hub
// - guest: no account sync, localStorage only
```

- [ ] **Step 2: Implement account discovery**

In `nuzlocke-store.ts`:
- Add `syncAccountRuns(userId)`: fetch `nuz_run_members` joined with `nuz_runs`, for each `ensureEntry(id)` + `refreshRemote`, then `notifyHub()`.
- Add `watchAccountRuns(userId)`: Supabase channel on `nuz_run_members` (INSERT/DELETE/UPDATE) and `nuz_runs` (UPDATE/DELETE) filtered to the user's runs; on change re-run `syncAccountRuns`.
- Call both from `bootCloudSync` / auth change when `getAuthUser()` is present.
- `hubRefresh()` must merge: localStorage index + account-discovered ids.

- [ ] **Step 3: Run tests, commit**

---

### Task 2: Solo runs live in `nuz_runs` for logged-in users

**Files:**
- Modify: `src/lib/nuzlocke-store.ts` (`saveLocalRun`, `createRun`, `goOnline`)
- Modify: `src/lib/cloud-sync.ts` (`cloudPushSoloRun`, `hydrateSoloRuns`)
- Test: `src/lib/nuzlocke-solo-cloud.test.ts`

**Context:** Solo runs currently only mirror to `nuz_solo_runs`. For logged-in users they must be real `nuz_runs` rows with owner membership so they appear on every device.

- [ ] **Step 1: Write failing tests**

```ts
// - createRun (solo, logged in) writes nuz_runs + nuz_run_members owner
// - saveLocalRun on solo run upserts nuz_runs when logged in
// - hydrateSoloRuns returns [] for logged-in users (no migration offer)
// - guest solo run still writes nuz_solo_runs
```

- [ ] **Step 2: Implement**

- `saveLocalRun`: if `getAuthUser()` and state.mode === 'solo', upsert into `nuz_runs` (id, name, game, region, rules, status, invite_code null) + ensure `nuz_run_members` owner row; skip `nuz_solo_runs`.
- `createRun`: when logged in and solo, also insert `nuz_runs` + membership.
- `hydrateSoloRuns`: if user is logged in, return [] (no migration offer); only guests use `nuz_solo_runs`.
- Keep `nuz_solo_runs` path for guests.

- [ ] **Step 3: Run tests, commit**

---

### Task 3: Server-side delete + archive sync

**Files:**
- Modify: `src/lib/nuzlocke-store.ts` (`deleteRunForever`, `archiveRun`, `restoreRun`)
- Modify: `src/lib/cloud-sync.ts` (`cloudDeleteSoloRun` stays for guests)
- Test: `src/lib/nuzlocke-lifecycle.test.ts`

**Context:** Delete must remove the run for everyone (owner) or just for me (member). Archive must sync across my devices.

- [ ] **Step 1: Write failing tests**

```ts
// - owner deleteRunForever deletes nuz_runs row (cascade) → realtime removes it on all devices
// - member deleteRunForever deletes own nuz_run_members row → run disappears for me only
// - archiveRun sets nuz_run_members.archived = true → hidden on all my devices
// - restoreRun sets archived = false
// - reconcileRunIndex does NOT resurrect a run deleted on server
```

- [ ] **Step 2: Implement**

- `deleteRunForever`: if multi or logged-in solo → owner: `nuz_runs.delete()`; member: `nuz_run_members.delete().eq('run_id', id).eq('user_id', user.id)`. Always also local cleanup. Guests keep `cloudDeleteSoloRun`.
- `archiveRun`/`restoreRun`: write `archived` flag to `nuz_run_members` when logged in; keep localStorage as cache.
- `reconcileRunIndex`: skip ids that are in the account's remote deleted set (track tombstones in memory from realtime DELETE).

- [ ] **Step 3: Run tests, commit**

---

### Task 4: Remove migration popup for logged-in users

**Files:**
- Modify: `src/lib/cloud-sync.ts` (`maybeOffer`, `bootCloudSync`)
- Modify: `src/components/MigrationDialog.tsx` (only show for guests)
- Test: `src/lib/cloud-sync-migration.test.ts`

**Context:** Logged-in users must never see "localStorage in Cloud einspielen?" — hydration is silent.

- [ ] **Step 1: Write failing tests**

```ts
// - logged-in user with local runs: maybeOffer is NOT called
// - guest with local runs: maybeOffer IS called
```

- [ ] **Step 2: Implement**

- `bootCloudSync`: on auth change, if user → `hydrateTeams` + `syncAccountRuns` silently; only call `maybeOffer` when `!getAuthUser()`.
- `MigrationDialog`: only render when there is no logged-in user.

- [ ] **Step 3: Run tests, commit**

---

### Task 5: Final integration + regression check

**Files:**
- Modify: `src/lib/nuzlocke-store.ts` (wire everything, cleanup)
- Test: run full `npx vitest run src/lib` + `npx tsc -b`

- [ ] **Step 1:** Ensure all tasks merged, no circular imports, hub updates live.
- [ ] **Step 2:** Run full test suite + typecheck.
- [ ] **Step 3:** Commit final integration.
