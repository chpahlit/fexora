# FEXORA - Projektplan

## 1. Projektübersicht

FEXORA ist eine Social-Media-Plattform mit Community- und Marktplatz-Funktionen. User können Inhalte teilen, liken, kommentieren und Creatorn folgen — ähnlich klassischer Social Networks. Der Twist: Content-Creator können exklusive Inhalte (Bilder, Clips, Geschichten, Hörspiele) kostenpflichtig anbieten und über ein flexibles Chat-Pricing-Modell direkten Kontakt monetarisieren. Ein Coin-basiertes Währungssystem ermöglicht Käufe, Unlocks und bezahlte Interaktionen. Die Moderator-App ist speziell für Creator/Moderatoren konzipiert, um effizient viele User-Konversationen parallel zu managen. Zusätzlich wird ein Engagement-Orchestrator integriert, der automatisierte Nutzer-Interaktionen steuert.

---

## 2. Architektur & Tech-Stack

### 2.1 Monorepo-Struktur (Turborepo)

```
fexora/
├── turbo.json
├── package.json
├── apps/
│   ├── api/                    # .NET 10 Web API (C#)
│   │   ├── Fexora.Api/         # ASP.NET Core Web API (Hauptprojekt)
│   │   ├── Fexora.Core/        # Domain Models, Interfaces, Enums
│   │   ├── Fexora.Infrastructure/ # EF Core, Redis, S3, Payment-Providers, SignalR
│   │   ├── Fexora.Orchestrator/   # Engagement-Engine (Background Service)
│   │   └── Fexora.Api.sln
│   ├── web/                    # User-Website (Next.js + shadcn/ui)
│   │   ├── app/                # App Router
│   │   ├── components/
│   │   └── ...
│   ├── acp/                    # Admin Control Panel (Next.js + shadcn/ui)
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
│   └── moderator/              # Moderatoren- & Agency-App (Next.js + shadcn/ui)
│       ├── app/
│       ├── components/
│       └── ...
├── packages/
│   ├── api-client/             # Generierter .NET API Client (TypeScript)
│   │   ├── src/
│   │   │   ├── client.ts       # Axios/Fetch Wrapper
│   │   │   ├── types.ts        # Auto-generierte API-Typen
│   │   │   └── hooks/          # React Query Hooks
│   │   └── ...
│   ├── shared/                 # Geteilte Logik & Typen
│   │   ├── src/
│   │   │   ├── constants.ts
│   │   │   ├── validators.ts   # Zod Schemas
│   │   │   ├── types/          # Shared TypeScript Types
│   │   │   └── utils/
│   │   └── ...
│   ├── chat-sdk/               # WebSocket/SignalR Chat-Client
│   │   ├── src/
│   │   │   ├── signalr-client.ts
│   │   │   ├── types.ts
│   │   │   └── hooks/
│   │   └── ...
│   └── config/                 # Shared Configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── docker/
│   ├── docker-compose.yml          # Production (alle Services)
│   ├── docker-compose.dev.yml      # Local Dev (Postgres, Redis, MinIO)
│   ├── api/
│   │   └── Dockerfile              # .NET 10 API Multi-Stage Build
│   ├── web/
│   │   └── Dockerfile              # Next.js User-Web (standalone output)
│   ├── acp/
│   │   └── Dockerfile              # Next.js ACP (standalone output)
│   ├── moderator/
│   │   └── Dockerfile              # Next.js Moderator (standalone output)
│   └── nginx/
│       ├── Dockerfile
│       └── nginx.conf              # Reverse Proxy + SSL Termination
└── tooling/
    └── .github/workflows/          # CI/CD
```

### 2.2 Tech-Stack Detail

| Bereich | Technologie | Zweck |
|---------|------------|-------|
| **API** | .NET 10 / ASP.NET Core | REST API + SignalR WebSocket Hub |
| **ORM** | Entity Framework Core | PostgreSQL Zugriff |
| **Auth** | ASP.NET Identity + JWT | Authentifizierung & RBAC |
| **Queue** | .NET Background Services + Redis (Hangfire) | Job-Queue, Orchestrator |
| **User Web** | Next.js 16 + shadcn/ui + Tailwind v4 | User-Frontend |
| **ACP** | Next.js 16 + shadcn/ui + Tailwind v4 | Admin Control Panel |
| **Moderator** | Next.js 16 + shadcn/ui + Tailwind v4 | High-Throughput Chat-Tool |
| **Shared UI** | shadcn/ui (alle Web-Apps) | Einheitliche UI-Komponenten für web, acp, moderator |
| **API Client** | Auto-generiert (NSwag/OpenAPI) + React Query | Typsichere API-Anbindung |
| **Realtime** | SignalR (.NET) | Chat, Live-KPIs, Online-Status |
| **DB** | PostgreSQL | Primäre Datenbank |
| **Cache** | HybridCache + Redis | L1 In-Memory + L2 Redis, Stampede-Protection |
| **Storage** | Cloudflare R2 (S3-kompatibel) | Medien (Bilder, Audio, Clips), 0 EUR Egress |
| **CDN** | BunnyCDN | Content Delivery, EU-optimiert |
| **Payments** | Generisches `IPaymentService` | Coin-Packs, Payouts - Provider austauschbar (Stripe, etc.) |
| **Coin-Kurs** | Fester Kurs: 1 EUR = 100 Coins | Fixer Wechselkurs, kein Bonus bei größeren Packs. Packs: 500/1.500/3.000/7.500 Coins (5/15/30/75 EUR) |
| **Hosting** | Hetzner Cloud VPS | Docker-Container, EU-Rechenzentren (DSGVO) |
| **Monitoring** | Sentry + OpenTelemetry | Error Tracking, Tracing |
| **i18n** | next-intl | DE + EN von Phase 1, Fokus DACH-Markt |

---

## 3. Rollen & Berechtigungen

| Rolle | Zugriff | Einschränkungen |
|-------|---------|-----------------|
| **Gast** | Öffentliche Profile/Teaser, Registrierung | Kein Kauf, kein Chat |
| **User** | Folgen, kaufen/unlocken, chatten, melden, Creator-Abos abschließen | Kein Admin/Mod-Zugriff |
| **Creator** | Inhalte hochladen, Preise setzen, Bundles, Abo-Stufen konfigurieren, Chat-Pricing konfigurieren (Free/Unlock/Pro-Nachricht), Creator-Dashboard (Earnings, Stats, Fan-Management, Subscriber-Übersicht) | Keine Moderationstools |
| **Moderator** | Parallele Dialog-Queues, im Namen von zugewiesenen Creatorn chatten/posten, KPIs sehen | Nur zugewiesene Creator, keine Admin-Settings |
| **Agency** | Eigene Creator-Profile erstellen & verwalten, Moderatoren managen & zuweisen, Agency-Dashboard (KPIs, Umsätze, Team-Übersicht) | Nur eigene Creator + von Admin zugewiesene Creator, keine Admin-Settings |
| **Admin** | Content-Review, Eskalationen, Payouts, Rollen, Policy, Risk & Logs, Agency-Verwaltung (Creator-Zuweisung), Platform-Settings | Vollzugriff |

---

## 4. Apps & Funktionsumfang

### 4.1 API (.NET 10)

**Kern-Module:**

| Modul | Endpunkte | Beschreibung |
|-------|-----------|--------------|
| **Auth** | `/auth/signup`, `/auth/login`, `/auth/refresh`, `/auth/verify-identity`, `/auth/2fa/enable`, `/auth/2fa/disable`, `/auth/2fa/verify`, `/auth/2fa/status`, `/auth/2fa/backup-codes`, `/auth/password-reset`, `/auth/password-reset/confirm` | JWT + Refresh Tokens, RBAC (6 Rollen), 2FA (TOTP aktivieren/deaktivieren/Status/Backup-Codes), Ausweis-Upload für Creator/Mod (Admin-Freigabe), Passwort-Reset via E-Mail |
| **Profiles** | `/profiles/:id`, `PATCH /profiles/:id`, `/profiles/:id/block`, `DELETE /profiles/:id/block`, `GET /me/blocked-users`, `GET /me/identity-verification/status`, `POST /me/identity-verification` | Profil CRUD, Badges, Avatar, User-Blocking (Block/Unblock/Blockliste), Identitäts-Verifikationsstatus + Re-Upload |
| **Content** | `/content` (POST), `/content/:id`, `/content/:id/submit`, `/content/:id/schedule`, `DELETE /content/:id/schedule`, `GET /creator/scheduled`, `/content/:id/pin`, `GET /content/drafts`, `PATCH /content/drafts/:id`, `DELETE /content/drafts/:id` | Upload (Einzel + Media-Sets), Status-Management, Scheduling (erstellen/löschen/auflisten), Pinned Posts, Drafts CRUD |
| **Feed** | `/feed`, `/stories` | Algorithmic Feed, Story-Leiste (24h sichtbar, permanent im Profil-Archiv) |
| **Chat** | SignalR Hub `/hubs/chat` | 1:1 Messaging, Online-Status, Read Receipts, PPV-Messages, Tipping/Gifts |
| **Tipping** | `/tips/send`, `/tips/gifts`, `GET /gifts/list` | Freier Coin-Betrag + vordefinierte Gift-Items (Admin-konfigurierbar), öffentliche Gift-Item-Liste für Chat-UI |
| **Custom Requests** | `/requests` (POST), `/requests/:id/accept`, `/requests/:id/deliver`, `/requests/:id/confirm`, `/requests/:id/dispute`, `GET /requests/my` | Formular-basierte Custom-Requests mit Escrow-System, Delivery-Bestätigung, Dispute-Flow |
| **Wallet** | `/wallet/topup`, `/unlock`, `/wallet/transfer` | Coins kaufen, Transaktionshistorie, Coin-Transfers (Tips/Gifts) |
| **Referral** | `/referral/code`, `/referral/redeem`, `/referral/stats`, `DELETE /admin/referral-codes/:id` | User-wirbt-User (Bonus-Coins) + Creator-wirbt-Creator (%-Provision), Admin kann Codes sperren |
| **DMCA** | `/dmca/report`, `/dmca/:id/review`, `/dmca/:id/counter-notice` | Takedown-Requests für gestohlenen Content, Admin-Review, Counter-Notice (Phase 2+) |
| **Promo Codes** | `POST /promos`, `GET /promos/my`, `POST /promos/{code}/validate`, `GET /promos/:id/stats` | Creator erstellt Promo-Codes, Validierung vor Checkout, Nutzungsstatistiken |
| **Admin** | `/admin/review`, `/admin/content/:id/approve\|reject`, `/admin/refunds/:txId` | Review-Queue, Reports, manuelle Transaktionserstattung |
| **Moderation** | `/mod/queue`, `/mod/assignNext`, `/mod/kpis/live` | Queue, KPIs, Attribution |
| **Social** | `/content/:id/like`, `/content/:id/comments`, `/users/:id/follow`, `/content/:id/share` | Likes, Kommentare, Follows, Shares |
| **Discovery** | `/explore`, `/trending`, `/tags/:slug`, `/search` | Explore-Seite, Trending, Hashtags, Volltextsuche |
| **Notifications** | `/notifications`, `/notifications/read`, SignalR Push | In-App + Push-Benachrichtigungen (Likes, Follows, Kommentare, Unlocks) |
| **Creator** | `/creator/dashboard`, `/creator/earnings`, `/creator/fans`, `/creator/chat-settings`, `/creator/subscriptions` | Creator-Dashboard, Einnahmen, Fan-Management, Chat-Pricing, Abo-Stufen-Verwaltung |
| **Subscriptions** | `/subscriptions/plans/:creatorId`, `/subscriptions/subscribe`, `/subscriptions/cancel`, `/subscriptions/my` | Abo-Stufen anzeigen, abonnieren (Coins oder EUR), kündigen, eigene Abos verwalten |
| **Agency** | `/agency/creators`, `/agency/moderators`, `/agency/assignments`, `/agency/dashboard`, `/agency/kpis` | Creator-Profile erstellen/verwalten, Moderatoren managen, Creator-Zuweisungen, Agency-KPIs |
| **Favorites** | `/favorites`, `/favorites/:contentId` | Merkliste / Wishlist für User |
| **Orchestrator** | `/scenarios`, `/broadcasts`, `/_exec/*` | Engagement-Engine (intern) |
| **Attribution** | `/attribution/lock`, `/attribution/metrics` | Umsatzzuordnung (30-Min-Fenster) |
| **Platform-Settings** | `/admin/settings`, `/admin/settings/:key` | Admin-konfigurierbare Plattform-Parameter (Mod-Provision %, Chat-Preisgrenzen, Payout-Minimum, Coin-Pack-Preise) |

**Architektur-Pattern:**
- Clean Architecture (Core > Infrastructure > API)
- **Payment-Abstraction**: `IPaymentService` Interface in Core, konkrete Provider (Stripe, etc.) in Infrastructure - austauschbar ohne API-Änderungen
- **E-Mail-Abstraction**: `IEmailService` Interface in Core, Resend als erste Implementierung - Auth + Transaktional + Engagement E-Mails
- CQRS mit MediatR für komplexe Flows
- Hangfire für Background Jobs (Orchestrator-Engine)
- SignalR für Realtime (Chat, Live-KPIs, Online-Status)
- Rate Limiting via ASP.NET Core Middleware + Redis (alle Limits Admin-konfigurierbar, Mass-Messaging: 1/h pro Creator)
- API-Versionierung: `Asp.Versioning` NuGet, URL-basiert (`/api/v1/...`), separate OpenAPI Spec pro Version
- **HybridCache** (.NET 10 nativ) für Caching-Strategie:
  - L1: In-Memory (schnell, pro Instanz)
  - L2: Redis (geteilt zwischen Instanzen)
  - Stampede-Protection, Tag-basierte Invalidierung
  - Einsatz: Feed, Profile, Content-Metadaten, Segment-Queries

### 4.2 User-Web (Next.js + shadcn/ui)

