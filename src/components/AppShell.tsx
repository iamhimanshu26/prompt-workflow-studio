"use client";

import Image from "next/image";
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
  { href: "/health", labelKey: "navHealth" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--border)] bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <Image
              src="/icon.svg"
              alt=""
              width={28}
              height={28}
              className="rounded-lg"
              priority
            />
            <span className="hidden text-xs font-bold tracking-tight text-[var(--foreground)] sm:inline">
              {t("appTitle")}
            </span>
          </Link>

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-hidden whitespace-nowrap">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/health" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold leading-none transition-colors sm:px-2.5 sm:text-[11px]",
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)]",
                  ].join(" ")}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0">
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="mt-auto shrink-0 border-t border-[var(--border)] bg-white/50">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 text-[11px] text-[var(--muted)] sm:px-6">
          <span>© {new Date().getFullYear()} Prompt Workflow Studio</span>
          <div className="flex items-center gap-3">
            <a href="/health" className="hover:underline">
              {t("navHealth")}
            </a>
            <a
              href="https://github.com/iamhimanshu26/prompt-workflow-studio"
              className="hover:underline"
              rel="noreferrer"
            >
              GitHub
            </a>
            <span className="hidden text-[10px] sm:inline">{DEMO_USER.email}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
