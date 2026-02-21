# FEXORA-070: Watermarking (Steganographie)

**Phase:** 2 — Sprint 4
**Prioritat:** Mittel
**App:** API
**Aufwand:** 10-14h
**Status:** Open

---

## Beschreibung

Unsichtbare digitale Wasserzeichen auf Paid Content: Steganographischer Fingerprint mit User-ID + Timestamp. Ruckverfolgbar bei Leaks.

## Aufgaben

- [ ] **Watermark-Service:**
  - Steganographie-Algorithmus: Unsichtbarer Fingerprint in Bild-Pixeln
  - Payload: User-ID + Content-ID + Timestamp
  - Nur auf Paid Content (price_coins > 0)
  - Nur beim Ausliefern an User (nicht auf Original)
- [ ] **Implementierung:**
  - Bilder: LSB (Least Significant Bit) Steganographie
  - Video: Frame-basiertes Watermarking (erster + letzter Frame)
  - Audio: Spectral Watermarking (unhorbarer Frequenzbereich)
- [ ] **Integration in Media-Pipeline:**
  - Watermark wird beim Content-Abruf dynamisch angewendet
  - ODER: Pre-generated per User (bei haufigem Zugriff)
  - CDN-kompatibel (Watermark vor CDN-Cache)
- [ ] **Leak-Detection:**
  - Tool zum Extrahieren des Watermarks aus geleaktem Content
  - User-ID + Timestamp ruckverfolgbar
  - Admin-Tool im ACP (Datei hochladen -> Watermark lesen)

## Akzeptanzkriterien

- Watermark visuell nicht erkennbar
- Watermark uberlebt leichte Kompression
- User-ID aus geleaktem Content extrahierbar
- Nur auf Paid Content angewendet
- Performance: Watermark-Anwendung < 100ms pro Bild

## Abhangigkeiten

- FEXORA-016 (Content/Media-Pipeline)
