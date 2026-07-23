# Versus calc verification

Versus damage/stats are **not** hand-rolled formulas. All numeric output flows:

`VersusSide` → `buildMon()` / `buildCalcField()` → `@smogon/calc` → `damageBetween()` / `statsOf()`.

## Test suite

```bash
npm test   # 1300+ cases — versus.test.ts + versus-matrix.test.ts
```

| Layer | File | What it proves |
|---|---|---|
| Regression | `src/lib/versus.test.ts` | Known scenarios (screenshot parity, Thick Fat EFF, weather, Dream Eater, …) |
| Matrix | `src/lib/versus-matrix.test.ts` | Exhaustive dimension sweeps + 800 fuzz cross-products |
| Independent bridge | `src/lib/versus-test-reference.ts` | Duplicate VersusSide→CalcPokemon mapping must match production exports |

## Coverage matrix (every dimension swept)

| Parameter | Coverage |
|---|---|
| **Gen / Spiel** | Gen 1–9 baseline + **every** `versusGameOptions()` slug (~40 games) |
| **Level** | 1, 5, 50, 100 × all gens |
| **Status** | none, burn, par, psn, slp, frz × attacker & defender × all gens |
| **Ability** | null, Thick Fat, Levitate, Huge Power, Flash Fire, Overgrow × atk/def × all gens |
| **Item** | null, Choice Band, Life Orb, Assault Vest, Charcoal × all gens |
| **Weather** | all `VERSUS_WEATHER_OPTIONS` × sanitize per **version group** |
| **Terrain** | all `VERSUS_TERRAIN_OPTIONS` × sanitize per **version group** |
| **Nature / EV** | Adamant + 252 Atk/Spe (gen 3+) |
| **Moves** | physical + special + status + fixed-damage (Seismic Toss, Sonic Boom) per gen |
| **UI wiring** | `sideToVersus()` → calc parity |
| **Fuzz** | 800 random cross-products of the above |

Each case asserts:

1. `pokemonFromVersusSide()` stats === independent duplicate builder  
2. `damageBetween().range` === `smogonReferenceRange()` (same @smogon/calc path)  
3. `pct[]` derived correctly from range / defender HP  
4. UI weather/terrain options survive `sanitizeVersusField()` per **version group** (FRLG/LGPE/LA: none; BDSP: weather only; …)

## Explicit non-goals

- **Not** every Pokémon species × every move (1025×900+ combos) — infeasible; any valid `VersusSide` uses the same tested mapping.  
- **Not** full turn simulation (turn order beyond speed display, switching, multi-turn effects).  
- **Move pool legality** per version group is PokéAPI-driven in UI; matrix tests calc math, not learnset membership for every species.

## Adding a new field mechanic

1. Extend `VersusSide` / `buildMon` / `buildCalcField`.  
2. Mirror mapping in `versus-test-reference.ts`.  
3. Add sweep rows in `versus-matrix.test.ts`.  
4. Run `npm test && npm run build`.
