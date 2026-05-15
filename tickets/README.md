# FEXORA - Ticket-Übersicht

Alle Tickets abgeleitet aus dem [PROJEKTPLAN.md](../PROJEKTPLAN.md).

## Ticket-Nummerierung

`FEXORA-XXX` — fortlaufende Nummerierung, gruppiert nach Phase/Sprint.

---

## Phase 0: Projekt-Setup (Woche 1)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-001](FEXORA-001.md) | Turborepo & Monorepo initialisieren | Alle | ✅ Done |
| [FEXORA-002](FEXORA-002.md) | .NET Solution anlegen | API | ✅ Done |
| [FEXORA-003](FEXORA-003.md) | Next.js Apps scaffolden | Web/ACP/Mod | ✅ Done |
| [FEXORA-004](FEXORA-004.md) | Shared Packages anlegen | Packages | ✅ Done |
| [FEXORA-005](FEXORA-005.md) | Docker Compose Dev-Umgebung | DevOps | ✅ Done |
| [FEXORA-006](FEXORA-006.md) | CI/CD Pipeline (GitHub Actions) | DevOps | ✅ Done |
| [FEXORA-007](FEXORA-007.md) | Design Tokens & shadcn/ui Theme | Web/ACP/Mod | ✅ Done |
| [FEXORA-008](FEXORA-008.md) | i18n Setup (next-intl) | Web/ACP/Mod | ✅ Done |
| [FEXORA-009](FEXORA-009.md) | Monitoring Setup (Sentry + OpenTelemetry) | Alle | ✅ Done |
| [FEXORA-010](FEXORA-010.md) | DB-Index-Strategie in initialer Migration | API | ✅ Done |

---

## Phase 1 — Sprint 1: Auth, Profile, Upload (Woche 2-3)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-011](FEXORA-011.md) | Auth-System + 2FA (TOTP) | API | ✅ Done |
| [FEXORA-012](FEXORA-012.md) | User-Registration & Login UI | Web | ✅ Done |
| [FEXORA-013](FEXORA-013.md) | Profil-CRUD | API | ✅ Done |
| [FEXORA-014](FEXORA-014.md) | Profilseite UI | Web | ✅ Done |
| [FEXORA-015](FEXORA-015.md) | Follow-System + User-Blocking | API | ✅ Done |
| [FEXORA-016](FEXORA-016.md) | Content-Upload + Media-Sets | API | ✅ Done |
| [FEXORA-017](FEXORA-017.md) | Content-Upload UI | Web | ✅ Done |
| [FEXORA-018](FEXORA-018.md) | Likes & Kommentare | API | ✅ Done |
| [FEXORA-019](FEXORA-019.md) | Likes & Kommentare UI | Web | ✅ Done |
| [FEXORA-020](FEXORA-020.md) | Admin Review-Queue (Basis) | ACP | ✅ Done |
| [FEXORA-021](FEXORA-021.md) | Content-Lebenszyklus (Status-Maschine) | API | ✅ Done |
| [FEXORA-022](FEXORA-022.md) | EF Core Migrations (Core + Social Tables) | API | ✅ Done |
| [FEXORA-023](FEXORA-023.md) | API Client generieren (NSwag + React Query) | Packages | ✅ Done |
| [FEXORA-024](FEXORA-024.md) | DMCA-System (Basis) | API + ACP | ✅ Done |
| [FEXORA-025](FEXORA-025.md) | Account Recovery (Passwort-Reset) | API + Web | ✅ Done |

---

