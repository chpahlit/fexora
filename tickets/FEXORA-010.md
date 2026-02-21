# FEXORA-010: DB-Index-Strategie in initialer Migration

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** API
**Aufwand:** 3-4h
**Status:** Open

---

## Beschreibung

Alle kritischen Datenbank-Indizes von Anfang an in der initialen EF Core Migration anlegen. Verhindert Performance-Probleme bei wachsender Datenmenge.

## Aufgaben

- [ ] Folgende Indizes in EF Core Migration anlegen:
  - `idx_content_feed` — Feed-Performance (owner_id, status, visibility, created_at DESC)
  - `idx_trending` — Trending-Snapshots (entity_type, period, snapshot_date DESC)
  - `idx_messages_mod_attr` — Moderator-Attribution (sent_by_moderator_id, created_at DESC) — Partial Index
  - `idx_notifications_user` — Notifications (user_id, read_at, created_at DESC)
  - `idx_blocked_unique` — Blocking Unique (blocker_id, blocked_id)
  - `idx_blocked_reverse` — Blocking Reverse (blocked_id)
  - `idx_subscriptions_check` — Abo-Zugangs-Check (user_id, creator_id, status)
  - `idx_coin_tx_user` — Coin-Transaktionen (user_id, created_at DESC)
  - `idx_comments_content` — Kommentare (content_id, parent_id, created_at)
  - `idx_content_tags_tag` — Tags-Discovery (tag_id)
  - `idx_content_fts` — Full-Text-Search Content (GIN, tsvector german)
  - `idx_profiles_fts` — Full-Text-Search Profile (GIN, tsvector german)
  - `idx_content_approved` — Partial Index (status = 'approved')
  - `idx_content_pending` — Partial Index (status = 'pending')
- [ ] Partitionierungs-Strategie dokumentieren (messages, coin_tx, notifications, audit_logs)

## Akzeptanzkriterien

- Alle genannten Indizes existieren nach Migration
- `EXPLAIN ANALYZE` auf typische Queries zeigt Index-Nutzung
- Partitionierungs-Strategie dokumentiert (Umsetzung in spateren Sprints)

## Abhangigkeiten

- FEXORA-002 (.NET Solution)
- FEXORA-022 (EF Core Migrations — eng verzahnt)
