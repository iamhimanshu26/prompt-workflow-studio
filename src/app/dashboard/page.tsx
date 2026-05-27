"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import type { AiModelId, PromptCategory } from "@prisma/client";

type DashboardResponse = {
  status: "ok" | "error";
  data?: {
    promptsCount: number;
    runsCount: number;
    avgScore: number | null;
    categories: { category: PromptCategory; count: number }[];
    recentRuns: {
      id: string;
      createdAt: string;
      category: PromptCategory;
      modelId: AiModelId;
      promptTitle: string;
      score: number | null;
    }[];
  };
  message?: string;
};

export default function DashboardPage() {
  const { t } = useLang();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse["data"] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        const json = (await res.json()) as DashboardResponse;
        if (cancelled) return;

        if (!res.ok || json.status !== "ok" || !json.data) {
          setErr(json.message ?? "Failed to load");
          setData(null);
          setLoading(false);
          return;
        }

        setData(json.data);
        setErr(null);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : "Failed to load dashboard");
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("dashboardLoading")}</p>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>
        <p className="mt-2 text-sm text-red-300">{t("dashboardError")}</p>
      </div>
    );
  }

  const avgScoreText = data.avgScore == null ? "—" : `${data.avgScore}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("dashboardHint")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-xs font-semibold text-[var(--muted)]">{t("promptsCountLabel")}</div>
          <div className="mt-2 text-3xl font-bold">{data.promptsCount}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-xs font-semibold text-[var(--muted)]">{t("runsCountLabel")}</div>
          <div className="mt-2 text-3xl font-bold">{data.runsCount}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-xs font-semibold text-[var(--muted)]">{t("avgScoreLabel")}</div>
          <div className="mt-2 text-3xl font-bold">{avgScoreText}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">/ 100</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-xs font-semibold text-[var(--muted)]">{t("categoriesTitle")}</div>
          <div className="mt-2 space-y-1">
            {data.categories.slice(0, 3).map((c) => (
              <div key={c.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--muted)]">{c.category}</span>
                <span className="font-semibold">{c.count}</span>
              </div>
            ))}
            {data.categories.length === 0 && (
              <div className="text-sm text-[var(--muted)]">—</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("recentRunsTitle")}</h2>
        </div>

        {data.recentRuns.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">{t("recentRunsEmpty")}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2">{t("tableCreatedAt")}</th>
                  <th className="px-3 py-2">{t("tableCategory")}</th>
                  <th className="px-3 py-2">{t("tableModel")}</th>
                  <th className="px-3 py-2">{t("tablePrompt")}</th>
                  <th className="px-3 py-2">{t("tableScore")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.recentRuns.map((r) => (
                  <tr key={r.id} className="text-[var(--foreground)]">
                    <td className="px-3 py-2 text-xs text-[var(--muted)]">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--muted)]">{r.category}</td>
                    <td className="px-3 py-2 text-xs text-[var(--muted)]">{r.modelId}</td>
                    <td className="px-3 py-2">
                      <span className="line-clamp-2 inline-block max-w-[320px]">
                        {r.promptTitle}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-semibold">
                      {r.score == null ? "—" : r.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

