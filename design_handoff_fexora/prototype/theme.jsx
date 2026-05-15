// Fexora — Design Tokens + shared UI primitives
// Dark luxury palette inspired by the gold serif logo.

const F = {
  // backgrounds
  bg: '#0a0807',
  bgGrad: 'radial-gradient(120% 80% at 50% -10%, #1a1410 0%, #0a0807 60%)',
  surface: '#14110d',
  card: '#1a1612',
  elevated: '#221c16',
  // borders
  hair: 'rgba(212, 165, 116, 0.10)',
  hairStrong: 'rgba(212, 165, 116, 0.22)',
  // brand
  gold: '#d4a574',
  goldBright: '#e8c089',
  goldDeep: '#a07a4d',
  goldDark: '#6b5235',
  goldGrad: 'linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%)',
  // text
  text: '#f5efe6',
  textMuted: '#9a8f82',
  textFaint: '#5a5249',
  // status
  danger: '#c45a4a',
  success: '#6b9a6e',
  warn: '#d4a574',
  // serif/sans
  serif: '"Cormorant Garamond", "Cormorant", "Times New Roman", serif',
  sans: '"Geist", "Inter", -apple-system, system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
};

window.F = F;

// ─────────────────────────────────────────────────────────────
// Icons — minimal hairline SVG set
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6, style }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', style };
  const paths = {
    flame: <><path d="M12 2c1 3 4 4 4 8a4 4 0 11-8 0c0-2 1-3 2-3.5C9 8 8 6 9 4c1 2 3 2 3-2z"/></>,
    home: <><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>,
    chat: <><path d="M21 12a8 8 0 11-3.3-6.5L21 5l-1 4a8 8 0 011 3z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    heart: <><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></>,
    bookmark: <><path d="M6 4h12v17l-6-4-6 4z"/></>,
    play: <><path d="M6 4l14 8-14 8z" fill="currentColor"/></>,
    pause: <><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-9 9"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></>,
    book: <><path d="M4 4h7a4 4 0 014 4v12H8a4 4 0 01-4-4zM20 4h-7a4 4 0 00-4 4v12h7a4 4 0 004-4z"/></>,
    headphone: <><path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 012-2h1v6H6a2 2 0 01-2-2zM20 14a2 2 0 00-2-2h-1v6h1a2 2 0 002-2z"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
    unlock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 017.6-1.7"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <><path d="M5 12l4 4 10-10"/></>,
    x: <><path d="M6 6l12 12M18 6L6 18"/></>,
    chevron: <><path d="M9 6l6 6-6 6"/></>,
    chevronL: <><path d="M15 6l-6 6 6 6"/></>,
    chevronD: <><path d="M6 9l6 6 6-6"/></>,
    chevronU: <><path d="M18 15l-6-6-6 6"/></>,
    star: <><path d="M12 3l2.6 5.6 6.1.6-4.6 4.3 1.3 6L12 16.8 6.6 19.5l1.3-6L3.3 9.2l6.1-.6z"/></>,
    verified: <><path d="M12 2l2 2 3-.5.5 3 2 2-1.5 2.5L20 14l-3 .5L15 17l-3-.5L9 17l-2-2.5L4 14l1.5-2.5L4 9l3-.5L7.5 5.5 10.5 6z"/><path d="M9 12l2 2 4-4"/></>,
    bell: <><path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    send: <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></>,
    flag: <><path d="M4 21V4M4 4h14l-3 5 3 5H4"/></>,
    shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M3 3l18 18M10.6 6.1A11 11 0 0112 6c7 0 11 8 11 8a18 18 0 01-3.3 4.3M6.6 6.6A18 18 0 001 12s4 8 11 8c1.7 0 3.3-.4 4.7-1"/><path d="M9.9 9.9A3 3 0 0014 14"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"/></>,
    edit: <><path d="M14 4l6 6L8 22H2v-6z"/></>,
    upload: <><path d="M12 16V4m-5 5l5-5 5 5M4 20h16"/></>,
    download: <><path d="M12 4v12m-5-5l5 5 5-5M4 20h16"/></>,
    filter: <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>,
    coin: <><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5C9 8 10 7 12 7s3 1 3 2.5-1.2 2-3 2.3-3 1-3 2.2S10 17 12 17s3-1 3-2.5"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2"/></>,
    waveform: <><path d="M3 12h2M7 8v8M11 4v16M15 8v8M19 12h2"/></>,
    moreH: <><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>,
    moreV: <><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></>,
    arrowR: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowL: <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
function FexoraLogo({ height = 28, color = '#d4a574', wordmark = true }) {
  // Use the actual image asset
  return (
    <img src="assets/fexora-logo.png" alt="FEXORA"
      style={{ height, width: 'auto', display: 'block', filter: color !== '#d4a574' ? `brightness(0) saturate(100%) invert(0.9)` : 'none' }} />
  );
}

// Just the flame mark (for compact spaces)
function FlameMark({ size = 28, color = '#d4a574' }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
      <path d="M20 4c-2 6 -6 9 -6 16 0 6 3 10 6 12 3-2 6-6 6-12 0-7-4-10-6-16z M20 2c-1 3 -3 4 -3 7 0 3 1 5 3 6 2-1 3-3 3-6 0-3-2-4-3-7z" fill={color}/>
      <path d="M20 28v24" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────
function FButton({ children, variant = 'primary', size = 'md', icon, style, full, ...rest }) {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13, gap: 6 },
    md: { h: 44, px: 18, fs: 14, gap: 8 },
    lg: { h: 52, px: 24, fs: 15, gap: 10 },
  };
  const s = sizes[size];
  const variants = {
    primary: { background: F.goldGrad, color: '#1a0f06', boxShadow: '0 4px 16px rgba(212,165,116,0.25), inset 0 1px 0 rgba(255,255,255,0.3)' },
    secondary: { background: 'rgba(212,165,116,0.08)', color: F.gold, boxShadow: `inset 0 0 0 1px ${F.hairStrong}` },
    ghost: { background: 'transparent', color: F.text, boxShadow: 'none' },
    danger: { background: 'rgba(196,90,74,0.12)', color: F.danger, boxShadow: 'inset 0 0 0 1px rgba(196,90,74,0.3)' },
    success: { background: 'rgba(107,154,110,0.15)', color: F.success, boxShadow: 'inset 0 0 0 1px rgba(107,154,110,0.35)' },
  };
  return (
    <button {...rest} style={{
      height: s.h, padding: `0 ${s.px}px`, gap: s.gap,
      fontSize: s.fs, fontWeight: 600, letterSpacing: 0.2,
      fontFamily: F.sans, border: 'none', borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', whiteSpace: 'nowrap',
      width: full ? '100%' : undefined,
      ...variants[variant], ...style,
    }}>
      {icon && <Icon name={icon} size={s.fs + 2}/>}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Badges
// ─────────────────────────────────────────────────────────────
function FBadge({ children, tone = 'gold', icon, style }) {
  const tones = {
    gold: { bg: 'rgba(212,165,116,0.14)', fg: F.gold, br: 'rgba(212,165,116,0.3)' },
    dark: { bg: 'rgba(0,0,0,0.5)', fg: F.text, br: F.hair },
    danger: { bg: 'rgba(196,90,74,0.14)', fg: F.danger, br: 'rgba(196,90,74,0.3)' },
    success: { bg: 'rgba(107,154,110,0.14)', fg: F.success, br: 'rgba(107,154,110,0.3)' },
    glass: { bg: 'rgba(255,255,255,0.08)', fg: F.text, br: 'rgba(255,255,255,0.15)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 22, padding: '0 9px', borderRadius: 999,
      background: t.bg, color: t.fg, boxShadow: `inset 0 0 0 0.5px ${t.br}`,
      fontFamily: F.sans, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={11}/>}
      {children}
    </span>
  );
}

// Verified / Voice / Top Creator badges (gold sigil)
function FCreatorBadge({ kind = 'verified', size = 16 }) {
  const styles = {
    verified: { color: F.gold, icon: 'verified', title: 'Verified' },
    voice: { color: '#c9a96b', icon: 'mic', title: 'Voice enabled' },
    star: { color: F.goldBright, icon: 'star', title: 'Top Creator' },
  };
  const s = styles[kind];
  return (
    <span title={s.title} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size + 4, height: size + 4, borderRadius: '50%',
      background: 'rgba(212,165,116,0.18)', color: s.color,
      boxShadow: 'inset 0 0 0 0.5px rgba(212,165,116,0.4)',
    }}>
      <Icon name={s.icon} size={size - 4}/>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Avatar — gradient placeholder, optionally with image
// ─────────────────────────────────────────────────────────────
function FAvatar({ src, name = 'A', size = 40, ring = false, story = false }) {
  const initials = String(name).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  // deterministic gradient from name
  let h1 = 0; for (const c of name) h1 = (h1 * 31 + c.charCodeAt(0)) % 360;
  const inner = (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: src ? `url(${src}) center/cover` : `linear-gradient(135deg, oklch(0.55 0.08 ${h1}), oklch(0.30 0.05 ${(h1+60)%360}))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.serif, fontSize: size * 0.4, fontWeight: 500, color: F.text,
      flexShrink: 0,
    }}>{!src && initials}</div>
  );
  if (story) return (
    <div style={{ padding: 2, borderRadius: '50%', background: F.goldGrad, flexShrink: 0 }}>
      <div style={{ padding: 2, borderRadius: '50%', background: F.bg }}>{inner}</div>
    </div>
  );
  if (ring) return (
    <div style={{ padding: 1.5, borderRadius: '50%', background: F.gold, flexShrink: 0 }}>
      <div style={{ padding: 1.5, borderRadius: '50%', background: F.bg }}>{inner}</div>
    </div>
  );
  return inner;
}

// ─────────────────────────────────────────────────────────────
// Placeholder image — moody gradient stand-in (premium/mysterious)
// ─────────────────────────────────────────────────────────────
function FImage({ seed = 1, w = '100%', h = 200, locked = 'none', label, style, blur = 0, radius = 0 }) {
  // deterministic moody gradient based on seed (oklch warm tones)
  const seeds = [
    ['#3a2418', '#1a0f08'],
    ['#2a1a14', '#0f0805'],
    ['#1f1612', '#0a0605'],
    ['#3a2a1c', '#1a1208'],
    ['#241814', '#0a0604'],
    ['#2e1f16', '#120a05'],
    ['#1a1410', '#080604'],
    ['#3c2818', '#1c1208'],
    ['#28201a', '#0f0a07'],
    ['#2a1c14', '#100805'],
    ['#352318', '#1a0e06'],
    ['#241a14', '#0c0805'],
  ];
  const [c1, c2] = seeds[seed % seeds.length];
  // shape silhouette using svg
  const shapes = [
    // candle / flame
    <svg key="s" width="80%" height="80%" viewBox="0 0 100 140" fill="none" style={{ opacity: 0.4 }}>
      <path d="M50 30 C 45 35, 45 45, 50 50 C 55 45, 55 35, 50 30 Z" fill={F.gold} opacity="0.6"/>
      <path d="M48 50 L 48 90 L 52 90 L 52 50 Z" fill={F.gold} opacity="0.3"/>
    </svg>,
    // figure
    <svg key="f" width="80%" height="80%" viewBox="0 0 100 140" fill="none" style={{ opacity: 0.35 }}>
      <ellipse cx="50" cy="45" rx="14" ry="18" fill={F.gold} opacity="0.5"/>
      <path d="M30 130 Q 30 70, 50 70 Q 70 70, 70 130" fill={F.gold} opacity="0.4"/>
    </svg>,
    // diamond
    <svg key="d" width="60%" height="60%" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.3 }}>
      <path d="M50 10 L 90 50 L 50 90 L 10 50 Z" stroke={F.gold} strokeWidth="1" fill="none"/>
      <path d="M50 30 L 70 50 L 50 70 L 30 50 Z" stroke={F.gold} strokeWidth="0.8" fill="none"/>
    </svg>,
    // monogram F
    <div key="m" style={{ fontFamily: F.serif, fontSize: 120, color: F.gold, opacity: 0.18, lineHeight: 1, letterSpacing: -4 }}>F</div>,
  ];
  const shape = shapes[seed % shapes.length];

  return (
    <div style={{
      position: 'relative', width: w, height: h, overflow: 'hidden',
      background: `radial-gradient(80% 60% at 30% 20%, ${c1} 0%, ${c2} 70%, #050302 100%)`,
      borderRadius: radius,
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        filter: blur ? `blur(${blur}px)` : 'none',
      }}>{shape}</div>
      {/* grain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(50% 60% at 80% 90%, rgba(212,165,116,0.08), transparent 70%), radial-gradient(40% 40% at 20% 100%, rgba(0,0,0,0.4), transparent 70%)`,
        pointerEvents: 'none',
      }}/>
      {locked === 'blur' && <BlurOverlay/>}
      {locked === 'mosaic' && <MosaicOverlay seed={seed}/>}
      {locked === 'dark' && <DarkOverlay/>}
      {locked === 'gold' && <GoldOverlay/>}
      {label && (
        <div style={{
          position: 'absolute', bottom: 10, left: 12, right: 12,
          fontFamily: F.serif, fontSize: 14, color: F.text, opacity: 0.9, fontStyle: 'italic',
        }}>{label}</div>
      )}
    </div>
  );
}

function BlurOverlay() {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
        background: 'rgba(10,8,7,0.35)',
      }}/>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(212,165,116,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 0 1px rgba(212,165,116,0.5)',
        }}>
          <Icon name="lock" size={20} color={F.gold}/>
        </div>
      </div>
    </>
  );
}

function MosaicOverlay({ seed = 1 }) {
  // tiny chequer of warm dark squares
  const cells = [];
  for (let i = 0; i < 16; i++) for (let j = 0; j < 24; j++) {
    const k = (i * 7 + j * 11 + seed * 3) % 6;
    cells.push(<div key={`${i}-${j}`} style={{
      background: ['#2a1d14','#1f1610','#15100b','#241a12','#1b130d','#2e1f15'][k],
    }}/>);
  }
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: 'repeat(24,1fr)', gridTemplateRows: 'repeat(16,1fr)',
      }}>{cells}</div>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 44, height: 44, borderRadius: '50%', background: 'rgba(10,8,7,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px rgba(212,165,116,0.5)',
      }}>
        <Icon name="lock" size={20} color={F.gold}/>
      </div>
    </>
  );
}

function DarkOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(10,8,7,0.78)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <Icon name="lock" size={22} color={F.gold}/>
      <div style={{ fontFamily: F.sans, fontSize: 11, color: F.gold, letterSpacing: 1.4, textTransform: 'uppercase' }}>Unlock</div>
    </div>
  );
}

function GoldOverlay() {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(212,165,116,0.4), rgba(160,122,77,0.6) 60%, rgba(60,40,25,0.7))',
        mixBlendMode: 'multiply',
      }}/>
      <div style={{
        position: 'absolute', inset: 0, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      }}/>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <FlameMark size={26} color="#fff"/>
      </div>
    </>
  );
}

// Card surface
function FCard({ children, p = 16, style, hover }) {
  return (
    <div style={{
      background: F.card, borderRadius: 14, padding: p,
      boxShadow: `inset 0 0 0 0.5px ${F.hair}`,
      ...style,
    }}>{children}</div>
  );
}

// Gold divider with center ornament
function GoldDivider({ ornament = true, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${F.hairStrong}, transparent)` }}/>
      {ornament && <div style={{ width: 4, height: 4, background: F.gold, transform: 'rotate(45deg)' }}/>}
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${F.hairStrong}, transparent)` }}/>
    </div>
  );
}

// Tab bar (iOS bottom nav, glass)
function FTabBar({ active = 'home', onPick = () => {} }) {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Feed' },
    { id: 'search', icon: 'search', label: 'Entdecken' },
    { id: 'plus', icon: 'plus', label: '' },
    { id: 'chat', icon: 'chat', label: 'Chat' },
    { id: 'me', icon: 'user', label: 'Ich' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16, height: 64,
      borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      background: 'rgba(20,17,13,0.7)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}, 0 8px 32px rgba(0,0,0,0.5)`,
      zIndex: 20,
    }}>
      {tabs.map(t => {
        const isPlus = t.id === 'plus';
        const isActive = t.id === active;
        if (isPlus) return (
          <button key={t.id} onClick={() => onPick(t.id)} style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: F.goldGrad, color: '#1a0f06',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(212,165,116,0.4)', cursor: 'pointer',
          }}><Icon name="plus" size={22} strokeWidth={2.4}/></button>
        );
        return (
          <button key={t.id} onClick={() => onPick(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: isActive ? F.gold : F.textFaint,
            fontFamily: F.sans, fontSize: 10, fontWeight: 500, letterSpacing: 0.3,
          }}>
            <Icon name={t.icon} size={22}/>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// Status bar (white text on dark bg)
function FStatusBar({ time = '21:04' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 30,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 28px 8px', pointerEvents: 'none',
    }}>
      <span style={{ fontFamily: '-apple-system, "SF Pro"', fontSize: 17, fontWeight: 600, color: '#fff' }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.5" fill="#fff"/><rect x="4.7" y="5" width="3" height="6" rx="0.5" fill="#fff"/><rect x="9.4" y="2.5" width="3" height="8.5" rx="0.5" fill="#fff"/><rect x="14.1" y="0" width="3" height="11" rx="0.5" fill="#fff"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#fff" strokeOpacity="0.5" fill="none"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="#fff"/><path d="M23 4v4c0.7-0.2 1.3-1 1.3-2S23.7 4.2 23 4z" fill="#fff" fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

// Home indicator
function FHomeIndicator({ light = true }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 25,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 100, background: light ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.4)' }}/>
    </div>
  );
}

// Phone shell — premium dark iPhone frame, manually drawn to match Fexora aesthetic
function FPhone({ children, width = 390, height = 844 }) {
  return (
    <div style={{
      width, height, borderRadius: 52, overflow: 'hidden',
      background: F.bg,
      position: 'relative',
      boxShadow: `inset 0 0 0 1px ${F.hair}, 0 30px 80px rgba(0,0,0,0.6), 0 0 0 8px #1a1410, 0 0 0 9px #0a0807`,
      fontFamily: F.sans,
      color: F.text,
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 122, height: 36, borderRadius: 24, background: '#000', zIndex: 40,
      }}/>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WEB SHELL — responsive app layout (sidebar + topbar + main)
// All screens use the same shell so navigation feels consistent.
// ─────────────────────────────────────────────────────────────

// Container that fixes the viewport to a desktop width inside an artboard
function WebViewport({ children, width = 1440, height = 900, bg }) {
  return (
    <div style={{
      width, height, overflow: 'hidden',
      background: bg || F.bg, color: F.text,
      fontFamily: F.sans,
      WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>{children}</div>
  );
}

// App sidebar (left rail) — consistent across all logged-in screens
function AppSidebar({ active = 'home', creator = false }) {
  const items = creator ? [
    { id: 'home', icon: 'home', label: 'Feed' },
    { id: 'explore', icon: 'search', label: 'Entdecken' },
    { id: 'studio', icon: 'edit', label: 'Studio' },
    { id: 'chat', icon: 'chat', label: 'Nachrichten', badge: 3 },
    { id: 'wallet', icon: 'coin', label: 'Wallet' },
    { id: 'collection', icon: 'bookmark', label: 'Sammlung' },
    { id: 'me', icon: 'user', label: 'Mein Atelier' },
  ] : [
    { id: 'home', icon: 'home', label: 'Feed' },
    { id: 'explore', icon: 'search', label: 'Entdecken' },
    { id: 'chat', icon: 'chat', label: 'Nachrichten', badge: 3 },
    { id: 'wallet', icon: 'coin', label: 'Wallet' },
    { id: 'collection', icon: 'bookmark', label: 'Sammlung' },
    { id: 'me', icon: 'user', label: 'Profil' },
  ];
  return (
    <aside style={{
      width: 240, flexShrink: 0, height: '100%',
      background: '#0d0a08', borderRight: `1px solid ${F.hair}`,
      padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px' }}>
        <FexoraLogo height={22}/>
      </div>

      {items.map(it => (
        <button key={it.id} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10,
          background: it.id === active ? 'rgba(212,165,116,0.12)' : 'transparent',
          color: it.id === active ? F.gold : F.textMuted,
          border: 'none', cursor: 'pointer',
          fontFamily: F.sans, fontSize: 14, fontWeight: it.id === active ? 600 : 500,
          boxShadow: it.id === active ? `inset 0 0 0 0.5px ${F.hairStrong}` : 'none',
          textAlign: 'left',
        }}>
          <Icon name={it.icon} size={18}/>
          <span style={{ flex: 1 }}>{it.label}</span>
          {it.badge && (
            <span style={{ minWidth: 18, height: 18, borderRadius: 9, padding: '0 6px', background: F.goldGrad, color: '#1a0f06', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.badge}</span>
          )}
        </button>
      ))}

      <div style={{ flex: 1 }}/>

      {/* Wallet pill */}
      <div style={{ padding: '14px 14px', borderRadius: 14, background: 'radial-gradient(80% 60% at 100% 0%, rgba(212,165,116,0.2), transparent 60%), #14110d', boxShadow: `inset 0 0 0 0.5px ${F.hairStrong}`, marginBottom: 10 }}>
        <div style={{ fontFamily: F.sans, fontSize: 10, color: F.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Guthaben</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: F.serif, fontSize: 24, color: F.text, fontWeight: 600 }}>142</span>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: F.gold }}>🔥</span>
        </div>
        <FButton size="sm" variant="primary" style={{ marginTop: 8, width: '100%' }} icon="plus">Aufladen</FButton>
      </div>

      {/* User chip */}
      <div style={{ padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
        <FAvatar name={creator ? 'Liora' : 'Anon'} size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: F.text, fontWeight: 600 }}>{creator ? 'Liora Noir' : '@anonym_2406'}</div>
          <div style={{ fontFamily: F.sans, fontSize: 10, color: F.textMuted }}>{creator ? 'Creator · verified' : '18+ verifiziert'}</div>
        </div>
        <Icon name="settings" size={14} color={F.textMuted}/>
      </div>
    </aside>
  );
}

