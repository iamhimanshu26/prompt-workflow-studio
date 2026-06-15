"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { PRIMARY_NAV, SECONDARY_NAV, matchNavPath } from "@/lib/navigation";
import { useLang } from "@/lib/i18n/LangProvider";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]",
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/icon.svg" alt="" width={32} height={32} className="rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--foreground)]">{t("appTitle")}</p>
            <p className="truncate text-[10px] text-[var(--muted)]">{t("appTagline")}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
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
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active && isIdea && "bg-[var(--idea-accent)] text-white",
                active && !isIdea && "bg-[var(--accent)] text-white",
                !active && isIdea && "text-[var(--idea-accent)] hover:bg-[var(--idea-accent)]/10",
                !active && !isIdea && "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--foreground)]",
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}

        <p className="mt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
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
                  ? "bg-slate-800 text-white"
                  : "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--foreground)]",
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-4 py-4 text-[10px] text-[var(--muted)]">
        PromptOps · Enterprise UI
      </div>
    </aside>
  );
}
