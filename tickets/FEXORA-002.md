# FEXORA-002: .NET Solution anlegen

**Phase:** 0 — Projekt-Setup
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

.NET 10 Solution mit Clean Architecture anlegen: `Fexora.Api`, `Fexora.Core`, `Fexora.Infrastructure`, `Fexora.Orchestrator`.

## Aufgaben

- [x] `Fexora.Api.sln` erstellen
- [x] `Fexora.Core` — Domain Models, Interfaces, Enums
- [x] `Fexora.Infrastructure` — EF Core, Redis, S3, Payment-Providers, SignalR
- [x] `Fexora.Api` — ASP.NET Core Web API (Hauptprojekt)
- [x] `Fexora.Orchestrator` — Engagement-Engine (Background Service)
- [x] Projektreferenzen: API -> Infrastructure -> Core
- [x] NuGet-Packages: EF Core, Identity, JWT, SignalR, Hangfire, Serilog

## Akzeptanzkriterien

- `dotnet build` kompiliert fehlerfrei
- Clean Architecture Abhangigkeiten eingehalten (Core hat keine externen Referenzen)
- Alle 4 Projekte in der Solution

## Abhangigkeiten

- FEXORA-001 (Monorepo-Struktur)
