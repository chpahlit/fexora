# FEXORA-095: Moderator-App Completion

**Phase:** 3a — Security & Hardening
**Prioritat:** Hoch
**App:** Moderator (mod.fexora.de)
**Aufwand:** 2-3h
**Status:** ✅ Done

---

## Beschreibung

Vervollstandigung der Moderator-App mit fehlenden Seiten: Audit Log und Analytics Dashboard.

## Umsetzung

- `apps/moderator/src/app/[locale]/audit/page.tsx` — Audit-Log Viewer
  - Filterung nach Aktionstyp (Impersonation, Nachricht, Content Review, etc.)
  - Suche nach Username/Entity ID
  - Pagination (30 Eintrage pro Seite)
  - Farbcodierte Action-Badges
  - Tabellen-Darstellung mit Zeitpunkt, Moderator, Aktion, Entity, Details, IP
- `apps/moderator/src/app/[locale]/analytics/page.tsx` — Analytics Dashboard
  - 6 KPI-Cards mit Trend-Indikatoren
  - SVG Mini-Charts fur Nachrichten/Umsatz/Antwortzeit-Trends
  - Tagliche Aufschlusselung als Tabelle
- Dashboard-Seite mit Navigation zu neuen Seiten aktualisiert

## Abhangigkeiten

- @tanstack/react-query (bereits installiert)
- API Audit/Analytics Endpoints
