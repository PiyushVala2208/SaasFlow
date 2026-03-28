"use client";
import { cn } from "@/lib/utils";

export default function Input({ label, ...props }) {
  return (
    <div className="w-full space-y-2 text-left">
      {label && (
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none",
          "focus:border-accent/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/5",
          "transition-all duration-300 placeholder:text-neutral-600",
          props.className
        )}
      />
    </div>
  );
}