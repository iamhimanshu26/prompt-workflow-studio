import React from "react";

export default function OptimizerSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-56 rounded bg-[var(--surface-muted)]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-[var(--surface-muted)]" />
        <div className="h-72 rounded-2xl bg-[var(--surface-muted)]" />
      </div>
    </div>
  );
}
