"use client";

import React, { useState } from "react";
import { DEMO_USER } from "@/lib/auth/mock";
import { useLang } from "@/lib/i18n/LangProvider";
import Sidebar from "@/components/enterprise/Sidebar";
import Topbar from "@/components/enterprise/Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="pws-grain" aria-hidden />
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            mobileNavOpen={mobileNavOpen}
            onMenuClick={() => setMobileNavOpen((v) => !v)}
          />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>

          <footer className="border-t border-[var(--border)] bg-[var(--surface)]/80 px-4 py-4 backdrop-blur-md lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                © {new Date().getFullYear()} Prompt Workflow Studio · {t("appTaglineShort")}
              </span>
              <div className="flex items-center gap-4 text-[11px] text-[var(--muted)]">
                <a href="/health" className="hover:text-cyan-300">
                  {t("navHealth")}
                </a>
                <a
                  href="https://github.com/iamhimanshu26/prompt-workflow-studio"
                  className="hover:text-cyan-300"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <span>{DEMO_USER.email}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
