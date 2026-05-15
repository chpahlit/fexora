"use client";

import {
  FeedHeroPost,
  FeedVideoPost,
  FeedStoryPost,
  type FeedItem,
} from "@/components/feed/feed-post";
import { FeedRightRail } from "@/components/feed/feed-right-rail";
import { GoldDivider } from "@/components/ui/gold-divider";

/* ─── Mock Data (bis API steht) ─── */
const mockFeed: FeedItem[] = [
  {
    id: "1",
    kind: "image",
    title: "Eine Kerze brennt nie zweimal gleich.",
    seed: 0,
    lock: "blur",
    price: 24,
    creator: { name: "Liora", handle: "@liora.noir", verified: true, voice: true },
    likes: "4.2k",
    comments: "312",
    timeAgo: "vor 12 Min.",
  },
  {
    id: "2",
    kind: "video",
    title: "Im Spiegelsalon.",
    description:
      "\u201EDrei Aufnahmen aus dem Atelier am Sp\u00E4tnachmittag. Honiglicht, Seide, ein gehaltener Atem.\u201C",
    meta: "Akt I · Video · 02:14",
    seed: 1,
    lock: "gold",
    price: 48,
    creator: { name: "Esmé Vauclair", handle: "@esme", verified: true },
    likes: "2.1k",
    comments: "89",
    timeAgo: "vor 2 Std.",
  },
  {
    id: "3",
    kind: "story",
    title: "Kapitel III — Wenn der Vorhang fällt.",
    description:
      "Es war ein Donnerstag, an dem ich beschloss, niemandem mehr zu antworten. Die Vorhänge im Atelier hatten sich um eine Idee verschoben, und das Licht — das Licht, das ich seit Tagen suchte — kam jetzt von rechts. Wie wenn jemand wartet…",
    meta: "Story · 8 Kapitel",
    seed: 3,
    lock: "mosaic",
    price: 12,
    creator: { name: "Sasha Vey", handle: "@sasha.vey", verified: true, voice: true },
    likes: "986",
    comments: "142",
    timeAgo: "vor 6 Std.",
  },
];

export default function FeedPage() {
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 max-w-[1200px] mx-auto">
      {/* Main Feed Column */}
      <div>
        {/* Hero Post */}
        <FeedHeroPost item={mockFeed[0]} />

        <GoldDivider className="mb-12" />

        {/* Video Post */}
        <FeedVideoPost item={mockFeed[1]} />

        {/* Story Post */}
        <FeedStoryPost item={mockFeed[2]} />
      </div>

      {/* Right Rail */}
      <FeedRightRail />
    </div>
  );
}
