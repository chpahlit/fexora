// Moderation Tool — Web App (1440×900, no chrome)
// Queue · Report-Detail · Chat-Moderation · Audit-Log

function ModSidebar({ active = 'queue' }) {
  const items = [
    { id: 'queue', icon: 'flag', label: 'Reports', badge: 3 },
    { id: 'chats', icon: 'chat', label: 'Chat-Moderation', badge: 12 },
    { id: 'voice', icon: 'waveform', label: 'Voice-Stichproben' },
    { id: 'users', icon: 'user', label: 'Nutzerakten' },
    { id: 'rules', icon: 'book', label: 'Regelwerk' },
    { id: 'audit', icon: 'shield', label: 'Audit-Log' },
  ];
  return (
    <aside style={{ width: 240, flexShrink: 0, background: '#0d0a08', borderRight: `1px solid ${F.hair}`, padding: '24px 14px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 8px' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(196,90,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="shield" size={16} color={F.danger}/>
        </div>
        <div>
          <div style={{ fontFamily: F.serif, fontSize: 17, color: F.gold, fontWeight: 500, letterSpacing: 0.5 }}>FEXORA</div>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.danger, letterSpacing: 1.5, textTransform: 'uppercase' }}>Moderation</div>
        </div>
      </div>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1.5, textTransform: 'uppercase', padding: '20px 12px 8px' }}>Trust & Safety</div>
      {items.map(it => (
        <button key={it.id} style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 8,
          background: it.id === active ? 'rgba(196,90,74,0.12)' : 'transparent',
          color: it.id === active ? F.danger : F.textMuted,
          border: 'none', cursor: 'pointer', marginBottom: 2,
          fontFamily: F.sans, fontSize: 13, fontWeight: it.id === active ? 600 : 500,
          boxShadow: it.id === active ? `inset 0 0 0 0.5px rgba(196,90,74,0.3)` : 'none',
          textAlign: 'left',
        }}>
          <Icon name={it.icon} size={16}/>
          <span style={{ flex: 1 }}>{it.label}</span>
          {it.badge && <span style={{ background: F.danger, color: '#fff', borderRadius: 9, padding: '0 7px', fontSize: 10, fontWeight: 700 }}>{it.badge}</span>}
        </button>
      ))}
      <div style={{ flex: 1 }}/>
      <div style={{ padding: 12, borderRadius: 10, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 8 }}>
        <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Schicht-Status</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: F.success }}/>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: F.text }}>Online · 4h 12m</span>
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>14 Fälle bearbeitet</div>
      </div>
      <div style={{ padding: '10px 8px', borderRadius: 10, background: F.card, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FAvatar name="J K" size={30}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: F.text, fontWeight: 600 }}>J. Krieger</div>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted }}>Moderator · L2</div>
        </div>
      </div>
    </aside>
  );
}

function ModTopbar({ title, subtitle, actions }) {
  return (
    <div style={{ height: 68, flexShrink: 0, borderBottom: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, background: 'rgba(10,8,7,0.85)', backdropFilter: 'blur(12px)' }}>
      <div>
        <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1 }}/>
      {actions}
    </div>
  );
}

function ModShell({ active, children }) {
  return (
    <WebViewport>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <ModSidebar active={active}/>
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</main>
      </div>
    </WebViewport>
  );
}

function SevPill({ sev }) {
  const map = { high: ['Hoch', F.danger], mid: ['Mittel', F.warn], low: ['Niedrig', F.textMuted] };
  const [l, c] = map[sev];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 4, background: `${c}1f`, fontSize: 11, color: c, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: c }}/>{l}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════
