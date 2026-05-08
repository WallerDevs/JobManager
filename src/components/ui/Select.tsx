import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-100",
            "backdrop-blur-sm transition-all duration-150",
            "focus:border-emerald-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/40 focus:ring-red-500/30",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#060e08] text-gray-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
