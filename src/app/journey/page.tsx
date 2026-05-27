"use client";

import Link from "next/link";
import React from "react";
import { getAllPhaseMeta } from "@/content/journey";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Lang } from "@/lib/i18n/messages";

function pick(obj: { en: string; ja: string }, lang: Lang) {
  return lang === "ja" ? obj.ja : obj.en;
}

export default function JourneyHubPage() {
  const { lang, t } = useLang();
  const phases = getAllPhaseMeta();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboardJourneyTitle")}</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">{t("journeyHubSubtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((p) => {
          const isPlanned = p.status === "planned";
          const href = isPlanned ? "#" : `/journey/${p.phase}`;
          const card = (
            <div
              className={[
                "h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all",
                isPlanned ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[var(--accent)]">{p.phase}</span>
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    p.status === "complete"
                      ? "bg-emerald-500/15 text-emerald-800"
                      : p.status === "current"
                        ? "bg-sky-500/15 text-sky-800"
                        : "bg-black/5 text-[var(--muted)]",
                  ].join(" ")}
                >
                  {p.status}
                </span>
              </div>
              <h2 className="mt-3 font-bold">{pick(p.title, lang)}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{pick(p.summary, lang)}</p>
              {!isPlanned && (
                <p className="mt-4 text-sm font-semibold text-[var(--accent)]">
                  {lang === "ja" ? "詳細を見る →" : "View details →"}
                </p>
              )}
            </div>
          );

          return isPlanned ? (
            <div key={p.phase}>{card}</div>
          ) : (
            <Link key={p.phase} href={href}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
