"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import MermaidDiagram from "@/components/MermaidDiagram";
import type { JourneyPhaseContent } from "@/content/journey/types";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Lang } from "@/lib/i18n/messages";

function pick<T extends { en: string; ja: string }>(obj: T, lang: Lang): string {
  return lang === "ja" ? obj.ja : obj.en;
}

export default function JourneyPhaseView({ content }: { content: JourneyPhaseContent }) {
  const { lang } = useLang();
  const [stepIndex, setStepIndex] = useState(0);
  const [tourMode, setTourMode] = useState(false);

  const steps = content.steps;
  const currentStep = steps[stepIndex];

  const statusBadge = useMemo(() => {
    if (content.status === "complete") return "bg-emerald-500/15 text-emerald-800";
    if (content.status === "current") return "bg-sky-500/15 text-sky-800";
    return "bg-black/5 text-[var(--muted)]";
  }, [content.status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/journey" className="text-sm text-[var(--accent)] hover:underline">
            ← {lang === "ja" ? "構築ジャーニー" : "Build Journey"}
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{pick(content.title, lang)}</h1>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">{pick(content.subtitle, lang)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusBadge}`}>
          {content.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setTourMode(true);
            setStepIndex(0);
          }}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {lang === "ja" ? "プレゼン開始" : "Start presenter tour"}
        </button>
        {content.tryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white"
          >
            {pick(link.label, lang)} →
          </Link>
        ))}
      </div>

      {tourMode && currentStep && (
        <div className="animate-[fadeIn_0.25s_ease-out] rounded-2xl border-2 border-[var(--accent)] bg-white/80 p-6 shadow-lg">
          <div className="text-xs font-bold uppercase text-[var(--accent)]">
            {lang === "ja" ? "ステップ" : "Step"} {stepIndex + 1} / {steps.length}
          </div>
          <h2 className="mt-2 text-xl font-bold">{pick(currentStep.title, lang)}</h2>
          <p className="mt-2 text-[var(--muted)]">{pick(currentStep.body, lang)}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40"
            >
              {lang === "ja" ? "戻る" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (stepIndex >= steps.length - 1) setTourMode(false);
                else setStepIndex((i) => i + 1);
              }}
              className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
            >
              {stepIndex >= steps.length - 1
                ? lang === "ja"
                  ? "終了"
                  : "Finish"
                : lang === "ja"
                  ? "次へ"
                  : "Next"}
            </button>
            <button
              type="button"
              onClick={() => setTourMode(false)}
              className="ml-auto text-sm text-[var(--muted)] hover:underline"
            >
              {lang === "ja" ? "ツアーを閉じる" : "Close tour"}
            </button>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-bold uppercase text-[var(--muted)]">
          {lang === "ja" ? "成果物" : "Deliverables"}
        </h2>
        <ul className="mt-4 space-y-3">
          {content.deliverables.map((d) => (
            <li key={pick(d.label, lang)} className="flex flex-col gap-1 border-b border-[var(--border)] pb-3 last:border-0">
              <span className="font-semibold">{pick(d.label, lang)}</span>
              <span className="text-sm text-[var(--muted)]">{pick(d.detail, lang)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase text-[var(--muted)]">
          {lang === "ja" ? "アーキテクチャ" : "Architecture"}
        </h2>
        <MermaidDiagram chart={content.architectureMermaid} />
      </section>

      {content.flowMermaid && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase text-[var(--muted)]">
            {lang === "ja" ? "フロー" : "Workflow"}
          </h2>
          <MermaidDiagram chart={content.flowMermaid} />
        </section>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-white/50 p-6">
        <h2 className="text-sm font-bold uppercase text-[var(--muted)]">
          {lang === "ja" ? "タイムライン" : "Timeline"}
        </h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li
              key={i}
              className="animate-[fadeIn_0.3s_ease-out] rounded-lg border border-[var(--border)] bg-white/60 p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-xs font-bold text-[var(--accent)]">
                {lang === "ja" ? "ステップ" : "Step"} {i + 1}
              </div>
              <div className="mt-1 font-semibold">{pick(s.title, lang)}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{pick(s.body, lang)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
