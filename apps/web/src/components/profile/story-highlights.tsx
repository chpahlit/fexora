"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHighlights, useHighlightItems } from "@fexora/api-client";
import type { HighlightResponse } from "@fexora/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface StoryHighlightsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function StoryHighlights({ userId, isOwnProfile }: StoryHighlightsProps) {
  const t = useTranslations("highlights");
  const { data, isLoading } = useHighlights(userId);
  const [activeHighlight, setActiveHighlight] = useState<HighlightResponse | null>(null);

  const highlights = data?.success ? data.data ?? [] : [];

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (highlights.length === 0 && !isOwnProfile) return null;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {highlights.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveHighlight(h)}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 p-0.5">
              <div className="h-full w-full rounded-full bg-background p-0.5">
                {h.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.coverUrl}
                    alt={h.title}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {h.itemCount}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[4.5rem]">
              {h.title}
            </span>
          </button>
        ))}

        {isOwnProfile && (
          <button className="flex flex-col items-center gap-1.5 shrink-0 group">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {t("new")}
            </span>
          </button>
        )}
      </div>

      {activeHighlight && (
        <HighlightViewer
          highlight={activeHighlight}
          onClose={() => setActiveHighlight(null)}
        />
      )}
    </>
  );
}

function HighlightViewer({
  highlight,
  onClose,
}: {
  highlight: HighlightResponse;
  onClose: () => void;
}) {
  const t = useTranslations("highlights");
  const { data, isLoading } = useHighlightItems(highlight.id);
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = data?.success ? data.data ?? [] : [];
  const current = items[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="relative w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">{highlight.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </div>

        {/* Progress bars */}
        {items.length > 1 && (
          <div className="flex gap-1 mb-3">
            {items.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 rounded-full bg-white/30">
                <div
                  className={`h-full rounded-full bg-white transition-all ${i <= currentIndex ? "w-full" : "w-0"}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="aspect-[9/16] rounded-lg overflow-hidden bg-muted">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : current ? (
            current.type === "video" ? (
              <video
                src={current.mediaUrl}
                className="h-full w-full object-cover"
                autoPlay
                muted
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.mediaUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {t("empty")}
            </div>
          )}
        </div>

        {/* Navigation */}
        {items.length > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex <= 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"
              onClick={() => setCurrentIndex(Math.min(items.length - 1, currentIndex + 1))}
              disabled={currentIndex >= items.length - 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
