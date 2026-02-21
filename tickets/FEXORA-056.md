# FEXORA-056: Reports Dashboard

**Phase:** 2 — Sprint 3
**Prioritat:** Mittel
**App:** ACP
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Admin Reports-Dashboard: Umsatze, Plattform-Metriken, KPIs, CSV-Export.

## Aufgaben

- [ ] **Umsatz-Reports:**
  - Gesamtumsatz (Unlocks + Abos + Tips + PPV + Custom Requests)
  - Abo-MRR (Monthly Recurring Revenue)
  - Umsatz pro Einnahmetyp
  - Plattform-Fee Einnahmen
- [ ] **User-Metriken:**
  - DAU/MAU (Daily/Monthly Active Users)
  - Registrierungen pro Tag/Woche
  - Retention-Rate
  - ARPPU (Average Revenue Per Paying User)
- [ ] **Content-Metriken:**
  - Unlock-Rate (Unlocks / Views)
  - Content-Erstellung pro Tag
  - Top Content nach Umsatz
- [ ] **Weitere Reports:**
  - Agency-Performance (Umsatz pro Agency)
  - Referral-Stats (Conversions, Kosten)
  - Funnel-Tracking (Registration -> First Purchase)
  - Tax/VAT Ubersicht
- [ ] **Features:**
  - Zeitraum-Filter (Tag, Woche, Monat, Custom)
  - Grafiken (Line Charts, Bar Charts)
  - CSV-Export fur alle Reports
  - Materialized Views fur Performance

## Akzeptanzkriterien

- Alle Reports zeigen korrekte Daten
- Zeitraum-Filter funktioniert
- CSV-Export aller Daten
- Dashboard ladt performant (< 2s)

## Abhangigkeiten

- FEXORA-035 (Wallet-Daten), FEXORA-050 (Abo-Daten)
