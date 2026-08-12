# Orre Shadow Pokémon — Provenance

Sourcing notes for `src/data/orre/colosseum.json` and `src/data/orre/xd.json`.
Keep each game's section self-contained; do not delete the other game's
section when editing this file.

## Colosseum

**Artifact:** `src/data/orre/colosseum.json` — 48 shadows, `game: "colosseum"`.

### Sources

- Bulbapedia, [List of Shadow Pokémon](https://bulbapedia.bulbagarden.net/wiki/List_of_Shadow_Pok%C3%A9mon)
  (primary — Colosseum rows: species, level, held item, trainer,
  first/reappear location column; 48 rows, excluding the 3 Japan-only
  e-Reader exclusives Togepi/Mareep/Scizor which the page itself
  footnotes as not part of the standard roster)
- Bulbapedia, [Walkthrough:Pokémon Colosseum](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Colosseum)
  Parts 1, 2, 5, 6, 7, 8, 9 (narrative walkthrough — used to establish
  story order and to confirm named sub-locations: Mayor's House, Relic
  Stone, The Under vs. The Under Subway, Realgam Tower vs. Realgam
  Tower Dome vs. Tower Colosseum, Snagem Hideout as the postgame
  missed-Shadow hub)
- Bulbapedia, [Nascour](https://bulbapedia.bulbagarden.net/wiki/Nascour) and
  [Pokémon Colosseum](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Colosseum)
  main article (confirms the unique "Cipher" trainer class for Nascour
  and the overall Cipher Admin defeat order: Miror B. → Dakim → Venus →
  Ein → Realgam Tower admins → Gonzap → Nascour → Evice)
- dragonflycave.com, [Shadow List](https://www.dragonflycave.com/orre/shadow-pokemon-list/)
  (secondary — "Location 1 / Location 2 / Location until snagged"
  detail used for `reappear` logistics; corroborates trainer names)
- Serebii.net, [Pokémon Colosseum: Available Pokémon](https://www.serebii.net/colosseum/pokemon.shtml)
  (tertiary cross-check for levels/locations/trainer names; also
  confirms the starter-trio footnote: the two un-chosen starters
  reappear post-credits, one at the Shadow Research Lab, one at Snagem
  Hideout)
- A GameFAQs walkthrough transcript (via search snippets) — tertiary
  sanity check only, for the Tower Colosseum gauntlet order and as a
  (lower-confidence) data point on Absol's level

Exactly 48 entries matched the `Colo` column on Bulbapedia's master
table (Makuhita through Togetic).

### Story order methodology

`order` follows the geographic/story progression of the main
walkthrough (Phenac City → Pyrite Town/Building/Cave → Miror's Hideout
→ Relic Stone (Agate) → Mt. Battle → The Under → The Under Subway →
Shadow Pokémon Lab → Realgam Tower Dome → Realgam Tower → Tower
Colosseum → postgame: Snagem Hideout / Deep Colosseum / Outskirt
Stand). Within one shared location (e.g. the 7-shadow Shadow Pokémon
Lab room, the 6-shadow Tower Colosseum gauntlet), the exact NPC-by-NPC
battle order was not re-verified frame-by-frame against video footage;
entries follow Bulbapedia's table order and the walkthrough text where
it was explicit (the Tower Colosseum gauntlet order — Jomas → Delan →
Nella → Ston → Nascour → Evice — is confirmed by a GameFAQs walkthrough
transcript). `order` is guaranteed unique and monotonic with area
progression, not necessarily exact to the minute-by-minute sequence
within one room.

### Conflicts resolved

- **Qwilfish's location**: Bulbapedia says "Pyrite Bldg"; dragonflycave
  says "Pyrite Town"; Serebii says "Outside Pyrite Cave". Grouped under
  **Pyrite Town** (`orre-pyrite-town-doken`) — 2-of-3 sources point to
  the open town area rather than the interior building; documented via
  a `notes` field on the entry.
- **Ledian's level**: Bulbapedia + dragonflycave say Lv. 40; Serebii
  says Lv. 43. Used **Lv. 40** (2-source majority).
- **Absol's level**: Bulbapedia + Serebii say Lv. 48; one GameFAQs
  walkthrough transcript says "Dark 46". Used **Lv. 48** (2 authoritative
  sources vs. one lower-confidence fan transcript).
- **Skarmory's trainer class**: Bulbapedia table says "Snagem Head
  Gonzap"; Serebii + the GameFAQs transcript say "Snagem Leader
  Gonzap". Used **Snagem Leader Gonzap** (2-of-3 sources).
- **Miltank's trainer name**: Bulbapedia + dragonflycave say "Jomas";
  Serebii says "Jonas". Used **Jomas** (2-of-3 sources).
- **Starter trio's displayed trainer class**: Bulbapedia says "Cipher
  Peon {Verde,Rosso,Bluno}"; dragonflycave + Serebii say "Mystery
  Troop {Verde,Rosso,Bluno}". Used **Mystery Troop** (the disguise
  identity actually shown in the battle, per 2 sources); the true
  Cipher identity is noted in each entry's `notes`.
- **Togetic's trainer class**: Bulbapedia says "Cipher Peon Fein";
  dragonflycave says "Fake Hero Fein"; Serebii says "Cipher Peon Grunt
  Fake". Used **Cipher Peon Fein** (Bulbapedia's canonical table;
  "Fake Hero" reads as Fein's in-story nickname, not his battle class).
- **Shadow Pokémon Lab peons' reappear location** (Aipom/Murkrow/
  Forretress/Ariados/Granbull/Vibrava): Bulbapedia's compact master
  table lists only "Shadow PKMN Lab" (single location) for these six;
  dragonflycave and the Part 9 aftergame walkthrough both describe them
  relocating to Snagem Hideout if missed. Used dragonflycave + the
  walkthrough (Snagem Hideout as `reappear.locationId`) — Bulbapedia's
  compact table appears to record only the first-encounter location for
  these six rows.
- **Yanma's reappear location**: Bulbapedia lists "Pyrite Bldg/ Snagem
  Hideout" (two locations); dragonflycave lists only "Pyrite Building"
  with no fallback. Used Bulbapedia's fuller chain (Snagem Hideout as
  fallback).

None of these conflicts affect species identity, and all are minor
(level ±3, trainer-class wording, or which of two adjacent named
sub-areas a trainer stands in). No contradiction required escalation.

### Design decisions

- **`locationId` splitting (Nuzlocke 1-slot rule)**: every named place
  shared by more than one first-encounter shadow was split into
  per-trainer location IDs (e.g. `orre-pyrite-town-lon`,
  `orre-pyrite-town-nover`, …) so each mandatory snag maps to a unique
  Nuzlocke `route_key`. Generic reappear-only hubs
  (`orre-snagem-hideout`, `orre-deep-colosseum`) are intentionally
  *shared* across many entries' `reappear.locationId` — reappear spots
  are optional catch-up locations, not unique mandatory slots, so
  sharing there is correct.
- **`required: false`** is used only for the 4 shadows whose first (and
  only) encounter is strictly postgame-gated and outside the main
  story's critical path: Smeargle/Biden and Ursaring/Agrev (Snagem
  Hideout only opens after the credits), Shuckle/Agnol (Deep Colosseum
  only opens after Gonzap is defeated), and Togetic/Fein (Outskirt
  Stand, gated behind snagging the other 47). All other 44 entries are
  trainer battles that block main-story progress even if the shadow
  itself is missed on that encounter.
