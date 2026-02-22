# FEXORA-085: Attribution-Anbindung (Orchestrator)

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** API + ACP
**Aufwand:** 8-12h
**Status:** ✅ Done

---

## Beschreibung

Attribution fur Orchestrator-Aktionen: Umsatzzuordnung pro Szenario und Step. Welche Orchestrator-Aktion hat zu welchem Umsatz gefuhrt?

## Aufgaben

- [ ] **Orchestrator-Attribution:**
  - Erweiterung der bestehenden Attributionslogik (FEXORA-064)
  - Zusatzlich: Szenario-ID und Step-ID bei Attribution speichern
  - Unlock innerhalb von 30 Min nach Orchestrator-Nachricht -> Attribution an Szenario
- [ ] **Metriken pro Szenario:**
  - Zugerechneter Umsatz pro Szenario
  - Zugerechneter Umsatz pro Step
  - Conversion-Rate pro Step
- [ ] **Metriken pro Broadcast:**
  - Zugerechneter Umsatz pro Broadcast
  - Pro A/B-Variante: Umsatz-Vergleich
- [ ] **ACP-Integration:**
  - Umsatz-Spalte in Szenario-Liste
  - ROI-Berechnung im Orchestrator-Dashboard
  - Funnel mit Umsatz-Anzeige pro Step

## Akzeptanzkriterien

- Umsatz korrekt Szenarien/Steps zugeordnet
- Metriken im ACP sichtbar
- ROI-Berechnung aussagekraftig
- Keine Doppel-Attribution (Orchestrator vs. Moderator)

## Abhangigkeiten

- FEXORA-064 (Attribution), FEXORA-073 (Szenarien), FEXORA-079 (Broadcasts)
