# FEXORA-015: Follow-System + User-Blocking

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 12-16h
**Status:** Done

---

## Beschreibung

Follow/Unfollow-Logik und User-Blocking mit systemweiter Enforcement (Feed, Chat, Profil, Kommentare, Suche, etc.).

## Aufgaben

- [ ] **Follow-System:**
  - `POST /users/:id/follow` — Folgen
  - `DELETE /users/:id/follow` — Entfolgen
  - `GET /users/:id/followers` — Follower-Liste (paginiert)
  - `GET /users/:id/following` — Following-Liste (paginiert)
  - Follower-Count Cache (Redis)
  - Notification bei neuem Follower
- [ ] **User-Blocking:**
  - `POST /profiles/:id/block` — User blockieren
  - `DELETE /profiles/:id/block` — Block aufheben
  - `GET /me/blocked-users` — Eigene Blockliste (paginiert)
  - Bei Block: Follows in beide Richtungen automatisch entfernen
- [ ] **Blocking-Enforcement (systemweit):**
  - Feed: Content von blockierten Usern filtern
  - Profil: 403 bei Zugriff auf blockiertes Profil
  - Follow: Verweigern wenn geblockt
  - Chat: Nachricht verweigern, Thread unsichtbar
  - Kommentare: Verweigern auf Content des Blockers
  - Suche/Explore: Ergebnisse filtern
  - Tipping/Gifts: Verweigern
  - Custom Requests: Verweigern
- [ ] Redis-Cache der Blockliste pro User (`SET blocked:{userId}`, TTL 5 Min)
- [ ] Rate Limiting: Follows 100/Tag

## Akzeptanzkriterien

- Follow/Unfollow funktioniert mit korrekten Counts
- Blocking filtert in ALLEN relevanten Endpoints
- Bei Block werden bestehende Follows entfernt
- Blockliste per API abrufbar
- Redis-Cache wird korrekt invalidiert

## Technische Details

- `follows` Tabelle: follower_id, following_id, created_at
- `blocked_users` Tabelle: blocker_id, blocked_id, created_at (UNIQUE)
- Blocking-Check als wiederverwendbarer Service/Filter

## Abhangigkeiten

- FEXORA-011 (Auth)
- FEXORA-022 (Migrations)
