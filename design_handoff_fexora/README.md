# Fexora — Design Handoff für Claude Code

> **Stack-Ziel:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui  
> **Sprache UI/Copy:** Deutsch (DE)  
> **Plattform:** Responsive Web (Desktop primär 1440px, mobil ab 390px)  
> **Reifegrad der Designs:** **Hi-Fi** — finale Farben, Typografie, Spacing, Interaktionen

---

## 0. Über dieses Paket

Die Dateien unter `prototype/` sind **Design-Referenzen** — HTML/JSX-Prototypen, die das beabsichtigte Aussehen und Verhalten zeigen. Sie sind **nicht** dazu gedacht, 1:1 in Production gepusht zu werden. Deine Aufgabe als Entwickler:

1. **Lies dieses README** komplett.
2. **Öffne `prototype/Fexora.html`** lokal (oder als Live-Preview), navigiere durch die Sektionen — das ist die visuelle Wahrheit.
3. **Implementiere die Screens** im Ziel-Codebase mit Next.js + Tailwind + shadcn/ui, indem du die Design-Tokens und Komponenten-Patterns aus diesem README übernimmst.

Der Prototyp ist in pure React (Babel-Standalone) + Inline-Styles geschrieben, damit er ohne Build-Tools läuft. In Production solltest du Inline-Styles durch Tailwind-Klassen ersetzen und die Komponenten in der Datei-/Ordner-Struktur deines Next.js-Projekts ablegen.

---

## 1. Was ist Fexora?

Eine skalierbare Community-Plattform mit Marktplatz-Funktionen für **Bilder, Clips, Hörspiele und Stories**. Kombiniert mit Social Features wie Chat inkl. Voice-Messages (rechte-/badge-abhängig). Drei zusammenhängende Anwendungen:

| App | Zielgruppe | Zweck |
|---|---|---|
| **Frontend (Web)** | Fans + Creator | Discovery, Konsum, Chat, Wallet |
| **Admin Console** | interne Admins | Content-Approval, User-/Creator-Management, Analytics |
| **Moderation-Tool** | Trust & Safety | Reports, Chat-Moderation, Audit-Log |

**Monetarisierung:** In-App-Währung „Flames 🔥" (à la carte, kein Abo zwingend). Indirekte Altersverifikation über das Zahlungsmittel (Kreditkarte/Bankkonto) — kein externer AVS im MVP.

**Freigabezwang:** Jeder Inhalt ist `pending` bis `approved` (Admin). Ohne Approval keine Sichtbarkeit/Verkäuflichkeit.

---

## 2. Empfohlene Projektstruktur (Next.js App Router)

```
fexora/
├── apps/
│   ├── web/          # Frontend (Marketing + App)
│   ├── admin/        # Admin Console (eigener Subdomain admin.fexora.com)
│   └── moderation/   # Moderation Tool (mod.fexora.com)
├── packages/
│   ├── ui/           # shadcn-Komponenten + Fexora-spezifische
│   ├── design-tokens/  # CSS-Variablen, Tailwind-Preset
│   └── lib/          # Shared utils, API client, Zod schemas
```

Wenn Monorepo zu schwer ist: ein einziges Next.js-Projekt mit Route-Groups:
```
app/
├── (marketing)/      # Public Landing
├── (app)/            # Eingeloggte App
├── (admin)/          # Admin Console
└── (moderation)/     # Moderation Tool
```

---

## 3. Design Tokens

### 3.1 Farben

Alle Farben im Tailwind-Theme als CSS-Variablen ablegen.

```css
:root {
  /* Backgrounds */
  --bg:           #0a0807;
  --surface:      #14110d;
  --card:         #1a1612;
  --elevated:     #221c16;
  
  /* Borders / Hairlines */
  --hair:         rgba(212, 165, 116, 0.10);
  --hair-strong:  rgba(212, 165, 116, 0.22);
  
  /* Brand Gold */
  --gold:         #d4a574;   /* primary */
  --gold-bright:  #e8c089;   /* hover/highlight */
  --gold-deep:    #a07a4d;
  --gold-dark:    #6b5235;
  --gold-grad:    linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%);
  
  /* Text */
  --text:         #f5efe6;
  --text-muted:   #9a8f82;
  --text-faint:   #5a5249;
  
  /* Status */
  --danger:       #c45a4a;
  --success:      #6b9a6e;
  --warn:         #d4a574;
}
```

