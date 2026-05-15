import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { FlameMark } from "./flame-mark";

/* Deterministic moody gradient seeds */
const gradients: [string, string][] = [
  ["#3a2418", "#1a0f08"],
  ["#2a1a14", "#0f0805"],
  ["#1f1612", "#0a0605"],
  ["#3a2a1c", "#1a1208"],
  ["#241814", "#0a0604"],
  ["#2e1f16", "#120a05"],
  ["#1a1410", "#080604"],
  ["#3c2818", "#1c1208"],
  ["#28201a", "#0f0a07"],
  ["#2a1c14", "#100805"],
  ["#352318", "#1a0e06"],
  ["#241a14", "#0c0805"],
];

type LockVariant = "blur" | "mosaic" | "dark" | "gold" | "none";

interface FImageProps {
  seed?: number;
  locked?: LockVariant;
  label?: string;
  className?: string;
}

export function FImage({
  seed = 0,
  locked = "none",
  label,
  className,
}: FImageProps) {
  const [c1, c2] = gradients[seed % gradients.length];

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{
        background: `radial-gradient(80% 60% at 30% 20%, ${c1} 0%, ${c2} 70%, #050302 100%)`,
      }}
    >
      {/* Shape silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ShapeSilhouette seed={seed} />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 80% 90%, rgba(212,165,116,0.08), transparent 70%), radial-gradient(40% 40% at 20% 100%, rgba(0,0,0,0.4), transparent 70%)",
        }}
      />

      {/* Lock overlays */}
      {locked === "blur" && <BlurOverlay />}
      {locked === "mosaic" && <MosaicOverlay seed={seed} />}
      {locked === "dark" && <DarkOverlay />}
      {locked === "gold" && <GoldOverlay />}

      {/* Label */}
      {label && (
        <div className="absolute bottom-2.5 left-3 right-3 font-serif text-[14px] text-text opacity-90 italic">
          {label}
        </div>
      )}
    </div>
  );
}

function ShapeSilhouette({ seed }: { seed: number }) {
  const variant = seed % 4;

  if (variant === 0) {
    return (
      <svg
        width="80%"
        height="80%"
        viewBox="0 0 100 140"
        fill="none"
        className="opacity-40"
      >
        <path
          d="M50 30 C 45 35, 45 45, 50 50 C 55 45, 55 35, 50 30 Z"
          fill="var(--gold)"
          opacity="0.6"
        />
        <path
          d="M48 50 L 48 90 L 52 90 L 52 50 Z"
          fill="var(--gold)"
          opacity="0.3"
        />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg
        width="80%"
        height="80%"
        viewBox="0 0 100 140"
        fill="none"
        className="opacity-35"
      >
        <ellipse cx="50" cy="45" rx="14" ry="18" fill="var(--gold)" opacity="0.5" />
        <path
          d="M30 130 Q 30 70, 50 70 Q 70 70, 70 130"
          fill="var(--gold)"
          opacity="0.4"
        />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg
        width="60%"
        height="60%"
        viewBox="0 0 100 100"
        fill="none"
        className="opacity-30"
      >
        <path
          d="M50 10 L 90 50 L 50 90 L 10 50 Z"
          stroke="var(--gold)"
          strokeWidth="1"
        />
        <path
          d="M50 30 L 70 50 L 50 70 L 30 50 Z"
          stroke="var(--gold)"
          strokeWidth="0.8"
        />
      </svg>
    );
  }
  return (
    <span className="font-serif text-[120px] text-gold opacity-[0.18] leading-none tracking-[-4px]">
      F
    </span>
  );
}

function BlurOverlay() {
  return (
    <>
      <div className="absolute inset-0 backdrop-blur-[22px] bg-[rgba(10,8,7,0.35)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
        <div className="w-11 h-11 rounded-full bg-gold/[0.18] flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(212,165,116,0.5)]">
          <Lock className="size-5 text-gold" />
        </div>
      </div>
    </>
  );
}

function MosaicOverlay({ seed }: { seed: number }) {
  const colors = [
    "#2a1d14",
    "#1f1610",
    "#15100b",
    "#241a12",
    "#1b130d",
    "#2e1f15",
  ];

  return (
    <>
      <div className="absolute inset-0 grid grid-cols-[repeat(24,1fr)] grid-rows-[repeat(16,1fr)]">
        {Array.from({ length: 16 * 24 }, (_, idx) => {
          const i = Math.floor(idx / 24);
          const j = idx % 24;
          const k = (i * 7 + j * 11 + seed * 3) % 6;
          return (
            <div key={idx} style={{ background: colors[k] }} />
          );
        })}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[rgba(10,8,7,0.7)] flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(212,165,116,0.5)]">
        <Lock className="size-5 text-gold" />
      </div>
    </>
  );
}

function DarkOverlay() {
  return (
    <div className="absolute inset-0 bg-[rgba(10,8,7,0.78)] flex flex-col items-center justify-center gap-2.5">
      <Lock className="size-[22px] text-gold" />
      <span className="eyebrow">Unlock</span>
    </div>
  );
}

function GoldOverlay() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(212,165,116,0.4), rgba(160,122,77,0.6) 60%, rgba(60,40,25,0.7))",
          mixBlendMode: "multiply",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[18px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <FlameMark size={26} className="text-white" />
      </div>
    </>
  );
}
