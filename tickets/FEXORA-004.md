# FEXORA-004: Shared Packages anlegen

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** Packages
**Aufwand:** 6-8h
**Status:** Done

---

## Beschreibung

Shared Packages im Monorepo aufsetzen: API Client, Chat SDK, Shared Types/Validators, Config.

## Aufgaben

- [ ] `packages/api-client/` — TypeScript API Client Stub (NSwag-Generierung vorbereiten)
  - Axios/Fetch Wrapper
  - Types Placeholder
  - React Query Hooks Struktur
- [ ] `packages/chat-sdk/` — WebSocket/SignalR Chat-Client Stub
  - SignalR Client Setup
  - Chat-Types
  - React Hooks Struktur
- [ ] `packages/shared/` — Geteilte Logik & Typen
  - `constants.ts` (Coin-Packs, Rollen, Status-Enums)
  - `validators.ts` (Zod Schemas)
  - `types/` (Shared TypeScript Types)
  - `utils/`
  - `locales/` (i18n JSON-Struktur fur DE + EN)
- [ ] `packages/config/` — Shared Configs
  - ESLint Config
  - TypeScript Config (base, nextjs, react-library)
  - Tailwind Config

## Akzeptanzkriterien

- Alle Packages aus Apps importierbar (`@fexora/shared`, `@fexora/api-client`, etc.)
- TypeScript Compilation fehlerfrei
- Zod Schemas fur grundlegende Entitaten vorhanden

## Abhangigkeiten

- FEXORA-001 (Monorepo)
