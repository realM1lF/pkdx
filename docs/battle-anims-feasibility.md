# Machbarkeitsanalyse: Showdown-Kampf mit Attacken-Animationen

Status: Entwurf (2026-09-10)
Branch: `feat/showdown-battle-anims`
Scope: visuelle Schicht über dem bestehenden 1v1-Simulator. Nicht die Engine selbst.

Die Engine-Frage ist erledigt. `@pkmn/sim` läuft, siehe `docs/battle-sim-feasibility.md`.
Diese Datei beantwortet nur: können wir den Kampf so aussehen lassen wie auf
Pokémon Showdown, mit Idle-Sprites und Attacken-FX, ohne die Site an AGPL zu
hängen und ohne Nintendo-Assets aus ROMs zu reißen.

**Ergebnis: machbar. Kein Drop-in. Große Baustelle, aber keine Wand.**
Zwei sinnvolle Wege, ein verbotener. Die Mechanik bleibt wo sie ist.

Zielbild (vom Auftrag): rundenbasierter 1v1-Kampf wie Showdown, inkl. Attacken.
GB-Pixel vs. 3DS-Look ist egal. Größe ist egal. Validität bleibt `@pkmn/sim`.


## 1. Was wir schon haben

`MicroBattle` (`src/lib/battle/engine.ts`) ist ein frameworkfreier Controller
um `@pkmn/sim`. React sieht nur `BattleSnapshot` + `BattleEvent`.
`BattleView` hängt hinter `React.lazy` auf `/de/kampf-simulator` und im Versus-Tab.
Der Sim-Chunk bleibt damit aus dem Hauptbundle.

Der Controller drain't `battle.log` und mappt Protokollzeilen auf Events
(`move`, `crit`, `supereffective`, `faint`, `weather`, `sideStart`, …).
Genau diese Zeilen sind das, was eine Showdown-Scene frisst. Wir werfen sie
heute nach dem Parsen weg, bis auf `event.raw`.

Sprites: `src/lib/sprites.ts` kennt schon Showdown-GIFs
(`other/showdown/{id}.gif`, back, shiny) über PokeAPI/GitHub.
Das Sprite-Museum rendert sie. `BattleView` tut das nicht.
Dort gilt `spriteEraForVersus(gen)`: Gen-1-Pixel bis Gen-9-Render, statisch,
64×64, Spieler-Rücken nur bis Gen 5.

CSP (`netlify.toml`): `img-src` erlaubt `raw.githubusercontent.com`.
`frame-src 'none'`. Kein `play.pokemonshowdown.com`.
Kein `dangerouslySetInnerHTML` (AGENTS.md §11). User-Text nur als Textknoten.

Lizenz der App: All Rights Reserved (`LICENSE`). Inbound MIT/CC0 ist unproblematisch.
Inbound AGPL würde die ganze Site anstecken. Das ist die harte Grenze.


## 2. Drei Schichten, die Leute durcheinanderwerfen

Pokémon Showdown ist kein Paket. Es sind drei Repos mit drei Lizenzen.

| Schicht | Repo / Paket | Lizenz | Bei uns |
|---|---|---|---|
| Simulator | `smogon/pokemon-showdown`, npm `@pkmn/sim` | MIT | schon da |
| Client-Chrome (Chat, Teambuilder, Replay-UI, jQuery-App) | `smogon/pokemon-showdown-client` als Ganzes | AGPLv3 | tabu |
| Replay-/Animations-Engine (`battle-*.ts`) | dieselben Dateien, File-Header | MIT | der interessante Teil |
| Attacken-Tabelle (`battle-animations-moves.ts`) | File-Header | CC0-1.0 | der FX-Schatz |
| FX-Bilder `play.pokemonshowdown.com/fx/` | Kommentar in `battle-animations.ts` | meist CC0, 6 Dateien nicht | hosten, Ausnahmen ersetzen |
| Pokémon-Sprites `sprites/` | explizit ausgenommen | Nintendo | schon unser Risiko, gleiches wie PokeAPI |

Zara Aslani (Guangcong Luo) schreibt im Client-README: der Client ist AGPL,
weil niemand einen schlechten Passwort-klauenden Fork bauen soll. Einzelne
Dateien will er auf Nachfrage nach MIT re-lizenzieren (`staff@pokemonshowdown.com`).
Die `battle-*.ts`-Header sagen das schon selbst: Engine MIT, Client AGPL.

