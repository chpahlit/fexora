# FEXORA-081: Szenario-Builder UI

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 16-22h
**Status:** ✅ Done

---

## Beschreibung

Visueller Szenario-Builder im ACP: Timeline-Builder mit Step-Karten, Drag & Drop, Targeting pro Step.

## Aufgaben

- [ ] **Timeline-Builder:**
  - Visuelle Timeline: Tag 0, Tag 1, Tag 2, ...
  - Step-Karten pro Tag (Action + Template + Sender + Timing)
  - Drag & Drop fur Reihenfolge
  - Steps hinzufugen/entfernen/bearbeiten
- [ ] **Step-Konfiguration:**
  - Action-Type: Visit / Message / Follow / Like
  - Template auswahlen (aus Template-Bibliothek)
  - Sender-Profil auswahlen
  - Zeitversatz (Uhrzeit)
  - Targeting pro Step (optional)
  - Rate-Limit-Konfiguration
- [ ] **Szenario-Management:**
  - Szenario-Liste (Draft/Active/Paused/Archived)
  - Aktivieren/Pausieren/Archivieren
  - Enrollment-Ubersicht (wie viele User in Szenario)
  - Duplizieren (Clone)
- [ ] **Vorschau:**
  - Timeline-Vorschau: Was passiert wann?
  - Template-Vorschau mit Beispiel-Daten

## Akzeptanzkriterien

- Szenarien konnen visuell erstellt werden
- Drag & Drop fur Step-Reihenfolge
- Alle Step-Optionen konfigurierbar
- Aktivierung/Pausierung uber UI
- Vorschau zeigt erwarteten Ablauf

## Abhangigkeiten

- FEXORA-073 (Szenario-Engine API)
