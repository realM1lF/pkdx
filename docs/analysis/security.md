# Security-Audit — 2026-08-13

Audit der Website (React-19-SPA auf Netlify) und der Backend-Fläche (Supabase RLS, Auth, Realtime, Edge Functions). Keine Produktionsänderungen. Keine Exploit-Anleitungen.

**Live-Checks:** `node scripts/check-rls.mjs` (0 critical, 3 warnings), `node scripts/check-headers.mjs` gegen `https://mypokepanion.com` (0 failed), `node scripts/check-csp.mjs` gegen lokales `dist/` (17 Routen, 0 CSP-Verletzungen, 0 JS-Fehler). `npm audit --omit=dev`: 1 HIGH in `react-router` (RSC-CSRF, hier voraussichtlich nicht relevant).

## Kurzfazit

Die **anonyme Außenhaut ist dicht**: ohne Session sieht der Publishable-Key keine Nuzlocke-Zeilen, keine Invite-Codes und keine Account-Tabellen. CSP ohne `unsafe-inline` für Scripts, Security-Header und Cache-Reihenfolge in `netlify.toml` stimmen live. XSS-Grundlagen (kein `dangerouslySetInnerHTML`, Usernamen als Text) sind in Ordnung.

Die **eigentlichen Lücken liegen hinter einer gültigen Session** (echtes Konto *oder* anonyme Auth) und in der **Account-Erstellung**. Die UI-Gates (`isRealUser()`, Login-Pflicht zum Erstellen/Joinen) sind **kein** Sicherheitsrand — RLS behandelt `auth.uid()` inkl. anonymer JWTs als vollwertige Identität. Dazu: öffentliches E-Mail-Signup ist live an, Edge Functions für PIN/Register liegen nicht im Repo, und `plugin-inspect-react-code` schreibt Source-Pfade in die produktiven HTML-Seiten.

Kein `service_role`-Key im Repository. Der Publishable-Key in `src/lib/supabase.ts` ist Absicht.

## Findings (severity, location, risk, hardening — NO exploit steps)

### HIGH — Öffentliches Signup umgeht `register-account`

- **Ort:** Live-Auth-Settings (`/auth/v1/settings`, bestätigt durch `scripts/check-rls.mjs`); Client erwartet den einzigen Pfad in `src/lib/auth.ts` (`registerAccount` → Edge Function `register-account`).
- **Risiko:** `disable_signup === false`. Konten können an der vorgesehenen Registrierung (Username-Format, 6-stellige PIN, Admin-API auto-confirm) vorbeigehen. Das untergräbt PIN-Recovery, Username-Uniqueness über `profiles` und die Annahme „kein E-Mail“.
- **Härten:** Public Signup im Supabase-Dashboard **deaktivieren**. User-Anlage nur über `register-account` (service_role, serverseitig). Bestätigen, dass unbestätigte/fremde E-Mail-Konten nicht ins Username-Schema `*@users.mypokepanion.com` schreiben können.

### HIGH — Mitgliedschaft ohne Invite-Code

- **Ort:** `supabase/migrations/10_nuz_run_members_no_self_owner.sql` — Policy `members: insert own member rows` mit `user_id = auth.uid() and role = 'member'`. Grants in `02_enforce_nuzlocke_rls.sql` (`insert` auf `nuz_run_members` für `anon`/`authenticated`). Client-Upsert in `src/lib/nuzlocke-store.ts` (`linkRunToAccount`).
- **Risiko:** Die Policy prüft **nicht**, ob der Caller den Invite-Code kennt oder schon Mitglied ist. Wer eine Run-UUID hat (Adresszeile `/nuzlocke/{id}`, Team-Links `?fromRun=` / `?viewRun=` in `src/pages/TeamBuilder.tsx` / `RunHeader.tsx`), kann sich per REST selbst als `member` eintragen. Danach greifen `nuz_is_member` und damit Lesen (inkl. Invite-Code) und Schreiben aller Run-Daten. Die UI verlangt Login (`getAuthUser()`), die Datenbank nicht. Anonyme JWTs zählen als `auth.uid()`.
- **Härten:** Client-INSERT auf `nuz_run_members` **entziehen**. Mitgliedschaft nur noch über SECURITY-DEFINER-RPCs (`nuz_join_by_code`, `nuz_claim_access`, Trigger `nuz_runs_grant_owner`). Optional: Run-UUIDs nicht in teilbare URLs legen bzw. Deep-Links ohne Mitgliedschaft nichts verraten lassen.

