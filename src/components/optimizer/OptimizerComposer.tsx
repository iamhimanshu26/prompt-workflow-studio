"use client";

import React from "react";
import { PromptCategory } from "@prisma/client";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import OptimizationSettings from "./OptimizationSettings";
import OptimizerTemplateChips from "./OptimizerTemplateChips";
import type { OptimizationGoal, OutputStyle, TargetAudience } from "@/lib/optimizer/types";
import { PROMPT_CATEGORIES } from "@/types";

export default function OptimizerComposer({
  title,
  onTitleChange,
  roughPrompt,
  onRoughPromptChange,
  category,
  onCategoryChange,
  goal,
  audience,
  style,
  onGoalChange,
  onAudienceChange,
  onStyleChange,
  onTemplateApply,
  optimizing,
  onOptimize,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  roughPrompt: string;
  onRoughPromptChange: (v: string) => void;
  category: PromptCategory;
  onCategoryChange: (v: PromptCategory) => void;
  goal: OptimizationGoal;
  audience: TargetAudience;
  style: OutputStyle;
  onGoalChange: (v: OptimizationGoal) => void;
  onAudienceChange: (v: TargetAudience) => void;
  onStyleChange: (v: OutputStyle) => void;
  onTemplateApply: (opts: {
    roughText?: string;
    goal?: OptimizationGoal;
    audience?: TargetAudience;
    style?: OutputStyle;
    append?: boolean;
  }) => void;
  optimizing: boolean;
  onOptimize: () => void;
}) {
  const { t } = useLang();

  return (
    <GlowCard className="space-y-4 p-5">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400">
        {t("optComposerTitle")}
      </p>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("optPromptTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t("optPromptTitlePlaceholder")}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("playgroundCategory")}
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as PromptCategory)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {PROMPT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <OptimizationSettings
        goal={goal}
        audience={audience}
        style={style}
        onGoalChange={onGoalChange}
        onAudienceChange={onAudienceChange}
        onStyleChange={onStyleChange}
        disabled={optimizing}
      />

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("optimizerRoughLabel")}
          </label>
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
            {roughPrompt.length} {t("pgChars")}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">{t("optRoughHelper")}</p>
        <textarea
          value={roughPrompt}
          onChange={(e) => onRoughPromptChange(e.target.value)}
          placeholder={t("optimizerRoughPlaceholder")}
          rows={12}
          className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-cyan-400/30"
        />
      </div>

      <OptimizerTemplateChips onApply={onTemplateApply} disabled={optimizing} />

      <button
        type="button"
        onClick={onOptimize}
        disabled={optimizing}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/10 transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
      >
        {optimizing ? t("optimizerRunning") : t("optRefinePrompt")}
      </button>
    </GlowCard>
  );
}
