"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DEMO_USER } from "@/lib/auth/mock";
import { useLang } from "@/lib/i18n/LangProvider";

const NAV_ITEMS: { href: string; labelKey: string }[] = [
  { href: "/dashboard", labelKey: "navDashboard" },
  { href: "/playground", labelKey: "navPlayground" },
  { href: "/optimizer", labelKey: "navOptimizer" },
  { href: "/library", labelKey: "navLibrary" },
  { href: "/workflows", labelKey: "navWorkflows" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]/80 p-4 md:flex">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-muted)]">
          {t("appTitle")}
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--border)]/60 hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 text-xs text-[var(--muted)]">
          Signed in as <span className="text-[var(--foreground)]">{DEMO_USER.email}</span>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{t("dashboardBrand")}</div>
              <div className="text-xs text-[var(--muted)]">{t("dashboardHint")}</div>
            </div>
            <div className="hidden text-right md:block">
              <a
                href="/health"
                className="text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                {t("navHealth")}
              </a>
            </div>
          </div>
        </header>

        <main className="px-6 py-10">{children}</main>
      </div>
    </div>
  );
}

