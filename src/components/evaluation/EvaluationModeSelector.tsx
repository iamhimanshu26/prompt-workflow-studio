"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { EvaluationMode } from "@/lib/evaluation/types";
import { cn } from "@/lib/utils";

const MODES: EvaluationMode[] = ["manual", "prompt_run", "saved_prompt", "prompt_version"];

export default function EvaluationModeSelector({
  mode,
  onChange,
}: {
  mode: EvaluationMode;
  onChange: (mode: EvaluationMode) => void;
}) {
  const { t } = useLang();

  return (
    <GlowCard className="p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-cyan-400">
        {t("evalModeTitle")}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-sm transition pws-hover-glow",
              mode === m
                ? "border-cyan-500/40 bg-cyan-500/10"
                : "border-[var(--border)] bg-[var(--surface-muted)]",
            )}
          >
            <span className="font-semibold">{t(`evalMode_${m}`)}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t(`evalModeDesc_${m}`)}</span>
          </button>
        ))}
      </div>
    </GlowCard>
  );
}
