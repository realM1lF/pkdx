# Orre Shadow Pokémon — Provenance

Sourcing notes for `src/data/orre/colosseum.json` and `src/data/orre/xd.json`.
Keep each game's section self-contained; do not delete the other game's
section when editing this file.

## XD: Gale of Darkness

**Artifact:** `src/data/orre/xd.json` — 83 shadows, `game: "xd"`.

### Sources

- Bulbapedia, [Walkthrough:Pokémon XD/Shadow Pokémon list](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_XD/Shadow_Pok%C3%A9mon_list)
  (primary — raw wikitext pulled via `action=raw`, machine-parsed for
  dex no./name/level/moves/trainer class+name/location, 83 rows, order
  matches in-game acquisition sequence)
- Bulbapedia, [List of Shadow Pokémon](https://bulbapedia.bulbagarden.net/wiki/List_of_Shadow_Pok%C3%A9mon)
  (cross-check — same underlying table data, used to confirm the Phenac
  City vs. Phenac Stadium split)
- Bulbapedia, [Walkthrough:Pokémon XD/Part 4](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_XD/Part_4)
  (primary narrative walkthrough — used to resolve the Swinub (trainer
  Greck) location ambiguity: fought in the Phenac City streets on the
  way to the stadium, not inside Phenac Stadium itself)
- Bulbapedia, [Miror B.](https://bulbapedia.bulbagarden.net/wiki/Miror_B.) and
  [Miror Radar](https://bulbapedia.bulbagarden.net/wiki/Miror_Radar)
  (Miror B. Radar / missed-Shadow-Pokémon recovery mechanic, the three
  fixed Miror B. encounters, and the Voltorb-loss softlock risk)
- Bulbapedia, [ONBS](https://bulbapedia.bulbagarden.net/wiki/ONBS) and
  [Prestige Precept Center](https://bulbapedia.bulbagarden.net/wiki/Prestige_Precept_Center)
  (confirmed these are real, distinct in-game buildings in Pyrite Town /
  Phenac City respectively, not typos)
- TheGamer, [All Pokemon In Pokemon XD: Gale of Darkness](https://www.thegamer.com/pokemon-xd-gale-of-darkness-available-pokemon-complete-list-guide/)
  (independent secondary source — full 83-row table, agrees with
  Bulbapedia on every trainer name and location; used as tiebreaker
  against Serebii typos, see below)
- Serebii, [Pokémon XD - Pokémon](https://serebii.net/xd/pokemon.shtml)
  (secondary source, consulted but a few trainer-name spellings
  disagreed with Bulbapedia+TheGamer and were treated as typos — see
  Conflicts)

### Conflicts resolved

- **Duskull's trainer**: Serebii spells it "Cipher Peon Labor"; Bulbapedia
  and TheGamer both say "Lobar". Used **Lobar** (2-source majority,
  matches Bulbapedia's dedicated `Lobar` character page).
- **Lickitung's trainer**: Serebii "Gefta" vs. Bulbapedia/TheGamer
  "Geftal". Used **Geftal**.
- **Dugtrio's trainer**: Serebii "Cipher Peon Stron" vs. Bulbapedia/
  TheGamer "Cipher Peon Kolax". Used **Kolax**.
- **Swinub's location**: Serebii and TheGamer both bucket it under
  "Phenac Stadium"; Bulbapedia's table and its Part 4 walkthrough
  narrative say plain "Phenac City" (fought in the streets en route to
  the stadium, before entering the building). Used **Phenac City**
  (primary narrative source, not just a summary table).
- **Nosepass's location**: the shadow-list table lists "Pyrite
  Colosseum/Realgam Colosseum/Poké Spots" (i.e. wherever Miror B.
  happens to reappear), but the Miror B. article and TheGamer both
  clarify the *first* encounter is at the **Outskirt Stand** and cannot
  be snagged there (no Snag Machine yet). Modeled as
  `locationId: "orre-outskirt-stand-2"` with a `reappear` block
  documenting the actual (randomized) snag locations via the Miror
  Radar, `kind: "miror-radar"`.
- **Dragonite's location**: the shadow-list table just says "Gateon
  Port"; the Miror B. article and TheGamer specify **Gateon Port's
  lighthouse**, appearing only after all other 82 shadows are snagged.
  Used the more specific `orre-gateon-port-lighthouse`, `required:
  false`, `reappear.kind: "postgame"`.

### Design decisions

- **`locationId` splitting (Nuzlocke 1-slot rule)**: 12 distinct in-game
  locations host more than one shadow (e.g. 36 at Citadark Isle, 14 at
  Cipher Key Lair, 11 at Cipher Lab, 5 at ONBS, etc.). Each shadow at a
  shared location got a numeric suffix in acquisition order
  (`orre-citadark-isle-1` … `orre-citadark-isle-36`, etc.) so every one
  of the 83 has a unique `locationId`. All distinct base locations:
  `orre-pokemon-hq-lab`, `orre-gateon-port` (×2), `orre-cipher-lab`
  (×11), `orre-cave-poke-spot`, `orre-onbs` (×5), `orre-phenac-city`
  (×3), `orre-prestige-precept-center` (×3), `orre-phenac-stadium`
  (×4), `orre-outskirt-stand` (×2), `orre-cipher-key-lair` (×14),
  `orre-citadark-isle` (×36), `orre-gateon-port-lighthouse`.
- **Miror B. Radar mechanic — not repeated on every entry**: in XD,
  almost any trainer-owned Shadow Pokémon (all Cipher Peons/Admins/etc.)
  *can* be missed if KO'd instead of snagged, in which case Miror B.
  picks it up and the Miror Radar (obtained after the Cave Poké Spot
  Voltorb fight) leads the player to him at Pyrite Colosseum, Realgam
  Colosseum, or one of the three Poké Spots for a rematch. Documenting
  this identical caveat on ~79 entries would be pure duplication, so it
  is recorded once here; per-entry `reappear` blocks are reserved for
  the 3 encounters with genuinely unique mechanics (Voltorb, Nosepass,
  Dragonite — see below).
- **`required`**: `true` for all 82 entries obtained during mandatory
  story battles (or, for Togepi, a mandatory story gift). `false` only
  for **Dragonite**, since it is a post-game-only bonus gated behind
  catching the other 82 first.
- **Voltorb** (`reappear.kind: "story-lock"`): this is the very first
  Miror B. fight (Cave Poké Spot) and grants the Miror Radar on
  completion — if it's lost without snagging, the player has no radar
  yet to track Miror B. down again, and a known game bug can make
  Voltorb (and therefore the endgame Dragonite) permanently
  unobtainable.
- **No purification optimizer tips were added**, per task instructions.

### Distinct `locationId` values (35 base locations after splitting counts)

`orre-pokemon-hq-lab`, `orre-gateon-port-1/2`, `orre-cipher-lab-1..11`,
`orre-cave-poke-spot`, `orre-onbs-1..5`, `orre-phenac-city-1..3`,
`orre-prestige-precept-center-1..3`, `orre-phenac-stadium-1..4`,
`orre-outskirt-stand-1..2`, `orre-cipher-key-lair-1..14`,
`orre-citadark-isle-1..36`, `orre-gateon-port-lighthouse`.
