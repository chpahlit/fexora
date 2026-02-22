# FEXORA-022: EF Core Migrations (Core + Social Tables)

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 8-12h
**Status:** Done

---

## Beschreibung

Initiale EF Core Migrations fur alle Datenmodell-Tabellen. Umfasst Core Tables, Social Features, Notifications, Favorites, Chat-Pricing, Subscriptions, Agency, Blocking, 2FA, Tipping, PPV, Custom Requests, Referral, DMCA, Scheduling, Promo Codes.

## Aufgaben

- [x] **Core Tables:**
  - ✅ users, profiles, contents, credit_wallets, credit_transactions
  - ✅ messages, threads, purchases, refresh_tokens
  - ✅ reports, audit_logs, policy_configs, payout_records
  - ✅ bundles, feed_events (Migration Sprint5_AllMissingTables)
- [x] **Social Features:**
  - ✅ likes (polymorphic), comments, follows, shares
  - ✅ tags, content_tags, trending_snapshots
  - ✅ notifications, favorites
- [x] **Chat & Monetization:**
  - ✅ creator_chat_settings
  - ✅ subscription_tiers, subscriptions
  - ✅ tips, gift_items
  - ✅ ppv_messages, ppv_unlocks
  - ✅ custom_requests
- [x] **Referral & Promo:**
  - ✅ referral_codes, referral_redemptions
  - ✅ promo_codes, promo_redemptions
- [x] **Agency & Moderation:**
  - ✅ agencies, agency_moderator, moderator_compensations
- [x] **Blocking & Security:**
  - ✅ blocked_users, two_factor_auth
- [x] **Content Erweiterungen:**
  - ✅ content_media, scheduled_content
  - ✅ dmca_reports
- [ ] **Orchestrator Tables:** (verschoben nach FEXORA-072, Phase 3)
  - scenarios, scenario_steps, scenario_enrollments, scenario_executions
  - message_templates, broadcasts, broadcast_executions
- [x] Indizes aus Migrations (Basis-Indizes, spezialisierte in FEXORA-010)
- [ ] Seed-Data: Default Gift-Items (Admin-User bereits in Program.cs geseedet)

## Akzeptanzkriterien

- ✅ `dotnet ef database update` erstellt alle Tabellen
- ✅ Alle Foreign Keys und Constraints korrekt
- ✅ Basis-Indizes vorhanden
- ⏳ Seed-Data teilweise (Admin via Program.cs)
- ✅ Migration ist idempotent

## Migrations

1. `20260208095534_InitialCreate` — Core Tables
2. `20260208100617_Sprint2_WalletChat` — Wallet & Chat
3. `20260208102128_Sprint3_AdminModerationBoard` — Admin & Moderation
4. `20260208103850_Sprint4_KpiAttributionGdpr` — KPI, Attribution, GDPR
5. `20260222141533_Sprint5_AllMissingTables` — Social, Monetization, Referral, Blocking, Content Extensions

## Abhangigkeiten

- FEXORA-002 (.NET Solution)
- FEXORA-010 (Index-Strategie)
