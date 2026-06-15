"use client";

import React from "react";
import { PromptCategory } from "@prisma/client";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { OutputFormat, Tone } from "@/lib/playground/types";
import { PROMPT_CATEGORIES } from "@/types";
import ExecutionSettings from "./ExecutionSettings";
import PromptTemplateChips from "./PromptTemplateChips";
import VariableInspector from "./VariableInspector";
import type { ProviderUiState } from "@/lib/playground/providerInfo";
import type { AiModelId } from "@prisma/client";
import type { ExecutionOptions } from "@/lib/playground/types";

const OUTPUT_FORMATS: OutputFormat[] = [
  "plain",
  "bullets",
  "json",
  "markdown",
  "email",
  "technical",
];

const TONES: Tone[] = [
  "professional",
  "concise",
  "detailed",
  "friendly",
  "technical",
  "executive",
];

export default function PromptComposer({
  title,
  onTitleChange,
  category,
  onCategoryChange,
  systemInstruction,
  onSystemInstructionChange,
  promptText,
  onPromptTextChange,
  outputFormat,
  onOutputFormatChange,
  tone,
  onToneChange,
  variables,
  variableValues,
  onVariableChange,
  onTemplateSelect,
  provider,
  modelId,
  onModelChange,
  executionOptions,
  onExecutionOptionsChange,
  running,
  saving,
  onRun,
  onSave,
  disabled,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  category: PromptCategory;
  onCategoryChange: (v: PromptCategory) => void;
  systemInstruction: string;
  onSystemInstructionChange: (v: string) => void;
  promptText: string;
  onPromptTextChange: (v: string) => void;
  outputFormat: OutputFormat;
  onOutputFormatChange: (v: OutputFormat) => void;
  tone: Tone;
  onToneChange: (v: Tone) => void;
  variables: string[];
  variableValues: Record<string, string>;
  onVariableChange: (name: string, value: string) => void;
  onTemplateSelect: (text: string) => void;
  provider: ProviderUiState | null;
  modelId: AiModelId;
  onModelChange: (id: AiModelId) => void;
  executionOptions: ExecutionOptions;
  onExecutionOptionsChange: (opts: ExecutionOptions) => void;
  running: boolean;
  saving: boolean;
  onRun: () => void;
  onSave: () => void;
  disabled?: boolean;
}) {
  const { t } = useLang();
  const charCount = promptText.length;

  return (
    <GlowCard className="space-y-4 p-5">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400">
          {t("pgComposerTitle")}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("pgPromptTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t("pgPromptTitlePlaceholder")}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
        <div>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("pgOutputFormat")}
          </label>
          <select
            value={outputFormat}
            onChange={(e) => onOutputFormatChange(e.target.value as OutputFormat)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
          >
            {OUTPUT_FORMATS.map((f) => (
              <option key={f} value={f}>
                {t(`pgFormat_${f}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">{t("pgTone")}</label>
        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value as Tone)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {TONES.map((tn) => (
            <option key={tn} value={tn}>
              {t(`pgTone_${tn}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("pgSystemInstruction")}
        </label>
        <textarea
          value={systemInstruction}
          onChange={(e) => onSystemInstructionChange(e.target.value)}
          rows={3}
          placeholder={t("pgSystemPlaceholder")}
          className="mt-1 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("playgroundPromptLabel")}
          </label>
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
            {charCount} {t("pgChars")}
          </span>
        </div>
        <textarea
          value={promptText}
          onChange={(e) => onPromptTextChange(e.target.value)}
          rows={12}
          placeholder={t("playgroundPromptPlaceholder")}
          className="mt-1 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm leading-relaxed"
        />
      </div>

      <VariableInspector
        variables={variables}
        values={variableValues}
        onChange={onVariableChange}
      />

      <PromptTemplateChips onSelect={onTemplateSelect} disabled={disabled || running} />

      <ExecutionSettings
        provider={provider}
        modelId={modelId}
        onModelChange={onModelChange}
        options={executionOptions}
        onOptionsChange={onExecutionOptionsChange}
        disabled={disabled || running}
      />

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={onRun}
          disabled={running || disabled}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/10 transition hover:brightness-110 disabled:opacity-50"
        >
          {running ? t("pgExecuting") : t("pgExecute")}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || disabled}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold transition hover:border-cyan-400/35 disabled:opacity-50"
        >
          {saving ? t("playgroundSaving") : t("playgroundSave")}
        </button>
      </div>
    </GlowCard>
  );
}