## Phase 1 — Sprint 2: Feed, Chat, Unlocks (Woche 4-8)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-026](FEXORA-026.md) | Story-Leiste | API + Web | ✅ Done |
| [FEXORA-027](FEXORA-027.md) | Home Feed (Algorithmic) | API + Web | ✅ Done |
| [FEXORA-028](FEXORA-028.md) | Explore / Discover | API + Web | ✅ Done |
| [FEXORA-029](FEXORA-029.md) | Suche & Tags (Volltextsuche) | API + Web | ✅ Done |
| [FEXORA-030](FEXORA-030.md) | Trending-Engine | API | ✅ Done |
| [FEXORA-031](FEXORA-031.md) | Benachrichtigungen (In-App + SignalR Push) | API + Web | ✅ Done |
| [FEXORA-032](FEXORA-032.md) | Content-Detail + Unlock-Flow | API + Web | ✅ Done |
| [FEXORA-033](FEXORA-033.md) | Favoriten & Kaufhistorie | API + Web | ✅ Done |
| [FEXORA-034](FEXORA-034.md) | Shares / Reposts | API + Web | ✅ Done |
| [FEXORA-035](FEXORA-035.md) | Coin-Wallet (API) | API | ✅ Done |
| [FEXORA-036](FEXORA-036.md) | Payment-Integration (IPaymentService) | API | ✅ Done |
| [FEXORA-037](FEXORA-037.md) | Wallet UI (Coin-Packs kaufen) | Web | ✅ Done |
| [FEXORA-038](FEXORA-038.md) | Chat (SignalR) + Chat-Pricing + PPV | API | ✅ Done |
| [FEXORA-039](FEXORA-039.md) | Chat UI + Tipping im Chat | Web | ✅ Done |
| [FEXORA-040](FEXORA-040.md) | Chat-SDK Package (SignalR Client) | Packages | ✅ Done |
| [FEXORA-041](FEXORA-041.md) | Creator-Dashboard (Basis) | Web | ✅ Done |
| [FEXORA-042](FEXORA-042.md) | Tipping / Gifts (API) | API | ✅ Done |
| [FEXORA-043](FEXORA-043.md) | Content Scheduling | API + Web | ✅ Done |
| [FEXORA-044](FEXORA-044.md) | Custom Requests + Escrow | API + Web | ✅ Done |
| [FEXORA-045](FEXORA-045.md) | Referral-System | API + Web | ✅ Done |
| [FEXORA-046](FEXORA-046.md) | Promo Codes | API + Web | ✅ Done |
| [FEXORA-047](FEXORA-047.md) | Mass-Messaging | API + Web | ✅ Done |
| [FEXORA-048](FEXORA-048.md) | Bundles & Collections | API + Web | ✅ Done |
| [FEXORA-049](FEXORA-049.md) | DSGVO Datenexport (Basis) | API + Web | ✅ Done |
| [FEXORA-050](FEXORA-050.md) | Abo-System (API) | API | ✅ Done |
| [FEXORA-051](FEXORA-051.md) | Abo-System (UI) | Web | ✅ Done |

---

## Phase 2 — Sprint 3: ACP + Moderations-Board + Agency (Woche 6-7)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-052](FEXORA-052.md) | User/Creator-Verwaltung | ACP | ✅ Done |
| [FEXORA-053](FEXORA-053.md) | Pricing / Policy | ACP | ✅ Done |
| [FEXORA-054](FEXORA-054.md) | Payments & Payouts | ACP + API | ✅ Done |
| [FEXORA-055](FEXORA-055.md) | Risk & Trust | ACP + API | ✅ Done |
| [FEXORA-056](FEXORA-056.md) | Reports Dashboard | ACP | ✅ Done |
| [FEXORA-057](FEXORA-057.md) | Moderator 3-Spalten-Board | Moderator | ✅ Done |
| [FEXORA-058](FEXORA-058.md) | Creator-Impersonation | API + Moderator | ✅ Done |
| [FEXORA-059](FEXORA-059.md) | Snippets & Quick-Actions | Moderator | ✅ Done |
| [FEXORA-060](FEXORA-060.md) | Hotkeys & Navigation | Moderator | ✅ Done |
| [FEXORA-061](FEXORA-061.md) | Agency-System (API) | API | ✅ Done |
| [FEXORA-062](FEXORA-062.md) | Agency-Dashboard | Moderator-App | ✅ Done |
| [FEXORA-063](FEXORA-063.md) | Agency-Verwaltung (Admin) | ACP | ✅ Done |

---

## Phase 2 — Sprint 4: KPIs, Attribution, Polishing (Woche 8-9)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-064](FEXORA-064.md) | Attributionslogik (30-Min-Fenster) | API | ✅ Done |
| [FEXORA-065](FEXORA-065.md) | Live-KPIs (SignalR) | Moderator + API | ✅ Done |
| [FEXORA-066](FEXORA-066.md) | Tages-/Wochen-Reports | Moderator + ACP | ✅ Done |
| [FEXORA-067](FEXORA-067.md) | Vergütungs-Engine (Provision) | API | ✅ Done |
| [FEXORA-068](FEXORA-068.md) | Melden / Eskalieren | Web + API | ✅ Done |
| [FEXORA-069](FEXORA-069.md) | DSGVO-Vertiefung | API | ✅ Done |
| [FEXORA-070](FEXORA-070.md) | Watermarking (Steganographie) | API | ✅ Done |
| [FEXORA-071](FEXORA-071.md) | QA & Bugfixing (MVP) | Alle | ✅ Done |

