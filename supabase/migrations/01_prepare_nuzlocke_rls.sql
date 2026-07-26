-- =====================================================================
-- 01_prepare_nuzlocke_rls.sql
--
-- STAGE 1 of 2 — purely ADDITIVE. Running this changes no visible
-- behaviour: it only creates helper functions, a trigger, two RPCs, a
-- unique index and value constraints. The permissive policies that
-- currently allow anonymous full access stay untouched, so the live site
-- keeps working exactly as before.
--
-- Apply in: Supabase Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (idempotent).
--
-- STAGE 2 (02_enforce_nuzlocke_rls.sql) is the one that actually locks
-- things down. Do not run it before the checklist in that file is done.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Membership helpers
--
-- These are SECURITY DEFINER so they can read nuz_run_members without
-- being subject to that table's own policies. That is what breaks the
-- "infinite recursion detected in policy for relation nuz_run_members"
-- error (42P17): previously a policy on the table queried the table.
--
-- search_path is pinned to '' and every reference fully qualified —
-- without that, a SECURITY DEFINER function can be hijacked by a caller
-- who puts a lookalike table earlier in their search_path.
-- ---------------------------------------------------------------------

create or replace function public.nuz_is_member(p_run_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.nuz_run_members m
    where m.run_id = p_run_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.nuz_is_owner(p_run_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.nuz_run_members m
    where m.run_id = p_run_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  );
$$;

comment on function public.nuz_is_member(uuid) is
  'True when the calling user (incl. anonymous sessions) is a member of the run. Used by every nuz_* RLS policy.';

-- ---------------------------------------------------------------------
-- 2. Creating a run makes you its owner, automatically
--
-- Without this the creator would insert a run row and then be unable to
-- read it back under the stage-2 policies. The trigger closes that gap
-- so createRun() in src/lib/nuzlocke-store.ts needs no changes.
-- ---------------------------------------------------------------------

create or replace function public.nuz_runs_grant_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null then
    insert into public.nuz_run_members (run_id, user_id, role)
    values (new.id, auth.uid(), 'owner')
    on conflict (run_id, user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_runs_grant_owner_trg on public.nuz_runs;
create trigger nuz_runs_grant_owner_trg
  after insert on public.nuz_runs
  for each row execute function public.nuz_runs_grant_owner();

-- ---------------------------------------------------------------------
-- 3. Joining by invite code — the only way to gain access to someone
--    else's run.
--
-- SECURITY DEFINER on purpose: under stage-2 policies a non-member
-- cannot select from nuz_runs at all, so the lookup has to happen inside
-- a trusted function. Knowing the code is the credential; the function
-- records the membership and returns the run plus its players.
--
-- Note the deliberate absence of any way to list or search runs.
-- ---------------------------------------------------------------------

create or replace function public.nuz_join_by_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.nuz_runs;
  v_players jsonb;
begin
  if p_code is null or length(btrim(p_code)) = 0 then
    return null;
  end if;

  select * into v_run
  from public.nuz_runs
  where invite_code = upper(btrim(p_code));

  if not found then
    return null;
  end if;

  -- anonymous sessions count as identities here; guests must be signed in
  -- anonymously for multiplayer to work under stage-2 policies
  if auth.uid() is not null then
    insert into public.nuz_run_members (run_id, user_id, role)
    values (v_run.id, auth.uid(), 'member')
    on conflict (run_id, user_id) do nothing;
  end if;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.slot), '[]'::jsonb)
  into v_players
  from public.nuz_players p
  where p.run_id = v_run.id;

  return jsonb_build_object('run', to_jsonb(v_run), 'players', v_players);
end;
$$;

comment on function public.nuz_join_by_code(text) is
  'Redeem an invite code: records membership for the caller and returns {run, players}. Returns null for unknown codes.';

-- ---------------------------------------------------------------------
-- 4. Re-claiming a run you already have locally
--
-- Existing runs were created before memberships existed (all 20 rows had
-- owner_id null). Clients still hold the invite code in localStorage, so
-- they can re-establish access on boot. Same for anonymous sessions that
-- were lost when a browser cleared storage.
-- ---------------------------------------------------------------------

