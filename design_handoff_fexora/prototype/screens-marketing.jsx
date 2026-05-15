// Marketing Landing Pages — 2 Varianten in Browser-Frame
// A. Editorial Masthead — magazine-style hero portrait + sections
// B. Boutique Gallery — masonry-style hero, creator gallery led

// ─────────────────────────────────────────────────────────────
// Minimal Fexora-themed browser chrome (dark, neutral)
// ─────────────────────────────────────────────────────────────
function FBrowser({ url = 'fexora.com', children, width = 1480, height = 920 }) {
  return (
    <div style={{
      width, height, borderRadius: 12, overflow: 'hidden',
      background: '#0a0807',
      boxShadow: `0 0 0 1px ${F.hair}, 0 30px 80px rgba(0,0,0,0.5)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: F.sans,
    }}>
      {/* Title bar */}
      <div style={{ height: 36, background: '#15110d', display: 'flex', alignItems: 'center', padding: '0 14px', flexShrink: 0, borderBottom: `1px solid ${F.hair}` }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff6b5b' }}/>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#febc2e' }}/>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#28c63e' }}/>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ height: 26, padding: '0 18px', borderRadius: 13, background: '#0a0807', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, minWidth: 360 }}>
            <Icon name="lock" size={11} color={F.gold}/>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{url}</span>
          </div>
        </div>
        <div style={{ width: 60 }}/>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: F.bg }}>{children}</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// VARIANT A — EDITORIAL MASTHEAD
// Big serif headline, hero portrait, refined sections.
// ═════════════════════════════════════════════════════════════
function LandingEditorial() {
  return (
    <FBrowser url="fexora.com">
      <div style={{ height: '100%', overflow: 'auto', background: F.bg }}>
        <MarketingNav transparent/>

        {/* HERO */}
        <section style={{ position: 'relative', minHeight: 760, padding: '120px 56px 80px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left: copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 36, height: 1, background: F.gold }}/>
              <FlameMark size={14}/>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3.5, textTransform: 'uppercase' }}>Membership · 18+</div>
            </div>
            <h1 style={{ fontFamily: F.serif, fontSize: 84, color: F.text, fontWeight: 400, lineHeight: 0.96, letterSpacing: -2, margin: 0, marginBottom: 16 }}>
              Eine Welt für<br/>
              <span style={{ fontStyle: 'italic', color: F.gold }}>seltene</span> Geschichten.
            </h1>
            <p style={{ fontFamily: F.serif, fontSize: 22, color: F.textMuted, lineHeight: 1.5, fontStyle: 'italic', maxWidth: 540, margin: '0 0 36px' }}>
              Bilder, Clips, Hörspiele und Stories — kuratiert, signiert, à la carte.
              Direkt aus dem Atelier der Creatoren.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <FButton variant="primary" size="lg">Konto erstellen</FButton>
              <FButton variant="secondary" size="lg">Atelier ansehen →</FButton>
            </div>
            <div style={{ display: 'flex', gap: 32, fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color={F.gold}/> Keine Abos</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color={F.gold}/> Anonym kuratieren</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color={F.gold}/> Pseudonymes Profil</span>
            </div>
          </div>

          {/* Right: hero portrait collage */}
          <div style={{ position: 'relative', height: 600 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '78%', height: '78%' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <FImage seed={0} w="100%" h="100%" locked="gold"/>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '52%', height: '50%' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <FImage seed={1} w="100%" h="100%" locked="blur"/>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '38%', left: '8%', width: '36%', height: '32%' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }}>
                <FImage seed={2} w="100%" h="100%" locked="mosaic"/>
              </div>
            </div>
            {/* Credit chip */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '6px 12px 6px 6px', borderRadius: 100, background: 'rgba(10,8,7,0.7)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'inset 0 0 0 0.5px rgba(212,165,116,0.3)' }}>
              <FAvatar name="Liora" size={20}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.text }}>Liora · Atelier I</span>
              <FCreatorBadge kind="verified" size={11}/>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <section style={{ borderTop: `1px solid ${F.hair}`, borderBottom: `1px solid ${F.hair}`, padding: '24px 56px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 56, opacity: 0.8 }}>
            {['EDITORIAL', 'MAISON LIORA', 'BOUTIQUE EDITION', 'MIRA · HÖRSPIEL', 'ATELIER 12', 'ÉDITION PRIVÉE', 'ESMÉ VAUCLAIR', 'KAPITEL III'].map((t, i) => (
              <span key={i} style={{ fontFamily: F.serif, fontSize: 18, color: i % 3 === 0 ? F.gold : F.textMuted, letterSpacing: 4, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                · {t}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED CREATORS — editorial 3-column */}
        <section style={{ padding: '100px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>· Diese Woche im Atelier</div>
              <h2 style={{ fontFamily: F.serif, fontSize: 56, color: F.text, fontWeight: 400, lineHeight: 1, letterSpacing: -1, margin: 0 }}>
                Drei Stimmen.<br/>
                <span style={{ fontStyle: 'italic', color: F.gold }}>Ein langsamer Abend.</span>
              </h2>
            </div>
            <div style={{ flex: 1 }}/>
            <a style={{ fontFamily: F.sans, fontSize: 13, color: F.gold, textDecoration: 'underline', textUnderlineOffset: 4 }}>Alle Creatoren →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {[
              { n: 'Liora', t: 'Atelier I — Stille', seed: 0, sub: 'Wien · Kerzenlicht' },
              { n: 'Esmé Vauclair', t: 'Im Spiegelsalon', seed: 1, sub: 'Paris · Akt I — III' },
              { n: 'Mira Aurum', t: 'Das letzte Atelier', seed: 2, sub: 'Hörspiel · 24 min' },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ position: 'relative', height: 420, borderRadius: 6, overflow: 'hidden', marginBottom: 18 }}>
                  <FImage seed={c.seed} h={420} locked={['blur','gold','dark'][i]}/>
                  <div style={{ position: 'absolute', top: 14, left: 14 }}>
                    <FBadge tone="gold">Nº 0{i + 1}</FBadge>
                  </div>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>{c.sub}</div>
                <div style={{ fontFamily: F.serif, fontSize: 26, color: F.text, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.2, marginBottom: 10 }}>„{c.t}"</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FAvatar name={c.n} size={28}/>
                  <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>{c.n}</span>
                  <FCreatorBadge kind="verified" size={12}/>
                  <FCreatorBadge kind="voice" size={12}/>
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontFamily: F.serif, fontSize: 16, color: F.gold, fontWeight: 600 }}>{[24, 48, 18][i]} 🔥</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW FLAMES WORK — 4 columns */}
        <section style={{ padding: '80px 56px', background: '#0d0a08', borderTop: `1px solid ${F.hair}`, borderBottom: `1px solid ${F.hair}` }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 30, height: 1, background: F.gold }}/>
              <FlameMark size={14}/>
              <div style={{ width: 30, height: 1, background: F.gold }}/>
            </div>
            <h2 style={{ fontFamily: F.serif, fontSize: 48, color: F.text, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>
              Wie <span style={{ fontStyle: 'italic', color: F.gold }}>Flames</span> funktionieren.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
            {[
              { n: 'I', t: 'Lade auf', d: 'Wähle ein Flame-Paket. Indirekte Altersprüfung über dein Zahlungsmittel — kein Ausweis nötig.' },
              { n: 'II', t: 'Entdecke', d: 'Folge Creatoren, sieh Vorschauen mit Blur, Mosaik oder Goldfilter.' },
              { n: 'III', t: 'Schalte frei', d: 'Mit Flames einzelne Werke, Bundles oder ganze Akte freischalten. Dauerhaft in deiner Sammlung.' },
              { n: 'IV', t: 'Bleibe nah', d: 'Mit Voice-Recht im Chat: persönlich, privat, kuratiert.' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: F.serif, fontSize: 64, color: F.gold, fontWeight: 400, fontStyle: 'italic', lineHeight: 1, marginBottom: 14, opacity: 0.4 }}>{s.n}</div>
                <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, marginBottom: 10 }}>{s.t}</div>
                <div style={{ fontFamily: F.sans, fontSize: 13, color: F.textMuted, lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* QUOTE */}
        <section style={{ padding: '100px 56px', textAlign: 'center' }}>
          <FlameMark size={26}/>
          <div style={{ fontFamily: F.serif, fontSize: 38, color: F.text, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.3, letterSpacing: -0.4, maxWidth: 900, margin: '30px auto 24px' }}>
            „Fexora hat keinen Algorithmus.<br/>
            Es gibt nur Zeit, Licht und die Wahl der Bilder."
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase' }}>— Liora Noir, Atelier I</div>
        </section>

        {/* CTA */}
        <section style={{ padding: '40px 56px 100px' }}>
          <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', padding: '80px 56px', background: 'radial-gradient(80% 100% at 30% 0%, rgba(212,165,116,0.2), transparent 60%), #14110d', boxShadow: `inset 0 0 0 1px ${F.hairStrong}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Beitreten</div>
                <h2 style={{ fontFamily: F.serif, fontSize: 56, color: F.text, fontWeight: 400, lineHeight: 1, letterSpacing: -1, margin: 0, marginBottom: 20 }}>
                  Komm ins <span style={{ fontStyle: 'italic', color: F.gold }}>Atelier</span>.
                </h2>
                <p style={{ fontFamily: F.sans, fontSize: 15, color: F.textMuted, lineHeight: 1.6, maxWidth: 480, margin: '0 0 32px' }}>
                  Erstelle dein Konto in unter zwei Minuten. Anonym, pseudonym, sicher. Kein Abo — du zahlst nur, was dir wirklich gefällt.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <FButton variant="primary" size="lg">Konto erstellen</FButton>
                  <FButton variant="ghost" size="lg">Mehr erfahren →</FButton>
                </div>
              </div>
              <div style={{ position: 'relative', height: 280 }}>
                <FlameMark size={240} color={F.gold}/>
                <div style={{ position: 'absolute', top: 30, right: 10, opacity: 0.3, fontFamily: F.serif, fontSize: 220, color: F.gold, lineHeight: 0.8, letterSpacing: -10, fontStyle: 'italic' }}>F</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '40px 56px', borderTop: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 32 }}>
          <FexoraLogo height={18}/>
          <div style={{ flex: 1, display: 'flex', gap: 24, fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>
            <a>AGB</a>
            <a>Datenschutz</a>
            <a>Creator werden</a>
            <a>Support</a>
            <a>Impressum</a>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textFaint }}>© 2026 Fexora · 18+ only</div>
        </footer>
      </div>
    </FBrowser>
  );
}

