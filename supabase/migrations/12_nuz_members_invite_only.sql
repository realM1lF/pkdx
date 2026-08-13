-- =====================================================================
-- 12_nuz_members_invite_only.sql
--
-- Clients must not INSERT into public.nuz_run_members. Membership rows
-- are written only by existing SECURITY DEFINER functions/triggers:
--   * public.nuz_join_by_code()
--   * public.nuz_claim_access()
--   * public.nuz_runs_grant_owner()
-- Those run as the function owner and keep INSERT even after this revoke.
--
-- SELECT / UPDATE(archived) / DELETE stay as they are.
-- Never add a permissive always-true policy.
-- =====================================================================

begin;

revoke insert on public.nuz_run_members from anon;
revoke insert on public.nuz_run_members from authenticated;
revoke insert on public.nuz_run_members from public;

drop policy if exists "members: insert own member rows" on public.nuz_run_members;
drop policy if exists "members: insert own rows" on public.nuz_run_members;
drop policy if exists "members: no client insert" on public.nuz_run_members;

-- Defence in depth: even if INSERT grants leak, RLS still rejects clients.
create policy "members: no client insert"
  on public.nuz_run_members for insert
  with check (false);

commit;