| Feature | Beschreibung |
|---------|--------------|
| Auth/Onboarding | E-Mail-Login, 18+ Self-Check, Consent |
| Home/Feed | Story-Leiste, gemischter Feed (Kontakte, Online, Besucher, Empfehlungen), Like/Kommentar/Share direkt im Feed |
| Explore/Discover | Trending Content, Kategorien-Browsing (Bilder, Clips, Stories, Hörspiele), Tag-basierte Navigation, Creator-Empfehlungen |
| Suche | Volltextsuche (Profile, Content, Tags), Filter (Typ, Preis, Creator, Beliebtheit) |
| Profile | Badges, Custom-Content-Indikator, Follow/Unfollow, Chat-CTA (mit Preis-Info), Grid (offen + blur/locked + follower-only), Follower/Following-Listen, Abo-Stufen-Anzeige + Abonnieren-CTA |
| Subscriptions | Abo-Stufen des Creators anzeigen, abonnieren (Coins oder EUR), eigene Abos verwalten, kündigen, Abo-Status auf Profil sichtbar |
| Content-Detail | Teaser, Preis in Coins, Unlock (oder via Abo freigeschaltet), Watermark, Likes, Kommentare, Teilen, Ähnliche Inhalte, Tags |
| Kommentare | Verschachtelte Kommentare, Likes auf Kommentare, Creator bestimmt Kommentar-Modus (Alle/Follower/Aus) |
| Chat (User-Sicht) | 1:1 mit Creator, Chat-Pricing-Info (kostenlos/Unlock/pro Nachricht), Text + Emojis, Lesestatus, Online-Status (SignalR) |
| Favoriten/Wishlist | Inhalte merken, Favoriten-Übersicht, "Meine Unlocks" Kaufhistorie |
| Benachrichtigungen | Notification-Center: Likes, Kommentare, Follows, Unlocks, neue Inhalte von gefolgten Creatorn, Chat-Nachrichten |
| Trending | Trending Content, Trending Tags, Trending Creator (täglich/wöchentlich) |
| Wallet/Coins | Coin-Packs kaufen, Transaktionshistorie, Balance-Anzeige |
| Tipping/Gifts | Freier Coin-Betrag senden, Gift-Items auswählen (mit Animation), Tip-Historie |
| PPV-Messages | Creator sendet PPV im Chat, User sieht Preview + Preis, Unlock per Coins |
| Custom Requests | Formular ausfüllen (Beschreibung, Budget), Status verfolgen, Escrow-Info, Delivery annehmen/ablehnen |
| Referral | Eigener Referral-Code/Link, Einladungs-Seite, Stats (geworben, Bonus erhalten) |
| User-Blocking | User blockieren (Profil, Chat, Follow unsichtbar), Blockliste verwalten |
| 2FA | TOTP aktivieren/deaktivieren in Account-Settings, Backup-Codes anzeigen |
| Promo Codes | Code eingeben bei Unlock/Abo für Rabatt |
| Melden | Inhalte/Kommentare/Chats melden (Kategorien, Freitext) |
| DMCA Report | Takedown-Formular für gestohlenen eigenen Content (mit Nachweis-Upload) |
| **Creator-Dashboard** (`/creator/*`) | |
| ∟ Übersicht | Einnahmen (heute/Woche/Monat), Unlock-Statistiken, Follower-Wachstum, Top-Content |
| ∟ Content-Manager | Eigene Inhalte verwalten, Status (Draft/Pending/Approved), Preise anpassen, Bundles erstellen, Media-Sets/Galleries, Scheduling, Pinned Posts, Drafts |
| ∟ Abo-Verwaltung | Abo-Stufen erstellen/bearbeiten (Name, Preis in Coins oder EUR, inkludierte Inhalte/Perks), Subscriber-Übersicht, Abo-Einnahmen |
| ∟ Fan-Management | Käufer-Übersicht, Top-Fans, Aktivste Chatter, Subscriber-Liste, Segmente |
| ∟ Chat-Einstellungen | Pricing-Modell wählen (Free/Unlock/Pro-Nachricht), Preise setzen, Auto-Begrüßung |
| ∟ Earnings/Payouts | Einnahmen-Details (Unlocks + Abos + Chat), Auszahlungs-Requests, Transaktionshistorie |
| ∟ Tipping/Gifts | Erhaltene Tips einsehen, Gift-Übersicht, Top-Tipper |
| ∟ Custom Requests | Eingehende Requests verwalten, Accept/Reject, Delivery hochladen, Escrow-Status |
| ∟ Promo Codes | Promo-Codes erstellen (%-Rabatt oder fixe Coins), Gültigkeit/Limits setzen, Nutzungs-Stats |
| ∟ Mass-Messaging | Nachricht an alle Follower/Subscriber senden (Segmente möglich) |
| ∟ Referral (Creator) | Creator-Referral-Code, geworbene Creator sehen, Provisions-Übersicht |
| ∟ Analytics | Content-Performance, Engagement-Raten, Umsatz pro Content, Abo-Metriken (MRR, Churn), Peak-Zeiten, Funnel-Tracking, Tip-Einnahmen |

### 4.3 ACP - Admin Control Panel (Next.js + shadcn/ui)

| Modul | Beschreibung |
|-------|--------------|
| Content-Review Queue | pending -> approved/rejected, Massenaktionen, Filter |
| User/Creator-Verwaltung | Rollen, Sperren, Shadowban, Limits, Agency-Zugehörigkeit |
| Agency-Verwaltung | Agencies anlegen/sperren, externe Creator zu Agencies zuweisen, Agency-Umsätze einsehen, Moderator-Übersicht pro Agency |
| Pricing/Policy | Min/Max-Preise, Kategorien-Whitelist, Wortfilter, Chat-Preisgrenzen (Min/Max Coins pro Nachricht) |
| Platform-Settings | Moderator-Provision % pro Vergütungstyp, Chat-Mindestpreise, Payout-Minimum (50 EUR), Coin-Pack-Konfiguration (5/15/30/75 EUR), Tip-Min/Max, PPV-Min/Max, Referral-Bonus, Media-Set-Max, Rate Limits |
| Gift-Item-Verwaltung | Gift-Items erstellen/bearbeiten (Name, Icon, Animation, Preis), aktivieren/deaktivieren, Sortierung |
| DMCA Review Queue | DMCA-Reports prüfen, Content takedown, Reject mit Begründung |
| Referral-Konfiguration | Referral-Bonus-Coins (User), Creator-Provision %, Laufzeit, Limits |
| Payments & Payouts | Coin-Packs, Umsatzübersicht, Auszahlungen (ab 50 EUR), Disputes |
| Risk & Trust | Meldungen, IP/Device-Signale, Audit-Logs |
| Reports | Umsätze (inkl. Abo-MRR, Tips, PPV, Custom Requests), Tax/VAT, Unlock-Rate, ARPPU, DAU/MAU, Agency-Performance, Referral-Stats, Funnel-Tracking (CSV Export) |
| Refund-Management | Manuelle Transaktionserstattung (Sonderfälle, technische Fehler), Erstattungs-Log |
| **Orchestrator-Dashboard** | Szenarien-Builder, Broadcast-Composer, Segment-Builder, Metriken |

### 4.4 Moderator & Agency App (Next.js + shadcn/ui)

**Moderator-Bereich:**

| Feature | Beschreibung |
|---------|--------------|
| 3-Spalten-Board | Links: Queue (Priorität), Mitte: aktiver Chat (SignalR), Rechts: Profil/Historie |
| Creator-Impersonation | Moderator chattet im Namen des zugewiesenen Creators - User sieht Creator-Avatar/Name, nicht den Moderator |
| Creator-Wechsel | Schneller Wechsel zwischen zugewiesenen Creator-Profilen (Dropdown/Tabs) |
| Batch-Workflows | Hotkeys "Nächster Dialog", Tab-Navigation, Quick-Templates |
| Snippets & Medien | Schnellantworten, zuletzt verwendete Medien, Preis-Buttons (Upsell) |
| Live-KPIs | Nachrichten, Antwortzeit, Dialoge/h, Unlocks, Umsatz (SignalR) |
| Tages-/Wochen-Reports | Attribution, Provisions-Abrechnung, Team-Leaderboard |

**Agency-Dashboard (nur für Agency-Rolle sichtbar):**

| Feature | Beschreibung |
|---------|--------------|
| Creator-Verwaltung | Eigene Creator-Profile erstellen, bearbeiten, Content hochladen, Preise/Abo-Stufen setzen - volle Kontrolle über eigene Creator |
| Moderator-Management | Moderatoren einladen, deaktivieren, Rollen/Rechte setzen |
| Creator-Zuweisungen | Moderatoren zu Creator-Profilen zuweisen/entfernen, Kapazitätsplanung |
| Agency-KPIs | Aggregierte Metriken aller eigenen Moderatoren: Nachrichten, Unlocks, Abo-Conversions, Umsatz (SignalR Live) |
| Umsatz-Übersicht | Einnahmen pro Creator, pro Moderator, Zeiträume (Tag/Woche/Monat), Export |
| Team-Leaderboard | Ranking der Moderatoren nach Performance-Metriken |

---

## 5. Datenmodell (PostgreSQL)

### 5.1 Core Tables

```
users (id, email, password_hash, role, is_verified18, identity_status[none/pending/approved/rejected], status, created_at)
identity_verifications (id, user_id FK, document_url, submitted_at, reviewed_by FK nullable, reviewed_at, status[pending/approved/rejected], rejection_reason nullable)
profiles (user_id FK, username, age, country, badges[], offers_custom, bio, avatar_url)
content (id, owner_id FK, type[image/video/audio/text], title, cover_url, blur_preview_url, price_coins, visibility[public/followers_only/paid], comment_mode[all/followers/disabled], status[draft/pending/approved/rejected], created_at)
bundles (id, owner_id FK, title, content_ids[], price_coins)
feed_events (id, type[story/upload/online/visit], actor_id, target_id, content_id, created_at)
messages (id, thread_id FK, sender_id FK, receiver_id FK, body, media_id, sent_by_moderator_id FK nullable, created_at)
  -- sent_by_moderator_id: wenn Moderator im Namen eines Creators schreibt, wird hier der echte Absender gespeichert
threads (id, user_a FK, user_b FK, last_activity_at, assigned_moderator_id FK nullable)
purchases (id, buyer_id FK, content_id, price_coins, attributed_to_moderator_id FK, created_at)
coin_wallets (user_id FK, balance, updated_at)
coin_tx (id, user_id FK, type[topup/purchase/unlock/subscription/tip/gift/ppv_unlock/escrow_hold/escrow_release/escrow_refund/refund/referral_bonus/payout/promo_discount], amount, gateway_ref, created_at)
moderator_stats_daily (moderator_id FK, date, msgs_sent, dialogs_handled, unlocks, revenue_attributed, provision_earned)
reports (id, reporter_id FK, target_type, target_id, category, description, status, created_at)
audit_logs (id, actor_id FK, action, entity_type, entity_id, meta_json, created_at)

-- Social Features
likes (id, user_id FK, likeable_type[content/comment], likeable_id, created_at)
comments (id, user_id FK, content_id FK, parent_id FK nullable, body, is_pinned, created_at, deleted_at)
follows (id, follower_id FK, following_id FK, created_at)
shares (id, user_id FK, content_id FK, created_at)

-- Discovery & Tags
tags (id, name, slug, usage_count, created_at)
content_tags (content_id FK, tag_id FK)
trending_snapshots (id, entity_type[content/tag/creator], entity_id, score, period[daily/weekly], snapshot_date)

-- Notifications
notifications (id, user_id FK, type[like/comment/follow/unlock/message/content_approved/new_content/new_subscriber/subscription_renewed/subscription_cancelled/subscription_renewal_failed/subscription_expiring_soon/tip_received/gift_received/ppv_unlocked/custom_request_status_changed/referral_bonus_received/dmca_status_changed/scheduled_content_published], actor_id FK, entity_type, entity_id, read_at, created_at)

-- Favorites
favorites (id, user_id FK, content_id FK, created_at)

-- Creator Chat-Pricing
creator_chat_settings (creator_id FK, pricing_model[free/unlock/per_message], unlock_price_coins, per_message_price_coins, first_message_free, auto_greeting_text, updated_at)

-- Subscription / Abo-System
subscription_tiers (id, creator_id FK, name, description, price_coins nullable, price_eur nullable, payment_mode[coins/eur/both], perks_json, sort_order, is_active, created_at)
  -- perks_json: { "all_paid_content": true, "chat_free": true, "exclusive_badge": true, "custom_perks": ["..."] }
subscriptions (id, user_id FK, tier_id FK, creator_id FK, status[active/paused/cancelled/expired], payment_mode[coins/eur], current_period_start, current_period_end, cancelled_at, created_at)
subscription_tx (id, subscription_id FK, user_id FK, amount_coins nullable, amount_eur nullable, period_start, period_end, payment_ref, status[success/failed/pending], created_at)

-- Agency-System
agencies (id, name, owner_user_id FK, status[active/suspended], created_at)
agency_creators (id, agency_id FK, creator_user_id FK, is_agency_created boolean, assigned_by[agency/admin], assigned_at)
  -- is_agency_created: true = Agency hat Creator-Profil erstellt, false = Admin hat externen Creator zugewiesen
agency_moderators (id, agency_id FK, moderator_user_id FK, status[active/inactive], invited_at, joined_at)
moderator_creator_assignments (id, moderator_user_id FK, creator_user_id FK, agency_id FK nullable, assigned_at, is_active)
  -- Welcher Moderator darf im Namen welches Creators auftreten

-- Admin Platform Settings (ACP-konfigurierbar)
platform_settings (key, value_json, updated_by FK, updated_at)
  -- Beispiel-Keys: mod_provision_unlock_pct, mod_provision_chat_pct,
  --   chat_min_unlock_price, chat_min_per_msg_price, chat_max_per_msg_price,
  --   payout_min_amount_eur (default: 50), coin_packs_config_json,
  --   tip_min_coins, tip_max_coins, ppv_min_price, ppv_max_price,
  --   referral_bonus_coins, referral_creator_provision_pct, media_set_max_items,
  --   platform_fee_unlock_pct, platform_fee_tip_pct, platform_fee_subscription_pct,
  --   platform_fee_ppv_pct, platform_fee_custom_request_pct,
  --   mass_message_rate_limit_per_hour, account_lockout_max_attempts (default: 5)

-- Moderator-Vergütung (Provision)
moderator_provisions (id, moderator_id FK, type[unlock/chat/subscription/other], amount_coins, percentage_applied, source_tx_id FK, created_at)

-- User-Blocking
blocked_users (id, blocker_id FK, blocked_id FK, created_at)
  -- Blockierte User können kein Profil sehen, nicht chatten, nicht folgen

-- 2FA (Two-Factor Authentication)
two_factor_auth (user_id FK, is_enabled, secret_encrypted, backup_codes_json, enabled_at, updated_at)

-- Tipping / Gifts
tips (id, sender_id FK, receiver_id FK, amount_coins, gift_item_id FK nullable, message nullable, created_at)
gift_items (id, name, icon_url, animation_url nullable, price_coins, is_active, sort_order, created_at)
  -- Admin erstellt/verwaltet Gift-Items im ACP

-- PPV Messages (Pay-Per-View)
ppv_messages (id, message_id FK, price_coins, preview_text nullable, is_unlocked_by_default boolean, created_at)
ppv_unlocks (id, ppv_message_id FK, user_id FK, price_coins_paid, created_at)

-- Custom Requests
custom_requests (id, requester_id FK, creator_id FK, description, price_coins, status[pending/accepted/in_progress/delivered/completed/cancelled/disputed], escrow_tx_id FK nullable, accepted_at, delivered_at, completed_at, cancelled_at, created_at)
  -- Escrow: Coins werden bei Accept vom Requester abgebucht und gehalten
  -- Bei Delivery + Confirm: Coins an Creator ausgezahlt
  -- Bei Cancel/Dispute: Coins zurück an Requester (Admin-Entscheidung bei Dispute)

-- Referral System
referral_codes (id, user_id FK, code, type[user/creator], uses_count, created_at)
referral_redemptions (id, code_id FK, referred_user_id FK, bonus_coins_referrer, bonus_coins_referred, provision_pct nullable, redeemed_at)
  -- type=user: Bonus-Coins für beide Seiten
  -- type=creator: Provision auf Einnahmen des geworbenen Creators (zeitlich begrenzt)

-- DMCA Takedown
dmca_reports (id, reporter_id FK, content_id FK, original_url nullable, description, evidence_urls[], status[pending/reviewing/taken_down/rejected], reviewed_by FK nullable, reviewed_at, created_at)

-- Content Scheduling
scheduled_content (id, content_id FK, scheduled_at, published_at nullable, status[scheduled/published/cancelled], created_at)

-- Media-Sets (Multi-Media Content)
content_media (id, content_id FK, media_url, media_type[image/video/audio], sort_order, created_at)
  -- Ein Content kann 1-N Medien haben (Media-Set/Gallery)
  -- max. Anzahl Admin-konfigurierbar via platform_settings

-- Content Drafts
content_drafts (id, owner_id FK, draft_data_json, updated_at, created_at)

-- Promo Codes
promo_codes (id, creator_id FK, code, discount_type[percentage/fixed_coins], discount_value, applicable_to[content/subscription/all], max_uses nullable, uses_count, valid_from, valid_until nullable, is_active, created_at)
promo_redemptions (id, promo_code_id FK, user_id FK, discount_applied, entity_type, entity_id, redeemed_at)
```

