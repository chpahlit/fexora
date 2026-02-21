# FEXORA-069: DSGVO-Vertiefung

**Phase:** 2 — Sprint 4
**Prioritat:** Hoch
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

DSGVO-Erweiterungen: Granulares Consent-Management, Cookie-Banner, Retention-Policies, DPA-Dokumentation.

## Aufgaben

- [ ] **Consent-Management:**
  - Granulare Consent-Flags pro User: Marketing, Analytics, Personalisierung
  - API-Endpoints fur Consent-Update
  - Consent-Status in User-Profil
- [ ] **Cookie-Banner:**
  - Next.js Middleware fur Cookie-Consent
  - Consent-Banner mit Kategorien (Notwendig, Komfort, Marketing)
  - Consent-Flags im User-Profil oder Cookie speichern
- [ ] **Retention-Policies:**
  - Hangfire Jobs fur automatische Datenloschung:
    - Chat-Nachrichten: 2 Jahre
    - Audit-Logs: 5 Jahre
    - Geloschte Accounts: 30 Tage hartes Purge
    - Gelesene Notifications: 6 Monate
    - Feed-Events: 30 Tage
  - Konfigurierbare Retention-Zeitraume
- [ ] **DPA-Dokumentation:**
  - Verzeichnis der Verarbeitungstatigkeiten vorbereiten
  - Auftragsverarbeitungsvertrage dokumentieren (Payment, R2, CDN, E-Mail)

## Akzeptanzkriterien

- Consent-Flags granular verwaltbar
- Cookie-Banner erscheint fur neue Besucher
- Retention-Policies laufen automatisch (Hangfire)
- Daten werden gemaess Retention geloscht

## Abhangigkeiten

- FEXORA-049 (DSGVO Basis)
