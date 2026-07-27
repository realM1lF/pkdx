-- 04_nuz_encounters_status_lost.sql
-- Adds the encounter status 'lost' (SoulLink link-lost: the linked partner
-- missed the route, so this catch is unusable WITHOUT being dead).
-- 'lost' is used by the SoulLink missed cascade (nuzlocke-store.ts,
-- checkMissCascade + isRouteLinkLocked). KPIs count it as neither dead nor
-- missed; the UI shows it in the unified box with a "link-lost" badge.
--
-- The existing CHECK constraint nuz_encounters_status_chk (added NOT VALID in
-- 01_prepare_nuzlocke_rls.sql) only allows ('caught','dead','missed','duped')
-- and would reject the cascade writes. Postgres cannot alter a CHECK in
-- place, so drop + re-create NOT VALID (existing rows are never re-checked),
-- then validate.

begin;

alter table public.nuz_encounters
  drop constraint if exists nuz_encounters_status_chk;

alter table public.nuz_encounters
  add constraint nuz_encounters_status_chk
  check (status in ('caught', 'dead', 'missed', 'duped', 'lost')) not valid;

alter table public.nuz_encounters
  validate constraint nuz_encounters_status_chk;

commit;
