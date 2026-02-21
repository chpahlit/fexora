# FEXORA-049: DSGVO Datenexport (Basis)

**Phase:** 1 — Sprint 2
**Prioritat:** Kritisch (rechtlich verpflichtend)
**App:** API + Web
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

DSGVO-konformer Datenexport: User kann alle personlichen Daten als ZIP herunterladen. Rechtlich verpflichtend ab MVP.

## Aufgaben

- [ ] **API:**
  - `GET /me/export` — Datenexport anfordern
  - Async Hangfire Job fur Export-Generierung
  - Export-Inhalt (ZIP):
    - Profil-Daten (JSON)
    - Content-Metadaten (JSON, keine Medien in Basis-Version)
    - Chat-Nachrichten (JSON)
    - Kaufe und Transaktionen (JSON)
    - Abonnements (JSON)
    - Follows, Likes, Kommentare (JSON)
  - Download-Link per E-Mail (IEmailService)
  - Link-Gultigkeit: 24h
- [ ] **Account-Loschung:**
  - `DELETE /me` — Account loschen
  - Soft-Delete + 30-Tage Grace Period
  - Hangfire Job: Nach 30 Tagen hartes Purge
  - Bestatigung per E-Mail
- [ ] **Web UI:**
  - "Daten exportieren" Button in Account-Settings
  - Status-Anzeige: "Export wird erstellt..." / "Download bereit"
  - "Account loschen" mit Bestatigungsdialog + Passwort-Eingabe

## Akzeptanzkriterien

- Datenexport als ZIP wird korrekt erstellt
- Alle personlichen Daten enthalten
- Download-Link per E-Mail zugestellt
- Account-Loschung mit Grace Period funktioniert
- Hartes Purge nach 30 Tagen

## Abhangigkeiten

- FEXORA-011 (Auth), FEXORA-025 (IEmailService)
