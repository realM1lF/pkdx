# Nuzlocke-Audit — 2026-08-13

Code gelesen, keine Produktionsänderungen. Vitest (15 Dateien, 146 Tests, Filter `nuzlocke*`) grün, **kein** `it.skip` / `describe.skip`. Orre-Tracker teilt **nicht** das Encounter-Modell (`orre-progress` + Link in den Wizard).

## Kurzfazit

Slot-Verbrauch (Dupes/Shiny/Missed/Death) und SoulLink-Cascade **vorwärts** (Tod/Miss, N Spieler, Box-Link) sind client- und server-seitig sauber gespiegelt. Die ernsthaften Löcher sitzen woanders: **Auto-Level-Cap-Daten** (Einall 8. Arena an der falschen Stadt), **SoulLink-Undo** (Restore kehrt die Cascade nicht um), **Join-Slot-Race** ohne 23505-Retry, **Go-Online** ignoriert fehlgeschlagene Encounter-Uploads, und `isStatusDowngrade` ist getestet aber nicht verdrahtet. Gäste können keine Runs anlegen — das widerspricht AGENTS.md „Solo fully offline“, ist aber per Login-Gate-Tests Absicht.

## Findings (severity, evidence, impact, fix-Richtung)

### 1. Einall: 8. Arena = Humilau/Drayden statt Opelucid — **high**, verified

`GYM_ACE.unova` mappt den letzten Badge auf `humilau-city` mit Kommentar „Drayden“ und Ace 40:

```241:250:src/lib/nuzlocke-rules.ts
  unova: {
    'striaton-city': 14, // Cilan/Chili/Cress
    ...
    'icirrus-city': 35, // Brycen
    'humilau-city': 40, // Drayden
  },
```

Dieselbe Zuordnung steht in `src/data/enriched/unova.json` (Leader „Drayden“, Haxorus Lv.40 unter `humilau-city`). Die Region-JSON hat **beide** Nodes als `kind: "city"`: `opelucid-city` (Twindrake, ~Z.315) und `humilau-city` (Abidaya, ~Z.535). Binding: Einall = Schwarz/Weiß. BW-8. Arena ist Drayden/Iris in **Opelucid**, Ace Haxorus **43**. Humilau ist BW2-Marlon (Jellicent 52). Hardcore-Cap nach 7 Badges zeigt damit die falsche Stadt und ein zu niedriges Limit. Tests prüfen Unova-8 nicht (`nuzlocke-rules.test.ts` deckt Kanto/Johto/Sinnoh-**Reihenfolge**).

Fix: `GYM_ACE`/`GYM_BADGE_ORDER` auf `opelucid-city` + BW-Ace 43; enriched-Leader dorthin verschieben. Humilau nicht als BW-Gym behandeln.

### 2. Auto-Cap-Aces weichen von den kanonischen Versionen ab — **high**, verified (Daten)

`GYM_ACE` ist laut Kommentar Spiegel der `Leader`-Einträge in `src/data/enriched/*.json`, nicht der Binding-Versionen (Kanto=FRLG, Johto=HGSS, Hoenn=RSE, Sinnoh=Platin, Einall=BW). Beispiele:

| Region | Code / enriched | Kanon (Binding) |
|---|---|---|
| Sinnoh Maylene (`veilstone-city`) | Lucario **22** | Platin Lucario **32** |
| Sinnoh Fantina (`hearthome-city`) | Mismagius **30** | Platin Mismagius **26** |
| Sinnoh Wake (`pastoria-city`) | Floatzel **30** | Platin Gyarados **33** |
| Johto Bugsy | **16** | HGSS Scyther **15** |
| Johto Clair | **40** | HGSS Kingdra **41** |
| Einall Skyla | Unfezant **31** (enriched, kein Swanna) | BW Swanna **33** |
| Hoenn 8. Gym | Sootopolis **46**, Kommentar „Wallace“ | RS Wallace Milotic 43; Emerald **Juan** Kingdra 46 |

