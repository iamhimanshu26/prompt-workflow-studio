import React from "react";

export default function VersionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 rounded bg-[var(--surface-muted)]" />
      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <div className="h-96 rounded-2xl bg-[var(--surface-muted)]" />
        <div className="h-96 rounded-2xl bg-[var(--surface-muted)]" />
      </div>
    </div>
  );
}
