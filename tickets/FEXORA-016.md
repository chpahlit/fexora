# FEXORA-016: Content-Upload + Media-Sets

**Phase:** 1 — Sprint 1
**Prioritat:** Kritisch
**App:** API
**Aufwand:** 25-35h
**Status:** Done

---

## Beschreibung

Content-Upload System mit Multi-Typ-Support (Bild/Video/Audio/Text), Media-Sets (1-N Medien pro Content), R2/S3 Storage und Media-Pipeline.

## Aufgaben

- [ ] **Upload-Endpoints:**
  - `POST /content` — Neuen Content erstellen (mit Media-Upload)
  - `GET /content/:id` — Content abrufen
  - `POST /content/:id/submit` — Draft zur Review einreichen
  - `DELETE /content/:id` — Content loschen (Soft Delete)
- [ ] **Media-Pipeline (Background Jobs):**
  - Upload-Validierung: Magic-Byte-Check, MIME-Whitelist, Max-Size
    - Bilder: jpg/png/webp, max 20 MB
    - Video: mp4/mov, max 500 MB
    - Audio: mp3/m4a/wav, max 100 MB
  - S3 Upload (Original -> Raw-Bucket)
  - Hangfire Background Jobs:
    - Bilder: Thumbnail + Blur-Preview (Gaussian Blur Radius 30-40)
    - Video: HLS-Transcoding (480p + 720p, h.264) + Thumbnail + Blur
    - Audio: MP3-Normalisierung + 10s-Preview-Clip
    - Text: Teaser-Extraktion (erster Absatz)
  - Processed Files -> Public-Bucket (CDN)
  - DB Update: URLs, Status = ready
- [ ] **Media-Sets:**
  - `content_media` Tabelle (content_id, media_url, media_type, sort_order)
  - Ein Content kann 1-N Medien haben
  - Max-Anzahl Admin-konfigurierbar (`platform_settings.media_set_max_items`)
- [ ] **Content-Felder:**
  - type (image/video/audio/text)
  - title, cover_url, blur_preview_url
  - price_coins (0 = kostenlos)
  - visibility (public/followers_only/paid)
  - comment_mode (all/followers/disabled)
  - Tags/Hashtags (content_tags Relation)
- [ ] **Drafts:**
  - `content_drafts` Tabelle (owner_id, draft_data_json)
  - `GET /content/drafts` — Eigene Drafts auflisten
  - `PATCH /content/drafts/:id` — Draft bearbeiten
  - `DELETE /content/drafts/:id` — Draft loschen
- [ ] IStorageService Interface (S3-kompatibel, Cloudflare R2)

## Akzeptanzkriterien

- Upload aller Medientypen funktioniert
- Media-Pipeline verarbeitet Uploads im Hintergrund
- Blur-Previews werden fur Paid Content generiert
- Media-Sets mit mehreren Dateien moglich
- Drafts konnen gespeichert und bearbeitet werden
- Magic-Byte-Check lehnt ungultige Dateien ab

## Abhangigkeiten

- FEXORA-011 (Auth — nur eingeloggte Creator)
- FEXORA-005 (Docker — MinIO fur lokale Entwicklung)
