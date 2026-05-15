import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-fexora focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-grad text-bg font-semibold hover:brightness-110 rounded-full",
        default:
          "bg-gold-grad text-bg font-semibold hover:brightness-110 rounded-full",
        secondary:
          "bg-transparent text-text hairline hover:hairline-strong rounded-full",
        ghost:
          "bg-transparent text-text-muted hover:text-text hover:bg-elevated rounded-full",
        danger:
          "bg-danger text-text font-semibold hover:bg-danger/90 rounded-full",
        destructive:
          "bg-danger text-text font-semibold hover:bg-danger/90 rounded-full",
        success:
          "bg-success text-text font-semibold hover:bg-success/90 rounded-full",
        outline:
          "border border-hair bg-transparent text-gold hover:bg-elevated rounded-full",
        link: "text-gold underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-4 text-body-sm",
        default: "h-11 px-6 text-body",
        lg: "h-[52px] px-8 text-body-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
