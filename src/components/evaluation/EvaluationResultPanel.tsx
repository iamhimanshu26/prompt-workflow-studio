"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import StatusBadge from "@/components/enterprise/StatusBadge";
import CopyButton from "@/components/playground/CopyButton";
import { useLang } from "@/lib/i18n/LangProvider";
import { buildOptimizerUrl, buildPlaygroundUrl } from "@/lib/versions/handoff";
import { ratingLabelKey } from "@/lib/evaluation/rating";
import type { EvaluationRecord } from "@/lib/evaluation/types";
import { PromptCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

const SCORE_KEYS = [
  "clarity",
  "specificity",
  "structure",
  "outputControl",
  "reusability",
  "reliability",
  "hallucinationRisk",
  "productionReadiness",
] as const;

function scoreStatus(key: string, value: number): "ok" | "warn" | "error" | "neutral" {
  if (key === "hallucinationRisk") {
    if (value <= 20) return "ok";
    if (value <= 40) return "warn";
    return "error";
  }
  if (value >= 80) return "ok";
  if (value >= 60) return "warn";
  return "error";
}

export default function EvaluationResultPanel({
  record,
  saving,
  onSave,
}: {
  record: EvaluationRecord | null;
  saving?: boolean;
  onSave?: () => void;
}) {
  const { t } = useLang();

  const reportText = useMemo(() => {
    if (!record) return "";
    const lines = [
      `Overall: ${record.overallScore}/100 (${record.rating})`,
      record.summary,
      "",
      "Scores:",
      ...SCORE_KEYS.map((k) => `- ${t(`evalScore_${k}`)}: ${record.scores[k]}`),
      "",
      "Strengths:",
      ...record.strengths.map((s) => `- ${s}`),
      "",
      "Weaknesses / Risks:",
      ...record.weaknesses.map((s) => `- ${s}`),
      "",
      "Recommendations:",
      ...record.recommendations.map((s) => `- ${s}`),
    ];
    return lines.join("\n");
  }, [record, t]);

  if (!record) {
    return (
      <GlowCard glow={false} className="border-dashed p-6 text-center">
        <p className="text-sm text-[var(--muted)]">{t("evalResultHint")}</p>
      </GlowCard>
    );
  }

  const ratingKey = ratingLabelKey(record.rating);
  const promptForHandoff = record.suggestedPrompt ?? record.promptText ?? "";

  return (
    <div className="space-y-4">
      <GlowCard className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {t("evalOverallTitle")}
            </p>
            <p className="mt-2 text-5xl font-bold text-cyan-300">{record.overallScore}</p>
            <p className="text-sm text-[var(--muted)]">/ 100</p>
          </div>
          <StatusBadge
            label={t(ratingKey) !== ratingKey ? t(ratingKey) : record.rating}
            status={
              record.overallScore >= 80 ? "ok" : record.overallScore >= 60 ? "warn" : "error"
            }
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed">{record.summary}</p>
        <p className="mt-2 text-[10px] text-[var(--muted)]">{t("evalAiDisclaimer")}</p>
      </GlowCard>

      <GlowCard className="p-5">
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-indigo-300">
          {t("evalBreakdownTitle")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SCORE_KEYS.map((key) => {
            const value = record.scores[key];
            return (
              <div key={key} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold">{t(`evalScore_${key}`)}</span>
                  <span
                    className={cn(
                      key === "hallucinationRisk"
                        ? value <= 25
                          ? "text-emerald-300"
                          : value <= 45
                            ? "text-amber-300"
                            : "text-red-300"
                        : value >= 75
                          ? "text-cyan-300"
                          : "text-[var(--muted)]",
                    )}
                  >
                    {value}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      scoreStatus(key, value) === "ok" && "bg-cyan-400",
                      scoreStatus(key, value) === "warn" && "bg-amber-400",
                      scoreStatus(key, value) === "error" && "bg-red-400",
                    )}
                    style={{ width: `${Math.min(100, value)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlowCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlowCard glow={false} className="p-4">
          <p className="text-xs font-bold text-emerald-300">{t("evalStrengthsTitle")}</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {record.strengths.length ? record.strengths.map((s) => <li key={s}>• {s}</li>) : <li>—</li>}
          </ul>
        </GlowCard>
        <GlowCard glow={false} className="p-4">
          <p className="text-xs font-bold text-amber-300">{t("evalWeaknessesTitle")}</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {record.weaknesses.length ? record.weaknesses.map((s) => <li key={s}>• {s}</li>) : <li>—</li>}
          </ul>
        </GlowCard>
        <GlowCard glow={false} className="p-4">
          <p className="text-xs font-bold text-indigo-300">{t("evalRecommendationsTitle")}</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {record.recommendations.length ? (
              record.recommendations.map((s) => <li key={s}>• {s}</li>)
            ) : (
              <li>—</li>
            )}
          </ul>
        </GlowCard>
      </div>

      {record.suggestedPrompt && (
        <GlowCard className="p-4">
          <p className="text-xs font-bold text-cyan-300">{t("evalSuggestedPromptTitle")}</p>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs">{record.suggestedPrompt}</pre>
        </GlowCard>
      )}

      <div className="flex flex-wrap gap-2">
        {onSave && !record.id && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {saving ? t("evalSaving") : t("evalSave")}
          </button>
        )}
        <CopyButton text={reportText} label={t("evalCopyReport")} />
        {promptForHandoff && (
          <>
            <Link
              href={buildOptimizerUrl(promptForHandoff, PromptCategory.GENERAL)}
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200"
            >
              {t("evalSendOptimizer")}
            </Link>
            <Link
              href={buildPlaygroundUrl(promptForHandoff, PromptCategory.GENERAL)}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200"
            >
              {t("evalSendPlayground")}
            </Link>
          </>
        )}
        {record.promptId && (
          <Link
            href={`/versions`}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            {t("evalViewVersions")}
          </Link>
        )}
      </div>
    </div>
  );
}
