"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import type { OptimizationGoal, OutputStyle, TargetAudience } from "@/lib/optimizer/types";

const GOALS: OptimizationGoal[] = [
  "clarity",
  "structure",
  "conciseness",
  "detailed",
  "professional",
  "technical",
  "json",
  "interview",
  "marketing",
  "coding",
];

const AUDIENCES: TargetAudience[] = [
  "general",
  "developer",
  "recruiter",
  "sales",
  "product",
  "stakeholder",
  "reviewer",
];

const STYLES: OutputStyle[] = [
  "clean",
  "stepByStep",
  "roleBased",
  "jsonReady",
  "systemUser",
  "fewShot",
];

export default function OptimizationSettings({
  goal,
  audience,
  style,
  onGoalChange,
  onAudienceChange,
  onStyleChange,
  disabled,
}: {
  goal: OptimizationGoal;
  audience: TargetAudience;
  style: OutputStyle;
  onGoalChange: (v: OptimizationGoal) => void;
  onAudienceChange: (v: TargetAudience) => void;
  onStyleChange: (v: OutputStyle) => void;
  disabled?: boolean;
}) {
  const { t } = useLang();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("optGoalLabel")}
        </label>
        <select
          value={goal}
          disabled={disabled}
          onChange={(e) => onGoalChange(e.target.value as OptimizationGoal)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {t(`optGoal_${g}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("optAudienceLabel")}
        </label>
        <select
          value={audience}
          disabled={disabled}
          onChange={(e) => onAudienceChange(e.target.value as TargetAudience)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {AUDIENCES.map((a) => (
            <option key={a} value={a}>
              {t(`optAudience_${a}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("optStyleLabel")}
        </label>
        <select
          value={style}
          disabled={disabled}
          onChange={(e) => onStyleChange(e.target.value as OutputStyle)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {STYLES.map((s) => (
            <option key={s} value={s}>
              {t(`optStyle_${s}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
