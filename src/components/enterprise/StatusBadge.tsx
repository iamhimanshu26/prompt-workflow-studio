import React from "react";
import { cn } from "@/lib/utils";

export default function StatusBadge({
  label,
  status,
  className,
  pulse = false,
}: {
  label: string;
  status: "ok" | "warn" | "error" | "neutral";
  className?: string;
  pulse?: boolean;
}) {
  const styles = {
    ok: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
    neutral: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  }[status];

  const dot = {
    ok: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    warn: "bg-amber-400",
    error: "bg-red-400",
    neutral: "bg-slate-400",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wide",
        styles,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot, pulse && "pws-status-pulse")} />
      {label}
    </span>
  );
}
