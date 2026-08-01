# Architecture Reference — Pokédex 2.0

TOC: Data Layer · Battle/Math Libs · Supabase · Routing & SEO Shell ·
Feature Integration Contracts · Enriched-Data Pipeline (pret)

## 1. Data layer (PokéAPI)

- Single client module: `src/lib/pokeapi.ts`. All HTTP goes through
  `cachedJson(url)` — a stale-while-revalidate cache (in-memory +
  localStorage). Do not add raw `fetch()` calls to PokéAPI elsewhere;
  extend the client module instead.
- `bootNameIndex()` loads `/pokemon?limit=1025` once for grid/search
  (English slugs + ids). German display names do NOT come from this index —
  they come from the build-time artifacts (see `references/i18n.md`).
- Species payloads already contain `names[]`, `genera[]` and
  `flavor_text_entries[]` in many languages; pick `language.name === 'de'`
  with English fallback when rendering localized flavor text/genus.
- Sprites: `src/lib/sprites.ts` builds URLs against the PokeAPI sprites
  repo (raw.githubusercontent). Gen I–VIII, Gen V animated GIFs, shiny/back,
  official-artwork, HOME, showdown, cries. `PIXELATED_ERAS` controls
  `image-rendering: pixelated` (pre-Gen-VI). Always render via `<Sprite>`.

## 2. Battle / legality libraries

- `@smogon/calc` — damage math Gen 1–9. Used by `src/lib/versus.ts`
  (1v1 matchup analysis: best-move ranking, KO ranges, speed tiers).
- `@pkmn/data` + `@pkmn/dex` — gen-aware learnset/legality data, used by
  `src/lib/teambuilder.ts` (21 version groups, per-game move legality).
- These libs are English-only and slug-keyed. Feed them English slugs;
  localize only what you render.
- `@pkmn/sim` was evaluated and deliberately NOT adopted (full battle
  engine = unbounded complexity). Versus is pure calc, not simulation.
- Moveset provenance tiers for NPC/opponent mons (Versus in Nuzlocke):
  1. exact trainer movesets from the pret pipeline
  2. wild mons: last 4 level-up moves (deterministic)
  3. otherwise: "ASSUMED SET" (labeled, user-editable)

## 3. Supabase (Nuzlocke multiplayer)

- Project URL + publishable key live in the nuzlocke store module.
- Tables: `nuz_runs`, `nuz_players`, `nuz_encounters`
  (partial unique index `nuz_encounters_route_slot_uidx` on
  `(run_id, player_id, route_key) WHERE status <> 'duped' AND
  coalesce(is_shiny,false) = false` — mirrors client `isSlotConsuming`;
  duped/shiny rows do not consume the route slot). Realtime channel +
  Presence keyed by **player id** (never run id) for live sync; invite-code
  access. Solo mode mirrors to localStorage (`pdx2.nuz.*`) with an online
  upgrade path. Client inserts + reconciles `23505` (no PostgREST upsert
  against the partial index).
- `getRunTeam(runId)` is the integration hook for Team Builder / Versus.
- Do not change table names/columns casually — live runs depend on them.

## 4. Routing & SEO shell

- `BrowserRouter`; every route nested once under `/:lang` in `App.tsx`
  (`lang ∈ {de, en}`). A `LangGate`/`LangSync` component keeps route param,
  i18next language, localStorage (`pdx2.lang`) and `<html lang>` in sync,
  bidirectionally.
- Redirect matrix: `/` and unprefixed paths → detected language (path →
  localStorage → navigator); invalid lang segment → detected language +
  remaining path; unknown path inside a valid lang → language home.
  Query strings and hashes survive every redirect (team share links!).
- Internal navigation only via `LocaleLink` / `useLocalePath()`.
- `SeoHead` writes per-route `rel="alternate" hreflang` (de, en, x-default),
  canonical, and localized `document.title`.
- `Layout` owns: Lenis lifecycle, scroll restoration on pathname change
  (Lenis virtual offset + `window.scrollTo(0,0)`), global search hotkey
  (`/`), back-to-top, cursor spotlight. Pages never compensate nav height —
  `Layout` adds the `pt-16` offset.

## 5. Feature integration contracts

- **Maps ↔ Nuzlocke:** shared region JSONs (`src/data/regions/*.json`).
  Nuzlocke timeline order and route-filtered autocomplete derive from the
  same node lists; `route_key` is the join key (also into Supabase).
- **Detail page ↔ Maps:** rows link to `/pokemon/{id}?from=region:node`;
  maps honor `?node=` / `?v=` deep links.
- **Detail page ↔ Versus:** `?vs=<id>` opens the VERSUS tab with an
  opponent preselected; shareable.
- **Nuzlocke ↔ Team Builder:** run teams import via `getRunTeam`.
- When adding a feature, ask "which contract does this join?" before
  inventing a new data path.

## 6. Enriched-data pipeline (pret/pokefirered)

- `src/data/enriched/kanto.json` (items with map positions, 368 trainers
  with exact movesets, NPCs) was parsed from the pret/pokefirered
  decompilation — legitimate open-source game-data reverse engineering.
- Original Kanto map image: `public/maps/kanto-original.jpg` +
  `src/data/regions/kanto-geo.json` (46 authored node coordinates as 0..1
  fractions). Node coordinates are hand-authored — verify visually with a
  PIL/overlay script if you touch them.
- This data is English; trainer names stay English by decision (see SKILL
  §6). Item/location slugs map to German display names via `i18n-data.ts`.
