-- =====================================================================
-- 16_nuz_overlay_read.sql
--
-- Read-only OBS overlay: opt-in token on nuz_runs + SECURITY DEFINER
-- snapshot RPC. No permissive RLS — anon reads only via nuz_overlay_snapshot.
-- Never reuse invite_code as overlay credential.
-- =====================================================================

begin;

alter table public.nuz_runs
  add column if not exists overlay_enabled boolean not null default false,
  add column if not exists overlay_token text,
  add column if not exists overlay_config jsonb not null default '{}'::jsonb;

create unique index if not exists nuz_runs_overlay_token_key
  on public.nuz_runs (overlay_token)
  where overlay_token is not null;

comment on column public.nuz_runs.overlay_enabled is
  'When true, nuz_overlay_snapshot(p_token) may return run data for overlay_token.';
comment on column public.nuz_runs.overlay_token is
  'Public read credential for OBS browser source (OVERLAY-********). Rotatable by members.';
comment on column public.nuz_runs.overlay_config is
  'Overlay layout/widget JSON (english keys).';

-- ---------------------------------------------------------------------
-- Writable overlay columns for run members (extends migration 13 grants).
-- ---------------------------------------------------------------------
revoke update on public.nuz_runs from anon, authenticated, public;
grant update (
  name, game, region, rules, status, invite_code,
  overlay_enabled, overlay_token, overlay_config
) on public.nuz_runs to anon, authenticated;

-- ---------------------------------------------------------------------
-- Format gate for overlay tokens (alphabet matches mintOverlayToken()).
-- ---------------------------------------------------------------------
create or replace function public.nuz_runs_overlay_token_format()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.overlay_token is null then
    return new;
  end if;
  if new.overlay_token !~ '^OVERLAY-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then
    raise exception 'nuz_runs: overlay_token format rejected';
  end if;
  return new;
end;
$$;

drop trigger if exists nuz_runs_overlay_token_format_trg on public.nuz_runs;
create trigger nuz_runs_overlay_token_format_trg
  before insert or update on public.nuz_runs
  for each row execute function public.nuz_runs_overlay_token_format();

-- ---------------------------------------------------------------------
-- Read-only snapshot for OBS overlay (no invite_code, no notes).
-- ---------------------------------------------------------------------
create or replace function public.nuz_overlay_snapshot(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.nuz_runs;
  v_players jsonb;
  v_enc jsonb;
  v_updated timestamptz;
begin
  if p_token is null
     or p_token !~ '^OVERLAY-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then
    return null;
  end if;

  select * into v_run
  from public.nuz_runs
  where overlay_token = p_token
    and overlay_enabled = true;

  if not found then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'color', p.color,
        'slot', p.slot
      ) order by p.slot
    ),
    '[]'::jsonb
  ) into v_players
  from public.nuz_players p
  where p.run_id = v_run.id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', e.id,
        'player_id', e.player_id,
        'route_key', e.route_key,
        'pokemon_id', e.pokemon_id,
        'nickname', e.nickname,
        'level', e.level,
        'status', e.status,
        'is_shiny', coalesce(e.is_shiny, false),
        'in_party', e.in_party,
        'created_at', e.created_at
      ) order by e.created_at
    ),
    '[]'::jsonb
  ) into v_enc
  from public.nuz_encounters e
  where e.run_id = v_run.id;

  select greatest(
    v_run.created_at,
    coalesce(
      (select max(created_at) from public.nuz_encounters where run_id = v_run.id),
      v_run.created_at
    )
  ) into v_updated;

  return jsonb_build_object(
    'run', jsonb_build_object(
      'name', v_run.name,
      'game', v_run.game,
      'region', v_run.region,
      'status', v_run.status,
      'rules', v_run.rules
    ),
    'players', v_players,
    'encounters', v_enc,
    'config', coalesce(v_run.overlay_config, '{}'::jsonb),
    'updated_at', v_updated
  );
end;
$$;

comment on function public.nuz_overlay_snapshot(text) is
  'Read-only OBS overlay payload for a valid overlay_token. Returns null when disabled/invalid.';

revoke all on function public.nuz_overlay_snapshot(text) from public;
grant execute on function public.nuz_overlay_snapshot(text) to anon, authenticated;

commit;
