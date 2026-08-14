-- 15_nuz_encounters_shadow_id.sql
-- Optional Orre Shadow id on a Nuzlocke encounter (colo-shadow-makuhita).
alter table public.nuz_encounters
  add column if not exists shadow_id text
  check (shadow_id is null or char_length(shadow_id) between 1 and 64);
