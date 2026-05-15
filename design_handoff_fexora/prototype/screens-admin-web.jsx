// Admin Console — Web App (1440×900, no window chrome)
// Dashboard · Review-Queue · Review-Detail · Users · Creators & Badges · Analytics

// ─────────────────────────────────────────────────────────────
// Admin shell
// ─────────────────────────────────────────────────────────────
function AdminSidebar({ active = 'dashboard' }) {
  const items = [
    { id: 'dashboard', icon: 'home', label: 'Dashboard' },
    { id: 'queue', icon: 'eye', label: 'Review-Queue', badge: 24 },
    { id: 'content', icon: 'image', label: 'Inhalte' },
    { id: 'users', icon: 'user', label: 'Nutzer' },
    { id: 'creators', icon: 'star', label: 'Creator & Badges' },
    { id: 'reports', icon: 'flag', label: 'Reports' },
    { id: 'analytics', icon: 'sparkle', label: 'Analytics' },
    { id: 'wallet', icon: 'coin', label: 'Flames & Auszahlungen' },
    { id: 'mod', icon: 'shield', label: 'Moderation-Log' },
    { id: 'settings', icon: 'settings', label: 'Einstellungen' },
  ];
  return (
    <aside style={{ width: 240, flexShrink: 0, background: '#0d0a08', borderRight: `1px solid ${F.hair}`, padding: '24px 14px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 8px' }}>
        <FlameMark size={18}/>
        <div>
          <div style={{ fontFamily: F.serif, fontSize: 17, color: F.gold, fontWeight: 500, letterSpacing: 0.5 }}>FEXORA</div>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Admin</div>
        </div>
      </div>
      <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1.5, textTransform: 'uppercase', padding: '20px 12px 8px' }}>Übersicht</div>
      {items.map(it => (
        <button key={it.id} style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 8,
          background: it.id === active ? 'rgba(212,165,116,0.12)' : 'transparent',
          color: it.id === active ? F.gold : F.textMuted,
          border: 'none', cursor: 'pointer', marginBottom: 2,
          fontFamily: F.sans, fontSize: 13, fontWeight: it.id === active ? 600 : 500,
          boxShadow: it.id === active ? `inset 0 0 0 0.5px ${F.hairStrong}` : 'none',
          textAlign: 'left',
        }}>
          <Icon name={it.icon} size={16}/>
          <span style={{ flex: 1 }}>{it.label}</span>
          {it.badge && <span style={{ background: F.danger, color: '#fff', borderRadius: 9, padding: '0 7px', fontSize: 10, fontWeight: 700 }}>{it.badge}</span>}
        </button>
      ))}
      <div style={{ flex: 1 }}/>
      <div style={{ padding: '12px 10px', borderRadius: 10, background: F.card, display: 'flex', alignItems: 'center', gap: 10, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
        <FAvatar name="K M" size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: F.text, fontWeight: 600 }}>K. Mertens</div>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted }}>Admin · Senior</div>
        </div>
        <Icon name="moreH" size={14} color={F.textMuted}/>
      </div>
    </aside>
  );
}

