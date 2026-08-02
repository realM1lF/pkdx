-- Per-member archive flag — syncs across account devices via nuz_run_members.
-- Local LS_ARCHIVED remains a cache for offline/guest; logged-in clients mirror this column.

begin;

alter table public.nuz_run_members
  add column if not exists archived boolean not null default false;

comment on column public.nuz_run_members.archived is
  'When true the run is hidden from the active hub for this user only; payload stays in nuz_runs.';

-- Members may update their own row (archive/restore). No permissive policies.
create policy "members: update own rows"
  on public.nuz_run_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant update on public.nuz_run_members to anon, authenticated;

commit;
