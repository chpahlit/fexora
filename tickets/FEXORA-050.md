# FEXORA-050: Abo-System (API)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 20-28h
**Status:** Open

---

## Beschreibung

Flexibles Subscription-System: Creator definiert Abo-Stufen mit Perks, User abonniert mit Coins oder EUR, automatische monatliche Verlangerung.

## Aufgaben

- [ ] **Subscription Tiers (Creator-seitig):**
  - CRUD fur `subscription_tiers`
  - Felder: name, description, price_coins, price_eur, payment_mode (coins/eur/both)
  - `perks_json`: { all_paid_content, chat_free, exclusive_badge, custom_perks[] }
  - sort_order, is_active
  - Beliebig viele Stufen pro Creator
- [ ] **Subscribe/Cancel (User-seitig):**
  - `POST /subscriptions/subscribe` — Abonnieren (Tier + Payment-Mode)
  - `POST /subscriptions/cancel` — Kundigen (Zugang bis Periodenende)
  - `GET /subscriptions/plans/:creatorId` — Verfugbare Tiers
  - `GET /subscriptions/my` — Eigene aktive Abos
- [ ] **Recurring-Verlangerung:**
  - Hangfire Job: Taglicher Check fur fallige Verlangerungen
  - **Coins:** Automatische Abbuchung vom Wallet
  - **EUR:** IPaymentService Recurring Charge
  - Grace Period: 3 Tage bei fehlgeschlagener Zahlung
  - Nach Grace Period: Auto-Cancel mit Benachrichtigung
  - Retry-Logik bei fehlgeschlagener Zahlung
- [ ] **Content-Zugangs-Prufung:**
  - Check: Einzelkauf ODER aktives Abo der passenden Stufe
  - Perk-basiert: "all_paid_content" -> Zugang zu allem
  - Chat-Perk: "chat_free" -> uberschreibt Chat-Pricing
- [ ] **Notifications:**
  - subscription_renewed, subscription_cancelled
  - subscription_renewal_failed, subscription_expiring_soon
  - new_subscriber (an Creator)
- [ ] **Upgrade/Downgrade:**
  - Upgrade zwischen Stufen: Anteilige Verrechnung
  - Downgrade: Wirksam zum Periodenende

## Akzeptanzkriterien

- Creator kann Abo-Stufen mit Perks erstellen
- User kann abonnieren (Coins oder EUR)
- Monatliche Verlangerung funktioniert automatisch
- Grace Period bei Zahlungsfehler
- Content-Zugang korrekt basierend auf Abo-Status
- Chat-Perk uberschreibt Chat-Pricing

## Abhangigkeiten

- FEXORA-035 (Wallet), FEXORA-036 (Payment)