`@pkmn/client` + `@pkmn/view` sind die aufgeräumte State-Maschine aus dem
Client, MIT, ohne Animationen. `AnimatedBattle` steht in der `@pkmn/view`-Doku
als ungebaut. Damit können wir State tracken, nicht FX abspielen.

Ein `<iframe>` auf `play.pokemonshowdown.com` ist tot:
`frame-src 'none'`, keine i18n, kein Holo-Dex, AGPL-UI, null Kontrolle.
Hotlinken der FX-PNGs von dort: Cache, CSP, und wir hängen an deren CDN.
Beides ist kein Weg.


## 3. Was die Showdown-Scene wirklich braucht

`Battle` (`battle.ts`, ~125 KB) ist kein React-Ding. Es ist ein Protokoll-Player.

1. Jemand schiebt Zeilen in `battle.add("|move|p1a: Glurak|Flamethrower|p2a: Turtok")`.
2. `Battle` hält eigenen Client-State (Seiten, aktive Mons, HP, Volatiles).
3. Pro Verb ruft es `BattleScene` auf: Sprite lungen, Effekt spawnen, HP-Bar,
   Wetter, Faint.
4. `BattleLog` / `BattleTextParser` bauen englischen Log-HTML.

`BattleScene` (`battle-animations.ts`, ~153 KB) ist jQuery-DOM.
Felder heißen `$frame`, `$sprite`, `$fx`, `$weather`. Positionen sind ein
eigenes x/y/z-System, das nach CSS gemappt wird. Animationen hängen sich
in `activeAnimations` und `waitFor()`. `finishAnimations()` ist ein Promise.

`BattleMoveAnims` (`battle-animations-moves.ts`, ~777 KB Quelltext, ~38k Zeilen)
ist eine Tabelle. Stand master: **608 eigene Animationen plus 490 Aliase,
934 Keys**. Jeder Eintrag ist eine Funktion `anim(scene, [attacker, defender])`,
die `scene.showEffect('electroball', {x,y,z,...})` und Sprite-Tweens feuert.
Es gibt keine Videodatei „Donnerblitz.mp4“. Die Attacke *ist* JS plus PNGs.

`Dex.getSpriteData()` in `battle-dex.ts` entscheidet Front/Back/Shiny/Gen
und baut URLs unter `Dex.resourcePrefix` (Default: Showdown-CDN).
`BattleSound` lädt Cries und Kampfmusik. Die MP3s sind Game-Rips.
Die wollen wir nicht.

Abhängigkeiten der Scene, die bei uns nicht existieren:

- **jQuery** als Runtime (global `$`, Typ `JQuery`). Nicht im Stack.
- **`battle-dex.ts` + `battle-dex-data.ts`**: eigenes Dex, Sprite-Tabellen,
  `resourcePrefix`. Parallel zu `@pkmn/dex`, das wir schon haben.
- **`Config` aus `client-main`**: ein Import in der Moves-Datei. Muss weg
  oder gestubbt werden, sonst zieht der AGPL-Client mit.
- **`BattleLog` erzeugt HTML.** Bei uns verboten, sobald das in React landet.
- **Lenis** besitzt window-scroll. Eine innere Scene mit Overflow braucht
  `data-lenis-prevent`, sonst ist der Log tot (kennen wir).

Die Scene ist an ihr DOM gekoppelt, nicht an React 19. Ein `npm install` gibt
es dafür nicht. Entweder vendorn und isolieren, oder die Tabelle (CC0) in eine
eigene Scene füttern.


## 4. Die unangenehme Protokoll-Lücke

`parseProtocolLine` filtert bewusst Zeilen, die die UI nicht braucht.

`NOISE_VERBS` enthält unter anderem `-hitcount`, `-singleturn`, `-singlemove`,
`-nothing`. `-damage` ohne `[from]` wird verworfen („HP-Bar reicht“).
`-weather` mit `[upkeep]` ebenfalls.

Für Text-Log ist das richtig. Für eine Showdown-Scene ist das falsch.
`-damage` *ist* der HP-Tween. `-hitcount` steuert Multi-Hit-FX.
`|split|` und Kanal-Duplikate muss die Scene selbst entflechten
(unser Drain skipped schon identische Folgezeilen).

Zwei Konsumenten, ein Log:

