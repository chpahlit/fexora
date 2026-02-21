# FEXORA-028: Explore / Discover

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 16-22h
**Status:** Open

---

## Beschreibung

Explore-Seite mit Trending Content, Kategorien-Browsing, Tag-basierter Navigation und Creator-Empfehlungen.

## Aufgaben

- [ ] **API:**
  - `GET /explore` — Kuratierte Explore-Daten (Trending + Kategorien + Empfehlungen)
  - `GET /trending` — Trending Content (Daily/Weekly)
  - `GET /tags/:slug` — Content pro Tag (paginiert)
  - Explore-Daten: HybridCache mit stundenweise Refresh
- [ ] **Web:**
  - **Trending-Sektion:** Top Content (Bild-Grid oder Karussell)
  - **Kategorien:** Filter-Tabs (Bilder, Clips, Stories, Horspiele)
  - **Tag-Navigation:** Populare Tags als Chips, klickbar -> Tag-Detail-Seite
  - **Creator-Empfehlungen:** Empfohlene Creator-Karten (Avatar, Name, Follower, Preview)
  - **Tag-Detail-Seite:** `/tags/:slug` mit paginiertem Content-Grid
- [ ] Trending-Daten aus `trending_snapshots` Tabelle (siehe FEXORA-030)
- [ ] Blocking-Filter anwenden

## Akzeptanzkriterien

- Explore-Seite zeigt relevanten Content
- Kategorien-Filter funktioniert
- Tags klickbar mit Detail-Seite
- Creator-Empfehlungen werden angezeigt
- Performance: < 500ms Ladezeit

## Abhangigkeiten

- FEXORA-030 (Trending-Engine liefert Daten)
- FEXORA-016 (Content)
