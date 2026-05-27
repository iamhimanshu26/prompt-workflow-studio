"use client";

import Link from "next/link";
import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

const PHASES = [
  { n: 0, status: "current" as const },
  { n: 1, status: "next" as const },
  { n: 2, status: "planned" as const },
  { n: 3, status: "planned" as const },
  { n: 4, status: "planned" as const },
  { n: 5, status: "planned" as const },
  { n: 6, status: "planned" as const },
  { n: 7, status: "planned" as const },
  { n: 8, status: "planned" as const },
  { n: 9, status: "planned" as const },
];

export default function HomePage() {
  const { t } = useLang();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
        {t("phase0Heading")}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">{t("appTitle")}</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">{t("appSubtitle")}</p>

      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold uppercase text-[var(--muted)]">{t("buildRoadmapTitle")}</h2>
        <ul className="mt-4 space-y-2">
          {PHASES.map((p) => (
            <li key={p.n} className="flex items-center gap-3 text-sm">
              <span
                className={
                  p.status === "current"
                    ? "rounded bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-white"
                    : "rounded bg-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                }
              >
                {p.n}
              </span>
              <span
                className={
                  p.status === "current" ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                }
              >
                {t(`phase${p.n}Label`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/health"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t("checkApiHealth")}
        </Link>
        <a
          href="https://github.com"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]"
          rel="noreferrer"
        >
          {t("readmeSetupLocal")}
        </a>
      </div>

      <p className="mt-12 text-xs text-[var(--muted)]">{t("runLine")}</p>
    </main>
  );
}