// App topbar — search + actions
function AppTopbar({ title, subtitle, search = true, actions }) {
  return (
    <div style={{
      height: 64, flexShrink: 0, borderBottom: `1px solid ${F.hair}`,
      display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px',
      background: 'rgba(10,8,7,0.85)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {title && (
        <div>
          <div style={{ fontFamily: F.serif, fontSize: 22, color: F.text, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1, fontStyle: 'italic' }}>{title}</div>
          {subtitle && <div style={{ fontFamily: F.sans, fontSize: 11, color: F.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{subtitle}</div>}
        </div>
      )}
      {search && (
        <div style={{ flex: 1, maxWidth: 480, marginLeft: title ? 32 : 0, display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', borderRadius: 20, background: F.card, boxShadow: `inset 0 0 0 0.5px ${F.hair}` }}>
          <Icon name="search" size={16} color={F.textMuted}/>
          <span style={{ flex: 1, fontFamily: F.sans, fontSize: 13, color: F.textFaint }}>Suche Creator, Werke, Akte…</span>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: F.textFaint, padding: '2px 6px', background: F.bg, borderRadius: 4 }}>⌘ K</div>
        </div>
      )}
      <div style={{ flex: 1 }}/>
      {actions}
      <button style={{ width: 40, height: 40, borderRadius: 20, background: F.card, border: 'none', boxShadow: `inset 0 0 0 0.5px ${F.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Icon name="bell" size={16} color={F.gold}/>
        <div style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, background: F.gold }}/>
      </button>
    </div>
  );
}

// App shell — sidebar + main column
function AppShell({ active, creator, children }) {
  return (
    <WebViewport>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AppSidebar active={active} creator={creator}/>
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </WebViewport>
  );
}

// Marketing top nav (logo + nav + CTA)
function MarketingNav({ transparent }) {
  return (
    <nav style={{
      height: 76, display: 'flex', alignItems: 'center', padding: '0 56px', gap: 40,
      background: transparent ? 'transparent' : 'rgba(10,8,7,0.85)', backdropFilter: 'blur(12px)',
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      borderBottom: transparent ? 'none' : `1px solid ${F.hair}`,
    }}>
      <FexoraLogo height={20}/>
      <div style={{ flex: 1, display: 'flex', gap: 28 }}>
        {['Maison', 'Creators', 'Wie es funktioniert', 'FAQ'].map(t => (
          <a key={t} style={{ fontFamily: F.sans, fontSize: 13, color: F.textMuted, textDecoration: 'none', fontWeight: 500 }}>{t}</a>
        ))}
      </div>
      <button style={{ background: 'transparent', border: 'none', color: F.text, fontFamily: F.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Anmelden</button>
      <FButton variant="primary" size="md">Beitreten · 18+</FButton>
    </nav>
  );
}

Object.assign(window, {
  F, Icon, FexoraLogo, FlameMark, FButton, FBadge, FCreatorBadge, FAvatar, FImage, FCard, GoldDivider,
  FTabBar, FStatusBar, FHomeIndicator, FPhone,
  WebViewport, AppSidebar, AppTopbar, AppShell, MarketingNav,
});
