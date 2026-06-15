import React from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-10 text-center",
        className,
      )}
    >
      <p className="font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
