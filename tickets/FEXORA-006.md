# FEXORA-006: CI/CD Pipeline (GitHub Actions)

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** DevOps
**Aufwand:** 6-8h
**Status:** Open

---

## Beschreibung

GitHub Actions Workflows fur Lint, Build, Test und Deployment aufsetzen.

## Aufgaben

- [ ] `.github/workflows/ci.yml` — Continuous Integration
  - ESLint (alle Web-Apps + Packages)
  - `dotnet format` (API)
  - TypeScript Type-Check (`tsc --noEmit`)
  - `dotnet build` (API)
  - Unit Tests: xUnit (API) + Vitest (Web) — parallel
  - Integration Tests mit Testcontainers (PostgreSQL, Redis)
- [ ] `.github/workflows/docker-build.yml` — Docker Images
  - Multi-Stage Build fur API, Web, ACP, Moderator
  - Push to GitHub Container Registry (ghcr.io)
- [ ] `.github/workflows/deploy-staging.yml` — Staging Deployment
  - SSH to Staging Server
  - `docker compose pull && docker compose up -d`
  - Playwright E2E Tests gegen Staging
- [ ] Branch-Protection Rules dokumentieren (PR required, CI must pass)

## Akzeptanzkriterien

- Push auf `main` triggert CI-Pipeline
- PR-Checks: Lint + Build + Tests mussen grun sein
- Docker Images werden gebaut und gepusht
- Staging-Deployment funktioniert

## Abhangigkeiten

- FEXORA-001, FEXORA-002, FEXORA-003
