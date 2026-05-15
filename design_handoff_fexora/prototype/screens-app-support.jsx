// App Support Screens — Login/Signup, Chat, Wallet, Settings, Search/Explore

// ═════════════════════════════════════════════════════════════
// LOGIN / SIGNUP — split layout with hero on left
// ═════════════════════════════════════════════════════════════
function LoginWeb() {
  return (
    <WebViewport>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        {/* Left — hero */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <FImage seed={0} w="100%" h="100%" locked="gold"/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,8,7,0.3) 0%, rgba(10,8,7,0.85) 100%)' }}/>
          <div style={{ position: 'absolute', top: 56, left: 56 }}>
            <FexoraLogo height={22}/>
          </div>
          <div style={{ position: 'absolute', bottom: 60, left: 56, right: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 30, height: 1, background: F.gold }}/>
              <FlameMark size={14}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase' }}>Maison · 18+</span>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 64, color: F.text, fontWeight: 400, lineHeight: 0.95, letterSpacing: -1.5, fontStyle: 'italic' }}>
              Willkommen<br/><span style={{ color: F.gold }}>zurück.</span>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 18, color: F.textMuted, lineHeight: 1.5, marginTop: 18, maxWidth: 460, fontStyle: 'italic' }}>
              „Das Atelier hat dich vermisst. Honiglicht wartet."
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: F.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
          <div style={{ width: 420 }}>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>· Anmelden</div>
            <h1 style={{ fontFamily: F.serif, fontSize: 40, color: F.text, fontWeight: 400, lineHeight: 1.05, letterSpacing: -0.5, margin: 0, marginBottom: 36 }}>
              Tritt ein.
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
              <FInputWeb label="E-Mail" value="liora@noir.studio" icon="user"/>
              <FInputWeb label="Passwort" value="••••••••••" icon="lock" trail="eye"/>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.sans, fontSize: 13, color: F.textMuted, cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: F.goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={12} color="#1a0f06" strokeWidth={2.5}/>
                </div>
                Angemeldet bleiben
              </label>
              <a style={{ color: F.gold, fontFamily: F.sans, fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>Passwort vergessen?</a>
            </div>

            <FButton variant="primary" size="lg" full>Anmelden</FButton>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
              <div style={{ flex: 1, height: 1, background: F.hair }}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase' }}>oder</span>
              <div style={{ flex: 1, height: 1, background: F.hair }}/>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
              <FButton variant="secondary" full>Mit Apple</FButton>
              <FButton variant="secondary" full>Mit Google</FButton>
            </div>

            <div style={{ textAlign: 'center', fontFamily: F.sans, fontSize: 13, color: F.textMuted }}>
              Neu hier? <a style={{ color: F.gold, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontWeight: 600 }}>Konto erstellen</a>
            </div>

            <div style={{ marginTop: 48, padding: '14px 16px', borderRadius: 10, background: 'rgba(212,165,116,0.06)', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Icon name="shield" size={14} color={F.gold} style={{ marginTop: 2, flexShrink: 0 }}/>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, lineHeight: 1.55 }}>
                Fexora zeigt ausschließlich Inhalte für Erwachsene (18+). Mit der Anmeldung bestätigst du, dass du volljährig bist.
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebViewport>
  );
}

