# FEXORA-096: Test Infrastructure & Unit Tests

**Phase:** 3a — Security & Hardening
**Prioritat:** Kritisch
**App:** Alle
**Aufwand:** 4-6h
**Status:** ✅ Done

---

## Beschreibung

Aufbau der Test-Infrastruktur und Implementierung erster Unit-Tests fur API (xUnit + Moq) und Frontend-Packages (Vitest).

## Umsetzung

### .NET (71 Tests)
- `Fexora.Tests` xUnit-Projekt mit Moq, EF Core InMemory, ASP.NET Mvc.Testing
- **TokenService** (10 Tests): JWT-Generierung, Claims, Expiration, Issuer/Audience, Refresh-Token-Uniqueness, alle Rollen
- **AuthService** (14 Tests): Register/Login/Refresh/Revoke/GetUserInfo, Validierung (Alter, Duplikate, Passwort-Hashing, Email-Normalisierung)
- **LoginProtectionService** (8 Tests): Lockout, CAPTCHA-Schwelle, Reset, IP-unabhangig, Case-insensitive
- **GlobalExceptionMiddleware** (7 Tests): Exception-Mapping (400/401/404/409/500), JSON-Format, generische 500-Meldung
- **SecurityHeadersMiddleware** (8 Tests): Alle Security-Headers, HSTS nur Production
- **RequestValidationMiddleware** (4 Tests): Body-Size-Limit, Grenzwerte
- **RateLimitingMiddleware** (6 Tests): Rate-Limiting, 429, Headers, Health/OpenAPI Skip, Auth-Endpoint-Limits
- **StartupValidator** (8 Tests): Pflichtfelder, JWT-Secret-Lange, Production-Checks, Placeholder-Erkennung
- **ApiResponse** (6 Tests): Ok/Fail factory methods

### Frontend (52 Tests)
- Vitest als Test-Runner (workspace-weit)
- **@fexora/shared validators** (31 Tests): Login, Register, Profile, Content, Message, Topup, Report, Pagination Schemas
- **@fexora/shared constants** (6 Tests): Rollen, Content-Status, Upload-Limits, API-Routes
- **@fexora/api-client** (15 Tests): HTTP-Methoden, Token-Management, Error-Handling, Pagination

## Abhangigkeiten

- xUnit, Moq, EF Core InMemory (NuGet)
- Vitest (npm)
