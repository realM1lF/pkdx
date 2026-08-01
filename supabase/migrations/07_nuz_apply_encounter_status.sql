-- =====================================================================
-- 07_nuz_apply_encounter_status.sql
--
-- Phase 2.1/2.2 (concurrency plan) — server-side command for SoulLink
-- cascades. Product decision: auto-apply partner deaths when
-- `soulLinkCascade` is ON, mirroring the existing miss→`lost` cascade —
-- no confirm dialog, so a remote client can never sit in a permanent
-- rule-break waiting for another player's click.
--
-- Before this, "mark dead"/"mark missed" was a bare PATCH on the primary
-- row plus N separate PATCHes on every SoulLink partner, sent as separate
-- HTTP requests from the client. Two clients racing the same route could
-- have their partner PATCHes interleave with each other's primary PATCH,
-- and a client that died mid-sequence left the partner rows unresolved.
-- This RPC does the primary update + every partner cascade in ONE
-- transaction, so Postgres (and therefore Realtime) only ever emits a
-- fully-resolved state.
--
-- Mirrors client cascade logic 1:1 — see nuzlocke-store.ts:
--   checkCascade()      (dead   → living partners on the route → dead)
--   checkMissCascade()  (missed → living partners on the route → lost)
-- Both only ever touch OTHER players' still-`caught` rows on the same
-- route_key (see `livingCascadeTargets` in nuzlocke-concurrency.ts) —
-- already-fallen partners are left alone, which is what makes re-applying
-- this idempotent.
--
-- SECURITY DEFINER + search_path pinned to '' (same pattern as
-- 01_prepare_nuzlocke_rls.sql). Membership is checked explicitly via
-- public.nuz_is_member(run_id) — this function never opens access with
-- `using (true)`; DEFINER here is about running the whole cascade as one
-- transaction from one round trip, not about widening who may write
-- (the "members update" RLS policy on nuz_encounters already lets any
-- member of a run update any row in it, including a partner's).
--
-- client_op_id is accepted and echoed back but not yet deduped
-- server-side — reserved for future idempotency / audit logging once a
-- dedupe table exists; harmless to pass today.
--
-- Apply in: Supabase Dashboard → SQL Editor → paste → Run. Idempotent.
-- =====================================================================

begin;

create or replace function public.nuz_apply_encounter_status(
  p_encounter_id uuid,
  p_new_status text,
  p_note text default null,
  p_client_op_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_enc public.nuz_encounters;
  v_run public.nuz_runs;
  v_frees_slot boolean;
  v_soul_link boolean;
  v_cascade_on boolean;
  v_partner_status text;
  v_updated jsonb := '[]'::jsonb;
  v_row public.nuz_encounters;
begin
  if p_new_status not in ('caught', 'dead', 'missed', 'duped', 'lost') then
    raise exception 'nuz_apply_encounter_status: invalid status %', p_new_status;
  end if;

  select * into v_enc from public.nuz_encounters where id = p_encounter_id;
  if not found then
    raise exception 'nuz_apply_encounter_status: encounter % not found', p_encounter_id;
  end if;

  if not public.nuz_is_member(v_enc.run_id) then
    raise exception 'nuz_apply_encounter_status: not a member of this run';
  end if;

  select * into v_run from public.nuz_runs where id = v_enc.run_id;

  -- leaving the living world frees the party slot (mirrors client
  -- `freesSlot` in updateEncounter/nuzlocke-store.ts); restoring to
  -- 'caught' leaves in_party exactly as it was (no auto-rejoin).
  v_frees_slot := p_new_status <> 'caught';

  update public.nuz_encounters
  set
    status = p_new_status,
    note = coalesce(p_note, note),
    in_party = case when v_frees_slot then false else in_party end
  where id = p_encounter_id
  returning * into v_row;

  v_updated := v_updated || jsonb_build_array(to_jsonb(v_row));

  v_soul_link := coalesce((v_run.rules ->> 'soulLink')::boolean, false);
  v_cascade_on := coalesce((v_run.rules ->> 'soulLinkCascade')::boolean, false);

  if v_soul_link and p_new_status in ('dead', 'missed') then
    v_partner_status := case when p_new_status = 'dead' then 'dead' else 'lost' end;

    -- every OTHER player's still-'caught' row on the same route_key.
    -- cascade ON  → status falls too (dead/lost) + boxed
    -- cascade OFF → boxed only, status untouched
    -- Already-fallen partners (status <> 'caught') are excluded by the
    -- WHERE clause, which is what makes re-applying this a no-op.
    for v_row in
      update public.nuz_encounters e
      set
        status = case when v_cascade_on then v_partner_status else e.status end,
        in_party = false
      where e.run_id = v_enc.run_id
        and e.route_key = v_enc.route_key
        and e.player_id <> v_enc.player_id
        and e.id <> v_enc.id
        and e.status = 'caught'
      returning e.*
    loop
      v_updated := v_updated || jsonb_build_array(to_jsonb(v_row));
    end loop;
  end if;

  return jsonb_build_object('updated', v_updated, 'client_op_id', p_client_op_id);
end;
$$;

comment on function public.nuz_apply_encounter_status(uuid, text, text, text) is
  'Single-TX status update for one encounter + its SoulLink partner cascade (dead/missed) on the same route. Returns {updated: [...rows], client_op_id}. p_client_op_id is reserved for future idempotency/logging, not yet deduped server-side.';

revoke all on function public.nuz_apply_encounter_status(uuid, text, text, text) from public;
grant execute on function public.nuz_apply_encounter_status(uuid, text, text, text) to anon, authenticated;

commit;

-- =====================================================================
-- Post-check (read-only, run separately):
--
--   select proname, prosecdef from pg_proc where proname = 'nuz_apply_encounter_status';
--
-- Manual smoke (2 browsers, SoulLink run, cascade ON):
--   - Player A marks their catch dead → Player B's linked catch on the
--     same route flips to 'dead' + leaves the party WITHOUT B clicking
--     anything, feed shows both events, gold toast on both clients.
--   - Repeat with cascade OFF → B's catch stays 'caught' but is boxed.
--   - Repeat for 'missed' → living partner becomes 'lost' (cascade ON)
--     or stays 'caught' boxed (cascade OFF).
-- =====================================================================
