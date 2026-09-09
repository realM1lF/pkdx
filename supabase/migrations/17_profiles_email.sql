-- =====================================================================
-- 17_profiles_email.sql
--
-- Optional real email on profiles for modern + bound-legacy accounts.
-- Auth source of truth stays auth.users.email. This column is display +
-- uniqueness at the profile edge. Never store @users.mypokepanion.com.
--
-- Dashboard after deploy:
--   Auth → disable public signup (stay off)
--   Auth → confirm email ON
--   Auth → Redirect URLs: /de/account /en/account + localhost
--   Auth → built-in mailer (dev) or any Custom SMTP (prod)
--   Functions: register-account, login-with-username, delete-account
--   Confirm/reset/bind all go through GoTrue. No Resend secret.
-- reset-with-pin stays the live legacy function (not rewritten here).
-- =====================================================================

begin;

alter table public.profiles
  add column if not exists email text;

update public.profiles
set email = null
where email is not null
  and lower(email) like '%@users.mypokepanion.com';

create unique index if not exists profiles_email_key
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.profiles_email_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.email is not null then
    new.email := lower(trim(new.email));
    if new.email = '' then
      new.email := null;
    elsif new.email like '%@users.mypokepanion.com' then
      raise exception 'reserved auth email domain';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_email_guard on public.profiles;
create trigger profiles_email_guard
  before insert or update of email on public.profiles
  for each row execute function public.profiles_email_guard();

commit;
