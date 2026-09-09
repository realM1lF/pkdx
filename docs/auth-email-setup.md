# Account: E-Mail + Passwort auf Supabase einrichten

Runbook für den Branch `feat/email-password-auth`. Lokal und Live teilen **dasselbe** Projekt. Nichts davon ist schon im Dashboard gemacht.

Projekt: `iqsdojzyqznmcirypdnk`  
Dashboard: https://supabase.com/dashboard/project/iqsdojzyqznmcirypdnk  
App: `https://mypokepanion.com` und lokal `http://localhost:3000`

Mails laufen nur über **Supabase Auth** (GoTrue-Templates + Projekt-SMTP). Kein Resend, kein Clerk, kein Extra-Secret.

`reset-with-pin` nicht anfassen. Altkonten brauchen die bestehende Live-Function.

## Was schon im Repo liegt (nach Merge dieses Branches)

| Pfad | Rolle |
|---|---|
| `src/lib/auth.ts`, `src/pages/Account.tsx` | Login E-Mail oder Username, Register mit Confirm, Settings, Bind, Export, Delete |
| `supabase/migrations/17_profiles_email.sql` | Spalte `profiles.email` + Guard gegen `*@users.mypokepanion.com` |
| `supabase/functions/register-account/` | **ersetzt** die alte PIN-Register-Function |
| `supabase/functions/login-with-username/` | neu: Username-Login nach Mail-Bind |
| `supabase/functions/delete-account/` | neu: Konto löschen |

Alte Konten: Auth-Mail bleibt `{username}@users.mypokepanion.com`, Login weiter Username + Passwort + PIN. E-Mail-Login erst nach Bind in den Settings.

## Reihenfolge (nicht tauschen)

1. SQL (Schritt A)
2. Auth-Schalter + Redirects (Schritt B)
3. Functions deployen (Schritt C)
4. Frontend dieses Branches live oder lokal gegen dasselbe Projekt testen (Schritt D)

SQL vor Function. Sonst legt `register-account` den User an, `profiles.email` fehlt, Function löscht den User wieder.

Function `register-account` vor dem Frontend-Release: die **Live-Seite** (alter Code auf `main`) schickt noch `recoveryCode`. Neue Function erwartet `email`. Live-Register ist dann kaputt, bis dieses Frontend auch auf `main` ist.

Sicheres Release: A + B vorbereiten, C + Frontend-Deploy **in einem Rutsch**. Oder zuerst nur lokal testen und Live-Register in der Zeit nicht benutzen.

## A. SQL

1. Dashboard → **SQL Editor** → New query.
2. Inhalt von [`supabase/migrations/17_profiles_email.sql`](../supabase/migrations/17_profiles_email.sql) komplett einfügen (inkl. `begin;` / `commit;`).
3. **Run**.
4. Prüfen: Table Editor → `profiles` → Spalte `email` existiert (nullable). Alte Zeilen ohne Mail bleiben leer.

## B. Auth-Dashboard

### B1. Email-Provider

**Authentication → Providers → Email**

- Enable Email provider: **an**
- Confirm email: **an** (unbestätigt = kein Login)
- Secure password change: an lassen, wenn vorhanden
- **Allow new users to sign up** / Public signup: **aus**  
  Neue User nur über `register-account`. Client-`signUp` bleibt zu.

### B2. Anonymous

**Authentication → Providers → Anonymous**

- **an** lassen. Aus = Nuzlocke-Gäste ohne `auth.uid()`, RLS bricht.

### B3. URLs

**Authentication → URL Configuration**

Site URL darf Prod bleiben: `https://mypokepanion.com`

Redirect URLs, jede Zeile extra, exakt:

```
http://localhost:3000/de/account
http://localhost:3000/en/account
https://mypokepanion.com/de/account
https://mypokepanion.com/en/account
```

Wildcards nur wenn ihr sie versteht. Confirm- und Reset-Links müssen matchen, sonst landet der Klick ohne Session.

### B4. Mails

**Authentication → Emails**

Templates (Confirm signup, Reset password, Change email) anlassen. Absender-Name darf „MyPokePanion“ heißen.

