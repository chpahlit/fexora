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
| [FEXORA-006](FEXORA-006.md) | CI/CD Pipeline (GitHub Actions) | DevOps | Open |
| [FEXORA-007](FEXORA-007.md) | Design Tokens & shadcn/ui Theme | Web/ACP/Mod | ✅ Done |
| [FEXORA-008](FEXORA-008.md) | i18n Setup (next-intl) | Web/ACP/Mod | ✅ Done |
| [FEXORA-009](FEXORA-009.md) | Monitoring Setup (Sentry + OpenTelemetry) | Alle | Open |
| [FEXORA-010](FEXORA-010.md) | DB-Index-Strategie in initialer Migration | API | Open |

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
| [FEXORA-022](FEXORA-022.md) | EF Core Migrations (Core + Social Tables) | API | Open |
| [FEXORA-023](FEXORA-023.md) | API Client generieren (NSwag + React Query) | Packages | Open |
| [FEXORA-024](FEXORA-024.md) | DMCA-System (Basis) | API + ACP | Open |
| [FEXORA-025](FEXORA-025.md) | Account Recovery (Passwort-Reset) | API + Web | Open |

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
| [FEXORA-072](FEXORA-072.md) | Orchestrator Background Service | API | Open |
| [FEXORA-073](FEXORA-073.md) | Szenario-Engine (Rule-Engine) | API | Open |
| [FEXORA-074](FEXORA-074.md) | Execution Workers | API | Open |
| [FEXORA-075](FEXORA-075.md) | Rate Limits & Quiet Hours (Orchestrator) | API | Open |
| [FEXORA-076](FEXORA-076.md) | Template-System (Handlebars) | API | Open |
| [FEXORA-077](FEXORA-077.md) | Targeting-Engine (Segment-Builder) | API | Open |
| [FEXORA-078](FEXORA-078.md) | Compliance (Opt-Out, DSGVO-Consent) | API | Open |

---

## Phase 3 — Sprint 6: Broadcasts + Admin-UI (Woche 11-12)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-079](FEXORA-079.md) | Broadcast-System | API | Open |
| [FEXORA-080](FEXORA-080.md) | A/B-Testing | API | Open |
| [FEXORA-081](FEXORA-081.md) | Szenario-Builder UI | ACP | Open |
| [FEXORA-082](FEXORA-082.md) | Segment-Builder UI | ACP | Open |
| [FEXORA-083](FEXORA-083.md) | Broadcast-Composer UI | ACP | Open |
| [FEXORA-084](FEXORA-084.md) | Orchestrator-Dashboard | ACP | Open |
| [FEXORA-085](FEXORA-085.md) | Attribution-Anbindung (Orchestrator) | API + ACP | Open |
| [FEXORA-086](FEXORA-086.md) | Load-Tests & Hardening | Alle | Open |

---

## Phase 2a: Erweiterungen (Woche 21-22)

| Ticket | Titel | App | Status |
|--------|-------|-----|--------|
| [FEXORA-087](FEXORA-087.md) | Web Push Notifications | Web + API | Open |
| [FEXORA-088](FEXORA-088.md) | Social Login (Google, Apple) | API + Web | Open |

---

## Legende

- **Open** — Noch nicht begonnen
- **In Progress** — In Bearbeitung
- **In Review** — Code-Review / QA
- **Done** — Abgeschlossen / Deployed
