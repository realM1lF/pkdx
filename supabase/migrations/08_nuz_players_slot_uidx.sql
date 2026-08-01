-- 08_nuz_players_slot_uidx.sql
-- Phase 2.4 (concurrency plan) — a join race (two browsers hitting "join"
-- for the same run at nearly the same instant) could previously hand out
-- the same `slot` to two different players; slot drives sort order,
-- presence coloring and the SoulLink pairing logic
-- (soulLinkMembersByRoute in nuzlocke-store.ts sorts by slot), so a
-- collision there is a real correctness bug, not just cosmetic.
--
-- Same pattern as 06_nuz_encounters_route_slot_uidx.sql: dedupe first
-- (only rows that actually collide are touched — the earliest joiner per
-- (run_id, slot) keeps its original slot number), then the UNIQUE index
-- makes any future concurrent insert fail loudly (23505) instead of
-- silently duplicating a slot.
--
-- Apply in: Supabase Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (idempotent).

begin;

-- Shift only the LATER row(s) of any (run_id, slot) collision to a fresh
-- slot beyond the run's current max — the earliest joiner is left alone
-- so existing colors/ordering for the common (non-colliding) case never
-- change under this migration.
with dup as (
  select
    id,
    run_id,
    slot,
    row_number() over (
      partition by run_id, slot
      order by created_at asc nulls last, id asc
    ) as rn
  from public.nuz_players
),
maxslot as (
  select run_id, max(slot) as mx from public.nuz_players group by run_id
)
update public.nuz_players p
set slot = m.mx + d.rn - 1
from dup d
join maxslot m on m.run_id = d.run_id
where p.id = d.id
  and d.rn > 1;

create unique index if not exists nuz_players_run_slot_uidx
  on public.nuz_players (run_id, slot);

commit;

-- =====================================================================
-- Post-check (read-only, run separately):
--
--   select indexname, indexdef from pg_indexes where tablename = 'nuz_players';
--
--   -- must return zero rows:
--   select run_id, slot, count(*) from public.nuz_players
--   group by run_id, slot having count(*) > 1;
-- =====================================================================