Tailwind-Preset (`tailwind.config.ts`):

```ts
import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        elevated: 'var(--elevated)',
        hair: 'var(--hair)',
        'hair-strong': 'var(--hair-strong)',
        gold: {
          DEFAULT: 'var(--gold)',
          bright: 'var(--gold-bright)',
          deep: 'var(--gold-deep)',
          dark: 'var(--gold-dark)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        danger: 'var(--danger)',
        success: 'var(--success)',
        warn: 'var(--warn)',
      },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%)',
      },
    },
  },
} satisfies Config;
```

### 3.2 Typografie

| Rolle | Font | Wo verwenden | Weights |
|---|---|---|---|
| **Display / Headlines** | `Cormorant Garamond` | Hero, Section-Titles, Creator-Namen, Story-Titel | 400, 500, 600 (oft italic) |
| **UI / Body** | `Geist` | Buttons, Forms, Tables, Listen, Captions | 400, 500, 600, 700 |
| **Mono** | `Geist Mono` | IDs, Timestamps, Code | 400, 500 |

Google Fonts Import (in `app/layout.tsx`):

```tsx
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});
```

Type Scale (für Tailwind):

```ts
fontSize: {
  // Display (Cormorant)
  'display-1':  ['96px', { lineHeight: '0.92', letterSpacing: '-3px', fontWeight: '400' }],
  'display-2':  ['64px', { lineHeight: '0.95', letterSpacing: '-1.5px', fontWeight: '400' }],
  'display-3':  ['48px', { lineHeight: '1.05', letterSpacing: '-1px',   fontWeight: '400' }],
  'h1':         ['38px', { lineHeight: '1.1',  letterSpacing: '-0.5px', fontWeight: '500' }],
  'h2':         ['28px', { lineHeight: '1.15', letterSpacing: '-0.3px', fontWeight: '500' }],
  'h3':         ['22px', { lineHeight: '1.2',                            fontWeight: '500' }],
  // Body (Geist)
  'body-lg':    ['17px', { lineHeight: '1.55' }],
  'body':       ['14px', { lineHeight: '1.55' }],
  'body-sm':    ['13px', { lineHeight: '1.5'  }],
  'caption':    ['11px', { lineHeight: '1.4',  letterSpacing: '1.5px' }], // uppercase eyebrows
  'mono':       ['11px', { lineHeight: '1.4'  }],
},
```

**Regel:** Display-Schriften sind oft `italic` und ggf. mit goldenem Akzent-Wort eingefärbt — siehe Prototyp.

### 3.3 Spacing & Layout

- Standard-Grid-Gap: `14px` (Cards), `28px` (Sections), `56px` (Page-Hero-Padding)
- Padding-Schema: Cards `18-24px`, Buttons-Höhe `32/44/52px` (sm/md/lg)
- Border-Radius: `8-14px` Cards, `999px` Pills/Buttons, `4-6px` Tag-Pills

### 3.4 Schatten & Borders

Wir nutzen **inset-shadows** statt `border` für 0.5px-Hairlines:

```css
/* Subtle hairline auf Card */
box-shadow: inset 0 0 0 0.5px rgba(212, 165, 116, 0.10);

/* Stärker (Featured/Selected) */
box-shadow: inset 0 0 0 1px rgba(212, 165, 116, 0.22);
```

---

## 4. Komponenten-Bibliothek

Alle UI-Bausteine sind im Prototyp in `theme.jsx` definiert. Hier die Mapping-Tabelle Prototyp → shadcn:

