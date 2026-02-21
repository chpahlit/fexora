# FEXORA-036: Payment-Integration (IPaymentService)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 16-22h
**Status:** Open

---

## Beschreibung

Generisches Payment-Interface mit erster Provider-Implementierung. Coin-Pack-Kaufe, Webhook-Handling, Payout-Vorbereitung.

## Aufgaben

- [ ] **IPaymentService Interface (Fexora.Core):**
  - `CreateCheckoutSession(amount, currency, metadata)` — Checkout starten
  - `ProcessWebhook(payload, signature)` — Webhook verarbeiten
  - `CreatePayout(amount, recipientId)` — Auszahlung an Creator
  - `GetPaymentStatus(paymentId)` — Status abfragen
  - `CancelSubscription(subscriptionId)` — Recurring abbrechen
- [ ] **Erste Provider-Implementierung (Fexora.Infrastructure):**
  - Stripe oder alternativer Provider
  - Checkout Session fur Coin-Packs
  - Webhook Handler (payment_intent.succeeded, etc.)
  - Idempotency-Keys fur Transaktionen
- [ ] **Coin-Pack-Kauf Flow:**
  1. User wahlt Coin-Pack (500/1.500/3.000/7.500 Coins)
  2. API erstellt Checkout Session beim Provider
  3. User bezahlt extern
  4. Webhook bestatigt Zahlung
  5. Coins werden dem Wallet gutgeschrieben (`coin_tx`, type=topup)
- [ ] **Payout-Vorbereitung:**
  - Payout-Minimum: 50 EUR (Admin-konfigurierbar)
  - `POST /creator/payouts/request` — Auszahlung anfordern
  - Payout-Status: pending -> processing -> completed / failed
- [ ] **Sicherheit:**
  - Webhook-Signatur-Verifizierung
  - Idempotency (doppelte Webhooks ignorieren)
  - Payment-Secret in Environment Variables

## Akzeptanzkriterien

- Coin-Pack-Kauf funktioniert end-to-end
- Webhook verarbeitet Zahlungsbestatigungen korrekt
- Coins werden nach Zahlung gutgeschrieben
- Kein doppeltes Gutschreiben bei Webhook-Retry
- Provider austauschbar (nur Infrastructure-Layer andern)

## Abhangigkeiten

- FEXORA-035 (Coin-Wallet)
- FEXORA-002 (.NET Solution)
