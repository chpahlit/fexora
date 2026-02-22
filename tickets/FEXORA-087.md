# FEXORA-087: Web Push Notifications

**Phase:** 2a — Erweiterungen
**Prioritat:** Hoch
**App:** Web + API
**Aufwand:** 14-18h
**Status:** ✅ Done

---

## Beschreibung

Browser-Push-Benachrichtigungen via Service Worker: Neue Nachrichten, Unlocks, Content-Approvals auch wenn der Tab geschlossen ist.

## Aufgaben

- [ ] **Service Worker:**
  - `sw.js` in Web-App registrieren
  - Push-Event Handler
  - Notification-Click Handler (Navigation zum Ziel)
  - Offline-Fallback (optional)
- [ ] **API — Web Push:**
  - Push-Subscription speichern (PushSubscription-Objekt pro User/Device)
  - `web-push` Library (Node.js) oder .NET Push-Library
  - VAPID Keys generieren
  - Push senden bei: Neue Nachricht, Unlock, Content Approved, Coin-Reminder
- [ ] **Notification-Pipeline erweitern:**
  - Bestehende Pipeline (FEXORA-031) erweitern
  - Wenn User offline: Push Notification Queue
  - Consent-Check: Nur wenn User Push erlaubt hat
- [ ] **Web UI:**
  - "Push aktivieren" Prompt (intelligent, nicht bei erstem Besuch)
  - Push-Einstellungen in Account-Settings (Kategorien an/aus)
  - Opt-Out jederzeit moglich
- [ ] **Push-Payload:**
  - Title, Body, Icon (Creator-Avatar), Action-URL
  - Badge-Count

## Akzeptanzkriterien

- Push-Benachrichtigungen funktionieren in Chrome, Firefox, Safari
- Push nur nach User-Consent
- Klick auf Push navigiert korrekt
- Push-Einstellungen granular anpassbar
- Keine Pushes wahrend Quiet Hours

## Abhangigkeiten

- FEXORA-031 (Notification-Pipeline)
