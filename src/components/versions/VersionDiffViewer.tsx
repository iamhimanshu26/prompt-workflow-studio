"use client";

import React, { useMemo } from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import { computeDiffSummary, computeLineDiff } from "@/lib/versions/diff";
import type { VersionRow } from "@/lib/versions/types";
import { cn } from "@/lib/utils";

export default function VersionDiffViewer({
  versionA,
  versionB,
}: {
  versionA: VersionRow | null;
  versionB: VersionRow | null;
}) {
  const { t } = useLang();

  const diff = useMemo(() => {
    if (!versionA || !versionB) return null;
    return {
      lines: computeLineDiff(versionA.body, versionB.body),
      summary: computeDiffSummary(versionA.body, versionB.body),
    };
  }, [versionA, versionB]);

  if (!versionA || !versionB) {
    return (
      <GlowCard glow={false} className="border-dashed p-6 text-center">
        <p className="text-sm text-[var(--muted)]">{t("verDiffSelectHint")}</p>
      </GlowCard>
    );
  }

  if (!diff) return null;

  return (
    <div className="space-y-4">
      <GlowCard className="p-5">
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("verDiffTitle")}
        </p>
        <p className="mt-2 text-sm">
          <span className="text-cyan-300">v{versionA.version}</span>
          <span className="mx-2 text-[var(--muted)]">↔</span>
          <span className="text-indigo-300">v{versionB.version}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px]">
            {t("verLengthDelta")}: {diff.summary.lengthDelta > 0 ? "+" : ""}
            {diff.summary.lengthDelta}
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
            +{diff.summary.addedLines} {t("verLinesAdded")}
          </span>
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-200">
            -{diff.summary.removedLines} {t("verLinesRemoved")}
          </span>
          {diff.summary.addedStructure && (
            <span className="rounded-full border border-indigo-500/30 px-2 py-0.5 text-[10px] text-indigo-200">
              {t("optAddedStructure")}
            </span>
          )}
          {diff.summary.variablesAdded.length > 0 && (
            <span className="rounded-full border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-200">
              +{diff.summary.variablesAdded.map((v) => `{{${v}}}`).join(", ")}
            </span>
          )}
        </div>
      </GlowCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlowCard glow={false} className="p-4">
          <p className="text-xs font-semibold text-cyan-300">
            v{versionA.version} — {versionA.name}
          </p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
            {versionA.body}
          </pre>
        </GlowCard>
        <GlowCard glow={false} className="p-4">
          <p className="text-xs font-semibold text-indigo-300">
            v{versionB.version} — {versionB.name}
          </p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
            {versionB.body}
          </pre>
        </GlowCard>
      </div>

      <GlowCard glow={false} className="max-h-80 overflow-auto p-4">
        <p className="mb-2 text-xs font-semibold text-[var(--muted)]">{t("verInlineDiff")}</p>
        <div className="space-y-0.5 font-[family-name:var(--font-mono)] text-xs">
          {diff.lines.map((row, i) => (
            <div
              key={`${i}-${row.type}-${row.line.slice(0, 20)}`}
              className={cn(
                "rounded px-2 py-0.5",
                row.type === "add" && "bg-emerald-500/15 text-emerald-200",
                row.type === "remove" && "bg-red-500/15 text-red-200 line-through opacity-80",
                row.type === "same" && "text-[var(--muted)]",
              )}
            >
              {row.type === "add" ? "+ " : row.type === "remove" ? "- " : "  "}
              {row.line || " "}
            </div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}
