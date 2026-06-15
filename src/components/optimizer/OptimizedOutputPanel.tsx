"use client";

import Link from "next/link";
import React, { useState } from "react";
import { PromptCategory } from "@prisma/client";
import GlowCard from "@/components/enterprise/GlowCard";
import CopyButton from "@/components/playground/CopyButton";
import { buildEvaluateUrl } from "@/lib/evaluation/handoff";
import { useLang } from "@/lib/i18n/LangProvider";
import type { OptimizeApiData } from "@/lib/optimizer/types";
import OptimizerSkeleton from "./OptimizerSkeleton";

export default function OptimizedOutputPanel({
  data,
  optimizedText,
  onOptimizedTextChange,
  optimizing,
  saving,
  hasAttachedPrompt,
  category,
  title,
  onSaveNew,
  onSaveVersion,
  onClear,
  error,
}: {
  data: OptimizeApiData | null;
  optimizedText: string;
  onOptimizedTextChange: (v: string) => void;
  optimizing: boolean;
  saving: boolean;
  hasAttachedPrompt: boolean;
  category: PromptCategory;
  title: string;
  onSaveNew: () => void;
  onSaveVersion: () => void;
  onClear: () => void;
  error: string | null;
}) {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);

  const playgroundHref = `/playground?prompt=${encodeURIComponent(optimizedText)}&category=${category}${title ? `&title=${encodeURIComponent(title)}` : ""}`;

  return (
    <GlowCard className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
          {t("optimizerImprovedLabel")}
        </p>
        {optimizedText && (
          <div className="flex flex-wrap gap-1.5">
            <CopyButton text={optimizedText} />
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-cyan-400/35"
            >
              {editing ? t("optDoneEdit") : t("optEdit")}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
            >
              {t("pgClearOutput")}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 min-h-[280px] flex-1">
        {optimizing && (
          <div className="space-y-3">
            <p className="font-[family-name:var(--font-mono)] text-xs text-indigo-300 pws-status-pulse">
              {t("optRefining")}
            </p>
            <OptimizerSkeleton />
          </div>
        )}

        {!optimizing && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!optimizing && !error && !optimizedText && (
          <p className="text-sm text-[var(--muted)]">{t("optimizerNoResult")}</p>
        )}

        {!optimizing && optimizedText && (
          <>
            {editing ? (
              <textarea
                value={optimizedText}
                onChange={(e) => onOptimizedTextChange(e.target.value)}
                rows={14}
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-relaxed"
              />
            ) : (
              <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-relaxed">
                {optimizedText}
              </pre>
            )}

            {data?.metadata && (
              <dl className="mt-4 grid gap-1.5 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--muted)]">{t("playgroundProvider")}</dt>
                  <dd className="font-medium">{data.metadata.provider}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("pgModelLabel")}</dt>
                  <dd className="font-medium">{data.metadata.model}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("optGoalLabel")}</dt>
                  <dd className="font-medium">{t(`optGoal_${data.metadata.optimizationGoal}`)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("optStyleLabel")}</dt>
                  <dd className="font-medium">{t(`optStyle_${data.metadata.outputStyle}`)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("optLengthBefore")}</dt>
                  <dd className="font-medium">{data.metadata.originalLength}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("optLengthAfter")}</dt>
                  <dd className="font-medium">{data.metadata.optimizedLength}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("playgroundLatency")}</dt>
                  <dd className="font-medium">{data.metadata.latencyMs}ms</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">{t("tableCreatedAt")}</dt>
                  <dd className="font-medium">
                    {new Date(data.metadata.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            )}
          </>
        )}
      </div>

      {optimizedText && !optimizing && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={hasAttachedPrompt ? onSaveVersion : onSaveNew}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {saving
              ? t("optimizerSaving")
              : hasAttachedPrompt
                ? t("optimizerSaveVersion")
                : t("optimizerSaveNew")}
          </button>
          {hasAttachedPrompt && (
            <button
              type="button"
              onClick={onSaveNew}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {t("optimizerSaveNew")}
            </button>
          )}
          <Link
            href={buildEvaluateUrl({
              mode: "manual",
              prompt: optimizedText,
              evaluationType: "PROMPT_QUALITY",
            })}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
          >
            {t("optEvaluatePrompt")} →
          </Link>
          <Link
            href={playgroundHref}
            className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 hover:bg-indigo-500/20"
          >
            {t("optimizerTryPlayground")} →
          </Link>
        </div>
      )}
    </GlowCard>
  );
}