| Prototyp-Komponente | shadcn/ui Basis | Anpassung |
|---|---|---|
| `<FButton variant="primary\|secondary\|ghost\|danger\|success">` | `<Button>` | Goldgradient-Variante + warm-dark Outline-Variante hinzufügen |
| `<FBadge tone="gold\|dark\|danger\|success\|glass">` | `<Badge>` | Uppercase, letter-spacing 0.3, 22px Höhe |
| `<FAvatar name size ring story>` | `<Avatar>` | Plus: optional Gold-Ring (`ring`), Story-Ring (`story`, gold gradient) |
| `<FCreatorBadge kind="verified\|voice\|star">` | neue Komponente | Kleine runde Icon-Badges (16-24px) — Verified, Voice, Top Creator |
| `<FInputWeb label icon trail>` | `<Input>` + `<Label>` | Eyebrow-Label in Gold (uppercase 10px), Icon links |
| `<FImage seed locked label>` | Image + Blur-Overlay | Vier Lock-Stile: `blur` / `mosaic` / `dark` / `gold` |
| `<GoldDivider>` | Custom | Horizontale gold-Linie mit zentralem Diamant-Ornament |
| `<AppSidebar>` | `<Sidebar>` (shadcn) | Linker Rail (240px), Logo oben, Wallet-Pill unten, User-Chip ganz unten |
| `<AppTopbar>` | Custom | Search-Field (Cmd+K), Bell mit Dot, Title in Serif |
| `<Icon name>` | `lucide-react` | Nutze Lucide stattdessen: `Home`, `Search`, `MessageCircle`, `Coin` (=`Coins`), `User`, `Heart`, `Bookmark`, `Play`, `Pause`, `Mic`, `Image`, `Video`, `BookOpen`, `Headphones`, `Lock`, `Unlock`, `Plus`, `Check`, `X`, `ChevronRight`, `Star`, `BadgeCheck` (verified), `Bell`, `Settings`, `Send`, `Flag`, `Shield`, `Eye`, `EyeOff`, `Trash`, `Pencil`, `Upload`, `Download`, `Filter`, `LayoutGrid`, `List`, `Sparkles`, `Activity` (waveform), `MoreHorizontal`, `MoreVertical`, `ArrowRight` |

### 4.1 Spezifische, neu zu bauende Komponenten

#### `<FlameMark>` (Logo-Icon)
- SVG mit Kerze + Flamme aus Logo abgeleitet, gold (`var(--gold)`)
- Sizes: 14/18/22/26/40/240
- Asset: `assets/fexora-logo.png` (Wortmarke + Flamme) für Logo-Lockup nutzen

#### `<FImage>` mit Lock-Overlays
4 Varianten für FSK-Vorschau:
1. **blur** — `backdrop-filter: blur(22px)` + 35% schwarzer Layer + Schloss-Icon in Gold-Pill (zentral)
2. **mosaic** — 24×16 Grid aus warmen Dunkel-Tönen + Schloss-Pill
3. **dark** — `rgba(10,8,7,0.78)` Overlay + Schloss + „Unlock" Caption
4. **gold** — Goldener Schimmer-Layer (markentreu): `linear-gradient(135deg, rgba(212,165,116,0.4), rgba(160,122,77,0.6) 60%, rgba(60,40,25,0.7))` mit `mix-blend-mode: multiply` + Blur + FlameMark zentriert

#### `<UnlockOption>` (Paywall-Option)
Radio-artige Card mit Preis rechts, „Saving"-Badge oder „Abo"-Badge.

#### `<ChatVoiceMessage>`
- Play-Button (Gold-Gradient bei eigenen Nachrichten, transparent bei fremden)
- Animierte Waveform aus 32 Bars (statisch im Prototyp, in echt mit echten Audio-Peaks)
- Duration in Geist Mono

#### `<KPI>` (Admin Dashboard)
Card mit Icon, Label (eyebrow), Wert (Cormorant 32px) und Delta-Text (Gold/Grün).

---

## 5. Screens (Übersicht)

Alle Screens sind im Prototyp **als getrennte React-Komponenten** verfügbar. Im Folgenden eine Liste mit Dateiname, Komponente und Empfehlung für die Next.js-Route.

### 5.1 Marketing (`apps/web/app/(marketing)/`)

| Screen | Komponente | Route | Datei |
|---|---|---|---|
| Landing Editorial | `LandingEditorial` | `/` (Variante A) | `screens-marketing.jsx` |
| Landing Boutique | `LandingBoutique` | `/` (Variante B) | `screens-marketing.jsx` |

**Empfehlung:** Eine der beiden Varianten wählen — die andere ggf. als A/B-Test-Variante. **Editorial** ist klassischer Magazin-Look, **Boutique** stärker gallerie-getrieben mit Pricing-Section.

### 5.2 App — Schlüsselscreens

