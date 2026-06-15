import React from "react";

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-6 ${className ?? ""}`}>
      <div
        className="h-40 rounded-2xl border border-[var(--border)]"
        style={{
          background:
            "linear-gradient(90deg, var(--surface-muted) 25%, var(--surface-elevated) 50%, var(--surface-muted) 75%)",
          backgroundSize: "200% 100%",
          animation: "pwsShimmer 1.5s infinite",
        }}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[var(--surface-muted)]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-[var(--surface-muted)]" />
    </div>
  );
}
