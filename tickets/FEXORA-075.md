# FEXORA-075: Rate Limits & Quiet Hours (Orchestrator)

**Phase:** 3 — Sprint 5
**Prioritat:** Hoch
**App:** API
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

Rate Limits und Ruhezeiten fur Orchestrator-Aktionen: Max N Aktionen pro Tag pro User, globaler Limiter, Quiet Hours 23-8 Uhr CET.

## Aufgaben

- [x] **Rate Limits (pro User):**
  - Max Aktionen/Tag/User (konfigurierbar pro Szenario)
  - Max Nachrichten/Tag global
  - Tracking in Redis (INCR + TTL)
  - Bei Limit: Step wird auf nachsten Tag verschoben
- [x] **Quiet Hours:**
  - Zeitfenster: 23:00 - 08:00 CET/CEST
  - Keine Aktionen wahrend Quiet Hours
  - Steps werden auf 08:00 nachsten Tag verschoben
  - Timezone: Mitteleuropaische Zeit (DACH-Fokus)
- [x] **Globaler Limiter:**
  - Max Aktionen/Stunde plattformweit
  - Verhindert Uberlastung bei vielen parallelen Szenarien
  - Backpressure: Jobs queuen, nicht droppen
- [x] **Konfiguration:**
  - Rate Limits in `scenario_steps.rate_limit_cfg_json`
  - Globale Limits in `platform_settings`
  - Quiet Hours hardcoded (23-8 CET)

## Akzeptanzkriterien

- Keine Aktionen wahrend Quiet Hours
- User-Rate-Limits werden eingehalten
- Globaler Limiter verhindert Plattform-Uberlastung
- Verschobene Steps werden zum nachsten Zeitfenster ausgefuhrt

## Abhangigkeiten

- FEXORA-073 (Szenario-Engine), FEXORA-074 (Workers)
