"use client";

import { Link } from "@/i18n/navigation";
import { FImage } from "@/components/ui/f-image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Unlock, Play } from "lucide-react";

export interface FeedItem {
  id: string;
  kind: "image" | "video" | "audio" | "story";
  title: string;
  description?: string;
  seed: number;
  lock: "blur" | "gold" | "dark" | "mosaic";
  price: number;
  creator: { name: string; handle: string; verified?: boolean; voice?: boolean };
  meta?: string;
  likes: string;
  comments: string;
  timeAgo: string;
}

/* ─── Hero Post (Editor's Pick) ─── */
export function FeedHeroPost({ item }: { item: FeedItem }) {
  return (
    <article className="mb-14">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-[30px] h-px bg-gold" />
        <span className="eyebrow tracking-[2.5px]">Auswahl der Redaktion</span>
      </div>
      <h2 className="font-serif text-display-3 text-text font-normal leading-[1.05] tracking-[-1px] mb-6">
        {item.title.split(" ").slice(0, 3).join(" ")}
        <br />
        <span className="italic text-gold">{item.title.split(" ").slice(3).join(" ")}</span>
      </h2>

      <Link href={`/content/${item.id}`}>
        <div className="relative rounded-xl overflow-hidden mb-5">
          <div className="aspect-[16/9]">
            <FImage seed={item.seed} locked={item.lock} />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="gold">{item.price} 🔥</Badge>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-3.5">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-[12px]">{item.creator.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-body text-text font-semibold">{item.creator.name}</span>
            {item.creator.verified && <CreatorBadge kind="verified" size="sm" />}
            {item.creator.voice && <CreatorBadge kind="voice" size="sm" />}
          </div>
          <span className="text-[12px] text-text-muted">{item.creator.handle} · {item.timeAgo}</span>
        </div>
        <div className="flex-1" />
        <EngagementBar likes={item.likes} comments={item.comments} />
        <Button variant="primary" size="default">
          <Unlock className="size-3.5" />
          Freischalten · {item.price} 🔥
        </Button>
      </div>
    </article>
  );
}

/* ─── Video/Clip Post (2-Column) ─── */
export function FeedVideoPost({ item }: { item: FeedItem }) {
  return (
    <article className="mb-14">
      <div className="eyebrow text-[10px] tracking-[2.5px] text-text-muted mb-2">
        {item.meta}
      </div>
      <h3 className="font-serif text-[32px] text-text font-medium italic leading-[1.15] tracking-[-0.4px] mb-5">
        {item.title}
      </h3>
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <Link href={`/content/${item.id}`}>
          <div className="relative rounded-xl overflow-hidden">
            <div className="aspect-[4/3]">
              <FImage seed={item.seed} locked={item.lock} />
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="dark">{item.meta}</Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Button variant="primary" size="default">
                <Play className="size-3.5" />
                Vorschau ansehen
              </Button>
            </div>
          </div>
        </Link>
        <div>
          <div className="bg-card rounded-xl p-[18px] hairline mb-3">
            <div className="flex items-center gap-2.5 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-[10px]">{item.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1 text-body-sm text-text font-semibold">
                  {item.creator.name}
                  {item.creator.verified && <CreatorBadge kind="verified" size="sm" />}
                </div>
                <div className="text-[11px] text-text-muted">{item.creator.handle}</div>
              </div>
            </div>
            <p className="font-serif text-body text-text-muted italic leading-[1.55]">
              {item.description}
            </p>
          </div>
          <Button variant="primary" size="default" className="w-full">
            <Unlock className="size-3.5" />
            Freischalten · {item.price} 🔥
          </Button>
          <Button variant="secondary" size="default" className="w-full mt-2">
            Komplettes Atelier
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ─── Story Post (Horizontal) ─── */
export function FeedStoryPost({ item }: { item: FeedItem }) {
  return (
    <article className="mb-14">
      <div className="eyebrow text-[10px] tracking-[2.5px] text-text-muted mb-2">
        {item.meta}
      </div>
      <h3 className="font-serif text-h2 text-text font-medium italic leading-[1.2] tracking-[-0.3px] mb-4">
        {item.title}
      </h3>
      <div className="flex gap-[18px] items-start">
        <Link href={`/content/${item.id}`} className="shrink-0">
          <div className="w-[180px] rounded-lg overflow-hidden">
            <div className="aspect-[3/4]">
              <FImage seed={item.seed} locked={item.lock} />
            </div>
          </div>
        </Link>
        <div className="flex-1">
          <p className="font-serif text-body-lg text-text leading-[1.7] mb-4">
            {item.description}
          </p>
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">{item.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-body-sm text-text font-medium">{item.creator.name}</span>
            {item.creator.verified && <CreatorBadge kind="verified" size="sm" />}
            {item.creator.voice && <CreatorBadge kind="voice" size="sm" />}
            <div className="flex-1" />
            <Button variant="primary" size="default">
              <Unlock className="size-3.5" />
              {item.title.split(" ")[0]} · {item.price} 🔥
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Engagement Buttons ─── */
function EngagementBar({ likes, comments }: { likes: string; comments: string }) {
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        className="h-9 px-3.5 rounded-[18px] bg-card text-text-muted text-body-sm flex items-center gap-1.5 hairline transition-fexora hover:hairline-strong"
      >
        <Heart className="size-3.5" /> {likes}
      </button>
      <button
        type="button"
        className="h-9 px-3.5 rounded-[18px] bg-card text-text-muted text-body-sm flex items-center gap-1.5 hairline transition-fexora hover:hairline-strong"
      >
        <MessageCircle className="size-3.5" /> {comments}
      </button>
      <button
        type="button"
        className="w-9 h-9 rounded-[18px] bg-card text-text-muted flex items-center justify-center hairline transition-fexora hover:hairline-strong"
      >
        <Bookmark className="size-3.5" />
      </button>
    </div>
  );
}
