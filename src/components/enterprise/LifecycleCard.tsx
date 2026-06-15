import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export default function LifecycleCard({
  title,
  description,
  href,
  status,
  statusLabel,
}: {
  title: string;
  description: string;
  href: string;
  status: "active" | "ready" | "planned";
  statusLabel: string;
}) {
  const statusStyles = {
    active: "bg-emerald-500",
    ready: "bg-sky-500",
    planned: "bg-slate-300",
  }[status];

  return (
    <Link
      href={href}
      className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:border-[var(--accent)]/30"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-[var(--foreground)]">{title}</p>
        <span className="text-[10px] font-bold uppercase text-[var(--muted)]">{statusLabel}</span>
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all", statusStyles)}
          style={{ width: status === "active" ? "100%" : status === "ready" ? "55%" : "18%" }}
        />
      </div>
    </Link>
  );
}
