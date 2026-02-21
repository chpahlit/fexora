# FEXORA-005: Docker Compose Dev-Umgebung

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** DevOps
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

Docker Compose Konfiguration fur die lokale Entwicklungsumgebung. Infrastruktur-Services (DB, Cache, Storage) als Container, Apps laufen lokal.

## Aufgaben

- [ ] `docker/docker-compose.dev.yml` erstellen
  - PostgreSQL 17 (Port 5432)
  - Redis 7 (Port 6379)
  - MinIO (S3-kompatibel, Port 9000) fur lokale Media-Uploads
- [ ] `.env.example` aktualisieren mit allen Environment Variables
- [ ] Health-Checks fur alle Services
- [ ] Volumes fur persistente Daten (`pgdata`, `redisdata`, `miniodata`)
- [ ] Init-Script fur MinIO Bucket-Erstellung
- [ ] Dokumentation in README: `docker compose -f docker/docker-compose.dev.yml up`

## Akzeptanzkriterien

- `docker compose up` startet alle Infrastruktur-Services
- PostgreSQL erreichbar und DB `fexora` erstellt
- Redis erreichbar mit Passwort
- MinIO erreichbar, Bucket `fexora-media` vorhanden
- `.env.example` enthalt alle benotigten Variablen

## Abhangigkeiten

- FEXORA-001 (Monorepo-Struktur)
