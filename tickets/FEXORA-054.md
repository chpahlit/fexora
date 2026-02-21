# FEXORA-054: Payments & Payouts

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** ACP + API
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Admin-Bereich fur Zahlungsubersicht, Coin-Pack-Verkaufe, Auszahlungsverwaltung und Disputes.

## Aufgaben

- [ ] **Umsatzubersicht:**
  - Gesamtumsatz (EUR + Coins)
  - Aufschlusselung: Coin-Pack-Verkaufe, Plattform-Fees
  - Zeitraum-Filter: Heute, Woche, Monat, Custom
  - Grafiken (Umsatz-Trend)
- [ ] **Coin-Pack-Verkaufe:**
  - Liste aller Topup-Transaktionen
  - Filter: Pack-Grosse, Datum, User
- [ ] **Auszahlungen:**
  - Payout-Queue: Ausstehende Auszahlungsanfragen
  - Payout approven / ablehnen
  - Auszahlungs-Details: Creator, Betrag, Methode
  - Auszahlungs-Historie
- [ ] **Refund-Management:**
  - `POST /admin/refunds/:txId` — Manuelle Erstattung
  - Erstattungs-Log mit Grund
  - Nur fur Sonderfalle/technische Fehler
- [ ] **Disputes:**
  - Dispute-Queue (aus Custom Requests)
  - Escrow-Details: Request, Delivery, Chat-Verlauf
  - Entscheidung: Refund an User oder Release an Creator

## Akzeptanzkriterien

- Umsatz-Dashboard mit korrekten Zahlen
- Payout-Queue mit Approve/Reject
- Manuelle Erstattung funktioniert
- Dispute-Entscheidung wirkt auf Escrow
- CSV-Export fur Buchhaltung

## Abhangigkeiten

- FEXORA-036 (Payment), FEXORA-035 (Wallet), FEXORA-044 (Escrow)