### 5.2 Orchestrator Tables (Erweiterung)

```
scenarios (id, name, status[active/draft], description, created_by FK)
scenario_steps (id, scenario_id FK, day_offset, time_offset_min, action_type[visit/message/follow/like], sender_profile_id FK, template_id FK, targeting_query_json, rate_limit_cfg_json)
scenario_enrollments (id, scenario_id FK, user_id FK, started_at, status[active/paused/completed/optout])
scenario_executions (id, step_id FK, user_id FK, scheduled_at, executed_at, result[success/fail/skipped], meta_json)
message_templates (id, name, body_text, variables[], ab_group)
broadcasts (id, name, sender_profile_id FK, targeting_query_json, schedule_at, status)
broadcast_executions (id, broadcast_id FK, user_id FK, executed_at, result, variant)
```

---

## 6. Phasenplan

### Phase 0: Projekt-Setup (Woche 1)

| # | Aufgabe | Beschreibung |
|---|---------|--------------|
| 0.1 | Turborepo initialisieren | Monorepo-Struktur, turbo.json, package.json Workspaces |
| 0.2 | .NET Solution anlegen | `Fexora.Api`, `Fexora.Core`, `Fexora.Infrastructure` Projekte |
| 0.3 | Next.js Apps scaffolden | `web`, `acp`, `moderator` mit shadcn/ui + Tailwind |
| 0.4 | Shared Packages anlegen | `api-client`, `shared`, `chat-sdk`, `config` |
| 0.5 | Docker Compose | PostgreSQL, Redis, MinIO (S3-kompatibel) lokal |
| 0.6 | CI/CD Pipeline | GitHub Actions: Build, Lint, Test pro App |
| 0.7 | Design Tokens | Fexora Farbwelt (Mocha Mousse, Butter Yellow, Digital Lavender, Cherry Red) in shadcn/ui Theme |
| 0.9 | shadcn/ui Theme | Custom Theme passend zu Fexora Farbwelt |
| 0.10 | i18n Setup | next-intl für alle Web-Apps (web/acp/moderator), DE + EN Translations-Struktur in `packages/shared/locales/` |
| 0.11 | Monitoring Setup | Sentry SDK (API + alle Frontends), Serilog → JSON, OpenTelemetry Basis-Config, Health-Check-Endpoints |
| 0.12 | DB-Index-Strategie | Alle kritischen Indizes (siehe 11.30) in initialer EF Core Migration anlegen |

---

### Phase 1: Foundation / Core MVP (Wochen 2-8)

**Sprint 1 (Woche 2-3): Auth, Profile, Upload**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 1.1 | Auth-System + 2FA | API | ASP.NET Identity, JWT+Refresh, RBAC (6 Rollen), TOTP-basierte 2FA (optional), Backup-Codes |
| 1.2 | User-Registration & Login | Web | E-Mail/Passwort, 18+ Checkbox, Consent, Ausweis-Upload für Creator/Mod-Bewerbung, 2FA-Setup in Account-Settings |
| 1.3 | Profil-CRUD | API | Erstellen, bearbeiten, Avatar-Upload (S3) |
| 1.4 | Profilseite | Web | Badges, Bio, Grid-Ansicht, Follow-Button, Follower/Following-Listen, Block-Button |
| 1.5 | Follow-System + Blocking | API | Follow/Unfollow, Follower-Count, Following-Liste, User-Blocking (Profil/Chat/Follow unsichtbar), Blockliste |
| 1.6 | Content-Upload + Media-Sets | API | Multi-Typ Upload (Bild/Video/Audio/Text), R2 Storage, Tags/Hashtags, Visibility (public/followers_only/paid), Comment-Mode (all/followers/disabled), Media-Sets (1-N Medien pro Content), Drafts |
| 1.7 | Content-Upload UI | Web | Upload-Form, Blur/Vorschau setzen, Preis setzen, Tags vergeben, Sichtbarkeit, Kommentar-Modus, Media-Set/Gallery Upload, Draft speichern |
| 1.8 | Likes & Kommentare | API | Like/Unlike auf Content + Kommentare, verschachtelte Kommentare, Creator-Moderation |
| 1.9 | Likes & Kommentare UI | Web | Like-Button, Kommentar-Sektion, Antworten, Like-Count |
| 1.10 | Admin Review-Queue (Basis) | ACP | Pending Content anzeigen, Approve/Reject mit Kommentar |
| 1.11 | Content-Lebenszyklus | API | draft -> pending -> approved/rejected Status-Maschine |
| 1.12 | EF Core Migrations | API | Datenmodell (Core + Social Tables) anlegen |
| 1.13 | API Client generieren | Packages | NSwag -> TypeScript Client + React Query Hooks |
| 1.14 | DMCA-System (Basis) | API + ACP | DMCA-Report-Formular (Web), Report-Tabelle, Admin Review-Queue im ACP, Content Takedown |
| 1.15 | Account Recovery | API + Web | Passwort-Reset via E-Mail (IEmailService/Resend), Account-Wiederherstellung |

**Sprint 2 (Woche 4-5): Feed, Chat, Unlocks**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 2.1 | Story-Leiste | API + Web | Neue Inhalte aller User, horizontal scrollbar |
| 2.2 | Home Feed | API + Web | Gemischter Feed mit Like/Kommentar/Share inline, Kontakte, Online, Empfehlungen |
| 2.3 | Explore/Discover | API + Web | Trending Content, Kategorien (Bilder/Clips/Stories/Hörspiele), Tag-Navigation, Creator-Empfehlungen |
| 2.4 | Suche & Tags | API + Web | Volltextsuche (Profile, Content, Tags), Filter, Tag-Detail-Seiten |
| 2.5 | Trending-Engine | API | Score-Berechnung (Likes, Views, Unlocks, Zeitfaktor), stündliche Snapshot-Berechnung via Hangfire, Materialized Views für Daily/Weekly Rankings |
| 2.6 | Benachrichtigungen | API + Web | Notification-Center, SignalR Push, Likes/Kommentare/Follows/Unlocks |
| 2.7 | Content-Detail + Unlock | API + Web | Teaser, Preis, Unlock, Kommentare, Likes, Teilen, Tags, Ähnliche Inhalte |
| 2.8 | Favoriten & Kaufhistorie | API + Web | Merkliste, "Meine Unlocks", Favoriten-Übersicht |
| 2.9 | Shares/Reposts | API + Web | Content teilen, Share-Count, geteilte Inhalte im Feed |
| 2.10 | Coin-Wallet | API | Balance, Transaktionshistorie, Topup-Endpunkt |
| 2.11 | Payment-Integration | API | `IPaymentService` Interface + erste Provider-Impl., Coin-Packs (5/15/30/75 EUR), Webhook-Handling |
| 2.12 | Wallet UI | Web | Coins kaufen, Balance anzeigen, Historie |
| 2.13 | Chat (SignalR) + Chat-Pricing + PPV | API | 1:1 Messaging, Online-Status, Read Receipts, Typing, Creator Chat-Settings (Free/Unlock/Pro-Nachricht), PPV-Messages (Creator setzt Preis, User unlockt) |
| 2.14 | Chat UI + Tipping | Web | Nachrichten-Thread, Emojis, Dateianhänge, Chat-Pricing-Anzeige, PPV-Message-Unlock, Tipping-Button (freier Betrag + Gift-Items mit Animation) |
| 2.15 | Chat-SDK Package | Packages | SignalR Client Wrapper, React Hooks, Chat-Pricing-Logik |
| 2.16 | Creator-Dashboard (Basis) | Web | Einnahmen-Übersicht, Content-Manager (inkl. Scheduling, Pinned Posts, Drafts), Chat-Einstellungen, Fan-Übersicht |
| 2.19 | Tipping/Gifts (API) | API | Freier Coin-Betrag senden, Gift-Items (Admin-konfigurierbar), Tip-Transaktionen, Tip-Notifications |
| 2.20 | Content Scheduling | API + Web | Content zeitgesteuert veröffentlichen, Kalender-Ansicht im Creator-Dashboard, Hangfire Job |
| 2.21 | Custom Requests + Escrow | API + Web | Request-Formular, Accept/Reject, Escrow (Coins halten bis Delivery), Delivery + Confirm, Dispute → Admin |
| 2.22 | Referral-System | API + Web | User-Referral-Code generieren, Einladungs-Link teilen, Bonus-Coins bei Registrierung, Creator-Referral (%-Provision), Stats-Seite |
| 2.23 | Promo Codes | API + Web | Creator erstellt Codes (%-Rabatt oder fixe Coins), Einlösung bei Unlock/Abo, Limits/Gültigkeit, Stats |
| 2.24 | Mass-Messaging | API + Web | Creator sendet Nachricht an Follower/Subscriber-Segmente, Hangfire Batch-Versand, Rate Limit: max. 1 Mass-Message pro Creator pro Stunde |
| 2.25 | Bundles & Collections | API + Web | Content zu Paketen bündeln, Bundle-Preis setzen, Bundle-Ansicht auf Creator-Profil |
| 2.26 | DSGVO Datenexport (Basis) | API + Web | `GET /me/export` → async Hangfire Job → ZIP (Profil, Content-Metadaten, Chat-Nachrichten, Käufe, Abos) → Download-Link per E-Mail |
| 2.17 | Abo-System (API) | API | Subscription-Tiers CRUD, Subscribe/Cancel-Logik, Coin- oder EUR-Zahlung, Recurring-Job (Hangfire) für monatliche Verlängerung, Content-Zugangs-Prüfung (Abo vs. Einzelkauf) |
| 2.18 | Abo-System (UI) | Web | Abo-Stufen auf Creator-Profil anzeigen, Abonnieren-Flow (Coins/EUR), "Meine Abos" Seite, Creator: Abo-Stufen-Builder (Name, Preis, Perks) |

---

### Phase 2: Admin + Moderation + Agency (Wochen 6-9)

**Sprint 3 (Woche 6-7): ACP komplett + Moderations-Board**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 3.1 | User/Creator-Verwaltung | ACP | Rollen, Sperren, Shadowban, Limits, Suche |
| 3.2 | Pricing/Policy | ACP | Min/Max-Preise, Kategorien-Whitelist, Wortfilter |
| 3.3 | Payments & Payouts | ACP + API | Coin-Packs Übersicht, Auszahlungsberichte, Disputes |
| 3.4 | Risk & Trust | ACP + API | Meldungen-Queue, IP/Device-Signale, Audit-Logs |
| 3.5 | Reports Dashboard | ACP | Umsätze, Unlock-Rate, ARPPU, DAU/MAU, CSV Export |
| 3.6 | Moderator 3-Spalten-Board | Moderator | Queue (Priorität), aktiver Chat (SignalR), Profil-Sidebar |
| 3.7 | Creator-Impersonation | API + Moderator | Moderator chattet/postet im Namen zugewiesener Creator, Creator-Wechsel-UI, `sent_by_moderator_id` Tracking |
| 3.8 | Snippets & Quick-Actions | Moderator | Text-Vorlagen, Medien-Bibliothek, Preis-Buttons |
| 3.9 | Hotkeys & Navigation | Moderator | "Nächster Dialog", Tab-Wechsel, Keyboard Shortcuts |
| 3.10 | Agency-System (API) | API | Agency CRUD, Creator-Erstellung durch Agency, Moderator-Management, Creator-Zuweisungen, Admin kann externe Creator zu Agency zuweisen |
| 3.11 | Agency-Dashboard | Moderator-App | Creator-Verwaltung, Moderator-Management, Zuweisungen, KPIs, Umsatz-Übersicht, Team-Leaderboard (nur für Agency-Rolle sichtbar) |
| 3.12 | Agency-Verwaltung (Admin) | ACP | Agencies anlegen/sperren, externe Creator zuweisen, Agency-Umsätze, Moderator-Übersicht |

