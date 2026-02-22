# FEXORA-024: DMCA-System (Basis)

**Phase:** 1 — Sprint 1
**Prioritat:** Mittel
**App:** API + ACP
**Aufwand:** 10-14h
**Status:** Done

---

## Beschreibung

DMCA Takedown-System: Creator melden gestohlenen Content, Admin reviewed und entscheidet uber Takedown.

## Aufgaben

- [x] **API-Endpoints:**
  - `POST /dmca/report` — DMCA-Report erstellen (mit Evidence-Upload)
  - `GET /dmca/:id` — Report-Details
  - `POST /dmca/:id/review` — Admin-Review (Approve Takedown / Reject)
  - `POST /dmca/:id/counter-notice` — Counter-Notice (Phase 2+, Struktur vorbereiten)
- [x] **DMCA-Report Felder:**
  - reporter_id, content_id
  - original_url (Nachweis der Urheberschaft)
  - description (Freitext)
  - evidence_urls[] (Beweis-Uploads)
  - status: pending -> reviewing -> taken_down / rejected
- [x] **Takedown-Prozess:**
  - Bei Takedown: Content Status -> taken_down
  - CDN-Cache-Invalidierung (BunnyCDN Purge API vorbereiten)
  - R2-Objekt Soft-Delete
  - Benachrichtigung an Content-Uploader
- [x] **ACP: DMCA Review Queue:**
  - Liste aller pending DMCA-Reports
  - Report-Detail mit Evidence
  - Approve Takedown / Reject mit Begrundung

## Implementierte Dateien

- `Fexora.Core/Entities/DmcaReport.cs` — Entity
- `Fexora.Core/Enums/DmcaStatus.cs` — Pending, Reviewing, TakenDown, Rejected
- `Fexora.Core/Interfaces/IDmcaService.cs` — Service-Interface
- `Fexora.Infrastructure/Services/DmcaService.cs` — Implementierung mit Takedown-Logik
- `Fexora.Api/Controllers/DmcaController.cs` — 4 Endpoints (report, get, list, review)
- `apps/acp/src/app/[locale]/dmca/page.tsx` — DMCA Reports Liste mit Tab-Filter
- `apps/acp/src/app/[locale]/dmca/[id]/page.tsx` — Report-Detail + Review-Aktionen

## Akzeptanzkriterien

- DMCA-Report kann erstellt werden (mit Evidence)
- Admin kann Reports in Queue sehen und entscheiden
- Takedown entfernt Content korrekt
- Betroffener Creator wird benachrichtigt
- Status-Tracking vollstandig

## Abhangigkeiten

- FEXORA-016 (Content)
- FEXORA-020 (ACP Basis)
