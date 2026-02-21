# FEXORA-045: Referral-System

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Zwei Referral-Programme: User-wirbt-User (Bonus-Coins) und Creator-wirbt-Creator (%-Provision auf Einnahmen).

## Aufgaben

- [ ] **API-Endpoints:**
  - `GET /referral/code` — Eigenen Referral-Code abrufen
  - `POST /referral/redeem` — Referral-Code einlosen
  - `GET /referral/stats` — Referral-Statistiken
  - `DELETE /admin/referral-codes/:id` — Admin sperrt Code
- [ ] **User-wirbt-User:**
  - Einzigartiger Referral-Code pro User
  - Code bei Registrierung eingeben
  - Bonus-Coins fur beide Seiten (Betrag Admin-konfigurierbar)
  - Anti-Abuse: Nur bei verifiziertem Account, max N Referrals/Monat
- [ ] **Creator-wirbt-Creator:**
  - Separater Creator-Referral-Code
  - Werbender Creator erhalt %-Provision auf Einnahmen des Geworbenen
  - Provision zeitlich begrenzt (z.B. 6 Monate, Admin-konfigurierbar)
  - Transparente Stats im Creator-Dashboard
- [ ] **Web UI:**
  - Referral-Code Anzeige + Kopier-Button
  - Einladungs-Link generieren
  - Stats-Seite: Geworbene User, Bonus erhalten, Provision
  - Referral-Code Eingabe bei Registration
- [ ] **Admin:**
  - Referral-Konfiguration im ACP (Bonus-Betrage, Limits, Laufzeit)
  - Codes sperren bei Missbrauch

## Akzeptanzkriterien

- User-Referral: Bonus-Coins bei Registrierung fur beide Seiten
- Creator-Referral: Provision korrekt berechnet
- Anti-Abuse Massnahmen aktiv
- Stats korrekt im Dashboard
- Admin kann Konfiguration andern und Codes sperren

## Abhangigkeiten

- FEXORA-035 (Wallet — Bonus-Coins)
- FEXORA-011 (Auth — Registration mit Code)
