import React from "react";
import { cn } from "@/lib/utils";

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="h-8 w-64 rounded-lg bg-[var(--border)]" />
      <div className="h-4 w-96 max-w-full rounded bg-[var(--border)]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[var(--border)]" />
    </div>
  );
}
