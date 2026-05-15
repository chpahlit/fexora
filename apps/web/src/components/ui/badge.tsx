import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-[0.3px] h-[22px] transition-fexora",
  {
    variants: {
      variant: {
        gold: "bg-gold/15 text-gold border border-gold/20",
        default: "bg-gold/15 text-gold border border-gold/20",
        dark: "bg-elevated text-text-muted border border-hair",
        secondary: "bg-elevated text-text-muted border border-hair",
        outline: "bg-transparent text-text-muted border border-hair",
        danger: "bg-danger/15 text-danger border border-danger/20",
        destructive: "bg-danger/15 text-danger border border-danger/20",
        success: "bg-success/15 text-success border border-success/20",
        warning: "bg-warn/15 text-warn border border-warn/20",
        glass:
          "bg-white/5 text-text backdrop-blur-md border border-white/10",
      },
    },
    defaultVariants: {
      variant: "gold",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
