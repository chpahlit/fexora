# FEXORA-037: Wallet UI (Coin-Packs kaufen)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** Web
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Wallet-Seite: Coin-Balance anzeigen, Coin-Packs kaufen, Transaktionshistorie einsehen.

## Aufgaben

- [ ] **Balance-Anzeige:**
  - Aktuelle Coin-Balance prominent angezeigt
  - Balance auch in Navigation (Header) als Badge
- [ ] **Coin-Packs kaufen:**
  - Pack-Auswahl: 500/1.500/3.000/7.500 Coins (5/15/30/75 EUR)
  - Pack-Karten mit Coin-Anzahl und EUR-Preis
  - "Kaufen" Button -> Redirect zum Payment-Provider Checkout
  - Erfolgs-/Fehlerseite nach Checkout-Ruckkehr
- [ ] **Transaktionshistorie:**
  - Tabellarische Auflistung aller Transaktionen
  - Spalten: Datum, Typ, Betrag (+/-), Beschreibung
  - Filter: Typ (Topup, Unlock, Tip, etc.)
  - Paginierung
- [ ] **Coin-Hinweis:**
  - Bei unzureichendem Guthaben: Inline-Hinweis + Link zum Wallet

## Akzeptanzkriterien

- Balance wird korrekt angezeigt (Header + Wallet-Seite)
- Coin-Pack-Kauf navigiert zum Checkout und zuruck
- Transaktionshistorie zeigt alle Bewegungen
- Responsive Layout

## Abhangigkeiten

- FEXORA-035 (Wallet API)
- FEXORA-036 (Payment Integration)
