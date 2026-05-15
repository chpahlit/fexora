"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useThreads, useMessages, useSendMessage, useMarkThreadRead } from "@fexora/api-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { FImage } from "@/components/ui/f-image";
import { GoldDivider } from "@/components/ui/gold-divider";
import {
  ChatMsg,
  ChatVoiceMsg,
  ChatPaywallCard,
  DayDivider,
} from "@/components/chat/chat-message";
import { TipDialog } from "@/components/content/tip-dialog";
import { cn } from "@/lib/utils";
import {
  Search,
  Pencil,
  Plus,
  Sparkles,
  Mic,
  Coins,
  MoreVertical,
} from "lucide-react";

/* ─── Mock Data ─── */
const mockThreads = [
  { id: "1", name: "Liora", voice: true, last: "Vielen Dank f\u00FCr die Flames \u2726", when: "21:02", unread: 2, verified: true, online: true },
  { id: "2", name: "Esm\u00E9 Vauclair", voice: false, last: "Voice (0:42)", when: "20:14", unread: 1, verified: true, voiceMsg: true },
  { id: "3", name: "Mira", voice: true, last: "Ich schicke dir gleich Akt II.", when: "18:48", unread: 0, verified: true },
  { id: "4", name: "Sasha Vey", voice: false, last: "Schau dir das an \u2014", when: "Mo", unread: 0, verified: false },
  { id: "5", name: "Ad\u00E8le", voice: true, last: "Trinkgeld 24 \uD83D\uDD25", when: "So", unread: 0, verified: true, tip: true },
  { id: "6", name: "Veda", voice: false, last: "\uD83C\uDF99 Voice (1:14)", when: "12.5.", unread: 0, verified: true, voiceMsg: true },
  { id: "7", name: "Nara", voice: false, last: "H\u00F6rspiel ist online \u2726", when: "10.5.", unread: 0, verified: true },
];

const filterTabs = ["Alle", "Verifiziert", "Voice", "Trinkgelder", "Ungelesen"];

