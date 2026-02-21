# FEXORA-039: Chat UI + Tipping im Chat

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch
**App:** Web
**Aufwand:** 20-26h
**Status:** Open

---

## Beschreibung

Chat-Oberflache fur User: Nachrichten-Thread, Chat-Pricing-Info, PPV-Message-Unlock, Tipping-Button mit Gift-Items und Animationen.

## Aufgaben

- [ ] **Chat-Liste:**
  - Thread-Ubersicht (sortiert nach letzter Aktivitat)
  - Ungelesene Nachrichten Badge
  - Online-Status Indikator (gruner Punkt)
  - Suchfunktion in Threads
- [ ] **Chat-Thread:**
  - Nachrichten-Verlauf (paginiert, Scroll-to-Bottom)
  - Text-Eingabe + Emoji-Picker
  - Dateianhang-Upload (Bild/Video)
  - Typing Indicator
  - Read Receipts (Hakchen)
  - Zeitstempel pro Nachricht
- [ ] **Chat-Pricing Anzeige:**
  - Info-Banner oben im Chat: "Kostenlos" / "Einmalig X Coins" / "X Coins pro Nachricht"
  - Unlock-Button (bei Unlock-Modell)
  - Coin-Abzug-Hinweis (bei Pro-Nachricht-Modell)
  - "Guthaben aufladen" Link bei unzureichenden Coins
- [ ] **PPV-Messages:**
  - PPV-Nachricht als spezielle Karte: Preview-Text + Preis + Unlock-Button
  - Nach Unlock: Vollstandiger Inhalt sichtbar
- [ ] **Tipping im Chat:**
  - Tipping-Button neben Chat-Eingabe
  - Freier Coin-Betrag eingeben
  - Gift-Items Auswahl (Grid mit Icons + Preisen)
  - Gift-Animationen (Lottie/CSS) im Chat-Fenster
  - Tip-Bestatigung

## Akzeptanzkriterien

- Chat funktioniert in Echtzeit (keine Verzogerung)
- Chat-Pricing korrekt dargestellt und enforced
- PPV-Messages mit Unlock-Flow
- Tipping mit freiem Betrag und Gift-Items
- Gift-Animationen werden abgespielt
- Responsive Layout (Mobile-First)

## Abhangigkeiten

- FEXORA-038 (Chat API)
- FEXORA-040 (Chat SDK)
- FEXORA-042 (Tipping API)
