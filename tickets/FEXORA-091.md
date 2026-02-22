# FEXORA-091: Security Headers Middleware

**Phase:** 3a — Security & Hardening
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 1-2h
**Status:** ✅ Done

---

## Beschreibung

Security Headers fur alle API-Responses: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy.

## Umsetzung

- `SecurityHeadersMiddleware` in Fexora.Api/Middleware/
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
- HSTS: max-age=31536000; includeSubDomains (nur Production)
- CSP: default-src 'none'; frame-ancestors 'none'
- `RequestValidationMiddleware` fur 50 MB Body-Size Limit

## Abhangigkeiten

- Keine
