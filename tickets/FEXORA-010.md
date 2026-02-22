# FEXORA-010: DB-Index-Strategie in initialer Migration

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** API
**Aufwand:** 3-4h
**Status:** Done

---

## Beschreibung

Alle kritischen Datenbank-Indizes von Anfang an in der initialen EF Core Migration anlegen. Verhindert Performance-Probleme bei wachsender Datenmenge.

## Aufgaben

- [x] Basis-Indizes vorhanden (aus Migrations):
  - ✅ IX_Contents_CreatedAt, IX_Contents_OwnerId, IX_Contents_Status
  - ✅ IX_CreditTransactions_CreatedAt, IX_CreditTransactions_UserId
  - ✅ IX_Messages_CreatedAt, IX_Messages_SenderId, IX_Messages_ThreadId
  - ✅ IX_Profiles_Username (unique)
  - ✅ IX_Purchases_BuyerId, IX_Purchases_ContentId, IX_Purchases_CreatedAt
  - ✅ IX_RefreshTokens_ExpiresAt, IX_RefreshTokens_Token
  - ✅ IX_Agencies_Name, IX_Agencies_OwnerId
  - ✅ IX_ModeratorCompensations_CalculatedAt, IX_ModeratorCompensations_ModeratorId
- [x] Spezialisierte Indizes (Migration Sprint5_SpecializedIndexes):
  - ✅ `idx_content_feed` — Composite Feed-Index (OwnerId, Status, CreatedAt DESC)
  - ✅ `idx_trending` — Trending-Snapshots (EntityType, Period, SnapshotDate DESC)
  - ✅ `idx_notifications_user` — Notifications (UserId, ReadAt, CreatedAt DESC)
  - ✅ `idx_blocked_unique` — Blocking Unique (via EF HasIndex in Sprint5_AllMissingTables)
  - ✅ `idx_subscriptions_check` — Abo-Zugangs-Check (UserId, CreatorId, Status)
  - ✅ `idx_comments_content` — Kommentare (via EF composite in Sprint5_AllMissingTables)
  - ✅ `idx_content_tags_tag` — Tags-Discovery (via EF in Sprint5_AllMissingTables)
  - ✅ `idx_content_fts` — Full-Text-Search Content (GIN, tsvector german)
  - ✅ `idx_profiles_fts` — Full-Text-Search Profile (GIN, tsvector german)
  - ✅ `idx_content_approved` — Partial Index (Status = 'Approved')
  - ✅ `idx_content_pending` — Partial Index (Status = 'Pending')
  - ✅ `idx_coin_tx_user` — Coin-Transaktionen (UserId, CreatedAt DESC)
- [ ] Partitionierungs-Strategie dokumentieren (verschoben auf Pre-Launch Optimierung)

## Akzeptanzkriterien

- ✅ Alle genannten Indizes existieren nach Migration
- ⏳ `EXPLAIN ANALYZE` nach DB-Setup verifizieren
- ⏳ Partitionierungs-Strategie dokumentiert (Umsetzung in spateren Sprints)

## Abhangigkeiten

- FEXORA-002 (.NET Solution) ✅
- FEXORA-022 (EF Core Migrations) ✅
