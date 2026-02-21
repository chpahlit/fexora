# FEXORA-055: Risk & Trust

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** ACP + API
**Aufwand:** 12-16h
**Status:** Open

---

## Beschreibung

Admin-Bereich fur Meldungen-Queue, IP/Device-Signale und Audit-Logs.

## Aufgaben

- [ ] **Meldungen-Queue:**
  - Alle User-Reports (Content, Kommentare, Chat, Profile)
  - Filter: Kategorie, Status (open/reviewed/dismissed), Datum
  - Report-Detail: Gemeldeter Inhalt + Grund + Reporter
  - Aktionen: Content entfernen, User warnen/sperren, Report dismissed
- [ ] **Audit-Logs:**
  - Durchsuchbare Log-Tabelle
  - Filter: Actor, Action, Entity-Type, Datum
  - Detail-Ansicht mit meta_json
  - Export-Funktion
- [ ] **IP/Device-Signale:**
  - IP-Adressen pro User (Login-History)
  - Mehrfach-Accounts erkennen (gleiche IP)
  - Verdachtige Muster flaggen
- [ ] **API-Endpoints:**
  - `GET /admin/reports` — Meldungen-Queue
  - `POST /admin/reports/:id/resolve` — Report bearbeiten
  - `GET /admin/audit-logs` — Audit-Logs
  - `GET /admin/risk/signals` — Risk-Signale

## Akzeptanzkriterien

- Meldungen-Queue mit allen Reports
- Audit-Logs durchsuchbar und exportierbar
- IP-Signale helfen bei Mehrfach-Account-Erkennung
- Aktionen auf Reports wirken sofort

## Abhangigkeiten

- FEXORA-020 (ACP Basis)
