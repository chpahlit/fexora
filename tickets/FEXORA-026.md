# FEXORA-026: Story-Leiste

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** API + Web
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Horizontale Story-Leiste im Home Feed: Neue Inhalte aller gefolgten Creator, 24h im Feed sichtbar, danach permanent im Profil-Archiv.

## Aufgaben

- [ ] **API:**
  - `GET /stories` — Stories der gefolgten Creator (24h-Fenster)
  - Story = Content mit type "story" oder spezielles Feed-Event
  - Sortierung: Neueste zuerst, ungesehene priorisiert
  - Story-Status: aktiv (< 24h) / archiviert (> 24h, nur im Profil)
- [ ] **Web:**
  - Horizontale scrollbare Leiste oben im Feed
  - Runde Avatar-Thumbnails mit Farbring (ungesehen = farbig, gesehen = grau)
  - Story-Viewer: Fullscreen Overlay mit Media-Anzeige
  - Auto-Advance nach X Sekunden
  - Swipe/Klick fur nachste Story
- [ ] Viewed-Status tracken (user hat Story gesehen)

## Akzeptanzkriterien

- Story-Leiste zeigt Content der letzten 24h von gefolgten Creatorn
- Ungesehene Stories visuell hervorgehoben
- Story-Viewer funktioniert (Bild/Video/Text)
- Stories nach 24h im Profil-Archiv auffindbar

## Abhangigkeiten

- FEXORA-015 (Follow-System)
- FEXORA-016 (Content)
