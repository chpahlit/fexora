# FEXORA-025: Account Recovery (Passwort-Reset)

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 6-8h
**Status:** Open

---

## Beschreibung

Passwort-Reset via E-Mail mit IEmailService (Resend). Sicherer Token-basierter Flow.

## Aufgaben

- [ ] **API-Endpoints:**
  - `POST /auth/password-reset` — Passwort-Reset anfordern (E-Mail)
  - `POST /auth/password-reset/confirm` — Neues Passwort setzen (mit Token)
- [ ] **Flow:**
  1. User gibt E-Mail ein
  2. API sendet Reset-Link per E-Mail (IEmailService/Resend)
  3. Link enthalt einmaligen Token (JWT oder random, 1h Gultigkeit)
  4. User klickt Link, gibt neues Passwort ein
  5. Token wird verifiziert, Passwort geandert
- [ ] **IEmailService Interface:**
  - In `Fexora.Core` definieren
  - Resend-Implementierung in `Fexora.Infrastructure`
  - E-Mail-Templates: Passwort-Reset (DE + EN)
- [ ] **Web UI:**
  - "Passwort vergessen" Seite (E-Mail eingeben)
  - "Neues Passwort" Seite (mit Token aus URL)
  - Zod Validation (Passwort-Starke)
  - Erfolgs-/Fehlermeldungen
- [ ] **Sicherheit:**
  - Token einmalig verwendbar
  - Rate Limiting auf Reset-Endpoint (3/Stunde pro E-Mail)
  - Keine Info ob E-Mail existiert (Privacy)

## Akzeptanzkriterien

- Passwort-Reset-Flow funktioniert end-to-end
- E-Mail wird korrekt versendet (Resend)
- Token ist einmalig und zeitlich begrenzt
- Kein Information Leak (E-Mail existiert oder nicht)
- Neue E-Mail-Infrastruktur (IEmailService) steht

## Abhangigkeiten

- FEXORA-011 (Auth)
- FEXORA-003 (Web App)
