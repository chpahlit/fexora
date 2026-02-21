# FEXORA-032: Content-Detail + Unlock-Flow

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** API + Web
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Content-Detail-Seite mit Teaser, Preis-Anzeige, Unlock-Mechanismus, Kommentare, Likes, Teilen, Tags und ahnliche Inhalte.

## Aufgaben

- [ ] **API:**
  - `POST /unlock` — Content unlocken (Coin-Abzug)
  - Unlock-Check: Bereits gekauft? -> Vollzugriff
  - Abo-Check: Aktives Abo mit Zugang? -> Vollzugriff
  - Preis aus `content.price_coins`
  - Coin-Transaktion erstellen (`coin_tx`, type=unlock)
  - Blocking-Check: Kein Unlock von blockierten Creatorn
- [ ] **Web — Content-Detail-Seite:**
  - Teaser/Preview (offentlicher Teil)
  - Preis in Coins + Unlock-Button (fur Paid Content)
  - "Bereits freigeschaltet" Badge
  - "Uber Abo freigeschaltet" Badge
  - Vollstandiger Content nach Unlock/Abo
  - Watermark auf Paid Content (nach Unlock sichtbar)
- [ ] **Social-Aktionen auf Detail-Seite:**
  - Like-Button + Count
  - Kommentar-Sektion (verschachtelt)
  - Share-Button (Link kopieren, Social Media)
  - Tags (klickbar -> Tag-Seite)
- [ ] **Ahnliche Inhalte:**
  - Tag-basierte Empfehlungen (gleicher + andere Creator)
  - "Mehr von diesem Creator" Sektion
- [ ] **Media-Set Darstellung:**
  - Gallery/Slider fur Media-Sets
  - Blur auf alle Medien bei Paid Content

## Akzeptanzkriterien

- Unlock-Flow funktioniert: Coins werden abgezogen, Content wird freigeschaltet
- Abo-basierter Zugang funktioniert (kein Coin-Abzug bei aktivem Abo)
- Teaser korrekt fur nicht-freigeschalteten Content
- Like/Kommentar/Share funktionieren
- Ahnliche Inhalte werden angezeigt

## Abhangigkeiten

- FEXORA-035 (Coin-Wallet), FEXORA-016 (Content), FEXORA-018 (Likes/Kommentare)
