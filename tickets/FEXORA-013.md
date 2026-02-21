# FEXORA-013: Profil-CRUD

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 10-14h
**Status:** Done

---

## Beschreibung

Profil-Management API: Erstellen, Bearbeiten, Avatar-Upload, Badges.

## Aufgaben

- [ ] Endpoints:
  - `GET /profiles/:id` — Profil anzeigen (public)
  - `PATCH /profiles/:id` — Profil bearbeiten (eigenes Profil)
  - `GET /me/identity-verification/status` — Verifikationsstatus
  - `POST /me/identity-verification` — Ausweis-Upload / Re-Upload
- [ ] Profil-Felder: username, age, country, badges[], offers_custom, bio, avatar_url
- [ ] Avatar-Upload -> S3/R2 Storage (Resize: 200x200, 400x400)
- [ ] Username-Validierung (unique, Zeichenbeschankung, Profanity-Check)
- [ ] Badges-System (Array in DB, z.B. ["verified", "top_creator"])
- [ ] FluentValidation fur alle Profil-DTOs
- [ ] Profil-Response enthalt: Follower-Count, Following-Count, Content-Count

## Akzeptanzkriterien

- Profil erstellen und bearbeiten funktioniert
- Avatar-Upload mit automatischem Resize
- Username ist unique und validiert
- Fremde Profile nur lesbar, eigenes editierbar
- Follower/Following Counts korrekt

## Abhangigkeiten

- FEXORA-011 (Auth — User muss eingeloggt sein)
- FEXORA-016 (Content Upload — S3 Service wiederverwendbar)