function AdminTopbar({ title, subtitle = 'Heute · Donnerstag, 15. Mai 2026', search = true, actions }) {
  return (
    <div style={{ height: 68, flexShrink: 0, borderBottom: `1px solid ${F.hair}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, background: 'rgba(10,8,7,0.85)', backdropFilter: 'blur(12px)' }}>
      <div>
        <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1 }}/>
      {search && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderRadius: 20, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, width: 320, height: 40 }}>
          <Icon name="search" size={14} color={F.textMuted}/>
          <span style={{ flex: 1, fontFamily: F.sans, fontSize: 12, color: F.textFaint }}>Suche Inhalte, Nutzer, IDs…</span>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: F.textFaint, padding: '2px 6px', background: F.bg, borderRadius: 4 }}>⌘K</div>
        </div>
      )}
      {actions}
      <button style={{ width: 40, height: 40, borderRadius: 20, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, position: 'relative' }}>
        <Icon name="bell" size={16} color={F.gold}/>
        <div style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, background: F.danger }}/>
      </button>
    </div>
  );
}

function AdminShell({ active, children }) {
  return (
    <WebViewport>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AdminSidebar active={active}/>
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</main>
      </div>
    </WebViewport>
  );
}

// ═════════════════════════════════════════════════════════════
// 1. DASHBOARD
// ═════════════════════════════════════════════════════════════
function AdminDashboardWeb() {
  return (
    <AdminShell active="dashboard">
      <AdminTopbar title="Dashboard"/>
      <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <KPI label="Inhalte in Review" v="24" d="+6" i="eye" critical/>
          <KPI label="Neue Creator (24h)" v="8" d="+2" i="user"/>
          <KPI label="Flames-Umsatz (heute)" v="€4.812" d="+12.4%" i="coin"/>
          <KPI label="Reports offen" v="3" d="-2" i="flag" negative/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <AdminCard title="Aktivität · letzte 7 Tage" action="Details →">
            <FakeChart h={200}/>
            <div style={{ display: 'flex', gap: 26, marginTop: 14, fontFamily: F.sans, fontSize: 12 }}>
              <Legend color={F.gold} label="Inhalte hochgeladen" v="312"/>
              <Legend color="rgba(212,165,116,0.4)" label="Approved" v="248"/>
              <Legend color={F.danger} label="Rejected" v="22"/>
            </div>
          </AdminCard>

          <AdminCard title="Live Review-Queue" action="Alle →">
            {[
              { who: 'Liora', kind: 'Bild', age: '2 min' },
              { who: 'Esmé', kind: 'Clip · 02:14', age: '4 min' },
              { who: 'Veda', kind: 'Story · Kap. 4', age: '7 min' },
              { who: 'Mira', kind: 'Hörspiel · 18min', age: '12 min' },
              { who: 'Nara', kind: 'Bundle · 8 St.', age: '24 min' },
            ].map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < 4 ? `0.5px solid ${F.hair}` : 'none' }}>
                <FAvatar name={q.who} size={30}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.sans, fontSize: 13, color: F.text, fontWeight: 600 }}>{q.who}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{q.kind}</div>
                </div>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{q.age}</span>
              </div>
            ))}
          </AdminCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <AdminCard title="Top Creator (7 Tage)">
            {[
              { n: 'Liora', f: '4.214 🔥' },
              { n: 'Esmé V.', f: '3.108 🔥' },
              { n: 'Mira', f: '2.642 🔥' },
              { n: 'Sasha Vey', f: '1.882 🔥' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0' }}>
                <div style={{ fontFamily: F.serif, fontSize: 16, color: F.gold, fontStyle: 'italic', width: 20 }}>{i + 1}</div>
                <FAvatar name={c.n} size={26}/>
                <span style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: F.text }}>{c.n}</span>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: F.gold, fontWeight: 600 }}>{c.f}</span>
              </div>
            ))}
          </AdminCard>
          <AdminCard title="Flames-Pakete (heute)">
            {[
              { p: 'Pack 50', n: 42 },
              { p: 'Pack 120', n: 88 },
              { p: 'Pack 280', n: 36 },
              { p: 'Pack 800', n: 12 },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0' }}>
                <span style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: F.text }}>{c.p}</span>
                <div style={{ flex: 2, height: 6, borderRadius: 3, background: F.bg, overflow: 'hidden' }}>
                  <div style={{ width: `${(c.n / 88) * 100}%`, height: '100%', background: F.goldGrad }}/>
                </div>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, width: 30, textAlign: 'right' }}>{c.n}</span>
              </div>
            ))}
          </AdminCard>
          <AdminCard title="System">
            <SysRow label="Approval-Median" value="14 min" tone="ok"/>
            <SysRow label="Speicher" value="68%" tone="ok"/>
            <SysRow label="Voice-Recht-Anträge" value="6 offen" tone="warn"/>
            <SysRow label="Banking-Webhook" value="↑ live" tone="ok" last/>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}

function KPI({ label, v, d, i, critical, negative }) {
  return (
    <div style={{ background: F.card, borderRadius: 14, padding: 18, boxShadow: `inset 0 0 0 0.5px ${critical ? F.hairStrong : F.hair}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,165,116,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={i} size={15} color={F.gold}/>
        </div>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: F.serif, fontSize: 32, color: F.text, fontWeight: 500 }}>{v}</span>
        <span style={{ fontFamily: F.sans, fontSize: 12, color: negative ? F.success : F.gold, fontWeight: 600 }}>{d}</span>
      </div>
    </div>
  );
}

