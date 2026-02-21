# FEXORA-043: Content Scheduling

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Creator konnen Content fur zukunftige Veroffentlichung planen. Hangfire Job uberpruft minutlich auf fallige Veroffentlichungen.

## Aufgaben

- [ ] **API:**
  - `POST /content/:id/schedule` — Veroffentlichung planen (Datum + Uhrzeit)
  - `DELETE /content/:id/schedule` — Planung abbrechen
  - `GET /creator/scheduled` — Geplante Inhalte auflisten
  - `scheduled_content` Tabelle: content_id, scheduled_at, published_at, status
- [ ] **Hangfire Job:**
  - Minutlicher Check auf fallige Veroffentlichungen
  - Bei Falligkeit: Content-Status -> approved (wenn Review bestanden)
  - Notification: scheduled_content_published
- [ ] **Web (Creator-Dashboard):**
  - Kalender-Ansicht geplanter Inhalte
  - Scheduling beim Upload (Datum-Picker)
  - Geplante Inhalte bearbeiten/abbrechen
  - Status-Anzeige: Geplant / Veroffentlicht / Abgebrochen

## Akzeptanzkriterien

- Content kann fur Zukunft geplant werden
- Hangfire Job veroffentlicht punktlich
- Kalender-Ansicht im Dashboard
- Planung kann abgebrochen werden
- Notification bei Veroffentlichung

## Abhangigkeiten

- FEXORA-016 (Content)
- FEXORA-041 (Creator-Dashboard)
