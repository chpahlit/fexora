# FEXORA-018: Likes & Kommentare

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** API
**Aufwand:** 12-16h
**Status:** Done

---

## Beschreibung

Like/Unlike auf Content und Kommentare. Verschachtelte Kommentare mit Creator-Moderation und automatischem Wortfilter.

## Aufgaben

- [ ] **Likes:**
  - `POST /content/:id/like` — Content liken
  - `DELETE /content/:id/like` — Like entfernen
  - Like-Count pro Content (Redis Cache)
  - Likes auf Kommentare (polymorphe `likes` Tabelle: likeable_type + likeable_id)
  - Notification an Content-Owner bei Like
- [ ] **Kommentare:**
  - `POST /content/:id/comments` — Kommentar erstellen
  - `GET /content/:id/comments` — Kommentare laden (paginiert)
  - `DELETE /comments/:id` — Kommentar loschen (eigene oder Creator auf eigenem Content)
  - Verschachtelte Kommentare: max. 2 Ebenen (Kommentar + Antworten)
  - `parent_id` fur Antworten
- [ ] **Creator-Moderation:**
  - Comment-Mode Check: all / followers / disabled (aus Content-Settings)
  - Creator kann Kommentare unter eigenem Content loschen/ausblenden
  - Creator kann eigene Kommentare pinnen (`is_pinned`)
- [ ] **Wortfilter:**
  - Automatischer Wortfilter (Admin-konfigurierte Blacklist)
  - Kommentare mit gefilterten Wortern automatisch flaggen
- [ ] Rate Limiting: Likes 500/Tag, Comments 100/Tag

## Akzeptanzkriterien

- Like/Unlike mit korrektem Count
- Verschachtelte Kommentare (2 Ebenen)
- Comment-Mode wird pro Content respektiert
- Creator kann Kommentare moderieren
- Wortfilter funktioniert
- Notifications bei Like und Kommentar

## Abhangigkeiten

- FEXORA-016 (Content muss existieren)
- FEXORA-011 (Auth)
