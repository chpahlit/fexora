# FEXORA-066: Tages-/Wochen-Reports

**Phase:** 2 — Sprint 4
**Prioritat:** Mittel
**App:** Moderator + ACP
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Periodische Reports fur Moderatoren, Agencies und Admins: Provisions-Abrechnung, Team-Leaderboard, Performance-Ubersicht.

## Aufgaben

- [ ] **Moderator-Reports:**
  - Tages-Report: Nachrichten, Dialoge, Unlocks, zugerechneter Umsatz, Provision
  - Wochen-Report: Aggregiert + Trend
  - `moderator_stats_daily` Tabelle als Datenquelle
- [ ] **Team-Leaderboard:**
  - Ranking aller Moderatoren (einer Agency oder plattformweit)
  - Metriken: Umsatz, Unlocks, Nachrichten, Antwortzeit
  - Zeitraum: Heute, Woche, Monat
- [ ] **Provisions-Abrechnung:**
  - Pro Moderator: Zugerechneter Umsatz, Provision-%, Betrag
  - Pro Agency: Aggregierte Provisionen
  - Export fur Buchhaltung (CSV)
- [ ] **UI (Moderator-App):**
  - Reports-Seite mit Tages-/Wochen-Ansicht
  - Leaderboard-Widget
  - Provisions-Ubersicht
- [ ] **UI (ACP):**
  - Moderator-Performance uber alle Agencies
  - Provisions-Gesamtubersicht

## Akzeptanzkriterien

- Tages-Reports zeigen korrekte Daten
- Leaderboard korrekt sortiert
- Provisions-Berechnung stimmt
- CSV-Export funktioniert

## Abhangigkeiten

- FEXORA-064 (Attribution), FEXORA-067 (Vergutungs-Engine)