// ═════════════════════════════════════════════════════════════
// VARIANT B — BOUTIQUE GALLERY
// Gallery-first hero, masonry, creator showcase upfront.
// ═════════════════════════════════════════════════════════════
function LandingBoutique() {
  return (
    <FBrowser url="fexora.com">
      <div style={{ height: '100%', overflow: 'auto', background: F.bg }}>
        <MarketingNav transparent/>

        {/* HERO — split with gallery preview on right */}
        <section style={{ position: 'relative', padding: '120px 56px 60px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center', minHeight: 700 }}>
          <div>
            <FBadge tone="gold" style={{ marginBottom: 24 }}>· Maison · 18+ ·</FBadge>
            <h1 style={{ fontFamily: F.serif, fontSize: 96, color: F.text, fontWeight: 400, lineHeight: 0.92, letterSpacing: -3, margin: 0, marginBottom: 22, fontStyle: 'italic' }}>
              Eine private<br/><span style={{ color: F.gold }}>Galerie.</span>
            </h1>
            <p style={{ fontFamily: F.sans, fontSize: 17, color: F.textMuted, lineHeight: 1.55, maxWidth: 480, margin: '0 0 32px' }}>
              Bilder, Clips, Hörspiele und Stories aus kuratierten Ateliers. Pro Werk, nicht pro Monat. Privat, signiert, ehrlich.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
              <FButton variant="primary" size="lg" icon="unlock">Eintritt — 18+</FButton>
              <FButton variant="ghost" size="lg">Vorschau</FButton>
            </div>
            <div style={{ display: 'flex', gap: 40, paddingTop: 28, borderTop: `1px solid ${F.hair}` }}>
              <div>
                <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500 }}>614</div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Creators</div>
              </div>
              <div>
                <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500 }}>24k</div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Werke</div>
              </div>
              <div>
                <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500 }}>4.9 ★</div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Bewertung</div>
              </div>
            </div>
          </div>

          {/* Gallery masonry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '110px', gap: 10 }}>
            <div style={{ gridRow: 'span 3', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <FImage seed={0} w="100%" h={340} locked="blur"/>
              <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                <FBadge tone="dark">Akt I</FBadge>
              </div>
            </div>
            <div style={{ gridRow: 'span 2', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <FImage seed={1} w="100%" h={230} locked="gold"/>
            </div>
            <div style={{ gridRow: 'span 4', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <FImage seed={2} w="100%" h={450} locked="mosaic"/>
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <FBadge tone="gold">Édition</FBadge>
              </div>
            </div>
            <div style={{ gridRow: 'span 2', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <FImage seed={3} w="100%" h={230} locked="dark"/>
            </div>
            <div style={{ gridRow: 'span 3', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <FImage seed={4} w="100%" h={340} locked="blur"/>
            </div>
            <div style={{ gridRow: 'span 1', borderRadius: 6, overflow: 'hidden', background: F.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}` }}>
              <div style={{ fontFamily: F.serif, fontSize: 14, color: F.gold, fontStyle: 'italic' }}>+18.4k</div>
            </div>
          </div>
        </section>

        {/* CATEGORY STRIPS */}
        <section style={{ padding: '40px 56px 80px', background: '#0d0a08', borderTop: `1px solid ${F.hair}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 style={{ fontFamily: F.serif, fontSize: 38, color: F.text, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>
              Was du im <span style={{ fontStyle: 'italic', color: F.gold }}>Atelier</span> findest.
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Alle', 'Bilder', 'Clips', 'Hörspiele', 'Stories'].map((t, i) => (
                <div key={t} style={{ height: 32, padding: '0 14px', borderRadius: 16, display: 'flex', alignItems: 'center', background: i === 0 ? 'rgba(212,165,116,0.15)' : F.card, color: i === 0 ? F.gold : F.textMuted, fontFamily: F.sans, fontSize: 12, fontWeight: 600, boxShadow: i === 0 ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}` }}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {[
              { i: 'image', t: 'Bilderserien', n: '14.2k Werke', seed: 0, lock: 'blur' },
              { i: 'video', t: 'Clips · vertikal', n: '4.8k Werke', seed: 1, lock: 'gold' },
              { i: 'headphone', t: 'Hörspiele', n: '882 Werke', seed: 2, lock: 'dark' },
              { i: 'book', t: 'Stories & Akte', n: '2.1k Kapitel', seed: 3, lock: 'mosaic' },
            ].map((c, i) => (
              <div key={i} style={{ background: F.card, borderRadius: 14, overflow: 'hidden', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
                <div style={{ position: 'relative' }}>
                  <FImage seed={c.seed} h={200} locked={c.lock}/>
                </div>
                <div style={{ padding: '18px 18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Icon name={c.i} size={16} color={F.gold}/>
                    <div style={{ fontFamily: F.serif, fontSize: 20, color: F.text, fontWeight: 500 }}>{c.t}</div>
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{c.n}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CREATOR SHOWCASE */}
        <section style={{ padding: '100px 56px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Empfohlene Ateliers</div>
            <h2 style={{ fontFamily: F.serif, fontSize: 52, color: F.text, fontWeight: 400, margin: 0, letterSpacing: -0.8 }}>
              <span style={{ fontStyle: 'italic', color: F.gold }}>Sechs</span> Stimmen, sechs Welten.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { n: 'Liora Noir', h: '@liora.noir', s: 'Kerzenlicht-Editorial', seed: 0 },
              { n: 'Esmé Vauclair', h: '@esme', s: 'Cinematic clips', seed: 1 },
              { n: 'Mira Aurum', h: '@mira.aurum', s: 'Hörspiel-Autorin', seed: 2 },
              { n: 'Sasha Vey', h: '@sasha.vey', s: 'Story-Serien', seed: 3 },
              { n: 'Adèle', h: '@adele', s: 'Voice + Bild', seed: 4 },
              { n: 'Veda', h: '@veda', s: 'Akt-Erzählerin', seed: 5 },
            ].map((c, i) => (
              <div key={i} style={{ background: F.card, borderRadius: 16, padding: 0, overflow: 'hidden', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'stretch', gap: 0 }}>
                <FImage seed={c.seed} w={140} h={180}/>
                <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: F.serif, fontSize: 20, color: F.text, fontWeight: 500 }}>{c.n}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <FCreatorBadge kind="verified" size={11}/>
                    {i % 2 === 0 && <FCreatorBadge kind="voice" size={11}/>}
                    {i === 0 && <FCreatorBadge kind="star" size={11}/>}
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginBottom: 4 }}>{c.h}</div>
                  <div style={{ fontFamily: F.serif, fontSize: 14, color: F.gold, fontStyle: 'italic' }}>{c.s}</div>
                  <div style={{ flex: 1 }}/>
                  <FButton size="sm" variant="secondary" style={{ alignSelf: 'flex-start', marginTop: 12 }}>Atelier öffnen →</FButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING / FLAMES */}
        <section style={{ padding: '60px 56px 80px', background: 'radial-gradient(60% 80% at 50% 0%, rgba(212,165,116,0.08), transparent 70%), #0d0a08', borderTop: `1px solid ${F.hair}`, borderBottom: `1px solid ${F.hair}` }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <FlameMark size={22}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase' }}>Flames — die Währung im Atelier</span>
            </div>
            <h2 style={{ fontFamily: F.serif, fontSize: 44, color: F.text, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>
              <span style={{ fontStyle: 'italic' }}>Bezahle nur,</span> was dir gefällt.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, maxWidth: 1100, margin: '0 auto' }}>
            {[
              { f: 50, e: '4,99', b: '' },
              { f: 120, e: '9,99', b: '+10 Bonus', tag: 'Start' },
              { f: 280, e: '19,99', b: '+30 Bonus', tag: 'Beliebt', best: true },
              { f: 800, e: '49,99', b: '+120 Bonus' },
            ].map((p, i) => (
              <div key={i} style={{ background: p.best ? 'rgba(212,165,116,0.08)' : F.card, borderRadius: 14, padding: '22px 20px', textAlign: 'center', boxShadow: `inset 0 0 0 ${p.best ? 1 : 0.5}px ${p.best ? F.hairStrong : F.hair}`, position: 'relative' }}>
                {p.tag && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}><FBadge tone="gold">{p.tag}</FBadge></div>}
                <div style={{ fontFamily: F.serif, fontSize: 42, color: F.text, fontWeight: 500, lineHeight: 1 }}>{p.f}</div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>Flames</div>
                <div style={{ fontFamily: F.serif, fontSize: 18, color: F.gold, fontWeight: 500, marginTop: 14, fontStyle: 'italic' }}>€{p.e}</div>
                {p.b && <div style={{ fontFamily: F.sans, fontSize: 11, color: F.success, marginTop: 6, fontWeight: 600 }}>{p.b}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '80px 56px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Fragen</div>
            <h2 style={{ fontFamily: F.serif, fontSize: 42, color: F.text, fontWeight: 400, margin: 0, lineHeight: 1.05, letterSpacing: -0.5 }}>Antworten,<br/><span style={{ fontStyle: 'italic', color: F.gold }}>kurz gehalten.</span></h2>
          </div>
          <div>
            {[
              ['Wie wird mein Alter geprüft?', 'Indirekt über dein Zahlungsmittel (Kreditkarte/Bankkonto). Kein Ausweis-Upload nötig — wir speichern keine Identitätsdaten.'],
              ['Was sind Flames?', 'Die In-App-Währung. Du kaufst Pakete, schaltest Werke à la carte frei. Kein Abo, keine Verpflichtung.'],
              ['Bleibe ich anonym?', 'Ja. Du wählst einen Pseudonymen. Creator sehen nur deinen Nutzernamen.'],
              ['Was wenn mir ein Werk nicht gefällt?', '14 Tage Refund auf nicht eingelöste Flames. Freigeschaltete Werke sind final.'],
              ['Können Creatoren mich kontaktieren?', 'Nur, wenn du es zulässt. Voice-Nachrichten erfordern ein Recht des Creators.'],
            ].map((q, i) => (
              <details key={i} style={{ padding: '20px 0', borderBottom: `0.5px solid ${F.hair}` }}>
                <summary style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', listStyle: 'none', gap: 16 }}>
                  <span style={{ flex: 1, fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, fontStyle: 'italic' }}>{q[0]}</span>
                  <Icon name="plus" size={20} color={F.gold}/>
                </summary>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: F.textMuted, lineHeight: 1.6, marginTop: 12, paddingRight: 40 }}>{q[1]}</div>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '40px 56px', borderTop: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 32 }}>
          <FexoraLogo height={18}/>
          <div style={{ flex: 1, display: 'flex', gap: 24, fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>
            <a>AGB</a><a>Datenschutz</a><a>Creator werden</a><a>Support</a><a>Impressum</a>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textFaint }}>© 2026 Fexora · 18+ only</div>
        </footer>
      </div>
    </FBrowser>
  );
}

Object.assign(window, { LandingEditorial, LandingBoutique, FBrowser });
