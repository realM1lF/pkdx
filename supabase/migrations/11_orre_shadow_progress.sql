-- =====================================================================
-- 11_orre_shadow_progress.sql
--
-- Account-scoped Shadow Tracker progress for Colosseum / XD.
-- DB is source of truth for logged-in (non-anonymous) users.
-- localStorage is only a device cache (same pattern as teams).
--
-- RLS: owner-only. Never add a permissive always-true predicate —
-- policies are OR-ed, so one open policy silently reopens the table.
-- Anonymous auth.uid() rows are possible at the SQL layer, but the
-- client only syncs via getAuthUser() which filters is_anonymous.
-- =====================================================================

begin;

create table if not exists public.orre_shadow_progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  game       text not null check (game in ('colosseum', 'xd')),
  shadow_id  text not null,
  status     text not null check (status in ('snagged', 'missed')),
  updated_at timestamptz not null default now(),
  primary key (user_id, game, shadow_id)
);

create index if not exists orre_shadow_progress_user_idx
  on public.orre_shadow_progress (user_id);

comment on table public.orre_shadow_progress is
  'Per-account Shadow Tracker status (snagged/missed). remaining = no row.';

alter table public.orre_shadow_progress enable row level security;

drop policy if exists orre_shadow_progress_select_own on public.orre_shadow_progress;
drop policy if exists orre_shadow_progress_insert_own on public.orre_shadow_progress;
drop policy if exists orre_shadow_progress_update_own on public.orre_shadow_progress;
drop policy if exists orre_shadow_progress_delete_own on public.orre_shadow_progress;

create policy orre_shadow_progress_select_own
  on public.orre_shadow_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy orre_shadow_progress_insert_own
  on public.orre_shadow_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy orre_shadow_progress_update_own
  on public.orre_shadow_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy orre_shadow_progress_delete_own
  on public.orre_shadow_progress
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete
  on public.orre_shadow_progress
  to authenticated;

commit;