function FInputWeb({ label, value, icon, trail }) {
  return (
    <div style={{
      background: F.card, borderRadius: 12, padding: '10px 16px',
      boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`,
    }}>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && <Icon name={icon} size={15} color={F.textMuted}/>}
        <div style={{ flex: 1, fontFamily: F.sans, fontSize: 15, color: F.text }}>{value}</div>
        {trail === 'eye' && <Icon name="eye" size={16} color={F.textMuted}/>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CHAT — split-pane (list + active conversation + voice panel)
// ═════════════════════════════════════════════════════════════
function ChatWeb() {
  return (
    <AppShell active="chat">
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr 320px', minHeight: 0 }}>
        {/* Chat list */}
        <div style={{ borderRight: `1px solid ${F.hair}`, background: '#0d0a08', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 22px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, margin: 0, fontStyle: 'italic', letterSpacing: -0.3 }}>Nachrichten</h2>
              <div style={{ flex: 1 }}/>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
                <Icon name="edit" size={14} color={F.gold}/>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 18, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <Icon name="search" size={14} color={F.textMuted}/>
              <span style={{ fontFamily: F.sans, fontSize: 13, color: F.textFaint }}>Suche…</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, overflowX: 'auto' }}>
              {['Alle','Verifiziert','Voice','Trinkgelder','Ungelesen'].map((t, i) => (
                <div key={t} style={{ height: 26, padding: '0 10px', borderRadius: 13, display: 'flex', alignItems: 'center', background: i === 0 ? 'rgba(212,165,116,0.15)' : 'transparent', boxShadow: i === 0 ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}`, color: i === 0 ? F.gold : F.textMuted, fontFamily: F.sans, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
            {[
              { name: 'Liora', voice: true, last: 'Vielen Dank für die Flames ✦', when: '21:02', unread: 2, verified: true, online: true, sel: true },
              { name: 'Esmé Vauclair', voice: false, last: 'Voice (0:42)', when: '20:14', unread: 1, verified: true, voiceMsg: true },
              { name: 'Mira', voice: true, last: 'Ich schicke dir gleich Akt II.', when: '18:48', unread: 0, verified: true },
              { name: 'Sasha Vey', voice: false, last: 'Schau dir das an —', when: 'Mo', unread: 0, verified: false },
              { name: 'Adèle', voice: true, last: 'Trinkgeld 24 🔥', when: 'So', unread: 0, verified: true, tip: true },
              { name: 'Veda', voice: false, last: '🎙 Voice (1:14)', when: '12.5.', unread: 0, verified: true, voiceMsg: true },
              { name: 'Nara', voice: false, last: 'Hörspiel ist online ✦', when: '10.5.', unread: 0, verified: true },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 10, background: c.sel ? 'rgba(212,165,116,0.08)' : 'transparent', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <FAvatar name={c.name} size={44}/>
                  {c.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, background: F.success, boxShadow: `0 0 0 2px #0d0a08` }}/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 600 }}>{c.name}</span>
                    {c.verified && <FCreatorBadge kind="verified" size={10}/>}
                    {c.voice && <FCreatorBadge kind="voice" size={10}/>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: F.sans, fontSize: 12, color: c.unread ? F.text : F.textMuted, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {c.tip && <Icon name="coin" size={11} color={F.gold}/>}
                    {c.voiceMsg && !c.tip && <Icon name="waveform" size={11} color={F.gold}/>}
                    <span style={{ color: c.tip ? F.gold : undefined }}>{c.last}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: c.unread ? F.gold : F.textMuted }}>{c.when}</span>
                  {c.unread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px', background: F.goldGrad, color: '#1a0f06', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontSize: 10, fontWeight: 700 }}>{c.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Conv header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 28px', borderBottom: `1px solid ${F.hair}`, flexShrink: 0 }}>
            <FAvatar name="Liora" size={40}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: F.serif, fontSize: 18, color: F.text, fontWeight: 600 }}>Liora</span>
                <FCreatorBadge kind="verified" size={12}/>
                <FCreatorBadge kind="voice" size={12}/>
                <FCreatorBadge kind="star" size={12}/>
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.success }}>● online · antwortet meist innerhalb von 4 Std</div>
            </div>
            <FButton size="sm" variant="secondary" icon="coin">Trinkgeld geben</FButton>
            <button style={{ width: 36, height: 36, borderRadius: 18, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, color: F.textMuted }}>
              <Icon name="moreV" size={16}/>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
            <DayDivider label="Heute"/>
            <ChatMsg side="them" text="Schön, dich hier zu sehen ✦"/>
            <ChatMsg side="them" text="Hast du Akt I schon gehört? Es ist eine kleine Reise."/>
            <ChatMsg side="me" text="Noch nicht — gerade dabei aufzuladen."/>
            <ChatVoiceMsg side="them" dur="0:42" played={false}/>
            <ChatPaywallCard/>
            <ChatMsg side="me" text="Freigeschaltet ✦"/>
            <ChatVoiceMsg side="me" dur="0:14" played/>
            <ChatMsg side="them" text="Vielen Dank für die Flames ✦"/>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <FBadge tone="dark">Liora tippt…</FBadge>
            </div>
          </div>

          {/* Composer */}
          <div style={{ padding: '16px 28px 24px', borderTop: `1px solid ${F.hair}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 6, borderRadius: 24, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: 'transparent', border: 'none', color: F.gold }}>
                <Icon name="plus" size={18}/>
              </button>
              <div style={{ flex: 1, fontFamily: F.sans, fontSize: 14, color: F.textFaint }}>Nachricht an Liora…</div>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: 'transparent', border: 'none', color: F.gold }}>
                <Icon name="sparkle" size={16}/>
              </button>
              <button style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: F.goldGrad, color: '#1a0f06', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="mic" size={16} strokeWidth={2}/>
              </button>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textFaint, textAlign: 'center', marginTop: 10 }}>
              ⏎ Senden · ⏎ + Shift Zeilenumbruch · Halte 🎙 für Voice (du hast <span style={{ color: F.gold }}>Voice-Recht aktiv</span>)
            </div>
          </div>
        </div>

        {/* Right rail — creator card + content */}
        <div style={{ borderLeft: `1px solid ${F.hair}`, background: '#0d0a08', padding: '24px 22px', overflow: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <FAvatar name="Liora" size={88} ring/>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
              <FCreatorBadge kind="verified" size={12}/>
              <FCreatorBadge kind="voice" size={12}/>
              <FCreatorBadge kind="star" size={12}/>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, marginTop: 10, fontStyle: 'italic' }}>Liora Noir</div>
            <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 2 }}>@liora.noir</div>
          </div>
          <FButton size="md" variant="secondary" full style={{ marginBottom: 6 }}>Profil ansehen</FButton>
          <FButton size="sm" variant="ghost" full>Stumm schalten</FButton>

          <GoldDivider style={{ margin: '24px 0' }}/>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Geteilte Werke</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1/1' }}>
                <FImage seed={i} h="100%" locked={['none', 'blur', 'gold', 'blur'][i]}/>
                {i === 0 && <div style={{ position: 'absolute', bottom: 4, right: 4, padding: '2px 6px', borderRadius: 4, background: 'rgba(10,8,7,0.7)', fontFamily: F.sans, fontSize: 9, color: F.success, fontWeight: 600 }}>✓</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Schnell-Tipps</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[5, 10, 24, 50].map(v => (
                <div key={v} style={{ padding: '8px 14px', borderRadius: 18, background: F.card, fontFamily: F.serif, fontSize: 14, fontStyle: 'italic', color: F.gold, fontWeight: 600, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}` }}>{v} 🔥</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DayDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 20px' }}>
      <div style={{ flex: 1, height: 1, background: F.hair }}/>
      <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: F.hair }}/>
    </div>
  );
}

