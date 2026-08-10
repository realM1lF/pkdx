# Nuzlocke SEO Landing + Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/nuzlocke` into a crawlable SEO landing and add Phase-1 satellite pages (soul-link + top game trackers) for EN/DE, matching competitor SERP depth without inventing unsupported ROM-hack coverage.

**Architecture:** Keep the interactive hub on `/nuzlocke`. Add prerendered marketing sections below the tool UI. Satellite routes are static English slugs under `/nuzlocke/<slug>` registered *before* `nuzlocke/:runId`. Copy lives in i18n (EN+DE parity). Meta in `src/lib/seo.ts`; prerender list in `scripts/seo-routes.mjs`. Follow `BattleLanding.tsx` + `QaSection` patterns. On-page SEO must follow `.agents/skills/seo-onpage/SKILL.md` (8 dimensions). Human writing: no AI-slop, no em-dash chains, DE = official game terms, short labels (AGENTS.md §8 + humanizer).

**Tech Stack:** React 19, TypeScript, i18next, Vite prerender (`scripts/seo-routes.mjs`), LocaleLink / `/:lang` routing, existing SeoHead / structured-data.

**Branch:** `feat/nuzlocke-seo-landing`  
**Do NOT commit** unless the controller explicitly asks — leave a dirty working tree.

**Product truth (do not invent):**
- Full atlas + encounters: Kanto, Johto, Hoenn, Sinnoh, Unova (Gen 1–5).
- Gen 6–9 exist as freeform/low coverage — mention honestly, do not SEO-claim full encounter tables.
- USP: solo + multiplayer / Soul Link realtime.
- No Radical Red / Renegade Platinum / Infinite Fusion pages.

**Satellite slugs (EN, same in DE URL — localization at render edge only):**
- `soul-link`
- `firered` → region kanto, versions firered/leafgreen
- `emerald` → hoenn
- `platinum` → sinnoh
- `heartgold` → johto (HGSS)
- `black-white` → unova

**Reserved-slug guard:** `NuzlockeRun` / router must not treat these as `runId`. Prefer explicit `<Route path="nuzlocke/<slug>">` entries listed before `nuzlocke/:runId`.

---

## File map

| Path | Responsibility |
|---|---|
| `src/lib/nuzlocke-seo.ts` | Slug registry, region/game mapping, helpers `isNuzlockeSeoSlug`, CTA query builders |
| `src/pages/nuzlocke/NuzlockeSeoSections.tsx` | Reusable hub SEO blocks (features, games, multi, FAQ, cluster links) |
| `src/pages/nuzlocke/NuzlockeGuidePage.tsx` | Shared template for satellite pages |
| `src/pages/Nuzlocke.tsx` | Mount SEO sections under existing hub UI |
| `src/App.tsx` | Register satellite routes before `:runId` |
| `src/lib/seo.ts` | Meta title/description for hub (tighten) + each satellite |
| `src/lib/structured-data.ts` | Breadcrumbs for `/nuzlocke/*`; FAQPage schema helper; SoftwareApplication for satellites if appropriate |
| `scripts/seo-routes.mjs` | Add all new static routes |
| `src/i18n/locales/{en,de}/translation.json` | All new UI/SEO copy under `nuz.seo` + per-guide keys |
| `src/components/Footer.tsx` (optional) | Link to hub / soul-link if natural |
| Tests | Route/slug registry + meta presence smoke tests |

---

### Task 1: Routing, slug registry, SEO meta stubs, prerender

**Files:**
- Create: `src/lib/nuzlocke-seo.ts`
- Create: `src/lib/nuzlocke-seo.test.ts`
- Modify: `src/App.tsx`
- Modify: `src/lib/seo.ts`
- Modify: `scripts/seo-routes.mjs`
- Modify: `src/lib/structured-data.ts` (breadcrumb trail for `/nuzlocke/<slug>`)

**Acceptance:**
- Registry exports `NUZLOCKE_SEO_SLUGS` and page configs (slug, regionId, target keywords, map path, wizard query).
- Routes: `nuzlocke/soul-link`, `nuzlocke/firered`, `nuzlocke/emerald`, `nuzlocke/platinum`, `nuzlocke/heartgold`, `nuzlocke/black-white` → lazy `NuzlockeGuidePage` (can stub component that returns null/placeholder until Task 4 — prefer thin real shell).
- `metaForPath` returns unique title/desc EN+DE for each rest path; titles ~50–60 chars, descriptions ~150–160 (seo-onpage).
- `STATIC_ROUTES` includes all new paths.
- Breadcrumb: Home → Nuzlocke Tracker → page name.
- Tests for slug list + `isNuzlockeSeoSlug` + meta non-empty.
- `npx vitest run src/lib/nuzlocke-seo.test.ts` green.

- [ ] Step 1: Add registry + tests (TDD)
- [ ] Step 2: Wire App routes + seo meta + seo-routes + breadcrumbs
- [ ] Step 3: Verify vitest

---

### Task 2: Hub SEO sections component + FAQPage schema

