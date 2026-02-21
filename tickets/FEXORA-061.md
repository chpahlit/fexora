# FEXORA-061: Agency-System (API)

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** API
**Aufwand:** 20-28h
**Status:** Open

---

## Beschreibung

Agency-System API: Agencies erstellen, Creator-Profile verwalten, Moderatoren managen, Zuweisungen, Admin-Zuweisungen externer Creator.

## Aufgaben

- [ ] **Agency CRUD:**
  - `POST /agency` — Agency erstellen (Admin)
  - `PATCH /agency/:id` — Agency bearbeiten
  - `agencies` Tabelle: id, name, owner_user_id, status (active/suspended)
- [ ] **Creator-Management (Agency):**
  - `POST /agency/creators` — Creator-Profil erstellen (Agency erstellt eigene Creator)
  - `GET /agency/creators` — Eigene Creator auflisten
  - `PATCH /agency/creators/:id` — Creator bearbeiten
  - `agency_creators` Tabelle: is_agency_created (true/false), assigned_by (agency/admin)
- [ ] **Moderator-Management:**
  - `POST /agency/moderators/invite` — Moderator einladen
  - `PATCH /agency/moderators/:id` — Status andern (active/inactive)
  - `GET /agency/moderators` — Eigene Moderatoren auflisten
  - `agency_moderators` Tabelle: status, invited_at, joined_at
- [ ] **Zuweisungen:**
  - `POST /agency/assignments` — Moderator zu Creator zuweisen
  - `DELETE /agency/assignments/:id` — Zuweisung entfernen
  - `GET /agency/assignments` — Alle Zuweisungen
  - `moderator_creator_assignments` Tabelle: moderator_user_id, creator_user_id, agency_id, is_active
- [ ] **Admin-Zuweisungen:**
  - Admin kann externe Creator (nicht Agency-eigene) einer Agency zuweisen
  - Nur uber ACP-Endpoint
- [ ] **Business Rules:**
  - Agency hat volle Kontrolle uber selbst erstellte Creator
  - Kein Zugriff auf fremde Creator ohne Admin-Zuweisung
  - Zuweisung aufheben -> Impersonation sofort deaktiviert

## Akzeptanzkriterien

- Agency kann Creator erstellen und verwalten
- Moderator-Einladung und -Verwaltung funktioniert
- Zuweisungen Moderator <-> Creator funktionieren
- Admin kann externe Creator zuweisen
- Berechtigungen korrekt enforced

## Abhangigkeiten

- FEXORA-011 (Auth — Agency-Rolle), FEXORA-013 (Profile)
