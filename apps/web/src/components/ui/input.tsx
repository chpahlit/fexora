import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  trail?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, trail, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="eyebrow">{label}</label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-text-muted [&_svg]:size-4">
              {icon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg bg-surface text-body text-text placeholder:text-text-faint transition-fexora",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "hairline hover:hairline-strong",
              icon ? "pl-10 pr-3" : "px-3",
              trail ? "pr-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          {trail && (
            <span className="absolute right-3 text-text-muted [&_svg]:size-4">
              {trail}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
