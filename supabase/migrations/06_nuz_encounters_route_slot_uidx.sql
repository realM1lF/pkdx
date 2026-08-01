-- 06_nuz_encounters_route_slot_uidx.sql
-- Partial UNIQUE on slot-consuming encounters so concurrent inserts for the
-- same (run, player, route) cannot both win (TOCTOU). Matches client
-- `isSlotConsuming`: status IS DISTINCT FROM 'duped' AND not shiny
-- (NULL status counts as consuming, same as JS `status !== 'duped'`).
--
-- PostgREST cannot target this partial index with `.upsert({ onConflict })`
-- (postgrest-js#403) — clients keep insert + 23505 reconcile.
--
-- Apply in: Supabase Dashboard → SQL Editor → paste → Run.
-- BEFORE running: verify no full unique on (run_id, player_id, route_key):
--   select indexname, indexdef from pg_indexes where tablename = 'nuz_encounters';
-- Drop any non-partial unique on those three columns first (would block
-- intentional re-catch after duped).
-- Safe to re-run (idempotent).

begin;

-- Hygiene: historical duped rows should never sit in the party.
update public.nuz_encounters
set in_party = false
where status = 'duped'
  and coalesce(in_party, false) = true;

-- Collapse existing duplicates before the unique index can be created.
-- Keep the oldest row per slot; later claims become `duped` (route re-open
-- semantics) so history is preserved and the partial predicate excludes them.
with ranked as (
  select
    id,
    row_number() over (
      partition by run_id, player_id, route_key
      order by created_at asc nulls last, id asc
    ) as rn
  from public.nuz_encounters
  where status is distinct from 'duped'
    and coalesce(is_shiny, false) = false
)
update public.nuz_encounters e
set
  status = 'duped',
  in_party = false
from ranked r
where e.id = r.id
  and r.rn > 1;

create unique index if not exists nuz_encounters_route_slot_uidx
  on public.nuz_encounters (run_id, player_id, route_key)
  where status is distinct from 'duped'
    and coalesce(is_shiny, false) = false;

commit;
