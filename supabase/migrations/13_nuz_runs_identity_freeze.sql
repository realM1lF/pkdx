-- =====================================================================
-- 13_nuz_runs_identity_freeze.sql
--
-- 1. INSERT always stamps owner_id from auth.uid(); the client value
--    is ignored.
-- 2. Members may UPDATE name/game/region/rules/status. owner_id is never
--    writable. invite_code may be set once (null → minted SOUL-********)
--    so solo→online still works; existing codes stay pinned.
-- 3. New invite_code values must match mintInviteCode() in the store.
--    Legacy short codes stay readable until a row writes a new code.
--    Invite rotation is a future owner RPC — not built here.
--
-- Never add a permissive always-true policy. No table CHECK on invite_code
-- (legacy rows would fail migrate).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Always stamp the caller as owner on INSERT.
-- ---------------------------------------------------------------------
create or replace function public.nuz_runs_stamp_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.owner_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists nuz_runs_stamp_owner_trg on public.nuz_runs;
create trigger nuz_runs_stamp_owner_trg
  before insert on public.nuz_runs
  for each row execute function public.nuz_runs_stamp_owner();

-- ---------------------------------------------------------------------
-- 2. Column grants: identity columns are not writable over REST.
-- ---------------------------------------------------------------------
revoke update on public.nuz_runs from anon, authenticated, public;
grant update (name, game, region, rules, status, invite_code) on public.nuz_runs to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Pin owner_id and invite_code even if a future grant widens.
-- ---------------------------------------------------------------------
create or replace function public.nuz_runs_freeze_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.owner_id := old.owner_id;
  /* first mint (solo → online) may fill a null code; rotation is blocked */
  if old.invite_code is not null then
    new.invite_code := old.invite_code;
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_runs_freeze_identity_trg on public.nuz_runs;
create trigger nuz_runs_freeze_identity_trg
  before update on public.nuz_runs
  for each row execute function public.nuz_runs_freeze_identity();

-- ---------------------------------------------------------------------
-- 4. Format gate for newly written invite codes only.
--    Alphabet matches mintInviteCode() (no I/L/O/0/1).
-- ---------------------------------------------------------------------
create or replace function public.nuz_runs_invite_format()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.invite_code is not distinct from old.invite_code then
    return new;
  end if;
  if new.invite_code is not null
     and new.invite_code !~ '^SOUL-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then
    raise exception 'nuz_runs: invite_code format rejected';
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_runs_invite_format_trg on public.nuz_runs;
create trigger nuz_runs_invite_format_trg
  before insert or update on public.nuz_runs
  for each row execute function public.nuz_runs_invite_format();

commit;
