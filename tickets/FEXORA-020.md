# FEXORA-020: Admin Review-Queue (Basis)

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 10-14h
**Status:** Done

---

## Beschreibung

Basis Admin Control Panel mit Content-Review-Queue. Admins prufen "pending" Content und geben frei oder lehnen ab.

## Aufgaben

- [ ] **Review-Queue Seite (ACP):**
  - Liste aller Content mit Status "pending" (paginiert)
  - Filter: Content-Typ, Creator, Datum
  - Sortierung: Alteste zuerst (FIFO)
  - Content-Vorschau (Bild/Video/Audio/Text)
- [ ] **Review-Aktionen:**
  - Approve — Content wird veroffentlicht
  - Reject — mit Begrundung (Freitext)
  - Massenaktionen: Mehrere Content gleichzeitig approve/reject
- [ ] **API-Endpoints:**
  - `GET /admin/review` — Review-Queue laden
  - `POST /admin/content/:id/approve` — Content freigeben
  - `POST /admin/content/:id/reject` — Content ablehnen
- [ ] **Notification:**
  - Creator erhalt Benachrichtigung bei Approval/Rejection
  - Rejection enthalt Begrundung
- [ ] **Identity-Verification Queue:**
  - Ausweis-Uploads prufen
  - Approve/Reject mit Begrundung
  - Rolle-Upgrade bei Approval (User -> Creator/Moderator)

## Akzeptanzkriterien

- Admins sehen alle pending Content
- Approve/Reject funktioniert mit Status-Update
- Massenaktionen moglich
- Creator werden benachrichtigt
- Identity-Verifications prufbar

## Abhangigkeiten

- FEXORA-016 (Content muss existieren)
- FEXORA-011 (Auth mit Admin-Rolle)
- FEXORA-003 (ACP App)
