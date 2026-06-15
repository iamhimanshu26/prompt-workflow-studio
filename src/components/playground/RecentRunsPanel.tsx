"use client";

import Link from "next/link";
import React from "react";
import { PromptCategory, AiModelId } from "@prisma/client";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import CopyButton from "./CopyButton";
import PlaygroundEmptyState from "./PlaygroundEmptyState";

export type RecentRunRow = {
  id: string;
  createdAt: string;
  category: PromptCategory;
  modelId: AiModelId;
  provider: string;
  promptTitle: string | null;
  promptText: string;
  promptPreview: string;
  responseText: string;
  responsePreview: string;
  latencyMs: number;
  score: number | null;
};

export default function RecentRunsPanel({
  runs,
  onLoad,
  onRerun,
}: {
  runs: RecentRunRow[];
  onLoad: (run: RecentRunRow) => void;
  onRerun: (run: RecentRunRow) => void;
}) {
  const { t } = useLang();

  if (runs.length === 0) {
    return (
      <PlaygroundEmptyState
        title={t("pgRunsEmptyTitle")}
        description={t("pgRunsEmptyBody")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {runs.map((r) => (
        <GlowCard key={r.id} glow={false} className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)]">
              {r.category}
            </span>
            <time>{new Date(r.createdAt).toLocaleString()}</time>
          </div>
          <p className="mt-2 font-medium text-[var(--foreground)] line-clamp-1">
            {r.promptTitle ?? r.promptPreview}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">{r.responsePreview}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[var(--muted)]">
            <span>
              {r.provider} / {r.modelId}
            </span>
            <span>{r.latencyMs}ms</span>
            {r.score != null && (
              <span className="text-cyan-300">
                {t("tableScore")}: {r.score}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onRerun(r)}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold hover:border-cyan-400/35"
            >
              {t("pgRerun")}
            </button>
            <CopyButton text={r.responseText} />
            <button
              type="button"
              onClick={() => onLoad(r)}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold hover:border-cyan-400/35"
            >
              {t("pgLoadRun")}
            </button>
            <Link
              href={`/optimizer?prompt=${encodeURIComponent(r.promptText)}`}
              className="rounded-lg border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/10"
            >
              {t("pgSendOptimizer")}
            </Link>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}
