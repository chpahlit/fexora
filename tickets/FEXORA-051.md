# FEXORA-051: Abo-System (UI)

**Phase:** 1 — Sprint 2
**Prioritat:** Hoch
**App:** Web
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Frontend fur das Abo-System: Stufen auf Creator-Profil anzeigen, Abonnieren-Flow, "Meine Abos" Seite, Creator Abo-Stufen-Builder.

## Aufgaben

- [ ] **Creator-Profil (Abo-Anzeige):**
  - Abo-Stufen-Karten (Name, Preis, Perks)
  - "Abonnieren" CTA pro Stufe
  - Aktueller Abo-Status Badge (wenn abonniert)
  - Stufen-Vergleich
- [ ] **Abonnieren-Flow:**
  - Stufe auswahlen
  - Payment-Mode wahlen (Coins oder EUR)
  - Perks-Vorschau
  - Bestatigungsdialog
  - Erfolgs-/Fehlermeldung
- [ ] **"Meine Abos" Seite (`/subscriptions`):**
  - Aktive Abos mit Creator-Info und Perks
  - Nachste Verlangerung Datum
  - Kundigen-Button
  - Abo-Historie (vergangene Abos)
- [ ] **Creator: Abo-Stufen-Builder (`/creator/subscriptions`):**
  - Stufen erstellen/bearbeiten
  - Name, Beschreibung, Preis (Coins und/oder EUR)
  - Perks konfigurieren (Checkboxes + Custom Freitext)
  - Sortierung (Drag & Drop)
  - Aktivieren/Deaktivieren
  - Subscriber-Ubersicht pro Stufe
  - Abo-Metriken: MRR, Churn-Rate

## Akzeptanzkriterien

- Abo-Stufen auf Profil korrekt dargestellt
- Abonnieren-Flow End-to-End funktional
- Meine-Abos-Seite zeigt aktive und vergangene Abos
- Stufen-Builder erlaubt volle Konfiguration
- MRR und Churn korrekt berechnet
- Responsive Layout

## Abhangigkeiten

- FEXORA-050 (Abo-System API)
- FEXORA-014 (Profil-Seite)
