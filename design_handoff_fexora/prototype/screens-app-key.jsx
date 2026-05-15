// App Screens — eingeloggte Web-App (1440×900)
// Key screens have 2 variants. Support screens single version.

// ═════════════════════════════════════════════════════════════
// FEED · VARIANT A — Editorial 3-Column
// ═════════════════════════════════════════════════════════════
function FeedEditorialWeb() {
  return (
    <AppShell active="home">
      <AppTopbar title="Heute · 15. Mai"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, maxWidth: 1200, margin: '0 auto' }}>
          {/* Main column */}
          <div>
            {/* Editor's pick */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 1, background: F.gold }}/>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase' }}>Auswahl der Redaktion</span>
              </div>
              <h2 style={{ fontFamily: F.serif, fontSize: 48, color: F.text, fontWeight: 400, lineHeight: 1.05, letterSpacing: -1, margin: 0, marginBottom: 24 }}>
                Eine Kerze brennt<br/><span style={{ fontStyle: 'italic', color: F.gold }}>nie zweimal gleich.</span>
              </h2>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                <FImage seed={0} h={520} locked="blur"/>
                <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                  <FBadge tone="gold" icon="lock">24 🔥</FBadge>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <FAvatar name="Liora" size={36}/>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>Liora</span>
                    <FCreatorBadge kind="verified" size={12}/>
                    <FCreatorBadge kind="voice" size={12}/>
                  </div>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>@liora.noir · vor 12 Min.</span>
                </div>
                <div style={{ flex: 1 }}/>
                <div style={{ display: 'flex', gap: 6, color: F.textMuted, fontFamily: F.sans, fontSize: 13 }}>
                  <button style={{ height: 36, padding: '0 14px', borderRadius: 18, background: F.card, color: F.textMuted, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <Icon name="heart" size={14}/> 4.2k
                  </button>
                  <button style={{ height: 36, padding: '0 14px', borderRadius: 18, background: F.card, color: F.textMuted, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <Icon name="chat" size={14}/> 312
                  </button>
                  <button style={{ width: 36, height: 36, borderRadius: 18, background: F.card, color: F.textMuted, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
                    <Icon name="bookmark" size={14}/>
                  </button>
                </div>
                <FButton variant="primary" icon="unlock">Freischalten · 24 🔥</FButton>
              </div>
            </div>

            <GoldDivider style={{ marginBottom: 48 }}/>

            {/* Second post — clip */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>Akt I · Video · 02:14</div>
              <h3 style={{ fontFamily: F.serif, fontSize: 32, color: F.text, fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.4, margin: 0, marginBottom: 20, fontStyle: 'italic' }}>Im Spiegelsalon.</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                  <FImage seed={1} h={400} locked="gold"/>
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <FBadge tone="dark" icon="video">02:14 · FSK 16</FBadge>
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <FButton variant="primary" icon="play">Vorschau ansehen</FButton>
                  </div>
                </div>
                <div>
                  <div style={{ background: F.card, borderRadius: 12, padding: 18, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <FAvatar name="Esmé" size={32}/>
                      <div>
                        <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Esmé Vauclair <FCreatorBadge kind="verified" size={11}/></div>
                        <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>@esme · Paris</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: F.serif, fontSize: 14, color: F.textMuted, lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>
                      „Drei Aufnahmen aus dem Atelier am Spätnachmittag. Honiglicht, Seide, ein gehaltener Atem."
                    </p>
                  </div>
                  <FButton variant="primary" full icon="unlock">Akt I freischalten · 48 🔥</FButton>
                  <FButton variant="secondary" full style={{ marginTop: 8 }}>Komplettes Atelier</FButton>
                </div>
              </div>
            </div>

            {/* Third post — story */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>Story · 8 Kapitel</div>
              <h3 style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, lineHeight: 1.2, letterSpacing: -0.3, margin: 0, marginBottom: 16, fontStyle: 'italic' }}>Kapitel III — Wenn der Vorhang fällt.</h3>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 180, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <FImage seed={3} h={240} locked="mosaic"/>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: F.serif, fontSize: 17, color: F.text, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                    Es war ein Donnerstag, an dem ich beschloss, niemandem mehr zu antworten. Die Vorhänge im Atelier hatten sich um eine Idee verschoben, und das Licht — das Licht, das ich seit Tagen suchte — kam jetzt von rechts. Wie wenn jemand wartet…
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FAvatar name="Sasha Vey" size={28}/>
                    <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>Sasha Vey</span>
                    <FCreatorBadge kind="verified" size={11}/>
                    <FCreatorBadge kind="voice" size={11}/>
                    <div style={{ flex: 1 }}/>
                    <FButton size="md" variant="primary" icon="unlock">Kapitel III · 12 🔥</FButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside>
            {/* Stories */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Stories</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {['Liora', 'Esmé', 'Mira', 'Sasha', 'Adèle', 'Veda', 'Nara', 'Lara'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <FAvatar name={s} size={52} story={i < 4}/>
                    <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending creators */}
            <div style={{ background: F.card, borderRadius: 14, padding: 18, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: F.serif, fontSize: 15, color: F.text, fontWeight: 600, fontStyle: 'italic' }}>Im Aufstieg</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, cursor: 'pointer' }}>Alle →</span>
              </div>
              {['Esmé Vauclair', 'Mira Aurum', 'Sasha Vey', 'Adèle'].map((n, i) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? `0.5px solid ${F.hair}` : 'none' }}>
                  <FAvatar name={n} size={36}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>{n}</span>
                      <FCreatorBadge kind="verified" size={11}/>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>+{(i+1)*412} Verehrer</div>
                  </div>
                  <button style={{ height: 28, padding: '0 12px', borderRadius: 14, background: 'rgba(212,165,116,0.12)', color: F.gold, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`, fontFamily: F.sans, fontSize: 11, fontWeight: 600 }}>+ Folgen</button>
                </div>
              ))}
            </div>

            {/* Sammlung promo */}
            <div style={{ borderRadius: 14, padding: 20, background: 'radial-gradient(80% 80% at 80% 0%, rgba(212,165,116,0.18), transparent 60%), #14110d', boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}` }}>
              <FlameMark size={24}/>
              <div style={{ fontFamily: F.serif, fontSize: 18, color: F.text, fontWeight: 500, fontStyle: 'italic', marginTop: 10 }}>Deine Sammlung wächst.</div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 6, marginBottom: 14, lineHeight: 1.5 }}>28 Werke gespeichert · 142 Flames Guthaben.</div>
              <FButton size="sm" variant="secondary" full>Sammlung öffnen</FButton>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

// ═════════════════════════════════════════════════════════════
// FEED · VARIANT B — Gallery Grid (Pinterest-style)
// ═════════════════════════════════════════════════════════════
function FeedGalleryWeb() {
  const items = [
    { c: 'Liora', t: 'Eine Kerze brennt', kind: 'image', seed: 0, h: 380, lock: 'blur', price: 24, verified: true, voice: true },
    { c: 'Esmé', t: 'Im Spiegelsalon', kind: 'video', seed: 1, h: 280, lock: 'gold', price: 48, verified: true },
    { c: 'Mira', t: 'Das Atelier', kind: 'audio', seed: 2, h: 200, lock: 'dark', price: 18, verified: true, voice: true },
    { c: 'Sasha Vey', t: 'Wenn der Vorhang', kind: 'story', seed: 3, h: 340, lock: 'mosaic', price: 12, voice: true },
    { c: 'Adèle', t: 'Honiglicht II', kind: 'image', seed: 4, h: 460, lock: 'blur', price: 32, verified: true },
    { c: 'Veda', t: 'Kapitel IV — Asche', kind: 'story', seed: 5, h: 240, lock: 'gold', price: 14, verified: true },
    { c: 'Nara', t: 'Spätlicht', kind: 'image', seed: 6, h: 320, lock: 'dark', price: 22 },
    { c: 'Liora', t: 'Akt II — Vorhang', kind: 'video', seed: 7, h: 280, lock: 'mosaic', price: 36, verified: true, voice: true },
    { c: 'Mira', t: 'Hörspiel · 18min', kind: 'audio', seed: 8, h: 200, lock: 'blur', price: 24, voice: true },
    { c: 'Esmé', t: 'Mirror Suite', kind: 'image', seed: 9, h: 400, lock: 'gold', price: 56, verified: true },
    { c: 'Sasha Vey', t: 'Kammer III', kind: 'image', seed: 10, h: 240, lock: 'blur', price: 18 },
    { c: 'Adèle', t: 'Voice — Eine Frage', kind: 'audio', seed: 11, h: 200, lock: 'dark', price: 8, voice: true },
  ];
  const kindIcon = { image: 'image', video: 'video', audio: 'headphone', story: 'book' };
  return (
    <AppShell active="home">
      <AppTopbar title="Entdecken"/>
      {/* Filter strip */}
      <div style={{ padding: '20px 40px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${F.hair}` }}>
        {[
          { l: 'Für Dich', active: true },
          { l: 'Folge ich' },
          { l: 'Bilder' },
          { l: 'Clips' },
          { l: 'Hörspiele' },
          { l: 'Stories' },
          { l: 'Voice-Creator' },
          { l: 'Neu heute' },
        ].map((f, i) => (
          <div key={f.l} style={{ height: 34, padding: '0 16px', borderRadius: 17, display: 'flex', alignItems: 'center', background: f.active ? 'rgba(212,165,116,0.15)' : F.card, color: f.active ? F.gold : F.textMuted, fontFamily: F.sans, fontSize: 12, fontWeight: 600, boxShadow: f.active ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}` }}>{f.l}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>
          <Icon name="grid" size={13}/> Galerie
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 40px 60px' }}>
        {/* Hero strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
          <div style={{ gridRow: 'span 2', position: 'relative', borderRadius: 12, overflow: 'hidden', height: 360 }}>
            <FImage seed={0} h={360} locked="blur"/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(10,8,7,0.95))' }}/>
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
              <FBadge tone="gold" style={{ marginBottom: 10 }}>Featured</FBadge>
              <div style={{ fontFamily: F.serif, fontSize: 38, color: F.text, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 10 }}>Eine Kerze brennt<br/>nie zweimal gleich.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FAvatar name="Liora" size={26}/>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text }}>Liora · Atelier I</span>
                <FCreatorBadge kind="verified" size={12}/>
              </div>
            </div>
          </div>
          <FeaturedStrip seed={2} title="Hörspiel: Das Atelier" creator="Mira" price={18}/>
          <FeaturedStrip seed={1} title="Im Spiegelsalon" creator="Esmé" price={48}/>
          <FeaturedStrip seed={5} title="Kapitel IV — Asche" creator="Veda" price={14}/>
          <FeaturedStrip seed={4} title="Honiglicht II" creator="Adèle" price={32}/>
        </div>

        {/* Section title */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 18 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 26, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0, letterSpacing: -0.3 }}>Frisch im Atelier</h3>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{items.length} Werke · sortiert nach Neuste</span>
        </div>

        {/* Masonry */}
        <div style={{ columnCount: 4, columnGap: 14 }}>
          {items.map((it, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: 14, borderRadius: 12, overflow: 'hidden', background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                <FImage seed={it.seed} h={it.h} locked={it.lock}/>
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <FBadge tone="glass" icon={kindIcon[it.kind]}>{it.kind === 'image' ? 'Bild' : it.kind === 'video' ? 'Clip' : it.kind === 'audio' ? 'Audio' : 'Story'}</FBadge>
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '4px 10px', borderRadius: 12, background: 'rgba(10,8,7,0.75)', backdropFilter: 'blur(20px)', fontFamily: F.sans, fontSize: 12, fontWeight: 700, color: F.gold, boxShadow: 'inset 0 0 0 0.5px rgba(212,165,116,0.3)' }}>
                  {it.price} 🔥
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: F.serif, fontSize: 15, color: F.text, fontWeight: 500, lineHeight: 1.3, fontStyle: 'italic', marginBottom: 6 }}>{it.t}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FAvatar name={it.c} size={20}/>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{it.c}</span>
                  {it.verified && <FCreatorBadge kind="verified" size={10}/>}
                  {it.voice && <FCreatorBadge kind="voice" size={10}/>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function FeaturedStrip({ seed, title, creator, price }) {
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 173 }}>
      <FImage seed={seed} h={173} locked="gold"/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(10,8,7,0.92))' }}/>
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
        <div style={{ fontFamily: F.serif, fontSize: 14, color: F.text, fontWeight: 500, fontStyle: 'italic', marginBottom: 4 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted }}>{creator}</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, fontWeight: 700 }}>{price} 🔥</span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CREATOR PROFILE · VARIANT A — Editorial cover
// ═════════════════════════════════════════════════════════════
function ProfileEditorialWeb() {
  return (
    <AppShell active="explore">
      <AppTopbar search={false}/>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* HERO */}
        <div style={{ position: 'relative', height: 560 }}>
          <FImage seed={0} w="100%" h={560}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,8,7,0.3) 0%, rgba(10,8,7,0) 30%, rgba(10,8,7,0.95) 100%)' }}/>
          <div style={{ position: 'absolute', bottom: 48, left: 56, right: 56 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 30, height: 1, background: F.gold }}/>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase' }}>· Maison Liora ·</span>
                </div>
                <h1 style={{ fontFamily: F.serif, fontSize: 120, color: F.text, fontWeight: 400, lineHeight: 0.9, letterSpacing: -3, margin: 0, fontStyle: 'italic' }}>
                  Liora <span style={{ color: F.gold }}>Noir.</span>
                </h1>
                <p style={{ fontFamily: F.serif, fontSize: 20, color: F.textMuted, lineHeight: 1.5, fontStyle: 'italic', margin: '18px 0 0', maxWidth: 600 }}>
                  „Soft-spoken stories, candlelight, slow afternoons. Eine Sammlung in drei Akten."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
                  <FCreatorBadge kind="verified" size={16}/>
                  <FCreatorBadge kind="voice" size={16}/>
                  <FCreatorBadge kind="star" size={16}/>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginLeft: 12 }}>Wien · Geheimnis Atelier · seit 03.2026</span>
                </div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{ display: 'flex', gap: 10 }}>
                <FButton variant="primary" size="lg">+ Folgen</FButton>
                <FButton variant="secondary" size="lg" icon="chat">Nachricht</FButton>
                <button style={{ width: 52, height: 52, borderRadius: 26, background: 'rgba(10,8,7,0.5)', backdropFilter: 'blur(20px)', border: 'none', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)', color: F.text }}>
                  <Icon name="bell" size={18}/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ padding: '32px 56px', borderBottom: `1px solid ${F.hair}`, display: 'flex', gap: 60, alignItems: 'center', background: '#0d0a08' }}>
          <Stat2 label="Werke" v="142"/>
          <div style={{ width: 1, height: 40, background: F.hair }}/>
          <Stat2 label="Verehrer" v="24.8k"/>
          <div style={{ width: 1, height: 40, background: F.hair }}/>
          <Stat2 label="Flames erhalten" v="186k"/>
          <div style={{ width: 1, height: 40, background: F.hair }}/>
          <Stat2 label="Antwortzeit" v="< 4 Std"/>
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Werke', 'Sammlungen', 'Hörspiele', 'Über'].map((t, i) => (
              <div key={t} style={{ height: 36, padding: '0 18px', borderRadius: 18, display: 'flex', alignItems: 'center', background: i === 0 ? 'rgba(212,165,116,0.15)' : 'transparent', color: i === 0 ? F.gold : F.textMuted, fontFamily: F.serif, fontSize: 15, fontWeight: 500, fontStyle: 'italic', boxShadow: i === 0 ? `inset 0 0 0 1px ${F.hairStrong}` : 'none', cursor: 'pointer' }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Featured edition */}
        <div style={{ padding: '48px 56px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 20 }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase' }}>· Édition der Woche</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold }}>Alle Bundles →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, marginBottom: 56 }}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 400 }}>
              <FImage seed={1} h={400} locked="gold"/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FBadge tone="gold" style={{ alignSelf: 'flex-start', marginBottom: 14 }}>Nº 014 · Édition Privée</FBadge>
              <h2 style={{ fontFamily: F.serif, fontSize: 44, color: F.text, fontWeight: 400, lineHeight: 1.05, letterSpacing: -0.6, margin: 0, marginBottom: 14, fontStyle: 'italic' }}>Drei Akte. Ein langsamer Abend.</h2>
              <p style={{ fontFamily: F.sans, fontSize: 15, color: F.textMuted, lineHeight: 1.6, margin: '0 0 24px' }}>
                14 Bilder · 3 Clips · 2 Hörspiele — gemeinsam zu einem Preis. Honiglicht-Reihe, Spiegelsalon und Asche-Trilogie in einer Sammlung.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
                <span style={{ fontFamily: F.serif, fontSize: 56, color: F.gold, fontWeight: 500, lineHeight: 1 }}>89</span>
                <span style={{ fontFamily: F.sans, fontSize: 14, color: F.gold, letterSpacing: 1 }}>Flames 🔥</span>
                <span style={{ fontFamily: F.sans, fontSize: 14, color: F.textFaint, textDecoration: 'line-through', marginLeft: 12 }}>132</span>
                <FBadge tone="success">– 32%</FBadge>
              </div>
              <FButton variant="primary" size="lg" icon="unlock" style={{ alignSelf: 'flex-start' }}>Bundle freischalten</FButton>
            </div>
          </div>
        </div>

        {/* Works grid */}
        <div style={{ padding: '0 56px 60px' }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, fontStyle: 'italic', marginBottom: 24 }}>Alle Werke</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[0,1,2,3,4,5,6,7].map((s, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '3/4' }}>
                <FImage seed={s} h="100%" locked={['blur','gold','dark','mosaic','blur','gold','dark','blur'][i]}/>
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <FBadge tone="glass" icon={['image','video','headphone','book','image','image','video','image'][i]}>
                    {['Bild','Clip','Audio','Story','Bild','Bild','Clip','Bild'][i]}
                  </FBadge>
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '3px 9px', borderRadius: 10, background: 'rgba(10,8,7,0.7)', fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: F.gold }}>{[24,48,18,12,32,28,42,22][i]} 🔥</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat2({ label, v }) {
  return (
    <div>
      <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, lineHeight: 1, letterSpacing: -0.4 }}>{v}</div>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CREATOR PROFILE · VARIANT B — Boutique Storefront
// ═════════════════════════════════════════════════════════════
function ProfileBoutiqueWeb() {
  return (
    <AppShell active="explore">
      <AppTopbar search={false}/>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Cover band */}
        <div style={{ position: 'relative', height: 220 }}>
          <FImage seed={3} w="100%" h={220}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,8,7,0.4), rgba(10,8,7,0.95))' }}/>
        </div>

        {/* Identity */}
        <div style={{ padding: '0 56px', marginTop: -90, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
            <div style={{ padding: 4, borderRadius: '50%', background: F.goldGrad, boxShadow: '0 16px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: 3, borderRadius: '50%', background: F.bg }}>
                <FAvatar name="Liora" size={140}/>
              </div>
            </div>
            <div style={{ flex: 1, paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <FCreatorBadge kind="verified" size={14}/>
                <FCreatorBadge kind="voice" size={14}/>
                <FCreatorBadge kind="star" size={14}/>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 8 }}>TOP 0.5% · BOUTIQUE</span>
              </div>
              <h1 style={{ fontFamily: F.serif, fontSize: 48, color: F.text, fontWeight: 500, margin: 0, letterSpacing: -0.5 }}>Liora Noir</h1>
              <div style={{ fontFamily: F.sans, fontSize: 14, color: F.textMuted, marginTop: 4 }}>@liora.noir · Wien · Mitglied seit März 2026</div>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingBottom: 12 }}>
              <FButton variant="primary" size="lg">+ Folgen</FButton>
              <FButton variant="secondary" size="lg" icon="chat">Nachricht</FButton>
            </div>
          </div>
          <p style={{ fontFamily: F.serif, fontSize: 18, color: F.textMuted, lineHeight: 1.6, fontStyle: 'italic', marginTop: 28, maxWidth: 720 }}>
            „Soft-spoken stories, candlelight, slow afternoons. Eine Sammlung in drei Akten — Stille, Vorhang, Dämmerung."
          </p>

          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 28 }}>
            {[
              { l: 'Werke', v: '142', i: 'image' },
              { l: 'Verehrer', v: '24.8k', i: 'heart' },
              { l: 'Flames erhalten', v: '186k', i: 'flame' },
              { l: 'Antwortzeit', v: '< 4 Std', i: 'chat' },
            ].map((s, i) => (
              <div key={i} style={{ background: F.card, borderRadius: 14, padding: 22, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
                <Icon name={s.i} size={18} color={F.gold}/>
                <div style={{ fontFamily: F.serif, fontSize: 32, color: F.text, fontWeight: 500, marginTop: 12, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '32px 56px 16px', borderBottom: `1px solid ${F.hair}`, marginTop: 32 }}>
          {['Alles 142', 'Bilder 96', 'Clips 24', 'Hörspiele 12', 'Stories 10', 'Bundles 4'].map((t, i) => (
            <div key={t} style={{ padding: '10px 18px', borderBottom: i === 0 ? `2px solid ${F.gold}` : '2px solid transparent', color: i === 0 ? F.gold : F.textMuted, fontFamily: F.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t}</div>
          ))}
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: F.textMuted, fontFamily: F.sans, fontSize: 12 }}>
            <Icon name="filter" size={14}/> Sortierung: <span style={{ color: F.text }}>Neueste</span>
          </div>
        </div>

        {/* Tiers row */}
        <div style={{ padding: '32px 56px 16px' }}>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16 }}>✦ Die drei Akte</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { n: 'Akt I', sub: 'Sammlung 1 — Stille', price: 24, kind: 'blur', seed: 0 },
              { n: 'Akt II', sub: 'Sammlung 2 — Vorhang', price: 48, kind: 'gold', seed: 1, badge: 'Beliebt' },
              { n: 'Akt III', sub: 'Sammlung 3 — Dämmerung', price: 89, kind: 'dark', seed: 2 },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch', background: F.card, borderRadius: 14, overflow: 'hidden', boxShadow: `inset 0 0 0 0.5px ${i === 1 ? F.hairStrong : F.hair}` }}>
                <FImage seed={t.seed} w={140} h={180} locked={t.kind}/>
                <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.gold, letterSpacing: 2, textTransform: 'uppercase' }}>{t.n}</div>
                      <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, marginTop: 4, fontStyle: 'italic' }}>{t.sub}</div>
                    </div>
                    {t.badge && <FBadge tone="gold">{t.badge}</FBadge>}
                  </div>
                  <div style={{ flex: 1 }}/>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontFamily: F.serif, fontSize: 32, color: F.gold, fontWeight: 500 }}>{t.price}</span>
                    <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold }}>🔥</span>
                  </div>
                  <FButton size="sm" variant="primary" full icon="unlock">Freischalten</FButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: '32px 56px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
            {[0,1,2,3,4,5,6,7,8,9].map((s, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '4/5', background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
                <FImage seed={s} h="100%" locked={['blur','gold','dark','mosaic','blur'][i % 5]}/>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <FBadge tone="glass">{['Bild','Clip','Audio','Story','Bild'][i % 5]}</FBadge>
                </div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '3px 8px', borderRadius: 10, background: 'rgba(10,8,7,0.7)', fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: F.gold }}>{12 + i * 4} 🔥</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ═════════════════════════════════════════════════════════════
// CONTENT DETAIL · VARIANT A — Modal-style two-column
// ═════════════════════════════════════════════════════════════
function DetailModalWeb() {
  return (
    <WebViewport>
      {/* Dimmed backdrop content (faded feed peek) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <AppShell active="home"><AppTopbar title="Heute"/><div style={{ flex: 1, padding: 40 }}><FImage seed={0} h={600}/></div></AppShell>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.7)', backdropFilter: 'blur(12px)' }}/>

      {/* Modal */}
      <div style={{ position: 'absolute', inset: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 1240, height: '100%', background: F.surface, borderRadius: 18, overflow: 'hidden', boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}, 0 60px 120px rgba(0,0,0,0.7)`, display: 'grid', gridTemplateColumns: '1.4fr 1fr' }}>
          {/* Left — preview */}
          <div style={{ position: 'relative', background: '#0a0807' }}>
            <FImage seed={0} w="100%" h="100%" locked="blur"/>
            <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8 }}>
              <FBadge tone="dark">FSK 18</FBadge>
              <FBadge tone="dark" icon="image">1 / 6</FBadge>
            </div>
            {/* Thumb strip */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', gap: 8 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ flex: 1, height: 56, borderRadius: 6, overflow: 'hidden', position: 'relative', boxShadow: i === 0 ? `inset 0 0 0 2px ${F.gold}` : 'none', opacity: i === 0 ? 1 : 0.7 }}>
                  <FImage seed={i + 1} h={56} locked={i < 1 ? 'none' : 'blur'}/>
                </div>
              ))}
            </div>
            {/* Prev/Next */}
            <button style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: 21, background: 'rgba(10,8,7,0.7)', backdropFilter: 'blur(20px)', border: 'none', color: F.text, boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)' }}>
              <Icon name="chevronL" size={18}/>
            </button>
            <button style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: 21, background: 'rgba(10,8,7,0.7)', backdropFilter: 'blur(20px)', border: 'none', color: F.text, boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)' }}>
              <Icon name="chevron" size={18}/>
            </button>
          </div>

          {/* Right — details */}
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <FAvatar name="Liora" size={40}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>Liora</span>
                  <FCreatorBadge kind="verified" size={12}/>
                  <FCreatorBadge kind="voice" size={12}/>
                </div>
                <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>@liora.noir · Atelier I</span>
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: 'transparent', border: 'none', color: F.textMuted }}><Icon name="bookmark" size={16}/></button>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: 'transparent', border: 'none', color: F.textMuted }}><Icon name="x" size={16}/></button>
            </div>

            <div style={{ fontFamily: F.sans, fontSize: 10, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>Bilderserie · 6 Aufnahmen · 4K</div>
            <h2 style={{ fontFamily: F.serif, fontSize: 34, color: F.text, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.1, letterSpacing: -0.5, margin: 0, marginBottom: 16 }}>
              Eine Kerze brennt<br/>nie zweimal gleich.
            </h2>
            <p style={{ fontFamily: F.serif, fontSize: 15, color: F.textMuted, lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 24px' }}>
              „Die ersten drei Aufnahmen entstanden zwischen 17:42 und 18:08 — bei Kerzenschein, ohne Stativ, ohne Plan."
            </p>

            {/* Engagement */}
            <div style={{ display: 'flex', gap: 20, color: F.textMuted, fontFamily: F.sans, fontSize: 13, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${F.hair}` }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="heart" size={16}/> 4.214</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="chat" size={16}/> 312</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="eye" size={16}/> 18.4k</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 11, color: F.textFaint }}>Vor 12 Min.</span>
            </div>

            {/* Unlock options */}
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14 }}>Freischalten</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              <UnlockOption title="Diese Serie" sub="6 Aufnahmen · dauerhaft" price={24} selected/>
              <UnlockOption title="Akt I — Komplett" sub="3 Serien · 14 Aufnahmen" price={68} saving="–22%"/>
              <UnlockOption title="Maison Liora" sub="Monatlich · alle Werke" price={48} recurring/>
            </div>

            <div style={{ flex: 1 }}/>

            <FButton variant="primary" size="lg" full icon="unlock">Freischalten · 24 🔥</FButton>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>
              <span>Guthaben: <span style={{ color: F.gold, fontWeight: 600 }}>142 🔥</span></span>
              <a style={{ color: F.gold, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>Aufladen</a>
            </div>
          </div>
        </div>
      </div>
    </WebViewport>
  );
}

function UnlockOption({ title, sub, price, selected, saving, recurring }) {
  return (
    <div style={{
      background: selected ? 'rgba(212,165,116,0.06)' : F.card,
      borderRadius: 12, padding: '12px 14px',
      boxShadow: `inset 0 0 0 ${selected ? 1 : 0.5}px ${selected ? F.hairStrong : F.hair}`,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, boxShadow: `inset 0 0 0 1.5px ${selected ? F.gold : F.textFaint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: 4, background: F.gold }}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 600 }}>{title}</span>
          {saving && <FBadge tone="success">{saving}</FBadge>}
          {recurring && <FBadge tone="dark">Abo</FBadge>}
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontFamily: F.serif, fontSize: 20, color: F.gold, fontWeight: 600 }}>{price} 🔥</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CONTENT DETAIL · VARIANT B — Full-page Édition
// ═════════════════════════════════════════════════════════════
function DetailEditionWeb() {
  return (
    <AppShell active="home">
      <AppTopbar search={false} actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: 18, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}><Icon name="bookmark" size={16} color={F.textMuted}/></button>
          <button style={{ width: 36, height: 36, borderRadius: 18, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}><Icon name="send" size={16} color={F.textMuted}/></button>
        </div>
      }/>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 56px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginBottom: 24 }}>
          <span>Feed</span> · <span>Liora · Atelier I</span> · <span style={{ color: F.text }}>Eine Kerze brennt nie zweimal gleich</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56, alignItems: 'flex-start' }}>
          {/* Left — image stack */}
          <div>
            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
              <FImage seed={0} h={620} locked="gold"/>
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                <FBadge tone="dark">FSK 18</FBadge>
                <FBadge tone="dark" icon="image">1 / 6</FBadge>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {[0,1,2,3,4,5].slice(1).map(i => (
                <div key={i} style={{ borderRadius: 6, overflow: 'hidden', aspectRatio: '1/1', position: 'relative' }}>
                  <FImage seed={i + 1} h="100%" locked="blur"/>
                </div>
              ))}
              <div style={{ borderRadius: 6, background: F.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: F.gold, fontFamily: F.serif, fontStyle: 'italic', fontSize: 14, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`, aspectRatio: '1/1' }}>+ 1</div>
            </div>
          </div>

          {/* Right — sticky panel */}
          <div style={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
            {/* Edition info */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1, background: F.gold }}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase' }}>Édition Privée · Nº 014</span>
            </div>
            <h1 style={{ fontFamily: F.serif, fontSize: 48, color: F.text, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.05, letterSpacing: -0.6, margin: 0, marginBottom: 20 }}>
              Eine Kerze brennt<br/>nie zweimal gleich.
            </h1>
            <p style={{ fontFamily: F.serif, fontSize: 17, color: F.textMuted, lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 24px' }}>
              „Die ersten drei Aufnahmen entstanden zwischen 17:42 und 18:08 — bei Kerzenschein, ohne Stativ, ohne Plan."
            </p>

            {/* Creator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: `1px solid ${F.hair}`, borderBottom: `1px solid ${F.hair}`, marginBottom: 24 }}>
              <FAvatar name="Liora" size={40}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>Liora Noir</span>
                  <FCreatorBadge kind="verified" size={12}/>
                  <FCreatorBadge kind="voice" size={12}/>
                </div>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>@liora.noir · Wien</span>
              </div>
              <FButton size="sm" variant="secondary">Profil →</FButton>
            </div>

            {/* Details */}
            <div style={{ marginBottom: 28 }}>
              <DetailRow label="Format" value="6 Bilder · 4K (RAW)"/>
              <DetailRow label="Laufzeit" value="—"/>
              <DetailRow label="Atelier" value="Wien · Mai 2026"/>
              <DetailRow label="Signiert" value="Ja · digital"/>
              <DetailRow label="FSK" value="18+"/>
              <DetailRow label="Editionsgröße" value="Unbegrenzt" last/>
            </div>

            {/* Price card */}
            <div style={{ background: 'radial-gradient(80% 80% at 100% 0%, rgba(212,165,116,0.18), transparent 60%), #14110d', borderRadius: 18, padding: 26, boxShadow: `inset 0 0 0 1px ${F.hairStrong}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 6 }}>
                <span style={{ fontFamily: F.serif, fontSize: 72, color: F.gold, fontWeight: 400, lineHeight: 0.9, letterSpacing: -2 }}>24</span>
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: F.gold, letterSpacing: 2, textTransform: 'uppercase' }}>Flames 🔥</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 2 }}>≈ €2,00</div>
                </div>
              </div>
              <FButton variant="primary" size="lg" full icon="unlock" style={{ marginTop: 16 }}>Jetzt freischalten</FButton>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, textAlign: 'center', marginTop: 12 }}>
                Guthaben 142 🔥 · einmalig · dauerhaft in Sammlung
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: last ? 'none' : `0.5px solid ${F.hair}`, fontFamily: F.sans, fontSize: 13 }}>
      <span style={{ color: F.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 11 }}>{label}</span>
      <span style={{ color: F.text }}>{value}</span>
    </div>
  );
}

Object.assign(window, {
  FeedEditorialWeb, FeedGalleryWeb,
  ProfileEditorialWeb, ProfileBoutiqueWeb,
  DetailModalWeb, DetailEditionWeb,
});
