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
@supabase/supabase-js · @pkmn/sim (1:1 battle engine, lazy vendor bundle)

```bash
npm install          # once
npm run dev          # dev server
npm run build        # production build — MUST pass before every commit
npx tsc -b           # type check — must stay at 0 errors
npm run i18n:data    # regenerate German entity-name artifacts (rare)
npm run tcg:data     # refresh TCG catalog index (src/data/tcg/index.{en,de}.json)
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

## 7. Battle simulator (@pkmn/sim) — calc parity is binding

The Versus 1:1 battle (`src/lib/battle/engine.ts`) runs @pkmn/sim; the
damage matrix (`src/lib/versus.ts`) runs @smogon/calc. Both MUST agree:

- **Gen 1/2 stat-exp**: @smogon/calc forces max stat experience internally.
  The sim teampack therefore sets EVs 255 for gen < 3 (do not "fix" this).
- **Ramping moves** (Walzer/rollout, Eisball, Zornklinge, Echostimme):
  power grows per consecutive hit — the matrix shows per-hit + cumulative
  KO, never a plain first-hit "xHKO" label.
- **Multi-hit** shows hit range × hit count + total min/max. **OHKO moves**
  show an explicit OHKO cell, never `[0,0]`. **Fokusgurt/Sturdy** caps
  guaranteed-OHKO labels on the defender.
- Item/ability inputs are normalized slug → display name before calc;
  @smogon/calc silently ignores non-display names.
- Sim team packs use base PP (no PP-ups), seedable PRNG only — never
  `Math.random()` in battle logic. Tests: `npx vitest run src/lib/battle`.

## 8. SEO & content rules (hard-won, apply to every page)

- **Prerendering is the foundation** (`scripts/prerender.mjs`, routes in
  `scripts/seo-routes.mjs`). Every indexable page must render meaningful
  content in initial HTML — AI crawlers do not run JS.
- **Meta descriptions ≤ 160 chars** (script-enforced). Entity = H1,
  questions = H3 modules. No hidden doorway pages, no programmatic mass
  pages without unique computed value (Google "scaled content abuse").
- **No duplicate copy blocks**: description text and Q&A answers must not
  repeat each other — each block adds NEW information (this defect class
  already happened once on item pages; guards exist, keep them).
- **Writing style**: no AI slop. Avoid em-dash chains ("—"), rule-of-three
  padding, inflated adjectives, "nicht nur X, sondern Y". Write short,
  factual sentences. See `/app/.agents/skills/humanizer/SKILL.md`.
  German: official game terminology, short labels.
- **Facts must be verified** against Bulbapedia/PokéWiki/PokéAPI with the
  CORRECT GAME VERSION (Kanto=FRLG, Johto=HGSS, Hoenn=RSE, Sinnoh=Platin,
  Einall=BW). Version mix-ups were our #1 data bug class.
- **Encounter rates**: PokéAPI `chance` is per slot — sum per species per
  exact method, then take MAX per bucket (never sum across mutually
  exclusive fishing rods). Static/gift/trade encounters (pokeflute,
  npc-trade, gift, only-one, static) are NOT wild spawns — show them in the
  dedicated section, exclude from "häufigster Fang" leaderboards.

## 9. Build & repo quirks (save yourself an hour)

- `dist/` is committed but gitignored → commit with `git add -f dist`.
- Build needs `NODE_OPTIONS=--max-old-space-size=3072`.
- `ENOTEMPTY` on `dist/sprites/**` during build is a known filesystem
  flake — kill stray processes, retry.
- `NPM_CONFIG_REGISTRY` env in sandboxes overrides `.npmrc` and writes
  mirror URLs into `package-lock.json`; `scripts/fix-lockfile-registry.mjs`
  (postinstall) normalizes them. Netlify cannot reach the mirror.
- vitest needs the WebSocket stub in `vitest.setup.ts` (supabase import
  chain throws on Node 20 otherwise). Full suite must stay green.
- Never push without `git ls-remote github main` verification afterwards.
- **`netlify.toml` header order is load-bearing.** Netlify merges all
  matching rules, but on a duplicate header name the rule declared LAST
  wins. The `/*` catch-all therefore comes FIRST (it carries the security
  headers), and the `Cache-Control` overrides for `/assets|/sprites|/fonts`
  come after it. With `/*` at the bottom it silently overrode `immutable`
  and every asset was served `max-age=0`. Verify with
  `npm run check:headers` after a deploy — precedence cannot be reproduced
  locally.

## 10. Pre-merge validation — binding (a silent merge revert already happened)

Before ANY merge into `main` and before ANY push of `main`, run the full
validation gate. A past merge (`3e3eb76`) silently reverted a fix commit
(−156 lines, 31 tests deleted) and nobody noticed until a later task
rediscovered the bugs. Merges on the /mnt FUSE mount can also fail
halfway (ort strategy, index locks) — never trust a merge you have not
verified.

The gate, in order:

1. **Intent check**: list what the branch is supposed to change (files,
   features, tests). After merging, verify each intended change is
   actually present in the result (grep for the new symbols, read the
   diff `git diff <main-before>..<merge-result> --stat`).
2. **Regression check**: verify nothing unrelated shrank. Suspicious
   signs: test count drops, files deleted that the branch never touched,
   previously-fixed bugs reappearing. Compare against the pre-merge main,
   not against the branch.
3. **Build gate**: `npx tsc -b` 0 errors, full `npx vitest run` green,
   `npm run build` succeeds, prerendered page count matches expectation
   (`find dist -name index.html | wc -l`).
4. **Content spot-check**: grep the built `dist/` for the feature's
   user-facing output (e.g. a new label on a prerendered page) — source
   code alone does not prove the build carries it.
5. **Push verification**: after pushing, `git ls-remote github main`
   must show the new commit; `git fetch && git status` must show no
   divergence.

If any step fails: do NOT push. Fix or redo the merge first (merging in
a fresh $HOME clone is more reliable than on /mnt).

## 11. Security — binding

1. **The Supabase publishable key is public by design** (it ships in the
   bundle). Therefore RLS is the *only* thing protecting data. Never assume
   a table is safe because the UI does not expose it — verify with
   `node scripts/check-rls.mjs`, which audits the live project using
   nothing but that public key.
2. **Multiplayer rows are membership-scoped.** `nuz_runs` / `nuz_players` /
   `nuz_encounters` are readable and writable only for members of the run
   (`public.nuz_is_member`). Membership comes from creating a run (DB
   trigger) or redeeming an invite code (`nuz_join_by_code` RPC). Never add
   a policy with `using (true)` — policies are OR-ed, so one permissive
   policy silently reopens everything. Schema in `supabase/migrations/`.
3. **Guests need an anonymous identity.** `ensureRunIdentity()` in
   `src/lib/auth.ts` signs guests in anonymously, lazily, only for
   multiplayer actions. Anonymous sessions must never count as accounts:
   `isRealUser()` filters them out so the account UI and cloud-sync are
   unaffected. Do not remove that filter.
4. **Invite codes are credentials.** 8 symbols from `crypto.getRandomValues`
   (~2^40), unique-indexed, re-minted on 23505. Never shorten them, never
   use `Math.random()`, and keep the join input's `maxLength` ≥ 16.
5. **The CSP in `netlify.toml` has no `unsafe-inline` for scripts.** Any new
   inline `<script>` breaks silently — put it in a file under `public/`
   instead (see `public/plausible-init.js`). A new external data source
   needs its host in the matching directive, and CSP validates *redirect
   targets* (`data.pkmn.cc` → `pkmn.github.io` is why both are listed).
   After touching `index.html`, `netlify.toml` or adding an external
   dependency, run `npm run build && node scripts/check-csp.mjs` — it
   serves `dist/` with the real production headers and must report
   0 violations.
6. **No `dangerouslySetInnerHTML`.** React escaping is the XSS defence;
   user content (run/team/player names) is rendered as text only.
