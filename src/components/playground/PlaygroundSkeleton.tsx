import React from "react";

export default function PlaygroundSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-48 rounded bg-[var(--surface-muted)]" />
      <div className="h-32 rounded-2xl bg-[var(--surface-muted)]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-[var(--surface-muted)]" />
        <div className="h-64 rounded-2xl bg-[var(--surface-muted)]" />
      </div>
    </div>
  );
}
