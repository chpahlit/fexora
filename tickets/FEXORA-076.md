# FEXORA-076: Template-System (Handlebars)

**Phase:** 3 — Sprint 5
**Prioritat:** Hoch
**App:** API
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

Handlebars-basiertes Template-System fur Orchestrator-Nachrichten: Variablenersetzung fur personalisierte Nachrichten.

## Aufgaben

- [x] **Template-Management:**
  - `message_templates` Tabelle: id, name, body_text, variables[], ab_group
  - CRUD-Endpoints fur Templates
  - Template-Validierung (alle Variablen mussen auflosbar sein)
- [x] **Variablenersetzung:**
  - `{{username}}` — Username des Empfangers
  - `{{creator_name}}` — Name des Sender-Profils
  - `{{first_name}}` — Vorname (falls verfugbar)
  - `{{last_purchase_date}}` — Datum des letzten Kaufs
  - `{{days_since_last_visit}}` — Tage seit letztem Besuch
  - Keine Template-Logik (kein if/for), nur Platzhalter
- [x] **Handlebars-Integration:**
  - Handlebars.Net NuGet Package
  - Template-Compilation mit Caching
  - Fallback-Werte fur fehlende Variablen
- [x] **A/B-Testing Vorbereitung:**
  - `ab_group` Feld fur Template-Varianten
  - Template-Auswahl basierend auf A/B-Gruppe

## Akzeptanzkriterien

- Templates konnen erstellt und bearbeitet werden
- Variablen werden korrekt ersetzt
- Fehlende Variablen verwenden Fallback-Werte
- Template-Rendering < 5ms

## Abhangigkeiten

- FEXORA-073 (Szenario-Engine — nutzt Templates)
