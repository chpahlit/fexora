# FEXORA-046: Promo Codes

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Creator erstellen Promo-Codes fur Rabatte auf Unlocks und Abos. Codes konnen prozentual oder fix sein.

## Aufgaben

- [ ] **API-Endpoints:**
  - `POST /promos` — Promo-Code erstellen (Creator)
  - `GET /promos/my` — Eigene Promo-Codes auflisten
  - `POST /promos/{code}/validate` — Code validieren (vor Checkout)
  - `GET /promos/:id/stats` — Nutzungsstatistiken pro Code
- [ ] **Promo-Code Felder:**
  - code (unique), discount_type (percentage/fixed_coins)
  - discount_value, applicable_to (content/subscription/all)
  - max_uses (nullable = unbegrenzt), uses_count
  - valid_from, valid_until (nullable = unbegrenzt)
  - is_active
- [ ] **Einlosung:**
  - User gibt Code bei Unlock oder Abo-Abschluss ein
  - Validierung: Code aktiv? Gultig? Max-Nutzungen erreicht?
  - Rabatt-Berechnung + Anzeige vor Kauf
  - `promo_redemptions` Tabelle: Tracking jeder Einlosung
  - `coin_tx` mit type=promo_discount
- [ ] **Web UI:**
  - **Creator:** Promo-Code erstellen (Form: Code, Rabatttyp, Wert, Gultigkeitsbereich, Limits)
  - **Creator:** Code-Liste mit Stats (Nutzungen, Umsatz)
  - **User:** Code-Eingabefeld bei Unlock/Abo

## Akzeptanzkriterien

- Promo-Code Erstellung und Validierung funktioniert
- Rabatt korrekt berechnet (% und fix)
- Max-Nutzungen werden enforced
- Ablaufdatum wird respektiert
- Stats pro Code einsehbar

## Abhangigkeiten

- FEXORA-032 (Unlock-Flow), FEXORA-050 (Abo-System)
