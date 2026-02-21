# FEXORA-040: Chat-SDK Package (SignalR Client)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** Packages
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Wiederverwendbares Chat-SDK Package: SignalR Client Wrapper, React Hooks, Chat-Pricing-Logik. Wird in Web und Moderator-App verwendet.

## Aufgaben

- [ ] **SignalR Client Wrapper:**
  - `packages/chat-sdk/src/signalr-client.ts`
  - Connection Management (connect, disconnect, reconnect)
  - Auto-Reconnect mit Exponential Backoff
  - Event-Handler Registration
- [ ] **Chat Types:**
  - `packages/chat-sdk/src/types.ts`
  - Message, Thread, ChatSettings, PPVMessage, Tip, GiftItem
  - Online-Status, Typing-Event, ReadReceipt
- [ ] **React Hooks:**
  - `useChat(threadId)` — Messages, sendMessage, loadMore
  - `useOnlineStatus(userId)` — Online/Offline Status
  - `useTypingIndicator(threadId)` — Typing Events
  - `useChatThreads()` — Thread-Liste mit Unread Counts
  - `useChatPricing(creatorId)` — Pricing-Info + Check
- [ ] **Chat-Pricing-Logik:**
  - Check ob User chatten darf (basierend auf Pricing-Modell)
  - Coin-Check vor Message-Send
  - Abo-Perk-Check (kostenloser Chat durch Abo)

## Akzeptanzkriterien

- SDK funktioniert in Web-App und Moderator-App
- Auto-Reconnect bei Verbindungsverlust
- Hooks liefern reaktive Daten (Messages, Status)
- Pricing-Check verhindert unbezahlte Nachrichten client-seitig
- TypeScript: Vollstandig typisiert, kein `any`

## Abhangigkeiten

- FEXORA-038 (Chat API — SignalR Hub muss existieren)
- FEXORA-004 (Package-Struktur)
