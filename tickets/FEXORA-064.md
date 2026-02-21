# FEXORA-064: Attributionslogik (30-Min-Fenster)

**Phase:** 2 — Sprint 4
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Umsatzzuordnung (Attribution) fur Moderatoren: Unlock/Abo-Conversion innerhalb von 30 Minuten nach Moderator-Interaktion wird dem Moderator zugerechnet.

## Aufgaben

- [ ] **Attributions-Service:**
  - `POST /attribution/lock` — Attribution-Lock erstellen (nach Mod-Interaktion)
  - Bei Unlock/Purchase/Subscribe: Prufe ob innerhalb 30-Min-Fenster nach Mod-Interaktion
  - Wenn ja: `purchases.attributed_to_moderator_id` setzen
  - Attribution-Metrics-Endpoint: `GET /attribution/metrics`
- [ ] **30-Minuten-Fenster:**
  - Letzte Mod-Interaktion pro Thread/User tracken
  - Zeitstempel-basierter Check: `NOW() - last_mod_message_at < 30min`
  - Index nutzen: `idx_messages_mod_attr`
- [ ] **Edge Cases:**
  - Mehrere Moderatoren: Letzter Moderator bekommt Attribution
  - User kauft mehrfach in 30 Min: Jeder Kauf wird zugeordnet
  - Moderator wird zwischenzeitlich entfernt: Keine Attribution
  - User interagiert mit Creator direkt (kein Moderator): Keine Attribution
- [ ] **Attribution-Tracking:**
  - `purchases` Tabelle: attributed_to_moderator_id
  - `moderator_stats_daily` Tabelle: revenue_attributed, unlocks
  - Aggregation fur Reports und Provisions-Berechnung

## Akzeptanzkriterien

- Unlock innerhalb 30 Min nach Mod-Nachricht -> Attribution korrekt
- Unlock nach 30 Min -> Keine Attribution
- Mehrere Mods -> Letzter gewinnt
- Attribution-Daten in Reports sichtbar
- Performance: Attribution-Check < 10ms

## Abhangigkeiten

- FEXORA-038 (Chat — sent_by_moderator_id)
- FEXORA-032 (Unlock-Flow)
