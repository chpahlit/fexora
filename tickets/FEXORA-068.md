# FEXORA-068: Melden / Eskalieren

**Phase:** 2 — Sprint 4
**Prioritat:** Hoch
**App:** Web + API
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

User konnen Inhalte, Kommentare, Chats und Profile melden. Reports landen in der Admin-Queue.

## Aufgaben

- [ ] **API:**
  - `POST /reports` — Report erstellen
  - Felder: target_type (content/comment/message/profile), target_id, category, description
  - Kategorien: Spam, Belastigung, Illegal, Copyright, Betrug, Sonstiges
  - Status: open -> reviewed -> dismissed / action_taken
- [ ] **Web UI:**
  - Melden-Button auf: Content-Cards, Kommentaren, Chat-Nachrichten, Profilen
  - Report-Modal: Kategorie wahlen + optionaler Freitext
  - Bestatigung: "Danke fur deine Meldung"
- [ ] **Rate Limiting:**
  - Max. Reports pro User pro Tag (verhindert Missbrauch)

## Akzeptanzkriterien

- Melden-Button uberall verfugbar
- Report wird in Admin-Queue angezeigt (FEXORA-055)
- Kategorien helfen beim Priorisieren
- Rate Limiting verhindert Spam-Reports

## Abhangigkeiten

- FEXORA-055 (Risk & Trust — Admin-Queue)
