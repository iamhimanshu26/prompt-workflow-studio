"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import StatusBadge from "@/components/enterprise/StatusBadge";
import CopyButton from "@/components/playground/CopyButton";
import { useLang } from "@/lib/i18n/LangProvider";
import { buildOptimizerUrl, buildPlaygroundUrl } from "@/lib/versions/handoff";
import { sourceLabelKey } from "@/lib/versions/source";
import type { PromptDetail, VersionRow } from "@/lib/versions/types";
import { PromptCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

export default function VersionTimeline({
  prompt,
  compareA,
  compareB,
  onCompareSelect,
  onRestore,
  onDuplicate,
  onView,
}: {
  prompt: PromptDetail;
  compareA: string | null;
  compareB: string | null;
  onCompareSelect: (versionId: string, slot: "a" | "b") => void;
  onRestore: (version: VersionRow) => void;
  onDuplicate: (version: VersionRow) => void;
  onView: (version: VersionRow) => void;
}) {
  const { t } = useLang();
  const category = prompt.category as PromptCategory;

  return (
    <div className="space-y-4">
      <GlowCard className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{prompt.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{prompt.category}</p>
          </div>
          <StatusBadge
            label={t(`verStatus_${prompt.status}`)}
            status={prompt.status === "optimized" ? "ok" : "warn"}
          />
        </div>
        <p className="mt-3 text-sm text-[var(--muted)] line-clamp-3">{prompt.body}</p>
      </GlowCard>

      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("verTimelineTitle")} ({prompt.versions.length})
      </p>

      <div className="relative space-y-0">
        <div
          className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-cyan-500/40 to-indigo-500/20"
          aria-hidden
        />
        {prompt.versions.map((v, i) => {
          const isLatest = i === 0;
          const isCompareA = compareA === v.id;
          const isCompareB = compareB === v.id;

          return (
            <div key={v.id} className="relative pl-8 pb-4">
              <div
                className={cn(
                  "absolute left-0 top-3 h-6 w-6 rounded-full border-2",
                  isLatest
                    ? "border-cyan-400 bg-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    : "border-indigo-500/40 bg-[var(--surface-muted)]",
                )}
              />
              <GlowCard
                glow={isLatest}
                className={cn("p-4", isCompareA || isCompareB ? "ring-1 ring-indigo-400/50" : "")}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-cyan-300">
                      v{v.version}
                    </span>
                    <span className="text-sm font-medium">{v.name}</span>
                    {isLatest && (
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-cyan-200">
                        {t("verLatest")}
                      </span>
                    )}
                  </div>
                  <StatusBadge
                    label={t(sourceLabelKey(v.source))}
                    status="neutral"
                  />
                </div>

                <time className="mt-1 block text-xs text-[var(--muted)]">
                  {new Date(v.createdAt).toLocaleString()} · {v.charCount} {t("pgChars")}
                </time>

                {v.notes && (
                  <p className="mt-2 text-xs italic text-[var(--muted)] line-clamp-2">{v.notes}</p>
                )}

                <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2 text-xs">
                  {v.body.slice(0, 400)}
                  {v.body.length > 400 ? "…" : ""}
                </pre>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(v)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold hover:border-cyan-400/35"
                  >
                    {t("verView")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCompareSelect(v.id, "a")}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[10px] font-semibold",
                      isCompareA
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
                        : "border-[var(--border)] hover:border-cyan-400/35",
                    )}
                  >
                    {t("verCompareA")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCompareSelect(v.id, "b")}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[10px] font-semibold",
                      isCompareB
                        ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
                        : "border-[var(--border)] hover:border-indigo-400/35",
                    )}
                  >
                    {t("verCompareB")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRestore(v)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold hover:border-amber-400/35"
                  >
                    {t("verRestore")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicate(v)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold hover:border-indigo-400/35"
                  >
                    {t("verDuplicate")}
                  </button>
                  <CopyButton text={v.body} />
                  <Link
                    href={buildPlaygroundUrl(v.body, category, prompt.title)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-cyan-400"
                  >
                    {t("verSendPlayground")}
                  </Link>
                  <Link
                    href={buildOptimizerUrl(v.body, category, prompt.title)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-indigo-400"
                  >
                    {t("verSendOptimizer")}
                  </Link>
                </div>
              </GlowCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
