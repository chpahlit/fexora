# FEXORA-093: Brute-Force Protection / Account Lockout

**Phase:** 3a — Security & Hardening
**Prioritat:** Hoch
**App:** API
**Aufwand:** 3-4h
**Status:** ✅ Done

---

## Beschreibung

Brute-Force-Schutz fur Login: Failed-Attempt-Tracking per E-Mail und IP, temporare Kontosperre, CAPTCHA-Signal nach 3 Fehlversuchen.

## Umsetzung

- `LoginProtectionService` in Fexora.Infrastructure/Services/
- Redis-basiertes Tracking: Separate Counter fur E-Mail und IP
- Konfigurierbar via appsettings: MaxLoginAttempts=5, LockoutMinutes=15, CaptchaAfterAttempts=3
- AuthController integriert: Lockout-Check vor Login, Attempt-Tracking bei Fehlschlag, Reset bei Erfolg
- `GET /auth/login/status?email=...` Endpoint: Frontend kann CAPTCHA-Anzeige steuern
- Automatischer Counter-Reset nach LockoutMinutes (TTL)

## Abhangigkeiten

- Redis
