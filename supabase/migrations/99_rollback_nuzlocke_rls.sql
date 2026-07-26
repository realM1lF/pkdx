-- =====================================================================
-- 99_rollback_nuzlocke_rls.sql
--
-- Emergency undo for 02_enforce_nuzlocke_rls.sql. Restores the previous
-- permissive behaviour so multiplayer works again immediately, at the
-- cost of re-opening the anonymous read/write hole.
--
-- Use this only to buy time — then fix the cause and re-apply stage 2.
--
-- It deliberately does NOT undo 01_prepare (helpers, trigger, unique
-- index, value constraints); none of those can break the old client.
-- =====================================================================

begin;

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
  end loop;
end;
$$;

-- back to wide-open access (the pre-audit state)
create policy "rollback: runs open"       on public.nuz_runs        for all using (true) with check (true);
create policy "rollback: players open"    on public.nuz_players     for all using (true) with check (true);
create policy "rollback: encounters open" on public.nuz_encounters  for all using (true) with check (true);

-- nuz_run_members stays non-recursive even in the rollback, so the
-- 42P17 error does not come back
create policy "rollback: members own rows" on public.nuz_run_members for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

commit;
