# FEXORA-009: Monitoring Setup (Sentry + OpenTelemetry)

**Phase:** 0 — Projekt-Setup
**Prioritat:** Mittel
**App:** Alle
**Aufwand:** 4-6h
**Status:** Open

---

## Beschreibung

Monitoring-Stack einrichten: Sentry fur Error Tracking, OpenTelemetry fur Tracing/Metrics, Health-Check Endpoints.

## Aufgaben

- [ ] **API (.NET):**
  - Sentry SDK integrieren (Exception Tracking)
  - Serilog konfigurieren (JSON-Format, Structured Logging)
  - OpenTelemetry Basis-Setup (Tracing: API -> DB -> Redis -> S3)
  - Health-Check Endpoints: `/health` (liveness), `/health/ready` (readiness: DB + Redis)
- [ ] **Web-Apps (Next.js):**
  - Sentry SDK in allen 3 Apps (`@sentry/nextjs`)
  - Error Boundary Komponente mit Sentry Reporting
  - Source Maps Upload konfigurieren
- [ ] Grafana Cloud Free Tier Setup (optional fur MVP)
- [ ] Alerting-Regeln dokumentieren (Error Rate > 5%, Response Time > 2s)

## Akzeptanzkriterien

- Errors in API und Web-Apps werden in Sentry erfasst
- `/health` und `/health/ready` Endpoints liefern korrekten Status
- Structured Logs im JSON-Format (Serilog)
- OpenTelemetry Traces sichtbar (zumindest in Logs)

## Abhangigkeiten

- FEXORA-002 (API), FEXORA-003 (Web-Apps)
