# Wezy online bringen (geht komplett am Handy)

## Teil 1: Datenbank (Supabase)
1. supabase.com → anmelden → **New project**
   - Name: `wezy` · Region: **Central EU (Frankfurt)** · Passwort sicher aufheben
2. Links im Menü **SQL Editor** → **New query**
3. Den kompletten Inhalt von `supabase/schema.sql` einfügen → **Run**
   - Unten muss „Success“ stehen.
4. **Authentication → Sign In / Providers → Email**
   - **„Confirm email“ AUSschalten** (siehe Hinweis unten) → Save
5. **Project Settings → API** (oder „Data API“)
   - **Project URL** und den **anon public** Key kopieren → an Claude schicken
   - NIEMALS den „service_role“ Key weitergeben.

## Teil 2: Webseite (GitHub Pages)
Claude lädt die Dateien in ein GitHub-Repository und schaltet GitHub Pages ein.
Danach ist die App erreichbar unter `https://DEINNAME.github.io/wezy/`.

6. In Supabase: **Authentication → URL Configuration**
   - **Site URL**: `https://DEINNAME.github.io/wezy/`
   - Bei **Redirect URLs** dieselbe Adresse hinzufügen.

## Teil 3: Am Handy wie eine App
Seite in Safari öffnen → Teilen → **Zum Home-Bildschirm**.
(Android/Chrome: Menü ⋮ → **App installieren**.)

## Wichtige Hinweise
- **E-Mails:** Der kostenlose Supabase-Mailversand schickt nur an Team-Mitglieder und
  nur 2 Mails pro Stunde. Deshalb ist „Confirm email“ aus. „Passwort vergessen“ klappt
  erst, wenn ein eigener Mail-Anbieter (z. B. Brevo oder Resend, kostenlos startbar)
  unter Authentication → Emails → SMTP eingetragen ist.
- **Meldungen** landen in der Tabelle `reports` (Table Editor). Regelmäßig reinschauen!
- **Konto sperren:** Authentication → Users → Nutzer auswählen → Ban/Delete.
- **Version 1** hat noch keine echte Ausweis-/Selfie-Prüfung. Das Alter wird angegeben
  und kann nicht geändert werden. Echte Verifizierung kommt später.
