# FEXORA-030: Trending-Engine

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Stundliche Berechnung von Trending-Scores fur Content, Tags und Creator. Materialized Views fur Daily/Weekly Rankings.

## Aufgaben

- [ ] **Score-Berechnung:**
  - Formel: (Likes x 1) + (Kommentare x 2) + (Shares x 3) + (Unlocks x 5)
  - Zeitfaktor: Exponential Decay
    - Daily: Halbwertszeit 24h
    - Weekly: Halbwertszeit 7 Tage
- [ ] **Hangfire Job:**
  - Stundliche Score-Berechnung
  - Ergebnisse in `trending_snapshots` speichern
  - Entity-Typen: content, tag, creator
  - Perioden: daily, weekly
- [ ] **Materialized Views:**
  - `trending_content_daily` / `trending_content_weekly`
  - `trending_tags_daily` / `trending_tags_weekly`
  - `trending_creators_daily` / `trending_creators_weekly`
  - Views regelmassig refreshen (nach Hangfire Job)
- [ ] **API-Endpoints:**
  - `GET /trending?type=content&period=daily` — Trending Content
  - `GET /trending?type=tag&period=weekly` — Trending Tags
  - `GET /trending?type=creator&period=daily` — Trending Creator
- [ ] Rankings pro Kategorie (optional: pro Tag)

## Akzeptanzkriterien

- Stundliche Berechnung lauft zuverlassig (Hangfire)
- Scores spiegeln Engagement korrekt wider (Unlocks am starksten gewichtet)
- Rankings fur Daily und Weekly verfugbar
- API liefert sortierte Trending-Daten
- Performance: Trending-Query < 50ms (Materialized Views)

## Abhangigkeiten

- FEXORA-018 (Likes/Kommentare)
- FEXORA-022 (Migrations — trending_snapshots Tabelle)