```
@pkmn/sim  →  battle.log  →  drain()
                              ├─ parseProtocolLine → BattleEvent → i18n-Log (bleibt)
                              └─ raw lines         → VisualDirector (neu)
```

Der VisualDirector bekommt die rohen Zeilen, inkl. der heute als Noise
behandelten. Der Text-Log bleibt unser lokalisierter. Showdowns englische
Messagebar schalten wir stumm.

Aufwand dafür: klein. Ohne den Passthrough ist Track C tot.


## 5. Assets, Zahlen, Lücken

Gemessen gegen `smogon/pokemon-showdown-client` master, 2026-09-10.

### Pokémon-Sprites (Idle)

PokeAPI spiegelt die Showdown-GIFs unter
`sprites/pokemon/other/showdown/`. Front/Back/Shiny für Gen 1–8 praktisch voll.
Gen 9 löchrig (Beispiel aus früherer Stichprobe: Sprigatito da, Miraidon /
Iron Leaves / Pecharunt 404). Fallback existiert schon in `<Sprite>`
(`spriteFallbackChain`). Für die Arena: Showdown-GIF, bei 404 Gen-5-GIF
(IDs 1–649) oder Menü-PNG.

GitHub-Raw cacht 5 Minuten. Listing-Sprites hosten wir deshalb lokal
(`public/sprites/pokemon/`, IDs 1–1025). Für Kampf-GIFs gilt dasselbe Argument,
sobald die Arena kein Opt-in-Gimmick mehr ist: lokal spiegeln, sonst flackert's.

Nintendo-IP: gleiches Risiko wie der Rest der Site. Kein neues.

### FX-Bilder

`play.pokemonshowdown.com/fx/`: **159 Dateien, ~5,6 MB**.
Darin Hintergründe (`bg-gen3.png`, `bg-forest.png`, …) und Effekt-Sprites
(`electroball`, `fireball`, `leaf1`, `wisp`, …).

CC0 gilt laut Dateikommentar für den Ordner, **außer**:

| Datei | Lizenz | Größe |
|---|---|---|
| `icicle.png`, `lightning.png` | Clint Bellanger, GPLv2/GPLv3/CC-BY-SA-3.0 | 1 KB + 25 KB |
| `bone.png` | im selben Ausnahmeblock | 197 B |
| `rocks.png`, `rock1.png`, `rock2.png` | „Gilad“, GPLv3 | ~2,5 KB |

GPLv3-Bilder in einer ARR-App sind Gift. Ersetzen durch eigene Pixel,
bevor der Ordner nach `public/fx/` wandert. Der Rest darf mit Attribution
(CC0 braucht keine, schadet nicht).

Hintergründe sind optional. Holo-Dex will eh keinen Wiesen-BG aus DPP.
Für MVP: Abyss + Typ-Glow, FX-Sprites ohne die `bg-*`.

### Audio

Showdown-BGM sind ROM-Rips. Nicht anfassen.
Cries haben wir: PokeAPI `cries/pokemon/latest/{id}.ogg`, CSP `media-src` passt.
Optional in Phase 5, Mute-Default, nie Autoplay vor Gesture.

### Bundle

| Brocken | grobe Größe | wann laden |
|---|---|---|
| `@pkmn/sim` (liegt) | ~6,6 MB min / ~1,06 MB gzip | schon lazy |
| `battle-animations-moves.ts` | 777 KB Quelle | nur Visual-Chunk |
| `battle.ts` + `battle-animations.ts` + Dex-Subset | ~380 KB Quelle | nur Visual-Chunk |
| jQuery (falls Track C) | ~30 KB gzip | nur Visual-Chunk |
| FX ohne Hintergründe | deutlich unter 5,6 MB, lazy per Effekt | erst bei Kampfstart |
| Idle-GIFs | 1–4 Dateien à Kampf | on demand |

Initial Load der Site bleibt unberührt, solange der Visual-Chunk am selben
`import()` hängt wie `BattleView`.


## 6. Optionen

### A. iframe / Hotlink  —  NEIN

CSP, AGPL, Design, i18n, Abhängigkeit vom fremden Host. Aus.

### B. Eigenes Stage, unsere Events  —  JA, Phase 1

Holo-Dex-Arena. Zwei große Showdown-GIFs (Spieler hinten, Gegner vorn).
HP-Balken, Status, Wetter-Chips bleiben.
`BattleEvent` treibt Choreo: bei `move` lunge + Typ-Flash, bei `crit` extra
Shake, bei `faint` Absinken, HP tweent aus dem Snapshot.