### HIGH — Jedes Mitglied kann `owner_id` und `invite_code` schreiben

- **Ort:** `supabase/migrations/03_harden_insert_visibility.sql` (Update-Policy: `owner_id = auth.uid() or nuz_is_member(id)`); Tabellen-Grant `update` auf **alle** Spalten in `02_enforce_nuzlocke_rls.sql`. Client setzt `owner_id` bewusst in `linkRunToAccount` (`nuzlocke-store.ts`).
- **Risiko:** Im Gegensatz zu Migration 09/10 (Rollen-Freeze auf `nuz_run_members`) sind `nuz_runs.owner_id` und `invite_code` für jedes Mitglied patchbar. `with check` bleibt erfüllt, wenn jemand `owner_id` auf die eigene UID setzt — danach greift `runs: owner deletes`. Invite-Codes können rotiert oder durch schwache Werte ersetzt werden. Threat-Model ist eine kleine, eingeladene Gruppe; ein toxischer Joiner reicht.
- **Härten:** Wie bei `archived`: Column-Grants — Mitglieder dürfen z. B. `name`/`rules`/`status` ändern, nicht `owner_id`/`invite_code`. BEFORE-UPDATE-Trigger, der Identitätsspalten pinnt. Invite-Rotation nur als Owner-RPC mit frischem CSPRNG-Code.

### HIGH — Account-/PIN-Logik nicht im Repo auditierbar

- **Ort:** `src/lib/auth.ts` ruft `register-account` und `reset-with-pin` auf; **kein** `supabase/functions/` im Repository. Kommentar behauptet Rate-Limiting.
- **Risiko:** 6-stellige PIN ≈ 10⁶ Möglichkeiten. Ohne Quelltext unklar: Hashing (Argon2/bcrypt vs. Klartext), Lockout, Logging von PIN/Passwort, service_role-Rechte der Function, CORS. Username+Passwort ohne E-Mail macht die PIN zum einzigen Recovery-Faktor.
- **Härten:** Functions ins Repo (oder privates Submodul), Review: PIN nur gehasht, striktes Rate-Limit pro Username **und** IP, keine Body-Logs, Passwort-Maxlänge serverseitig, nach Reset Session-Invalidierung. PIN auf längere Recovery-Codes anheben, sobald UX es hergibt.

### MEDIUM — Invite-Code-Format nur clientseitig

- **Ort:** Minting in `src/lib/nuzlocke-store.ts` (`mintInviteCode`, Alphabet 31 Zeichen, Länge 8, `crypto.getRandomValues`, Retry auf 23505). Unique Index in `01_prepare_nuzlocke_rls.sql`. **Kein** CHECK auf Format/Länge.
- **Risiko:** Jeder Insert/Update mit Mitgliedschaft kann einen kurzen, sprechenden oder wiederverwendeten Code speichern. `nuz_join_by_code` akzeptiert jeden gespeicherten String. Legacy-Kurzcodes (`SOUL-XXX`, im Kommentar ~15 Bit) bleiben lookup-fähig.
- **Härten:** CHECK: `invite_code is null or invite_code ~ '^SOUL-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$'`. Bestehende Kurzcodes serverseitig rotieren. Join-RPC grob rate-limiten (Defense in Depth).

