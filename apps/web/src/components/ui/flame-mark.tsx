import { cn } from "@/lib/utils";

const sizes = {
  14: { width: 14, height: 14 },
  18: { width: 18, height: 18 },
  22: { width: 22, height: 22 },
  26: { width: 26, height: 26 },
  40: { width: 40, height: 40 },
  240: { width: 240, height: 240 },
} as const;

interface FlameMarkProps {
  size?: keyof typeof sizes;
  className?: string;
}

export function FlameMark({ size = 22, className }: FlameMarkProps) {
  const { width, height } = sizes[size];
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 32"
      fill="none"
      className={cn("text-gold", className)}
    >
      {/* Candle body */}
      <rect
        x="9"
        y="16"
        width="6"
        height="14"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Wick */}
      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
      {/* Flame outer */}
      <path
        d="M12 2C12 2 7 8 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 8 12 2 12 2Z"
        fill="url(#flame-grad)"
      />
      {/* Flame inner */}
      <path
        d="M12 6C12 6 9.5 9.5 9.5 11.5C9.5 12.9 10.6 14 12 14C13.4 14 14.5 12.9 14.5 11.5C14.5 9.5 12 6 12 6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <defs>
        <linearGradient id="flame-grad" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8c089" />
          <stop offset="0.4" stopColor="#d4a574" />
          <stop offset="1" stopColor="#a07a4d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
