"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContent, useUnlockContent } from "@fexora/api-client";
import { useAuth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { FImage } from "@/components/ui/f-image";
import { FlameMark } from "@/components/ui/flame-mark";
import { UnlockOption } from "@/components/content/unlock-option";
import { PriceCard } from "@/components/content/price-card";
import { ShareModal } from "@/components/content/share-modal";
import { TipDialog } from "@/components/content/tip-dialog";
import { ReportModal } from "@/components/report-modal";
import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Send,
  Flag,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useContent(params.id);
  const unlock = useUnlockContent();
  const [isLiked, setIsLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <FlameMark size={40} className="animate-pulse" />
      </div>
    );
  }

  const content = data?.data;
  if (!content || !data?.success) {
    return (
      <div className="py-20 text-center">
        <FlameMark size={40} className="mx-auto mb-4 opacity-30" />
        <p className="text-text-muted">Inhalt nicht gefunden</p>
      </div>
    );
  }

  const isPaid = content.priceCredits > 0;
  const isLocked = isPaid && !content.isUnlocked;

  async function handleUnlock() {
    unlock.mutate(
      { contentId: content!.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["content", params.id] });
        },
      }
    );
  }

  async function handleLike() {
    if (!isAuthenticated) return;
    try {
      if (isLiked) {
        await client.delete(`/content/${params.id}/like`);
        setIsLiked(false);
      } else {
        await client.post(`/content/${params.id}/like`);
        setIsLiked(true);
      }
      queryClient.invalidateQueries({ queryKey: ["content", params.id] });
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <div className="text-[12px] text-text-muted mb-6">
        <Link href="/feed" className="hover:text-text transition-fexora">Feed</Link>
        {" · "}
        <Link href={`/profile/${content.ownerUsername ?? ""}`} className="hover:text-text transition-fexora">
          {content.ownerUsername ?? "Creator"}
        </Link>
        {" · "}
        <span className="text-text">{content.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-14 items-start">
        {/* Left: Media */}
        <div>
          <div className="relative rounded-lg overflow-hidden mb-3.5">
            {content.coverUrl && !isLocked ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.mediaUrl ?? content.coverUrl}
                alt={content.title}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="aspect-[3/4]">
                <FImage
                  seed={parseInt(params.id, 10) || 0}
                  locked={isLocked ? "gold" : "none"}
                />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="dark">FSK 18</Badge>
              <Badge variant="dark">1 / 6</Badge>
            </div>
          </div>
          {/* Thumbnail strip */}
          <div className="grid grid-cols-6 gap-2.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="rounded-md overflow-hidden aspect-square"
                style={{
                  boxShadow: i === 0 ? "inset 0 0 0 2px var(--gold)" : "none",
                  opacity: i === 0 ? 1 : 0.7,
                }}
              >
                <FImage seed={i + 1} locked="blur" />
              </div>
            ))}
            <div className="rounded-md bg-card flex items-center justify-center hairline-strong aspect-square">
              <span className="font-serif text-body text-gold italic">+ 1</span>
            </div>
          </div>
        </div>

        {/* Right: Details (sticky) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* Edition badge */}
          <div className="inline-flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-px bg-gold" />
            <span className="eyebrow tracking-[3px]">
              Édition Privée · Nº {String(params.id).padStart(3, "0")}
            </span>
          </div>

          <h1 className="font-serif text-display-3 text-text font-normal italic leading-[1.05] tracking-[-0.6px] mb-5">
            {content.title}
          </h1>

          {content.reviewComment && (
            <p className="font-serif text-body-lg text-text-muted italic leading-[1.6] mb-6">
              {content.reviewComment}
            </p>
          )}

          {/* Creator */}
          <div className="flex items-center gap-3 py-3.5 border-t border-b border-hair mb-6">
            <Link href={`/profile/${content.ownerUsername ?? ""}`}>
              <Avatar className="h-10 w-10">
                {content.ownerAvatarUrl && <AvatarImage src={content.ownerAvatarUrl} />}
                <AvatarFallback>{(content.ownerUsername ?? "?")[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-body text-text font-semibold">{content.ownerUsername}</span>
                <CreatorBadge kind="verified" size="sm" />
              </div>
              <span className="text-[11px] text-text-muted">@{content.ownerUsername}</span>
            </div>
            <Link href={`/profile/${content.ownerUsername ?? ""}`}>
              <Button variant="secondary" size="sm">Profil →</Button>
            </Link>
          </div>

          {/* Engagement */}
          <div className="flex gap-5 text-text-muted text-body-sm mb-6 pb-6 border-b border-hair">
            <button onClick={handleLike} className="flex items-center gap-1.5 transition-fexora hover:text-gold">
              <Heart className={`size-4 ${isLiked ? "fill-gold text-gold" : ""}`} />
              {content.likeCount ?? 0}
            </button>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4" /> {content.commentCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-4" /> —
            </span>
            <div className="flex-1" />
            <button onClick={() => setShowShare(true)} className="transition-fexora hover:text-gold">
              <Send className="size-4" />
            </button>
            <button className="transition-fexora hover:text-gold">
              <Bookmark className="size-4" />
            </button>
            {isAuthenticated && (
              <button onClick={() => setShowReport(true)} className="transition-fexora hover:text-danger">
                <Flag className="size-4" />
              </button>
            )}
          </div>

          {/* Details table */}
          <div className="mb-7">
            {[
              ["Format", `${content.type ?? "Bild"} · 4K`],
              ["Atelier", content.ownerUsername ?? "—"],
              ["Signiert", "Ja · digital"],
              ["FSK", "18+"],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className="flex justify-between py-3 text-body-sm"
                style={{
                  borderBottom:
                    i < arr.length - 1
                      ? "0.5px solid rgba(212,165,116,0.10)"
                      : "none",
                }}
              >
                <span className="text-text-muted uppercase text-[11px] tracking-[0.5px]">{label}</span>
                <span className="text-text">{value}</span>
              </div>
            ))}
          </div>

          {/* Unlock / Price */}
          {isLocked ? (
            <PriceCard
              price={content.priceCredits}
              onUnlock={handleUnlock}
            />
          ) : (
            <div className="rounded-[18px] p-6 bg-success/10 border border-success/20 text-center">
              <span className="font-serif text-h3 text-success">Freigeschaltet ✦</span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showShare && (
        <ShareModal
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={content.title}
          onClose={() => setShowShare(false)}
          onShare={async () => {
            try { await client.post(`/content/${params.id}/share`); } catch { /* tracking */ }
          }}
        />
      )}
      {showTip && content.ownerId && (
        <TipDialog
          recipientId={content.ownerId}
          recipientName={content.ownerUsername ?? "Creator"}
          onClose={() => setShowTip(false)}
        />
      )}
      {showReport && (
        <ReportModal
          targetType="content"
          targetId={params.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