### MEDIUM — `owner_id` beim Insert vom Client setzbar

- **Ort:** `nuz_runs_stamp_owner` in `03_harden_insert_visibility.sql` setzt `owner_id` **nur wenn null**. Insert-Policy: `auth.uid() is not null`.
- **Risiko:** Ein Insert kann fremde UIDs als Owner stempeln (fremdes Konto sieht/löscht den Run über die Owner-Klausel) oder Ownership vom Trigger-Mitgliedschaftseintrag entkoppeln.
- **Härten:** Im BEFORE-Trigger **immer** `new.owner_id := auth.uid()`, Clientwert ignorieren.

### MEDIUM — RLS unterscheidet nicht anonym vs. echtes Konto

- **Ort:** `isRealUser()` / `getAuthUser()` in `src/lib/auth.ts`; Policies in `02`/`11` nutzen `auth.uid()` bzw. Rolle `authenticated`. Supabase: anonyme Sessions sind `authenticated` + `is_anonymous`.
- **Risiko:** UI-Login-Gates (Create/Join in `nuzlocke-store.ts`) sind umgehbar. `orre_shadow_progress` (Migration 11, **live noch nicht deployed** — check-rls PGRST205) würde nach Deploy ebenfalls anonyme JWTs akzeptieren.
- **Härten:** Account-Tabellen: `auth.jwt() ->> 'is_anonymous' is distinct from 'true'`. Nuzlocke-Mitgliedschaft weiter über Invite-RPC, nicht über nacktes `auth.uid()`. Anon-Sign-in nur behalten, wenn wirklich Gäste ohne Konto multiplayern sollen — aktuell widerspricht die UI dem.

### MEDIUM — Realtime-Kanäle ohne Mitgliedschafts-Autorisierung

- **Ort:** `runChannel` in `src/lib/supabase.ts` (`run:{runId}`, Presence-Key = Player-Id — korrekt für die App). `goLive` / `watchAccountRuns` in `nuzlocke-store.ts`. Keine Private-Channel-Config im Repo.
- **Risiko:** `postgres_changes` folgt RLS (gut). Presence/Broadcast auf öffentlichen Kanälen typischerweise nicht. Wer den Kanalnamen kennt, kann Presence tracken oder fremde `player_id`s vortäuschen (Online-Anzeige/Feed), ohne Zeilen lesen zu dürfen.
- **Härten:** Supabase Realtime Authorization / private channels, Join nur bei `nuz_is_member`. Presence-Payload nicht als Autorität für Spieleridentität nutzen.

### MEDIUM — Jedes Mitglied darf alle Encounter-/Player-Zeilen ändern

- **Ort:** Policies in `02_enforce_nuzlocke_rls.sql`; explizit dokumentiert in `07_nuz_apply_encounter_status.sql`.
- **Risiko:** Für SoulLink-Kaskaden nötig, erlaubt aber auch Löschen/Umschreiben fremder Fänge und Player-Slots. Passt zu „vertrauenswürdige Kleingruppe“, nicht zu „unbekannter Joiner“.
- **Härten:** Encounter-Writes auf `player_id` des Callers beschränken; Kaskaden ausschließlich über `nuz_apply_encounter_status`. Player-DELETE/Rename owner-only oder self-only.

### MEDIUM — Dev-Inspect-Plugin in Produktion

- **Ort:** `vite.config.ts` (`inspectAttr()` ohne `apply: 'serve'`); `plugin-inspect-react-code@1.0.3` (private `publishConfig.registry` `dev.msh.team`). Live und `dist/**/index.html`: Attribute `code-path="src/components/Layout.tsx:…"`.
- **Risiko:** Quellpfade in jeder prerenderten Seite (Information Disclosure, HTML-Bloat). Babel-Transform auf der gesamten JSX-Fläche zur Build-Zeit — Kompromittierung des Pakets = Kompromittierung des Bundles. Lockfile enthält zusätzlich `registry.npmmirror.com` (u. a. Babel-Tree dieses Plugins); `scripts/fix-lockfile-registry.mjs` normalisiert nur `npm.mirrors.msh.team`.
- **Härten:** Plugin nur `apply: 'serve'` oder in Produktion entfernen. Lockfile auf `registry.npmjs.org` zwingen (npmmirror mit aufnehmen). Nach dem nächsten Build prüfen, dass `code-path` aus `dist/` und der Live-Site verschwindet.

