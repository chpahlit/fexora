# FEXORA-063: Agency-Verwaltung (Admin)

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 8-12h
**Status:** Open

---

## Beschreibung

Admin-Bereich fur Agency-Verwaltung: Agencies anlegen/sperren, externe Creator zuweisen, Agency-Umsatze einsehen.

## Aufgaben

- [ ] **Agency-Liste:**
  - Alle Agencies mit Status, Owner, Creator-Anzahl, Moderator-Anzahl
  - Filter: Status (aktiv/gesperrt), Umsatz
- [ ] **Agency-Detail:**
  - Agency-Info bearbeiten
  - Status andern (aktiv/gesperrt)
  - Creator-Ubersicht (eigene + zugewiesene)
  - Moderator-Ubersicht
- [ ] **Externe Creator zuweisen:**
  - Creator-Suche (die nicht der Agency gehoren)
  - Creator einer Agency zuweisen
  - Zuweisung entfernen
- [ ] **Agency-Umsatze:**
  - Umsatz pro Agency
  - Aufschlusselung nach Creator und Moderator
  - Zeitraum-Filter

## Akzeptanzkriterien

- Agencies anlegen und sperren funktioniert
- Externe Creator-Zuweisung funktioniert
- Umsatz-Ubersicht korrekt
- Sperrung deaktiviert alle Agency-Aktionen

## Abhangigkeiten

- FEXORA-061 (Agency API), FEXORA-020 (ACP Basis)