Sinnoh-**Reihenfolge** ist korrekt Platin (Fantina vor Maylene, Test Z.92–94). Die **Level** sind es nicht. Cap ist nur Soft-Warnung (Finding 12), falsche Zahl bleibt trotzdem irreführend.

Fix: Aces aus der Binding-Version ziehen, nicht aus unvollständigen enriched-Parties. Tests auf Ace-Level je Region, nicht nur Node-ID.

### 3. SoulLink-Restore macht die Cascade nicht rückgängig — **high**, verified

Vorwärts-Cascade ist korrekt und getestet (`nuzlocke-soullink.test.ts`: Tod → alle lebenden Partner tot; Miss → `lost`; Cascade-off → nur boxen; N Spieler). Server-RPC `nuz_apply_encounter_status` spiegelt dasselbe (`07_nuz_apply_encounter_status.sql` Z.98–119, nur `status = 'caught'`-Partner, nur bei `dead`/`missed`).

Rückwärts fehlt:

- UI bietet „Wiederherstellen“ (`EncounterMenu.tsx` Z.225–236) → `updateEncounter(..., { status: 'caught' })`.
- `updateEncounter` bei Restore: nur `reconcileEvoLineDupes`, **kein** Partner-Revive (`nuzlocke-store.ts` Z.2012–2015).
- RPC bei `caught`: setzt `in_party` nicht zurück und fasst Partner nicht an (SQL Z.83–89, Cascade-Block nur für dead/missed).

Folge: Trigger wieder lebend, Partner bleiben tot/`lost`. Umgekehrt kann man einen kaskadierten Partner allein restoren (`canRestore` prüft nur denselben Spieler+Route, `NuzlockeRun.tsx` Z.211–217). SoulLink-Gruppe wird asymmetrisch. `cascadeIds` in `NuzlockeRun.tsx` Z.117–127 markiert weiterhin jedes lebende Mon auf einer Route mit irgendeinem Tod — der restorte Trigger zittert weiter.

Kein Test für Undo. Fix: Restore des Triggers muss Partner spiegeln (oder Restore bei SoulLink-Gruppe nur als Gruppen-Undo); RPC analog erweitern.

### 4. Open-Lobby-Join: Slot-23505 ohne Retry — **high**, verified

`nuz_players_run_slot_uidx` (`08_nuz_players_slot_uidx.sql`) existiert genau gegen doppelte Slots. `joinRun` berechnet `nextPlayerSlot(lookup.players)` aus dem **Lookup-Snapshot** und bricht bei jedem Insert-Fehler ab:

```1756:1757:src/lib/nuzlocke-store.ts
  const { error } = await nuzTables.players().insert(player);
  if (error) return null;
```

Zwei gleichzeitige Joins → einer 23505 → UI „Join fehlgeschlagen“, kein Re-Fetch/Retry. Encounter-Inserts haben 23505-Reconcile (`reconcileRouteConflict`); Player-Inserts nicht. Tests decken nur `nextPlayerSlot` lokal (`nuzlocke-lobby.test.ts`).

Fix: bei 23505 Players neu laden, `nextPlayerSlot` erneut, retry (wie Invite-Code-Mint).

### 5. `goOnline`: Player/Encounter-Fehler werden verschluckt — **high**, verified

```1807:1819:src/lib/nuzlocke-store.ts
  if (rErr) {
    pushToast('sync', 'RETRYING SYNC…');
    return false;
  }
  ...
  if (s.players.length > 0) await nuzTables.players().upsert(s.players);
  if (s.encounters.length > 0) await nuzTables.encounters().upsert(s.encounters);
  s.mode = 'multi';
```

Nur der Run-Upsert wird geprüft. Danach `mode = 'multi'` + Live-Channel, auch wenn Encounters fehlschlagen (Partial Unique lässt sich per PostgREST nicht als `onConflict` zielen — Kommentar in Migration 06). Remote ist leer/unvollständig, lokal „online“. Stale-LS vs. Realtime.