| Screen | Komponente | Route | Variante |
|---|---|---|---|
| Feed Editorial 3-Column | `FeedEditorialWeb` | `/feed` | A |
| Feed Gallery Grid | `FeedGalleryWeb` | `/feed` | B |
| Creator-Profil Editorial | `ProfileEditorialWeb` | `/creator/[handle]` | A |
| Creator-Profil Boutique | `ProfileBoutiqueWeb` | `/creator/[handle]` | B |
| Content-Detail Modal | `DetailModalWeb` | `/work/[id]` (Modal/Intercepted Route) | A |
| Content-Detail Édition | `DetailEditionWeb` | `/work/[id]` (eigene Seite) | B |

**Empfehlung:** Bei Detail-Screens das Pattern „Intercepted Routes" von Next.js nutzen — Klick aus Feed öffnet Modal (Variante A), direkte URL zeigt Vollseite (Variante B). Best of both.

### 5.3 App — Support-Screens

| Screen | Komponente | Route |
|---|---|---|
| Login / Anmelden | `LoginWeb` | `/login` |
| Chat (Liste + Aktiv + Rail) | `ChatWeb` | `/chat`, `/chat/[id]` |
| Wallet / Flames | `WalletWeb` | `/wallet` |
| Entdecken | `SearchWeb` | `/explore` |
| Profil & Einstellungen | `SettingsWeb` | `/settings` |

### 5.4 Admin Console (`apps/admin/app/`)

| Screen | Komponente | Route |
|---|---|---|
| Dashboard | `AdminDashboardWeb` | `/` |
| Review-Queue | `AdminQueueWeb` | `/queue` |
| Review-Detail | `AdminReviewWeb` | `/queue/[id]` |
| Nutzer-Management | `AdminUsersWeb` | `/users` |
| Creator & Badges | `AdminCreatorsWeb` | `/creators` |
| Analytics | `AdminAnalyticsWeb` | `/analytics` |

### 5.5 Moderation (`apps/moderation/app/`)

| Screen | Komponente | Route |
|---|---|---|
| Report-Queue | `ModQueueWeb` | `/` |
| Report-Detail | `ModReportDetailWeb` | `/report/[id]` |
| Chat-Moderation | `ModChatsWeb` | `/chats` |
| Audit-Log | `ModAuditWeb` | `/audit` |

---

## 6. Layout-Patterns

### 6.1 App-Shell (eingeloggt, alle App-Screens)

```
┌────────────────────────────────────────────────────────┐
│ [Sidebar 240px] │  [Topbar 64px]                       │
│                 │ ───────────────────────────────────  │
│  · Logo         │                                      │
│  · Feed         │                                      │
│  · Entdecken    │  Main Content                        │
│  · Chat 3       │  (overflow-y: auto)                  │
│  · Wallet       │                                      │
│  · Sammlung     │                                      │
│  · Profil       │                                      │
│                 │                                      │
│  [Wallet-Pill]  │                                      │
│  [User-Chip]    │                                      │
└────────────────────────────────────────────────────────┘
```

Implementierung: Layout-Komponente in `app/(app)/layout.tsx`.

### 6.2 Marketing-Layout
Floating top-nav (transparent, position: absolute) — wird beim Scrollen zu solid-dark mit Backdrop-Blur. Maximal-Breite 1480px, padding `56px` horizontal.

### 6.3 Admin- und Moderation-Shells
Wie App-Shell, aber:
- **Admin:** Gold-Akzente
- **Moderation:** Rot-Akzente (`var(--danger)`) für Sidebar-Highlight, Logo „Moderation" in rot statt gold

---

## 7. Interaktionen & Verhalten

### 7.1 Allgemein
- **Hover auf Card:** `transform: scale(1.02)` + leichte Gold-Border-Verstärkung
- **Buttons:** Primary-Gold pulst leicht bei Hover, Secondary bekommt stärkere Hair-Strong-Border
- **Bilder-Lazy-Loading:** `next/image` mit `priority` für above-the-fold Hero-Bilder
- **Transitions:** 150ms cubic-bezier(0.2, 0.7, 0.3, 1) für Hover/Color, 300ms für Layout-Shifts

### 7.2 Spezifisch

**Paywall-Unlock (Modal-Variante):**
1. Klick auf Lock-Icon oder Preis im Feed → öffnet Intercepted Route Modal
2. Modal slidet von rechts ein (`translate-x-full` → `translate-x-0`, 250ms)
3. Backdrop-Blur fades-in über 200ms
4. ESC oder Klick auf Backdrop schließt
5. „Freischalten" Button löst API-Call aus → Optimistic Update der `unlocked`-Liste → Confetti-Sparkle Animation (Lottie/Framer Motion)

