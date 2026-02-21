# FEXORA-007: Design Tokens & shadcn/ui Theme

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** Web, ACP, Moderator
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

FEXORA Farbwelt als Design Tokens definieren und in ein shadcn/ui Custom Theme uberfuhren. Einheitliches Erscheinungsbild fur alle drei Web-Apps.

## Aufgaben

- [ ] Design Tokens definieren:
  - **Mocha Mousse** — Primary / Warm Brown
  - **Butter Yellow** — Accent / Warm Gold
  - **Digital Lavender** — Secondary / Soft Purple
  - **Cherry Red** — Danger / Emphasis
- [ ] CSS Custom Properties in `globals.css` (HSL-Werte fur shadcn/ui)
- [ ] Tailwind v4 Theme Extension mit Fexora-Farben
- [ ] shadcn/ui `components.json` anpassen (Style, Base Color, CSS Variables)
- [ ] Dark Mode Variante vorbereiten (CSS Variables fur `dark`)
- [ ] Typography: Font-Stack definieren (System Fonts oder Custom)
- [ ] Shared Theme Config in `packages/config/tailwind/`

## Akzeptanzkriterien

- Alle drei Apps verwenden identische Farben/Theme
- shadcn/ui Komponenten (Button, Card, Input) zeigen Fexora-Farben
- Dark/Light Mode Switch funktioniert
- Design Tokens in einem Shared Package wiederverwendbar

## Abhangigkeiten

- FEXORA-003 (Next.js Apps vorhanden)