Fix: Fehler der drei Writes prüfen; bei Encounter-Fail nicht auf multi schalten bzw. insert+23505 wie `logEncounter`.

### 6. `isStatusDowngrade` nicht verdrahtet — **high** (Race hypothesized, Lücke verified)

Helper + Tests in `nuzlocke-concurrency.ts` / `.test.ts` (dead→caught = Downgrade). Dateikopf: „fully wired in 1.4 … guards every non-outbox remote apply“. `nuzlocke-store.ts` importiert die Funktion **nicht**. `applyRemoteEncounter` (Z.1021–1024) setzt Realtime immer durch, bewusst für Peer-Restores.

Ohne Monotonie kann ein verspätetes `dead`-Frame nach erfolgreichem Restore die Zeile wieder töten, sobald die Outbox leer ist. Outbox/opGen schützen nur **eigene** In-Flight-Writes.

Fix: Downgrade nur für Frames, die nicht die aktuelle eigene opGen sind; Restores über RPC+client_op_id oder explizites „undo“-Flag.

### 7. Party-Flags: `ensurePartyFlags` greift zu spät; `null` ≠ Legacy — **medium**, hypothesized (Logik verified)

`hasPartyFlags` = `some(e => e.in_party !== undefined)` (`nuzlocke-store.ts` Z.672–674). `null` (Postgres) ist `!== undefined` → Flag-Modus an. `partyOf` filtert `in_party === true` → Null-Zeilen landen **nicht** im Team. `ensurePartyFlags` läuft nur in `setEncounterParty` / `swapParty`, nicht in `partyOf` / `logEncounter` / Hydrate.

Legacy ohne Key: erster neuer Catch setzt `in_party: boolean` → `hasPartyFlags` true → alte Zeilen ohne Flag wirken wie Box. Schema-Default in den vorliegenden Migrations nicht definiert (nur Updates in 06/07).

Fix: `in_party == true` vs. fehlend/null in `hasPartyFlags` gleich behandeln; `ensurePartyFlags` bei Hydrate/`logEncounter`.

### 8. Dupes-TOCTOU nur clientseitig — **medium**, verified (dokumentierte Lücke)

`nuzlocke-concurrency.ts` Z.151–160: Server-RPC Phase 2.3 fehlt. `reconcileEvoLineDupes` nach Insert/Realtime/Hydrate stuft den späteren Catch zu `duped` zurück (`pickDupeLoser` über `created_at`/`id`). Kurzes Fenster mit zwei lebenden Linien-Duplikaten; offline/PokéAPI-Fail bricht den Scan ab (Z.1062–1064). Solo-Dupes-Tests decken die Familie, nicht den Multiplayer-Race.

Fix: Insert+Familienprüfung in einer TX (geplanter RPC).

### 9. Feed ohne `data-lenis-prevent` — **medium**, verified

```29:29:src/pages/nuzlocke/Feed.tsx
      <div className="nz-slim-scroll mt-2 max-h-[420px] space-y-px overflow-y-auto">
```

Lenis klaut das Wheel — Panel wirkt unscrollbar. Timeline hat `overflow-x-auto` ohne Prevent (Z.329); Shift-Wheel ist extra verdrahtet. QuickEntry/EncounterMenu/Modal haben Prevent.

### 10. QuickEntry-Sprites ohne `<Sprite>` — **medium**, verified

```503:503:src/pages/nuzlocke/QuickEntry.tsx
                <img src={sprites.front(o.id)} alt="" loading="lazy" className="h-[32px] w-[32px] [image-rendering:pixelated]" />
```

Kein Fallback-Chain, Pixelung für alle Gens. TeamGrid/Box/Timeline nutzen `<Sprite>`.

### 11. Hardcodierte EN-Toasts — **medium**, verified

