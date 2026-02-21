"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContent, useUnlockContent } from "@fexora/api-client";
import { useAuth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ShareModal } from "@/components/content/share-modal";
import { TipDialog } from "@/components/content/tip-dialog";
import { ReportModal } from "@/components/report-modal";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useContent(params.id);
  const unlock = useUnlockContent();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showReport, setShowReport] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const content = data?.data;
  if (!content || !data?.success) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Content not found</p>
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
      // Ignore
    }
  }

  async function handleShare() {
    try {
      await client.post(`/content/${params.id}/share`);
    } catch {
      // tracking only
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;
    try {
      await client.post(`/content/${params.id}/comments`, { body: comment });
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["content", params.id] });
    } catch {
      // Ignore
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Creator Info */}
      <div className="flex items-center gap-3">
        <Link href={`/profile/${content.ownerUsername ?? ""}`}>
          <Avatar>
            {content.ownerAvatarUrl && (
              <AvatarImage src={content.ownerAvatarUrl} />
            )}
            <AvatarFallback>
              {(content.ownerUsername ?? "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            href={`/profile/${content.ownerUsername ?? ""}`}
            className="font-medium hover:underline"
          >
            {content.ownerUsername}
          </Link>
          <p className="text-xs text-muted-foreground">
            {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Media */}
      <Card>
        <CardContent className="p-0">
          {content.coverUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isLocked
                    ? content.blurPreviewUrl ?? content.coverUrl
                    : content.mediaUrl ?? content.coverUrl
                }
                alt={content.title}
                className={`w-full rounded-t-lg ${isLocked ? "blur-xl" : ""}`}
              />
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-t-lg">
                  <p className="text-white text-xl font-bold">
                    {content.priceCredits} {t("content.coins")}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={handleUnlock}
                    disabled={unlock.isPending}
                  >
                    {unlock.isPending ? t("common.loading") : t("content.unlock")}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
              <span className="text-muted-foreground">{content.type}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Title & Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{content.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            {isPaid ? (
              <Badge variant={content.isUnlocked ? "secondary" : "default"}>
                {content.isUnlocked
                  ? t("content.unlocked")
                  : `${content.priceCredits} ${t("content.coins")}`}
              </Badge>
            ) : (
              <Badge variant="secondary">{t("content.free")}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <span>{isLiked ? "♥" : "♡"}</span>
            <span>{content.likeCount ?? 0}</span>
          </button>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>💬</span>
            <span>{content.commentCount ?? 0}</span>
          </span>
          <button
            onClick={() => setShowShare(true)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ↗ {t("content.share")}
          </button>
          {isAuthenticated && content.ownerUsername && (
            <button
              onClick={() => setShowTip(true)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              🎁 Tip
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => setShowReport(true)}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Report
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="font-semibold">{t("content.comment")}</h2>

        {isAuthenticated && (
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`${t("content.comment")}...`}
              maxLength={1000}
            />
            <Button type="submit" disabled={!comment.trim()}>
              {t("chat.sendMessage")}
            </Button>
          </form>
        )}

        <div className="text-sm text-muted-foreground text-center py-4">
          Comments will appear here
        </div>
      </div>

      {showShare && (
        <ShareModal
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={content.title}
          onClose={() => setShowShare(false)}
          onShare={handleShare}
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