function ChatContent() {
  const t = useTranslations();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState("1");
  const [messageText, setMessageText] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);

  // API hooks (work when backend is connected)
  const { data: threadsData } = useThreads();
  const sendMessage = useSendMessage();
  const markRead = useMarkThreadRead();

  const selected = mockThreads.find((t) => t.id === selectedId);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageText("");
  }

  return (
    <div className="-m-4 md:-m-7 flex h-[calc(100vh-4rem)] min-h-0">
      {/* ═══ Chat List ═══ */}
      <div className="w-[340px] shrink-0 border-r border-hair bg-[#0d0a08] flex flex-col">
        <div className="p-[22px] pb-3.5">
          <div className="flex items-center mb-[18px]">
            <h2 className="font-serif text-h2 text-text font-medium italic tracking-[-0.3px]">
              Nachrichten
            </h2>
            <div className="flex-1" />
            <button
              type="button"
              className="w-9 h-9 rounded-[18px] bg-card flex items-center justify-center hairline"
            >
              <Pencil className="size-3.5 text-gold" />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[18px] bg-card hairline">
            <Search className="size-3.5 text-text-muted" />
            <span className="text-body-sm text-text-faint">Suche\u2026</span>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 mt-3.5 overflow-x-auto">
            {filterTabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(i)}
                className={cn(
                  "h-[26px] px-2.5 rounded-[13px] text-[11px] font-medium whitespace-nowrap transition-fexora",
                  i === activeFilter
                    ? "bg-gold/15 text-gold hairline-strong"
                    : "text-text-muted hairline"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto px-2">
          {mockThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setSelectedId(thread.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-[10px] text-left transition-fexora",
                selectedId === thread.id
                  ? "bg-gold/[0.08]"
                  : "hover:bg-elevated"
              )}
            >
              <div className="relative">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="text-[13px]">{thread.name[0]}</AvatarFallback>
                </Avatar>
                {thread.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success ring-2 ring-[#0d0a08]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-body-sm text-text font-semibold truncate">{thread.name}</span>
                  {thread.verified && <CreatorBadge kind="verified" size="sm" />}
                  {thread.voice && <CreatorBadge kind="voice" size="sm" />}
                </div>
                <div className={cn(
                  "text-[12px] truncate",
                  thread.unread > 0 ? "text-text" : "text-text-muted"
                )}>
                  {thread.last}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={cn("text-[11px]", thread.unread > 0 ? "text-gold" : "text-text-muted")}>
                  {thread.when}
                </span>
                {thread.unread > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-[9px] px-1.5 bg-gold-grad text-[10px] font-bold text-bg flex items-center justify-center">
                    {thread.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Active Conversation ═══ */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center gap-3.5 px-7 py-[18px] border-b border-hair shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{selected?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-[18px] text-text font-semibold">{selected?.name}</span>
              <CreatorBadge kind="verified" size="sm" />
              <CreatorBadge kind="voice" size="sm" />
              <CreatorBadge kind="star" size="sm" />
            </div>
            <div className="text-[11px] text-success">
              \u25CF online \u00B7 antwortet meist innerhalb von 4 Std
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowTip(true)}>
            <Coins className="size-3.5" />
            Trinkgeld geben
          </Button>
          <button
            type="button"
            className="w-9 h-9 rounded-[18px] bg-card flex items-center justify-center hairline text-text-muted"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <DayDivider label="Heute" />
          <ChatMsg side="them" text={"Sch\u00F6n, dich hier zu sehen \u2726"} />
          <ChatMsg side="them" text="Hast du Akt I schon geh\u00F6rt? Es ist eine kleine Reise." />
          <ChatMsg side="me" text="Noch nicht \u2014 gerade dabei aufzuladen." />
          <ChatVoiceMsg side="them" duration="0:42" />
          <ChatPaywallCard />
          <ChatMsg side="me" text={"Freigeschaltet \u2726"} />
          <ChatVoiceMsg side="me" duration="0:14" played />
          <ChatMsg side="them" text={"Vielen Dank f\u00FCr die Flames \u2726"} />
          <div className="flex justify-center mt-4">
            <Badge variant="dark">{selected?.name} tippt\u2026</Badge>
          </div>
        </div>

        {/* Composer */}
        <div className="px-7 py-4 border-t border-hair shrink-0">
          <form onSubmit={handleSend}>
            <div className="flex items-center gap-2.5 p-1.5 rounded-[24px] bg-card hairline">
              <button type="button" className="w-9 h-9 rounded-[18px] flex items-center justify-center text-gold">
                <Plus className="size-[18px]" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Nachricht an ${selected?.name}\u2026`}
                className="flex-1 bg-transparent text-body text-text placeholder:text-text-faint outline-none"
              />
              <button type="button" className="w-9 h-9 rounded-[18px] flex items-center justify-center text-gold">
                <Sparkles className="size-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-[18px] bg-gold-grad flex items-center justify-center text-bg"
              >
                <Mic className="size-4" />
              </button>
            </div>
          </form>
          <p className="text-[11px] text-text-faint text-center mt-2.5">
            \u23CE Senden \u00B7 \u23CE + Shift Zeilenumbruch \u00B7 Halte \uD83C\uDF99 f\u00FCr Voice (du hast <span className="text-gold">Voice-Recht aktiv</span>)
          </p>
        </div>
      </div>

      {/* ═══ Right Rail — Creator Info ═══ */}
      <div className="hidden xl:flex w-[320px] shrink-0 border-l border-hair bg-[#0d0a08] flex-col overflow-y-auto p-[22px]">
        <div className="text-center mb-[18px]">
          <Avatar ring className="h-[88px] w-[88px] mx-auto">
            <AvatarFallback className="text-[28px]">{selected?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex justify-center gap-1.5 mt-3.5">
            <CreatorBadge kind="verified" size="md" />
            <CreatorBadge kind="voice" size="md" />
            <CreatorBadge kind="star" size="md" />
          </div>
          <div className="font-serif text-[22px] text-text font-medium italic mt-2.5">{selected?.name}</div>
          <div className="text-[12px] text-text-muted mt-0.5">@{selected?.name.toLowerCase().replace(/\s/g, ".")}</div>
        </div>

        <Button variant="secondary" size="default" className="w-full mb-1.5">
          Profil ansehen
        </Button>
        <Button variant="ghost" size="sm" className="w-full">
          Stumm schalten
        </Button>

        <GoldDivider className="my-6" />

        {/* Shared works */}
        <span className="eyebrow tracking-[2px] text-[11px] mb-3 block">Geteilte Werke</span>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
              <FImage
                seed={i}
                locked={["none", "blur", "gold", "blur"][i] as "none" | "blur" | "gold"}
              />
              {i === 0 && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[rgba(10,8,7,0.7)] text-[9px] text-success font-semibold">
                  \u2713
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick tips */}
        <div className="mt-6">
          <span className="eyebrow tracking-[2px] text-[11px] mb-3 block">Schnell-Tipps</span>
          <div className="flex gap-1.5 flex-wrap">
            {[5, 10, 24, 50].map((v) => (
              <button
                key={v}
                type="button"
                className="px-3.5 py-2 rounded-[18px] bg-card font-serif text-body italic text-gold font-semibold hairline-strong transition-fexora hover:bg-elevated"
              >
                {v} \uD83D\uDD25
              </button>
            ))}
          </div>
        </div>
      </div>

      {showTip && selected && (
        <TipDialog
          recipientId={selected.id}
          recipientName={selected.name}
          onClose={() => setShowTip(false)}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}
