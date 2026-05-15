# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fexora is a monetized social platform for content creators. It consists of a .NET 10 API backend, three Next.js 15 web apps, and shared TypeScript packages, all managed as a Turborepo monorepo with pnpm workspaces.

## Commands

### Monorepo (root)

```bash
pnpm dev                # Start all services (Turbo)
pnpm dev:web            # Web app only (port 3000)
pnpm dev:acp            # Admin panel only (port 3001)
pnpm dev:moderator      # Moderator tool only (port 3002)
pnpm build              # Build all
pnpm lint               # Lint all
pnpm type-check         # TypeScript checking
pnpm generate           # Regenerate API client from OpenAPI schema
```

### .NET API (run from `apps/api/`)

```bash
dotnet build                              # Build solution (.slnx format, no file arg needed)
dotnet test                               # Run all xUnit tests
dotnet test --filter "FullyQualifiedName~TestName"  # Run single test
dotnet ef migrations add MigrationName --project Fexora.Infrastructure --startup-project Fexora.Api
dotnet ef database update --project Fexora.Infrastructure --startup-project Fexora.Api
```

### Infrastructure

```bash
docker compose up -d    # PostgreSQL :5400, Redis :6500, MinIO :9000/:9001
```

Default credentials: `fexora` / `fexora_dev` (Postgres), `fexora` / `fexora_dev_123` (MinIO).

## Architecture

### Monorepo Layout

- **`apps/web`** — User-facing Next.js app (feed, profiles, chat, subscriptions)
- **`apps/acp`** — Admin control panel (user/content management, analytics, moderation queue)
- **`apps/moderator`** — Agency/moderator tool (3-column chat board, creator impersonation, KPIs)
- **`apps/api`** — .NET 10 REST API + SignalR WebSocket hub
- **`packages/shared`** (`@fexora/shared`) — TypeScript DTOs, Zod validators, utilities
- **`packages/api-client`** (`@fexora/api-client`) — Generated OpenAPI client + React Query hooks
- **`packages/chat-sdk`** (`@fexora/chat-sdk`) — SignalR WebSocket chat client
- **`packages/ui`** (`@fexora/ui`) — Shared UI component library
- **`packages/config`** (`@fexora/config`) — Shared ESLint/TypeScript configs

### .NET Clean Architecture (`apps/api/`)

Solution file: `Fexora.Api.slnx` (not `.sln` — .NET 10 format)

| Project | Layer | Responsibility |
|---------|-------|----------------|
| **Fexora.Core** | Domain | Entities, DTOs, Enums, Interfaces (zero dependencies) |
| **Fexora.Infrastructure** | Data/External | EF Core DbContext, Migrations, external service implementations (MinIO, Redis, Stripe, Email) |
| **Fexora.Api** | Presentation | Controllers, SignalR Hubs, Middleware, DI setup |
| **Fexora.Orchestrator** | Business Logic | Engagement automation (scenarios, broadcasts, templates, targeting) |
| **Fexora.Tests** | Tests | xUnit + Moq + InMemory EF Core |

Dependency flow: Api → Orchestrator → Infrastructure → Core

### Key Backend Patterns

- **Database:** PostgreSQL 17 via EF Core, `FexoraDbContext` with 70+ DbSets
- **Auth:** JWT Bearer + Refresh Tokens, BCrypt password hashing, optional 2FA (TOTP)
- **Realtime:** SignalR with Redis backplane (`ChatHub`)
- **Storage:** MinIO (dev) / Cloudflare R2 (prod), S3-compatible
- **Observability:** Serilog (JSON), Sentry, OpenTelemetry tracing
- **API Docs:** Scalar (OpenAPI)

### Key Frontend Patterns

- All three web apps: Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui
- Data fetching via React Query 5 through `@fexora/api-client`
- i18n with `next-intl` (German + English)
- `output: "standalone"` for Docker deployment
- Path alias: `@/*` → `./src/*`

## Domain Concepts

- **Coins** (not Credits) — in-app currency, 1 EUR = 100 Coins
- **6 Roles:** Gast, User, Creator, Moderator, Agency, Admin
- **Moderator impersonation:** Moderators chat on behalf of creators, hidden from users
- **Age verification:** Self-check for Users, ID upload + Admin review for Creators
- **Upload security:** Magic-Byte validation + Re-Encoding (no ClamAV)
