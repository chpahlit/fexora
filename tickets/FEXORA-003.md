# FEXORA-003: Next.js Apps scaffolden

**Phase:** 0 — Projekt-Setup
**Prioritat:** Kritisch
**App:** Web, ACP, Moderator
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

Drei Next.js 16 Apps anlegen mit App Router, shadcn/ui und Tailwind v4. Jede App bekommt ein identisches Basis-Setup.

## Aufgaben

- [ ] `apps/web/` — User-Website (Port 3000)
- [ ] `apps/acp/` — Admin Control Panel (Port 3001)
- [ ] `apps/moderator/` — Moderator & Agency App (Port 3002)
- [ ] shadcn/ui in allen drei Apps initialisieren
- [ ] Tailwind v4 konfigurieren
- [ ] App Router mit initialer Layout-Struktur
- [ ] Standalone Output-Mode fur Docker (`.next/standalone`)
- [ ] Basis-Seiten: Login, Dashboard (Placeholder)

## Akzeptanzkriterien

- Alle 3 Apps starten mit `turbo dev`
- shadcn/ui Komponenten importierbar
- Tailwind-Klassen funktionieren
- `turbo build` erzeugt standalone Output

## Abhangigkeiten

- FEXORA-001 (Monorepo)
- FEXORA-007 (Design Tokens — kann parallel)
