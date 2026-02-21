# FEXORA-012: User-Registration & Login UI

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** Web
**Aufwand:** 16-20h
**Status:** Done

---

## Beschreibung

Frontend fur Registration, Login, 2FA-Setup und Ausweis-Upload. Vollstandiger Auth-Flow mit Form Validation (Zod).

## Aufgaben

- [ ] **Registration Page:**
  - E-Mail + Passwort Felder
  - 18+ Checkbox (Pflicht)
  - AGB/Datenschutz Consent Checkbox (Pflicht)
  - Optional: Referral-Code Eingabe
  - Zod Validation + Fehlermeldungen (i18n)
- [ ] **Login Page:**
  - E-Mail + Passwort
  - 2FA-Code Eingabe (conditional, wenn 2FA aktiv)
  - "Passwort vergessen" Link
- [ ] **2FA-Setup (Account Settings):**
  - QR-Code Anzeige zum Scannen
  - Manuelle Code-Eingabe (Secret)
  - Verifizierung mit erstem TOTP-Code
  - Backup-Codes anzeigen + Download
  - 2FA deaktivieren
- [ ] **Identity Verification:**
  - Ausweis-Upload Formular (fur Creator/Mod-Bewerbung)
  - Status-Anzeige (pending/approved/rejected)
  - Re-Upload bei Ablehnung
- [ ] Auth State Management (JWT in httpOnly Cookie oder Memory)
- [ ] Protected Routes (Redirect zu Login)
- [ ] Automatischer Token-Refresh

## Akzeptanzkriterien

- Neuer User kann sich registrieren und einloggen
- 2FA kann aktiviert/deaktiviert werden
- Ausweis-Upload funktioniert mit Status-Tracking
- Form Validation zeigt Fehler in DE/EN
- Token wird automatisch erneuert

## Abhangigkeiten

- FEXORA-011 (Auth API)
- FEXORA-003 (Next.js Web App)
- FEXORA-008 (i18n)