**Sprint 4 (Woche 8-9): KPIs, Attribution, Agency, Polishing**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 4.1 | Attributionslogik | API | Unlock innerhalb 30 Min nach Mod-Interaktion -> Zuordnung |
| 4.2 | Live-KPIs (SignalR) | Moderator + API | Nachrichten, Antwortzeit, Dialoge/h, Unlocks, Umsatz |
| 4.3 | Tages-/Wochen-Reports | Moderator + ACP | Provisions-Abrechnung, Team-Leaderboard |
| 4.4 | Vergütungs-Engine | API | Nur Provision: Admin-konfigurierbare % pro Vergütungstyp (Unlocks, Chat-Umsatz, Abo-Umsatz, etc.) im ACP einstellbar |
| 4.5 | Melden/Eskalieren | Web + API | User meldet Inhalt/Chat, Admin prüft |
| 4.6 | DSGVO-Vertiefung | API | Consent-Flags erweitern, Cookie-Banner, Retention-Policies automatisieren, DPA-Dokumentation |
| 4.7 | Watermarking (Light) | API | Dynamische Wasserzeichen auf Medien |
| 4.8 | QA & Bugfixing | Alle | End-to-End Testing, Performance |

---

### Phase 3: Engagement-Orchestrator (Wochen 9-12)

**Sprint 5 (Woche 9-10): Engine + Szenarien**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 5.1 | Orchestrator Background Service | API | .NET Hosted Service + Hangfire Scheduler |
| 5.2 | Szenario-Engine | API | Rule-Engine (JSON-DSL), Sequenzen, Trigger, Targeting |
| 5.3 | Execution Workers | API | Idempotente Worker für visit/message/follow/like |
| 5.4 | Rate Limits & Quiet Hours | API | Max N Aktionen/Tag/User, globaler Limiter, 23-8 Uhr Pause |
| 5.5 | Template-System | API | Variablenersetzung ({{username}}, {{creator_name}}) |
| 5.6 | Targeting-Engine | API | SQL-basierte Segmente, Query-Builder DSL |
| 5.7 | Compliance | API | Opt-Out respektieren, Blacklist, DSGVO-Consent-Flags |

**Sprint 6 (Woche 11-12): Broadcasts + Admin-UI**

| # | Aufgabe | App | Aufwand |
|---|---------|-----|---------|
| 6.1 | Broadcast-System | API | Zielgruppen-Builder, Batch-Versand, Throttling |
| 6.2 | A/B-Testing | API | Bis 3 Varianten, Auto-Winner nach Metrik |
| 6.3 | Szenario-Builder UI | ACP | Visueller Timeline-Builder, Step-Karten |
| 6.4 | Segment-Builder UI | ACP | Filter-Dropdowns + Bedingungen + Vorschau |
| 6.5 | Broadcast-Composer UI | ACP | Nachricht + Sender + Zeitplanung + A/B |
| 6.6 | Orchestrator-Dashboard | ACP | Laufende Szenarien, KPIs, Fehler/Retry-Queue |
| 6.7 | Attribution-Anbindung | API + ACP | Unlock-Fenster, Umsatzzuordnung pro Szenario/Step |
| 6.8 | Load-Tests & Hardening | Alle | Worker-Queues, Backpressure, Stress-Tests |

---

### Phase 4: Erweiterungen (ab Woche 13+)

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Web Push Notifications | **Phase 2a** | Browser-Push für neue Nachrichten, Unlocks via Service Worker — kritisch für User-Engagement |
| Social Login | **Phase 2a** | Google, Apple Sign-In — senkt Registrierungshürde, ~25h Aufwand |
| Voice Messages | Mittel | Audio-Nachrichten im Chat (Badge-abhängig), FFmpeg-Integration |
| Dark Mode | Mittel | Elegante dunkle Farbwelt, Tailwind v4 Theming |
| **Agency Workflow Tools** | Mittel | Schichtplanung für Moderatoren, Per-Creator Templates, Performance-Targets, automatische Warnungen |
| Visueller Flow-Editor | Mittel | Drag-&-Drop Szenario-Builder (Orchestrator), React Flow |
| Multi-Kanal (E-Mail/Push) | Niedrig | Orchestrator-Erweiterung für E-Mail-Kampagnen |
| Cohort-Analyse | Niedrig | User-Kohorten, Retention-Analyse, LTV-Berechnung im ACP |
| **Livestreaming** | Mittel | Echtzeit-Streaming für Creator (WebRTC/HLS), Chat-Integration, Coin-Tipping live |
| **Creator Collaborations** | Niedrig | Zwei Creator gemeinsames Content-Upload, automatischer Revenue-Split |
| **AI Content Moderation** | Bedarfsabhängig | ML-basierte CSAM/Spam-Erkennung, automatisches Flagging für Review-Queue |
| AVS-Integration | Bedarfsabhängig | IDnow/finAPI für regulatorische Anforderungen |
| KI-Empfehlungen | Niedrig | Smart Feed, Content-Empfehlungen basierend auf User-Verhalten |
| Mobile App (Expo) | Niedrig | Optional: Native iOS/Android — realistisch frühestens 2027, Fokus auf responsive PWA |

---

## 7. Aufwandsschätzung

### Gesamt-Übersicht

| Bereich | Stunden (Range) |
|---------|----------------|
| **Phase 0: Setup** (inkl. Monitoring, DB-Indizes) | 50-70 |
| **Phase 1: Core MVP** (Auth + 2FA, Blocking, DMCA, Profile, Social, Feed, Discovery, Chat + Pricing + PPV, Tipping/Gifts, Coin-Wallet, Subscriptions, Bundles, Media-Sets, Scheduling, Custom Requests + Escrow, Referrals, Promo Codes, DSGVO-Export, Creator-Dashboard, i18n DE+EN) | 640-820 |
| **Phase 2: Admin + Moderation + Agency** | 360-500 |
| **Phase 3: Engagement-Orchestrator + Phase 2a** (inkl. Web Push, Social Login) | 480-700 |
| **QA / Hardening / Load-Tests** | 100-140 |
| **DevOps / CI/CD** | 40-60 |
| **Gesamt MVP (Phase 0-2)** | **1.190-1.590 Std.** |
| **Gesamt inkl. Orchestrator + Phase 2a (Phase 0-3)** | **1.670-2.330 Std.** |

### Pro App

| App | Stunden (Range) | Beschreibung |
|-----|----------------|--------------|
| API (.NET) | 720-950 | Auth + 2FA, RBAC, Content + Media-Sets + Scheduling + Bundles, Social, Discovery, Chat + Pricing + PPV, Tipping/Gifts, Custom Requests + Escrow, Wallet, Subscriptions, Referrals, Promo Codes, DMCA, Blocking-Enforcement, DSGVO-Export, Agency-System, Impersonation + Sicherheit, Attribution, Orchestrator |
| User-Web (Next.js) | 280-370 | Feed, Explore/Discover, Profile, Social, Content, Chat + PPV + Tipping/Gifts, Wallet, Subscriptions, Custom Requests, Referral, DMCA, Bundles, DSGVO-Export, Creator-Dashboard (Scheduling, Promo Codes, Mass-Messaging, Abo-Verwaltung), Notifications, Web Push, Social Login |
| ACP (Next.js) | 180-250 | Review, User-Mgmt, Agency-Verwaltung, Gift-Items, DMCA-Queue, Payments, Refund-Mgmt, Platform-Settings, Referral-Config, Reports, Orchestrator-UI |
| Moderator & Agency (Next.js) | 200-290 | 3-Spalten-Board, Creator-Impersonation, KPIs, Snippets + Agency-Dashboard (Creator-/Mod-Verwaltung, Zuweisungen, Team-KPIs) |
| Packages (Shared) | 50-70 | API Client, Chat-SDK, Shared Types + Validators |

### Kalenderzeit

| Team-Größe | Phase 0-2 (MVP) | Phase 0-3 (inkl. Orchestrator) |
|------------|-----------------|-------------------------------|
| 1 Entwickler | 8-10 Monate | 11-15 Monate |
| 2 Entwickler | 13-17 Wochen | 19-24 Wochen |
| 3 Entwickler | 9-12 Wochen | 14-18 Wochen |

---

## 8. Sprint-Plan (2 Entwickler, 22 Wochen bis MVP + Orchestrator)

```
Woche 1     Setup & Foundation
             - Turborepo, .NET Solution, Next.js Apps (web, acp, moderator), Docker, CI/CD
             - Design Tokens, shadcn/ui Theme
             - i18n Setup (next-intl, DE + EN), IPaymentService + IEmailService Interfaces
             - Sentry SDK + OpenTelemetry Basis-Setup, Health-Check-Endpoints
             - DB-Index-Strategie (alle Indizes aus 11.30 in initialer Migration)

Woche 2-3   Auth, Profiles, Security & Social Basics
             - Dev A: API (Auth 6 Rollen + 2FA/TOTP + Passwort-Reset, Profile, Follow-System + Blocking-Enforcement, Likes, Kommentare, DMCA-Basis)
             - Dev B: Web (Login + 2FA-Setup, Profil + Block-Button + Blockliste, Follow-Button, Like/Kommentar UI, DMCA-Formular, Passwort-Reset) + ACP (Review-Queue Basis)

Woche 4-5   Content-Upload, Feed & Discovery
             - Dev A: API (Content-Upload + Media-Sets + Drafts, R2 Storage, Tags/Hashtags, Visibility/Comment-Mode, Feed-Algorithmus, Explore/Trending-Engine stündlich)
             - Dev B: Web (Upload UI inkl. Media-Sets/Visibility/Comment-Mode/Drafts, Feed mit Social-Actions, Explore-Seite, Trending, Suche, Tag-Navigation)

Woche 6-7   Chat, Wallet & Notifications
             - Dev A: API (SignalR Chat Hub, Chat-Pricing 3 Modelle, IPaymentService + Provider, Coin-Wallet, Benachrichtigungen inkl. neue Types)
             - Dev B: Web (Chat UI mit Pricing-Info, Wallet + Coin-Packs, Favoriten, Kaufhistorie, Notification-Center, Chat-SDK Package)

Woche 8     Tipping, PPV & Gifts
             - Dev A: API (Tipping freier Betrag + Gift-Items, PPV-Messages Erstellen/Unlock, Gift-Item CRUD für ACP)
             - Dev B: Web (Tipping-Button + Gift-Auswahl + Animationen im Chat, PPV-Unlock UI, Gift-Items ACP-Verwaltung)

Woche 9-10  Subscriptions, Scheduling & Creator-Dashboard
             - Dev A: API (Abo-System: Tiers, Subscribe/Cancel, Recurring-Job + Grace Period, Content-Scheduling + Hangfire, Pinned Posts, Bundles)
             - Dev B: Web (Creator-Dashboard: Abo-Stufen-Builder, Scheduling-Kalender, Pinned Posts, Draft-Manager, Bundle-Builder, Abo-UI auf Profil)

Woche 11-12 Custom Requests, Referrals, Promo Codes & DSGVO
             - Dev A: API (Custom Requests + Escrow-Lifecycle, Referral-System User+Creator, Promo Codes + Validierung, Mass-Messaging + Rate Limit)
             - Dev B: Web (Custom Request Formular + Status + Dispute, Referral-Seite + Einladungslink, Promo Code Eingabe/Erstellen, DSGVO-Export Basis)
             - Start Load-Tests auf bisherige API-Endpoints (k6)

Woche 13-14 Admin + Moderations-Board + Agency
             - Dev A: API (Attribution 30min + Edge Cases, Provision-Engine, Agency-System: CRUD, Creator-Erstellung, Zuweisungen, Impersonation + Sicherheit)
             - Dev B: ACP (User-Mgmt, Agency-Verwaltung, Gift-Items, DMCA-Queue, Payments, Refund-Mgmt, Platform-Settings, Referral-Config, Reports) + Moderator (3-Spalten-Board, Creator-Impersonation-UI)

Woche 15-16 Agency-Dashboard, KPIs & Polish
             - Dev A: API (Live-KPIs SignalR, Risk-Endpoints, Audit-Logs, Anomalie-Erkennung Impersonation), Watermarking (Steganographie)
             - Dev B: Moderator-App (Agency-Dashboard: Creator-/Mod-Verwaltung, KPIs, Leaderboard, Snippets, Hotkeys), Melden/Eskalieren
             - Beide: QA, E2E-Tests (Playwright), Load-Tests Chat/Feed/Wallet, Bugfixing

         >>> MVP GO-LIVE <<<

Woche 17-18 Orchestrator Engine
             - Dev A: Szenario-Engine, Workers, Rate Limits, Templates (Handlebars), Targeting
             - Dev B: Compliance (Opt-Out, Blacklist, DSGVO-Consent), A/B-Testing

Woche 19-22 Orchestrator UI, Broadcasts & Phase 2a
             - Dev A: Broadcast-System, Attribution-Anbindung, Load-Tests Orchestrator
             - Dev B: ACP (Szenario-Builder, Segment-Builder, Broadcast-Composer, Dashboard)
             - Woche 21-22: Web Push Notifications (Service Worker) + Social Login (Google/Apple)

         >>> ORCHESTRATOR + PHASE 2a LIVE <<<
```

---

## 9. Infrastruktur & Kosten

### Serverkosten (Hetzner Cloud)

| Phase | Aktive User | Kosten/Monat |
|-------|------------|--------------|
| MVP Start | < 100 | 80-150 EUR |
| Wachstum | ~1.000 | 250-400 EUR |
| Skalierung | ~10.000 | 1.200-1.800 EUR |
| Groß | ~100.000 | 8.000-12.000 EUR |

### Infrastruktur (MVP)

| Service | Provider | Kosten/Monat |
|---------|----------|--------------|
| .NET API Hosting | Hetzner Cloud CX21 (2 vCPU, 4 GB RAM) | 6-12 EUR |
| PostgreSQL | Hetzner Managed DB | 30-50 EUR |
| Redis | Hetzner Cloud (klein) | 5-10 EUR |
| Object Storage | Cloudflare R2 (0 EUR Egress) | 5-15 EUR |
| CDN | BunnyCDN | 5-10 EUR |
| Monitoring | Sentry (Free Tier) + Grafana Cloud (Free) | 0 EUR |

**Kostenvorteil:** Hetzner + Cloudflare R2 + BunnyCDN spart gegenüber AWS ~50-70% bei vergleichbarer Leistung. Besonders relevant: R2 hat keine Egress-Kosten.

---

## 10. Docker-Deployment

