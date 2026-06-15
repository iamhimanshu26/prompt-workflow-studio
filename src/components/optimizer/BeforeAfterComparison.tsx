"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import { comparisonInsights } from "@/lib/optimizer/composeOptimize";

export default function BeforeAfterComparison({
  original,
  optimized,
}: {
  original: string;
  optimized: string;
}) {
  const { t } = useLang();
  const insights = comparisonInsights(original, optimized);

  return (
    <GlowCard className="p-5">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
        {t("optComparisonTitle")}
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <p className="text-xs font-semibold text-[var(--muted)]">{t("optOriginal")}</p>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-[var(--foreground)]">
            {original}
          </pre>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-xs font-semibold text-cyan-300">{t("optOptimized")}</p>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-[var(--foreground)]">
            {optimized}
          </pre>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px]">
          {t("optLengthDelta")}: {insights.lengthDelta > 0 ? "+" : ""}
          {insights.lengthDelta}
        </span>
        {insights.addedStructure && (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-200">
            {t("optAddedStructure")}
          </span>
        )}
        {insights.addedConstraints && (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-200">
            {t("optAddedConstraints")}
          </span>
        )}
        {insights.addedOutputInstructions && (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-200">
            {t("optAddedOutput")}
          </span>
        )}
        {insights.variables.length > 0 && (
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200">
            {t("optVariables")}: {insights.variables.map((v) => `{{${v}}}`).join(", ")}
          </span>
        )}
      </div>
    </GlowCard>
  );
}
