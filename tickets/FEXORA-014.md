# FEXORA-014: Profilseite UI

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** Web
**Aufwand:** 16-20h
**Status:** Done

---

## Beschreibung

Profilseite fur User und Creator mit allen relevanten Informationen, Content-Grid, Follow-Button und Block-Funktion.

## Aufgaben

- [ ] **Profil-Header:**
  - Avatar, Username, Bio, Country
  - Badges (Verified, Top Creator, etc.)
  - Follower/Following Count (klickbar -> Listen)
  - `offers_custom` Badge (Custom Requests verfugbar)
- [ ] **Action-Buttons:**
  - Follow/Unfollow Button
  - Chat-CTA mit Preis-Info (Free/Unlock X Coins/Pro Nachricht)
  - Block/Unblock Button (im Menue versteckt)
  - Melden-Button
- [ ] **Content-Grid:**
  - Gemischtes Grid mit Filter-Tabs (Alle/Bilder/Videos/Audio/Text)
  - Public Content: normal sichtbar
  - Follower-Only: Badge-Indikator
  - Paid Content: Blur-Preview + Preis-Tag in Coins
  - Pinned Posts oben
- [ ] **Abo-Stufen Anzeige:**
  - Verfugbare Abo-Stufen des Creators
  - Abonnieren-CTA pro Stufe
  - Aktueller Abo-Status (wenn abonniert)
- [ ] **Follower/Following Listen:**
  - Paginierte User-Listen
  - Follow-Button in der Liste
- [ ] **Eigenes Profil bearbeiten:**
  - Edit-Button (nur auf eigenem Profil)
  - Inline-Editing oder Modal
- [ ] **Block-Logik:**
  - Blockierte Profile zeigen "Blockiert" statt Inhalt
  - Blockliste unter `/me/blocked-users`

## Akzeptanzkriterien

- Profil ladt korrekt mit allen Daten
- Follow/Unfollow funktioniert in Echtzeit
- Content-Grid zeigt korrekte Sichtbarkeits-Indikatoren
- Block/Unblock funktioniert, blockierte Profile nicht sichtbar
- Responsive Layout (Mobile + Desktop)

## Abhangigkeiten

- FEXORA-013 (Profil API)
- FEXORA-015 (Follow + Blocking API)
- FEXORA-007 (Design Theme)
