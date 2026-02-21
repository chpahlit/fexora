# FEXORA-035: Coin-Wallet (API)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Coin-Wallet-System: Balance-Management, Transaktionshistorie, Topup-Endpoint. Basis fur alle Monetarisierungsfeatures.

## Aufgaben

- [ ] **Wallet-Management:**
  - `coin_wallets` Tabelle: user_id, balance, updated_at
  - Wallet wird bei User-Registrierung automatisch mit Balance 0 erstellt
  - Atomare Balance-Operationen (SELECT FOR UPDATE oder Optimistic Concurrency)
- [ ] **Transaktionshistorie:**
  - `coin_tx` Tabelle mit allen Transaktionstypen:
    - topup, purchase, unlock, subscription, tip, gift
    - ppv_unlock, escrow_hold, escrow_release, escrow_refund
    - refund, referral_bonus, payout, promo_discount
  - Jede Balance-Anderung erzeugt einen coin_tx Eintrag
- [ ] **API-Endpoints:**
  - `GET /wallet` — Balance + letzte Transaktionen
  - `GET /wallet/history` — Vollstandige Transaktionshistorie (paginiert)
  - `POST /wallet/topup` — Coins kaufen (delegiert an IPaymentService)
  - `POST /wallet/transfer` — Interne Coin-Transfers (Tips/Gifts)
- [ ] **Business Rules:**
  - Fester Kurs: 1 EUR = 100 Coins (hardcoded)
  - Coin-Packs: 500/1.500/3.000/7.500 Coins (5/15/30/75 EUR)
  - Kein Bonus bei grosseren Packs
  - Balance darf nie negativ werden
- [ ] **Plattform-Fee:**
  - Creator erhalt X% der Coins (z.B. 80%)
  - Fee pro Einnahmetyp konfigurierbar (platform_settings)
  - Fee-Berechnung bei jeder Gutschrift an Creator

## Akzeptanzkriterien

- Wallet-Balance korrekt bei allen Operationen
- Keine Race Conditions bei parallelen Transaktionen
- Transaktionshistorie vollstandig und korrekt
- Balance kann nicht negativ werden
- Plattform-Fee wird korrekt berechnet

## Abhangigkeiten

- FEXORA-022 (Migrations)
- FEXORA-036 (Payment-Integration fur Topup)
