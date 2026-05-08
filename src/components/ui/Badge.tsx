import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantClasses = {
  default: "bg-white/[0.06] text-gray-300 ring-white/[0.1]",
  success: "bg-emerald-500/[0.12] text-emerald-400 ring-emerald-500/[0.2]",
  warning: "bg-amber-500/[0.12] text-amber-400 ring-amber-500/[0.2]",
  danger:  "bg-red-500/[0.12] text-red-400 ring-red-500/[0.2]",
  info:    "bg-blue-500/[0.12] text-blue-400 ring-blue-500/[0.2]",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
