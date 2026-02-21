# FEXORA-017: Content-Upload UI

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** Web
**Aufwand:** 16-20h
**Status:** Done

---

## Beschreibung

Upload-Formular fur Creator: Medien hochladen, Preis setzen, Sichtbarkeit wahlen, Tags vergeben, Media-Sets erstellen, Drafts verwalten.

## Aufgaben

- [ ] **Upload-Formular:**
  - Drag & Drop + File-Picker (Multi-File fur Media-Sets)
  - Upload-Progress Anzeige
  - Medien-Vorschau (Bild-Thumbnail, Video-Preview, Audio-Player)
  - Sortierung der Medien im Media-Set (Drag & Drop)
- [ ] **Content-Einstellungen:**
  - Titel (Pflicht)
  - Beschreibung/Text
  - Preis in Coins (0 = kostenlos)
  - Sichtbarkeit: Public / Follower-Only / Paid
  - Kommentar-Modus: Alle / Nur Follower / Deaktiviert
  - Tags/Hashtags Eingabe (Autocomplete aus bestehenden Tags)
- [ ] **Blur/Vorschau:**
  - Vorschau des Blur-Effects fur Paid Content
  - Cover-Bild Auswahl (bei Media-Sets)
- [ ] **Draft-Management:**
  - "Als Entwurf speichern" Button
  - Draft-Liste im Creator-Dashboard
  - Draft bearbeiten und veroffentlichen
- [ ] **Text-Content:**
  - Rich-Text-Editor fur Text-only Content
  - Markdown-Support oder WYSIWYG
- [ ] Zod Validation fur alle Felder

## Akzeptanzkriterien

- Creator kann alle Medientypen hochladen
- Media-Sets mit mehreren Dateien funktionieren
- Preis, Sichtbarkeit und Tags korrekt gesetzt
- Draft speichern und spater bearbeiten
- Upload-Progress sichtbar
- Responsive Layout

## Abhangigkeiten

- FEXORA-016 (Content Upload API)
- FEXORA-003 (Web App)
