"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PRIMARY_NAV, SECONDARY_NAV, matchNavPath } from "@/lib/navigation";
import { useLang } from "@/lib/i18n/LangProvider";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

function BrandMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
      <span className="font-[family-name:var(--font-mono)] text-xs font-black text-cyan-300">P</span>
    </div>
  );
}

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLang();
  const [system, setSystem] = useState({ db: "—", ai: "—" });

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) =>
        setSystem({
          db: j.database ?? "unknown",
          ai: j.ai?.provider ?? "mock",
        }),
      )
      .catch(() => {});
  }, []);

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BrandMark />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--foreground)]">{t("appTitle")}</p>
            <p className="truncate font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-cyan-400/80">
              {t("appTaglineShort")}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("navSectionPrimary")}
        </p>
        {PRIMARY_NAV.map((item) => {
          const active = matchNavPath(pathname, item.href);
          const isIdea = item.highlight;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active &&
                  "border border-cyan-500/25 bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-100 shadow-[inset_0_0_20px_rgba(34,211,238,0.06)]",
                !active && isIdea && "text-amber-300/90 hover:bg-amber-500/10",
                !active &&
                  !isIdea &&
                  "text-[var(--muted)] hover:border hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}

        <p className="mt-6 px-3 pb-2 font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("navSectionMore")}
        </p>
        {SECONDARY_NAV.map((item) => {
          const active = matchNavPath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-[var(--border)] px-4 py-4">
        <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
          {t("sidebarStatusTitle")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge
            label={`AI ${system.ai}`}
            status={system.ai === "openai" ? "ok" : "warn"}
            pulse
          />
          <StatusBadge
            label={`DB ${system.db}`}
            status={system.db === "ok" ? "ok" : "error"}
            pulse
          />
        </div>
      </div>
    </aside>
  );
}
