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
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "rounded-lg border border-gray-700/80 bg-gray-800/80 px-3.5 py-2.5 text-sm text-gray-100",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 focus:bg-gray-800",
            "transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-700/80 focus:ring-red-500/30",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-800 text-gray-100">
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