- `'RETRYING SYNC…'` (`nuzlocke-store.ts` Z.1268, 1808)
- `'OFFLINE — RUN SAVED TO THIS DEVICE'` (Z.1647)
- `` `ONLINE — INVITE ${invite}` `` (Z.1820)
- `'SOULLINK'` in `rulesSummary` (Z.2269)

Kein i18n, DE-Parity gebrochen.

### 12. Nicknames-Regel nach dem Log umgehbar — **medium**, verified

`validateLogDraft` verlangt Nickname beim Catch. Edit: `nickname: nick.trim() || null` (`EncounterMenu.tsx` Z.322) ohne Regel-Check.

### 13. Presence-Key kann auf Run-ID fallen — **medium**, verified

```1086:1087:src/lib/nuzlocke-store.ts
  /* Presence key = player id; solo cloud falls back to the sole player or run id. */
  const presenceKey = myPlayerId(entry.id) ?? s.players[0]?.id ?? entry.id;
```

Zweiter Device ohne `pdx2.nuz.memberships`: `restoreLocalRunIdentity` bindet Member nur bei genau einem Player (Z.338–345). Volle Lobby → `myPlayerId` null → Presence mit Run-ID. Binding: nie Run-ID. Multi-Presence ist nur bei `mode === 'multi'` (Z.1091).

### 14. `createRun` Solo: partieller Cloud-Write — **medium**, verified

Logged-in Solo: Run-Insert, dann Players. Player-Fehler → kein `registerAccountRun`, lokaler Run trotzdem gespeichert (Z.1649–1661). Orphan-`nuz_runs`-Zeile ohne Players; Gerät denkt Solo-lokal.

Online-Create bei Invite/Player-Fail: `offlineFallback`, Toast auf Englisch, lokaler Multi-Versuch wird Solo ohne Code.

### 15. `duplicateAsSolo` schreibt nicht nach `nuz_runs` — **medium**, verified

Kopie nur `saveLocalRun` + Owner-Flag (`nuzlocke-store.ts` Z.2369–2412). `createRun` legt für Accounts Cloud-Zeilen an. Kopie erscheint nicht auf anderen Geräten, bis etwas anderes sync’t. Login-Gate-Test prüft nur lokalen Index.

### 16. Gen6–9 `route_key` mit doppeltem Regions-Präfix — **low**, verified

Builder: `id: \`${reg.id}-${slug}\`` (`scripts/build-freeform-regions.mjs` Z.68). PokéAPI-Slugs sind schon `kalos-route-1` → gespeichert `kalos-kalos-route-1` (ebenso Alola/Galar-Routen). `locationSlug` ist korrekt. Nicht re-keyen (Shared Region Contract) — Display/Docs. Fehlende Locations: Liste = PokéAPI-Region, Paldea/Kitakami/Blaues Terrarium nur soweit in der API; nicht gegen ein offizielles Location-Manifest geprüft (**hypothesized** Lücken).

### 17. TeamGrid-Typen nicht lokalisiert — **low**, verified

`TypeChip` zeigt `type.slice(0, 3)` englisch (`TeamGrid.tsx` Z.40–46), nicht `nameOfType`. 44px-Zeilen in Box/Timeline haben `truncate`/`min-w-0`.

### 18. `getRunTeam` / Import — **low**, verified mit einer hypothetischen Kante

`getRunTeam` nutzt `partyOf` (lebende `in_party`, max 6), nicht „Catch-Order“ trotz Kommentar (Z.2711–2735). `importRunTeams` nimmt `pokemon_id` (aktuelle Form nach Evo) — richtig. `versionGroupForGame` kommt aus `loadLocalRun`, während `getRunTeam` Remote bevorzugen kann → VG kann hinterherhinken (**hypothesized**), wenn nur Cloud existiert.

`formatRunSummary` listet **alle** `caught` unter „Team:“, nicht die Party (`nuzlocke-rules.ts` Z.421–427).

