# Plan: „Arena" — TCG-Sammlung + Kampfsystem (MyPokePanion)

**Status: v2 — gegenverifiziert durch 5 Subagents (Backend, Balancing, Kampf-Logik, Frontend/Perf, Legal).**
Erstellt: 2026-07-24. Verifiziert: 2026-07-24. Kein Code bisher.
**LOCKED** = User-Entscheidung. **V-Blocker aus Verifizierung eingearbeitet.**

---

## 0. Vision

Geschlossener Loop: **Packs ziehen → Sammlung → 6er-Team aus eigenen Karten → kämpfen (KI, später PvP) → Belohnungen → mehr Packs.**
Zwei Kampf-Schichten:
- **Schicht A „Card-native"** (MVP): vereinfachtes TCG-Regelwerk direkt mit Kartenwerten.
- **Schicht B „Sim-Bridge"**: Karte → Dex-Pokémon → echte Mechanik via `@pkmn/sim` (lazy, ~1,06 MB gzip), 6v6.

Visuell: Pack-Opening-Theater + Kampf-Theater mit animierten Gen-5-Sprites (front/back, **lokal gebündelt**, s. §8), typgefärbte FX. Keine fremden Animations-Assets (Showdown-Client = AGPLv3 → tabu).

---

## 1. LOCKED Entscheidungen (User)

| # | Entscheidung |
|---|---|
| L1 | 2–3 Packs/Tag Basis → **v2-Empfehlung: 3 Packs** (Balancing-Verifier, s. §5.1) |
| L2 | Echte TCG-Pull-Raten müssen sich echt anfühlen — **+ Pity-System (v2, Pflichtergänzung)** |
| L3 | 6er-Duelle |
| L4 | Nur eigene gezogene Karten spielbar |
| L5 | Kein Trading vorerst |
| L6 | Experimental-Flag |
| L7 | Eigene Pack-Designs im Holo-Dex-Stil, keine offiziellen Designs/Logos |

## 2. OFFENE Entscheidungen (Empfehlung, User bestätigt)

| # | Frage | Empfehlung |
|---|---|---|
| O1 | Level-Modell Schicht B | **c) Hybrid**: PvE Rarity-Level (Spread klein: 40–70), PvP fix 50 (Sim verarbeitet beliebige Level — verifiziert) |
| O2 | Duplikate | **Recycling → Dust** (Preise s. §5.4) |
| O3 | Belohnungen | Sieg = Bonus-Pack (**Cap 2/Tag**, nur 1. Sieg pro KI-Modus/Tag); Streak → Premium-Pack |
| O4 | Karten-XP/Level | nicht MVP |
| O5 | Sets-Scope Start | 1–3 Sets mit guten SIR-Raten (~1:33, z. B. SV1/SV2/151-artig), keine 1:86-Sets |

---

## 3. Datenquellen & Legal (Legal-Verifier: kein Blocker, 2 Warnungen eingearbeitet)

- **Primär: TCGdex** (MIT, kein API-Key, mehrsprachig DE!, self-hostbar) — technisch bessere Wahl. **Fallback/Ergänzung: pokemontcg.io** (20k req/day mit Key; gehört inzwischen zu Scrydex — Langfrist-Bestand beobachten). **Kartenbilder bleiben © TPCi bei beiden** — rechtlich identisch.
- **Bilder: build-time spiegeln** (nicht hotlinken, nicht runtime-proxien): `small`-Bilder der Scope-Sets (600–1200 Karten ≈ 20–70 MB) als Netlify-Assets/Supabase Storage; `large` on-demand. Gründe: Robustheit (Hotlinking nicht vertraglich garantiert), DSGVO (keine IP-Übertragung ans CDN), Geschwindigkeit.
- **Pull-Raten**: TPCi veröffentlicht **keine offiziellen Raten**. Wir verwenden **community-aggregierte Schätzwerte pro Set** (große Rip-Studien existieren), konfigurierbar in `pull_rates jsonb`, slot-basiert. Odds-Box deklariert: „von der Community geschätzte Raten".
- **Recht**: kein Glücksspiel (kein Einsatz, kein Geldwert, GlüStV n/a), keine USK-Pflicht (Web-Feature). Fan-Duldung ohne offizielle Policy → Pflicht-Disclaimer **auf jeder Arena-Seite**:
  > „Dies ist ein nicht-kommerzielles Fan-Projekt und steht in keiner Verbindung zu Nintendo, Game Freak, Creatures Inc. oder The Pokémon Company. Pokémon und alle Pokémon-Kartenbilder, Charakternamen und Marken sind © Nintendo/Creatures Inc./GAME FREAK inc. bzw. © The Pokémon Company International. Es werden keine Inhalte verkauft; die Nutzung ist kostenlos."
  Takedown-Prozess: durch Bild-Spiegelung technisch sofort abschaltbar. Spendenlink bleibt ohne Perks/Gegenleistung.
