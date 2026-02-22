# FEXORA-073: Szenario-Engine (Rule-Engine)

**Phase:** 3 — Sprint 5
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 20-28h
**Status:** Done

---

## Beschreibung

Rule-Engine fur automatisierte Engagement-Szenarien: JSON-DSL fur Sequenzen, Trigger, Schritte und Targeting.

## Aufgaben

- [x] **Szenario-Modell:**
  - `scenarios` Tabelle: name, status (active/draft), description
  - `scenario_steps` Tabelle: day_offset, time_offset_min, action_type, sender_profile_id, template_id, targeting_query_json, rate_limit_cfg_json
  - `scenario_enrollments` Tabelle: user enrollment + Status (active/paused/completed/optout)
  - `scenario_executions` Tabelle: Ausfuhrungslog (scheduled_at, executed_at, result)
- [x] **Action-Types:**
  - `visit` — Profilbesuch simulieren
  - `message` — Nachricht senden (im Namen eines Profils)
  - `follow` — Profil folgen
  - `like` — Content liken
- [x] **Szenario-Lifecycle:**
  - Draft -> Active -> Paused -> Archived
  - Enrollment: User wird in Szenario aufgenommen
  - Step-Ausfuhrung nach day_offset + time_offset
  - Completion: Alle Steps durchlaufen
- [x] **Enrollment-Regeln:**
  - Automatisch bei Trigger (z.B. Registrierung, 24h Inaktivitat)
  - Manuell uber Segment-Query
  - Max. 1 aktives Szenario pro User (Prioritats-basiert)
- [x] **CRUD-Endpoints:**
  - `POST /scenarios` — Szenario erstellen
  - `GET /scenarios` — Szenarien auflisten
  - `PATCH /scenarios/:id` — Bearbeiten
  - `POST /scenarios/:id/activate` — Aktivieren
  - `POST /scenarios/:id/pause` — Pausieren

## Akzeptanzkriterien

- Szenarien konnen erstellt und aktiviert werden
- Steps werden zum richtigen Zeitpunkt ausgefuhrt
- Enrollments funktionieren (auto + manuell)
- Execution-Log vollstandig
- Idempotente Ausfuhrung (kein Doppel-Versand)

## Abhangigkeiten

- FEXORA-072 (Orchestrator Service)
