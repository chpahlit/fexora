# FEXORA-048: Bundles & Collections

**Phase:** 1 — Sprint 2
**Prioritat:** Mittel
**App:** API + Web
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Creator bundeln Content zu Paketen mit Bundle-Preis. Bundles auf Creator-Profil sichtbar.

## Aufgaben

- [ ] **API:**
  - `POST /bundles` — Bundle erstellen
  - `GET /bundles/:id` — Bundle anzeigen
  - `PATCH /bundles/:id` — Bundle bearbeiten
  - `DELETE /bundles/:id` — Bundle loschen
  - `POST /bundles/:id/unlock` — Bundle kaufen (Coin-Abzug)
- [ ] **Bundle-Felder:**
  - title, content_ids[] (Array von Content-IDs)
  - price_coins (Bundle-Preis, guenstiger als Einzelkauf)
  - owner_id (Creator)
- [ ] **Bundle-Logik:**
  - Bundle-Preis muss geringer sein als Summe der Einzelpreise
  - Beim Kauf: Alle enthaltenen Content-Items freischalten
  - Bereits einzeln gekaufte Items abziehen (anteilig)
- [ ] **Web:**
  - Bundle-Card auf Creator-Profil
  - Bundle-Detail: Enthaltene Items, Preis, Ersparnis
  - Unlock-Button
  - Creator-Dashboard: Bundle-Builder (Content auswahlen + Preis setzen)

## Akzeptanzkriterien

- Bundle erstellen mit mehreren Content-Items
- Bundle-Kauf schaltet alle Items frei
- Preis-Ersparnis gegenuber Einzelkauf sichtbar
- Bundle auf Profil sichtbar

## Abhangigkeiten

- FEXORA-032 (Unlock-Flow), FEXORA-035 (Wallet)