function ChatMsg({ side, text }) {
  const me = side === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{
        maxWidth: '70%', padding: '10px 16px', borderRadius: 18,
        background: me ? F.goldGrad : F.card,
        color: me ? '#1a0f06' : F.text,
        fontFamily: F.sans, fontSize: 14, lineHeight: 1.45,
        boxShadow: me ? 'none' : `inset 0 0 0 0.5px ${F.hair}`,
        borderBottomRightRadius: me ? 6 : 18,
        borderBottomLeftRadius: me ? 18 : 6,
      }}>{text}</div>
    </div>
  );
}

function ChatVoiceMsg({ side, dur, played }) {
  const me = side === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{
        padding: '10px 16px', borderRadius: 18,
        background: me ? F.goldGrad : F.card,
        boxShadow: me ? 'none' : `inset 0 0 0 0.5px ${F.hair}`,
        display: 'flex', alignItems: 'center', gap: 12, minWidth: 280,
        borderBottomRightRadius: me ? 6 : 18,
        borderBottomLeftRadius: me ? 18 : 6,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: me ? 'rgba(26,15,6,0.2)' : 'rgba(212,165,116,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="play" size={12} color={me ? '#1a0f06' : F.gold}/>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          {Array.from({ length: 32 }).map((_, i) => {
            const h = [4,8,12,18,14,8,10,16,22,14,8,12,10,16,20,12,8,14,18,10,6,12,16,10,8,4,8,12,14,10,6,4][i];
            return <div key={i} style={{ flex: 1, height: h, borderRadius: 1, background: me ? (i < 22 ? '#1a0f06' : 'rgba(26,15,6,0.3)') : (i < 14 ? F.gold : F.textFaint) }}/>;
          })}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 11, color: me ? '#1a0f06' : F.textMuted, opacity: 0.8 }}>{dur}</div>
      </div>
    </div>
  );
}