- **DSGVO**: Leaderboard/Showroom-Öffentlichkeit = **Opt-in** (`is_public`, default privat), nur Username+Score; Datenschutzerklärung ergänzen; Löschung bei Account-Löschung (cascade).

---

## 4. Datenmodell (Backend-Verifier: Blocker eingearbeitet)

```sql
tcg_sets (set_id text pk, name text, series text, release date, pull_rates jsonb)
tcg_cards_cache (
  card_id text pk, set_id text,
  dex_ids int[],                 -- v2: Array (TAG TEAM hat mehrere); NULL bei Trainer/Energie
  name text, rarity text, hp int, types text[],   -- GIN/B-tree Indizes (set_id, rarity)
  attacks jsonb, ability jsonb, weak_resist jsonb,
  stage text, evolves_from text, -- v2: Evolutionsstufe für Team-Regeln (§5.5)
  img_small text, img_large text
)
tcg_collection (
  user_id uuid references auth.users on delete cascade,
  card_id text references tcg_cards_cache(card_id) on delete restrict,
  count int not null check (count > 0),
  first_pulled timestamptz default now(),
  pk (user_id, card_id)
)
tcg_pack_grants (user_id uuid, day date, packs_claimed int, bonus_claimed int,
  pk (user_id, day))
tcg_duels (
  id uuid pk, p1 uuid, p2 uuid null, mode text check (mode in ('ki-wild','ki-trainer','ki-killer','pvp')),
  winner uuid null, rounds int check (rounds between 1 and 100),
  seed int8, engine_version text, deck_snapshot jsonb,   -- v2: Deck-Snapshot für nachträgliche Validierung
  log_hash text, created_at timestamptz,
  reward_claimed boolean default false                   -- Doppel-Reward-Schutz
  -- Voll-Log NICHT in DB (50–200KB/Duell → Free-Tier-Risiko); nur Hash, Log transient/komprimiert in Storage
)
tcg_profile (user_id pk references auth.users on delete cascade,
  dust int, score int, wins int, losses int, streak int, is_public boolean default false)
```

**RLS (v2, verbindlich):**
- `tcg_collection`, `tcg_pack_grants`, `tcg_duels`, `tcg_profile`: **SELECT owner-only; KEIN Client-INSERT/UPDATE/DELETE** — alle Writes ausschließlich via Edge Functions (Service Role).
- `tcg_cards_cache`, `tcg_sets`: SELECT für alle (auch anon, für Guest-Teaser), kein Client-Write.
- Leaderboard: `SECURITY DEFINER`-View projiziert nur `(username, score, wins)` aus `tcg_profile` wo `is_public`; indizierte Live-Top-100-Query (`score desc`, B-tree) genügt — keine Cron-Materialisierung im MVP. Score wird nur serverseitig gepflegt (in denselben Transaktionen wie Collection-Writes).

**Edge Functions (v2):**
- `open-pack`: komplette Transaktion in **einer** `SECURITY DEFINER` PG-Funktion `open_pack(set_id)` (von Edge Fn mit User-JWT aufgerufen): atomarer Kontingent-Claim via
  `INSERT ... ON CONFLICT (user_id, day) DO UPDATE SET packs_claimed = packs_claimed+1 WHERE packs_claimed + bonus_claimed < CAP RETURNING *` (0 Zeilen → 409), dann RNG (PG `random()`, kein Math.random), Pity-Counter-Update, Collection-Upserts, Score-Update — alles oder nichts (Rollback inkl. Kontingent bei Fehler). Pity-Counter: Spalte in `tcg_profile` (packs_since_ir, packs_since_sir).
- `recycle-cards`, `claim-duel-reward` (Replay-Validierung §6.3, atomar, `reward_claimed`), `daily-missions` (Fortschritt serverseitig).
- Idempotenz: UI sperrt während Claim; „letztes Pack erneut anzeigen"-Endpoint (Retry-Sicherheit).

**Free-Tier-Budget (500 MB)**: cards_cache ≈ 50–80 MB ✓; Collection ~0,3 MB/Heavy-User ✓; Duell-Logs ausgelagert ✓; Monitoring ab ~300 MB.

---

## 5. Gameplay-Loop & Balancing (Balancing-Verifier: 2 Blocker eingearbeitet)

