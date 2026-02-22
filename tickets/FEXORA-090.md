# FEXORA-090: API Rate Limiting Middleware

**Phase:** 3a — Security & Hardening
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 3-4h
**Status:** ✅ Done

---

## Beschreibung

Redis-basiertes Rate Limiting fur alle API-Endpoints: Per-User und Per-IP Limits, strikte Limits auf Auth-Endpoints, konfigurierbar via appsettings.

## Umsetzung

- `RateLimitingMiddleware` in Fexora.Api/Middleware/
- Sliding Window (1 Minute) via Redis IDistributedCache
- Konfigurierbare Limits: GlobalRpm=120, AuthenticatedRpm=60, AnonymousRpm=30, AuthEndpointRpm=10
- X-RateLimit-Limit und X-RateLimit-Remaining Headers
- Retry-After Header bei 429
- Health/OpenAPI Endpoints ausgenommen

## Abhangigkeiten

- Redis
