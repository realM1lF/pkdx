-- =====================================================================
-- 03_harden_insert_visibility.sql
--
-- Follow-up to stage 2. Two small things, both safe to run at any time:
--
--   1. Closes a latent trap. The membership that lets you read your own run
--      is created by an AFTER INSERT trigger, but PostgREST evaluates
--      RETURNING *before* AFTER triggers fire. So today this works:
--          supabase.from('nuz_runs').insert(row)              -- return=minimal
--      and this would fail with 403:
--          supabase.from('nuz_runs').insert(row).select()     -- RETURNING
--      The app only uses the first form, so nothing is broken right now —
--      but the next person to add .select() would hit a confusing failure.
--      Stamping owner_id in a BEFORE trigger and allowing owners in the
--      select policy makes both forms work.
--
--   2. Deletes the leftover diagnostic run from the security audit.
--
-- No frontend change or redeploy is needed.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Stamp the creator into owner_id (BEFORE INSERT, so it is visible to
--    RETURNING). A BEFORE trigger cannot write nuz_run_members instead,
--    because that table's foreign key needs the run row to exist first.
-- ---------------------------------------------------------------------
create or replace function public.nuz_runs_stamp_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_runs_stamp_owner_trg on public.nuz_runs;
create trigger nuz_runs_stamp_owner_trg
  before insert on public.nuz_runs
  for each row execute function public.nuz_runs_stamp_owner();

-- ---------------------------------------------------------------------
-- 2. Let the recorded owner read/update/delete the run even before the
--    membership row exists. Membership stays the general mechanism; this
--    is only about the creating statement itself.
-- ---------------------------------------------------------------------
drop policy if exists "runs: members read"   on public.nuz_runs;
drop policy if exists "runs: members update" on public.nuz_runs;
drop policy if exists "runs: owner deletes"  on public.nuz_runs;

create policy "runs: members read"
  on public.nuz_runs for select
  using (owner_id = auth.uid() or public.nuz_is_member(id));

create policy "runs: members update"
  on public.nuz_runs for update
  using (owner_id = auth.uid() or public.nuz_is_member(id))
  with check (owner_id = auth.uid() or public.nuz_is_member(id));

create policy "runs: owner deletes"
  on public.nuz_runs for delete
  using (owner_id = auth.uid() or public.nuz_is_owner(id));

-- ---------------------------------------------------------------------
-- 3. Remove the audit leftovers.
-- ---------------------------------------------------------------------
delete from public.nuz_encounters
  where run_id in (select id from public.nuz_runs where invite_code in ('SOUL-DIAG01', 'ZZZZ-AUDIT-ARTEFAKT-NICHT-BEITRETEN'));
delete from public.nuz_players
  where run_id in (select id from public.nuz_runs where invite_code in ('SOUL-DIAG01', 'ZZZZ-AUDIT-ARTEFAKT-NICHT-BEITRETEN'));
delete from public.nuz_run_members
  where run_id in (select id from public.nuz_runs where invite_code in ('SOUL-DIAG01', 'ZZZZ-AUDIT-ARTEFAKT-NICHT-BEITRETEN'));
delete from public.nuz_runs
  where invite_code in ('SOUL-DIAG01', 'ZZZZ-AUDIT-ARTEFAKT-NICHT-BEITRETEN');

commit;

-- =====================================================================
-- Inventory afterwards — anon can no longer list runs, so this is the
-- only way to see what is in there. Run it separately:
--
--   select r.id, r.name, r.invite_code, r.status, r.owner_id,
--          (select count(*) from public.nuz_players p where p.run_id = r.id)    as players,
--          (select count(*) from public.nuz_encounters e where e.run_id = r.id) as encounters,
--          (select count(*) from public.nuz_run_members m where m.run_id = r.id) as members
--   from public.nuz_runs r
--   order by r.created_at;
--
-- Expect 20 legacy runs, none named "diag" or "AUDIT-ARTEFAKT".
-- =====================================================================
