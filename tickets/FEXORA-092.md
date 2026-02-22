# FEXORA-092: Environment Validation

**Phase:** 3a — Security & Hardening
**Prioritat:** Hoch
**App:** API
**Aufwand:** 1-2h
**Status:** ✅ Done

---

## Beschreibung

Startup-Validierung aller erforderlichen Konfigurationswerte: Fehlende Configs verhindern API-Start statt stiller Fehler zur Laufzeit.

## Umsetzung

- `StartupValidator` in Fexora.Api/Middleware/
- Pflichtfelder: ConnectionStrings:Default, Redis:Connection, Jwt:Secret/Issuer/Audience
- JWT Secret muss mindestens 32 Zeichen lang sein
- Production-Only: Sentry DSN, Placeholder-Check fur Stripe/Resend/Google Keys
- Production: JWT Secret darf nicht der Dev-Default sein
- Wird vor `builder.Build()` aufgerufen

## Abhangigkeiten

- Keine
