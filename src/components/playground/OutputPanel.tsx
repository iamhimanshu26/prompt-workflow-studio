"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import { buildEvaluateUrl } from "@/lib/evaluation/handoff";
import CopyButton from "./CopyButton";
import ExecutionSummary from "./ExecutionSummary";
import PlaygroundSkeleton from "./PlaygroundSkeleton";
import type { RunMetadata } from "@/lib/playground/types";

export default function OutputPanel({
  output,
  metadata,
  resolvedPrompt,
  running,
  error,
  onClear,
  onSave,
  saving,
  runId,
}: {
  output: string | null;
  metadata: RunMetadata | null;
  resolvedPrompt: string;
  running: boolean;
  error: string | null;
  onClear: () => void;
  onSave: () => void;
  saving: boolean;
  runId?: string | null;
}) {
  const { t } = useLang();

  return (
    <GlowCard className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
          {t("pgOutputTitle")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {output && (
            <>
              <CopyButton text={output} />
              <CopyButton text={resolvedPrompt} label={t("pgCopyPrompt")} />
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-cyan-400/35 disabled:opacity-50"
              >
                {saving ? t("playgroundSaving") : t("playgroundSave")}
              </button>
              <Link
                href={buildEvaluateUrl({
                  mode: "prompt_run",
                  prompt: resolvedPrompt,
                  output: output,
                  runId: runId ?? undefined,
                })}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20"
              >
                {t("pgEvaluateOutput")}
              </Link>
              <Link
                href={`/optimizer?prompt=${encodeURIComponent(resolvedPrompt)}`}
                className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/20"
              >
                {t("pgSendOptimizer")}
              </Link>
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {t("pgClearOutput")}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 min-h-[280px] flex-1">
        {running && (
          <div className="space-y-3">
            <p className="font-[family-name:var(--font-mono)] text-xs text-cyan-300 pws-status-pulse">
              {t("pgExecuting")}
            </p>
            <PlaygroundSkeleton />
          </div>
        )}

        {!running && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!running && !error && !output && (
          <p className="text-sm text-[var(--muted)]">{t("playgroundNoResponse")}</p>
        )}

        {!running && output && (
          <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-relaxed">
            {output}
          </pre>
        )}
      </div>

      {metadata && !running && <ExecutionSummary metadata={metadata} />}
    </GlowCard>
  );
}
