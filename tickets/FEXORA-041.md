# FEXORA-041: Creator-Dashboard (Basis)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** Web
**Aufwand:** 20-28h
**Status:** Open

---

## Beschreibung

Basis Creator-Dashboard unter `/creator/*`: Einnahmen-Ubersicht, Content-Manager, Chat-Einstellungen, Fan-Ubersicht.

## Aufgaben

- [ ] **Dashboard-Ubersicht (`/creator`):**
  - Einnahmen heute / Woche / Monat (Coins + EUR)
  - Unlock-Statistiken (Anzahl, Top-Content)
  - Follower-Wachstum (Graph)
  - Neue Subscriber
- [ ] **Content-Manager (`/creator/content`):**
  - Eigene Inhalte verwalten (Tabelle/Grid)
  - Status-Filter: Draft / Pending / Approved / Rejected
  - Aktionen: Bearbeiten, Loschen, Preis andern
  - Pinned Posts verwalten (max. 3)
  - Quick-Actions: Submit Draft, View Stats
- [ ] **Chat-Einstellungen (`/creator/chat-settings`):**
  - Pricing-Modell wahlen (Free / Unlock / Pro-Nachricht)
  - Preis in Coins setzen
  - `first_message_free` Toggle
  - Auto-Begruessung Text
- [ ] **Fan-Management (`/creator/fans`):**
  - Kaufer-Ubersicht
  - Top-Fans (nach Ausgaben)
  - Aktivste Chatter
  - Subscriber-Liste
- [ ] **Earnings (`/creator/earnings`):**
  - Einnahmen-Details: Unlocks, Abos, Chat, Tips, PPV, Custom Requests
  - Auszahlungs-Requests (ab 50 EUR)
  - Transaktionshistorie

## Akzeptanzkriterien

- Dashboard zeigt korrekte Einnahmen und Stats
- Content-Manager erlaubt Verwaltung aller eigenen Inhalte
- Chat-Pricing konfigurierbar
- Fan-Ubersicht mit Ranking
- Earnings mit Auszahlungsfunktion
- Nur fur Creator-Rolle zuganglich

## Abhangigkeiten

- FEXORA-016 (Content), FEXORA-038 (Chat), FEXORA-035 (Wallet)
- FEXORA-011 (Auth — Creator-Rolle)
