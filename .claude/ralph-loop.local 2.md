---
active: true
iteration: 1
max_iterations: 15
completion_promise: "PHASE 0 COMPLETE"
started_at: "2026-02-21T18:14:56Z"
---

Arbeite die FEXORA Tickets ab, beginnend mit den offenen Phase 0 Tickets. Der Projektplan steht in PROJEKTPLAN.md, die Tickets in tickets/. Der .NET API Backend ist bereits implementiert (17 Controller, 18 Services, 4 Migrationen). Was FEHLT sind die 3 Next.js Frontend-Apps und das Frontend-Setup. Arbeite folgende Tickets in dieser Reihenfolge ab: 1) FEXORA-003: Next.js Apps scaffolden (apps/web, apps/acp, apps/moderator) mit Next.js, App Router, shadcn/ui, Tailwind v4, Standalone Output. 2) FEXORA-007: Design Tokens und shadcn/ui Theme (Fexora Farben: Mocha Mousse, Butter Yellow, Digital Lavender, Cherry Red). 3) FEXORA-008: i18n Setup mit next-intl (DE + EN, Translations in packages/shared/locales/). 4) FEXORA-004: Shared Packages vervollstaendigen (api-client mit React Query Hooks, config package). 5) FEXORA-005: Docker Compose Dev aktualisieren falls noetig. Markiere jedes fertige Ticket in tickets/README.md als Done. Nutze pnpm als Package Manager. Die API laeuft auf localhost:5000. Achte auf die bestehende turbo.json Konfiguration.