**Erster Test:** Built-in-Mailer. Kein SMTP eintragen.

Grenzen Built-in:

- grob 3–4 Mails pro Stunde
- Absender `noreply@mail.app.supabase.io`
- oft Spam
- fremde Inbox (nicht im Supabase-Team) kommt häufig nicht an

Zum ersten Mal: Mail-Adresse nehmen, die im Supabase-Org-Team liegt. Spam-Ordner prüfen.

**Später ernsthaft:** dieselbe Seite → Custom SMTP (IONOS, mailbox.org, Google Workspace, …). Weiterhin „über Supabase“, nur der Transport ändert sich. Nach dem Umschalten das Schutzlimit **30 Mails/h** anheben, sonst wirkt SMTP tot.

Kein `RESEND_API_KEY` in Function Secrets.

## C. Functions deployen

Lokal, im Repo-Root, [Supabase CLI](https://supabase.com/docs/guides/cli) eingeloggt (`npx supabase login`).

```bash
npx supabase functions deploy register-account --project-ref iqsdojzyqznmcirypdnk
npx supabase functions deploy login-with-username --project-ref iqsdojzyqznmcirypdnk
npx supabase functions deploy delete-account --project-ref iqsdojzyqznmcirypdnk
```

JWT verification an lassen (Default).

**Nicht** deployen: `reset-with-pin`. Die alte Live-Function bleibt für PIN-Reset.

Secrets: keine neuen. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` setzt die Plattform selbst.

Dashboard-Check: **Edge Functions** listet die drei Namen, letzte Deploy-Zeit frisch.

## D. Testen

Frontend dieses Branches:

```bash
npm run dev
```

Dann `http://localhost:3000/de/account` und `http://localhost:3000/en/account`.

| Fall | Erwartung |
|---|---|
| Altkonto: Username + Passwort | Login wie bisher, kein Dashboard-Schritt nötig |
| Altkonto: Reset → „Mit Recovery-Code“ | PIN-Pfad, alte Function |
| Neu: Register | User in **Authentication → Users**, `email_confirmed` erst `false` |
| Confirm-Link in der Mail | landet auf `/:lang/account`, danach Login mit E-Mail + Passwort |
| Neu: Login mit Username | nach Confirm, über `login-with-username` |
| Altkonto Settings → E-Mail hinterlegen | Change-email-Mail, nach Confirm Login per E-Mail **oder** Username |
| Reset-Mail (echte Adresse) | Built-in oder Custom SMTP |
| Konto löschen | User weg, Teams/Profil weg |

Test-Mail: echte Adresse. Nie `*@users.mypokepanion.com` (reserviert, Client lehnt ab).

Console: keine i18next-Missing-Keys. Nach Confirm: `Authentication → Users` → confirmed.

## Wenn etwas fehlt

| Symptom | Ursache |
|---|---|
| Register „unknown“, User taucht kurz auf und ist weg | Schritt A nicht gelaufen (`profiles.email` fehlt) |
| Register ok, keine Mail | Built-in-Limit / Spam / Mail nicht im Team. Oder Function-Deploy alt (noch Resend-Zweig) |
| Confirm-Klick, nicht eingeloggt | Redirect URL fehlt (B3), oder Link auf Prod statt localhost |
| Username-Login nach Bind tot | `login-with-username` nicht deployed |
| Live-Seite Register kaputt, lokal geht | Function schon neu, `main`-Frontend noch alt. Frontend mergen oder Function nicht auf Prod lassen |
| Nuzlocke-Gäste tot | Anonymous ausgeschaltet |

## Checkliste vor dem ersten Test

- [ ] `17_profiles_email.sql` im SQL Editor gelaufen
- [ ] Confirm email an, Public signup aus, Anonymous an
- [ ] vier Redirect-URLs gespeichert
- [ ] drei Functions deployed, `reset-with-pin` unberührt
- [ ] Branch-Frontend lokal oder nach Merge live
- [ ] Test-Mail bereit (Team-Adresse, wenn Built-in)
