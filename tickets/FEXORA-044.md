# FEXORA-044: Custom Requests + Escrow

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 16-22h
**Status:** Open

---

## Beschreibung

Personalisierte Content-Anfragen mit Escrow-System. User stellt Anfrage mit Budget, Creator liefert, Coins werden nach Bestatigung freigegeben.

## Aufgaben

- [ ] **API-Endpoints:**
  - `POST /requests` — Request erstellen (Beschreibung + Budget)
  - `POST /requests/:id/accept` — Creator akzeptiert
  - `POST /requests/:id/deliver` — Creator liefert (Datei-Upload)
  - `POST /requests/:id/confirm` — User bestatigt Delivery
  - `POST /requests/:id/dispute` — User disputet
  - `GET /requests/my` — Eigene Requests (Requester + Creator)
- [ ] **Escrow-Lifecycle:**
  1. User erstellt Request (Beschreibung + Budget in Coins)
  2. Creator Accept -> Coins vom User-Wallet in Escrow (coin_tx: escrow_hold)
  3. Creator liefert (Datei-Upload erforderlich, MIME/Magic-Byte-Check)
  4. User bestatigt -> Escrow an Creator (coin_tx: escrow_release)
  5. ODER: User disputet -> Admin entscheidet
  6. Auto-Confirm: 7 Tage nach User-Offnung (read_at) ohne Aktion
- [ ] **Edge Cases:**
  - Creator gebannt -> Escrow automatisch zuruck an User
  - User loscht Account -> Escrow an Creator
  - Creator loscht Account -> Escrow zuruck an User
  - DMCA-Takedown auf Delivery -> Admin entscheidet
- [ ] **Delivery-Validierung:**
  - Mindestens ein Datei-Upload erforderlich
  - MIME-Type + Magic-Byte-Check
  - Kein leerer Text als Delivery
- [ ] **Web UI:**
  - Request-Formular: Beschreibung, gewunschter Typ, Budget
  - Request-Status-Tracking (Timeline)
  - Creator: Accept/Reject, Delivery-Upload
  - User: Confirm/Dispute Buttons
  - Escrow-Info Anzeige

## Akzeptanzkriterien

- Vollstandiger Request-Lifecycle funktioniert
- Escrow: Coins korrekt gehalten und freigegeben
- Auto-Confirm nach 7 Tagen
- Delivery-Validierung (kein leerer Upload)
- Dispute -> Admin-Queue
- Edge Cases korrekt behandelt

## Abhangigkeiten

- FEXORA-035 (Wallet), FEXORA-020 (Admin fur Disputes)
