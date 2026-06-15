import React from "react";

export default function EvaluationSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-72 rounded bg-[var(--surface-muted)]" />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="h-[420px] rounded-2xl bg-[var(--surface-muted)]" />
        <div className="h-[420px] rounded-2xl bg-[var(--surface-muted)]" />
      </div>
    </div>
  );
}