function AdminCard({ title, action, children }) {
  return (
    <div style={{ background: F.card, borderRadius: 14, padding: 20, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: F.serif, fontSize: 16, color: F.text, fontWeight: 600 }}>{title}</div>
        <div style={{ flex: 1 }}/>
        {action && <button style={{ background: 'transparent', border: 'none', color: F.gold, fontFamily: F.sans, fontSize: 12, cursor: 'pointer' }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

function FakeChart({ h = 180 }) {
  const data = [42, 58, 51, 68, 72, 65, 88];
  const data2 = [32, 41, 38, 48, 50, 44, 62];
  return (
    <svg width="100%" height={h} viewBox={`0 0 700 ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {[0, 1, 2, 3].map(i => <line key={i} x1="0" y1={(i + 1) * h / 5} x2="700" y2={(i + 1) * h / 5} stroke={F.hair} strokeDasharray="2 4"/>)}
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={F.gold} stopOpacity="0.5"/><stop offset="100%" stopColor={F.gold} stopOpacity="0"/></linearGradient></defs>
      <path d={`M 0 ${h - data[0] * (h - 30) / 100} ${data.map((v, i) => `L ${i * 116.7 + 50} ${h - v * (h - 30) / 100}`).join(' ')} L 700 ${h} L 0 ${h} Z`} fill="url(#g1)"/>
      <path d={`M 0 ${h - data[0] * (h - 30) / 100} ${data.map((v, i) => `L ${i * 116.7 + 50} ${h - v * (h - 30) / 100}`).join(' ')}`} stroke={F.gold} strokeWidth="2" fill="none"/>
      <path d={`M 0 ${h - data2[0] * (h - 30) / 100} ${data2.map((v, i) => `L ${i * 116.7 + 50} ${h - v * (h - 30) / 100}`).join(' ')}`} stroke="rgba(212,165,116,0.4)" strokeWidth="2" strokeDasharray="3 3" fill="none"/>
      {data.map((v, i) => <circle key={i} cx={i * 116.7 + 50} cy={h - v * (h - 30) / 100} r="4" fill={F.gold}/>)}
      {['Fr','Sa','So','Mo','Di','Mi','Do'].map((d, i) => <text key={d} x={i * 116.7 + 50} y={h - 4} fill={F.textFaint} fontSize="10" fontFamily="Geist" textAnchor="middle">{d}</text>)}
    </svg>
  );
}

function Legend({ color, label, v }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: F.textMuted }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
      <span>{label}</span>
      <span style={{ color: F.text, fontWeight: 600, marginLeft: 4 }}>{v}</span>
    </div>
  );
}

function SysRow({ label, value, tone, last }) {
  const colors = { ok: F.success, warn: F.warn, bad: F.danger };
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: last ? 'none' : `0.5px solid ${F.hair}`, fontFamily: F.sans, fontSize: 13 }}>
      <span style={{ color: F.textMuted, flex: 1 }}>{label}</span>
      <div style={{ width: 7, height: 7, borderRadius: 4, background: colors[tone], marginRight: 8 }}/>
      <span style={{ color: F.text, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 2. REVIEW QUEUE
// ═════════════════════════════════════════════════════════════
function AdminQueueWeb() {
  const rows = [
    { id: 'C-4214', who: 'Liora', kind: 'Bild', cap: 'Eine Kerze brennt nie zweimal gleich.', age: '2 min', risk: 'low', fsk: '18+' },
    { id: 'C-4213', who: 'Esmé Vauclair', kind: 'Clip', cap: 'Im Spiegelsalon — Akt I', age: '4 min', risk: 'low', fsk: '18+' },
    { id: 'C-4212', who: 'Veda', kind: 'Story', cap: 'Kapitel IV — Asche', age: '7 min', risk: 'mid', fsk: '18+', flag: 'KI-Score 0.6' },
    { id: 'C-4211', who: 'Mira', kind: 'Audio', cap: 'Das letzte Atelier · 24:12', age: '12 min', risk: 'low', fsk: '18+' },
    { id: 'C-4210', who: 'Nara', kind: 'Bundle', cap: 'Drei Akte · 8 Bilder, 2 Clips', age: '24 min', risk: 'low', fsk: '18+' },
    { id: 'C-4209', who: 'Sasha Vey', kind: 'Bild', cap: 'Wenn der Vorhang fällt', age: '38 min', risk: 'high', fsk: '18+', flag: 'Verdacht: Wiederholtes Motiv' },
    { id: 'C-4208', who: 'Adèle', kind: 'Voice', cap: 'Sprachnachricht-Vorlage', age: '52 min', risk: 'low', fsk: '12+' },
    { id: 'C-4207', who: 'Lior', kind: 'Bild', cap: 'Spätlicht III', age: '1 Std', risk: 'mid', fsk: '16+', flag: 'Gesicht unklar' },
  ];
  return (
    <AdminShell active="queue">
      <AdminTopbar title="Review-Queue" subtitle="24 offen · SLA-Median 14 min" actions={
        <FButton size="md" variant="primary" icon="play">Nächsten prüfen</FButton>
      }/>
      <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${F.hair}` }}>
        {[
          { l: 'Alle', n: 24, active: true },
          { l: 'Bilder', n: 12 }, { l: 'Clips', n: 5 }, { l: 'Audio', n: 4 }, { l: 'Stories', n: 3 },
        ].map(f => (
          <div key={f.l} style={{ padding: '7px 14px', borderRadius: 8, fontFamily: F.sans, fontSize: 12, fontWeight: 600, background: f.active ? 'rgba(212,165,116,0.15)' : F.card, color: f.active ? F.gold : F.textMuted, boxShadow: f.active ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', gap: 6 }}>{f.l}<span style={{ color: f.active ? F.gold : F.textFaint }}>{f.n}</span></div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: F.textMuted, fontFamily: F.sans, fontSize: 12 }}>
          <Icon name="filter" size={14}/> Risiko: <span style={{ color: F.text }}>Alle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: F.textMuted, fontFamily: F.sans, fontSize: 12 }}>
          Sortierung: <span style={{ color: F.text }}>Älteste zuerst</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.sans }}>
          <thead style={{ background: '#0d0a08', position: 'sticky', top: 0 }}>
            <tr style={{ borderBottom: `1px solid ${F.hair}` }}>
              {['', 'ID', 'Vorschau', 'Creator', 'Typ', 'Titel', 'Risiko', 'FSK', 'Eingegangen', ''].map((h, i) => (
                <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: F.textFaint, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: `0.5px solid ${F.hair}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, boxShadow: `inset 0 0 0 1.5px ${F.textFaint}` }}/>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>{r.id}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: 56, height: 40, borderRadius: 6, overflow: 'hidden' }}>
                    <FImage seed={i} h={40} locked="blur"/>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FAvatar name={r.who} size={28}/>
                    <span style={{ fontSize: 13, color: F.text, fontWeight: 500 }}>{r.who}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: F.textMuted }}>{r.kind}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: F.text, fontFamily: F.serif, fontStyle: 'italic', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.cap}
                  {r.flag && <div style={{ fontFamily: F.sans, fontStyle: 'normal', fontSize: 10, color: F.warn, marginTop: 3 }}>⚠ {r.flag}</div>}
                </td>
                <td style={{ padding: '14px 16px' }}><RiskPill risk={r.risk}/></td>
                <td style={{ padding: '14px 16px' }}><FBadge tone="gold">{r.fsk}</FBadge></td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: F.textMuted }}>{r.age}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ height: 30, padding: '0 12px', borderRadius: 6, background: 'rgba(107,154,110,0.15)', color: F.success, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', boxShadow: 'inset 0 0 0 0.5px rgba(107,154,110,0.3)' }}>Approve</button>
                    <button style={{ height: 30, padding: '0 12px', borderRadius: 6, background: 'rgba(196,90,74,0.12)', color: F.danger, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', boxShadow: 'inset 0 0 0 0.5px rgba(196,90,74,0.3)' }}>Reject</button>
                    <button style={{ height: 30, width: 30, borderRadius: 6, background: F.card, color: F.textMuted, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}><Icon name="moreH" size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function RiskPill({ risk }) {
  const map = { low: ['Niedrig', F.success], mid: ['Mittel', F.warn], high: ['Hoch', F.danger] };
  const [l, c] = map[risk];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: c, fontWeight: 600 }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: c }}/>{l}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════
// 3. REVIEW DETAIL
// ═════════════════════════════════════════════════════════════
function AdminReviewWeb() {
  return (
    <AdminShell active="queue">
      <AdminTopbar title="Review · C-4214" subtitle="Liora Noir · Bild · vor 2 min eingegangen" search={false} actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <FButton size="md" variant="secondary" icon="chevronL">Vorherig</FButton>
          <FButton size="md" variant="secondary">Nächste →</FButton>
        </div>
      }/>

      <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
        {/* Main preview */}
        <div style={{ padding: 28, borderRight: `1px solid ${F.hair}`, overflow: 'auto' }}>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginBottom: 16 }}>
            Review-Queue / <span style={{ color: F.text }}>C-4214</span>
          </div>

          {/* Creator strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <FAvatar name="Liora" size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: F.sans, fontSize: 15, color: F.text, fontWeight: 600 }}>Liora Noir</span>
                <FCreatorBadge kind="verified" size={12}/>
                <FCreatorBadge kind="voice" size={12}/>
                <FCreatorBadge kind="star" size={12}/>
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginTop: 3 }}>@liora.noir · Mitglied seit 12.2025 · 142 approved · 2 rejected</div>
            </div>
            <FButton size="md" variant="secondary">Profil öffnen</FButton>
          </div>

          <div style={{ fontFamily: F.serif, fontSize: 28, color: F.text, fontWeight: 500, fontStyle: 'italic', marginBottom: 6, letterSpacing: -0.3 }}>
            Eine Kerze brennt nie zweimal gleich.
          </div>
          <div style={{ fontFamily: F.serif, fontSize: 14, color: F.textMuted, marginBottom: 20, fontStyle: 'italic' }}>
            „Drei Aufnahmen aus dem Atelier am Spätnachmittag. Honiglicht, Seide, ein gehaltener Atem."
          </div>

          {/* Image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'repeat(2, 200px)', gap: 8, marginBottom: 18 }}>
            <div style={{ gridRow: 'span 2', position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
              <FImage seed={0} h={408}/>
              <div style={{ position: 'absolute', top: 12, left: 12 }}><FBadge tone="dark">1 / 3</FBadge></div>
            </div>
            <div style={{ borderRadius: 8, overflow: 'hidden' }}><FImage seed={1} h="100%"/></div>
            <div style={{ borderRadius: 8, overflow: 'hidden' }}><FImage seed={2} h="100%"/></div>
            <div style={{ borderRadius: 8, overflow: 'hidden' }}><FImage seed={3} h="100%"/></div>
            <div style={{ borderRadius: 8, background: F.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: F.gold, fontFamily: F.serif, fontStyle: 'italic', fontSize: 13, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}` }}>+ 2 weitere</div>
          </div>

          {/* AI screening */}
          <div style={{ background: F.card, borderRadius: 14, padding: 18, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Icon name="sparkle" size={14} color={F.gold}/>
              <span style={{ fontFamily: F.serif, fontSize: 15, color: F.text, fontWeight: 600 }}>KI-Vorprüfung</span>
              <FBadge tone="success">Unauffällig</FBadge>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>safety v3.2.1</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {[
                { l: 'FSK-Einstufung', v: '18+', c: F.gold },
                { l: 'Gesicht erkennbar', v: 'Ja', c: F.text },
                { l: 'Altersindiz', v: 'Erwachsen (98%)', c: F.success },
                { l: 'Duplikat-Hash', v: 'Keiner', c: F.success },
              ].map((m, i) => (
                <div key={i} style={{ paddingLeft: i ? 14 : 0, borderLeft: i ? `0.5px solid ${F.hair}` : 'none' }}>
                  <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{m.l}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 14, color: m.c, fontWeight: 600, marginTop: 6 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit */}
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Verlauf</div>
          <div style={{ background: F.card, borderRadius: 14, padding: 14, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
            {[
              { i: 'upload', t: 'Eingereicht von Liora', when: '21:02 · vor 2 min' },
              { i: 'sparkle', t: 'KI-Vorprüfung abgeschlossen', when: '21:02 · vor 2 min' },
              { i: 'eye', t: 'In Bearbeitung — K. Mertens', when: 'jetzt' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `0.5px solid ${F.hair}` : 'none' }}>
                <Icon name={e.i} size={14} color={F.gold}/>
                <span style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: F.text }}>{e.t}</span>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{e.when}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision rail */}
        <div style={{ padding: 28, background: '#0d0a08', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>Entscheidung</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <FButton variant="success" full size="lg" icon="check">Approve & veröffentlichen</FButton>
            <FButton variant="secondary" full size="md">Approve mit FSK-Anpassung</FButton>
            <FButton variant="danger" full size="md" icon="x">Reject</FButton>
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Quick Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {['FSK 18+', 'Premium-Qualität', 'Boutique-Auswahl', 'Voice-fähig', 'Bundle-Kandidat'].map(t => (
              <span key={t} style={{ padding: '6px 10px', borderRadius: 6, background: F.card, color: F.textMuted, fontFamily: F.sans, fontSize: 11, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>{t}</span>
            ))}
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Notiz (intern)</div>
          <div style={{ background: F.card, borderRadius: 10, padding: 12, minHeight: 90, fontFamily: F.sans, fontSize: 13, color: F.textFaint, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, marginBottom: 22, lineHeight: 1.5 }}>
            Konsistent mit dem Atelier-Stil. Honiglicht-Reihe für die Editorial-Auswahl…
          </div>

          <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Preis-Empfehlung</div>
          <div style={{ background: F.card, borderRadius: 12, padding: 16, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: F.serif, fontSize: 30, color: F.gold, fontWeight: 600 }}>24</span>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold }}>Flames</span>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, marginLeft: 'auto' }}>Bereich 18 – 32</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: F.bg, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '20%', right: '20%', top: 0, bottom: 0, background: 'rgba(212,165,116,0.15)' }}/>
              <div style={{ position: 'absolute', left: '60%', top: -3, width: 2, height: 11, background: F.gold }}/>
            </div>
          </div>

          <div style={{ flex: 1 }}/>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textFaint, textAlign: 'center', marginTop: 16 }}>⌘ ⏎ Approve · ⌘ ⌫ Reject · ⌘ → Nächste</div>
        </div>
      </div>
    </AdminShell>
  );
}

// ═════════════════════════════════════════════════════════════
// 4. USERS
// ═════════════════════════════════════════════════════════════
function AdminUsersWeb() {
  const users = [
    { id: 'U-29481', n: 'anonym_2406', email: 'lior***@noir.studio', kind: 'Fan', age: '18+ ✓', flames: 142, joined: '08.05.2026', status: 'active' },
    { id: 'U-29402', n: 'mira_collects', email: 'mira***@gmail.com', kind: 'Fan', age: '18+ ✓', flames: 880, joined: '04.05.2026', status: 'active' },
    { id: 'U-29388', n: 'esme.vauclair', email: 'esme***@maison.com', kind: 'Creator', age: '18+ ✓', flames: 2412, joined: '12.04.2026', status: 'active', badges: ['verified','voice','star'] },
    { id: 'U-29350', n: 'sasha_vey', email: 'sa***@vey.io', kind: 'Creator', age: '18+ ✓', flames: 612, joined: '01.04.2026', status: 'pending', badges: ['verified'] },
    { id: 'U-29331', n: 'liora.noir', email: 'liora***@noir.studio', kind: 'Creator', age: '18+ ✓', flames: 8214, joined: '15.03.2026', status: 'active', badges: ['verified','voice','star'] },
    { id: 'U-29280', n: 'collect_42', email: 'c4***@protonmail.com', kind: 'Fan', age: '18+ ✓', flames: 12, joined: '10.03.2026', status: 'active' },
    { id: 'U-29104', n: 'spam_bot_xyz', email: 'jh***@temp.email', kind: 'Fan', age: '?', flames: 0, joined: '02.03.2026', status: 'banned' },
  ];
  return (
    <AdminShell active="users">
      <AdminTopbar title="Nutzer" subtitle="24.842 gesamt · 614 Creator · 23.114 Fans"/>
      <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${F.hair}` }}>
        {['Alle 24.842','Fans 23.114','Creator 614','Wartet 8','Gebannt 22'].map((f, i) => (
          <div key={f} style={{ padding: '7px 14px', borderRadius: 8, fontFamily: F.sans, fontSize: 12, fontWeight: 600, background: i === 0 ? 'rgba(212,165,116,0.15)' : F.card, color: i === 0 ? F.gold : F.textMuted, boxShadow: i === 0 ? `inset 0 0 0 0.5px ${F.hairStrong}` : `inset 0 0 0 0.5px ${F.hair}` }}>{f}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <FButton size="md" variant="secondary" icon="download">Export CSV</FButton>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.sans }}>
          <thead style={{ background: '#0d0a08' }}>
            <tr style={{ borderBottom: `1px solid ${F.hair}` }}>
              {['ID', 'Nutzer', 'E-Mail', 'Typ', 'Alter', 'Flames', 'Beigetreten', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: F.textFaint, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: `0.5px solid ${F.hair}` }}>
                <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11, color: F.textMuted }}>{u.id}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FAvatar name={u.n} size={32}/>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 13, color: F.text, fontWeight: 500 }}>@{u.n}</span>
                      {u.badges && u.badges.map(b => <FCreatorBadge key={b} kind={b} size={11}/>)}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: F.textMuted, fontFamily: F.mono }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}><FBadge tone={u.kind === 'Creator' ? 'gold' : 'dark'}>{u.kind}</FBadge></td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: u.age === '?' ? F.danger : F.success, fontWeight: 600 }}>{u.age}</td>
                <td style={{ padding: '14px 16px', fontFamily: F.serif, fontSize: 16, color: F.gold, fontWeight: 600 }}>{u.flames.toLocaleString('de')} 🔥</td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: F.textMuted }}>{u.joined}</td>
                <td style={{ padding: '14px 16px' }}><StatusPill status={u.status}/></td>
                <td style={{ padding: '14px 16px' }}><Icon name="moreH" size={14} color={F.textMuted}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function StatusPill({ status }) {
  const map = { active: ['Aktiv', F.success], pending: ['Wartet', F.warn], banned: ['Gebannt', F.danger] };
  const [l, c] = map[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: c, fontWeight: 600 }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: c }}/>{l}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════
// 5. CREATOR & BADGES (Voice-Recht)
// ═════════════════════════════════════════════════════════════
function AdminCreatorsWeb() {
  return (
    <AdminShell active="creators">
      <AdminTopbar title="Creator & Badges" subtitle="614 aktiv · 142 Voice-Recht · 22 Top Tier"/>
      <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 26 }}>
          <KPI label="Aktive Creator" v="614" d="+12" i="user"/>
          <KPI label="Verifiziert" v="488" d="+8" i="verified"/>
          <KPI label="Voice-Recht" v="142" d="+4" i="mic"/>
          <KPI label="Top Tier" v="22" d="+1" i="star"/>
        </div>

        {/* Voice-Recht-Anträge */}
        <div style={{ background: F.card, borderRadius: 14, padding: 22, boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="mic" size={16} color={F.gold}/>
            <span style={{ fontFamily: F.serif, fontSize: 17, color: F.text, fontWeight: 600, marginLeft: 10 }}>Voice-Recht · 6 Anträge offen</span>
            <FBadge tone="gold" style={{ marginLeft: 12 }}>Plausibilitäts-Prüfung</FBadge>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: F.gold, cursor: 'pointer' }}>Alle ansehen →</span>
          </div>
          {[
            { n: 'Sasha Vey', sample: '0:42 · Sprachprobe gelesen', score: 'Hoch', when: 'vor 1 Std' },
            { n: 'Veda', sample: '0:31 · spontan', score: 'Mittel', when: 'vor 3 Std' },
            { n: 'Adèle', sample: '0:58 · gelesen + frei', score: 'Hoch', when: 'gestern' },
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 2 ? `0.5px solid ${F.hair}` : 'none' }}>
              <FAvatar name={v.n} size={40}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: F.text, fontWeight: 600 }}>{v.n}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <button style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(212,165,116,0.15)', border: 'none', color: F.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="play" size={11}/>
                  </button>
                  <div style={{ width: 200, height: 22, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {Array.from({ length: 40 }).map((_, k) => {
                      const h = [3,6,12,8,16,10,6,14,18,12,8,4,10,16,12,8,6,14,18,12,10,16,12,8,6,4,8,12,16,10,6,3,8,12,16,10,8,6,4,3][k];
                      return <div key={k} style={{ flex: 1, height: h, borderRadius: 1, background: F.gold, opacity: 0.7 }}/>;
                    })}
                  </div>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted }}>{v.sample}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>KI-Plausibilität</span>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: v.score === 'Hoch' ? F.success : F.warn, fontWeight: 600, marginTop: 2 }}>{v.score}</span>
              </div>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: F.textMuted, width: 90 }}>{v.when}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <FButton size="sm" variant="success" icon="check">Gewähren</FButton>
                <FButton size="sm" variant="ghost">Ablehnen</FButton>
              </div>
            </div>
          ))}
        </div>

        {/* All creators table */}
        <div style={{ background: F.card, borderRadius: 14, padding: 22, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: F.serif, fontSize: 17, color: F.text, fontWeight: 600 }}>Alle Creator</div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: F.bg, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
              <Icon name="search" size={12} color={F.textMuted}/>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: F.textFaint }}>Creator suchen…</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.sans }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${F.hair}` }}>
                {['Creator','Werke','Verehrer','Flames (30T)','Badges','Letzter Upload','Status'].map(h => (
                  <th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: F.textFaint, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { n: 'Liora Noir', w: 142, fans: '24.8k', flames: '8.214', b: ['verified','voice','star'], when: 'jetzt', status: 'active' },
                { n: 'Esmé Vauclair', w: 98, fans: '18.2k', flames: '6.108', b: ['verified','voice','star'], when: '4 min', status: 'active' },
                { n: 'Mira Aurum', w: 64, fans: '12.4k', flames: '3.642', b: ['verified','voice'], when: '12 min', status: 'active' },
                { n: 'Sasha Vey', w: 28, fans: '4.8k', flames: '882', b: ['verified'], when: '38 min', status: 'active' },
                { n: 'Veda', w: 18, fans: '2.1k', flames: '212', b: ['verified'], when: 'gestern', status: 'pending' },
                { n: 'Adèle', w: 12, fans: '1.8k', flames: '142', b: ['verified'], when: '12.5.', status: 'active' },
              ].map((c, i) => (
                <tr key={i} style={{ borderBottom: i < 5 ? `0.5px solid ${F.hair}` : 'none' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FAvatar name={c.n} size={32}/>
                      <span style={{ fontSize: 13, color: F.text, fontWeight: 500 }}>{c.n}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 13, color: F.text }}>{c.w}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, color: F.text }}>{c.fans}</td>
                  <td style={{ padding: '12px 10px', fontFamily: F.serif, fontSize: 15, color: F.gold, fontWeight: 600 }}>{c.flames} 🔥</td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>{c.b.map(b => <FCreatorBadge key={b} kind={b} size={11}/>)}</div>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: F.textMuted }}>{c.when}</td>
                  <td style={{ padding: '12px 10px' }}><StatusPill status={c.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

// ═════════════════════════════════════════════════════════════
// 6. ANALYTICS
// ═════════════════════════════════════════════════════════════
function AdminAnalyticsWeb() {
  return (
    <AdminShell active="analytics">
      <AdminTopbar title="Analytics" actions={
        <button style={{ height: 40, padding: '0 14px', borderRadius: 8, background: F.card, color: F.text, border: 'none', fontFamily: F.sans, fontSize: 13, boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', gap: 6 }}>
          7 Tage <Icon name="chevronD" size={12}/>
        </button>
      }/>
      <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <KPI label="Flames-Umsatz" v="€31.220" d="+18%" i="coin"/>
          <KPI label="Aktive Nutzer" v="8.412" d="+4.2%" i="user"/>
          <KPI label="Conversion" v="6.8%" d="+0.4pp" i="sparkle"/>
          <KPI label="ø Warenkorb" v="42 🔥" d="+3" i="bookmark"/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <AdminCard title="Umsatz nach Medientyp">
            <FakeChart h={220}/>
            <div style={{ display: 'flex', gap: 22, marginTop: 14, fontFamily: F.sans, fontSize: 12 }}>
              <Legend color={F.gold} label="Bilder" v="€14.840"/>
              <Legend color="rgba(212,165,116,0.6)" label="Clips" v="€9.220"/>
              <Legend color="rgba(212,165,116,0.3)" label="Hörspiele" v="€4.880"/>
              <Legend color="rgba(212,165,116,0.15)" label="Stories" v="€2.280"/>
            </div>
          </AdminCard>
          <AdminCard title="Funnel · Anonym → Käufer">
            {[
              { l: 'Besucher', v: 28412, p: 100 },
              { l: 'Registriert', v: 4218, p: 14.8 },
              { l: 'Aufgeladen', v: 1402, p: 4.9 },
              { l: 'Erster Kauf', v: 892, p: 3.1 },
              { l: 'Wiederholungskäufer', v: 412, p: 1.4 },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.sans, fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: F.text }}>{f.l}</span>
                  <span style={{ color: F.textMuted }}>{f.v.toLocaleString('de')} · {f.p}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: F.bg, overflow: 'hidden' }}>
                  <div style={{ width: `${f.p}%`, height: '100%', background: F.goldGrad }}/>
                </div>
              </div>
            ))}
          </AdminCard>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <AdminCard title="Geografie">
            {[
              { c: '🇩🇪', n: 'Deutschland', v: '42%' },
              { c: '🇦🇹', n: 'Österreich', v: '18%' },
              { c: '🇨🇭', n: 'Schweiz', v: '14%' },
              { c: '🇫🇷', n: 'Frankreich', v: '11%' },
              { c: '🇳🇱', n: 'Niederlande', v: '8%' },
            ].map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? `0.5px solid ${F.hair}` : 'none' }}>
                <span style={{ fontSize: 20 }}>{g.c}</span>
                <span style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: F.text }}>{g.n}</span>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: F.gold, fontWeight: 600 }}>{g.v}</span>
              </div>
            ))}
          </AdminCard>
          <AdminCard title="Approval Lead Times">
            {[
              { l: 'Median (heute)', v: '14 min', c: F.text },
              { l: 'P90', v: '42 min', c: F.text },
              { l: 'Approval-Rate', v: '92.4%', c: F.success },
              { l: 'ø Bearbeitungszeit', v: '8.2 min', c: F.text },
              { l: 'Reject-Gründe (Top)', v: 'FSK · Qualität · Duplikat', c: F.text },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? `0.5px solid ${F.hair}` : 'none', fontFamily: F.sans, fontSize: 13 }}>
                <span style={{ color: F.textMuted }}>{r.l}</span>
                <span style={{ color: r.c, fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminDashboardWeb, AdminQueueWeb, AdminReviewWeb, AdminUsersWeb, AdminCreatorsWeb, AdminAnalyticsWeb });
