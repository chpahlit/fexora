# FEXORA-009: Monitoring Setup (Sentry + OpenTelemetry)

**Phase:** 0 — Projekt-Setup
**Prioritat:** Mittel
**App:** Alle
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

Monitoring-Stack einrichten: Sentry fur Error Tracking, OpenTelemetry fur Tracing/Metrics, Health-Check Endpoints.

## Aufgaben

- [x] **API (.NET):**
  - Sentry SDK integrieren (Sentry.AspNetCore)
  - Serilog konfigurieren (JSON-Format, Structured Logging)
  - OpenTelemetry Basis-Setup (ASP.NET Core + HttpClient + EF Core Instrumentation)
  - Health-Check Endpoints: `/health` (liveness), `/health/ready` (readiness: DB + Redis)
- [x] **Web-Apps (Next.js):**
  - Error Boundary Komponente mit Sentry Reporting
- [x] Sentry + Serilog config in appsettings.json

## Implementierte Dateien

- `Fexora.Api/Program.cs` — Sentry, Serilog, OpenTelemetry integration
- `Fexora.Api/appsettings.json` — Sentry DSN + Serilog config
- `apps/web/src/components/error-boundary.tsx` — React Error Boundary with Sentry reporting

## Packages hinzugefugt

- Sentry.AspNetCore
- Serilog.AspNetCore
- Serilog.Sinks.Console
- OpenTelemetry.Extensions.Hosting
- OpenTelemetry.Instrumentation.AspNetCore
- OpenTelemetry.Instrumentation.Http
- OpenTelemetry.Instrumentation.EntityFrameworkCore
- OpenTelemetry.Exporter.Console

## Akzeptanzkriterien

- Errors in API werden in Sentry erfasst
- `/health` und `/health/ready` Endpoints liefern korrekten Status
- Structured Logs im JSON-Format (Serilog)
- OpenTelemetry Traces sichtbar in Console Exporter

## Abhangigkeiten

- FEXORA-002 (API), FEXORA-003 (Web-Apps)
