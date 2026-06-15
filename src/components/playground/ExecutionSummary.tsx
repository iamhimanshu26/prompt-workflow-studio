"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import type { RunMetadata } from "@/lib/playground/types";

export default function ExecutionSummary({ metadata }: { metadata: RunMetadata }) {
  const { t } = useLang();

  const rows: { label: string; value: string }[] = [
    { label: t("playgroundProvider"), value: metadata.provider },
    { label: t("pgModelLabel"), value: metadata.model },
    { label: t("playgroundCategory"), value: metadata.category },
    {
      label: t("tableCreatedAt"),
      value: new Date(metadata.createdAt).toLocaleString(),
    },
    { label: t("playgroundLatency"), value: `${metadata.latencyMs}ms` },
    { label: t("pgPromptLength"), value: String(metadata.promptLength) },
  ];

  if (metadata.outputFormat) {
    rows.push({ label: t("pgOutputFormat"), value: t(`pgFormat_${metadata.outputFormat}`) });
  }
  if (metadata.tone) {
    rows.push({ label: t("pgTone"), value: t(`pgTone_${metadata.tone}`) });
  }
  if (metadata.tokenInput != null) {
    rows.push({
      label: t("playgroundTokens"),
      value: `${metadata.tokenInput} → ${metadata.tokenOutput ?? 0}`,
    });
  }

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("pgExecutionSummary")}
      </p>
      <dl className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2 text-xs">
            <dt className="text-[var(--muted)]">{r.label}:</dt>
            <dd className="font-medium text-[var(--foreground)]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
