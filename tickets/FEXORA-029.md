# FEXORA-029: Suche & Tags (Volltextsuche)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 12-16h
**Status:** Open

---

## Beschreibung

Volltextsuche uber Profile, Content und Tags. PostgreSQL Full-Text Search fur MVP, spater optional Meilisearch.

## Aufgaben

- [ ] **API:**
  - `GET /search?q=...&type=...&sort=...` — Universelle Suche
  - Suchbare Entitaten:
    - Profile (Username, Bio, Land)
    - Content (Titel, Tags)
    - Tags (Name)
  - Filter: Typ (profile/content/tag), Preis-Range, Creator, Beliebtheit
  - Sortierung: Relevanz, Neueste, Beliebteste
  - PostgreSQL `tsvector` + GIN Index (DE + EN Konfiguration)
- [ ] **Web:**
  - Such-Input in Navigation (immer sichtbar)
  - Suchergebnis-Seite mit Tabs: Alle / Profile / Content / Tags
  - Autocomplete/Suggestions beim Tippen
  - Filter-Sidebar (Typ, Preis, Sortierung)
  - Keine Ergebnisse: Empfehlungen anzeigen
- [ ] Blocking-Filter: Keine Ergebnisse von blockierten Usern
- [ ] Rate Limiting auf Search-Endpoint

## Akzeptanzkriterien

- Suche liefert relevante Ergebnisse fur Profile, Content, Tags
- Filter und Sortierung funktionieren
- Suche ist performant (< 200ms)
- Autocomplete funktioniert
- Blockierte User/Content gefiltert

## Abhangigkeiten

- FEXORA-010 (FTS-Indizes)
- FEXORA-016 (Content), FEXORA-013 (Profile)