### 10.1 Container-Übersicht

Alle Services laufen als Docker-Container. Ein einzelner `docker compose up` startet die gesamte Plattform.

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)                 │
│              :80 / :443 (SSL Termination)               │
├──────────┬──────────┬──────────┬────────────────────────┤
│  web     │  acp     │moderator │      api               │
│  :3000   │  :3001   │  :3002   │     :5000              │
│ Next.js  │ Next.js  │ Next.js  │  ASP.NET Core          │
│standalone│standalone│standalone│  + SignalR              │
│          │          │          │  + Hangfire             │
├──────────┴──────────┴──────────┴────────────────────────┤
│  PostgreSQL :5432  │  Redis :6379  │  MinIO/S3 :9000    │
└────────────────────┴───────────────┴────────────────────┘
```

### 10.2 Dockerfiles

**API (.NET 10 Multi-Stage Build)** - `docker/api/Dockerfile`
```dockerfile
# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY apps/api/ .
RUN dotnet restore Fexora.Api.sln
RUN dotnet publish Fexora.Api/Fexora.Api.csproj -c Release -o /app

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Fexora.Api.dll"]
```

**Next.js Apps (Web / ACP / Moderator)** - z.B. `docker/web/Dockerfile`
```dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo build --filter=web

# Runtime (standalone)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

### 10.3 Docker Compose (Production)

`docker/docker-compose.yml`
```yaml
services:
  # ---------- Infrastruktur ----------
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: fexora
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redisdata:/data
    command: redis-server --requirepass ${REDIS_PASSWORD}

  # ---------- API ----------
  api:
    build:
      context: ..
      dockerfile: docker/api/Dockerfile
    restart: unless-stopped
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_started }
    environment:
      ConnectionStrings__Default: "Host=postgres;Database=fexora;Username=${DB_USER};Password=${DB_PASSWORD}"
      Redis__Connection: "redis:6379,password=${REDIS_PASSWORD}"
      Payment__Provider: ${PAYMENT_PROVIDER}
      Payment__SecretKey: ${PAYMENT_SECRET_KEY}
      Payment__WebhookSecret: ${PAYMENT_WEBHOOK_SECRET}
      S3__Endpoint: ${S3_ENDPOINT}
      S3__AccessKey: ${S3_ACCESS_KEY}
      S3__SecretKey: ${S3_SECRET_KEY}
      S3__Bucket: ${S3_BUCKET}
      Jwt__Secret: ${JWT_SECRET}
    ports:
      - "5000:5000"

  # ---------- Web Apps ----------
  web:
    build:
      context: ..
      dockerfile: docker/web/Dockerfile
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${API_PUBLIC_URL}
    ports:
      - "3000:3000"

  acp:
    build:
      context: ..
      dockerfile: docker/acp/Dockerfile
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${API_PUBLIC_URL}
    ports:
      - "3001:3000"

  moderator:
    build:
      context: ..
      dockerfile: docker/moderator/Dockerfile
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${API_PUBLIC_URL}
    ports:
      - "3002:3000"

  # ---------- Reverse Proxy ----------
  nginx:
    build: ./nginx
    restart: unless-stopped
    depends_on: [api, web, acp, moderator]
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/certs:/etc/nginx/certs  # SSL Zertifikate (Let's Encrypt)

volumes:
  pgdata:
  redisdata:
```

### 10.4 Nginx Reverse Proxy

`docker/nginx/nginx.conf`
```nginx
upstream web      { server web:3000; }
upstream acp      { server acp:3000; }
upstream moderator { server moderator:3000; }
upstream api      { server api:5000; }

server {
    listen 443 ssl;
    server_name fexora.de www.fexora.de;

    # User-Website
    location / {
        proxy_pass http://web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 443 ssl;
    server_name api.fexora.de;

    # API + SignalR
    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # wichtig für SignalR WebSocket
    }
}

server {
    listen 443 ssl;
    server_name admin.fexora.de;

    # Admin Control Panel
    location / {
        proxy_pass http://acp;
    }
}

server {
    listen 443 ssl;
    server_name mod.fexora.de;

    # Moderator Chat-App
    location / {
        proxy_pass http://moderator;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # für SignalR Live-KPIs
    }
}
```

### 10.5 Deployment-Workflow

```
1. Entwicklung (lokal)
   docker compose -f docker/docker-compose.dev.yml up
   → Nur Infrastruktur (Postgres, Redis, MinIO)
   → Apps laufen lokal via turbo dev

2. Staging / Production
   docker compose -f docker/docker-compose.yml up -d --build
   → Baut alle Images, startet alles

3. Update (Zero-Downtime)
   docker compose -f docker/docker-compose.yml up -d --build --no-deps api
   → Baut + startet nur den API-Container neu

4. Logs
   docker compose -f docker/docker-compose.yml logs -f api
   docker compose -f docker/docker-compose.yml logs -f web
```

### 10.6 Domains (Subdomain-Routing)

| Domain | Service | Container |
|--------|---------|-----------|
| `fexora.de` | User-Website | web:3000 |
| `api.fexora.de` | .NET API + SignalR | api:5000 |
| `admin.fexora.de` | Admin Control Panel | acp:3000 |
| `mod.fexora.de` | Moderator & Agency App | moderator:3000 |

### 10.7 .env (Template)

```env
# Database
DB_USER=fexora
DB_PASSWORD=<generieren>

# Redis
REDIS_PASSWORD=<generieren>

# JWT
JWT_SECRET=<generieren>

# Payment Provider (austauschbar)
PAYMENT_PROVIDER=stripe  # oder anderer Provider
PAYMENT_SECRET_KEY=sk_live_...
PAYMENT_WEBHOOK_SECRET=whsec_...

# S3 / Cloudflare R2
S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=fexora-media

# Public URLs
API_PUBLIC_URL=https://api.fexora.de
```

---

## 11. Technische Querschnittsthemen

Folgende Themen betreffen das gesamte Projekt und sollten von Anfang an mitgedacht werden.

### 11.1 Testing-Strategie

| Ebene | Tool | Was wird getestet |
|-------|------|-------------------|
| **Unit Tests** | xUnit + FluentAssertions + NSubstitute | Domain-Logik, Services, Validators |
| **Integration Tests** | `WebApplicationFactory<T>` + Testcontainers | API-Endpoints gegen echte DB/Redis in Docker |
| **E2E Tests** | Playwright | Kritische User-Flows (Login, Unlock, Chat, Review) |
| **Load Tests** | k6 oder NBomber | SignalR Chat unter Last, Broadcast-Durchsatz, Feed-Performance |
| **Contract Tests** | NSwag-generierte Clients | API-Breaking-Changes erkennen |

Ziel: Unit-Tests für alle Domain-Services, Integration-Tests für jeden API-Controller, E2E für die 5-6 wichtigsten User-Journeys.

### 11.2 Resilienz & Fehlerbehandlung

```
API-Architektur Resilienz-Stack:

  Request → Rate Limiter → Auth → Controller
                                      │
                              MediatR Handler
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
                DB (Polly         Redis (Polly      S3/External
                Retry +           Circuit           Retry +
                Timeout)          Breaker)           Timeout)
                    │                 │                  │
                    └─────────────────┼─────────────────┘
                                      │
                              Result<T> / ProblemDetails
```

| Thema | Lösung |
|-------|--------|
| **HTTP Resilience** | `Microsoft.Extensions.Http.Resilience` (Polly v8 integriert in .NET 10) |
| **Retry Policies** | Exponential Backoff für DB, Redis, S3/R2, Payment-Provider |
| **Circuit Breaker** | Für externe Dienste (Payment-Provider, R2, BunnyCDN) - verhindert Kaskadenfehler |
| **Timeouts** | Globale Request-Timeouts + per-Service Timeouts |
| **Dead Letter Queue** | Hangfire DLQ für fehlgeschlagene Orchestrator-Jobs |
| **Global Error Handling** | ASP.NET Core `ProblemDetails` (RFC 9457), strukturierte Fehler-Responses |
| **Idempotency** | Idempotency-Keys für Payment-Transaktionen und Orchestrator-Executions |

### 11.3 Media-Pipeline

Upload und Verarbeitung von Medien ist ein Kernfeature. Die Pipeline muss robust sein:

```
Upload Request
    │
    ▼
Validierung (Magic-Byte-Check, MIME-Whitelist, Max-Size)
    │
    ▼
S3 Upload (Original) → Raw-Bucket
    │
    ▼
Background Job (Hangfire)
    ├── Bilder:  Sharp/ImageMagick → Thumbnail + Blur-Preview + Watermark
    ├── Video:   FFmpeg → HLS-Transcoding (480p + 720p, h.264) + Thumbnail + Blur
    ├── Audio:   FFmpeg → MP3-Normalisierung + 10s-Preview-Clip
    └── Text:    Teaser-Extraktion (erster Absatz)
    │
    ▼
S3 Upload (Processed) → Public-Bucket (CDN)
    │
    ▼
DB Update: content.status = ready, URLs setzen
```

| Einstellung | Empfehlung |
|-------------|-----------|
| Max. Upload | Bilder: 20 MB, Video: 500 MB, Audio: 100 MB |
| Formate | Bilder: jpg/png/webp, Video: mp4/mov, Audio: mp3/m4a/wav |
| Upload-Sicherheit | Magic-Byte-Check + MIME-Whitelist + Re-Encoding (kein ClamAV nötig) |
| Watermark | Steganographie (unsichtbarer Fingerprint mit User-ID + Timestamp) nur auf Paid Content |
| Blur-Preview | Gaussian Blur (Radius 30-40) auf Thumbnails für Locked-Content |

### 11.4 Datenbank-Strategie

| Thema | Lösung |
|-------|--------|
| **Migrations** | EF Core Migrations, automatisch bei API-Start (`MigrateAsync`) im Dev, manuell in Prod |
| **Connection Pooling** | Npgsql Connection Pool (default 100, tunen nach Last) |
| **Read Replicas** | Ab ~5.000 User: PostgreSQL Streaming Replication für Feed/Reads |
| **Indexing** | Composite-Indexes für Feed-Queries, GIN-Index für `badges[]` Arrays, Partial Indexes für `status='approved'` |
| **Backups** | Tägliche pg_dump (automatisiert via Cron-Container), WAL-Archivierung für Point-in-Time Recovery |
| **Soft Deletes** | Für Content, Users, Messages (`deleted_at` Timestamp statt harte Löschung) - DSGVO-konform mit Retention |
| **Materialized Views** | Für Reports/KPIs: `engagement_metrics`, `moderator_stats`, `revenue_reports` - regelmäßig refreshed |

### 11.5 SignalR Skalierung

SignalR muss über mehrere API-Instanzen hinweg funktionieren:

```
                    ┌─── API Instance 1 ───┐
User A ───────────► │  SignalR Hub          │
                    │       │               │
                    │  Redis Backplane  ◄───┼──── Redis Pub/Sub
                    │       │               │
User B ───────────► │  SignalR Hub          │
                    └───────────────────────┘
                    ┌─── API Instance 2 ───┐
User C ───────────► │  SignalR Hub          │
                    │       │               │
                    │  Redis Backplane  ◄───┼──── Redis Pub/Sub
                    │       │               │
                    └───────────────────────┘
```

- **Redis Backplane** (`Microsoft.AspNetCore.SignalR.StackExchangeRedis`) - Nachrichten zwischen Instanzen synchronisieren
- **Sticky Sessions** alternativ via Nginx `ip_hash` (einfacher, aber weniger flexibel)
- **Presence Tracking** (Online-Status) über Redis Sets: `SADD online:{userId}`, TTL-basiert

### 11.6 Sicherheit

| Thema | Maßnahme |
|-------|----------|
| **CORS** | Strikt: nur `fexora.de`, `admin.fexora.de`, `mod.fexora.de` erlaubt |
| **CSP** | Content-Security-Policy Header auf allen Web-Apps |
| **Input Validation** | FluentValidation auf jedem API-Endpoint + Zod auf Frontend |
| **SQL Injection** | EF Core parametrisiert automatisch, kein Raw SQL ohne Review |
| **XSS** | React escaped per Default, Chat-Nachrichten sanitizen (DOMPurify) |
| **Rate Limiting** | ASP.NET Core Rate Limiter: Fixed Window (global) + Sliding Window (per User) |
| **Secret Management** | Docker Secrets in Prod, `.env` nur lokal, niemals in Git |
| **HTTPS Everywhere** | Let's Encrypt via Certbot-Container (auto-renewal) |
| **Upload-Validierung** | Magic-Byte-Check (nicht nur Extension), MIME-Whitelist, Max-Size, Re-Encoding durch Media-Pipeline |
| **Anti-Scraping** | Rate Limits auf Feed/Profile, Fingerprinting-Erkennung |
| **Brute Force** | Account Lockout nach N Fehlversuchen, CAPTCHA nach 3 Fails |

### 11.7 Logging & Observability

```
                 ┌─────────────────────────────┐
                 │         Grafana              │
                 │   Dashboards & Alerting      │
                 ├──────────┬──────────────────┤
                 │  Loki    │   Prometheus      │
                 │  (Logs)  │   (Metrics)       │
                 └────▲─────┴──────▲────────────┘
                      │            │
              Structured Logs    Metrics
              (Serilog → JSON)   (OpenTelemetry)
                      │            │
                 ┌────┴────────────┴────┐
                 │     API Container     │
                 │     Web Containers    │
                 │     Redis / Postgres  │
                 └──────────────────────┘

  + Sentry (Error Tracking, separate)
```

| Thema | Tool |
|-------|------|
| **Structured Logging** | Serilog → JSON-Format → Loki (oder Seq für Dev) |
| **Metrics** | OpenTelemetry → Prometheus → Grafana |
| **Error Tracking** | Sentry (API + alle Frontends) |
| **Distributed Tracing** | OpenTelemetry Traces (API → DB → Redis → S3) |
| **Health Checks** | ASP.NET Core Health Checks (`/health`, `/health/ready`) für Docker + Uptime-Monitoring |
| **Alerting** | Grafana Alerts: API Error Rate > 5%, Response Time > 2s, DB Connections > 80% |

### 11.8 API-Versionierung

Da Mobile-Apps nicht sofort aktualisiert werden können:

- **URL-basiert**: `/api/v1/feed`, `/api/v2/feed`
- **Asp.Versioning** NuGet Package
- **Strategie**: Breaking Changes nur in neuer Major-Version, alte Version 3 Monate parallel betreiben
- **OpenAPI Spec** pro Version generieren → separate Client-Packages

