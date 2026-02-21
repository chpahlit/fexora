# FEXORA-072: Orchestrator Background Service

**Phase:** 3 — Sprint 5
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

.NET Hosted Service als Orchestrator-Engine: Hangfire Scheduler fur automatisierte Engagement-Aktionen.

## Aufgaben

- [ ] **Fexora.Orchestrator Projekt:**
  - .NET Hosted Service (IHostedService)
  - Hangfire Integration fur Job-Scheduling
  - Job-Queue Konfiguration (Parallelitat, Retry-Policy)
  - Dead Letter Queue fur fehlgeschlagene Jobs
- [ ] **Scheduler:**
  - Minutlicher Check auf fallige Szenario-Schritte
  - Batch-Processing: Enrollments verarbeiten
  - Backpressure-Mechanismus (Queue-Grosse limitieren)
- [ ] **Job-Typen:**
  - `ExecuteScenarioStep` — Einzelnen Schritt ausfuhren
  - `ProcessBroadcast` — Broadcast-Nachrichten versenden
  - `RefreshSegments` — Targeting-Segmente aktualisieren
  - `CleanupCompletedEnrollments` — Abgeschlossene Enrollments aufraumen
- [ ] **Monitoring:**
  - Hangfire Dashboard (nur fur Admins)
  - Metriken: Jobs/Minute, Fehlerrate, Queue-Grosse
  - Alerting bei Queue-Stau

## Akzeptanzkriterien

- Orchestrator startet als Background Service
- Jobs werden zuverlassig ausgefuhrt
- Retry bei Fehlern (mit Exponential Backoff)
- Dead Letter Queue fanger persistente Fehler
- Hangfire Dashboard zuganglich

## Abhangigkeiten

- FEXORA-002 (.NET Solution — Fexora.Orchestrator Projekt)
