# FEXORA-053: Pricing / Policy

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Admin-Bereich fur Pricing-Regeln, Content-Policies, Wortfilter und Platform-Settings.

## Aufgaben

- [ ] **Platform-Settings UI:**
  - Key-Value Editor fur alle `platform_settings`
  - Gruppiert nach Kategorie:
    - **Monetarisierung:** Mod-Provision %, Chat-Preisgrenzen, Payout-Minimum
    - **Coin-Packs:** Pack-Konfiguration (Preise)
    - **Tipping:** Min/Max Coins
    - **PPV:** Min/Max Preis
    - **Rate Limits:** Likes, Comments, Follows, Messages pro Tag
    - **Referral:** Bonus-Coins, Creator-Provision %, Laufzeit
    - **Content:** Media-Set Max Items
    - **Plattform-Fee:** % pro Einnahmetyp
  - Anderungshistorie (wer hat wann was geandert)
- [ ] **Kategorien-Whitelist:**
  - Erlaubte Content-Kategorien verwalten
- [ ] **Wortfilter:**
  - Blacklist-Worter verwalten (CRUD)
  - Automatisches Flagging bei Match
- [ ] **Chat-Preisgrenzen:**
  - Min/Max fur Unlock-Preis
  - Min/Max fur Pro-Nachricht-Preis

## Akzeptanzkriterien

- Alle Platform-Settings uber UI anpassbar
- Anderungen wirken sofort
- Wortfilter funktioniert in Kommentaren + Chat
- Anderungshistorie nachvollziehbar

## Abhangigkeiten

- FEXORA-020 (ACP Basis)
