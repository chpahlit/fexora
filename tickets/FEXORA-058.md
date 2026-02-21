# FEXORA-058: Creator-Impersonation

**Phase:** 2 — Sprint 3
**Prioritat:** Kritisch
**App:** API + Moderator
**Aufwand:** 16-22h
**Status:** Open

---

## Beschreibung

Moderatoren chatten und posten im Namen zugewiesener Creator. User sehen nur Creator-Identitat. Vollstandige Sicherheitsabsicherung.

## Aufgaben

- [ ] **API — Impersonation-Logik:**
  - Moderator sendet Message mit `acting_as_creator_id` Header
  - API setzt `sent_by_moderator_id` in Message-Tabelle
  - API-Response an User: NUR Creator-Daten, NICHT Moderator-ID
  - Berechtigungsprufung: `moderator_creator_assignments.is_active` — Echtzeit, kein Cache
  - Session-Isolation: Nur ein Creator gleichzeitig, expliziter Wechsel
- [ ] **Impersonation-Sicherheit:**
  - `sent_by_moderator_id` NIEMALS in User/Creator API-Responses
  - Nur in Admin/Agency-Endpoints sichtbar
  - Audit-Trail: Alle Impersonation-Aktionen in `audit_logs`
  - Anomalie-Erkennung: Alert bei >10x Baseline-Nachrichten/h
  - Revoke wirkt sofort (Echtzeit-Berechtigungsprufung)
- [ ] **Content-Upload durch Moderator:**
  - Nur wenn Agency dies explizit erlaubt hat
  - Content durchlauft normale Review-Queue
  - `uploaded_by_moderator_id` Tracking
- [ ] **Moderator-App UI:**
  - Creator-Auswahl Dropdown (nur zugewiesene Creator)
  - Visueller Indikator: "Du chattest als [Creator Name]"
  - Wechsel erfordert explizite Aktion (kein versehentlicher Wechsel)

## Akzeptanzkriterien

- Moderator kann im Namen des Creators chatten
- User sieht NUR Creator-Avatar und -Name
- `sent_by_moderator_id` nur intern sichtbar
- Nicht-zugewiesene Creator sind nicht wahlbar
- Revoke einer Zuweisung wirkt sofort
- Audit-Trail vollstandig

## Abhangigkeiten

- FEXORA-038 (Chat API)
- FEXORA-061 (Agency-System — Zuweisungen)