create or replace function public.nuz_claim_access(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_has_members boolean;
begin
  if p_code is null or auth.uid() is null then
    return null;
  end if;

  select id into v_id
  from public.nuz_runs
  where invite_code = upper(btrim(p_code));

  if v_id is null then
    return null;
  end if;

  select exists (select 1 from public.nuz_run_members where run_id = v_id)
  into v_has_members;

  -- first claimant of a legacy run becomes its owner, later ones members
  insert into public.nuz_run_members (run_id, user_id, role)
  values (v_id, auth.uid(), case when v_has_members then 'member' else 'owner' end)
  on conflict (run_id, user_id) do nothing;

  return v_id;
end;
$$;

comment on function public.nuz_claim_access(text) is
  'Re-attach the calling session to a run it already knows the invite code for. Idempotent.';

-- ---------------------------------------------------------------------
-- 5. Execute grants — explicit, not inherited from PUBLIC
-- ---------------------------------------------------------------------

revoke all on function public.nuz_is_member(uuid)     from public;
revoke all on function public.nuz_is_owner(uuid)      from public;
revoke all on function public.nuz_join_by_code(text)  from public;
revoke all on function public.nuz_claim_access(text)  from public;

grant execute on function public.nuz_is_member(uuid)    to anon, authenticated;
grant execute on function public.nuz_is_owner(uuid)     to anon, authenticated;
grant execute on function public.nuz_join_by_code(text)  to anon, authenticated;
grant execute on function public.nuz_claim_access(text)  to anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. Invite codes must be unique
--
-- Verified beforehand: 20 rows, 0 duplicates, so this cannot fail on the
-- current data. The client (mintInviteCode) now retries on 23505, which
-- only works if this index exists.
-- ---------------------------------------------------------------------

create unique index if not exists nuz_runs_invite_code_key
  on public.nuz_runs (invite_code)
  where invite_code is not null;

-- ---------------------------------------------------------------------
-- 7. Value constraints — nothing enforced these server-side before, so
--    any client could write arbitrary levels, ids or huge strings.
--
--    Added NOT VALID: existing rows are never re-checked (they are clean,
--    but this keeps the migration incapable of failing), while every new
--    or updated row is validated. To also verify the old rows later:
--      alter table public.nuz_encounters validate constraint <name>;
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'nuz_encounters_level_chk') then
    alter table public.nuz_encounters
      add constraint nuz_encounters_level_chk
      check (level between 1 and 100) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_encounters_species_chk') then
    alter table public.nuz_encounters
      add constraint nuz_encounters_species_chk
      check (pokemon_id between 1 and 1025) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_encounters_text_chk') then
    alter table public.nuz_encounters
      add constraint nuz_encounters_text_chk
      check (
        (nickname is null or length(nickname) <= 24)
        and (note is null or length(note) <= 200)
        and length(route_key) <= 80
      ) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_encounters_status_chk') then
    alter table public.nuz_encounters
      add constraint nuz_encounters_status_chk
      check (status in ('caught', 'dead', 'missed', 'duped')) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_runs_text_chk') then
    alter table public.nuz_runs
      add constraint nuz_runs_text_chk
      check (length(name) <= 80 and length(game) <= 40 and length(region) <= 40) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_runs_status_chk') then
    alter table public.nuz_runs
      add constraint nuz_runs_status_chk
      check (status in ('active', 'complete', 'failed')) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'nuz_players_chk') then
    alter table public.nuz_players
      add constraint nuz_players_chk
      check (
        length(name) <= 40
        and color ~ '^#[0-9A-Fa-f]{6}$'
        and slot between 0 and 11
      ) not valid;
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- 8. Remove the audit probe rows.
--
-- While verifying exactly what an anonymous client can write, the audit
-- inserted one run + one player. It turned out DELETE is blocked for anon
-- on those two tables, so they could not be cleaned up from outside — this
-- statement (running with full rights) removes them.
--
-- They are inert in the meantime: no player's hub links to them, and the
-- run is marked status='failed'.
-- ---------------------------------------------------------------------

delete from public.nuz_encounters where run_id = '11111111-2222-4333-8444-555555555555';
delete from public.nuz_players    where run_id = '11111111-2222-4333-8444-555555555555';
delete from public.nuz_runs       where id     = '11111111-2222-4333-8444-555555555555';

commit;

-- ---------------------------------------------------------------------
-- Post-check (read-only, run separately if you like):
--
--   select proname, prosecdef from pg_proc
--   where proname like 'nuz\_%';
--
--   select tgname from pg_trigger where tgrelid = 'public.nuz_runs'::regclass;
--
--   -- must return a row now instead of erroring with 42P17:
--   select count(*) from public.nuz_run_members;
-- ---------------------------------------------------------------------
