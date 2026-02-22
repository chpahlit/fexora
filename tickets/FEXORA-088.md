# FEXORA-088: Social Login (Google, Apple)

**Phase:** 2a — Erweiterungen
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 12-16h
**Status:** ✅ Done

---

## Beschreibung

Social Login mit Google und Apple Sign-In: Senkt Registrierungshurde, Optional neben E-Mail/Passwort.

## Aufgaben

- [ ] **API — OAuth Integration:**
  - Google OAuth 2.0 (OpenID Connect)
  - Apple Sign-In (mit Apple-spezifischer Logik)
  - Endpoints:
    - `GET /auth/google` — Google Login initiieren
    - `GET /auth/google/callback` — Google Callback
    - `GET /auth/apple` — Apple Login initiieren
    - `GET /auth/apple/callback` — Apple Callback
  - Account-Verknupfung: Social Login mit bestehendem Account verbinden
  - Neuer Account: Automatisch User-Rolle, Profil erstellen
- [ ] **Account-Linking:**
  - In Account-Settings: Google/Apple verknupfen/trennen
  - Ein Account kann mehrere Login-Methoden haben
  - Mindestens eine Login-Methode muss aktiv bleiben
- [ ] **Web UI:**
  - "Mit Google anmelden" Button auf Login/Registration
  - "Mit Apple anmelden" Button
  - Social Login Buttons neben E-Mail/Passwort-Form
  - Account-Settings: Verknupfte Accounts anzeigen
- [ ] **Sicherheit:**
  - State-Parameter fur CSRF-Schutz
  - Nonce-Validierung
  - Token-Verifizierung (Google/Apple Public Keys)
  - 18+ Checkbox auch bei Social Login (Pflicht)

## Akzeptanzkriterien

- Google Login funktioniert end-to-end
- Apple Login funktioniert end-to-end
- Bestehende Accounts konnen verknupft werden
- 18+ Check auch bei Social Login
- Keine Sicherheitslucken (CSRF, Token-Manipulation)

## Abhangigkeiten

- FEXORA-011 (Auth-System)
- FEXORA-012 (Login UI)