### 19. Login-Gate vs. Gäste / AGENTS.md — **low** (Produkt), verified

`createRun`/`joinRun`/`goOnline`/`duplicateAsSolo` verlangen `getAuthUser()` = **echtes** Konto (`isRealUser` filtert anonym). Tests in `nuzlocke-login-gate.test.ts` schreiben das fest. `ensureRunIdentity()` (anonym für RLS) läuft danach oft als No-Op. AGENTS.md beschreibt Solo-offline + Guest-Anon; die App ist account-pflichtig. Kein Runtime-Bug, Doku/Produkt-Drift.

### 20. OrreTracker — **nit**, verified

`src/pages/OrreTracker.tsx` nutzt `orre-progress`, nicht `nuz_encounters`. Nur `LocaleLink` nach `/nuzlocke?region=orre&wizard=1`. Kein geteilter Slot/SoulLink-Pfad.

### 21. Architecture.md vs. Unique Index — **nit**, verified

`docs/ai/architecture.md` §3: `status <> 'duped'`. Migration 06: `status IS DISTINCT FROM 'duped'` (NULL zählt als verbrauchend, analog JS `!== 'duped'`). Client `isSlotConsuming` und Index **stimmen überein**.

## Sync / Multiplayer speziell

Solide:

- Partial Unique `(run_id, player_id, route_key) WHERE status IS DISTINCT FROM 'duped' AND coalesce(is_shiny,false)=false` ↔ `isSlotConsuming`.
- Insert + 23505 → `reconcileRouteConflict` (Encounter).
- Outbox + `opGen` bei Hydrate/Reconnect (`mergeRemoteWithOutbox`).
- SoulLink-Tod/Miss in **einer** TX (`nuz_apply_encounter_status`); Client `livingCascadeTargets` identisch.
- Presence-Channel-Filter `run_id`; Key soll Player-ID sein (Fallback siehe Finding 13).
- Account-Sync, Tombstone nach Delete, Member-Delete löscht nicht den Run (`nuzlocke-lifecycle.test.ts`).
- Cloud-Solo bekommt Realtime (`nuzlocke-solo-live.test.ts`).

Löcher:

- Dupes-Familie nicht in derselben TX wie Insert (Finding 8).
- Player-Slot-Join ohne 23505-Handling (Finding 4).
- `goOnline`-Upsert (Finding 5).
- Restore/stale Realtime (Findings 3, 6).
- `client_op_id` in der RPC „not yet deduped“ (SQL-Kommentar Z.35–37) — Retry nach lost response ist für dead/miss dank `status='caught'`-Filter idempotent; trotzdem kein exactly-once.
- Box-Link persistiert N einzelne PATCHes, nicht eine TX (`setEncounterParty` Z.2127–2141) — kurze Inkonsistenz möglich (**hypothesized**).
- `joinRun` startet mit `encounters: []` und hydriert async (Z.1759–1777) — kurzer leerer Deck-Flash.

Kick: es gibt **kein** `kick`/`removePlayer` nach Create (nur Wizard-Crew vor dem Start). Host-„Leave“ = `deleteRunForever` (Owner löscht `nuz_runs`; Member nur eigene Membership). Getestet.

## Regeln die nicht greifen

| Regel | Was sie tut | Was sie nicht tut |
|---|---|---|
| **Level-Cap / autoLevelCap** | Soft-Warnung, zweiter Commit geht durch (`QuickEntry` `capAck`; `EncounterMenu` analog) | Kein Hard-Block; Auto-Zahlen ggf. falsch (Findings 1–2). Freeform (Kalos+) → `null` (Tests). |
| **releaseOnDeath** | Gold-Toast + Box-Badge-Text | Status bleibt `dead`, kein `lost`/Löschen. |
| **nicknames** | Pflicht beim Log | Edit kann Nickname leeren (Finding 12). |
| **randomizer** | Full-Dex-Autocomplete, kein CUSTOM-Chip | Keine weiteren Checks. |
| **shiny** | Bypass Route-Lock **und** Dupes in `validateLogDraft` | Shiny-Zeilen verbrauchen den Slot nicht (Index+Client einig). Mehrere Shinies pro Route möglich — typisch Shiny-Clause. |
| **soulLinkCascade off** | Partner nur boxen | Box-Link bleibt immer an (Absicht, Tests A1). |
| **Dupes** | Living-only default; `dupesDead`/`dupesEncounter` erweitern Claims | Server erzwingt die Familie nicht (Finding 8). |

