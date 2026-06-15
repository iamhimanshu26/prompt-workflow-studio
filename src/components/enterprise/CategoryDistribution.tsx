import React from "react";
import type { DashboardCategoryCount } from "@/types/dashboard";
import GlowCard from "./GlowCard";

export default function CategoryDistribution({
  categories,
  emptyTitle,
  emptyBody,
}: {
  categories: DashboardCategoryCount[];
  emptyTitle: string;
  emptyBody: string;
}) {
  if (categories.length === 0) {
    return (
      <GlowCard className="p-5">
        <p className="font-semibold text-[var(--foreground)]">{emptyTitle}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{emptyBody}</p>
      </GlowCard>
    );
  }

  const max = Math.max(...categories.map((c) => c.count), 1);

  return (
    <GlowCard className="space-y-3 p-5">
      {categories.map((c) => (
        <div key={c.category}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[var(--muted)]">
              {c.category}
            </span>
            <span className="font-semibold text-cyan-300">{c.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500/80 to-indigo-500/80 transition-all duration-700"
              style={{ width: `${(c.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </GlowCard>
  );
}
