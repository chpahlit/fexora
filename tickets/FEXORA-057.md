# FEXORA-057: Moderator 3-Spalten-Board

**Phase:** 2 — Sprint 3
**Prioritat:** Kritisch
**App:** Moderator
**Aufwand:** 24-32h
**Status:** Open

---

## Beschreibung

High-Throughput Chat-Management-Tool fur Moderatoren: 3-Spalten-Layout mit Queue, aktivem Chat und Profil-Sidebar.

## Aufgaben

- [ ] **Linke Spalte — Queue:**
  - Dialog-Queue sortiert nach Prioritat
  - Prioritat: Unbeantwortete > Neueste > Alteste
  - Unread-Badge pro Thread
  - Quick-Filter: Alle, Unbeantwortete, VIP
  - "Nachster Dialog" Button (oder Hotkey)
- [ ] **Mittlere Spalte — Aktiver Chat:**
  - SignalR-basierter Chat (wie User-Chat)
  - Nachrichten im Namen des Creators senden (Impersonation)
  - Text + Medien + PPV-Messages senden
  - Typing Indicator, Read Receipts
  - Preis-Buttons (Upsell: Content empfehlen)
- [ ] **Rechte Spalte — Profil/Historie:**
  - User-Profil des Chat-Partners
  - Kaufhistorie (was hat User schon gekauft)
  - Abo-Status
  - Vorherige Chat-Interaktionen
  - Notizen (intern)
- [ ] **Creator-Wechsel:**
  - Dropdown/Tabs: Zugewiesene Creator auswahlen
  - Wechsel zwischen Creator-Profilen
  - Chat-Queue filtert sich nach ausgewahltem Creator

## Akzeptanzkriterien

- 3-Spalten-Layout funktional und responsive
- Queue zeigt priorisierte Dialoge
- Chat im Namen des Creators funktioniert
- Profil-Sidebar zeigt relevante User-Infos
- Creator-Wechsel ist schnell und flussig

## Abhangigkeiten

- FEXORA-038 (Chat API), FEXORA-058 (Impersonation)
- FEXORA-003 (Moderator-App)
