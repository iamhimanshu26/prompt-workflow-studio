"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LangToggle from "@/components/LangToggle";
import { findNavItem, PRIMARY_NAV, matchNavPath } from "@/lib/navigation";
import { useLang } from "@/lib/i18n/LangProvider";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

export default function Topbar({
  onMenuClick,
  mobileNavOpen,
}: {
  onMenuClick: () => void;
  mobileNavOpen: boolean;
}) {
  const pathname = usePathname();
  const { t } = useLang();
  const current = findNavItem(pathname);
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

  const pageTitle = current ? t(current.labelKey) : t("appTitle");
  const pageDesc = current ? t(current.descriptionKey) : t("appTagline");

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-cyan-300 lg:hidden"
          aria-expanded={mobileNavOpen}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-indigo-400">
            PromptOps Workspace
          </p>
          <h1 className="truncate text-lg font-bold text-[var(--foreground)]">{pageTitle}</h1>
          <p className="truncate text-xs text-[var(--muted)]">{pageDesc}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <StatusBadge
            label={system.db === "ok" ? "Connected" : "Offline"}
            status={system.db === "ok" ? "ok" : "error"}
            className="hidden sm:inline-flex"
            pulse
          />
          <StatusBadge
            label={system.ai === "openai" ? "OpenAI" : "Mock"}
            status={system.ai === "openai" ? "ok" : "warn"}
            className="hidden md:inline-flex"
          />
          <LangToggle />
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="border-t border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-3 lg:hidden">
          <div className="flex flex-wrap gap-1">
            {PRIMARY_NAV.map((item) => {
              const active = matchNavPath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold",
                    active
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "bg-[var(--surface-muted)] text-[var(--muted)]",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
