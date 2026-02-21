# FEXORA-011: Auth-System + 2FA (TOTP)

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 30-40h
**Status:** Done

---

## Beschreibung

Vollstandiges Authentifizierungssystem mit ASP.NET Identity, JWT + Refresh Tokens, RBAC (6 Rollen) und optionaler TOTP-basierter 2FA.

## Aufgaben

- [ ] ASP.NET Identity Setup mit PostgreSQL Store
- [ ] JWT Access Token + Refresh Token Generierung
- [ ] Token-Refresh Endpoint (`POST /auth/refresh`)
- [ ] RBAC mit 6 Rollen: Guest, User, Creator, Moderator, Agency, Admin
- [ ] Endpoints:
  - `POST /auth/signup` — E-Mail/Passwort, 18+ Checkbox, Consent
  - `POST /auth/login` — Login mit optionalem 2FA-Code
  - `POST /auth/refresh` — Token erneuern
  - `POST /auth/verify-identity` — Ausweis-Upload fur Creator/Mod-Bewerbung
  - `POST /auth/2fa/enable` — TOTP aktivieren (QR-Code + Secret)
  - `POST /auth/2fa/disable` — TOTP deaktivieren
  - `GET /auth/2fa/status` — 2FA-Status abfragen
  - `GET /auth/2fa/backup-codes` — Backup-Codes generieren/anzeigen
  - `POST /auth/2fa/verify` — 2FA-Code verifizieren
- [ ] 2FA Tabelle: `two_factor_auth` (user_id, is_enabled, secret_encrypted, backup_codes_json)
- [ ] Identity Verification: `identity_verifications` Tabelle (Ausweis-Upload, Admin-Review)
- [ ] Account Lockout nach N Fehlversuchen (N = Admin-konfigurierbar, Default: 5)
- [ ] Rate Limiting auf Auth-Endpoints
- [ ] FluentValidation fur alle Auth-DTOs

## Akzeptanzkriterien

- Signup -> Login -> Token-Refresh Flow funktioniert
- RBAC: Endpoints nur fur autorisierte Rollen zuganglich
- 2FA: Aktivierung per QR-Code, Login erfordert TOTP-Code
- Backup-Codes funktionieren als 2FA-Fallback
- Account wird nach 5 Fehlversuchen gesperrt
- Identity Verification Upload funktioniert (Status: pending -> approved/rejected)

## Technische Details

- JWT Secret via Environment Variable
- Refresh Token in DB (revokierbar)
- TOTP Secret AES-verschlusselt in DB
- Backup-Codes: 10 Codes, einmalig verwendbar

## Abhangigkeiten

- FEXORA-002 (.NET Solution)
- FEXORA-022 (EF Core Migrations)
