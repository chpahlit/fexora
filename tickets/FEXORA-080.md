# FEXORA-080: A/B-Testing

**Phase:** 3 — Sprint 6
**Prioritat:** Mittel
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

A/B-Testing fur Orchestrator-Nachrichten: Bis zu 3 Varianten, automatische Winner-Ermittlung.

## Aufgaben

- [ ] **A/B-Test Modell:**
  - Varianten pro Broadcast/Szenario-Step (max. 3)
  - Jede Variante: eigenes Template, eigener Sender
  - Zufallsverteilung der User (gleichmassig oder gewichtet)
- [ ] **Tracking:**
  - Pro Variante: Versand-Anzahl, Offnungs-Rate, Antwort-Rate, Unlock-Rate
  - `broadcast_executions.variant` speichert Zuordnung
  - Metriken in Echtzeit berechenbar
- [ ] **Auto-Winner:**
  - Konfigurierbarer Zeitraum (z.B. 24h nach Versand)
  - Konfigurierbarer Metrik (Antwort-Rate, Unlock-Rate)
  - Winner-Variante wird fur restliche User verwendet
- [ ] **API:**
  - A/B-Konfiguration im Broadcast/Szenario
  - Ergebnisse abrufen: `GET /broadcasts/:id/ab-results`

## Akzeptanzkriterien

- User werden korrekt auf Varianten verteilt
- Metriken pro Variante werden getrackt
- Auto-Winner ermittelt beste Variante
- Ergebnisse im Dashboard sichtbar

## Abhangigkeiten

- FEXORA-079 (Broadcasts), FEXORA-076 (Templates)
