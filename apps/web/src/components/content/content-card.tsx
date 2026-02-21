"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ContentResponse } from "@fexora/api-client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContentCardProps {
  content: ContentResponse;
  onLike?: () => void;
}

export function ContentCard({ content, onLike }: ContentCardProps) {
  const t = useTranslations("content");

  const isPaid = content.priceCredits > 0;
  const isLocked = isPaid && !content.isUnlocked;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${content.ownerUsername ?? ""}`}>
          <Avatar className="h-8 w-8">
            {content.ownerAvatarUrl && (
              <AvatarImage src={content.ownerAvatarUrl} />
            )}
            <AvatarFallback>
              {(content.ownerUsername ?? "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${content.ownerUsername ?? ""}`}
            className="text-sm font-medium hover:underline truncate block"
          >
            {content.ownerUsername}
          </Link>
        </div>
        {isPaid && (
          <Badge variant={content.isUnlocked ? "secondary" : "default"}>
            {content.isUnlocked
              ? t("unlocked")
              : `${content.priceCredits} ${t("coins")}`}
          </Badge>
        )}
        {!isPaid && <Badge variant="secondary">{t("free")}</Badge>}
      </CardHeader>

      <Link href={`/content/${content.id}`}>
        <CardContent className="p-0">
          {content.coverUrl ? (
            <div className="relative aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isLocked ? content.blurPreviewUrl ?? content.coverUrl : content.coverUrl}
                alt={content.title}
                className={`w-full h-full object-cover ${isLocked ? "blur-lg" : ""}`}
              />
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center text-white">
                    <p className="text-lg font-bold">
                      {content.priceCredits} {t("coins")}
                    </p>
                    <p className="text-sm">{t("unlock")}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                {content.type}
              </span>
            </div>
          )}
        </CardContent>
      </Link>

      <CardFooter className="flex items-center justify-between p-4">
        <p className="text-sm font-medium truncate flex-1">{content.title}</p>
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <button
            onClick={onLike}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <span>♡</span>
            <span>{content.likeCount ?? 0}</span>
          </button>
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>{content.commentCount ?? 0}</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
