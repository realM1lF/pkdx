-- =====================================================================
-- 14_nuz_soullink_restore.sql
--
-- Extends nuz_apply_encounter_status (07) so restoring the trigger to
-- `caught` undoes the SoulLink death/miss cascade in the same transaction.
--
-- Forward cascade (unchanged): dead → living partners dead; missed → lost.
-- Restore (this migration):
--   old dead   → other dead on the route become caught (stay boxed)
--   old missed / lost → other missed/lost on the route become caught
-- Cascade OFF: partners were only boxed; status is untouched (mirrors client).
-- in_party is left as-is on restore (no auto-rejoin), same as 07.
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
  v_old_status text;
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

  v_old_status := v_enc.status;

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

  -- Restore undo: revive partners that the forward cascade (or a miss
  -- group) knocked down. Does not unbox them.
  if v_soul_link and v_cascade_on and p_new_status = 'caught'
     and v_old_status in ('dead', 'missed', 'lost') then
    for v_row in
      update public.nuz_encounters e
      set status = 'caught'
      where e.run_id = v_enc.run_id
        and e.route_key = v_enc.route_key
        and e.player_id <> v_enc.player_id
        and e.id <> v_enc.id
        and (
          (v_old_status = 'dead' and e.status = 'dead')
          or (v_old_status in ('missed', 'lost') and e.status in ('missed', 'lost'))
        )
      returning e.*
    loop
      v_updated := v_updated || jsonb_build_array(to_jsonb(v_row));
    end loop;
  end if;

  return jsonb_build_object('updated', v_updated, 'client_op_id', p_client_op_id);
end;
$$;

comment on function public.nuz_apply_encounter_status(uuid, text, text, text) is
  'Single-TX status update for one encounter + SoulLink partner cascade (dead/missed) and restore undo (caught). Returns {updated: [...rows], client_op_id}.';

revoke all on function public.nuz_apply_encounter_status(uuid, text, text, text) from public;
grant execute on function public.nuz_apply_encounter_status(uuid, text, text, text) to anon, authenticated;

commit;