---

## Phase 3 — Sprint 5: Orchestrator Engine + Szenarien (Woche 9-10)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-072](FEXORA-072.md) | Orchestrator Background Service | API | ✅ Done |
| [FEXORA-073](FEXORA-073.md) | Szenario-Engine (Rule-Engine) | API | ✅ Done |
| [FEXORA-074](FEXORA-074.md) | Execution Workers | API | ✅ Done |
| [FEXORA-075](FEXORA-075.md) | Rate Limits & Quiet Hours (Orchestrator) | API | ✅ Done |
| [FEXORA-076](FEXORA-076.md) | Template-System (Handlebars) | API | ✅ Done |
| [FEXORA-077](FEXORA-077.md) | Targeting-Engine (Segment-Builder) | API | ✅ Done |
| [FEXORA-078](FEXORA-078.md) | Compliance (Opt-Out, DSGVO-Consent) | API | ✅ Done |

---

## Phase 3 — Sprint 6: Broadcasts + Admin-UI (Woche 11-12)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-079](FEXORA-079.md) | Broadcast-System | API | ✅ Done |
| [FEXORA-080](FEXORA-080.md) | A/B-Testing | API | ✅ Done |
| [FEXORA-081](FEXORA-081.md) | Szenario-Builder UI | ACP | ✅ Done |
| [FEXORA-082](FEXORA-082.md) | Segment-Builder UI | ACP | ✅ Done |
| [FEXORA-083](FEXORA-083.md) | Broadcast-Composer UI | ACP | ✅ Done |
| [FEXORA-084](FEXORA-084.md) | Orchestrator-Dashboard | ACP | ✅ Done |
| [FEXORA-085](FEXORA-085.md) | Attribution-Anbindung (Orchestrator) | API + ACP | ✅ Done |
| [FEXORA-086](FEXORA-086.md) | Load-Tests & Hardening | Alle | ✅ Done |

---

## Phase 2a: Erweiterungen (Woche 21-22)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-087](FEXORA-087.md) | Web Push Notifications | Web + API | ✅ Done |
| [FEXORA-088](FEXORA-088.md) | Social Login (Google, Apple) | API + Web | ✅ Done |

---

## Phase 3a: Security & Hardening

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-089](FEXORA-089.md) | Global Exception Middleware | API | ✅ Done |
| [FEXORA-090](FEXORA-090.md) | API Rate Limiting Middleware | API | ✅ Done |
| [FEXORA-091](FEXORA-091.md) | Security Headers Middleware | API | ✅ Done |
| [FEXORA-092](FEXORA-092.md) | Environment Validation | API | ✅ Done |
| [FEXORA-093](FEXORA-093.md) | Brute-Force Protection / Account Lockout | API | ✅ Done |
| [FEXORA-094](FEXORA-094.md) | Shared Types Sync (@fexora/shared) | Packages | ✅ Done |
| [FEXORA-095](FEXORA-095.md) | Moderator-App Completion (Audit + Analytics) | Moderator | ✅ Done |
| [FEXORA-096](FEXORA-096.md) | Test Infrastructure & Unit Tests | Alle | ✅ Done |

---

## Gap Closure Sprint: Fehlende Features aus PROJEKTPLAN.md

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-097](FEXORA-097.md) | DMCA Report (User-Formular) | Web | ✅ Done |
| [FEXORA-098](FEXORA-098.md) | Block-Liste verwalten | Web | ✅ Done |
| [FEXORA-099](FEXORA-099.md) | Gift-Items UI (Web) | Web | ✅ Done |
| [FEXORA-100](FEXORA-100.md) | Creator Analytics | Web | ✅ Done |
| [FEXORA-101](FEXORA-101.md) | Creator Earnings & Payouts | Web | ✅ Done |
| [FEXORA-102](FEXORA-102.md) | Creator Chat-Settings | Web | ✅ Done |
| [FEXORA-103](FEXORA-103.md) | Creator Fan-Management | Web | ✅ Done |
| [FEXORA-104](FEXORA-104.md) | Gift-Item-Verwaltung (ACP) | ACP | ✅ Done |
| [FEXORA-105](FEXORA-105.md) | Refund-Management (ACP) | ACP | ✅ Done |
| [FEXORA-106](FEXORA-106.md) | Referral-Konfiguration (ACP) | ACP | ✅ Done |

---

## Legende

- **Open** — Noch nicht begonnen
- **In Progress** — In Bearbeitung
- **In Review** — Code-Review / QA
- **Done** — Abgeschlossen / Deployed
