# FEXORA-067: Vergutungs-Engine (Provision)

**Phase:** 2 — Sprint 4
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 12-16h
**Status:** Open

---

## Beschreibung

Provisions-Berechnung fur Moderatoren: Admin-konfigurierbare Prozentsatze pro Vergutungstyp. Rein umsatzbasiert.

## Aufgaben

- [ ] **Provisions-Berechnung:**
  - Bei jedem attribuierten Umsatz: Provision berechnen
  - `moderator_provisions` Tabelle: moderator_id, type, amount_coins, percentage_applied, source_tx_id
  - Vergutungstypen: unlock, chat, subscription, tip, ppv, custom_request
- [ ] **Admin-Konfiguration:**
  - Pro Vergutungstyp: % im ACP einstellbar
  - `platform_settings`: mod_provision_unlock_pct, mod_provision_chat_pct, etc.
  - Defaults definieren
- [ ] **Berechnung:**
  - Trigger: Nach erfolgreicher Attribution
  - Provision = Zugerechneter Umsatz x Provision-%
  - Eintrag in `moderator_provisions`
  - Aggregation in `moderator_stats_daily.provision_earned`
- [ ] **Auszahlung:**
  - Provisionen werden an Agency ausgezahlt (Gesamtbetrag)
  - Agency verteilt intern (ausserhalb der Plattform)
  - Plattform trackt pro Moderator fur Transparenz

## Akzeptanzkriterien

- Provision korrekt berechnet fur jeden Vergutungstyp
- Admin kann Prozentsatze im ACP andern
- Provisions-Historie vollstandig
- Aggregation in Daily Stats korrekt

## Abhangigkeiten

- FEXORA-064 (Attribution), FEXORA-053 (Platform Settings)
