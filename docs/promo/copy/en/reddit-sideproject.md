# Reddit r/SideProject — post (EN)

## ⚠️ Rules check (before posting)

> Last reviewed: Jul 2026 — **re-read live rules** ([r/SideProject rules](https://www.reddit.com/r/SideProject/about/rules) · [Reddit Rules](https://www.redditinc.com/policies/reddit-rules)).

| Check | Details |
|---|---|
| Own projects OK | Sharing what you built is the point — still needs context/story, not a bare landing page |
| Flair | Use **Feedback** if available |
| Participation | Even here: answer other people's posts; pure link-drops get removed |
| ~10% guideline | Don't make every post about your project across Reddit |
| One sub per day | Don't cross-post identical copy same day |

**Don't:** marketing buzzwords, "please upvote", spam the same link weekly.

---

**Title suggestion:** MyPokePanion — bilingual Pokémon companion I built because my Nuzlocke had too many browser tabs open

**Body:**

**Problem:** Playing Pokémon at my desk meant 5–6 tabs — dex, encounters, type chart, calc, team sheet. Every fight was alt-tab roulette.

**What I built:** MyPokePanion — a dark fan site that bundles the tools I kept reaching for:

- Pokédex (1025 mons, Gen 1–9)
- Region maps with encounter data
- Nuzlocke tracker (localStorage solo + Supabase multiplayer)
- Team builder with legality across 21 version groups
- **Versus lab** — @smogon/calc damage ranges, KO odds, *and* a playable **1v1 battle simulator** (@pkmn/sim) from the same matchup screen
- Full EN/DE UI

**Stack:** React 19, TypeScript, Vite, Tailwind, Supabase Realtime, PokéAPI, @pkmn/data

Hobby project — I ship when I have evenings free. Not a startup, not affiliated with Nintendo.

**Live:** https://mypokepanion.com/en  
**Feedback:** https://mypokepanion.com/en/feedback (GitHub issues)  
**Repo:** https://github.com/realM1lF/pkdx

Curious what you'd expect from a "Pokémon ops deck" like this. What would make you bookmark it?
