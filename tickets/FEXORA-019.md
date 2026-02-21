# FEXORA-019: Likes & Kommentare UI

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** Web
**Aufwand:** 10-14h
**Status:** Done

---

## Beschreibung

Frontend fur Likes und verschachtelte Kommentare unter Content.

## Aufgaben

- [ ] **Like-Button:**
  - Toggle Like/Unlike mit Animation
  - Like-Count Anzeige
  - Optimistic UI Update
- [ ] **Kommentar-Sektion:**
  - Kommentar-Liste unter Content (paginiert, "Mehr laden")
  - Kommentar schreiben (Textfeld + Submit)
  - Antworten auf Kommentare (verschachtelt, max. 2 Ebenen)
  - Zeitstempel + Autor-Info
- [ ] **Kommentar-Interaktionen:**
  - Like auf Kommentar
  - Antworten-Button
  - Loschen (eigene Kommentare + Creator auf eigenem Content)
  - Melden-Button
- [ ] **Pinned Comments:**
  - Gepinnte Kommentare oben anzeigen
  - Pin/Unpin fur Creator (eigener Content)
- [ ] **Comment-Mode Anzeige:**
  - Wenn deaktiviert: "Kommentare sind deaktiviert"
  - Wenn nur Follower: Hinweis fur Nicht-Follower

## Akzeptanzkriterien

- Like mit sofortiger visueller Ruckmeldung
- Kommentare laden paginiert
- Verschachtelte Antworten sichtbar
- Pinned Comments oben
- Comment-Mode korrekt dargestellt

## Abhangigkeiten

- FEXORA-018 (Likes & Kommentare API)
- FEXORA-003 (Web App)
