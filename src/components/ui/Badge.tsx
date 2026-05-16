import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantClasses = {
  default: "bg-white/[0.05] text-gray-400 ring-white/[0.08]",
  success: "bg-emerald-500/[0.1] text-emerald-400 ring-emerald-500/[0.18]",
  warning: "bg-amber-500/[0.1] text-amber-400 ring-amber-500/[0.18]",
  danger:  "bg-red-500/[0.1] text-red-400 ring-red-500/[0.18]",
  info:    "bg-blue-500/[0.1] text-blue-400 ring-blue-500/[0.18]",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
