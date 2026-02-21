# FEXORA-042: Tipping / Gifts (API)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Tipping-System: Freier Coin-Betrag senden + vordefinierte Gift-Items mit Animationen. Admin verwaltet Gift-Items im ACP.

## Aufgaben

- [ ] **API-Endpoints:**
  - `POST /tips/send` — Tip senden (freier Betrag oder Gift-Item)
  - `GET /gifts/list` — Offentliche Gift-Item-Liste (fur Chat-UI)
  - `GET /tips/received` — Erhaltene Tips (Creator-Dashboard)
  - `GET /tips/sent` — Gesendete Tips
- [ ] **Gift-Item-Management (Admin):**
  - `POST /admin/gifts` — Gift-Item erstellen
  - `PATCH /admin/gifts/:id` — Gift-Item bearbeiten
  - `DELETE /admin/gifts/:id` — Gift-Item deaktivieren
  - Gift-Item Felder: name, icon_url, animation_url, price_coins, is_active, sort_order
- [ ] **Tip-Logik:**
  - Coin-Abzug beim Sender (`coin_tx`, type=tip/gift)
  - Gutschrift beim Creator (abzuglich Plattform-Fee)
  - Min/Max-Limits (Admin-konfigurierbar via platform_settings)
  - Blocking-Check: Kein Tip an blockierte User
- [ ] **Notifications:**
  - SignalR-Event an Creator bei eingehendem Tip
  - Notification: tip_received / gift_received
- [ ] **Rate Limiting:**
  - Max Tips/Stunde pro User

## Akzeptanzkriterien

- Freier Coin-Betrag senden funktioniert
- Gift-Items mit korrektem Preis-Abzug
- Min/Max-Limits werden enforced
- Creator sieht Tips in Echtzeit (SignalR)
- Gift-Item CRUD fur Admins
- Plattform-Fee korrekt berechnet

## Abhangigkeiten

- FEXORA-035 (Wallet)
- FEXORA-038 (Chat — Tips im Chat-Kontext)