- **Starter trio ambiguity**: Bayleef/Quilava/Croconaw are all marked
  `required: true` (the battle to leave Phenac City is unavoidable)
  with a `kind: "postgame"` reappear note, since the game randomizes
  which of the two un-chosen starters ends up at the Shadow Pokémon Lab
  vs. Snagem Hideout — a fixed `reappear.locationId` would be
  misleading, so the ambiguity is described in the note text instead.
- **Suicune's move variant** (Surf vs. Hydro Pump depending on snag
  location) is recorded in `notes` since it's a well-documented,
  verifiable in-game fact (Bulbapedia's Shadow Pokémon trivia section)
  rather than an invented purification detail.
- No purification-mechanic optimizer tips or XD data were added, per
  task instructions. Colosseum has no Miror Radar (that mechanic is
  XD-only); none of these 48 entries use `kind: "miror-radar"`.

### Distinct `locationId` values (for the Task 4 region builder)

50 distinct IDs total: 48 primary (one per shadow, all unique) + 2
generic reappear-only hubs (`orre-snagem-hideout`,
`orre-deep-colosseum`). Some reappear targets reuse an existing
*primary* node instead of needing a new ID (e.g. `orre-mirors-hideout`
is both Sudowoodo's primary node and a reappear target for
Remoraid/Mantine).

```
orre-deep-colosseum
orre-deep-colosseum-agnol
orre-mirors-hideout
orre-mt-battle
orre-outskirt-stand
orre-phenac-city-bluno
orre-phenac-city-rosso
orre-phenac-city-verde
orre-phenac-mayors-house
orre-pyrite-building-ferma
orre-pyrite-building-nore
orre-pyrite-building-reath
orre-pyrite-cave-sosh
orre-pyrite-cave-twan
orre-pyrite-cave-zalo
orre-pyrite-town-cail
orre-pyrite-town-diogo
orre-pyrite-town-divel
orre-pyrite-town-doken
orre-pyrite-town-leba
orre-pyrite-town-lon
orre-pyrite-town-nover
orre-pyrite-town-vant
orre-realgam-dome-arton
orre-realgam-dome-baila
orre-realgam-dome-dioge
orre-realgam-tower
orre-relic-stone
orre-shadow-lab-cole
orre-shadow-lab-ein
orre-shadow-lab-lare
orre-shadow-lab-lesar
orre-shadow-lab-remil
orre-shadow-lab-tanie
orre-shadow-lab-vana
orre-snagem-hideout
orre-snagem-hideout-agrev
orre-snagem-hideout-biden
orre-the-under-kloak
orre-the-under-venus
orre-tower-colosseum-delan
orre-tower-colosseum-evice
orre-tower-colosseum-jomas
orre-tower-colosseum-nascour
orre-tower-colosseum-nella
orre-tower-colosseum-ston
orre-under-subway-frena
orre-under-subway-liaks
orre-under-subway-lonia
orre-under-subway-nelis
```

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