Sieht nach Kampf aus, nicht nach Showdown-Donnerblitz.
Kein jQuery, kein Vendor, kein Lizenz-Risiko über das hinaus was wir schon tun.
Passt zu Density/Holo-Dex. i18n-Log bleibt.

Aufwand: **1–2 Wochen**, inkl. DE/EN, Reduced-Motion, Browser-Check.

Das ist der einzig ehrliche Start. Ohne den wirkt Track C wie „wir kopieren
38k Zeilen und hoffen“.

### C. MIT-Insel: Showdown-Scene vendorn  —  JA, später

`src/vendor/ps-battle/` (oder gleichwertig), **nur** Dateien mit MIT/CC0-Header:

- `battle.ts`, `battle-animations.ts`, `battle-animations-moves.ts`
- `battle-scene-stub.ts`, `battle-text-parser.ts` (Parser, nicht HTML-Log)
- `battle-dex.ts` / `battle-dex-data.ts` nur soweit `getSpriteData` es braucht,
  oder ein Shim auf `@pkmn/dex` + `sprites.ts`

Raushalten: alles mit Client-Chrome, `client-main` (außer einem 10-Zeilen-Stub
für `Config`), `battle-log.ts` wenn er HTML in die App spuckt,
`battle-tooltips.ts`, Teambuilder, Search, Sound-BGM.

jQuery darf **nur** in diesem Chunk leben, dynamic import von `BattleView`.
Zwei leere DIVs (`$frame`, `$logFrame` Dummy). `$logFrame` hidden.
Unser Log daneben.

`Dex.resourcePrefix = '/'`. FX nach `public/fx/`. Pokémon-URLs umbiegen auf
`sprites.showdown(id)` bzw. lokal, sobald gespiegelt.

Nach dem Vendorn Mail an `staff@pokemonshowdown.com`: kurze Notiz, welche
MIT-Dateien, dass die Site ARR ist, dass wir den AGPL-Client nicht forken.
Höflich, nicht Bittsteller. Die Header reichen juristisch, die Mail verhindert
späteren Streit.

Aufwand bis „sieht aus wie Showdown, fühlt sich an wie unsere App“:
**4–8 Wochen** konzentriert, eher 2–4 Monate nebenher.
Der Kleber ist der Job, nicht das Kopieren.

Risiko: Upstream-Drift. `battle-animations-moves.ts` wächst mit jeder Gen.
Pin auf Commit-Hash, Update-Skript, kein stilles Live-Tracking.

### D. CC0-Tabelle, eigene Scene ohne jQuery  —  JA, teuer, sauber

`BattleMoveAnims` behalten (CC0), `showEffect` selbst bauen
(DOM oder Canvas/WebGL). Kein jQuery, kein PS-CSS, voll Holo-Dex.

Länger als C. Dafür kein Fremd-DOM in React 19, kein Lenis-Kampf mit
jQuery-Overflow, kein `innerHTML`.
Sinnvoll wenn C nach zwei Wochen Kleber immer noch blutet.

Aufwand: **3–6 Monate** bis Parität mit der PS-Tabelle.
Die Tabelle selbst ist der Gewinn: 934 Keys müssen wir nicht erfinden.

### E. `@pkmn/client` als State, FX selbst  —  Nebenrolle

Nützlich wenn der Client-State reicher sein soll als unser Snapshot
(Volatiles, Substitute, Transform). Für 1v1-Micro-Battle unnötig.
`AnimatedBattle` gibt es nicht. Nicht als Hauptweg.

### F. Eigenbau jeder Attacke, ROM-Rips, Essentials-Sheets  —  NEIN

900 Attacken als Videos: kein öffentliches Set, Rechte, Bundle.
pret-Scripte sind ROM-Befehle, keine Frames.
Pokémon Essentials: Fangame-Sheets plus `.rxdata`, nicht Web.


## 7. Zielarchitektur (wenn wir es wirklich bauen)

Unverändert:

