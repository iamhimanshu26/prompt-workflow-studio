"use client";

import React from "react";
import GlowCard from "./GlowCard";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  hint,
  description,
  icon,
  className,
  animate = true,
}: {
  label: string;
  value: string | number;
  hint?: string;
  description?: string;
  icon?: string;
  className?: string;
  animate?: boolean;
}) {
  const numeric = typeof value === "number" ? value : null;
  const counted = useCountUp(numeric ?? 0);
  const display = numeric !== null && animate ? counted : value;

  return (
    <GlowCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </p>
        {icon && (
          <span className="text-lg opacity-80" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text">
        {display}
        {hint && (
          <span className="ml-1 text-sm font-medium text-[var(--muted)]">{hint}</span>
        )}
      </p>
      {description && <p className="mt-2 text-xs text-[var(--muted)]">{description}</p>}
    </GlowCard>
  );
}