### 11.9 Suche

Für Content-Discovery und Profile-Suche:

| Phase | Lösung | Beschreibung |
|-------|--------|--------------|
| MVP | PostgreSQL Full-Text Search (`tsvector`) | Reicht für <10k Content-Items |
| Skalierung | Meilisearch (Docker-Container) | Typo-tolerant, schnell, einfache API, Open Source |

Suchbare Entitäten: Profile (Username, Bio, Land), Content (Titel, Tags), Stories (Titel).

### 11.10 Internationalisierung (i18n)

| Bereich | Lösung |
|---------|--------|
| **API** | Fehler-Codes statt Texte zurückgeben, Frontend übersetzt |
| **Web (Next.js)** | `next-intl` - Routing `/de/...`, `/en/...` für alle Web-Apps (web, acp, moderator) |
| **Shared** | Translations als JSON im `packages/shared/locales/` |
| **Phase 1** | Deutsch + Englisch (Fokus DACH-Markt) |
| **Phase 2+** | + Französisch, weitere Sprachen |

### 11.11 Feature Flags

Für schrittweises Rollout neuer Features:

- **Lösung**: Einfache DB-Tabelle `feature_flags(key, enabled, rollout_percentage, user_segment)`
- **API**: Middleware die Feature-Flags pro Request resolved
- **Frontend**: `useFeatureFlag('bundles')` Hook aus `api-client` Package
- **Anwendung**: Orchestrator, A/B-Tests, neue UI-Sections, Payment-Methoden

### 11.12 E-Mail & Notifications

| Kanal | Lösung | Anwendung |
|-------|--------|-----------|
| **Transactional E-Mail** | Resend oder Postmark | Registrierung, Passwort-Reset, Payout-Bestätigung |
| **Push (Browser)** | Web Push Notifications (Service Worker) | Neue Nachricht, Content approved, Coin-Reminder |
| **In-App** | SignalR + DB-Tabelle `notifications` | Profilbesucher, neuer Follower, Unlock |

### 11.13 DSGVO & Daten-Lifecycle

| Anforderung | Implementierung |
|-------------|----------------|
| **Datenexport** | API-Endpoint `GET /me/export` → async Hangfire Job → ZIP (Profil, Content-Metadaten, Chat, Käufe, Abos) → Download-Link per E-Mail. **Phase 1 MVP.** |
| **Datenlöschung** | API-Endpoint `/me/delete` → Soft-Delete + 30-Tage Grace Period + hartes Purge |
| **Retention** | Chat-Nachrichten: 2 Jahre, Audit-Logs: 5 Jahre, Gelöschte Accounts: 30 Tage |
| **Consent** | Granulares Consent-Management (Marketing, Analytics, Personalisierung) |
| **Cookie-Banner** | Next.js Middleware + Consent-Flags im User-Profil |
| **DPA** | Auftragsverarbeitungsverträge mit Payment-Provider, Cloudflare (R2), BunnyCDN, E-Mail-Provider |

### 11.14 CI/CD Pipeline

```
Push to main
    │
    ▼
GitHub Actions
    ├── Lint (ESLint + dotnet format)
    ├── Type Check (tsc + dotnet build)
    ├── Unit Tests (xUnit + vitest) [parallel]
    ├── Integration Tests (Testcontainers)
    │
    ▼ (alle grün)
    ├── Docker Build (alle Images)
    ├── Push to Registry (GitHub Container Registry)
    │
    ▼ (auf Staging)
    ├── Deploy to Staging (docker compose pull + up)
    ├── E2E Tests (Playwright gegen Staging)
    │
    ▼ (manuelles Approval)
    └── Deploy to Production
```

### 11.15 Backup & Disaster Recovery

| Was | Wie | Frequenz |
|-----|-----|----------|
| PostgreSQL | `pg_dump` → verschlüsselt → S3/R2 Backup-Bucket | Täglich + WAL-Archivierung |
| Redis | RDB Snapshots → S3 | Alle 6 Stunden |
| Medien (S3/R2) | Cross-Region Replication oder regelmäßiger Sync | Kontinuierlich |
| Docker Volumes | Volume-Backup Script vor Updates | Vor jedem Deployment |
| Recovery-Test | Restore-Drill auf Staging | Monatlich |
| **RTO** (Recovery Time) | < 1 Stunde | - |
| **RPO** (max. Datenverlust) | < 1 Stunde (dank WAL) | - |

### 11.16 Chat-Pricing-Modell

Creator können individuell festlegen, wie ihre Chat-Erreichbarkeit bepreist wird:

| Modell | Beschreibung | User-Erlebnis |
|--------|-------------|---------------|
| **Free** | Chat kostenlos | User kann direkt schreiben, kein Coin-Abzug |
| **Unlock** | Einmaliger Coin-Betrag um Chat zu starten | User sieht Preis vor erster Nachricht, zahlt einmal, danach unbegrenzt |
| **Pro-Nachricht** | Jede gesendete Nachricht kostet Coins | User sieht Preis pro Nachricht, Coin-Abzug bei jedem Send |

**Konfiguration (Creator-seitig):**
- Pricing-Modell wählen (Free / Unlock / Pro-Nachricht)
- Preis in Coins setzen (bei Unlock oder Pro-Nachricht)
- `first_message_free` Option: Erste Nachricht kostenlos als Einstieg
- Auto-Begrüßung: Optionale automatische Willkommensnachricht bei neuem Chat

**Technische Umsetzung:**
- `creator_chat_settings` Tabelle speichert Konfiguration pro Creator
- Chat-API prüft vor Nachrichtenversand das Pricing-Modell
- Bei Unlock: `coin_tx` beim ersten Message, danach freier Zugang
- Bei Pro-Nachricht: `coin_tx` bei jedem gesendeten Message
- Frontend zeigt Preis-Info prominent vor Chat-Start
- Moderator-App hat Zugriff auf Chat-Pricing-Kontext (sieht ob User bezahlt hat)

**Business Rules:**
- Creator-zu-Creator Chat ist immer kostenlos
- Admin/Moderator-Chat ist immer kostenlos
- User kann Chat-Pricing eines Creators auf der Profilseite sehen
- Bei unzureichendem Coin-Guthaben: Hinweis + Link zum Wallet-Topup
- **Abo-Interaktion**: Abo-Stufen können kostenlosen Chat als Perk inkludieren (überschreibt Chat-Pricing für Subscriber)
- **Impersonation**: Moderatoren chatten im Namen des Creators - User sieht Creator-Avatar/Name, `sent_by_moderator_id` wird intern gespeichert für Attribution

### 11.18 Abo-System (Subscriptions)

Creator können flexible Abo-Stufen anbieten:

**Abo-Modell:**
- Creator definiert beliebig viele Abo-Stufen (z.B. Fan, Super-Fan, VIP, ...)
- Jede Stufe hat: Name, Beschreibung, Preis (Coins und/oder EUR), Perks
- Zahlung wahlweise in Coins (monatlich vom Wallet abgebucht) oder EUR (Recurring via IPaymentService)
- Creator wählt pro Stufe: nur Coins / nur EUR / beides möglich

**Mögliche Perks pro Stufe (Creator konfiguriert frei):**
- Zugang zu allen Paid-Inhalten des Creators
- Zugang zu bestimmten Content-Kategorien
- Kostenloser Chat (überschreibt Chat-Pricing)
- Exklusives Subscriber-Badge auf Profil
- Frühzeitiger Zugang zu neuem Content
- Custom-Perks (Freitext-Beschreibung)

**Technische Umsetzung:**
- `subscription_tiers` definiert Stufen pro Creator
- `subscriptions` trackt aktive Abos, Status, Laufzeit
- `subscription_tx` speichert Zahlungshistorie (Coins oder EUR)
- Hangfire Recurring Job: täglicher Check für fällige Verlängerungen
  - Coins: Automatische Abbuchung vom Wallet, bei unzureichendem Guthaben → Benachrichtigung + Grace Period (3 Tage)
  - EUR: IPaymentService Recurring Charge, bei Fehlschlag → Retry + Benachrichtigung
- Content-Zugangs-Prüfung: Einzelkauf ODER aktives Abo der passenden Stufe
- Creator-Dashboard: Subscriber-Übersicht, MRR, Churn-Rate, Abo-Einnahmen

**Business Rules:**
- Abo verlängert sich monatlich automatisch
- User kann jederzeit kündigen (Zugang bis Ende der bezahlten Periode)
- Upgrade zwischen Stufen möglich (anteilige Verrechnung)
- Downgrade zum Periodenende wirksam
- Creator sieht Subscriber-Status seiner Fans

### 11.19 Agency-System

Agencies können eigene Creator-Profile betreiben und Moderatoren-Teams managen:

```
Agency-Architektur:
    ┌──────────────────────────────────────────────┐
    │                  Admin (ACP)                   │
    │  - Agencies anlegen/sperren                    │
    │  - Externe Creator zu Agency zuweisen          │
    │  - Agency-Umsätze einsehen                     │
    └────────────────────┬─────────────────────────┘
                         │ verwaltet
    ┌────────────────────▼─────────────────────────┐
    │              Agency-Dashboard                  │
    │         (in Moderator-App integriert)          │
    │                                                │
    │  Creator-Profile          Moderator-Team       │
    │  ┌─────────┐              ┌─────────┐         │
    │  │Creator A│──zugewiesen──│ Mod 1   │         │
    │  │(eigen)  │              │ Mod 2   │         │
    │  ├─────────┤              ├─────────┤         │
    │  │Creator B│──zugewiesen──│ Mod 3   │         │
    │  │(eigen)  │              │ Mod 4   │         │
    │  ├─────────┤              └─────────┘         │
    │  │Creator C│ (von Admin zugewiesen, extern)   │
    │  └─────────┘                                   │
    └────────────────────────────────────────────────┘
```

**Agency-Rechte:**
- Eigene Creator-Profile erstellen, Content hochladen, Preise/Abo-Stufen setzen
- Moderatoren einladen und verwalten
- Moderatoren zu Creator-Profilen zuweisen (nur eigene + von Admin zugewiesene Creator)
- KPIs, Umsätze und Performance aller eigenen Moderatoren einsehen
- Kein Zugriff auf externe Creator ohne Admin-Zuweisung

**Impersonation (Moderator → Creator):**
- Moderator wählt zugewiesenen Creator aus Dropdown
- Alle Chat-Nachrichten werden unter Creator-Identität gesendet
- User sieht nur Creator-Avatar und -Name
- Intern: `messages.sent_by_moderator_id` speichert echten Absender
- Attribution: Unlocks/Abo-Conversions werden dem Moderator zugerechnet
- Agency sieht im Dashboard welcher Moderator welche Performance bringt

**Vergütung:**
- Plattform zahlt an Agency (Gesamtbetrag basierend auf Mod-Provisionen)
- Agency verteilt intern an Moderatoren (außerhalb der Plattform)
- Plattform trackt Provisionen pro Moderator für Transparenz/Reporting

### 11.17 Social-Features-Architektur

Die Social Features bilden das Kernstück der Plattform:

```
User-Aktionen im Feed:
    ┌──────────────────────────────────────────┐
    │               Content Card                │
    │  ┌────────────────────────────────────┐  │
    │  │  Creator Avatar + Name + Follow    │  │
    │  │  Content (Bild/Video/Audio/Text)   │  │
    │  │  ♥ Like  💬 Kommentar  ↗ Teilen   │  │
    │  │  Tags: #lifestyle #premium         │  │
    │  │  Preis: 50 Coins (Blur/Locked)   │  │
    │  └────────────────────────────────────┘  │
    └──────────────────────────────────────────┘
```

**Trending-Algorithmus:**
- Score = (Likes × 1) + (Kommentare × 2) + (Unlocks × 5) + (Shares × 3)
- Zeitfaktor: Exponential Decay (Halbwertszeit: 24h für Daily, 7 Tage für Weekly)
- Snapshots: Stündliche Berechnung via Hangfire Job
- Separate Rankings: Global, pro Kategorie, pro Tag

**Notification-Pipeline:**
```
Event (Like/Comment/Follow/Unlock)
    │
    ▼
Event Handler (MediatR)
    ├── DB Insert (notifications Tabelle)
    ├── SignalR Push (wenn User online)
    └── Push Notification Queue (wenn User offline → Web Push via Service Worker)
```

**Kommentar-System:**
- **Creator bestimmt pro Content**: Alle dürfen kommentieren / Nur Follower / Kommentare deaktiviert
- Verschachtelte Kommentare (max. 2 Ebenen: Kommentar + Antworten)
- Likes auf Kommentare
- Creator kann eigene Kommentare pinnen
- Creator kann Kommentare unter eigenem Content löschen/ausblenden
- Automatischer Wortfilter (Admin-konfiguriert)

**Content-Sichtbarkeit (3 Stufen):**
- **Public**: Für alle sichtbar (auch Gäste)
- **Follower-Only**: Nur für Follower des Creators sichtbar
- **Paid**: Teaser/Blur für alle, Vollzugriff nur nach Coin-Unlock

### 11.20 Tipping & Gifts

Creator können über den Chat und das Profil Trinkgeld und Geschenke erhalten:

**Zwei Wege:**
- **Freier Coin-Betrag**: User gibt beliebigen Betrag ein (Min/Max Admin-konfigurierbar)
- **Gift-Items**: Vordefinierte Geschenke mit Icon, Animation und festem Preis (Admin erstellt/verwaltet im ACP)

**Technische Umsetzung:**
- `tips` Tabelle speichert jede Transaktion (Sender, Empfänger, Betrag, optional Gift-Item)
- `gift_items` Tabelle: Admin erstellt Items (Name, Icon, Animation-URL, Preis, Sortierung)
- Coin-Abzug beim Sender via `coin_tx`, Gutschrift beim Creator
- SignalR-Event an Creator bei eingehendem Tip (Echtzeit-Benachrichtigung)
- Gift-Animationen werden im Chat-Fenster abgespielt (Lottie/CSS)
- Creator-Dashboard: Tip-Übersicht, Top-Tipper, Einnahmen-Statistik

### 11.21 PPV-Messages (Pay-Per-View)

Creator können kostenpflichtige Nachrichten im Chat senden:

- Creator setzt Preis pro PPV-Nachricht (Min/Max Admin-konfigurierbar im ACP)
- User sieht Preview-Text (optional) und Preis
- Unlock per Coin-Abzug → voller Inhalt wird sichtbar
- `ppv_messages` + `ppv_unlocks` Tabellen
- Moderator kann im Namen des Creators PPV-Messages senden (Impersonation)

