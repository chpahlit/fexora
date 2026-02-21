# FEXORA-038: Chat (SignalR) + Chat-Pricing + PPV

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 30-40h
**Status:** Open

---

## Beschreibung

1:1 Chat-System mit SignalR, drei Chat-Pricing-Modelle (Free/Unlock/Pro-Nachricht), Online-Status, Read Receipts und PPV-Messages.

## Aufgaben

- [ ] **SignalR Chat Hub (`/hubs/chat`):**
  - 1:1 Messaging (Text + Emojis)
  - Dateianhange (Bilder/Videos uber S3)
  - Online-Status Tracking (Redis Sets: `SADD online:{userId}`)
  - Read Receipts (Lesebestatigung pro Nachricht)
  - Typing Indicator
- [ ] **Chat-Pricing (3 Modelle):**
  - `creator_chat_settings` Tabelle pro Creator
  - **Free:** Kein Coin-Abzug
  - **Unlock:** Einmalige Coin-Zahlung vor erster Nachricht
  - **Pro-Nachricht:** Coin-Abzug bei jedem gesendeten Message
  - `first_message_free` Option
  - Auto-Begruessung: Optionale automatische Willkommensnachricht
  - Chat-Pricing Check vor jedem Message-Send
- [ ] **PPV-Messages:**
  - Creator setzt Preis pro PPV-Nachricht
  - User sieht Preview-Text + Preis
  - `POST /ppv/:id/unlock` — PPV-Message freischalten
  - `ppv_messages` + `ppv_unlocks` Tabellen
  - Min/Max Preis Admin-konfigurierbar
- [ ] **API-Endpoints:**
  - Creator Chat-Settings CRUD (`/creator/chat-settings`)
  - Thread-Liste (`GET /chat/threads`)
  - Thread-Messages (`GET /chat/threads/:id/messages`)
- [ ] **Business Rules:**
  - Creator-zu-Creator Chat: immer kostenlos
  - Admin/Moderator Chat: immer kostenlos
  - Abo-Perk: Kostenlosen Chat als Perk (uberschreibt Pricing)
  - Blocking: Chat verweigern bei blockierten Usern
  - `sent_by_moderator_id` Tracking (fur spatere Impersonation)
- [ ] **Technisch:**
  - Redis Backplane fur SignalR (Multi-Instance)
  - Message-Persistenz in PostgreSQL
  - TTL-basiertes Presence Tracking

## Akzeptanzkriterien

- 1:1 Chat funktioniert in Echtzeit (SignalR)
- Alle 3 Chat-Pricing-Modelle korrekt implementiert
- Online-Status und Read Receipts funktionieren
- PPV-Messages: Creator kann Preis setzen, User kann unlocken
- Abo-basierter kostenloser Chat funktioniert
- Blocking wird enforced

## Abhangigkeiten

- FEXORA-035 (Wallet — fur Coin-Abzuge)
- FEXORA-015 (Blocking)
- FEXORA-050 (Abo-System — fur Abo-Perk-Check)
