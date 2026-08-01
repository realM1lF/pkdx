-- 05_nuz_encounters_caught_pokemon.sql
-- Stores the species logged at catch time so Timeline/route history can keep
-- showing the original catch after the current form (`pokemon_id`) evolves.
-- Nullable for back-compat; the client normalizes missing values to pokemon_id.

begin;

alter table public.nuz_encounters
  add column if not exists caught_pokemon_id integer
  check (caught_pokemon_id is null or (caught_pokemon_id >= 1 and caught_pokemon_id <= 1025));

-- Backfill existing rows once (idempotent).
update public.nuz_encounters
set caught_pokemon_id = pokemon_id
where caught_pokemon_id is null;

commit;
