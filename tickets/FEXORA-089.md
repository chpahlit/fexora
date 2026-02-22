# FEXORA-089: Global Exception Middleware

**Phase:** 3a — Security & Hardening
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 2-3h
**Status:** ✅ Done

---

## Beschreibung

Zentrales Exception-Handling fur alle API-Endpoints: Standardisierte Error-Responses, kein Leaking von Stack-Traces, Sentry-Integration.

## Umsetzung

- `GlobalExceptionMiddleware` in Fexora.Api/Middleware/
- Exception-Typ-Mapping: ArgumentException → 400, UnauthorizedAccessException → 401, InvalidOperationException → 409, KeyNotFoundException → 404, default → 500
- Nur 500er werden als Error geloggt, 4xx als Warning
- JSON-Response im `ApiResponse<T>` Format
- Registriert als erster Middleware im Pipeline

## Abhangigkeiten

- Keine
