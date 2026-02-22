# FEXORA-086: Load-Tests & Hardening

**Phase:** 3 — Sprint 6
**Prioritat:** Kritisch
**App:** Alle
**Aufwand:** 16-22h
**Status:** ✅ Done

---

## Beschreibung

Load-Tests und Hardening fur den Orchestrator und die gesamte Plattform vor Orchestrator-Release.

## Aufgaben

- [ ] **Orchestrator Load-Tests (k6/NBomber):**
  - Szenario mit 10.000 Enrollments: Steps werden korrekt und zeitnah ausgefuhrt
  - Broadcast an 50.000 User: Batch-Versand ohne Absturz
  - Gleichzeitige Szenarien + Broadcasts
  - Queue-Backpressure unter Last testen
- [ ] **Chat Load-Tests:**
  - 500+ gleichzeitige SignalR Connections
  - Nachrichten-Durchsatz unter Last
  - Online-Status Tracking bei vielen Usern
- [ ] **Feed/API Load-Tests:**
  - Feed-Abfrage mit 10.000 Users
  - Concurrent Unlock-Requests (Race Conditions)
  - Trending-Berechnung unter Last
- [ ] **Hardening:**
  - Worker-Queue Konfiguration optimieren (Parallelitat, Batch-Size)
  - Redis Memory-Limits setzen
  - PostgreSQL Connection Pool tunen
  - Backpressure-Mechanismen verifizieren
  - Circuit Breaker fur externe Services testen
- [ ] **Stress-Tests:**
  - API unter 2x erwarteter Last
  - Recovery nach Ausfall (Redis, DB)
  - Graceful Degradation (was passiert wenn Redis ausfalt?)

## Akzeptanzkriterien

- Orchestrator verarbeitet 10.000 Enrollments ohne Fehler
- Broadcast an 50.000 User in < 30 Min
- Chat stabil bei 500+ Connections
- Keine Race Conditions bei Wallet-Operationen
- Recovery nach Komponenten-Ausfall funktioniert

## Abhangigkeiten

- Alle Phase 3 Tickets
