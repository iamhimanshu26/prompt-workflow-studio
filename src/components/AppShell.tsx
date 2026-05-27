"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DEMO_USER } from "@/lib/auth/mock";
import { useLang } from "@/lib/i18n/LangProvider";
import LangToggle from "@/components/LangToggle";

const NAV_ITEMS: { href: string; labelKey: string }[] = [
  { href: "/journey", labelKey: "navJourney" },
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
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/55 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-[var(--border)] bg-white/70 shadow-sm" />
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-[var(--foreground)]">
                {t("appTitle")}
              </div>
              <div className="text-xs text-[var(--muted)]">{t("dashboardHint")}</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-2 md:flex">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)]",
                    ].join(" ")}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              <Link
                href="/health"
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)]"
              >
                {t("navHealth")}
              </Link>
            </nav>

            <LangToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      <footer className="mt-10 border-t border-[var(--border)] bg-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} Prompt Workflow Studio
          </div>
          <div className="flex items-center gap-4">
            <a href="/health" className="hover:underline">
              {t("navHealth")}
            </a>
            <a href="https://github.com/iamhimanshu26/prompt-workflow-studio" className="hover:underline" rel="noreferrer">
              GitHub
            </a>
            <span className="hidden md:inline">•</span>
            <span className="text-xs">
              {DEMO_USER.email}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

