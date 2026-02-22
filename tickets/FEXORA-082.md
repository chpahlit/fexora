# FEXORA-082: Segment-Builder UI

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 10-14h
**Status:** ✅ Done

---

## Beschreibung

Visueller Segment-Builder im ACP: Filter-Dropdowns, Bedingungen kombinieren, Vorschau der Segment-Grosse.

## Aufgaben

- [ ] **Filter-Builder:**
  - Dropdown-basierte Filter: Registrierungsdatum, Aktivitat, Kaufe, Abos, Followers, Balance
  - Bedingungen: UND / ODER Verknupfung
  - Verschachtelung (Gruppen)
  - Jeder Filter: Feld + Operator (=, >, <, between, in) + Wert
- [ ] **Vorschau:**
  - "Berechnen" Button: Zeigt geschatzte Segment-Grosse
  - Sample-User anzeigen (erste 10 User des Segments)
  - Aktualisierung bei Filter-Anderung
- [ ] **Segment-Templates:**
  - Vordefinierte Segmente: "Neue User (< 7 Tage)", "Inaktiv (> 30 Tage)", "Kaufer", etc.
  - Templates als Startpunkt, anpassbar
- [ ] **Integration:**
  - Segment im Szenario-Builder verwendbar
  - Segment im Broadcast-Composer verwendbar
  - Segmente speichern und wiederverwenden

## Akzeptanzkriterien

- Filter konnen visuell kombiniert werden
- Vorschau zeigt korrekte Segment-Grosse
- Templates als Startpunkt verfugbar
- Segmente in Szenarien und Broadcasts nutzbar

## Abhangigkeiten

- FEXORA-077 (Targeting-Engine API)
