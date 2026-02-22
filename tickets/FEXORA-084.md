# FEXORA-084: Orchestrator-Dashboard

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 10-14h
**Status:** ✅ Done

---

## Beschreibung

Ubersichts-Dashboard fur den Orchestrator: Laufende Szenarien, KPIs, Fehler-/Retry-Queue.

## Aufgaben

- [ ] **Dashboard-Ubersicht:**
  - Aktive Szenarien (Anzahl, Enrollments)
  - Geplante Broadcasts
  - Heute ausgefuhrte Aktionen (Visit/Message/Follow/Like)
  - Erfolgsrate (%)
- [ ] **Szenario-Metriken:**
  - Pro Szenario: Enrollments, Completion-Rate, Conversion-Rate
  - Funnel-Ansicht: Step 1 -> Step 2 -> ... -> Conversion
  - Vergleich zwischen Szenarien
- [ ] **Broadcast-Metriken:**
  - Pro Broadcast: Versand-Anzahl, Antwort-Rate, Unlock-Rate
  - A/B-Ergebnisse
  - Trends uber Zeit
- [ ] **Fehler-/Retry-Queue:**
  - Failed Jobs anzeigen
  - Retry-Option
  - Dead Letter Queue einsehen
  - Error-Details (was ist fehlgeschlagen, warum)
- [ ] **KPI-Widgets:**
  - Orchestrator-Umsatz (attributierter Umsatz durch Orchestrator-Aktionen)
  - ROI-Berechnung (Aktionen -> Umsatz)
  - Trend-Grafiken

## Akzeptanzkriterien

- Dashboard zeigt Echtzeit-Status aller Szenarien/Broadcasts
- Metriken korrekt berechnet
- Fehler-Queue hilft beim Debugging
- KPIs zeigen ROI des Orchestrators

## Abhangigkeiten

- FEXORA-073 (Szenarien), FEXORA-079 (Broadcasts)
