import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-600",
            "backdrop-blur-sm transition-all duration-150 resize-y min-h-[100px]",
            "focus:border-emerald-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/40 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
