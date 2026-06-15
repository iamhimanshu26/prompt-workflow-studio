import React from "react";
import { cn } from "@/lib/utils";

export default function StatusBadge({
  label,
  status,
  className,
}: {
  label: string;
  status: "ok" | "warn" | "error" | "neutral";
  className?: string;
}) {
  const styles = {
    ok: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warn: "bg-amber-50 text-amber-900 border-amber-200",
    error: "bg-red-50 text-red-800 border-red-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        styles,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "ok" && "bg-emerald-500",
          status === "warn" && "bg-amber-500",
          status === "error" && "bg-red-500",
          status === "neutral" && "bg-slate-400",
        )}
      />
      {label}
    </span>
  );
}
