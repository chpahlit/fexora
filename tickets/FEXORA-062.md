# FEXORA-062: Agency-Dashboard

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** Moderator-App
**Aufwand:** 16-22h
**Status:** Open

---

## Beschreibung

Agency-Dashboard in der Moderator-App (nur fur Agency-Rolle): Creator-Verwaltung, Moderator-Management, Zuweisungen, KPIs, Umsatz, Leaderboard.

## Aufgaben

- [ ] **Creator-Verwaltung:**
  - Eigene Creator-Profile erstellen/bearbeiten
  - Content hochladen fur Creator
  - Preise und Abo-Stufen setzen
  - Creator-Status ubersicht
- [ ] **Moderator-Management:**
  - Moderatoren einladen (E-Mail-Einladung)
  - Status andern (aktiv/inaktiv)
  - Rollen/Rechte setzen
- [ ] **Creator-Zuweisungen:**
  - Moderatoren zu Creator-Profilen zuweisen/entfernen
  - Ubersicht: Welcher Mod betreut welchen Creator
  - Kapazitatsplanung
- [ ] **Agency-KPIs:**
  - Aggregierte Metriken: Nachrichten, Unlocks, Abo-Conversions, Umsatz
  - SignalR Live-Updates
  - Zeitraum-Filter
- [ ] **Umsatz-Ubersicht:**
  - Einnahmen pro Creator
  - Einnahmen pro Moderator
  - Zeitraume: Tag/Woche/Monat
  - Export (CSV)
- [ ] **Team-Leaderboard:**
  - Ranking der Moderatoren nach Performance
  - Metriken: Nachrichten, Unlocks, Umsatz, Antwortzeit

## Akzeptanzkriterien

- Nur fur Agency-Rolle sichtbar
- Creator CRUD funktioniert
- Zuweisungen andern sich in Echtzeit
- KPIs zeigen korrekte Live-Daten
- Leaderboard motiviert das Team
- Export funktioniert

## Abhangigkeiten

- FEXORA-061 (Agency API), FEXORA-057 (Moderator Board)
