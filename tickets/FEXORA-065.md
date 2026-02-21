# FEXORA-065: Live-KPIs (SignalR)

**Phase:** 2 — Sprint 4
**Prioritat:** Hoch
**App:** Moderator + API
**Aufwand:** 12-16h
**Status:** Open

---

## Beschreibung

Echtzeit-KPI-Dashboard fur Moderatoren und Agencies: Nachrichten, Antwortzeit, Dialoge/h, Unlocks, Umsatz — alles live via SignalR.

## Aufgaben

- [ ] **API — KPI-Calculation:**
  - `GET /mod/kpis/live` — Aktuelle KPIs (REST Fallback)
  - SignalR Hub: Push KPI-Updates alle 30 Sekunden
  - Metriken pro Moderator:
    - Nachrichten gesendet (heute)
    - Durchschnittliche Antwortzeit
    - Dialoge pro Stunde
    - Unlocks attributed (heute)
    - Umsatz attributed (heute, in Coins)
  - Aggregierte Metriken fur Agency (alle Mods zusammen)
- [ ] **Moderator-App UI:**
  - KPI-Leiste im 3-Spalten-Board (oben oder sidebar)
  - Echtzeit-Zahlen mit Animation bei Anderungen
  - Farb-Indikatoren: Grun (gut), Gelb (ok), Rot (unter Ziel)
- [ ] **Agency-Dashboard:**
  - Team-KPIs aggregiert
  - Pro-Moderator Aufschlusselung
  - Vergleich mit Vortag/Vorwoche

## Akzeptanzkriterien

- KPIs aktualisieren sich in Echtzeit (< 30s Delay)
- Metriken sind korrekt berechnet
- Visuelle Indikatoren helfen bei Performance-Einschatzung
- Agency sieht Team-Ubersicht

## Abhangigkeiten

- FEXORA-064 (Attribution), FEXORA-057 (Mod-Board)