**Voice-Message Recording:**
1. **Long-press** auf Mic-Button (Mobile/Desktop) startet Aufnahme
2. Aufnahme-Indicator: rote Pulse-Dot + Mic glühend gold + Wellenform live
3. Slide-up beendet Aufnahme + zeigt Preview (Play, Cancel, Send)
4. **Voice-Recht-Check:** API-Call vor Aufnahme — wenn kein Recht, zeigt Modal „Du benötigst Voice-Recht für diese Funktion"

**Stories-Viewer:**
1. Klick auf Story-Avatar im Rail (Sidebar-Nähe)
2. Fullscreen-Overlay mit Progress-Bars oben (5 Sekunden pro Story)
3. Tap rechts/links für nächste/vorherige Story
4. Swipe-down schließt (Mobile)

**Chat-Moderation Auto-Flag:**
1. Backend führt KI-Filter (Score 0–1) auf jeder Nachricht/Voice aus
2. Score > 0.7 → automatischer Report mit System als Reporter
3. UI zeigt rote Auto-Flag-Pill an entsprechender Nachricht
4. Modal-Detail zeigt Klassifikations-Breakdown (Belästigung, Druck, Drohung, Synthetisch, Spam)

### 7.3 Tastatur-Shortcuts

| Kombination | Aktion | Wo |
|---|---|---|
| `⌘ K` | Globale Suche öffnen | App + Admin |
| `⌘ ⏎` | Approve | Admin Review-Detail |
| `⌘ ⌫` | Reject | Admin Review-Detail |
| `⌘ →` / `⌘ ←` | Nächste/Vorherige | Admin Review, Modal-Carousel |
| `Esc` | Modal/Overlay schließen | überall |

---

## 8. State Management & Datenmodell

### 8.1 Empfohlene Bibliotheken
- **State:** Zustand (klein, ohne Boilerplate) oder TanStack Query für Server-State
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js v5 (mit Magic-Link + OAuth Apple/Google)
- **Payments:** Stripe (Apple Pay, SEPA, Karte) — bestätigt indirekt das Alter
- **Voice / Audio:** Wavesurfer.js oder eigene WebAudio-Implementierung mit `MediaRecorder`
- **Realtime Chat:** Pusher / Ably / Supabase Realtime (oder eigenes WS)

### 8.2 Kerndatenmodell (Zod-Schemas)

```ts
const UserKind = z.enum(['fan', 'creator', 'admin', 'moderator']);
const ContentKind = z.enum(['image', 'video', 'audio', 'story', 'bundle']);
const ContentStatus = z.enum(['pending', 'approved', 'rejected', 'archived']);
const FSK = z.enum(['12', '16', '18']);
const ReportSeverity = z.enum(['low', 'mid', 'high']);
const BadgeKind = z.enum(['verified', 'voice', 'star']);

const User = z.object({
  id: z.string(),
  handle: z.string(),
  email: z.string().email(),
  kind: UserKind,
  ageVerified: z.boolean(),
  flames: z.number().int().min(0),
  createdAt: z.date(),
  badges: z.array(BadgeKind).default([]),
  voicePermission: z.boolean().default(false),
});

const Content = z.object({
  id: z.string(),
  creatorId: z.string(),
  kind: ContentKind,
  title: z.string(),
  description: z.string(),
  fsk: FSK,
  priceFlames: z.number().int().min(0),
  status: ContentStatus,
  reviewedBy: z.string().nullable(),
  reviewedAt: z.date().nullable(),
  mediaUrls: z.array(z.string().url()),
  previewBlur: z.enum(['blur', 'mosaic', 'dark', 'gold']),
  createdAt: z.date(),
});

const FlameTransaction = z.object({
  id: z.string(),
  userId: z.string(),
  kind: z.enum(['topup', 'unlock', 'tip', 'bonus', 'refund']),
  amount: z.number().int(), // negative for spending
  refId: z.string().nullable(), // contentId, tipToUserId, etc.
  createdAt: z.date(),
});

const ChatMessage = z.object({
  id: z.string(),
  chatId: z.string(),
  senderId: z.string(),
  kind: z.enum(['text', 'voice', 'paywall', 'tip']),
  text: z.string().nullable(),
  voiceUrl: z.string().url().nullable(),
  voiceDuration: z.number().nullable(),
  flagged: z.boolean().default(false),
  flagScore: z.number().min(0).max(1).nullable(),
  createdAt: z.date(),
});

const Report = z.object({
  id: z.string(),
  reporterId: z.string(), // or 'system'
  targetKind: z.enum(['user', 'content', 'chat', 'voice']),
  targetId: z.string(),
  reason: z.string(),
  severity: ReportSeverity,
  status: z.enum(['open', 'in_review', 'resolved']),
  resolution: z.string().nullable(),
  resolvedBy: z.string().nullable(),
  createdAt: z.date(),
});

const AuditEntry = z.object({
  id: z.string(),
  actorId: z.string(), // userId oder 'system'
  actorRole: z.string(), // "Mod L2", "Admin", "KI-Filter"
  action: z.string(),
  targetKind: z.string(),
  targetId: z.string(),
  refId: z.string().nullable(),
  tone: z.enum(['ok', 'warn', 'mid', 'danger']),
  createdAt: z.date(),
});
```