### 5.1 Pack-Ökonomie (echte Raten, verifizierte Zahlen SV-Ära)
ex ~13 %/Pack · IR ~7,5 % · SIR ~3 % (gute Sets) bis 1,2 % (schlechte) · Hyper Rare ~1,9 %.
- **3 Packs/Tag** (L1-Finalisierung): SIR-Median ~11–29 Tage; bei 2 Packs 16–43 Tage = zu frustig.
- **Pity-System (Pflicht bei L2)**: Soft-Pity ab 40 Packs ohne IR+ (Rate ×1,5/×2), Hard-Pity IR+ nach 60, SIR+ nach 100 Packs. Counter in `tcg_profile`, serverseitig, in Odds-Box offengelegt.
- Bonus-Packs: Sieg (Cap 2/Tag, nur 1. Sieg je KI-Modus/Tag), Dust-Kauf (1/Tag, 300 Dust), Streak-7 → Premium-Pack (1.000 Dust-Wert).

### 5.2 Loop
Claim (Countdown) → Opening-Theater → Sammlung (Grid, Filter, Duplikat-Zähler) → Recycling → Team-Bau → Duell → Belohnung → **Daily/Weekly-Missionen** (v2: in MVP-Scope Phase 2! z. B. „Gewinne 1 Duell" 50–150 Dust; First-Win-of-the-Day; Set-Completion-Meilensteine 25/50/75 % → Hüllen/Dust). Showroom: Top-6-Kuratiert, Opt-in öffentlich.

### 5.3 Schicht-A-Duellregeln (v2 — Blocker „keine Spieltiefe" behoben)
6v6, 1 Aktiver + Bank, Ziel: **3 Preispunkte** (K.O. = 1, ex-Karte = 2 — TCG-Pocket-Logik, macht ex Risk/Reward statt dominant).
- **Energie als echte Ressource (Pflicht-Fix)**: 1 Energie pro Zug manuell anlegen, Attacken kosten wie auf der Karte (Kosten in API-Daten vorhanden). Bank-Rückzug kostet 1 Energie. → echte Zug-Entscheidungen.
- Schaden = Kartenwert × Schwäche (×2) − Resistenz (20). `damage`-String-Parsing beachten (kann „", „20+", „×" sein — reine Effekt-Attacken im MVP = 0 Schaden, Effekt ignoriert). Status im MVP: keine.
- **Runden-Cap 100** + Tie-Break (mehr verbleibende Pokémon, dann Rest-HP) — Anti-Endlos-Wall. Gleichzeitiges K.O.: Angreifer gewinnt.
- Eigener deterministischer PRNG: **mulberry32(seed)**.
- Engine als reine TS-Bibliothek (client + Deno-Edge-reproduzierbar, `engine_version`) → Reward-Validierung = serverseitiges Replay von seed+deck_snapshot+choices.

### 5.4 KI & Ökonomie-Tabellen
- KI-Modi gekoppelt an **Team-Tiers**: wild = Common-Team + Random-Züge; trainer = Rare-Mix + Score-Heuristik (Immunität vermeiden, supereffektiv, gewichtet); killer = ex-Team + max-Schaden/Prio-Logik.
- Dust: Common 5 / Uncommon 10 / Rare 25 / Holo 50 / ex 100.

### 5.5 Team-Bau-Regeln (v2)
- 6 Karten, nur aus Collection (L4), jede Karte max. 1× (Dubletten sind Dust).
- **Species-Klausel (Pflicht-Fix)**: max. 2 Karten derselben Evolutionslinie pro Team (sonst degeneriert: 3× Glurak-Linie). Evolutions-Stufen in Schicht A ohne Malus (thematische Vereinfachung, dokumentiert); Schicht B regelt über Level-Modell O1c.

## 6. Kampf-Systeme — Schicht B & PvP (Logik-Verifier: 1 Blocker eingearbeitet)

### 6.1 TCG→Dex-Mapping (⛔ Verifizierter Blocker: Name-Match nur ~37–39 %!)
Empirie (741 Karten/951 Attacken gegen alle 937 Move-Namen): 37 % exakt, 38,8 % normalisiert. 378 TCG-Attackennamen existieren als Move **nicht**. `gen9customgame` akzeptiert Fake-Moves **stillschweigend** (Runde verpufft!) → niemals unmapped durchreichen.
**Fallback-Hierarchie:**
1. Normalisierter Name-Match (+ TCG-Schreibweisen-Fixes „Poisonpowder"→„Poison Powder")
2. Kuratierte Alias-Tabelle (~100–200 häufige TCG-Attacken, manuell gepflegt)
3. Typ+Power → nächster echter Move (deterministische Lookup-Tabelle)
4. Generischer STAB-Move (70 BP, physisch/speziell)
Match-Statistik pro Set beim Ingest loggen.
- **Species**: Kartennamen-Normalisierung („Alolan/Galarian/Hisui X", „M X"→Mega, Suffixe -GX/-V/-VMAX/-ex strippen) → `Dex.species.get()` (frisst TCG-Namen verifiziert direkt) → Fallback dex_ids[0]-Basisform.
- **Items (nur ~17 % Match)**: kuratierte **Whitelist ~15–20** (Choice Band, Muscle Band, Focus Sash, Leftovers, Eviolite, Expert Belt, Rocky Helmet, Wide Lens, Float Stone, Air Balloon, Assault Vest, Lum/Oran/Sitrus Berry, Weakness Policy, Blunder Policy); Rest → kein Item.
- Eigenes Arbeitspaket: **„Mapping-Layer + Alias-/Item-Tabellen + Ingest-Logging" (M)** — explizit in Phase 3.

### 6.2 Sim-Bridge
`VersusSide→PokemonSet`-Anker existiert; Level O1c; lazy chunk (eigener dynamic import, manualChunks pinnt @pkmn/sim+@pkmn/data in einen Chunk; Preload erst bei Klick).

### 6.3 PvP (Phase 4)
Seed-Lockstep verifiziert (bitidentische Logs bei Seed+Choices). Pflichten: Sim-Version gepinnt + Version im Duel-Handshake; Choice-Commit in fester Reihenfolge; Turn-Hash-Desync-Check; Rejoin via Seed+Choice-Log-Replay; **RNG-Seed serverseitig erzeugt** (nicht host-seitig — Cheating-Vektor). Reward nur nach Server-Replay.

## 7. Frontend / UX (Perf-Verifier: 3 Warnungen eingearbeitet)
- `/arena` hinter Experimental-Flag; Tabs Packs · Sammlung · Team · Duell · Rangliste; Account-Pflicht (Guest: Teaser).
- **Animation-Leitplanken**: nur transform/opacity; kein animiertes blur/box-shadow; Holo-Glow als Gradient-Overlay; ≤3 kompositierte Layer; LazyMotion-Import; reduced-motion-Fallback (inkl. GIF-Pause).
- **Collection-Grid**: distincte Karten (max ~1.200, nicht 20k — Duplikate = Zähler); erst `content-visibility: auto`, react-window nur bei messbarem Jank; Bilder mit width/height (CLS), `fetchpriority="low"`, Skeleton-Platzhalter; Supabase-Pagination (>1000 Zeilen!).
- **Performance-Budgets (neu)**: Arena-Route ≤250 KB gzip initial (Bilder ausgenommen); size-limit-Check in CI; Cache-Strategie (immutable content-hash Assets + gespiegelte Bilder).

## 8. Duell-Theater Assets (Perf-Verifier)
- Gen5-GIFs **lokal bündeln, per-Kampf lazy** (~12 Sprites ≈ 0,6–1 MB pro Duell, Preload mit Progress; Cache-Control immutable). **Niemals Vollbestand** (1025×2 ≈ 90–120 MB) im Initial-Deploy; raw.githubusercontent-Runtime-Abhängigkeit eliminieren. Nur 2 aktive GIFs animiert (Bank statisch) — GIF = CPU-Software-Dekodierung.

## 9. Phasen (v2)

| Phase | Inhalt | Größe |
|---|---|---|
| V | Plan + 5-fach-Verifizierung ✅ | — |
| **1** | Datenpipeline (TCGdex-Ingest → cards_cache + gespiegelte Bilder + Match-Statistik), open-pack (Transaktion+Pity), Opening-Theater, Collection-Grid, Recycling, Disclaimer/Odds-Box | L |
| **2** | Schicht-A-Engine (Energie/Preise/Cap), KI 3 Modi, Team-Bau + Species-Klausel, Belohnungen, **Daily-Missionen**, Rangliste (Opt-in), Showroom | L |
| **3** | **Mapping-Layer (M)** + Sim-Bridge + Battle-Theater-FX + Beta-Flag | L |
| **4** | Live-PvP (server-seeded Lockstep), Zuschauer, Seasons | XL |

## 10. Verifizierungs-Log
5 Reports, 2026-07-24 (Subagenten). Blocker: Schicht-A-Spieltiefe (Energie) ✅ eingearbeitet; Backend (RLS/Claim-Atomarität/Log-Größe) ✅; Move-Mapping-Rate ✅. Warnungen: 3 Packs+Pity, Dust/Caps, Missions-MVP, Bild-Spiegelung, GIF-Bündelung, Pull-Raten-Wording, Disclaimer, Opt-in. Offene Restrisiken: Scrydex-Migration der API; TCG-Bild-Duldung beruht auf Praxis (kein positiver Schutz).