### MEDIUM — Username-Enumeration

- **Ort:** RPC `username_available` (check-rls WARN); `src/lib/auth.ts` `usernameAvailable`.
- **Risiko:** Anonym aufrufbar, unterscheidet existierende Usernames. Erleichtert PIN-Guessing gegen bekannte Accounts.
- **Härten:** Anon immer dieselbe Antwort; Rate-Limit; Check nur nach Auth-Captcha; Enumeration beim Reset nicht über Fehlermeldungen leaken (`invalid_credentials` pauschal — `mapError` in `auth.ts` ist hier schon grob richtig).

### LOW — Session in `localStorage`

- **Ort:** `src/lib/supabase.ts` `auth.storage = safeStorage` (localStorage, Quota-Fallback Speicher).
- **Risiko:** Jedes zukünftige XSS liest JWT + lokale Invite-Codes (`pdx2.nuz.*`). Heute durch CSP + kein HTML-Injection stark gemildert.
- **Härten:** Zustand halten (CSP, kein `dangerouslySetInnerHTML`). Langfristig Cookie-Auth prüfen, falls Supabase-SSR/Cookies zum Stack passen.

### LOW — PIN-Felder ohne `autocomplete` / Passwort ohne Maxlänge

- **Ort:** `src/pages/Account.tsx`.
- **Risiko:** Browser können die PIN speichern. Sehr lange Passwort-Bodies belasten Hashing in der Edge Function (DoS).
- **Härten:** PIN: `autocomplete="one-time-code"` oder `off`. Passwort: `maxLength={128}` client + gleich serverseitig.

- **Ort:** `.gitignore` listet kein `.env*`. Derzeit keine Env-Dateien im Tree.
- **Härten:** `.env`, `.env.*`, `!.env.example` eintragen, bevor jemals lokale Secrets entstehen.

### LOW — `nuz_join_by_code` ohne erkennbares Rate-Limit

- **Ort:** `01_prepare_nuzlocke_rls.sql`; RPC live (HTTP 200).
- **Risiko:** Bei 8 Symbolen / 31 Zeichen (~2^40) praxisfern. Relevant nur zusammen mit schwachen/Legacy-Codes.
- **Härten:** Nach Format-CHECK und Rotation: trotzdem Throttle auf der RPC.

### LOW — npm audit HIGH `react-router` 7.18.1

- **Ort:** `package.json` `react-router@^7.6.1`, installiert 7.18.1. Advisory: RSC-Mode CSRF vor der 400-Antwort.
- **Risiko:** App ist Vite-SPA mit `BrowserRouter` (`src/App.tsx`), kein React-Server-Components-Mode. Advisory hier sehr wahrscheinlich **nicht ausnutzbar**.
- **Härten:** Auf ≥ 7.18.2 anheben, sobald verfügbar; Advisory im Changelog gegen den tatsächlichen Router-Modus halten.

### LOW — Plausible sieht Run-Pfade

- **Ort:** `index.html` + `public/plausible-init.js`; SPA-Pageviews in `src/components/Layout.tsx` bei jedem `pathname`.
- **Risiko:** Cookieloses Plausible (gut, in den Legal-Texten verlinkt). Pfade wie `/de/nuzlocke/{uuid}` landen beim Analytics-Host. Keine Usernamen, aber Run-IDs für alle mit Dashboard-Zugang.
- **Härten:** Run-/Account-Pfade von Pageviews ausnehmen oder IDs aggregieren. Keine Custom-Props mit Spieler-/Teamnamen.