### 8.3 API-Endpoints (Skizze)

```
GET    /api/feed                 # paginierter Feed
GET    /api/creator/[handle]
GET    /api/work/[id]
POST   /api/work/[id]/unlock     # → Flames-Abzug + Sammlung
POST   /api/flames/topup         # → Stripe-Session
GET    /api/chat
POST   /api/chat/[id]/message    # text oder voice
POST   /api/report
GET    /api/admin/queue
POST   /api/admin/queue/[id]/decision   # approve/reject + tags
GET    /api/admin/users
GET    /api/admin/creators
POST   /api/admin/creators/[id]/badge   # gewähren/entziehen
GET    /api/mod/reports
POST   /api/mod/reports/[id]/action
GET    /api/mod/audit
```

---

## 9. Responsive

Designs sind primär für **1440px Desktop** ausgelegt. Empfohlene Breakpoints:

- **≥1280px**: volles 3-Column-Layout
- **768px – 1279px**: Tablet — Right-Rail im Feed/Profile collapsable, Sidebar bleibt
- **<768px**: Mobile — Sidebar wird Bottom-Nav, Right-Rail entfällt, Card-Grids 1–2 Spalten

**Tailwind Container-Queries** nutzen (`@container`) für Feed-Cards, weil sie in unterschiedlich breiten Containern leben.

Mobile-Designs **wurden nicht explizit gezeichnet** — als Entwickler beim Implementieren responsive ableiten:
- Touch-Targets min. 44px
- Bottom-Nav mit max. 5 Items: Feed, Entdecken, +, Chat, Profil
- Padding horizontal `16px` statt `40-56px`
- Headlines: `display-1` (96px) → mobile `48-56px`

---

## 10. Accessibility