### 11.22 Custom Requests & Escrow

User können personalisierte Inhalte bei Creator anfragen:

```
Request-Flow:
    User erstellt Request (Beschreibung + Budget in Coins)
         │
         ▼
    Creator Accept → Coins werden vom User-Wallet in Escrow gehalten
         │
         ▼
    Creator liefert (Content-Upload an Requester)
         │
         ▼
    User bestätigt Delivery → Coins werden an Creator ausgezahlt
         │
    ODER: User disputet → Admin entscheidet über Erstattung
```

- Formular-basiert: Beschreibung, gewünschter Typ, Budget
- Escrow: Coins werden bei Accept reserviert (nicht sofort an Creator)
- Delivery: Creator lädt Content hoch, User wird benachrichtigt
- Auto-Confirm: Nach 7 Tagen ohne Aktion gilt Delivery als akzeptiert
- Dispute: Admin kann manuell Coins zurückerstatten oder freigeben

### 11.23 Referral-System

Zwei Referral-Programme:

**User-wirbt-User:**
- Jeder User erhält einzigartigen Referral-Code/Link
- Geworbener User gibt Code bei Registrierung ein
- Bonus-Coins für beide Seiten (Betrag Admin-konfigurierbar)
- Anti-Abuse: Nur bei verifiziertem Account, max. N Referrals/Monat

**Creator-wirbt-Creator:**
- Creator erhält separaten Creator-Referral-Code
- Geworbener Creator registriert sich und wird freigeschaltet
- Werbender Creator erhält %-Provision auf Einnahmen des geworbenen Creators
- Provision zeitlich begrenzt (z.B. 6 Monate, Admin-konfigurierbar)
- Transparente Stats im Creator-Dashboard

### 11.24 Content Scheduling & Pinned Posts

- Creator kann Content für zukünftige Veröffentlichung planen
- `scheduled_content` Tabelle mit Ziel-Datum/Uhrzeit
- Hangfire Job prüft minütlich auf fällige Veröffentlichungen
- Kalender-Ansicht im Creator-Dashboard
- Pinned Posts: Creator kann bis zu 3 Posts auf seinem Profil-Grid oben anpinnen
- Drafts: Content als Entwurf speichern, später bearbeiten und veröffentlichen

### 11.25 DMCA-Prozess

Creator können gestohlenen Content melden:

- DMCA-Report-Formular auf der Web-App (für eingeloggte User/Creator)
- Felder: Content-Link, Original-URL (Nachweis), Beschreibung, Evidence-Upload
- Admin Review-Queue im ACP: Report prüfen, Content entfernen (Takedown) oder ablehnen
- Automatische Benachrichtigung an Content-Uploader bei Takedown
- Counter-Notice-Möglichkeit (Phase 2+): Uploader kann widersprechen, Content bleibt 10 Werktage offline (Safe Harbor)
- `dmca_reports` Tabelle mit Status-Tracking
- Bei Takedown: CDN-Cache-Invalidierung (BunnyCDN Purge API) + R2-Objekt soft-delete

### 11.26 Blocking-Enforcement

User-Blocking muss in allen relevanten Systemteilen greifen:

```
Blocking-Check-Matrix:
    Aktion                  │ Check
    ────────────────────────┼───────────────────────────────────
    Feed laden              │ WHERE content.owner_id NOT IN (blocked_by_me + blocked_me)
    Profil aufrufen         │ 403 wenn geblockt (beide Richtungen)
    Follow/Unfollow         │ Follow verweigern wenn geblockt
    Chat starten/senden     │ Nachricht verweigern, Thread unsichtbar
    Kommentar schreiben     │ Kommentar verweigern auf Content des Blockers
    Suche/Explore           │ Ergebnisse filtern (keine Profile/Content von geblockten)
    Empfehlungen            │ Aus Recommendation-Algorithmus ausschließen
    Tipping/Gifts           │ Tip verweigern an geblockte User
    Custom Requests         │ Request verweigern
```

**Technische Umsetzung:**
- Redis-Cache der Blockliste pro User: `SET blocked:{userId}` mit TTL 5 Min
- Middleware/Filter in allen relevanten API-Endpunkten
- Bei Block: bestehende Follows in beide Richtungen automatisch entfernen
- `sent_by_moderator_id` in API-Responses an User NIEMALS exponieren (nur interne DB)

### 11.27 Impersonation-Sicherheit

Absicherung des Moderator-Impersonation-Systems:

| Maßnahme | Beschreibung |
|----------|-------------|
| **API-Response-Filterung** | `sent_by_moderator_id` wird NIEMALS in API-Responses an User/Creator ausgeliefert. Nur in Admin/Agency-Endpoints sichtbar. |
| **Anomalie-Erkennung** | Alert wenn Moderator >10x Baseline-Nachrichten/Stunde sendet (möglicher Account-Kompromittierung). Notification an Agency + Admin. |
| **Berechtigungsprüfung bei Ausführung** | Jede Moderator-Aktion prüft `moderator_creator_assignments.is_active` in Echtzeit — kein Caching. Revoke wirkt sofort. |
| **Audit-Trail** | Alle Impersonation-Aktionen (Chat, Content-Upload, PPV senden) mit Moderator-ID + Timestamp in `audit_logs` |
| **Content-Upload durch Moderator** | Nur wenn Agency dies explizit erlaubt hat. Content durchläuft normale Review-Queue. |
| **Session-Isolation** | Moderator kann nur einen Creator gleichzeitig impersonieren. Wechsel erfordert explizite Aktion. |

### 11.28 Escrow-System Regeln

Detaillierte Regeln für das Custom-Request Escrow-System:

```
Escrow-Lifecycle:
    1. User erstellt Request (Beschreibung + Budget)
    2. Creator akzeptiert → coin_tx: User-Wallet -X Coins → Escrow (type=escrow_hold)
    3. Creator liefert Delivery (Datei-Upload erforderlich, kein leerer Text)
    4. User erhält Notification → 7 Tage zum Bestätigen oder Disputen
    5a. User bestätigt → coin_tx: Escrow → Creator-Wallet (type=escrow_release)
    5b. 7 Tage ohne Aktion → Auto-Confirm → Escrow → Creator-Wallet
    5c. User disputet → Admin-Review (Admin sieht Request + Delivery + Chat)
        → Admin: Refund → Escrow → User-Wallet (type=escrow_refund)
        → Admin: Release → Escrow → Creator-Wallet
```

**Delivery-Validierung:**
- Delivery erfordert mindestens einen Datei-Upload (Bild/Video/Audio)
- System verifiziert: Datei nicht leer, MIME-Type gültig, Magic-Byte-Check
- Auto-Confirm erst nachdem User die Delivery-Nachricht geöffnet hat (read_at gesetzt)

**Edge Cases:**
- Creator gebannt während laufendem Request → Escrow automatisch an User zurück
- DMCA-Takedown auf gelieferten Content → Admin entscheidet über Escrow
- User löscht Account während Escrow → Escrow an Creator (Leistung erbracht)
- Creator löscht Account → offene Requests auto-cancelled, Escrow an User zurück

### 11.29 Coin-System

Fester Wechselkurs und Coin-Ökonomie:

| Parameter | Wert | Konfigurierbar |
|-----------|------|---------------|
| **Wechselkurs** | 1 EUR = 100 Coins (fest) | Nein (hardcoded) |
| **Coin-Packs** | 500 / 1.500 / 3.000 / 7.500 Coins (5 / 15 / 30 / 75 EUR) | Ja (ACP Platform-Settings) |
| **Tip-Range** | Min: 10 Coins, Max: 50.000 Coins | Ja (ACP) |
| **PPV-Range** | Min: 50 Coins, Max: 10.000 Coins | Ja (ACP) |
| **Chat Unlock** | Admin-Default, Creator frei innerhalb Grenzen | Ja (ACP) |
| **Chat Pro-Nachricht** | Admin-Min/Max | Ja (ACP) |
| **Payout-Kurs** | 100 Coins = 1 EUR (identisch) | Nein |
| **Payout-Minimum** | 50 EUR (5.000 Coins) | Ja (ACP) |
| **Plattform-Fee** | Creator erhält X% der Coins (Rest = Plattform-Fee) | Ja (ACP, z.B. 80% Creator / 20% Plattform) |

**Coin-Transaktionstypen (coin_tx.type):**
`topup` | `purchase` | `unlock` | `subscription` | `tip` | `gift` | `ppv_unlock` | `escrow_hold` | `escrow_release` | `escrow_refund` | `refund` | `referral_bonus` | `payout` | `promo_discount`

### 11.30 Datenbank-Indexing-Strategie

Kritische Indizes die von Phase 0 an angelegt werden:

```sql
-- Feed-Performance (jeder Feed-Load)
CREATE INDEX idx_content_feed ON content(owner_id, status, visibility, created_at DESC);

-- Trending-Snapshots (stündliche Berechnung + Abfrage)
CREATE INDEX idx_trending ON trending_snapshots(entity_type, period, snapshot_date DESC);

-- Moderator-Attribution (30-Min-Fenster-Lookup)
CREATE INDEX idx_messages_mod_attr ON messages(sent_by_moderator_id, created_at DESC) WHERE sent_by_moderator_id IS NOT NULL;

-- User-Notifications (paginierte Abfrage)
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at, created_at DESC);

-- Blocking-Enforcement (beide Richtungen)
CREATE UNIQUE INDEX idx_blocked_unique ON blocked_users(blocker_id, blocked_id);
CREATE INDEX idx_blocked_reverse ON blocked_users(blocked_id);

-- Subscription-Zugangs-Check
CREATE INDEX idx_subscriptions_check ON subscriptions(user_id, creator_id, status);

-- Coin-Transaktionshistorie
CREATE INDEX idx_coin_tx_user ON coin_tx(user_id, created_at DESC);

-- Kommentare (verschachtelt, pro Content)
CREATE INDEX idx_comments_content ON comments(content_id, parent_id, created_at);

-- Tags-Discovery
CREATE INDEX idx_content_tags_tag ON content_tags(tag_id);

-- Full-Text-Search (MVP)
CREATE INDEX idx_content_fts ON content USING GIN(to_tsvector('german', title));
CREATE INDEX idx_profiles_fts ON profiles USING GIN(to_tsvector('german', username || ' ' || bio));

-- Partial-Indexes für häufige Filter
CREATE INDEX idx_content_approved ON content(created_at DESC) WHERE status = 'approved';
CREATE INDEX idx_content_pending ON content(created_at) WHERE status = 'pending';
```

### 11.31 Datenbank-Partitionierung

Strategie für schnell wachsende Tabellen:

| Tabelle | Strategie | Partition-Key | Retention |
|---------|-----------|---------------|-----------|
| `messages` | RANGE by `created_at` (monatlich) | `created_at` | Unbegrenzt (archivierbar nach 2 Jahren) |
| `coin_tx` | RANGE by `created_at` (monatlich) | `created_at` | Unbegrenzt (Finanz-Audit) |
| `notifications` | RANGE by `created_at` (monatlich) | `created_at` | Gelesene nach 6 Monaten purgen |
| `audit_logs` | RANGE by `created_at` (monatlich) | `created_at` | 5 Jahre Retention |
| `feed_events` | RANGE by `created_at` (wöchentlich) | `created_at` | 30 Tage, danach archivieren |
| `scenario_executions` | RANGE by `executed_at` (monatlich) | `executed_at` | 1 Jahr |

Partitionen werden via EF Core Migrations angelegt. Automatisches Partition-Management via pg_partman Extension.

---

## 12. Risiken & Gegenmaßnahmen

| Risiko | Wahrscheinlichkeit | Maßnahme |
|--------|-------------------|----------|
| Payments/KYC-Compliance | Hoch | Generisches IPaymentService Interface, frühzeitig Provider-Onboarding + Legal-Texte klären |
| Attributionslogik komplex | Mittel | Saubere Definition (Fenster, Edge Cases) vor Implementierung |
| Spam durch Orchestrator | Mittel | Strikte Frequenzkappen, Opt-Outs, Qualitätstests |
| Lastspitzen bei Broadcasts | Mittel | Batch/Throttling + Backpressure in Worker-Queues |
| shadcn/ui Konsistenz | Niedrig | Einheitliche shadcn/ui-Komponenten über alle Web-Apps (web, acp, moderator) sicherstellen |
| DSGVO DACH-Compliance | Hoch | Nur interne Profile als Sender, Audit-Logs, Consent-Flows |
| 18+ Content Regulierung | Mittel | Ausweis-Verifikation für Creator/Mod, Self-Check für User, AGB-Absicherung |
| Datenverlust | Mittel | Tägliche Backups + WAL-Archivierung + monatlicher Recovery-Drill |
| Media-Pipeline Bottleneck | Mittel | FFmpeg/ImageMagick als separate Worker-Container, horizontally skalierbar |
| SignalR unter Last | Mittel | Redis Backplane von Anfang an, Load-Tests mit k6 |
| Social Feature Spam | Hoch | Rate Limits auf Likes/Comments/Follows, CAPTCHA bei verdächtigem Verhalten |
| Comment Moderation | Mittel | Creator-Moderation + Auto-Wortfilter + Report-System |
| Chat-Pricing Missbrauch | Mittel | Admin-konfigurierbare Min/Max-Preisgrenzen im ACP, Refund-Policy, Betrugs-Erkennung |
| Creator-Dashboard Datenqualität | Niedrig | Materialized Views für Stats, regelmäßige Konsistenzprüfungen |
| Abo-Recurring-Fehler | Mittel | Grace Period (3 Tage), Retry-Logik, Benachrichtigungen, Hangfire DLQ |
| Agency-Missbrauch | Mittel | Admin-Genehmigung für externe Creator-Zuweisungen, Audit-Logs, Agency-Sperrung möglich |
| Impersonation-Vertrauen | Hoch | Klare Audit-Trails (`sent_by_moderator_id`), Agency sieht wer was geschrieben hat |
| Abo-Churn | Mittel | Engagement-Orchestrator für Retention, Benachrichtigungen vor Ablauf, Reaktivierungs-Kampagnen |
| Escrow-Disputes | Mittel | Klare Regeln in AGB, Auto-Confirm nach 7 Tagen, Admin-Entscheidung bei Dispute, Audit-Trail |
| Referral-Missbrauch | Mittel | Verifizierungs-Pflicht, Max-Referrals/Monat, IP/Device-Deduplizierung, Admin kann Referral-Codes sperren |
| Tipping-Betrug | Niedrig | Min/Max-Limits (Admin-konfigurierbar), verdächtige Muster erkennen (viele kleine Tips), Rate Limiting |
| PPV-Preismissbrauch | Niedrig | Admin-konfigurierbare Min/Max-Preisgrenzen, Melde-Funktion für überhöhte Preise |
| DMCA False Claims | Mittel | Evidenz-Upload Pflicht, Admin-Review vor Takedown, Counter-Notice-Prozess, Missbrauchs-Sperre |
| Custom Request Scope Creep | Niedrig | Klare Formular-Struktur, fester Preis bei Accept, kein Nachverhandeln nach Escrow |
| 2FA Recovery | Niedrig | Backup-Codes bei Aktivierung, Admin kann 2FA manuell zurücksetzen |