function ChatPaywallCard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
      <div style={{
        width: 360, padding: 4, borderRadius: 18,
        background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`,
        borderBottomLeftRadius: 6, overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
          <FImage seed={0} w="100%" h={180} locked="blur"/>
        </div>
        <div style={{ padding: '14px 14px 10px' }}>
          <div style={{ fontFamily: F.serif, fontSize: 18, color: F.text, fontWeight: 500, fontStyle: 'italic' }}>Akt I · Eine Kerze brennt</div>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 4, marginBottom: 12 }}>3 Bilder · 1 Voice · privat geteilt</div>
          <FButton variant="primary" size="md" full icon="unlock">Freischalten · 24 🔥</FButton>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// WALLET / CREDITS
// ═════════════════════════════════════════════════════════════
function WalletWeb() {
  return (
    <AppShell active="wallet">
      <AppTopbar title="Wallet" search={false}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 60px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Big balance card */}
          <div style={{ position: 'relative', borderRadius: 18, padding: '32px 32px', background: 'radial-gradient(80% 100% at 100% 0%, rgba(212,165,116,0.25), transparent 60%), #14110d', boxShadow: `inset 0 0 0 1px ${F.hairStrong}`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -40, opacity: 0.12 }}>
              <FlameMark size={260}/>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Dein Guthaben</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: F.serif, fontSize: 88, color: F.text, fontWeight: 400, lineHeight: 0.9, letterSpacing: -2 }}>142</span>
              <div style={{ paddingBottom: 12 }}>
                <div style={{ fontFamily: F.serif, fontSize: 22, color: F.gold, fontStyle: 'italic' }}>Flames 🔥</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 2 }}>≈ €11,80</div>
              </div>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 10 }}>Letzte Aufladung 8. Mai · Nächste Stufe „Sammler" bei 200 🔥</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <FButton variant="primary" size="lg" icon="plus">Aufladen</FButton>
              <FButton variant="secondary" size="lg" icon="send">Senden</FButton>
              <FButton variant="ghost" size="lg" icon="download">Auszahlung</FButton>
            </div>
          </div>

          {/* Stats sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ flex: 1, padding: 22, borderRadius: 14, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Diesen Monat</div>
              <div style={{ fontFamily: F.serif, fontSize: 30, color: F.text, fontWeight: 500 }}>418 🔥</div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: F.success, marginTop: 4 }}>+ 12% ggü. Vormonat</div>
            </div>
            <div style={{ flex: 1, padding: 22, borderRadius: 14, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Top Creator (Du)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FAvatar name="Liora" size={32}/>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>Liora · 86 🔥</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>5 Werke freigeschaltet</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pack picker */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Flames aufladen</h3>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>Zahlung mit Apple Pay, Karte oder SEPA. Bestätigt indirekt dein Alter.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { f: 50, e: '4,99', b: '' },
              { f: 120, e: '9,99', b: '+10 Bonus', tag: 'Start' },
              { f: 280, e: '19,99', b: '+30 Bonus', tag: 'Beliebt', best: true },
              { f: 800, e: '49,99', b: '+120 Bonus' },
            ].map((p, i) => (
              <div key={i} style={{ position: 'relative', background: p.best ? 'rgba(212,165,116,0.08)' : F.card, borderRadius: 14, padding: 24, boxShadow: `inset 0 0 0 ${p.best ? 1 : 0.5}px ${p.best ? F.hairStrong : F.hair}` }}>
                {p.tag && <div style={{ position: 'absolute', top: -10, left: 24 }}><FBadge tone="gold">{p.tag}</FBadge></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: F.goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 22 }}>🔥</span></div>
                  <div>
                    <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, lineHeight: 1 }}>{p.f}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Flames</div>
                  </div>
                </div>
                {p.b && <div style={{ fontFamily: F.sans, fontSize: 11, color: F.success, fontWeight: 600, marginBottom: 12 }}>{p.b}</div>}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: F.serif, fontSize: 20, color: F.gold, fontWeight: 500, fontStyle: 'italic' }}>€{p.e}</span>
                  <FButton size="sm" variant={p.best ? 'primary' : 'secondary'}>Wählen</FButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 14 }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Letzte Bewegungen</h3>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold, cursor: 'pointer' }}>Alle anzeigen →</span>
          </div>
          <div style={{ background: F.card, borderRadius: 14, padding: 8, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
            {[
              { ic: 'unlock', t: 'Freigeschaltet · Liora — Eine Kerze brennt', s: 'Bilderserie · Akt I', v: -24, w: 'Heute 21:02', kind: 'image' },
              { ic: 'plus', t: 'Aufladung 120 Flames', s: 'Apple Pay', v: 120, w: 'Heute 20:34', kind: 'pay' },
              { ic: 'send', t: 'Trinkgeld · Esmé Vauclair', s: 'Voice Reply', v: -10, w: 'Gestern', kind: 'tip' },
              { ic: 'unlock', t: 'Freigeschaltet · Mira — Das letzte Atelier', s: 'Hörspiel · 24:12', v: -18, w: '8. Mai', kind: 'audio' },
              { ic: 'sparkle', t: 'Bonus · Erste Aufladung', s: 'Willkommen bei Fexora', v: 10, w: '8. Mai', kind: 'bonus' },
              { ic: 'unlock', t: 'Freigeschaltet · Akt I — Bundle', s: '3 Serien · Liora', v: -68, w: '5. Mai', kind: 'bundle' },
            ].map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 14px', borderBottom: i < 5 ? `0.5px solid ${F.hair}` : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: tx.v > 0 ? 'rgba(107,154,110,0.12)' : 'rgba(212,165,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={tx.ic} size={16} color={tx.v > 0 ? F.success : F.gold}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 500 }}>{tx.t}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 2 }}>{tx.s}</div>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{tx.w}</div>
                <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 600, color: tx.v > 0 ? F.success : F.text, width: 80, textAlign: 'right' }}>
                  {tx.v > 0 ? '+' : ''}{tx.v} 🔥
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ═════════════════════════════════════════════════════════════
// SEARCH / EXPLORE
// ═════════════════════════════════════════════════════════════
function SearchWeb() {
  return (
    <AppShell active="explore">
      <AppTopbar title="Entdecken"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 60px' }}>
        {/* Hero curated */}
        <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', height: 320, marginBottom: 36 }}>
          <FImage seed={2} w="100%" h={320} locked="gold"/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,8,7,0.95) 0%, rgba(10,8,7,0.4) 50%, transparent 100%)' }}/>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '55%', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 1, background: F.gold }}/>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 3, textTransform: 'uppercase' }}>· Kuratiert · Diese Woche</span>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 44, color: F.text, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.05, letterSpacing: -0.6, marginBottom: 12 }}>
              Sieben Stimmen,<br/>ein langsamer Abend.
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 14, color: F.textMuted, marginBottom: 22 }}>7 Creator · 14 neue Werke · ausgewählt von der Fexora-Redaktion</div>
            <FButton variant="primary" size="md" style={{ alignSelf: 'flex-start' }}>Sammlung öffnen →</FButton>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 20 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 24, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Kategorien</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 48 }}>
          {[
            { i: 'image', t: 'Bilderserien', n: '14.2k Werke', seed: 0, lock: 'blur' },
            { i: 'video', t: 'Clips · vertikal', n: '4.8k Werke', seed: 1, lock: 'gold' },
            { i: 'headphone', t: 'Hörspiele', n: '882 Werke', seed: 2, lock: 'dark' },
            { i: 'book', t: 'Stories & Akte', n: '2.1k Kapitel', seed: 3, lock: 'mosaic' },
          ].map((c, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 160, cursor: 'pointer' }}>
              <FImage seed={c.seed} h={160} locked={c.lock}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(10,8,7,0.95))' }}/>
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon name={c.i} size={16} color={F.gold}/>
                  <div style={{ fontFamily: F.serif, fontSize: 20, color: F.text, fontWeight: 500, fontStyle: 'italic' }}>{c.t}</div>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{c.n}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending creators */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 20 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 24, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Neue Stimmen</h3>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold, cursor: 'pointer' }}>Alle Creator →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 48 }}>
          {['Esmé', 'Mira', 'Sasha', 'Adèle', 'Veda', 'Nara'].map((n, i) => (
            <div key={n} style={{ background: F.card, borderRadius: 14, overflow: 'hidden', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <FImage seed={i + 3} h={180}/>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <span style={{ fontFamily: F.serif, fontSize: 16, color: F.text, fontWeight: 600 }}>{n}</span>
                  <FCreatorBadge kind="verified" size={11}/>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginBottom: 10 }}>{(i + 1) * 1200} Verehrer</div>
                <FButton size="sm" variant="secondary" full>Folgen</FButton>
              </div>
            </div>
          ))}
        </div>

        {/* Discover grid */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 20 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 24, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Entdecke</h3>
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Trending', 'Neu', 'Bald ausverkauft', 'Boutique'].map((t, i) => (
              <div key={t} style={{ height: 28, padding: '0 12px', borderRadius: 14, display: 'flex', alignItems: 'center', background: i === 0 ? 'rgba(212,165,116,0.15)' : 'transparent', color: i === 0 ? F.gold : F.textMuted, fontFamily: F.sans, fontSize: 12, fontWeight: 600, boxShadow: i === 0 ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}`, cursor: 'pointer' }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '100px', gap: 8 }}>
          <div style={{ gridRow: 'span 3', gridColumn: 'span 2', borderRadius: 10, overflow: 'hidden' }}><FImage seed={0} h="100%" locked="blur"/></div>
          <div style={{ gridRow: 'span 2', borderRadius: 10, overflow: 'hidden' }}><FImage seed={1} h="100%" locked="gold"/></div>
          <div style={{ gridRow: 'span 2', borderRadius: 10, overflow: 'hidden' }}><FImage seed={2} h="100%" locked="mosaic"/></div>
          <div style={{ gridRow: 'span 3', borderRadius: 10, overflow: 'hidden' }}><FImage seed={3} h="100%" locked="dark"/></div>
          <div style={{ gridRow: 'span 2', borderRadius: 10, overflow: 'hidden' }}><FImage seed={4} h="100%" locked="blur"/></div>
          <div style={{ borderRadius: 10, overflow: 'hidden' }}><FImage seed={5} h="100%" locked="gold"/></div>
          <div style={{ borderRadius: 10, overflow: 'hidden' }}><FImage seed={6} h="100%" locked="mosaic"/></div>
          <div style={{ gridRow: 'span 2', borderRadius: 10, overflow: 'hidden' }}><FImage seed={7} h="100%" locked="dark"/></div>
          <div style={{ borderRadius: 10, overflow: 'hidden' }}><FImage seed={8} h="100%" locked="blur"/></div>
          <div style={{ borderRadius: 10, overflow: 'hidden' }}><FImage seed={9} h="100%" locked="gold"/></div>
        </div>
      </div>
    </AppShell>
  );
}

