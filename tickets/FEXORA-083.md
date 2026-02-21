# FEXORA-083: Broadcast-Composer UI

**Phase:** 3 — Sprint 6
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Broadcast-Erstellungstool im ACP: Nachricht + Sender + Zielgruppe + Zeitplanung + A/B-Varianten.

## Aufgaben

- [ ] **Composer-Form:**
  - Nachricht verfassen (Text-Editor)
  - Template auswahlen oder Freitext
  - Sender-Profil auswahlen
  - Variablen-Vorschau
- [ ] **Zielgruppe:**
  - Segment-Builder eingebettet (FEXORA-082)
  - Segment auswahlen oder neu erstellen
  - Empfanger-Vorschau (Anzahl + Sample)
- [ ] **Zeitplanung:**
  - Sofort senden oder Datum/Uhrzeit wahlen
  - Kalender-Ansicht geplanter Broadcasts
  - Quiet Hours Warnung (23-8 CET)
- [ ] **A/B-Testing:**
  - Varianten hinzufugen (bis zu 3)
  - Pro Variante: eigene Nachricht/Template/Sender
  - Verteilungs-Slider
  - Auto-Winner Metrik wahlen
- [ ] **Broadcast-Management:**
  - Liste aller Broadcasts (geplant/gesendet/abgebrochen)
  - Broadcast abbrechen (laufend)
  - Ergebnisse einsehen (Versand-Stats, A/B-Ergebnisse)

## Akzeptanzkriterien

- Broadcast kann erstellt und geplant werden
- Segment-Integration funktioniert
- A/B-Varianten konfigurierbar
- Zeitplanung mit Kalender
- Laufende Broadcasts abbrechbar

## Abhangigkeiten

- FEXORA-079 (Broadcast API), FEXORA-082 (Segment-Builder)
