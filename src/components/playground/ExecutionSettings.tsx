"use client";

import React from "react";
import { AiModelId } from "@prisma/client";
import { useLang } from "@/lib/i18n/LangProvider";
import { MODEL_OPTIONS, type ProviderUiState } from "@/lib/playground/providerInfo";
import type { Creativity, ExecutionOptions, ResponseLength } from "@/lib/playground/types";
import StatusBadge from "@/components/enterprise/StatusBadge";

export default function ExecutionSettings({
  provider,
  modelId,
  onModelChange,
  options,
  onOptionsChange,
  disabled,
}: {
  provider: ProviderUiState | null;
  modelId: AiModelId;
  onModelChange: (id: AiModelId) => void;
  options: ExecutionOptions;
  onOptionsChange: (opts: ExecutionOptions) => void;
  disabled?: boolean;
}) {
  const { t } = useLang();

  const providerLabel = provider
    ? provider.activeProvider === "openai"
      ? t("pgProviderOpenai")
      : t("pgProviderMock")
    : "…";

  const providerStatus =
    provider?.activeProvider === "openai" ? "ok" : provider ? "warn" : "neutral";

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("pgExecutionSettings")}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--muted)]">{t("pgProviderLabel")}</span>
        <StatusBadge label={providerLabel} status={providerStatus} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">{t("pgModelLabel")}</label>
        <select
          value={modelId}
          onChange={(e) => onModelChange(e.target.value as AiModelId)}
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
        >
          {MODEL_OPTIONS.map((m) => (
            <option key={m.id} value={m.id} disabled={!m.available}>
              {m.label}
              {m.planned ? ` (${t("statusPlanned")})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          {t("pgTemperature")}: {options.temperature?.toFixed(1) ?? "0.7"}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={options.temperature ?? 0.7}
          disabled={disabled}
          onChange={(e) =>
            onOptionsChange({ ...options, temperature: Number(e.target.value) })
          }
          className="mt-1 w-full accent-cyan-400"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("pgResponseLength")}
          </label>
          <select
            value={options.responseLength ?? "medium"}
            disabled={disabled}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                responseLength: e.target.value as ResponseLength,
              })
            }
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
          >
            <option value="short">{t("pgLengthShort")}</option>
            <option value="medium">{t("pgLengthMedium")}</option>
            <option value="long">{t("pgLengthLong")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            {t("pgCreativity")}
          </label>
          <select
            value={options.creativity ?? "balanced"}
            disabled={disabled}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                creativity: e.target.value as Creativity,
              })
            }
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
          >
            <option value="low">{t("pgCreativityLow")}</option>
            <option value="balanced">{t("pgCreativityBalanced")}</option>
            <option value="high">{t("pgCreativityHigh")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
