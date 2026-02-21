# FEXORA-033: Favoriten & Kaufhistorie

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 6-8h
**Status:** Open

---

## Beschreibung

Merkliste (Favoriten/Wishlist) und "Meine Unlocks" Kaufhistorie fur User.

## Aufgaben

- [ ] **API:**
  - `POST /favorites/:contentId` — Zu Favoriten hinzufugen
  - `DELETE /favorites/:contentId` — Aus Favoriten entfernen
  - `GET /favorites` — Eigene Favoriten-Liste (paginiert)
  - `GET /me/purchases` — Kaufhistorie (alle Unlocks, paginiert)
- [ ] **Web:**
  - Herz/Bookmark-Button auf Content-Cards und Detail-Seite
  - Favoriten-Seite (`/favorites`): Grid mit gemerktem Content
  - Kaufhistorie-Seite (`/purchases`): Liste mit Datum, Content, Preis
  - Leere Zustande: "Noch keine Favoriten" / "Noch keine Kaufe"

## Akzeptanzkriterien

- Favoriten hinzufugen/entfernen funktioniert
- Favoriten-Ubersicht zeigt alle gemerkten Inhalte
- Kaufhistorie zeigt alle Unlocks mit Details
- Toggle-State korrekt auf Content-Cards

## Abhangigkeiten

- FEXORA-032 (Unlock-Flow)
- FEXORA-016 (Content)