### NIT — `rel="noreferrer"` ohne `noopener`

- **Ort:** `src/pages/legal/LegalDocument.tsx`, zwei Footer-Links in `src/components/Footer.tsx`.
- **Risiko:** Moderne Browser implizieren `noopener` bei `noreferrer`. Uneinheitlich zu den übrigen `noopener noreferrer`.
- **Härten:** Überall `rel="noopener noreferrer"`. `LegalDocument` linkifiziert nur `https://` (kein `javascript:`) — gut lassen.

### NIT — `99_rollback_nuzlocke_rls.sql` öffnet alles

- **Ort:** `supabase/migrations/99_rollback_nuzlocke_rls.sql` (`using (true)`).
- **Risiko:** Absichtlicher Notfall-Rollback. Ein versehentliches Anwenden macht die 2026-Härtung rückgängig.
- **Härten:** Datei aus dem Standard-Migrate-Pfad halten, deutlich als Break-Glass markieren, nicht „der Reihe nach“ anwenden.

### NIT — HSTS `preload`

- **Ort:** `netlify.toml` `max-age=63072000; includeSubDomains; preload`. Live gesetzt.
- **Härten:** Nur preload-listen, wenn die Domain wirklich bei hstspreload.org eingereicht ist; sonst Flag weglassen.

## Was bereits gut ist (RLS, CSP, etc.)

- **RLS Stage 2 live:** Anon sieht 0 Zeilen auf `nuz_runs` / `nuz_players` / `nuz_encounters` / `nuz_run_members`; keine harvestbaren Invite-Codes; Writes ohne sichtbare Zeile nicht ansetzbar (`check-rls.mjs`).
- **Mitgliedschaftsmodell:** `nuz_is_member` / `nuz_is_owner` als SECURITY DEFINER mit `search_path = ''` (`01_prepare_nuzlocke_rls.sql`) — kein Policy-Rekursion (42P17), kein search_path-Hijack.
- **Invite als Credential im Happy Path:** Minting per CSPRNG, Unique Index, Join über `nuz_join_by_code` statt `select … eq invite_code` (Client fällt nur bei fehlender RPC auf den Legacy-Pfad zurück). Join-Input `maxLength={16}` in `src/pages/Nuzlocke.tsx` (≥ 16).
- **Rollen-Eskalation auf `nuz_run_members` erkannt und teilweise geschlossen:** Migration 10 (kein Self-Insert `role=owner`), Migration 09 (nur Spalte `archived` + Freeze-Trigger).
- **`isRealUser()`** filtert anonyme Sessions aus Account-UI und Cloud-Sync (`src/lib/auth.ts`). Nicht entfernen.
- **CSP:** kein `unsafe-inline`/`unsafe-eval` in `script-src`; `object-src`/`frame-src`/`frame-ancestors` none; `base-uri`/`form-action` self; Plausible-Stub extern (`public/plausible-init.js`). Live-Header und `check-csp.mjs` grün. `style-src 'unsafe-inline'` ist für GSAP/framer-motion dokumentiert und akzeptabel, solange HTML nicht injiziert wird.
- **Header-Reihenfolge:** `/*` zuerst, Cache-Overrides danach. Live: HTML `max-age=0,must-revalidate`, Assets/Sprites/Fonts `immutable`. HSTS, `X-Frame-Options: DENY`, `COOP: same-origin`, `CORP: same-site`, `Referrer-Policy: strict-origin-when-cross-origin`, `nosniff`.
- **XSS:** kein `dangerouslySetInnerHTML`, kein `innerHTML`/`eval`/`document.write` in `src/`. JSON-LD über `textContent` (`SeoHead.tsx`). Player-Farben per CHECK `^#[0-9A-Fa-f]{6}$`. Textlängen-CHECKs in Migration 01. User-Strings in React-Textknoten.
- **Open Redirects:** `LangGate` / `LangRedirect` / `localePath` prefixen interne Pfade mit `/de|en`. Ungültige Lang-Segmente werden nicht zu protokollrelativen URLs. `LocaleLink` fasst App-Pfade an; externe `target=_blank` mit `noopener noreferrer` (bis auf den Nit oben).
- **Secrets:** kein `service_role` im Tree, keine `.env`-Dateien. Anon-Key nur als Publishable.
- **Presence-Key:** Kommentar und Code nutzen Player-Id, nicht Run-Id (`src/lib/supabase.ts`).
- **Privacy-Analytics:** Plausible ohne Cookies; DPA in den Legal-Texten verlinkt.

