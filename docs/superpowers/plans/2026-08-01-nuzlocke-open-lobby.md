# Nuzlocke Open Lobby (Option A) — Implementation Plan

> **For agentic workers:** Execute task-by-task. Do not commit unless the user asks.  
> Product decision is fixed: Open Lobby Option A (no placeholder-seat claim, no shared-editor-without-identity).

**Goal:** Host can start alone with Online + SoulLink; friends join via invite code as next free slot with name/color; own-slot rename; offline multi-crew on one device unchanged.

**Architecture:** Client store remains optimistic + membership-scoped Supabase. Online create inserts only the host `nuz_players` row; join always `INSERT`s a new player at `max(slot)+1` after `nuz_join_by_code` membership. Rename is client-gated to `myPlayerId` (PATCH via existing members-update RLS). No new migration required.

**Tech Stack:** `nuzlocke-store`, Wizard/RunHeader/RulesBar, i18next EN/DE, vitest (solo paths; no live Supabase).

---

### Task 1 — Store: create / join / rename

**Files:**
- Modify: `src/lib/nuzlocke-store.ts`
- Test: `src/lib/nuzlocke-lobby.test.ts` (new)

- [x] **createRun (online):** build full crew for offline; when `cfg.online && isMultiCapable()`, persist/insert **only** `players[0]` (host). Local `RunState.players` matches what was inserted (host-only online).
- [x] **joinRun:** reject if full; slot = lowest free in `0..MAX-1`; keep color de-dupe; return null on insert failure.
- [x] **renamePlayer(runId, playerId, name):** no-op unless `myPlayerId(runId) === playerId`; trim; empty → ignore; local + multi `players().update({ name })`.
- [x] Helpers: `resolveCreateCrew`, `nextPlayerSlot`.

- [x] Tests in `nuzlocke-lobby.test.ts` (helpers, offline multi-crew, rename ownership).

### Task 2 — Wizard SoulLink / Online crew UX

**Files:**
- Modify: `src/pages/nuzlocke/Wizard.tsx`
- Modify: `src/pages/nuzlocke/RulesBar.tsx` (mid-run preset gate)
- i18n: `src/i18n/locales/{en,de}/translation.json`

- [x] SoulLink enabled when `crew.length >= 2 || onlineLobby`.
- [x] Preset `soulLinkDisabled` uses same gate.
- [x] When online lobby: hide Add Player; trim crew to host; hint via invite.
- [x] Offline: Add Player unchanged.
- [x] Join UI blocks at `MAX_PLAYERS` (`failJoinFull`).
- [x] Copy: `soulLinkWait` / `onlineCrewHint` / updated `needsTwo`.

### Task 3 — RunHeader own-slot rename

**Files:**
- Modify: `src/pages/nuzlocke/RunHeader.tsx`
- i18n keys under `nuz.header.*`

- [x] Own player pill → inline rename; others display-only.

### Task 4 — Mid-run RulesBar

- [x] `RulesEditor`: SoulLink preset allowed in multi with 1 player.

### Task 5 — Verify

- [x] `npx tsc -b` clean
- [x] Targeted vitest suites green (49 tests)
- [x] EN/DE key parity
- [x] No commit (unless asked)

### Out of scope

- Claim host-created placeholder seats  
- Shared editor without identity  
- Phase-2.3 Dupes-RPC  
- Tightening RLS update to owned-player-only (would need migration; client gate is enough for Option A)  
- `docs/promo/`
