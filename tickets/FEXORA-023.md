# FEXORA-023: API Client generieren (NSwag + React Query)

**Phase:** 1 — Sprint 1
**Prioritat:** Hoch
**App:** Packages
**Aufwand:** 6-8h
**Status:** Open

---

## Beschreibung

Automatisch generierten TypeScript API Client aus OpenAPI Spec erstellen. Inklusive React Query Hooks fur alle Endpoints.

## Aufgaben

- [ ] NSwag Configuration fur OpenAPI Spec Generation (.NET API)
- [ ] TypeScript Client Generierung (`packages/api-client/src/`)
  - `client.ts` — Axios/Fetch Wrapper mit Auth-Header Injection
  - `types.ts` — Auto-generierte API-Typen (Request/Response DTOs)
- [ ] React Query Hooks generieren (oder manuell wrappen)
  - `useQuery` fur GET Endpoints
  - `useMutation` fur POST/PATCH/DELETE Endpoints
  - Automatische Cache-Invalidierung
- [ ] Build-Script: `npm run generate` -> Client neu generieren
- [ ] Turbo Pipeline: API Build -> Client Generation -> Web Build
- [ ] API-Versionierung: `/api/v1/` Prefix, separate Spec pro Version

## Akzeptanzkriterien

- TypeScript Client wird aus OpenAPI Spec generiert
- Alle API-Typen sind typsicher (kein `any`)
- React Query Hooks fur alle Endpoints verfugbar
- Client kann in allen 3 Web-Apps importiert werden
- Regenerierung bei API-Anderungen uber npm Script

## Abhangigkeiten

- FEXORA-002 (API muss Endpoints haben)
- FEXORA-004 (Packages-Struktur)
