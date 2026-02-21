# FEXORA-021: Content-Lebenszyklus (Status-Maschine)

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** API
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

Status-Maschine fur Content: draft -> pending -> approved/rejected. Klare Ubergange und Validierungen.

## Aufgaben

- [ ] **Status-Definitionen:**
  - `draft` — Entwurf, nur fur Creator sichtbar
  - `pending` — Eingereicht zur Admin-Review
  - `approved` — Freigegeben, offentlich sichtbar (je nach visibility)
  - `rejected` — Abgelehnt mit Begrundung
- [ ] **Erlaubte Ubergange:**
  - draft -> pending (Creator reicht ein)
  - pending -> approved (Admin gibt frei)
  - pending -> rejected (Admin lehnt ab)
  - rejected -> draft (Creator uberarbeitet)
  - approved -> pending (Re-Review bei Anderung)
- [ ] **Endpoint:**
  - `POST /content/:id/submit` — Draft zur Review einreichen
- [ ] **Validierung:**
  - Nur Ubergange gemaß State Machine erlaubt
  - Mindestens ein Medium muss vorhanden sein (kein leerer Submit)
  - Title ist Pflichtfeld
- [ ] **Events:**
  - Notification an Admin bei neuem pending Content
  - Notification an Creator bei Status-Anderung

## Akzeptanzkriterien

- Nur gultige Status-Ubergange moglich
- Ungultige Ubergange liefern 400 Bad Request
- Creator sieht aktuellen Status im Dashboard
- Admins werden uber neue Einreichungen informiert

## Abhangigkeiten

- FEXORA-016 (Content)
- FEXORA-020 (Review Queue)
