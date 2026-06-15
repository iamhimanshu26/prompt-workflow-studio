"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import StatusBadge from "@/components/enterprise/StatusBadge";
import CopyButton from "@/components/playground/CopyButton";
import { useLang } from "@/lib/i18n/LangProvider";
import { buildOptimizerUrl, buildPlaygroundUrl } from "@/lib/versions/handoff";
import { ratingLabelKey } from "@/lib/evaluation/rating";
import type { EvaluationRecord } from "@/lib/evaluation/types";
import { PromptCategory } from "@prisma/client";

export default function EvaluationHistory({
  items,
  onView,
  onReEvaluate,
}: {
  items: EvaluationRecord[];
  onView: (item: EvaluationRecord) => void;
  onReEvaluate: (item: EvaluationRecord) => void;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const ratingKey = ratingLabelKey(item.rating);
        const report = `${item.overallScore}/100 — ${item.summary}`;
        return (
          <GlowCard key={item.id} glow={false} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-cyan-300">
                    {item.overallScore}
                  </span>
                  <StatusBadge
                    label={t(ratingKey) !== ratingKey ? t(ratingKey) : item.rating}
                    status={item.overallScore >= 75 ? "ok" : "warn"}
                  />
                  <StatusBadge label={t(`evalSource_${item.sourceType}`)} status="neutral" />
                </div>
                <time className="mt-1 block text-xs text-[var(--muted)]">
                  {new Date(item.createdAt).toLocaleString()}
                </time>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold"
                >
                  {t("evalView")}
                </button>
                <button
                  type="button"
                  onClick={() => onReEvaluate(item)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold"
                >
                  {t("evalReRun")}
                </button>
                <CopyButton text={report} label={t("evalCopyReport")} />
                {item.promptText && (
                  <Link
                    href={buildOptimizerUrl(item.promptText, PromptCategory.GENERAL)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-indigo-300"
                  >
                    {t("evalSendOptimizer")}
                  </Link>
                )}
                {item.promptText && (
                  <Link
                    href={buildPlaygroundUrl(item.promptText, PromptCategory.GENERAL)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-cyan-300"
                  >
                    {t("evalSendPlayground")}
                  </Link>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{item.promptPreview}</p>
            {item.outputPreview && (
              <p className="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                {t("evalOutputLabel")}: {item.outputPreview}
              </p>
            )}
          </GlowCard>
        );
      })}
    </div>
  );
}
