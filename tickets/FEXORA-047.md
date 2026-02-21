# FEXORA-047: Mass-Messaging

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Creator sendet Nachricht an alle Follower/Subscriber (oder Segmente). Hangfire Batch-Versand mit Rate Limiting.

## Aufgaben

- [ ] **API:**
  - `POST /creator/mass-message` — Mass-Message erstellen + senden
  - Felder: message_text, segment (all_followers / all_subscribers / custom)
  - Segment-Filter: Follower, Subscriber (Tier X), letzte Aktivitat
- [ ] **Hangfire Batch-Versand:**
  - Empfanger ermitteln (basierend auf Segment)
  - Batch-Versand: 1.000 User pro Batch
  - Throttling zwischen Batches
  - Messages in `messages` Tabelle als regulare Chat-Nachrichten
- [ ] **Rate Limiting:**
  - Max. 1 Mass-Message pro Creator pro Stunde (Admin-konfigurierbar)
  - Globaler Limiter pro Plattform
- [ ] **Web (Creator-Dashboard):**
  - Mass-Message Formular: Text + Segment-Auswahl
  - Vorschau: Anzahl Empfanger
  - Sende-Bestatigung
  - Historie gesendeter Mass-Messages
- [ ] **Blocking-Respektierung:**
  - Blockierte User erhalten keine Mass-Messages

## Akzeptanzkriterien

- Mass-Message wird an alle ausgewahlten Empfanger zugestellt
- Rate Limit: Max 1 pro Stunde
- Batch-Versand ohne Server-Uberlastung
- Blockierte User ausgeschlossen
- Segment-Filterung funktioniert

## Abhangigkeiten

- FEXORA-038 (Chat), FEXORA-015 (Follow + Blocking)
