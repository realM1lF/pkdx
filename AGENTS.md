<!-- AGENTS.md — technical working agreement for AI coding agents in this repository.
     Canonical source: the pkdx2-project-guide skill. Deep-dive references: docs/ai/.
     Keep this file in sync when architecture, i18n, or design rules change. -->


A dark, data-dense, bilingual (EN/DE) companion tool for Pokémon players.
Think "living operations deck", not encyclopedia: every surface reacts
(hover glows, scroll reveals, animated sprites), information density is
deliberately high, and the whole app runs in English and German with
SEO-grade URL language routing.

## 1. Stack (pinned — do not change)

Node.js 20 · React 19 + TypeScript · Vite 7 · Tailwind CSS v3.4 ·
framer-motion · GSAP (ScrollTrigger) · Three.js (hero particles) ·
Lenis (smooth scroll) · fuse.js · lucide-react · i18next + react-i18next +
i18next-browser-languagedetector · @smogon/calc · @pkmn/data + @pkmn/dex ·
@supabase/supabase-js

```bash
npm install          # once
npm run dev          # dev server
npm run build        # production build — MUST pass before every commit
npx tsc -b           # type check — must stay at 0 errors
npm run i18n:data    # regenerate German entity-name artifacts (rare)
```

## 2. Repository map

| Path | What lives there |
|---|---|
| `src/lib/pokeapi.ts` | PokéAPI client: `cachedJson` (SWR cache), `getPokemon/getSpecies/getEvolutionChain/getMove`, `bootNameIndex()`, `displayName`, `padNum` |
| `src/lib/sprites.ts` | Sprite URL builders for all generations, `spriteFallbackChain`, `PIXELATED_ERAS` |
| `src/lib/types.ts` | 18 types, `TYPE_COLORS`, `GENERATIONS` |
| `src/lib/regions.ts` + `src/data/regions/*.json` | **Shared Region Contract** (Maps ↔ Nuzlocke): `REGIONS`, `regionById`, `RegionMap/MapNode`, per-node `route_key` |
| `src/lib/i18n-data.ts` | Localized entity lookup (`nameOfPokemon/Move/Type/Item/…`), `useLanguage()` |
| `src/lib/teambuilder.ts` · `src/lib/versus.ts` | Team model + legality (21 version groups) · 1v1 matchup math on @smogon/calc |
| `src/lib/nuzlocke-store.ts` | Solo (localStorage `pdx2.nuz.*`) + multiplayer (Supabase Realtime) run store, `getRunTeam(runId)` |
| `src/data/i18n/de/*.json` | Build-time German name artifacts + reverse search index |
| `src/data/enriched/kanto.json` | Items/trainers/NPCs parsed from pret/pokefirered (English) |
| `src/i18n/locales/{en,de}/translation.json` | UI strings — EN and DE must always be at key parity |
| `src/pages/*` | Home, Pokedex, PokemonDetail (+`detail/`), Maps, MapRegion (+`maps/`), Nuzlocke, NuzlockeRun (+`nuzlocke/`), TeamBuilder (+`teambuilder/`) |
| `src/components/*` | Navbar, Footer, Layout, SearchCommand, Sprite, StatBar, TypeGlyph, LocaleLink |
| `scripts/build-i18n-data.mjs` | Fetches German entity names from PokéAPI → `src/data/i18n/de/` |
| `design/` (repo docs) | `design.md` (Holo-Dex system), `density-addendum.md` (BINDING), per-page specs |

## 3. Binding invariants — never break these

1. **The data model stays English.** Slugs, IDs, `route_key`, URL params,
   team share-link hashes, localStorage payloads and Supabase rows are always
   English slugs. Localization happens ONLY at the render edge, via
   `src/lib/i18n-data.ts` + i18next. Never translate a slug.
2. **URL language routing is the source of truth.** All routes live under
   `/:lang` (`de`|`en`). Every internal link/navigation MUST go through
   `LocaleLink` or `useLocalePath()` — never hardcode `to="/pokemon/…"` or
   `navigate("/…")`. Preserve query strings and hashes across redirects.
3. **Locale parity.** Every UI string lives in BOTH
   `src/i18n/locales/en/translation.json` and `…/de/translation.json`.
   Hardcoded user-facing strings in components are a defect. German uses
   official German game terminology (Attacken, Fähigkeit, Wesen), short
   substantive labels, no du-form.
4. **Shared Region Contract.** `route_key` and node IDs in
   `src/data/regions/*.json` are referenced by Maps, Nuzlocke runs and
   Supabase rows. Add fields (e.g. `nameDe`) freely; never rename or re-key.
5. **Design system (Holo-Dex) is binding.** Dark void theme, 18 type-energy
   colors, gold accents, pixel micro-labels. **Errors are never red** —
   shake animation + gold hint. Density rules from
   `design/density-addendum.md` (compact cards, 36–44px rows, 8–10px
   micro-labels) apply to every new surface.
6. **Lenis owns the window scroll.** Any inner scroll container
   (`overflow-y-auto` / fixed `max-height` lists) needs `data-lenis-prevent`,
   or the wheel is hijacked and the panel appears "not scrollable".
7. **Sprites always via `<Sprite>`** (`src/components/Sprite.tsx`) — it owns
   pixelated rendering for pre-Gen-VI, the onError fallback chain, and
   skeleton loading. Never raw `<img>` for Pokémon sprites.
8. **Scroll restoration exists in `Layout`** — do not reintroduce
   per-page scroll hacks; fixed-height decks rely on the pathname reset.

## 4. Where the details live (progressive disclosure)

Load these references only when the task touches their domain:

- `docs/ai/architecture.md` — data layer, caching, calc/legality libs,
  Supabase schema, routing/LangGate/SeoHead internals, integration contracts
  (Maps↔Nuzlocke↔Team Builder↔Versus), pret/pokefirered pipeline.
- `docs/ai/i18n.md` — the full translation system: artifacts, lookup
  layer, bilingual search, redirect matrix, hreflang/SEO, how to add a
  string or a whole page, known English-only remainders.
- `docs/ai/design-system.md` — Holo-Dex tokens, typography, density
  scale, motion patterns, sprite rules, maps/evolution rendering gotchas.

## 5. Working agreement

1. Read the files you will touch before editing. Match existing code style
   (function components, Tailwind utility classes, `cn()` helper).
2. New user-facing text → i18n keys in both locales, German included.
3. New entity display (Pokémon/move/type/item/location names) → lookup via
   `src/lib/i18n-data.ts`, never raw API fields.
4. Keep German string length in check: table headers, chips and 44px rows
   need `truncate` / `min-w-0` where German runs long.
5. `npm run build` + `npx tsc -b` clean before committing.
   Conventional-commits style messages.
6. Smoke-test what you changed in the browser on BOTH `/de/…` and `/en/…`
   routes, including console (no i18next missing-key warnings).

## 6. Known English-only remainders (documented, not defects)

- Trainer names/classes from pret/pokefirered (`enriched/kanto.json`)
- Long ability effect texts (PokéAPI `effect_entries` are English-only)
- Smogon set names from data.pkmn.cc (Versus "assumed sets")
- User-generated content (team names, run names, player names)
