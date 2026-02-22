# FEXORA-006: CI/CD Pipeline (GitHub Actions)

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** DevOps
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

GitHub Actions Workflows fur Lint, Build, Test und Deployment aufsetzen.

## Aufgaben

- [x] `.github/workflows/ci.yml` — Continuous Integration
  - ESLint (alle Web-Apps + Packages)
  - `dotnet format` (API)
  - TypeScript Type-Check (`tsc --noEmit`)
  - `dotnet build` (API)
  - Unit Tests: xUnit (API) mit PostgreSQL + Redis Services
  - Frontend Build Matrix (web, acp, moderator)
- [x] `.github/workflows/docker-build.yml` — Docker Images
  - Multi-Stage Build fur API, Web, ACP, Moderator
  - Push to GitHub Container Registry (ghcr.io)
  - Semantic versioning + SHA tags
- [x] `.github/workflows/deploy-staging.yml` — Staging Deployment
  - SSH to Staging Server
  - `docker compose pull && docker compose up -d`
  - Health-Check nach Deployment
- [x] Dockerfiles fur alle Web-Apps erstellt

## Implementierte Dateien

- `.github/workflows/ci.yml` — Lint, format, build, test
- `.github/workflows/docker-build.yml` — Docker images to ghcr.io
- `.github/workflows/deploy-staging.yml` — SSH deploy + health check
- `apps/web/Dockerfile` — Next.js standalone build
- `apps/acp/Dockerfile` — Next.js standalone build
- `apps/moderator/Dockerfile` — Next.js standalone build

## Akzeptanzkriterien

- Push auf `main` triggert CI-Pipeline
- PR-Checks: Lint + Build + Tests mussen grun sein
- Docker Images werden gebaut und gepusht
- Staging-Deployment funktioniert

## Abhangigkeiten

- FEXORA-001, FEXORA-002, FEXORA-003