## Testdefizite

146 Tests grün, keine Skip-Marker. Abgedeckt: Dupes-Familie inkl. Evo, SoulLink vorwärts + Box-Link, Badge-**Reihenfolge**, Login-Gate, Lobby-Slots lokal, Lifecycle Delete/Archive, Concurrency-Helper isoliert, Linked-Team-Roster, Cloud-Solo-Realtime.

Fehlt:

- Restore/Undo der SoulLink-Cascade (Client + RPC).
- `joinRun` 23505-Retry.
- `goOnline` Encounter-Upsert-Fehler.
- `isStatusDowngrade` im Store (nur Unit des Helpers).
- Unova 8. Gym Node + Ace-Level vs. Binding-Version.
- `ensurePartyFlags` / `in_party: null`.
- Server-Dupes-RPC (bewusst ungebaut).
- Kick (Feature fehlt).
- Vitest-stderr: `linked team init failed ReferenceError: Cannot access '__vite_ssr_import_2__' before initialization` in `purgeForeignLinkedTeams` — Zirkularimport Store ↔ linked-teams unter Vitest-SSR. Tests schlucken das. Produktion **hypothesized**.

## Was solide wirkt

- Slot-Semantik: `duped` und Shiny verbrauchen nicht; `missed`/`dead`/`lost`/`caught` tun es. Re-Catch nach Dupe-Skip ist das Index-Ziel.
- SoulLink vorwärts, N Spieler, Miss→`lost`, Route-Lock nur bei Cascade-on, keine Cascade-Schleife.
- Party max 6 über `in_party` + `setEncounterParty`/`swapParty` `reason: 'full'`; Tod nimmt `in_party` weg.
- Evo: `caught_pokemon_id` bleibt, Timeline zeigt Fangform, Team/Versus aktuelle Form; Dupes über beide IDs.
- LocaleLink / `useLocalePath` auf Nuzlocke-Seiten; innere Listen meist mit `data-lenis-prevent`.
- RLS-Kommentare ohne `using (true)`; Invite über `nuz_join_by_code`.
- Orre als Freeform-Region für Nuzlocke-Textmodus, Tracker getrennt.

## Empfohlene Reihenfolge

1. **Einall-Gym + Ace-Tabelle** an Binding-Versionen (Finding 1–2) — falscher Cap in Hardcore-Runs.
2. **SoulLink-Undo** inkl. RPC (Finding 3).
3. **Join-Slot 23505-Retry** (Finding 4).
4. **`goOnline` Write-Errors** (Finding 5).
5. **`isStatusDowngrade` wirklich anwenden** oder Kommentar/Tests an die Restore-Entscheidung anpassen (Finding 6).
6. **Party-Flag-Hydrate** (Finding 7).
7. Dupes-Insert-RPC (Finding 8), wenn Multiplayer-Dupes weh tun.
8. Lenis-Feed, `<Sprite>` in QuickEntry, i18n-Toasts (9–11).
9. Nickname-Edit, Presence-Key, Duplicate-Cloud, Freeform-IDs dokumentieren.

Danach: Unova-Cap-Test, Restore-Cascade-Test, Join-Race-Test. `nuzlocke.md` in AGENTS nicht als „fully offline Solo“ stehen lassen, solange das Login-Gate gilt.
