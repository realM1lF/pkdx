# Reddit r/gamedev — post (EN)

## ⚠️ Rules check (before posting)

> Last reviewed: Jul 2026 — **re-read live rules** ([r/gamedev rules](https://www.reddit.com/r/gamedev/about/rules) · [Reddit Rules](https://www.redditinc.com/policies/reddit-rules)).

| Check | Details |
|---|---|
| **Thread only** | Standalone self-promo is removed — use **Screenshot Saturday** or **Feedback Friday** megathreads only |
| Dev angle | Post-mortem / tech (lazy @pkmn/sim chunk), not marketing copy |
| No blatant promo | Rule text: link-only social/game pages → ban risk |
| Participation | Comment on other dev threads regularly |
| Cross-post | Do **not** paste this verbatim to other subs the same week |

**Sources:** [r/gamedev rules](https://www.reddit.com/r/gamedev/about/rules) (verify "No Blatant Self Promotion" still active).

---

**⚠️ Only post during [Showcase Saturday](https://www.reddit.com/r/gamedev/search/?q=Showcase%20Saturday) or [Feedback Friday](https://www.reddit.com/r/gamedev/search/?q=Feedback%20Friday). Standalone self-promo gets removed.**

**Flair:** Showcase / Feedback

**Title suggestion (Showcase Saturday):** Showcase: Built a turn-by-turn 1v1 Pokémon battle sim in the browser (@pkmn/sim) as part of a fan toolkit

**Body:**

Not a commercial game — hobby web project — but the battle engine chunk might be interesting to gamedev folks.

**Context:** MyPokePanion is a bilingual Pokémon companion site (dex, maps, Nuzlocke tools). I added a **1v1 micro-battle** inside the Versus lab: same matchup setup as the damage calc, but you can hit "Start battle" and play turn-by-turn.

**Tech:**
- React 19 + TypeScript, battle UI lazy-loaded so @pkmn/sim stays out of the main bundle
- Engine wrapper in `src/lib/battle/engine.ts` — snapshots + event log, AI modes (random / greedy via calc ranges)
- Damage side uses @smogon/calc; battle side uses @pkmn/sim with gen-aware context from the selected game

**What I'd like feedback on:**
- Does the lazy-load split feel worth the complexity?
- Greedy AI is calc-based — any better heuristics for a 1v1 sandbox?
- General UX of switching between "spreadsheet calc" and "playable arena"

Live: https://mypokepanion.com/en/versus  
Repo: https://github.com/realM1lF/pkdx

Fan project, not affiliated with Nintendo. Happy to answer implementation questions.

**Do not cross-post this verbatim to other subs the same week.**
