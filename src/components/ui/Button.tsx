import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] focus-visible:ring-emerald-500",
  secondary:
    "bg-white/[0.05] text-gray-200 border border-white/[0.09] hover:bg-white/[0.09] hover:border-white/[0.16] focus-visible:ring-gray-600",
  ghost:
    "text-gray-400 hover:bg-white/[0.05] hover:text-gray-200 focus-visible:ring-gray-600",
  danger:
    "bg-red-600/90 text-white shadow-sm hover:bg-red-500 focus-visible:ring-red-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs font-medium gap-1.5",
  md: "px-3.5 py-2 text-sm font-medium gap-2",
  lg: "px-4.5 py-2.5 text-sm font-semibold gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030a06]",
          "disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