- `@pkmn/sim` bleibt Source of Truth. Calc-Parity-Regeln (AGENTS.md §7) bleiben.
- `BattleEvent` + i18n-Log bleiben. Deutsche Attackennamen über `nameOfMove`.
- Slugs englisch. Kein übersetzter `moveId`.
- Battle bleibt lazy. Prerender der Landing-Page (`BattleSeoSections`) unberührt.
- `<Sprite>` für alles was ein Pokémon ist, sobald wir nicht in der Vendor-Scene
  sind. In der Vendor-Scene: deren `<img>`, Fallback-Kette analog.

Neu:

```
src/lib/battle/engine.ts          # plus rawLog() / onProtocol(line)
src/lib/battle/visual/director.ts # Zeilen → Scene, nicht in React
src/pages/detail/BattleStage.tsx  # Holo-Dex-Arena (Phase 1)
src/vendor/ps-battle/*            # nur Track C, License-Header behalten
public/fx/*                       # CC0-FX, GPL-Dateien ersetzt
```

`MicroBattle.choose()` ändert sich nicht. Nach jedem Zug: drain Events,
zusätzlich neue Zeilen an den Director. Die Scene darf den Sim nicht anfassen.

Reduced-Motion: Director skip't Tweens, setzt Endzustand.
Skip-Button: Queue leeren, Snapshot zeigen. Sonst nervt der dritte Tackle.

1v1 Singles bleibt der Scope. Doubles, Switching, Dynamax, Tera-Anim:
nicht im ersten Wurf. Tera als Typ-Badge auf dem Sprite reicht.


## 8. Design

Holo-Dex ist bindend. Eine 1:1-Kopie des grünen Showdown-Felds wäre ein
Fremdkörper auf der Versus-Seite.

Phase 1: Abyss, Hairline, Gold, Typ-Energie als Flash-Farbe (`TYPE_COLORS`).
Spieler links/unten, Gegner rechts/oben, große GIFs (nicht 64px).
HP-Bar dicker als jetzt, immer noch compact (Density-Addendum).

Phase C: Scene in einen Frame setzen und **restylen**. Deren Markup darf
bleiben, deren Wiese muss nicht. Wetter als Overlay in unseren Farben.

Errors weiter nicht rot-als-Fehler. KO darf dramatisch sein, das ist kein
Validierungsfehler. Die heutige Lose-Card mit `border-red-500` ist schon
ein Grenzfall zum Design-System. Nicht verschlimmern.


## 9. i18n, SEO, Tests

Log: unsere Keys unter `versus.battle.log.*`. PS-Texte nicht rendern.
Neue UI-Strings (Skip, Anim an/aus, Cry) in EN und DE, offizielle Terme.

SEO: die Landing rendert Copy im HTML. Die Arena ist Client-only, das bleibt
so. Keine neuen indexierbaren Kampf-URLs pro Matchup, außer die die wir
schon haben (`?a=&b=`).

Tests:

- vitest an der Engine bleibt heilig (`npx vitest run src/lib/battle`).
- Neu: Passthrough-Test, dass `|move|` / `|-damage|` / `|-hitcount|` den
  Director erreichen, auch wenn `parseProtocolLine` null liefert.
- Scene: kein sinnvoller Unit-Test. Chrome-MCP, beide Locales, ein Seed
  (Glurak vs. Turtok, Donnerblitz, Tackle, Faint).
- Nach CSP/Vendor: `npm run build && node scripts/check-csp.mjs`.


## 10. Sicherheit

- Kein AGPL-File in `src/` ohne vorherigen Stopp und Review.
- Kein `dangerouslySetInnerHTML` für PS-Log.
- Vendor-Scene darf eigenes DOM bauen. Keine User-Strings in `innerHTML`.
  Run-/Team-Namen kommen bei uns nicht in diese Scene.
- `play.pokemonshowdown.com` nicht in die CSP. Host lokal oder GitHub (schon da).
- jQuery nicht global. Nur im lazy Chunk.
- `check-csp.mjs` ist Pflicht nach jedem neuen Host.


## 11. Phasen und Aufwand

Größen wie im Projekt üblich (S/M/L), plus Kalender weil „egal wie groß“
sonst zu weich bleibt.

