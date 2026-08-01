# Hacker News — Show HN (EN)

## ⚠️ Rules check (before posting)

> Last reviewed: Jul 2026 — **official guidelines:** [Show HN](https://news.ycombinator.com/showhn.html) · [HN News Guidelines](https://news.ycombinator.com/newsguidelines.html).

| Check | Details |
|---|---|
| Title | Must start with **`Show HN:`** — neutral, no hype/exclamation marks |
| Tryable | People must use it immediately — no signup wall, no waitlist-only |
| Not a blog post | Landing pages / reading material ≠ Show HN; link the app itself |
| Present | Stay in thread for hours — answer technical questions |
| Non-trivial | Hobby project with real work is fine; one-off generated junk is not |
| Upvotes | **Never** ask friends to upvote or comment — against HN rules |

**Don't:** delete and repost; submit before multiplayer/calc/battle sim actually works.

---

**Title (submit form):** Show HN: MyPokePanion – bilingual Pokémon companion (dex, maps, Nuzlocke, team builder, 1v1 battle sim)

**URL:** https://mypokepanion.com/en

**First comment (post immediately after submit):**

Hey HN — I built this because Nuzlocke runs kept turning into a tab-management problem. Wiki for encounters, separate calc, separate team sheet, repeat.

MyPokePanion bundles what I wanted at the desk:

- Pokédex (Gen 1–9, fuzzy search EN/DE)
- Region maps with encounter data
- Nuzlocke tracker — solo (localStorage, offline) or multiplayer (Supabase Realtime, invite codes)
- Team builder with legality + Showdown export
- Versus lab — @smogon/calc damage ranges *and* a turn-by-turn 1v1 fight simulator (@pkmn/sim, lazy-loaded)

Stack: React 19, TypeScript, Vite 7, Tailwind, i18next (URL routing /en and /de), PokéAPI with SWR-style cache, @pkmn/data + @smogon/calc + @pkmn/sim for the battle engine.

Fan project, not affiliated with Nintendo. Free, no ads. Evenings/weekends project, I ship regularly.

Feedback: https://mypokepanion.com/en/feedback  
GitHub: https://github.com/realM1lF/pkdx

Happy to talk architecture, i18n, or why I chose local-first Nuzlocke with optional sync. Also happy to hear what's broken.
