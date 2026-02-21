# FEXORA-022: EF Core Migrations (Core + Social Tables)

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Initiale EF Core Migrations fur alle Datenmodell-Tabellen. Umfasst Core Tables, Social Features, Notifications, Favorites, Chat-Pricing, Subscriptions, Agency, Blocking, 2FA, Tipping, PPV, Custom Requests, Referral, DMCA, Scheduling, Promo Codes.

## Aufgaben

- [ ] **Core Tables:**
  - users, profiles, content, bundles, feed_events
  - messages, threads, purchases
  - coin_wallets, coin_tx
  - moderator_stats_daily, reports, audit_logs
- [ ] **Social Features:**
  - likes (polymorphic), comments, follows, shares
  - tags, content_tags, trending_snapshots
  - notifications, favorites
- [ ] **Chat & Monetization:**
  - creator_chat_settings
  - subscription_tiers, subscriptions, subscription_tx
  - tips, gift_items
  - ppv_messages, ppv_unlocks
  - custom_requests
- [ ] **Referral & Promo:**
  - referral_codes, referral_redemptions
  - promo_codes, promo_redemptions
- [ ] **Agency & Moderation:**
  - agencies, agency_creators, agency_moderators
  - moderator_creator_assignments, moderator_provisions
  - identity_verifications
- [ ] **Blocking & Security:**
  - blocked_users, two_factor_auth
  - platform_settings
- [ ] **Content Erweiterungen:**
  - content_media, content_drafts, scheduled_content
  - dmca_reports
- [ ] **Orchestrator Tables:**
  - scenarios, scenario_steps, scenario_enrollments, scenario_executions
  - message_templates, broadcasts, broadcast_executions
- [ ] Alle Indizes aus FEXORA-010 integrieren
- [ ] Seed-Data: Admin-User, Default Platform-Settings, Default Gift-Items

## Akzeptanzkriterien

- `dotnet ef database update` erstellt alle Tabellen
- Alle Foreign Keys und Constraints korrekt
- Indizes vorhanden (gemaß FEXORA-010)
- Seed-Data wird eingespielt
- Migration ist idempotent

## Abhangigkeiten

- FEXORA-002 (.NET Solution)
- FEXORA-010 (Index-Strategie)
