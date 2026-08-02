-- Per-member archive flag — syncs across account devices via nuz_run_members.
-- Local LS_ARCHIVED remains a cache for offline/guest; logged-in clients mirror this column.
--
-- SECURITY: this is the first UPDATE ever granted on nuz_run_members. A row-level
-- policy alone would let a member PATCH their own row to role = 'owner', and
-- nuz_is_owner() then hands them run deletion. Access is therefore narrowed twice:
-- a column-level grant (only `archived` is writable) and a trigger that pins the
-- identity/role columns even if a future grant widens.

begin;

alter table public.nuz_run_members
  add column if not exists archived boolean not null default false;

comment on column public.nuz_run_members.archived is
  'When true the run is hidden from the active hub for this user only; payload stays in nuz_runs.';

-- Members may update their own row. No permissive policies.
drop policy if exists "members: update own rows" on public.nuz_run_members;
create policy "members: update own rows"
  on public.nuz_run_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Column-level grant: everything except `archived` stays read-only over REST.
revoke update on public.nuz_run_members from anon, authenticated;
grant update (archived) on public.nuz_run_members to anon, authenticated;

-- Defence in depth: role/run_id/user_id are immutable regardless of grants.
create or replace function public.nuz_run_members_freeze_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.run_id is distinct from old.run_id
     or new.user_id is distinct from old.user_id
     or new.role is distinct from old.role then
    raise exception 'nuz_run_members: only archived may be updated';
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_run_members_freeze_identity_trg on public.nuz_run_members;
create trigger nuz_run_members_freeze_identity_trg
  before update on public.nuz_run_members
  for each row execute function public.nuz_run_members_freeze_identity();

commit;

-- Verify after applying:
--   select column_name, privilege_type from information_schema.column_privileges
--     where table_name = 'nuz_run_members' and privilege_type = 'UPDATE';
--   -- expect exactly one row per grantee, column_name = 'archived'
