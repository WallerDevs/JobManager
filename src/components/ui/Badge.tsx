import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantClasses = {
  default: "bg-gray-800 text-gray-300 ring-gray-700/80",
  success: "bg-emerald-950/80 text-emerald-400 ring-emerald-900/80",
  warning: "bg-amber-950/80 text-amber-400 ring-amber-900/80",
  danger: "bg-red-950/80 text-red-400 ring-red-900/80",
  info: "bg-blue-950/80 text-blue-400 ring-blue-900/80",
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
