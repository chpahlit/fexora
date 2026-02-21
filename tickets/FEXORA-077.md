# FEXORA-077: Targeting-Engine (Segment-Builder)

**Phase:** 3 — Sprint 5
**Prioritat:** Hoch
**App:** API
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

SQL-basierte Targeting-Engine: Segmente definieren, User-Gruppen fur Szenarien und Broadcasts zusammenstellen.

## Aufgaben

- [ ] **Segment-Definierung:**
  - JSON-basierte Query-DSL (targeting_query_json)
  - Filter-Kriterien:
    - Registrierungsdatum (vor/nach X Tagen)
    - Letzte Aktivitat (aktiv/inaktiv seit X Tagen)
    - Kaufhistorie (hat gekauft / nicht gekauft, min/max Betrag)
    - Abo-Status (hat Abo / kein Abo, bestimmter Creator)
    - Follower-Status (folgt Creator X / nicht)
    - Chat-Aktivitat (aktiv / inaktiv)
    - Coin-Balance (min/max)
- [ ] **Query-Builder:**
  - JSON-DSL -> SQL-Ubersetzung
  - Sichere Parametrisierung (kein SQL Injection)
  - Preview: Geschatzte Segment-Grosse
- [ ] **Segment-Caching:**
  - Berechnete Segmente in Redis cachen
  - TTL: 1 Stunde
  - Refresh bei Szenario-/Broadcast-Start
- [ ] **API-Endpoints:**
  - `POST /segments/preview` — Segment-Grosse abschatzen
  - `POST /segments/users` — User-IDs des Segments abrufen

## Akzeptanzkriterien

- Segmente konnen uber JSON-DSL definiert werden
- Alle Filter-Kriterien funktionieren
- Preview zeigt korrekte Segment-Grosse
- SQL Injection ist nicht moglich
- Segment-Berechnung < 5s fur 100k Users

## Abhangigkeiten

- FEXORA-073 (Szenario-Engine — nutzt Targeting)