## Nicht geprüft / Blind spots

- **Edge Functions** `register-account`, `reset-with-pin` (Quelltext, Secrets, Rate-Limits, Hashing).
- **Dashboard-only Schema:** Policies für `profiles`, `teams`, `nuz_solo_runs` — live anon-dicht, aber nicht als Migration im Repo; Spalten-Grants und Owner-Checks nicht nachgelesen.
- **`orre_shadow_progress`:** SQL im Repo hart, Tabelle live noch nicht da. Nach Deploy erneut `check-rls.mjs`.
- **Ob Legacy-Kurzcodes noch in der DB liegen** (anon nicht sichtbar; braucht service_role/SQL-Editor).
- **Supabase Realtime Authorization** (Projekt-Config außerhalb des Repos).
- **Storage/Auth-Hooks, Mailer, Custom SMTP, Leaked-Password-Protection, MFA** — Dashboard.
- **Netlify-Build-Env / Function-Secrets** (nicht im Repo).
- **Vollständiges `npm audit` inkl. devDependencies** (nur `--omit=dev`).
- **Manuelles Pentest** von Join/Presence mit zweiter Session (bewusst nicht; würde in den Exploit-Bereich kippen).
- **Prerender-Worker / Playwright im CI** als Angriffsfläche des Build-Images.
- **Ob HSTS preload tatsächlich gelistet ist.**
- **Inhalts-CORS von `pokeapi.co` / `raw.githubusercontent.com`** (Third-Party, CSP erlaubt sie).

## Empfohlene Reihenfolge der Fixes

1. **Public Signup aus** und sicherstellen, dass nur `register-account` User anlegt.
2. **INSERT auf `nuz_run_members` für Clients streichen** — Join nur noch über die Invite-RPCs.
3. **Column-Grants + Freeze auf `nuz_runs`:** `owner_id`/`invite_code` nicht durch Mitglieder patchbar; Trigger stempelt `owner_id` immer auf `auth.uid()`.
4. **Invite-Format-CHECK** und Rotation etwaiger Kurzcodes; Join-RPC drosseln.
5. **Edge Functions vendoren** und PIN-Pfad (Hash, Rate-Limit, Logs) reviewen.
6. **`inspectAttr` aus Production-Builds** nehmen; Lockfile-Mirror (`npmmirror`) in den Fix-Script aufnehmen; Live-HTML ohne `code-path` verifizieren.
7. **Anon vs. Account in RLS** für `profiles` / `teams` / `nuz_solo_runs` / (nach Deploy) `orre_shadow_progress`.
8. Realtime private channels; Encounter-Writes player-scoped + Cascade-RPC.
9. Hygiene: `.env` gitignoren, PIN-autocomplete, Passwort-Maxlänge, `react-router` patchen, Plausible-Pfade filtern.

Nach jedem RLS-Schritt: `node scripts/check-rls.mjs` (muss 0 critical bleiben) und die bestehenden UI-Flows Create-Online-Run / Join-by-Code / Reload auf `/de` und `/en` smoke-testen. Nach Header/CSP/index.html: `npm run build && node scripts/check-csp.mjs && node scripts/check-headers.mjs`.
