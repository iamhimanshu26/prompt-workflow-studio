"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { QualityIndicators } from "@/lib/optimizer/types";

export default function QualityIndicatorsPanel({
  indicators,
}: {
  indicators: QualityIndicators;
}) {
  const { t } = useLang();

  const rows: { key: keyof QualityIndicators; labelKey: string }[] = [
    { key: "clarity", labelKey: "optIndClarity" },
    { key: "specificity", labelKey: "optIndSpecificity" },
    { key: "structure", labelKey: "optIndStructure" },
    { key: "reusability", labelKey: "optIndReusability" },
    { key: "outputControl", labelKey: "optIndOutputControl" },
  ];

  return (
    <GlowCard glow={false} className="p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("optIndicatorsTitle")}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{t("optIndicatorsHint")}</p>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-[var(--muted)]">{t(r.labelKey)}</span>
              <span className="font-semibold text-cyan-300">{indicators[r.key]}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500/80 to-indigo-500/80 transition-all duration-500"
                style={{ width: `${indicators[r.key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
