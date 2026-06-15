"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LangToggle from "@/components/LangToggle";
import { findNavItem, PRIMARY_NAV, matchNavPath } from "@/lib/navigation";
import { useLang } from "@/lib/i18n/LangProvider";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

type SystemStatus = {
  databaseStatus?: string;
  aiProvider?: string;
};

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
  const [system, setSystem] = useState<SystemStatus>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setSystem({
          databaseStatus: json.database ?? "unknown",
          aiProvider: json.ai?.provider ?? json.aiConfig?.activeProvider,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const pageTitle = current ? t(current.labelKey) : t("appTitle");
  const pageDesc = current ? t(current.descriptionKey) : t("appTagline");

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground)] lg:hidden"
          aria-expanded={mobileNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="text-lg">☰</span>
        </button>

        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <Image src="/icon.svg" alt="" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-bold">{t("appTitle")}</span>
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            PromptOps Workspace
          </p>
          <h1 className="truncate text-lg font-bold text-[var(--foreground)]">{pageTitle}</h1>
          <p className="truncate text-xs text-[var(--muted)]">{pageDesc}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {system.databaseStatus && (
            <StatusBadge
              label={`DB ${system.databaseStatus}`}
              status={system.databaseStatus === "ok" ? "ok" : "error"}
              className="hidden sm:inline-flex"
            />
          )}
          {system.aiProvider && (
            <StatusBadge
              label={`AI ${system.aiProvider}`}
              status={system.aiProvider === "openai" ? "ok" : "warn"}
              className="hidden md:inline-flex"
            />
          )}
          <LangToggle />
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="border-t border-[var(--border)] bg-[var(--surface)] px-3 py-3 lg:hidden">
          <div className="mb-2 px-2">
            <p className="text-sm font-bold">{pageTitle}</p>
            <p className="text-xs text-[var(--muted)]">{pageDesc}</p>
          </div>
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
                      ? "bg-[var(--accent)] text-white"
                      : "bg-slate-100 text-[var(--muted)]",
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
