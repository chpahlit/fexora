# FEXORA-052: User/Creator-Verwaltung

**Phase:** 2 — Sprint 3
**Prioritat:** Hoch
**App:** ACP
**Aufwand:** 14-18h
**Status:** Open

---

## Beschreibung

Admin-Bereich fur User- und Creator-Management: Rollen zuweisen, Sperren, Shadowban, Limits setzen, Suche.

## Aufgaben

- [ ] **User-Liste:**
  - Paginierte User-Tabelle mit Suche und Filtern
  - Filter: Rolle, Status (aktiv/gesperrt/shadowbanned), Registration-Datum
  - Sortierung: Neueste, Aktivste, Umsatz
- [ ] **User-Detail:**
  - Profil-Informationen
  - Rolle andern (User -> Creator, etc.)
  - Status: Aktiv / Gesperrt / Shadowbanned
  - Account-Limits setzen (Upload-Limit, Message-Limit)
  - Agency-Zugehorigkeit anzeigen
  - Aktivitats-Log (letzte Aktionen)
  - Identity-Verification Status
- [ ] **Aktionen:**
  - Rolle zuweisen/entziehen
  - User sperren (mit Grund)
  - Shadowban (User sieht eigene Inhalte, andere nicht)
  - Limits setzen/aufheben
  - 2FA zurucksetzen (Admin-Aktion)
  - Passwort-Reset erzwingen

## Akzeptanzkriterien

- User durchsuchbar und filterbar
- Rollen-Zuweisung funktioniert
- Sperren/Shadowban wirkt sofort
- Nur Admins haben Zugriff

## Abhangigkeiten

- FEXORA-011 (Auth + Rollen), FEXORA-003 (ACP App)
