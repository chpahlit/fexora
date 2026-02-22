# FEXORA-078: Compliance (Opt-Out, DSGVO-Consent)

**Phase:** 3 — Sprint 5
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

DSGVO-Compliance fur den Orchestrator: Opt-Out respektieren, Blacklist, Consent-Prufung vor jeder Aktion.

## Aufgaben

- [x] **Opt-Out System:**
  - User kann Orchestrator-Aktionen opt-out
  - `scenario_enrollments.status = optout`
  - Opt-Out uber Account-Settings
  - Opt-Out uber "Nicht mehr kontaktieren" Link in Nachrichten
- [x] **Blacklist:**
  - Globale Blacklist (Admin-verwaltet)
  - User auf Blacklist erhalten KEINE Orchestrator-Aktionen
  - Automatisch: User die sich beschwert haben
- [x] **Consent-Prufung:**
  - Vor jeder Orchestrator-Aktion: Consent-Flag prufen
  - Consent-Typen: Marketing, Personalisierung
  - Ohne Marketing-Consent: Keine Orchestrator-Nachrichten
- [x] **Compliance-Logging:**
  - Jede Orchestrator-Aktion wird geloggt (Audit-Trail)
  - Consent-Status zum Zeitpunkt der Aktion speichern
  - Export-Fahigkeit fur Behorden-Anfragen

## Akzeptanzkriterien

- Opt-Out Users erhalten keine Orchestrator-Nachrichten
- Blacklisted Users komplett ausgeschlossen
- Ohne Marketing-Consent keine automatisierten Nachrichten
- Compliance-Log vollstandig

## Abhangigkeiten

- FEXORA-069 (DSGVO-Consent-Flags)
- FEXORA-073 (Szenario-Engine)