// 1. REPORT QUEUE
// ═════════════════════════════════════════════════════════════
function ModQueueWeb() {
  const reports = [
    { id: 'R-1082', kind: 'chat', target: '@sasha_vey', reason: 'Belästigung in Chat', reporter: 'anonym_2406', age: '4 min', sev: 'high', context: 'Voice 0:42 · Text-Druckmuster' },
    { id: 'R-1081', kind: 'content', target: 'Veda · Story IV', reason: 'FSK-Einstufung zweifelhaft', reporter: 'collect_42', age: '12 min', sev: 'mid' },
    { id: 'R-1080', kind: 'profile', target: '@lior_imitator', reason: 'Verdacht: Account-Imitation', reporter: 'mira_collects', age: '38 min', sev: 'high' },
    { id: 'R-1079', kind: 'chat', target: '@spam_bot_xyz', reason: 'Spam · externe Links', reporter: 'system', age: '52 min', sev: 'mid' },
    { id: 'R-1078', kind: 'content', target: 'Esmé · Clip 02:14', reason: 'Urheberrecht (DMCA)', reporter: 'extern', age: '1 Std', sev: 'high' },
    { id: 'R-1077', kind: 'voice', target: 'Adèle · Voice 0:34', reason: 'KI-generierte Stimme?', reporter: 'system', age: '2 Std', sev: 'low' },
    { id: 'R-1076', kind: 'chat', target: '@anon_user_88', reason: 'Aufdringliche Anfragen', reporter: 'liora.noir', age: '3 Std', sev: 'mid' },
  ];
  return (
    <ModShell active="queue">
      <ModTopbar title="Offene Reports · 24" subtitle="Schicht-Tag · Donnerstag 15. Mai 2026" actions={
        <FButton size="md" variant="danger" icon="play">Nächster Fall</FButton>
      }/>
      <div style={{ padding: '16px 28px', display: 'flex', gap: 8, borderBottom: `1px solid ${F.hair}`, alignItems: 'center' }}>
        {[
          { l: 'Alle', n: 24, active: true },
          { l: 'Chat', n: 12 }, { l: 'Inhalt', n: 8 }, { l: 'Profil', n: 3 }, { l: 'Voice', n: 1 },
        ].map(f => (
          <div key={f.l} style={{ padding: '7px 14px', borderRadius: 8, fontFamily: F.sans, fontSize: 12, fontWeight: 600, background: f.active ? 'rgba(196,90,74,0.15)' : F.card, color: f.active ? F.danger : F.textMuted, boxShadow: f.active ? `inset 0 0 0 0.5px rgba(196,90,74,0.3)` : `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', gap: 6 }}>{f.l}<span>{f.n}</span></div>
        ))}
        <div style={{ flex: 1 }}/>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>SLA · innerhalb 2h</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#0d0a08' }}>
            <tr style={{ borderBottom: `1px solid ${F.hair}` }}>
              {['ID', 'Schwere', 'Typ', 'Ziel', 'Grund', 'Gemeldet von', 'Eingegangen', ''].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: F.textFaint, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={{ borderBottom: `0.5px solid ${F.hair}`, background: r.sev === 'high' ? 'rgba(196,90,74,0.04)' : 'transparent' }}>
                <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>{r.id}</td>
                <td style={{ padding: '14px 16px' }}><SevPill sev={r.sev}/></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: F.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={r.kind === 'chat' ? 'chat' : r.kind === 'voice' ? 'waveform' : r.kind === 'profile' ? 'user' : 'image'} size={13} color={F.textMuted}/>
                    </div>
                    <span style={{ fontSize: 12, color: F.text, textTransform: 'capitalize' }}>{r.kind}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>
                  {r.target}
                  {r.context && <div style={{ fontSize: 11, color: F.textMuted, fontWeight: 400, marginTop: 2 }}>{r.context}</div>}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: F.sans, fontSize: 13, color: F.text }}>{r.reason}</td>
                <td style={{ padding: '14px 16px', fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{r.reporter}</td>
                <td style={{ padding: '14px 16px', fontFamily: F.sans, fontSize: 12, color: F.textMuted }}>{r.age}</td>
                <td style={{ padding: '14px 16px' }}>
                  <FButton size="sm" variant="secondary">Öffnen →</FButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModShell>
  );
}

// ═════════════════════════════════════════════════════════════
// 2. REPORT DETAIL
// ═════════════════════════════════════════════════════════════
function ModReportDetailWeb() {
  return (
    <ModShell active="queue">
      <ModTopbar title="Report R-1082" subtitle="Hochpriorisiert · SLA in 1h 14m"/>
      <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
        <div style={{ padding: 28, borderRight: `1px solid ${F.hair}`, overflow: 'auto' }}>
          {/* Parties */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, padding: 18, background: F.card, borderRadius: 14, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FAvatar name="anonym_2406" size={40}/>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Meldender</div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>@anonym_2406</div>
              </div>
            </div>
            <div style={{ flex: 1, height: 1, background: F.hair }}/>
            <Icon name="arrowR" size={20} color={F.danger}/>
            <div style={{ flex: 1, height: 1, background: F.hair }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'right' }}>Gemeldet</div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                  @sasha_vey <FCreatorBadge kind="verified" size={11}/>
                </div>
              </div>
              <FAvatar name="Sasha Vey" size={40}/>
            </div>
          </div>

          {/* Report meta */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <SevPill sev="high"/>
              <FBadge tone="dark">Chat</FBadge>
              <FBadge tone="dark">Belästigung</FBadge>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginLeft: 'auto' }}>Eingegangen 21:00 · vor 4 min</span>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 26, color: F.text, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.25, marginBottom: 8, letterSpacing: -0.2 }}>
              „Mehrfache aufdringliche Voice-Nachrichten trotz Bitte um Abstand"
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 13, color: F.textMuted, lineHeight: 1.6 }}>
              Meldender berichtet, dass der gemeldete Nutzer trotz zweimaliger expliziter Ablehnung weiterhin Sprachnachrichten geschickt hat. Inhalte enthalten suggestive Sprache und Druck.
            </div>
          </div>

          {/* Chat evidence */}
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Beweissicherung · Chatverlauf</div>
          <div style={{ background: F.card, borderRadius: 14, padding: 16, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
            <EvMsg side="them" who="@sasha_vey" t="Hey, schöner Avatar ✦" w="20:42"/>
            <EvMsg side="me" who="@anonym_2406" t="Danke. Bitte respektiere meine Grenzen." w="20:43" highlight/>
            <EvMsg side="them" who="@sasha_vey" t="Komm schon, sei nicht so." w="20:50"/>
            <EvMsg side="them" who="@sasha_vey" voice="0:34" w="20:51" flagged/>
            <EvMsg side="me" who="@anonym_2406" t="Ich habe nein gesagt." w="20:52" highlight/>
            <EvMsg side="them" who="@sasha_vey" voice="0:42" w="20:58" flagged/>
          </div>

          {/* History */}
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', margin: '24px 0 12px' }}>Historie · @sasha_vey</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            <HistCard label="Reports gesamt" v="3" tone="warn"/>
            <HistCard label="Verwarnungen" v="1"/>
            <HistCard label="Approval-Rate" v="74%" tone="warn"/>
            <HistCard label="Mitglied seit" v="04.2026"/>
          </div>
        </div>

        {/* Action rail */}
        <div style={{ padding: 28, background: '#0d0a08', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.danger, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>Aktion</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ActionBtn icon="bell" label="Verwarnen" sub="Hinweis an Nutzer · Stufe 1" tone="warn"/>
            <ActionBtn icon="mic" label="Voice-Recht entziehen" sub="Sofortige Sperre · 30 Tage" tone="warn"/>
            <ActionBtn icon="trash" label="Inhalt löschen" sub="Nur markierte Nachrichten"/>
            <ActionBtn icon="lock" label="Chat sperren" sub="Beide Seiten · 14 Tage"/>
            <ActionBtn icon="x" label="Account bannen" sub="Permanent · Auszahlungen einfrieren" tone="danger"/>
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', margin: '22px 0 10px' }}>Entscheidung dokumentieren</div>
          <div style={{ background: F.card, borderRadius: 10, padding: 12, minHeight: 80, fontFamily: F.sans, fontSize: 13, color: F.textFaint, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 16, lineHeight: 1.5 }}>
            Voice-Recht entzogen (30 Tage), beide markierten Voice-Nachrichten gelöscht. Verwarnung Stufe 2…
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(196,90,74,0.08)', borderRadius: 10, boxShadow: `inset 0 0 0 0.5px rgba(196,90,74,0.2)`, fontFamily: F.sans, fontSize: 12, color: F.danger }}>
            <Icon name="shield" size={16}/>
            4-Augen-Prinzip aktiv. Schwere Aktionen werden an Senior eskaliert.
          </div>

          <div style={{ flex: 1 }}/>
          <FButton variant="danger" full size="lg" style={{ marginTop: 18 }}>Entscheidung speichern</FButton>
          <button style={{ background: 'transparent', border: 'none', color: F.textMuted, fontFamily: F.sans, fontSize: 12, padding: '14px 0', cursor: 'pointer' }}>Eskalieren zum Senior</button>
        </div>
      </div>
    </ModShell>
  );
}

function EvMsg({ side, who, t, voice, w, highlight, flagged }) {
  const me = side === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: me ? 'flex-end' : 'flex-start' }}>
        <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, marginBottom: 4 }}>{who} · {w}</div>
        <div style={{
          padding: '9px 14px', borderRadius: 14,
          background: highlight ? 'rgba(212,165,116,0.15)' : flagged ? 'rgba(196,90,74,0.12)' : F.bg,
          boxShadow: highlight ? `inset 0 0 0 0.5px ${F.hairStrong}` : flagged ? `inset 0 0 0 0.5px rgba(196,90,74,0.4)` : `inset 0 0 0 0.5px ${F.hair}`,
          color: F.text, fontFamily: F.sans, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {voice ? (
            <>
              <Icon name="play" size={12} color={F.gold}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, width: 140 }}>
                {Array.from({ length: 26 }).map((_, k) => {
                  const h = [4,8,12,18,14,8,10,16,12,14,8,12,10,16,14,12,8,14,10,6,4,8,12,10,6,4][k];
                  return <div key={k} style={{ flex: 1, height: h, borderRadius: 1, background: flagged ? F.danger : F.gold }}/>;
                })}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>{voice}</span>
            </>
          ) : t}
          {flagged && <FBadge tone="danger">flagged</FBadge>}
        </div>
      </div>
    </div>
  );
}

function HistCard({ label, v, tone }) {
  const c = tone === 'warn' ? F.warn : tone === 'danger' ? F.danger : F.text;
  return (
    <div style={{ background: F.card, borderRadius: 10, padding: 16, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, textAlign: 'center' }}>
      <div style={{ fontFamily: F.serif, fontSize: 24, color: c, fontWeight: 600 }}>{v}</div>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 5 }}>{label}</div>
    </div>
  );
}

function ActionBtn({ icon, label, sub, tone }) {
  const tones = {
    danger: { bg: 'rgba(196,90,74,0.08)', fg: F.danger, br: 'rgba(196,90,74,0.3)' },
    warn: { bg: 'rgba(212,165,116,0.06)', fg: F.gold, br: F.hairStrong },
    n: { bg: F.card, fg: F.text, br: F.hair },
  };
  const t = tones[tone] || tones.n;
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px',
      borderRadius: 10, background: t.bg, color: t.fg, border: 'none',
      boxShadow: `inset 0 0 0 0.5px ${t.br}`, cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={15}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <Icon name="chevron" size={12} color={F.textFaint}/>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════
// 3. CHAT MODERATION
// ═════════════════════════════════════════════════════════════
function ModChatsWeb() {
  return (
    <ModShell active="chats">
      <ModTopbar title="Chat-Moderation" subtitle="Live · letzte 24h · KI-Filter v2.1 aktiv"/>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 340px', minHeight: 0 }}>
        {/* Left — flagged list */}
        <div style={{ borderRight: `1px solid ${F.hair}`, overflow: 'auto', background: '#0d0a08' }}>
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase' }}>Gekennzeichnet</span>
            <FBadge tone="danger" style={{ marginLeft: 'auto' }}>12</FBadge>
          </div>
          {[
            { p1: 'anonym_2406', p2: 'sasha_vey', last: 'Voice 0:42', sev: 'high', t: 'gerade', sel: true },
            { p1: 'collect_42', p2: 'mira', last: 'Trinkgeld 24', sev: 'low', t: '2 min' },
            { p1: 'fan_8814', p2: 'esme', last: '"externe Link…"', sev: 'mid', t: '7 min' },
            { p1: 'anon_user_88', p2: 'liora', last: 'Aufdringlich x3', sev: 'high', t: '14 min' },
            { p1: 'spam_bot_xyz', p2: 'veda', last: 'Spam-Muster', sev: 'mid', t: '24 min' },
            { p1: 'm_8821', p2: 'adèle', last: 'Voice 1:14', sev: 'low', t: '38 min' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '14px 18px', display: 'flex', gap: 12, borderBottom: `0.5px solid ${F.hair}`, background: c.sel ? 'rgba(196,90,74,0.08)' : 'transparent', cursor: 'pointer' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FAvatar name={c.p1} size={28}/>
                <FAvatar name={c.p2} size={28}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: F.text, fontWeight: 600 }}>{c.p1}</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: F.textMuted, marginTop: 2 }}>↔ {c.p2}</div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textFaint, marginTop: 4 }}>{c.last}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <SevPill sev={c.sev}/>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, marginTop: 4 }}>{c.t}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center — stream */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '14px 24px', borderBottom: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FAvatar name="anonym_2406" size={32}/>
            <Icon name="arrowR" size={14} color={F.textMuted}/>
            <FAvatar name="Sasha Vey" size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 600 }}>anonym_2406 ↔ @sasha_vey</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>Chat-ID C-22841 · 14 Nachrichten · 3 Voice</div>
            </div>
            <FButton size="sm" variant="secondary" icon="download">Export</FButton>
            <FButton size="sm" variant="danger" icon="lock">Beide sperren</FButton>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', background: F.bg }}>
            <DayDivider2 label="Heute · 20:42"/>
            <EvMsg side="them" who="@sasha_vey" t="Hey, schöner Avatar ✦" w="20:42"/>
            <EvMsg side="me" who="@anonym_2406" t="Danke. Bitte respektiere meine Grenzen." w="20:43"/>
            <EvMsg side="them" who="@sasha_vey" t="Komm schon, sei nicht so." w="20:50"/>
            <EvMsg side="them" who="@sasha_vey" voice="0:34" w="20:51" flagged/>
            <EvMsg side="me" who="@anonym_2406" t="Ich habe nein gesagt." w="20:52"/>
            <EvMsg side="them" who="@sasha_vey" voice="0:42" w="20:58" flagged/>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(196,90,74,0.08)', boxShadow: `inset 0 0 0 0.5px rgba(196,90,74,0.3)`, fontFamily: F.sans, fontSize: 12, color: F.danger, display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
              <Icon name="shield" size={16}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>KI-Filter: Belästigungsmuster erkannt</div>
                <div style={{ color: F.textMuted, marginTop: 2 }}>Score 0.84 · „Druck nach Ablehnung", „wiederholte Voice trotz Stop"</div>
              </div>
              <FBadge tone="danger">Auto-Flag</FBadge>
            </div>
            <EvMsg side="me" who="@anonym_2406" t="Ich melde dich jetzt." w="21:00"/>
          </div>
        </div>

        {/* Right — Voice scanner */}
        <div style={{ borderLeft: `1px solid ${F.hair}`, padding: 22, overflow: 'auto', background: '#0d0a08' }}>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Voice-Analyse</div>
          <div style={{ background: F.card, borderRadius: 12, padding: 16, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button style={{ width: 36, height: 36, borderRadius: 18, background: F.goldGrad, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a0f06' }}>
                <Icon name="play" size={14}/>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text }}>Voice 20:58</div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>00:18 / 00:42</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1, height: 52 }}>
              {Array.from({ length: 76 }).map((_, k) => {
                const h = [4,8,12,16,20,14,8,12,18,22,16,10,6,10,16,22,18,12,8,14,20,24,18,12,8,4,10,16,20,14,10,6,8,14,18,22,16,10,8,4,8,14,18,22,16,10,12,18,22,16,10,8,14,18,12,8,4,8,12,16,20,14,8,12,16,12,8,4,6,8,12,16,8,4,6,8][k];
                return <div key={k} style={{ flex: 1, height: h, borderRadius: 1, background: k < 32 ? F.gold : k < 56 ? F.danger : F.textFaint }}/>;
              })}
            </div>
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Transkript (auto)</div>
          <div style={{ background: F.card, borderRadius: 10, padding: 14, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, fontFamily: F.sans, fontSize: 12, color: F.text, lineHeight: 1.6, marginBottom: 16 }}>
            <span style={{ color: F.textMuted }}>(0:00)</span> Hör mal, du brauchst nicht so zickig zu sein, das war doch nur ein <span style={{ background: 'rgba(196,90,74,0.2)', padding: '0 3px', borderRadius: 2 }}>nett gemeint</span>. <span style={{ color: F.textMuted }}>(0:12)</span> Schick mir bitte eine Antwort, sonst <span style={{ background: 'rgba(196,90,74,0.3)', padding: '0 3px', borderRadius: 2 }}>schreib ich allen…</span>
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Klassifikation</div>
          <ClassRow label="Belästigung" score={0.84} flag/>
          <ClassRow label="Druckmuster" score={0.71} flag/>
          <ClassRow label="Drohung" score={0.42}/>
          <ClassRow label="Synthetisch (KI)" score={0.08}/>
          <ClassRow label="Spam" score={0.05}/>

          <FButton variant="danger" full icon="trash" style={{ marginTop: 18 }}>Voice löschen</FButton>
        </div>
      </div>
    </ModShell>
  );
}

function DayDivider2({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 16px' }}>
      <div style={{ flex: 1, height: 1, background: F.hair }}/>
      <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: F.hair }}/>
    </div>
  );
}

function ClassRow({ label, score, flag }) {
  const c = score > 0.7 ? F.danger : score > 0.4 ? F.warn : F.success;
  return (
    <div style={{ padding: '9px 0', borderBottom: `0.5px solid ${F.hair}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ flex: 1, fontFamily: F.sans, fontSize: 12, color: F.text }}>{label}</span>
        {flag && <FBadge tone="danger">flag</FBadge>}
        <span style={{ fontFamily: F.mono, fontSize: 11, color: c, fontWeight: 600 }}>{score.toFixed(2)}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: F.bg, overflow: 'hidden' }}>
        <div style={{ width: `${score * 100}%`, height: '100%', background: c }}/>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 4. AUDIT LOG
// ═════════════════════════════════════════════════════════════
function ModAuditWeb() {
  const entries = [
    { who: 'J. Krieger', role: 'Mod L2', a: 'Voice-Recht entzogen', target: '@sasha_vey', ref: 'R-1082', t: '21:04:12', tone: 'warn' },
    { who: 'J. Krieger', role: 'Mod L2', a: 'Voice gelöscht (2x)', target: 'C-22841', ref: 'R-1082', t: '21:04:08', tone: 'mid' },
    { who: 'K. Mertens', role: 'Admin', a: 'Content approved', target: 'C-4214 · Liora', ref: '—', t: '21:03:54', tone: 'ok' },
    { who: 'system', role: 'KI-Filter', a: 'Auto-Flag (Belästigung 0.84)', target: 'C-22841 · Voice 20:58', ref: 'R-1082', t: '21:01:22', tone: 'mid' },
    { who: 'P. Hagen', role: 'Mod L1', a: 'Verwarnung Stufe 1', target: '@anon_user_88', ref: 'R-1078', t: '20:58:14', tone: 'warn' },
    { who: 'J. Krieger', role: 'Mod L2', a: 'Inhalt entfernt', target: 'Veda · Story IV', ref: 'R-1081', t: '20:52:08', tone: 'mid' },
    { who: 'system', role: 'Banking', a: 'Auszahlung eingefroren', target: '@spam_bot_xyz', ref: 'auto', t: '20:48:22', tone: 'warn' },
    { who: 'K. Mertens', role: 'Admin', a: 'Voice-Recht gewährt', target: '@adèle', ref: 'VR-204', t: '20:41:02', tone: 'ok' },
    { who: 'P. Hagen', role: 'Mod L1', a: 'Account gebannt', target: '@spam_bot_xyz', ref: 'R-1079', t: '20:32:14', tone: 'danger' },
    { who: 'system', role: 'KI-Filter', a: 'Duplikat-Hash gefunden', target: 'C-4198', ref: 'auto', t: '20:18:42', tone: 'mid' },
    { who: 'J. Krieger', role: 'Mod L2', a: 'Report geschlossen', target: 'R-1074', ref: '—', t: '20:12:08', tone: 'ok' },
  ];
  return (
    <ModShell active="audit">
      <ModTopbar title="Audit-Log" subtitle="Alle Aktionen · unveränderlich · heute" actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <FButton size="md" variant="secondary" icon="filter">Filter</FButton>
          <FButton size="md" variant="secondary" icon="download">CSV</FButton>
        </div>
      }/>

      <div style={{ padding: '16px 28px', display: 'flex', gap: 28, borderBottom: `1px solid ${F.hair}` }}>
        <AuditStat label="Aktionen heute" v="42"/>
        <AuditStat label="Approvals" v="28" tone="ok"/>
        <AuditStat label="Rejects" v="3" tone="mid"/>
        <AuditStat label="Bans" v="1" tone="danger"/>
        <AuditStat label="Eskalationen" v="2" tone="warn"/>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
          <Icon name="search" size={13} color={F.textMuted}/>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textFaint }}>Suche ID, Aktion, Nutzer…</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 40px' }}>
        {entries.map((e, i) => {
          const c = e.tone === 'danger' ? F.danger : e.tone === 'warn' ? F.warn : e.tone === 'mid' ? F.gold : F.success;
          return (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < entries.length - 1 ? `0.5px solid ${F.hair}` : 'none' }}>
              <div style={{ position: 'relative', width: 18, flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: 8, top: -16, bottom: -16, width: 1, background: F.hair }}/>
                <div style={{ position: 'absolute', left: 4, top: 4, width: 10, height: 10, borderRadius: 5, background: c, boxShadow: `0 0 0 3px ${F.bg}` }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220, flexShrink: 0 }}>
                <FAvatar name={e.who} size={28}/>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 500 }}>{e.who}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{e.role}</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: c, fontWeight: 600 }}>{e.a}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: F.textMuted }}>→</span>
                  <span style={{ fontFamily: F.sans, fontSize: 14, color: F.text }}>{e.target}</span>
                </div>
                {e.ref !== '—' && e.ref !== 'auto' && <div style={{ fontFamily: F.mono, fontSize: 11, color: F.gold, marginTop: 5 }}>Ref: {e.ref}</div>}
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: F.textMuted }}>{e.t}</div>
              <Icon name="chevron" size={14} color={F.textFaint}/>
            </div>
          );
        })}
      </div>
    </ModShell>
  );
}

function AuditStat({ label, v, tone }) {
  const c = tone === 'danger' ? F.danger : tone === 'warn' ? F.warn : tone === 'mid' ? F.gold : tone === 'ok' ? F.success : F.text;
  return (
    <div>
      <div style={{ fontFamily: F.serif, fontSize: 24, color: c, fontWeight: 600, lineHeight: 1 }}>{v}</div>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { ModQueueWeb, ModReportDetailWeb, ModChatsWeb, ModAuditWeb });