**Files:**
- Create: `src/pages/nuzlocke/NuzlockeSeoSections.tsx`
- Modify: `src/lib/structured-data.ts` — add `faqPageSchema(qa: {q,a}[])` and emit on `/nuzlocke` (+ later guides)
- Modify: SeoHead path if needed so FAQ JSON-LD is injected for hub (check how schemas are selected — extend `schemasForRoute` or page-level injection pattern already used)

**Acceptance:**
- Component renders (prerender-safe, no client-only gates): Features H2, Supported games H2, Soul Link/Multi H2, QaSection FAQ, internal links to satellites + maps/team/versus.
- Exactly one H1 remains on hub (existing title) — SEO sections use H2/H3 only.
- FAQ answers are unique vs intro (AGENTS.md: no duplicate copy blocks).
- FAQPage JSON-LD matches visible Q&A text.
- Follow design density / Holo-Dex (pixel labels, surface panels) like BattleLanding.

- [ ] Step 1: FAQ schema helper + unit test if easy
- [ ] Step 2: Build `NuzlockeSeoSections` reading i18n keys (keys can be stubbed with EN/DE placeholders if Task 3 owns final copy — prefer real structure)
- [ ] Step 3: Mount from `Nuzlocke.tsx` below `WhatIsNuzlocke` (or replace thin WhatIs with richer SEO sections — keep WhatIs if still useful, avoid duplicate “what is” paragraphs)

---

### Task 3: Hub copy EN/DE (seo-onpage + humanizer)

**REQUIRED SKILL:** Read and follow `/home/rin/Work/_private/pkdx/.agents/skills/seo-onpage/SKILL.md` before writing meta/body.

**Files:**
- Modify: `src/i18n/locales/en/translation.json`
- Modify: `src/i18n/locales/de/translation.json`
- Modify: `src/lib/seo.ts` hub meta if copy improvements needed
- Possibly trim `nuz.whatIsSection` overlap so hub doesn’t repeat the same paragraph twice

**Target query hub:** EN `nuzlocke tracker` · DE `Nuzlocke-Tracker` / `nuzlocke tracker deutsch`

**Copy requirements (seo-onpage 8 dimensions):**
- Features: encounters per route, deaths/graveyard, team, maps integration, solo + multi/Soul Link, free in browser
- Games list: Gen 1–5 named; Gen 6–9 freeform honesty
- FAQ: 8–10 questions; DE official terms; no du-form; no em-dash chains; no AI slop
- Soft CTA in meta where natural
- Key parity EN↔DE

- [ ] Step 1: Write full `nuz.seo.*` (or agreed namespace) in EN
- [ ] Step 2: Write DE parity
- [ ] Step 3: Self-check title/meta lengths and no duplicate Q&A vs intro

---

### Task 4: Satellite guide pages + copy

**REQUIRED SKILL:** `.agents/skills/seo-onpage/SKILL.md` for each page’s title/meta/H1/H2.

**Files:**
- Create/finish: `src/pages/nuzlocke/NuzlockeGuidePage.tsx`
- Modify: i18n EN/DE under `nuz.guides.<slug>.*`
- Modify: `src/lib/seo.ts` (finalize metas)
- Modify: structured-data FAQ for guide pages if Q&A present

**Each guide page must include:**
- H1 with primary query paraphrase
- Intro answering intent in first paragraph
- What this tracker does for *this* game/mode
- 1 concrete example tied to real region/routes (use region names / Route 1 style facts you can verify from maps data — no fake rates)
- CTA `LocaleLink` to `/nuzlocke?wizard=1&region=<id>` (verify wizard already reads `region` query — it does via `presetRegion`)
- Link to `/maps/<region>`
- Link back to `/nuzlocke`
- FAQ 3–5 items unique per page
- ~600–900 words equivalent across sections (quality > stuffing)
- Soul-link page emphasizes multiplayer USP; no fake game coverage

**Do not** create Radical Red etc.

- [ ] Step 1: Guide page template
- [ ] Step 2: EN+DE copy for all 6 slugs
- [ ] Step 3: Smoke: routes render H1 from i18n

---

### Task 5: Internal links, tests, typecheck

**Files:**
- Hub cluster links (Task 2/3)
- Guide cross-links
- Optional Footer link
- Tests for routes in seo-routes / meta
- Run `npx tsc -b` and relevant vitest

**Acceptance:**
- Every satellite linked from hub; hub linked from satellites
- `npx tsc -b` 0 errors
- vitest for nuzlocke-seo (+ any new tests) green
- No hardcoded `/pokemon` navigations — LocaleLink / useLocalePath only

- [ ] Step 1: Link audit
- [ ] Step 2: tsc + vitest
- [ ] Step 3: Report final file list

---

## Out of scope (Phase 2 later)

- Region hub pages `/nuzlocke/kanto` etc.
- `/nuzlocke/regeln` dedicated rules page
- ROM hack pages
- Committing / PR (controller or user)

## seo-onpage reminder for content agents

Score mentally: Title, Meta, Headers, Body, Internal links, Images (N/A ok), URL slug, Schema. Fail the task if H1 missing, meta >160 DE/EN, or FAQ duplicates intro.
