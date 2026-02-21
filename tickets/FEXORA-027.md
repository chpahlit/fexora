# FEXORA-027: Home Feed (Algorithmic)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API + Web
**Aufwand:** 20-28h
**Status:** Open

---

## Beschreibung

Gemischter Home Feed mit Content von gefolgten Creatorn, Online-Usern, Profilbesuchern und algorithmischen Empfehlungen. Like/Kommentar/Share direkt inline.

## Aufgaben

- [ ] **API:**
  - `GET /feed` — Paginierter Feed (Cursor-basiert)
  - Feed-Quellen mischen:
    - Content von gefolgten Creatorn (priorisiert)
    - Trending Content (Empfehlungen)
    - Online-Creator (aktuell aktiv)
    - Profilbesucher (wer hat mein Profil besucht)
  - Blocking-Filter anwenden (keine Content von blockierten Usern)
  - Nur `approved` Content anzeigen
  - Visibility-Check: public fur alle, followers_only nur fur Follower
- [ ] **Feed-Algorithmus:**
  - Gewichtung: Recency + Engagement + Follow-Beziehung
  - HybridCache fur Feed-Daten (L1 Memory + L2 Redis)
  - Feed-Event-Tracking (`feed_events` Tabelle)
- [ ] **Web:**
  - Content-Card Komponente:
    - Creator Avatar + Name + Follow-Button
    - Media-Anzeige (Bild/Video/Audio/Text)
    - Blur/Lock-Indikator fur Paid Content + Preis
    - Like-Button + Count
    - Kommentar-Button (expandierbar)
    - Share-Button
    - Tags
  - Infinite Scroll (Cursor-basierte Paginierung)
  - Pull-to-Refresh (Mobile)
  - Skeleton Loading

## Akzeptanzkriterien

- Feed ladt mit gemischtem Content
- Infinite Scroll funktioniert performant
- Blocking-Filter aktiv
- Visibility korrekt (followers_only nur fur Follower)
- Like/Kommentar/Share inline im Feed
- Feed ladt in < 500ms (mit Cache)

## Abhangigkeiten

- FEXORA-016 (Content), FEXORA-015 (Follow), FEXORA-018 (Likes/Kommentare)
