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
        "group block rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 pws-hover-glow",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
        className,
      )}
    >
      <p className="font-semibold text-[var(--foreground)] transition group-hover:text-cyan-300">
        {title}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      <span className="mt-3 inline-block font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-indigo-400">
        Execute →
      </span>
    </Link>
  );
}