- **Kontrast:** Gold auf Schwarz erreicht AA für large text, aber **muted-text** (#9a8f82) auf `#0a0807` ist knapp. In Production für Body-Text ggf. nach `#b5aa9b` ziehen, wenn Lesbarkeit problematisch.
- **Focus-Rings:** Gold-2px-Outline statt browser-default
- **ARIA:** Lock-Overlays mit `aria-label="Inhalt gesperrt — freischalten für X Flames"`
- **Voice-Player:** Volle Keyboard-Bedienung (Space = Play/Pause, ←/→ = ±5s)
- **Modal:** Focus-Trap + Restore on Close
- **Reduzierte Motion:** `prefers-reduced-motion: reduce` → Hover-Scale-Animationen aus

---

## 11. Wichtige Geschäftsregeln

1. **Altersbestätigung:** Über Apple Pay / Karte / SEPA-Lastschrift — kein externer AVS. `ageVerified=true` nur nach erfolgreicher 1. Zahlung (Top-Up oder direkter Unlock).
2. **Content-Approval:** Alle neuen Inhalte landen in der Admin-Queue. KI-Vorprüfung empfiehlt FSK + Risiko-Score. Admin entscheidet manuell.
3. **Voice-Recht:** Default `false`. Creator beantragt, Admin prüft Sprachprobe + KI-Plausibilität, gewährt. Entzug bei Verstoß möglich (siehe Moderation).
4. **Flames sind nicht refundierbar** nach Unlock. Top-Ups innerhalb 14 Tagen refundierbar wenn nicht ausgegeben.
5. **Reports:** Auto-Generated (KI-Score > 0.7) + manuell. Severity bestimmt SLA: high <2h, mid <8h, low <24h.
6. **4-Augen-Prinzip:** Schwere Aktionen (Ban, Auszahlung einfrieren) müssen vom Senior-Admin bestätigt werden.

---

## 12. Files in diesem Bundle

```
design_handoff_fexora/
├── README.md                      ← du bist hier
├── assets/
│   └── fexora-logo.png            ← Wortmarke + Flamme (transparent PNG)
└── prototype/
    ├── Fexora.html                ← Einstiegspunkt — alle Screens auf Design-Canvas
    ├── design-canvas.jsx          ← Canvas-Framework (kann gelöscht werden)
    ├── theme.jsx                  ← Design Tokens + Shared Components
    ├── screens-marketing.jsx      ← Landing-Pages (Editorial + Boutique)
    ├── screens-app-key.jsx        ← Feed (2), Profile (2), Detail (2)
    ├── screens-app-support.jsx    ← Login, Chat, Wallet, Search, Settings
    ├── screens-admin-web.jsx      ← 6 Admin-Screens
    ├── screens-moderation-web.jsx ← 4 Moderation-Screens
    └── assets/
        └── fexora-logo.png        ← Logo (gleiches wie /assets/)
```

**Wie öffnen:** `npx serve prototype/` oder VSCode Live-Server → `Fexora.html` im Browser, dann durch die Sektionen pannen/zoomen.

---

## 13. Empfohlene Implementierungs-Reihenfolge

1. **Setup:** Next.js 15 + TS + Tailwind + shadcn init + Fonts laden
2. **Tokens:** Tailwind-Preset + globale CSS-Variablen + Dark-Mode-Default
3. **UI-Kit:** Buttons, Badges, Avatar, Input, Card, Sidebar, Topbar — als shadcn-Variants/Custom-Components in `packages/ui` (oder `components/ui`)
4. **Marketing-Landing** (kann static rendered werden) — schnellster Win, gutes Aufwärmen für die Komponenten
5. **Auth-Flow:** Login + Onboarding (mit Stripe-Setup für Altersverifikation)
6. **App-Shell:** Sidebar + Topbar + Layout-Wrapper
7. **Feed + Content-Detail + Unlock-Flow** (mit Mock-Daten — API später)
8. **Chat mit Voice** (Realtime-Layer + Voice-Recording)
9. **Wallet + Top-Up** (Stripe-Integration)
10. **Admin Console** als eigene Route-Group / Subdomain
11. **Moderation-Tool** mit Audit-Log
12. **KI-Filter-Integration** (z.B. OpenAI Moderation API + eigener Audio-Klassifikator)

---

## 14. Was **nicht** in diesem Bundle ist (du musst entscheiden / bauen)

- ❌ Stories-Viewer (Fullscreen, Progress-Bars) — Pattern beschrieben in §7.2, nicht visuell gezeichnet
- ❌ Onboarding-Wizard mehrstufig (Welcome, Age, Top-Up) — Pattern angedeutet in Login, ausarbeiten
- ❌ Empty/Loading/Error-States — nach Pattern der jeweiligen Card-Komponenten ableiten
- ❌ Mobile-Screens explizit — responsive aus Desktop-Designs ableiten
- ❌ Email-Templates für Notifications
- ❌ DSGVO-Cookies-Banner + Impressum-Inhalte
- ❌ Echte Bilder/Inhalte — Prototyp nutzt `<FImage seed={n}>` Placeholders mit warm-dunklen Gradienten

---

## 15. Fragen?

Wenn etwas im Prototyp unklar ist:
1. Öffne `Fexora.html` und schaue dir den entsprechenden Screen an
2. Suche die passende JSX-Datei (siehe §12)
3. Inline-Styles im JSX zeigen exakte Werte (Padding, Farben, Gaps)

Bei Designentscheidungen, die im Prototyp nicht eindeutig sind, **frag den Designer/PO** statt zu raten.

---

**Viel Erfolg beim Bauen! ✦**
