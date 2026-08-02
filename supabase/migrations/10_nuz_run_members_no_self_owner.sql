-- Close the INSERT-side privilege escalation on nuz_run_members.
--
-- Migration 02 allowed any signed session to insert a membership row for
-- itself with an arbitrary role. Combined with the DELETE policy ("members:
-- leave a run") that is a two-step escalation: delete your own member row,
-- re-insert it with role = 'owner', and public.nuz_is_owner() then reports
-- true — which grants run deletion via the "runs: owner deletes" policy.
--
-- Ownership must only ever originate from a trusted context:
--   * public.nuz_runs_grant_owner()  — AFTER INSERT trigger on nuz_runs
--   * public.nuz_join_by_code()      — SECURITY DEFINER, inserts 'member'
--   * public.nuz_claim_access()      — SECURITY DEFINER, inserts 'member'
-- All three are SECURITY DEFINER and therefore unaffected by this policy.

begin;

drop policy if exists "members: insert own rows" on public.nuz_run_members;

-- REST clients may only ever insert a plain membership for themselves.
create policy "members: insert own member rows"
  on public.nuz_run_members for insert
  with check (user_id = auth.uid() and role = 'member');

commit;

-- Verify after applying (as an authenticated non-owner member):
--   insert into nuz_run_members (run_id, user_id, role)
--     values ('<run>', auth.uid(), 'owner');   -- must fail: RLS violation
--   insert into nuz_run_members (run_id, user_id, role)
--     values ('<run>', auth.uid(), 'member');  -- allowed