---

## 13. Entscheidungen

| # | Thema | Entscheidung | Details |
|---|-------|-------------|---------|
| 1 | Zahlungsanbieter | **Generisches Payment-Interface** | Clean Architecture: `IPaymentService` Interface in Core, konkrete Implementierungen (Stripe, etc.) in Infrastructure. Provider austauschbar ohne API-Änderungen. |
| 2 | Object Storage | **Cloudflare R2** | S3-kompatibel, 0 EUR Egress-Kosten, ideal für Media-Heavy-Plattform. |
| 3 | CDN | **BunnyCDN** | Günstig, einfach, gute EU-Performance für DACH-Fokus. |
| 4 | Hosting (Docker) | **Hetzner Cloud VPS** | Günstig, EU-Rechenzentren (DSGVO), gute Preis/Leistung. |
| 5 | Attributionsfenster | **30 Minuten** | Unlock innerhalb von 30 Min nach Moderator-Interaktion wird dem Moderator zugerechnet. |
| 6 | Vergütungsformel Mods | **Nur Provision (Admin-konfigurierbar)** | Rein umsatzbasiert. Prozentsätze pro Vergütungstyp (Unlocks, Chat-Umsatz, etc.) separat im ACP durch Admins einstellbar. |
| 7 | Coin-Pack Preise | **5 / 15 / 30 / 75 EUR** | Psychologisches Pricing mit ungeraden Beträgen. |
| 8 | In-App-Währung Name | **Coins** | Spielerisch, Gamification-Vibe, gut merkbar. |
| 9 | Sprache Phase 1 | **DE + EN (Fokus DACH)** | Deutsch als primäre Sprache, Englisch von Anfang an. DACH-Markt als Kernzielgruppe. |
| 10 | Chat-Unlock Mindestpreis | **Kein hardcoded Minimum** | Admin kann globalen Default-Mindestpreis im ACP konfigurieren. Creator frei innerhalb Admin-Grenzen. |
| 11 | Kommentar-Sichtbarkeit | **Creator entscheidet** | Creator kann pro Content wählen: Alle / Nur Follower / Deaktiviert. |
| 12 | Trending-Algorithmus | **Unlock-fokussiert** | Likes×1 + Comments×2 + Shares×3 + Unlocks×5. Monetarisierung wird stärker gewichtet. Exponential Decay (24h Daily, 7d Weekly). |
| 13 | Creator-Payout Mindestbetrag | **50 EUR** | Standard-Mindestbetrag für Auszahlungsanträge. |
| 14 | Follower-Only Content | **Ja** | Drei Sichtbarkeitsstufen: Public / Follower-Only / Paid (Coins). Creator wählt pro Content. |
| 15 | Pro-Nachricht Preisspanne | **Admin-konfigurierbar** | Min/Max Coins pro Nachricht wird im ACP global eingestellt, nicht hardcoded. Flexibel anpassbar. |
| 16 | Agency-System | **In Moderator-App integriert** | Agency-Dashboard als Bereich in der Moderator-App (nur für Agency-Rolle). Agency erstellt eigene Creator-Profile, verwaltet Moderatoren, weist diese zu. Admin kann externe Creator zuweisen. |
| 17 | Agency-Creator-Beziehung | **Agency = Creator-Manager (eigene + Admin-zugewiesene)** | Agency hat volle Kontrolle über selbst erstellte Creator. Admin kann zusätzlich externe Creator zuweisen. Kein eigenmächtiger Zugriff auf fremde Creator. |
| 18 | Agency-Vergütung | **Agency regelt intern** | Plattform zahlt Gesamtprovision an Agency. Agency verteilt intern an Moderatoren. Plattform trackt pro Moderator für Transparenz. |
| 19 | Abo-Modell | **Flexible Stufen, Creator konfiguriert** | Creator definiert beliebig viele Abo-Stufen mit individuellen Perks (All-Access, Chat-Free, Badges, Custom). Kann alle Optionen kombinieren. |
| 20 | Abo-Zahlung | **Coins oder EUR (Creator wählt pro Stufe)** | Jede Abo-Stufe kann in Coins, EUR oder beidem bezahlbar sein. Recurring via Hangfire (Coins) oder IPaymentService (EUR). |
| 21 | Abo-Stufen Limit | **Frei definierbar** | Creator kann beliebig viele Stufen erstellen, kein hardcoded Maximum. |
| 22 | Altersverifikation | **Zweistufig** | User: Self-Check Checkbox bei Registrierung. Creator/Moderator: Ausweis-Upload, manuell von Admins geprüft und freigegeben. |
| 23 | Moderator Content-Rechte | **Agency entscheidet pro Moderator** | Agency kann pro Moderator festlegen: nur Chat oder auch Content-Upload im Namen des Creators. Content durchläuft normale Review-Queue. |
| 24 | Impersonation-Transparenz | **Über AGB geregelt** | Keine technische Transparenz im UI. User sieht nur Creator-Identität. Regelung über AGB/Nutzungsbedingungen. `sent_by_moderator_id` intern für Audit. |
| 25 | Media-Validierung | **Magic-Byte + Re-Encoding** | Whitelist MIME-Types (jpg/png/webp/mp4/mov/mp3/m4a/wav), Magic-Byte-Check, Max-Size-Limits. Re-Encoding durch Media-Pipeline (Sharp/FFmpeg) zerstört eingebetteten Schadcode. Kein ClamAV nötig. |
| 26 | Video-Transcoding | **480p + 720p** | Zwei Auflösungen für MVP. HLS-Streaming. Spart Storage und Transcoding-Zeit. |
| 27 | Rate Limits | **Admin-konfigurierbar** | Alle Rate Limits im ACP Platform-Settings einstellbar. Defaults: Likes 500/Tag, Comments 100/Tag, Follows 100/Tag, Messages 200/Tag, Uploads 20/Tag. |
| 28 | Attribution Edge Case | **Letzter Moderator** | Bei mehreren Moderatoren bekommt der mit der letzten Interaktion die Attribution, unabhängig vom Zeitfenster. |
| 29 | Abo Grace Period | **Auto-Cancel nach 3 Tagen** | Bei fehlgeschlagener Coin-Abbuchung: 3 Tage Grace Period mit Benachrichtigung. Danach automatische Kündigung. User kann jederzeit neu abonnieren. |
| 30 | Orchestrator Quiet Hours | **CET/CEST** | Quiet Hours 23-8 Uhr in mitteleuropäischer Zeit. Passend für DACH-Fokus. |
| 31 | Watermark | **Steganographie nur auf Paid Content** | Unsichtbarer digitaler Fingerprint (User-ID + Timestamp) nur auf kostenpflichtigen Inhalten. Kein sichtbares Overlay. Rückverfolgbar bei Leaks. |
| 32 | Profil-Grid | **Gemischtes Grid + Filter-Tabs** | Alles in einem Grid mit Filter-Tabs (Alle/Bilder/Videos/Audio/Text). Visuelle Indikatoren für Lock-Status, Follower-Only-Badge, Preis-Tag. |
| 33 | E-Mail Provider | **Generisches IEmailService + Resend** | Wie Payment: `IEmailService` Interface in Core, Resend als erste Implementierung. Auth + Transaktional + Engagement E-Mails ab Phase 1. |
| 34 | Refund Policy | **Kein Coin-Refund, Admin-Erstattung möglich** | Digitale Güter = kein Rücktausch. Admin kann im ACP manuell Transaktionen erstatten (Sonderfälle, technische Fehler). |
| 35 | Ähnliche Inhalte | **Tag-basiert** | Content-Empfehlungen auf Detail-Seite basierend auf gemeinsamen Tags (gleicher + andere Creator). |
| 36 | Storage-Limits | **Kein Limit** | Unbegrenzter Upload für Creator. Kosten skalieren mit R2-Nutzung. |
| 37 | Mobile App (Expo) | **Entfällt (Phase 1-3)** | Kein Expo/React Native. Fokus auf Web-Apps (Next.js). Mobile-Zugang über responsive Web/PWA. Expo kann später evaluiert werden. |
| 38 | Tamagui (@fexora/ui) | **Entfernt** | Ohne Mobile App kein Cross-Platform nötig. shadcn/ui reicht für alle Web-Apps (web, acp, moderator). |
| 39 | DSGVO Datenexport | **Phase 1 MVP (Basis)** | ~~Ursprünglich Phase 2+~~ → In Phase 1 verschoben (rechtlich verpflichtend). Basis-Export: Profil, Content-Metadaten, Chat-Nachrichten, Käufe, Abos als ZIP. Erweiterter Export (Medien-Download, granulare Auswahl) in Phase 2+. |
| 40 | Orchestrator Templates | **Handlebars {{var}}** | Einfache Variablen-Syntax: {{username}}, {{creator_name}}, etc. Keine Template-Logik (if/for), nur Platzhalter-Ersetzung. |
| 41 | Reports | **Live-Dashboards only** | Echtzeit-Dashboards mit Filtern für Moderator/Agency/Admin. Kein separater Report-Export oder Batch-Generierung. |
| 42 | Stories | **24h Feed + permanentes Profil-Archiv** | Stories sind 24h im Feed/Story-Leiste sichtbar, danach permanent über das Creator-Profil abrufbar. |
| 43 | Tipping-Modell | **Freier Betrag + Gift-Items** | User können freien Coin-Betrag senden ODER vordefinierte Gift-Items (mit Animation) auswählen. Admin verwaltet Gift-Items im ACP. |
| 44 | PPV-Messages | **Creator setzt Preis, Admin Min/Max** | Creator bestimmt PPV-Preis pro Nachricht frei. Admin definiert Min/Max im ACP Platform-Settings. |
| 45 | Referral-Scope | **User + Creator** | User-wirbt-User (Bonus-Coins) UND Creator-wirbt-Creator (%-Provision auf Einnahmen, zeitlich begrenzt). |
| 46 | Custom Requests | **Formular + Escrow** | Formular-basierte Anfragen mit Escrow-System. Coins werden bei Accept reserviert, bei Delivery ausgezahlt. Auto-Confirm nach 7 Tagen. |
| 47 | Media-Sets | **Admin-konfigurierbares Maximum** | Creator können mehrere Medien pro Content hochladen (Gallery). Max. Anzahl über platform_settings einstellbar. |
| 48 | Feature-Phasing (Security) | **Phase 1 (MVP)** | 2FA, User-Blocking, DMCA-Basis, Account Recovery sind Teil des MVP. |
| 49 | Feature-Phasing (Creator-Tools) | **Phase 1 (MVP)** | Scheduling, Pinned Posts, Media-Sets, Drafts, Mass-Messaging, Promo Codes sind Teil des MVP. |
| 50 | Feature-Phasing (Monetization) | **Phase 1 (MVP)** | Tipping/Gifts, PPV-Messages, Custom Requests + Escrow, Referral-System sind Teil des MVP. |
| 51 | Feature-Phasing (Agency Workflow) | **Phase 4+** | Schichtplanung, Per-Creator Templates, Performance-Targets sind Erweiterungen nach Orchestrator. |
| 52 | Feature-Phasing (Analytics) | **Phase 2 (ACP Reports)** | Funnel-Tracking, erweiterte Cohort-Analyse in ACP Reports-Dashboard. |
| 53 | Coin-Wechselkurs | **1 EUR = 100 Coins (fest)** | Fixer Kurs, kein Bonus bei größeren Packs. Payout identisch: 100 Coins = 1 EUR. Hardcoded, nicht konfigurierbar. |
| 54 | Trending-Berechnung | **Stündlich via Hangfire** | Stündliche Score-Berechnung, Ergebnis in Materialized Views für Daily/Weekly Rankings. Exponential Decay (24h/7d). |
| 55 | Blocking-Enforcement | **Systemweit in allen Endpunkten** | Feed, Profil, Follow, Chat, Kommentare, Suche, Empfehlungen, Tipping, Requests — alles gefiltert. Redis-Cache der Blockliste. |
| 56 | Impersonation-Sicherheit | **API-Filterung + Anomalie-Erkennung** | `sent_by_moderator_id` nie in User-Responses. Anomalie-Alert bei >10x Baseline-Nachrichten/h. Echtzeit-Berechtigungsprüfung. |
| 57 | Escrow-Delivery-Validierung | **Datei-Upload + Auto-Confirm nach Lesen** | Delivery erfordert Datei-Upload (MIME/Magic-Byte-Check). Auto-Confirm 7 Tage nach User-Öffnung (read_at). |
| 58 | DSGVO Datenexport | **Phase 1 (MVP)** | Basis-Export (Profil, Content, Chat, Käufe) im MVP. Rechtlich verpflichtend, darf nicht auf Phase 2+ verschoben werden. |
| 59 | Bundles | **Phase 1 (MVP)** | Bereits im Datenmodell vorhanden, einfaches Feature (~20h). In Phase 1 statt Phase 4. |
| 60 | Web Push + Social Login | **Phase 2a (Woche 21-22)** | Web Push Notifications (Service Worker) und Google/Apple Sign-In direkt nach Orchestrator, vor Phase 4. |
| 61 | Mass-Messaging Rate Limit | **1 pro Creator pro Stunde** | Creator kann max. 1 Mass-Message pro Stunde senden. Hangfire Batch-Versand mit Throttling (1.000 User/Batch). |
| 62 | Plattform-Fee | **Admin-konfigurierbar im ACP** | Creator erhält X% der Coins (z.B. 80%), Rest = Plattform-Fee. Getrennt konfigurierbar pro Einnahmetyp (Unlocks, Tips, Abos, PPV, Custom Requests). |
