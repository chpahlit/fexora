# FEXORA-074: Execution Workers

**Phase:** 3 — Sprint 5
**Prioritat:** Hoch
**App:** API
**Aufwand:** 12-16h
**Status:** Done

---

## Beschreibung

Idempotente Worker fur die Ausfuhrung von Orchestrator-Aktionen: visit, message, follow, like.

## Aufgaben

- [x] **Worker-Architektur:**
  - Interface: `IActionWorker` mit Execute(step, userId)
  - Pro Action-Type eine Worker-Implementierung
  - Idempotency: Prufung ob Aktion bereits ausgefuhrt
  - Ergebnis-Logging in `scenario_executions`
- [x] **VisitWorker:**
  - Feed-Event erstellen (type=visit)
  - Notification an User (optional, konfigurierbar)
- [x] **MessageWorker:**
  - Nachricht im Namen des Sender-Profils senden
  - Template-Variablen ersetzen ({{username}}, etc.)
  - Uber bestehende Chat-Infrastruktur (SignalR + DB)
- [x] **FollowWorker:**
  - Follow-Aktion ausfuhren
  - Notification an User
  - Duplikat-Check (bereits gefolgt?)
- [x] **LikeWorker:**
  - Content liken
  - Notification an Content-Owner
  - Duplikat-Check
- [x] **Error-Handling:**
  - Retry mit Exponential Backoff (max. 3 Versuche)
  - Nach 3 Fehlern: result=fail, in DLQ
  - Skip bei blockierten Usern

## Akzeptanzkriterien

- Alle 4 Worker-Typen funktionieren
- Idempotent: Doppelausfuhrung hat keinen Effekt
- Fehler werden korrekt geloggt
- Blocking wird respektiert
- Workers sind horizontal skalierbar

## Abhangigkeiten

- FEXORA-073 (Szenario-Engine)
- FEXORA-038 (Chat), FEXORA-015 (Follow), FEXORA-018 (Likes)
