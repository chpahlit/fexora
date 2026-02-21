# FEXORA-031: Benachrichtigungen (In-App + SignalR Push)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Notification-System: In-App Benachrichtigungen mit SignalR Realtime-Push. Notifications fur Likes, Kommentare, Follows, Unlocks, neue Inhalte, Chat-Nachrichten, etc.

## Aufgaben

- [ ] **API:**
  - `GET /notifications` — Eigene Benachrichtigungen (paginiert)
  - `POST /notifications/read` — Als gelesen markieren (einzeln oder alle)
  - Unread-Count Endpoint
  - Notification-Typen:
    - like, comment, follow, unlock, message
    - content_approved, new_content, new_subscriber
    - subscription_renewed, subscription_cancelled, subscription_renewal_failed
    - subscription_expiring_soon, tip_received, gift_received
    - ppv_unlocked, custom_request_status_changed
    - referral_bonus_received, dmca_status_changed
    - scheduled_content_published
- [ ] **Notification-Pipeline:**
  - MediatR Event Handler fur jedes Event
  - DB Insert in `notifications` Tabelle
  - SignalR Push (wenn User online)
  - Zukunft: Web Push Queue (wenn User offline) — Struktur vorbereiten
- [ ] **Web:**
  - Notification-Bell in Navigation mit Unread-Badge
  - Notification-Center (Dropdown oder Seite)
  - Notification-Items mit Icon, Text, Zeitstempel
  - Klick auf Notification -> Navigation zum Ziel (Content, Profil, Chat)
  - "Alle gelesen" Button
  - SignalR-Listener fur Echtzeit-Updates

## Akzeptanzkriterien

- Benachrichtigungen fur alle definierten Events
- Echtzeit-Push via SignalR (Notification erscheint sofort)
- Unread-Badge korrekt
- Notification-Center funktional
- Als gelesen markieren funktioniert

## Abhangigkeiten

- FEXORA-011 (Auth), FEXORA-002 (API — SignalR Hub)
