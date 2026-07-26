-- =====================================================================
-- 02_enforce_nuzlocke_rls.sql
--
-- STAGE 2 of 2 — this is the one that closes the hole. It replaces the
-- permissive "anyone may do anything" policies on nuz_runs / nuz_players /
-- nuz_encounters with membership-scoped ones, and repairs the recursive
-- policy on nuz_run_members.
--
-- WHAT IT FIXES
--   Before: GET /rest/v1/nuz_runs?select=*  returned all 20 runs
--           including every invite code, and PATCH on any encounter row
--           succeeded — with nothing but the public key from the JS bundle.
--   After:  a session only ever sees runs it is a member of. Membership is
--           obtained by creating a run or by redeeming an invite code.
--
-- ---------------------------------------------------------------------
-- PRE-FLIGHT CHECKLIST — all four must be true, in this order:
--
--   [ ] 1. 01_prepare_nuzlocke_rls.sql has been run successfully.
--   [ ] 2. Dashboard → Authentication → Sign In / Providers →
--          "Anonymous sign-ins" is ENABLED.
--          Guests have no account, so without an anonymous identity
--          auth.uid() is null and multiplayer stops working entirely.
--   [ ] 3. The frontend containing ensureRunIdentity() /
--          nuz_join_by_code is DEPLOYED and live.
--   [ ] 4. You accept that a client which clears its browser storage
--          loses its anonymous identity. It recovers automatically as
--          long as the run's invite code is still in localStorage
--          (nuz_claim_access), which is the normal case.
--
-- If anything misbehaves afterwards, 99_rollback_nuzlocke_rls.sql
-- restores the previous permissive state in one step.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Make sure RLS is actually on. (It was — the policies were just
--    written as "true" — but be explicit.)
-- ---------------------------------------------------------------------
alter table public.nuz_runs        enable row level security;
alter table public.nuz_players     enable row level security;
alter table public.nuz_encounters  enable row level security;
alter table public.nuz_run_members enable row level security;

-- ---------------------------------------------------------------------
-- 1. Drop every existing policy on the four tables.
--
-- Done dynamically because the current policy names are unknown from the
-- outside; this also makes the migration idempotent and prevents a
-- forgotten permissive policy from silently keeping the door open
-- (policies are OR-ed together — one "using (true)" defeats all others).
-- ---------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('nuz_runs', 'nuz_players', 'nuz_encounters', 'nuz_run_members')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
    raise notice 'dropped policy % on %', r.policyname, r.tablename;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- 2. nuz_run_members — the recursion fix.
--
-- The old policy queried nuz_run_members from inside a policy on
-- nuz_run_members (error 42P17). These only look at the row's own
-- user_id, so there is no recursion. Reads of *other* members' rows go
-- through the SECURITY DEFINER helpers instead.
-- ---------------------------------------------------------------------
create policy "members: read own rows"
  on public.nuz_run_members for select
  using (user_id = auth.uid());

create policy "members: insert own rows"
  on public.nuz_run_members for insert
  with check (user_id = auth.uid());

create policy "members: leave a run"
  on public.nuz_run_members for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 3. nuz_runs
--
-- No listing: select is membership-scoped, so an unfiltered
-- `select=*` now returns an empty array instead of every run + code.
-- Insert only needs an identity (the stage-1 trigger then records
-- ownership), which is what keeps guest-created online runs working.
-- ---------------------------------------------------------------------
create policy "runs: members read"
  on public.nuz_runs for select
  using (public.nuz_is_member(id));

create policy "runs: signed sessions create"
  on public.nuz_runs for insert
  with check (auth.uid() is not null);

create policy "runs: members update"
  on public.nuz_runs for update
  using (public.nuz_is_member(id))
  with check (public.nuz_is_member(id));

create policy "runs: owner deletes"
  on public.nuz_runs for delete
  using (public.nuz_is_owner(id));

-- ---------------------------------------------------------------------
-- 4. nuz_players
-- ---------------------------------------------------------------------
create policy "players: members read"
  on public.nuz_players for select
  using (public.nuz_is_member(run_id));

create policy "players: members add"
  on public.nuz_players for insert
  with check (public.nuz_is_member(run_id));

create policy "players: members update"
  on public.nuz_players for update
  using (public.nuz_is_member(run_id))
  with check (public.nuz_is_member(run_id));

create policy "players: members remove"
  on public.nuz_players for delete
  using (public.nuz_is_member(run_id));

-- ---------------------------------------------------------------------
-- 5. nuz_encounters — the table that was writable by anyone.
-- ---------------------------------------------------------------------
create policy "encounters: members read"
  on public.nuz_encounters for select
  using (public.nuz_is_member(run_id));

create policy "encounters: members add"
  on public.nuz_encounters for insert
  with check (public.nuz_is_member(run_id));

create policy "encounters: members update"
  on public.nuz_encounters for update
  using (public.nuz_is_member(run_id))
  with check (public.nuz_is_member(run_id));

create policy "encounters: members remove"
  on public.nuz_encounters for delete
  using (public.nuz_is_member(run_id));

-- ---------------------------------------------------------------------
-- 6. Table grants. RLS filters rows; grants decide whether the role may
--    touch the table at all. Keep both narrow.
--    Note: no grant on invite_code beyond what select already covers —
--    members may read their own run's code (they need it to invite).
-- ---------------------------------------------------------------------
grant select, insert, update, delete on public.nuz_runs        to anon, authenticated;
grant select, insert, update, delete on public.nuz_players     to anon, authenticated;
grant select, insert, update, delete on public.nuz_encounters  to anon, authenticated;
grant select, insert, delete         on public.nuz_run_members to anon, authenticated;

commit;

-- =====================================================================
-- VERIFY (from a shell, with the public key — no login):
--
--   URL=https://iqsdojzyqznmcirypdnk.supabase.co
--   K=sb_publishable_B-cuJFNUAsfLvva9givrcA_m7QWT-fe
--   curl -s "$URL/rest/v1/nuz_runs?select=*" -H "apikey: $K" -H "Authorization: Bearer $K"
--   curl -s "$URL/rest/v1/nuz_encounters?select=*" -H "apikey: $K" -H "Authorization: Bearer $K"
--
-- Both must print []  (before the migration: 20 runs / 29 encounters).
-- Or just run:  node scripts/check-rls.mjs
--
-- Then in the browser, on both /de and /en:
--   - create an online run          → invite code appears
--   - open the code on a 2nd device → join works, encounters sync live
--   - reload                        → run still visible
-- =====================================================================