| Phase | Was | Größe | grob |
|---|---|---|---|
| 0 | diese Analyse | — | erledigt |
| 1 | Holo-Dex-Stage, Showdown-GIFs, Event-Choreo, kein Vendor | M | 1–2 Wochen |
| 2 | `rawLog` / `onProtocol` am Controller, Tests | S | 1–2 Tage |
| 3a | Track C: Vendor-Insel, FX lokal, GPL ersetzt, Kleber | L–XL | 4–8 Wochen |
| 3b | Track D statt 3a: eigene `showEffect`-Scene + CC0-Tabelle | XL | 3–6 Monate |
| 4 | Wetter/Status/Terrain-FX, fehlende Keys, Gen-9-Sprite-Lücken | M | 2–4 Wochen |
| 5 | Cries, Mute, kein BGM | S | ein paar Tage |
| 6 | Skip, Speed, Reduced-Motion, Mobile-Viewport | S–M | 1–2 Wochen |

Phase 1 ohne 3 ist schon ein anderes Produkt als der Text-Log.
Phase 3 ohne 1 ist der teure Weg, in jQuery zu versinken bevor die Arena sitzt.

„Fühlt sich an wie Showdown“ = Phase 1 + 2 + 3a + 6.
„Jeder Move pixelgleich PS“ = plus 4, und selbst dann Gen-9-Restlücken.


## 12. Risiken, die uns wirklich umhauen

1. **AGPL-Kriechstrom.** Eine falsch vendorte Datei (`client-main.ts`,
   Tooltip-HTML, Replay-Chrome) und die ARR-Lizenz der Site ist wertlos.
   Gegenmittel: Allowlist, Header-Check im CI, kein „und die eine Datei noch“.

2. **jQuery × React 19 × Lenis.** Drei Scroll-/DOM-Besitzer. Isolierter
   Frame + `data-lenis-prevent` oder Track D.

3. **Protokoll-Filter.** Vergessen wir `-damage`, sieht die Scene nichts.
   Deshalb Phase 2 vor Phase 3, nicht danach.

4. **Gen-9-GIFs.** Scene zeigt leere Slots. Fallback-Kette muss in *beiden*
   Tracks sitzen, nicht nur in `<Sprite>`.

5. **Upstream.** Ohne Pin und Update-Skript divergieren Moves.
   Neue DLC-Attacke = leere Animation, nicht Crash (PS fällt oft auf Alias zurück).

6. **Bundle-Gefühl.** 1 MB Sim + 200–400 KB Scene + GIFs, nur beim Kampf.
   Akzeptabel. In den Start der Landing ziehen: nicht akzeptabel.

7. **Nintendo.** Wir erhöhen die Sichtbarkeit von Sprites und FX.
   Rechtlich nicht neu, politisch lauter. Keine Cries-Autoplay, keine
   Game-BGM, Disclaimer bleibt.

8. **`docs/ai/architecture.md` ist veraltet** („sim absichtlich nicht
   genommen“). Bei Implementierung mitziehen, sonst erklärt die Doku das
   Gegenteil vom Code.


## 13. Was wir nicht tun

- Ganzen Showdown-Client forken oder iframeen.
- `play.pokemonshowdown.com` in die CSP schreiben.
- Kampfmusik aus den Spielen.
- Offizielle Attacken-Videos / ROM-Frames.
- Doubles, Multiplayer-Showdown, Replay-Sharing im ersten Wurf.
- Die Text-Engine durch die Scene ersetzen. Sim bleibt Sim.
- `Math.random()` in den Kampf. Seeds bleiben.


## 14. Offene Entscheidungen (Mensch)

1. Nach Phase 1: Track C (schneller zum PS-Look, jQuery-Insel) oder Track D
   (länger, sauber)? Default-Empfehlung: C versuchen, nach zwei Wochen Kleber
   ehrlich nach D kippen.
2. Mail an `staff@pokemonshowdown.com` vor dem Vendorn, nicht danach.
3. GIFs weiter von GitHub oder nach `public/` spiegeln sobald Phase 1 sitzt?
   Empfehlung: erst Remote + Fallback, dann Spiegel für die ~1025 Front/Back/Shiny.
4. Wie nah am Holo-Dex? Volle PS-Wiese wäre falsch. Abyss + FX ist die Linie.


## 15. Nächster Implementierungsschritt

Auf diesem Branch, wenn der Auftrag kommt:

1. `BattleStage` in `BattleView`: große GIFs, HP, kein Vendor.
2. Event-Choreo an `BattleEvent` (move / hit / faint).
3. `onProtocol` am Controller, Tests.
4. Erst dann Vendor oder eigene `showEffect`.

Kein Code in diesem Commit-Stand. Nur die Entscheidung, dass es geht,
und wo es weh tut.
