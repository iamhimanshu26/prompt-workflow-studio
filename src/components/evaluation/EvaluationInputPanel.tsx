"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { EvaluationMode } from "@/lib/evaluation/types";
import type { EvaluationModeType } from "@prisma/client";

type RunOption = {
  id: string;
  promptPreview: string;
  responsePreview: string;
  createdAt: string;
  modelId: string;
};

type PromptOption = {
  id: string;
  title: string;
  bodyPreview: string;
};

type VersionOption = {
  id: string;
  version: number;
  name: string;
  bodyPreview: string;
};

const EVAL_TYPES: EvaluationModeType[] = [
  "PROMPT_QUALITY",
  "OUTPUT_QUALITY",
  "ALIGNMENT",
  "PRODUCTION_READINESS",
  "RISK_REVIEW",
];

export default function EvaluationInputPanel({
  mode,
  prompt,
  output,
  expectedOutput,
  successCriteria,
  evaluationType,
  selectedRunId,
  selectedPromptId,
  selectedVersionId,
  runs,
  prompts,
  versions,
  evaluating,
  onPromptChange,
  onOutputChange,
  onExpectedOutputChange,
  onSuccessCriteriaChange,
  onEvaluationTypeChange,
  onRunSelect,
  onPromptSelect,
  onVersionSelect,
  onEvaluate,
}: {
  mode: EvaluationMode;
  prompt: string;
  output: string;
  expectedOutput: string;
  successCriteria: string;
  evaluationType: EvaluationModeType;
  selectedRunId: string;
  selectedPromptId: string;
  selectedVersionId: string;
  runs: RunOption[];
  prompts: PromptOption[];
  versions: VersionOption[];
  evaluating: boolean;
  onPromptChange: (v: string) => void;
  onOutputChange: (v: string) => void;
  onExpectedOutputChange: (v: string) => void;
  onSuccessCriteriaChange: (v: string) => void;
  onEvaluationTypeChange: (v: EvaluationModeType) => void;
  onRunSelect: (id: string) => void;
  onPromptSelect: (id: string) => void;
  onVersionSelect: (id: string) => void;
  onEvaluate: () => void;
}) {
  const { t } = useLang();

  return (
    <GlowCard className="flex flex-col p-5">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-indigo-300">
        {t("evalInputTitle")}
      </p>

      <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">
        {t("evalTypeLabel")}
        <select
          value={evaluationType}
          onChange={(e) => onEvaluationTypeChange(e.target.value as EvaluationModeType)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {EVAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`evalType_${type}`)}
            </option>
          ))}
        </select>
      </label>

      {mode === "prompt_run" && (
        <label className="mt-3 block text-xs font-semibold text-[var(--muted)]">
          {t("evalRecentRunLabel")}
          <select
            value={selectedRunId}
            onChange={(e) => onRunSelect(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
          >
            <option value="">{t("evalSelectRun")}</option>
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {new Date(r.createdAt).toLocaleString()} — {r.promptPreview.slice(0, 60)}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === "saved_prompt" && (
        <label className="mt-3 block text-xs font-semibold text-[var(--muted)]">
          {t("evalSavedPromptLabel")}
          <select
            value={selectedPromptId}
            onChange={(e) => onPromptSelect(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
          >
            <option value="">{t("evalSelectPrompt")}</option>
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === "prompt_version" && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("evalSavedPromptLabel")}
            <select
              value={selectedPromptId}
              onChange={(e) => onPromptSelect(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
            >
              <option value="">{t("evalSelectPrompt")}</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("evalVersionLabel")}
            <select
              value={selectedVersionId}
              onChange={(e) => onVersionSelect(e.target.value)}
              disabled={!selectedPromptId}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="">{t("evalSelectVersion")}</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.version} — {v.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">
        {t("evalPromptLabel")}
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={8}
          className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm leading-relaxed"
          placeholder={t("evalPromptPlaceholder")}
        />
      </label>

      {evaluationType !== "PROMPT_QUALITY" && (
        <label className="mt-3 block text-xs font-semibold text-[var(--muted)]">
          {t("evalOutputLabel")}
          <textarea
            value={output}
            onChange={(e) => onOutputChange(e.target.value)}
            rows={6}
            className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm leading-relaxed"
            placeholder={t("evalOutputPlaceholder")}
          />
        </label>
      )}

      <label className="mt-3 block text-xs font-semibold text-[var(--muted)]">
        {t("evalExpectedLabel")}
        <textarea
          value={expectedOutput}
          onChange={(e) => onExpectedOutputChange(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm"
          placeholder={t("evalExpectedPlaceholder")}
        />
      </label>

      <label className="mt-3 block text-xs font-semibold text-[var(--muted)]">
        {t("evalCriteriaLabel")}
        <textarea
          value={successCriteria}
          onChange={(e) => onSuccessCriteriaChange(e.target.value)}
          rows={2}
          className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm"
          placeholder={t("evalCriteriaPlaceholder")}
        />
      </label>

      <button
        type="button"
        onClick={onEvaluate}
        disabled={evaluating || !prompt.trim()}
        className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        {evaluating ? t("evalRunning") : t("evalRunCta")}
      </button>

      <p className="mt-3 text-[10px] text-[var(--muted)]">{t("evalAiDisclaimer")}</p>
    </GlowCard>
  );
}
