import { cn } from "@/lib/utils";
import { BadgeCheck, Mic, Star } from "lucide-react";

const kinds = {
  verified: {
    icon: BadgeCheck,
    bg: "bg-gold/20",
    text: "text-gold",
  },
  voice: {
    icon: Mic,
    bg: "bg-gold/20",
    text: "text-gold",
  },
  star: {
    icon: Star,
    bg: "bg-gold-bright/20",
    text: "text-gold-bright",
  },
} as const;

interface CreatorBadgeProps {
  kind: keyof typeof kinds;
  size?: "sm" | "md";
  className?: string;
}

export function CreatorBadge({ kind, size = "sm", className }: CreatorBadgeProps) {
  const { icon: Icon, bg, text } = kinds[kind];
  const sizeClass = size === "sm" ? "h-4 w-4 [&_svg]:size-2.5" : "h-6 w-6 [&_svg]:size-3.5";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        bg,
        text,
        sizeClass,
        className
      )}
    >
      <Icon />
    </span>
  );
}
