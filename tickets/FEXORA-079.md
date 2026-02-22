# FEXORA-079: Broadcast-System

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** API
**Aufwand:** 14-18h
**Status:** ✅ Done

---

## Beschreibung

Broadcast-System: Zielgruppen-basierter Massen-Versand mit Batch-Processing und Throttling.

## Aufgaben

- [ ] **Broadcast-Modell:**
  - `broadcasts` Tabelle: name, sender_profile_id, targeting_query_json, schedule_at, status
  - `broadcast_executions` Tabelle: user_id, executed_at, result, variant
- [ ] **Versand-Flow:**
  1. Admin erstellt Broadcast (Nachricht + Segment + Zeitplan)
  2. Zum geplanten Zeitpunkt: Segment berechnen
  3. Batch-Versand: 1.000 User pro Batch
  4. Throttling zwischen Batches (konfigurierbar)
  5. Execution-Logging pro User
- [ ] **Features:**
  - Sofort-Versand oder geplant (schedule_at)
  - Template-basierte Nachrichten (Handlebars)
  - Sender-Profil wahlbar
  - Dry-Run: Vorschau ohne Versand
  - Abbruch-Option (laufende Broadcasts stoppen)
- [ ] **A/B-Varianten:**
  - Bis zu 3 Varianten pro Broadcast
  - Zufallsverteilung der User auf Varianten
  - Tracking pro Variante
- [ ] **Rate-Limits:**
  - Quiet Hours respektieren (23-8 CET)
  - Globaler Durchsatz-Limiter

## Akzeptanzkriterien

- Broadcasts werden zum geplanten Zeitpunkt versendet
- Batch-Versand ohne Server-Uberlastung
- Dry-Run zeigt Empfanger-Vorschau
- Abbruch funktioniert
- Execution-Log vollstandig

## Abhangigkeiten

- FEXORA-077 (Targeting), FEXORA-076 (Templates)
- FEXORA-075 (Rate Limits)
