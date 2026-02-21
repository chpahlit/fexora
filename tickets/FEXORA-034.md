# FEXORA-034: Shares / Reposts

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 6-8h
**Status:** Open

---

## Beschreibung

Content teilen: Share-Count, geteilte Inhalte im Feed, Social-Media-Sharing.

## Aufgaben

- [ ] **API:**
  - `POST /content/:id/share` — Content teilen (Share tracken)
  - Share-Count pro Content
  - Share-Event fur Feed (`feed_events`, type=share)
- [ ] **Web:**
  - Share-Button auf Content-Cards und Detail-Seite
  - Share-Modal:
    - Link kopieren
    - Social Media Buttons (Twitter, WhatsApp, Telegram)
    - Native Share API (Mobile)
  - Share-Count Anzeige
  - Geteilte Inhalte im Feed (optional: "X hat geteilt")
- [ ] Open Graph Meta-Tags fur geteilte Links (Titel, Bild, Beschreibung)

## Akzeptanzkriterien

- Share-Button funktioniert mit verschiedenen Share-Optionen
- Share-Count wird korrekt getrackt
- Geteilte Links zeigen korrekte OG-Previews
- Native Share API auf Mobile

## Abhangigkeiten

- FEXORA-016 (Content)
- FEXORA-027 (Feed — Shares im Feed anzeigen)
