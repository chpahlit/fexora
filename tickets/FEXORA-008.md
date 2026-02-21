# FEXORA-008: i18n Setup (next-intl)

**Phase:** 0 — Projekt-Setup
**Prioritat:** Hoch
**App:** Web, ACP, Moderator
**Aufwand:** 4-6h
**Status:** Done

---

## Beschreibung

Internationalisierung mit `next-intl` fur alle Web-Apps. DE + EN von Phase 1 an. Translations zentral in `packages/shared/locales/`.

## Aufgaben

- [ ] `next-intl` in allen 3 Apps installieren und konfigurieren
- [ ] Routing: `/de/...`, `/en/...` mit Locale-Prefix
- [ ] Middleware fur Locale-Detection (Browser-Sprache, Cookie)
- [ ] Default-Locale: `de`
- [ ] Translations-Struktur in `packages/shared/locales/`:
  - `de/common.json`, `de/auth.json`, `de/content.json`, etc.
  - `en/common.json`, `en/auth.json`, `en/content.json`, etc.
- [ ] `useTranslations()` Hook-Beispiel in einer Seite
- [ ] Sprach-Umschalter Komponente (DE/EN Toggle)

## Akzeptanzkriterien

- Alle Apps rendern auf `/de/` und `/en/`
- Texte kommen aus JSON-Translations, nicht hardcoded
- Sprach-Umschalter wechselt Locale
- Neue Translations konnen in `packages/shared/locales/` hinzugefugt werden

## Abhangigkeiten

- FEXORA-003 (Next.js Apps)
- FEXORA-004 (Shared Package fur Locales)