// ═════════════════════════════════════════════════════════════
// SETTINGS / PROFIL
// ═════════════════════════════════════════════════════════════
function SettingsWeb() {
  return (
    <AppShell active="me">
      <AppTopbar title="Mein Profil" search={false}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 60px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 }}>
          {/* Side tabs */}
          <aside>
            {[
              { id: 'profile', l: 'Profil & Avatar', i: 'user', active: true },
              { id: 'security', l: 'Sicherheit', i: 'lock' },
              { id: 'notif', l: 'Benachrichtigungen', i: 'bell' },
              { id: 'payment', l: 'Zahlung & Wallet', i: 'coin' },
              { id: 'privacy', l: 'Privatsphäre', i: 'shield' },
              { id: 'content', l: 'Inhalt & FSK', i: 'eye' },
              { id: 'help', l: 'Hilfe & Support', i: 'chat' },
              { id: 'legal', l: 'AGB & Datenschutz', i: 'book' },
            ].map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: t.active ? F.gold : F.textMuted, background: t.active ? 'rgba(212,165,116,0.1)' : 'transparent', fontFamily: F.sans, fontSize: 13, fontWeight: t.active ? 600 : 500, marginBottom: 2, cursor: 'pointer', boxShadow: t.active ? `inset 0 0 0 0.5px ${F.hairStrong}` : 'none' }}>
                <Icon name={t.i} size={15}/>
                {t.l}
              </div>
            ))}
            <div style={{ marginTop: 30, padding: '10px 12px', borderRadius: 8, color: F.danger, fontFamily: F.sans, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <Icon name="x" size={15}/> Abmelden
            </div>
          </aside>

          {/* Main */}
          <div>
            <h2 style={{ fontFamily: F.serif, fontSize: 32, color: F.text, fontWeight: 500, fontStyle: 'italic', margin: 0, marginBottom: 8 }}>Profil & Avatar</h2>
            <p style={{ fontFamily: F.sans, fontSize: 13, color: F.textMuted, margin: 0, marginBottom: 32 }}>So erscheinst du im Atelier. Du bleibst standardmäßig pseudonym — Creatoren sehen nur deinen Nutzernamen.</p>

            {/* Avatar */}
            <div style={{ background: F.card, borderRadius: 14, padding: 24, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <FAvatar name="Anonym" size={96} ring/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.serif, fontSize: 20, color: F.text, fontWeight: 500 }}>Dein Avatar</div>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 4, lineHeight: 1.5 }}>PNG/JPG bis 4MB. Quadratisch wirkt am besten.</div>
                </div>
                <FButton size="md" variant="secondary" icon="upload">Hochladen</FButton>
                <FButton size="md" variant="ghost">Entfernen</FButton>
              </div>
            </div>

            {/* Profile fields */}
            <div style={{ background: F.card, borderRadius: 14, padding: 24, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 18 }}>
              <SetField label="Nutzername" value="@anonym_2406" hint="Sichtbar für Creatoren. Buchstaben, Zahlen, _ und ."/>
              <SetField label="Anzeigename" value="(leer — Nutzername wird angezeigt)" muted/>
              <SetField label="E-Mail" value="anonym_2406@protonmail.com" badge="Verifiziert"/>
              <SetField label="Sprache" value="Deutsch (DE)"/>
              <SetField label="Zeitzone" value="Europa / Berlin (UTC+1)" last/>
            </div>

            {/* Privacy toggles */}
            <div style={{ background: F.card, borderRadius: 14, padding: 24, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 18 }}>
              <h3 style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', margin: 0, marginBottom: 16 }}>Privatsphäre</h3>
              <SetToggle label="Profil-Sichtbarkeit" sub="Wer kann sehen, dass du existierst." value="Nur Creatoren denen ich folge" on/>
              <SetToggle label="Sammlung anzeigen" sub="Andere können deine Sammlungen sehen." value="Aus" off/>
              <SetToggle label="Voice empfangen" sub="Erlaubt Creatoren, dir Voice-Nachrichten zu senden." value="Nur Mutuals" on/>
              <SetToggle label="Trinkgeld-Benachrichtigungen" sub="Andere sehen, wenn du Trinkgeld gibst." value="Aus" off last/>
            </div>

            {/* Age verification */}
            <div style={{ background: 'rgba(212,165,116,0.06)', borderRadius: 14, padding: 24, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(212,165,116,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="shield" size={22} color={F.gold}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>Altersbestätigung 18+</span>
                  <FBadge tone="success">Aktiv</FBadge>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 4 }}>Indirekt über Apple Pay verifiziert · seit 08.05.2026</div>
              </div>
              <FButton variant="ghost" size="sm">Details</FButton>
            </div>

            {/* Save bar */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 18, borderTop: `1px solid ${F.hair}` }}>
              <FButton variant="primary" size="md">Änderungen speichern</FButton>
              <FButton variant="ghost" size="md">Abbrechen</FButton>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SetField({ label, value, hint, muted, badge, last }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: last ? 'none' : `0.5px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 3 }}>{hint}</div>}
      </div>
      <div style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: muted ? F.textFaint : F.text, fontStyle: muted ? 'italic' : 'normal' }}>{value}</div>
      {badge && <FBadge tone="success">{badge}</FBadge>}
      <FButton size="sm" variant="ghost">Ändern</FButton>
    </div>
  );
}

function SetToggle({ label, sub, value, on, last }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: last ? 'none' : `0.5px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginRight: 8 }}>{value}</div>
      <div style={{ width: 42, height: 24, borderRadius: 12, background: on ? F.goldGrad : F.bg, position: 'relative', boxShadow: on ? 'none' : `inset 0 0 0 1px ${F.textFaint}` }}>
        <div style={{ position: 'absolute', top: 2, [on ? 'right' : 'left']: 2, width: 20, height: 20, borderRadius: 10, background: on ? '#1a0f06' : F.textMuted }}/>
      </div>
    </div>
  );
}

Object.assign(window, { LoginWeb, ChatWeb, WalletWeb, SearchWeb, SettingsWeb });
