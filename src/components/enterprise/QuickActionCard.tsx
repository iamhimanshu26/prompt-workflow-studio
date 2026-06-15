import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export default function QuickActionCard({
  href,
  title,
  description,
  className,
}: {
  href: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:border-[var(--accent)]/40 hover:shadow-md",
        className,
      )}
    >
      <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
        {title}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-[var(--accent)]">
        Open →
      </span>
    </Link>
  );
}
