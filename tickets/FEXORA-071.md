# FEXORA-071: QA & Bugfixing (MVP)

**Phase:** 2 — Sprint 4
**Prioritat:** Kritisch
**App:** Alle
**Aufwand:** 40-60h
**Status:** Open

---

## Beschreibung

End-to-End Testing, Performance-Optimierung und Bugfixing vor MVP Go-Live.

## Aufgaben

- [ ] **E2E Tests (Playwright):**
  - Registration + Login + 2FA
  - Content Upload + Review + Approval
  - Content Unlock (Coin-Kauf -> Unlock)
  - Chat (Nachricht senden + empfangen)
  - Subscription (Abonnieren + Content-Zugang)
  - Creator-Dashboard (Basis-Flows)
  - Moderator-Board (Chat im Namen des Creators)
- [ ] **Load-Tests (k6):**
  - Feed-Performance unter Last
  - SignalR Chat unter Last (100+ gleichzeitige Connections)
  - Wallet-Operationen (Race Conditions)
  - Broadcast-Durchsatz
- [ ] **Performance-Optimierung:**
  - Slow Queries identifizieren und optimieren
  - HybridCache Hit-Rate prufen
  - API Response Times < 200ms (P95)
  - Frontend Lighthouse Score > 90
- [ ] **Bugfixing:**
  - Alle kritischen und hohen Bugs fixen
  - Edge Cases in Escrow, Attribution, Blocking testen
  - Cross-Browser Testing (Chrome, Firefox, Safari, Mobile)
- [ ] **Security Audit:**
  - OWASP Top 10 Checks
  - Auth-Flows auf Schwachstellen prufen
  - Rate Limiting verifizieren

## Akzeptanzkriterien

- Alle E2E Tests grun
- Load-Tests zeigen akzeptable Performance
- Keine kritischen Bugs offen
- Security Audit bestanden
- Bereit fur MVP Go-Live

## Abhangigkeiten

- Alle vorherigen Phase 1 + 2 Tickets
