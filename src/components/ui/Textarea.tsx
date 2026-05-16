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
          <label htmlFor={id} className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "rounded-lg border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-700",
            "transition-all duration-150 resize-y min-h-[100px]",
            "focus:border-emerald-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-emerald-500/25",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error && "border-red-500/40 focus:ring-red-500/25",
            className
          )}
          {...props}
        />
        {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
