"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import { OPTIMIZER_TEMPLATES } from "@/lib/optimizer/templates";
import type { OptimizationGoal, OutputStyle, TargetAudience } from "@/lib/optimizer/types";

export default function OptimizerTemplateChips({
  onApply,
  disabled,
}: {
  onApply: (opts: {
    roughText?: string;
    goal?: OptimizationGoal;
    audience?: TargetAudience;
    style?: OutputStyle;
    append?: boolean;
  }) => void;
  disabled?: boolean;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-2">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("optTemplatesTitle")}
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIMIZER_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            disabled={disabled}
            onClick={() =>
              onApply({
                roughText: tpl.roughText,
                goal: tpl.goal,
                audience: tpl.audience,
                style: tpl.style,
                append: tpl.id === "concise" || tpl.id === "format",
              })
            }
            className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium transition hover:border-indigo-400/35 hover:bg-indigo-500/10 disabled:opacity-50"
          >
            {t(tpl.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
