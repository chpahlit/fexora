# FEXORA-001: Turborepo & Monorepo initialisieren

**Phase:** 0 — Projekt-Setup
**Prioritat:** Kritisch
**App:** Alle
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

Monorepo-Struktur mit Turborepo aufsetzen. Workspace-Konfiguration fur alle Apps und Packages.

## Aufgaben

- [x] `turbo.json` konfigurieren (build, dev, lint, test Pipelines)
- [x] Root `package.json` mit Workspaces (`apps/*`, `packages/*`)
- [x] Verzeichnisstruktur anlegen: `apps/`, `packages/`, `docker/`, `tooling/`
- [x] `.gitignore`, `.editorconfig`, `.nvmrc` (Node 22)
- [x] Turborepo Remote Caching evaluieren

## Akzeptanzkriterien

- `turbo dev` startet alle Apps parallel
- `turbo build` baut alle Apps + Packages
- `turbo lint` pruft alle Workspaces
- Workspace-Abhangigkeiten korrekt aufgelost

## Abhangigkeiten

- Keine (erstes Ticket)
