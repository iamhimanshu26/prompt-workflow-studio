"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { PromptCategory } from "@prisma/client";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import { PROMPT_CATEGORIES } from "@/types";

type OptimizeResult = {
  original: string;
  optimized: string;
  improvements: string[];
  provider: string;
};

type SavedPrompt = {
  id: string;
  title: string;
  category: PromptCategory;
  body: string;
  bodyPreview: string;
  versionCount: number;
};

export default function OptimizerPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [roughPrompt, setRoughPrompt] = useState("");
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.GENERAL);
  const [optimizing, setOptimizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [promptId, setPromptId] = useState<string>("");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  const loadPrompts = useCallback(async () => {
    try {
      const res = await fetch("/api/prompts", { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") setSavedPrompts(json.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  function loadIntoEditor(p: SavedPrompt) {
    setPromptId(p.id);
    setCategory(p.category);
    setRoughPrompt(p.body);
    setResult(null);
    showToast(t("optimizerLoadedPrompt"), "info");
  }

  async function handleOptimize() {
    if (!roughPrompt.trim()) {
      showToast(t("optimizerEmptyRough"), "error");
      return;
    }
    setOptimizing(true);
    setResult(null);
    try {
      const res = await fetch("/api/prompts/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roughPrompt, category }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(
          typeof json.message === "string" ? json.message : t("optimizerRunError"),
          "error",
        );
        return;
      }
      setResult(json.data);
      showToast(t("optimizerRunSuccess"), "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("optimizerRunError"), "error");
    } finally {
      setOptimizing(false);
    }
  }

  async function handleSave() {
    if (!result?.optimized.trim()) {
      showToast(t("optimizerSaveNeedsOptimize"), "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/prompts/optimize/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimized: result.optimized,
          original: result.original,
          category,
          promptId: promptId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(t("optimizerSaveError"), "error");
        return;
      }
      showToast(
        promptId
          ? t("optimizerSaveVersionSuccess").replace("{n}", String(json.data.version))
          : t("optimizerSaveNewSuccess"),
        "success",
      );
      setPromptId(json.data.promptId);
      await loadPrompts();
    } catch {
      showToast(t("optimizerSaveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    if (!result?.optimized) return;
    try {
      await navigator.clipboard.writeText(result.optimized);
      showToast(t("playgroundCopySuccess"), "success");
    } catch {
      showToast(t("playgroundCopyError"), "error");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("optimizerTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("optimizerSubtitle")}</p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-semibold uppercase text-[var(--muted)]">
            {t("playgroundCategory")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PromptCategory)}
            className="mt-1 block rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-sm"
          >
            {PROMPT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {savedPrompts.length > 0 && (
          <div className="min-w-[12rem] flex-1">
            <label className="text-xs font-semibold uppercase text-[var(--muted)]">
              {t("optimizerAttachPrompt")}
            </label>
            <select
              value={promptId}
              onChange={(e) => {
                const id = e.target.value;
                setPromptId(id);
                if (!id) {
                  setResult(null);
                  return;
                }
                const p = savedPrompts.find((x) => x.id === id);
                if (p) loadIntoEditor(p);
              }}
              className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-sm"
            >
              <option value="">{t("optimizerNewPrompt")}</option>
              {savedPrompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (v{p.versionCount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
            {t("optimizerRoughLabel")}
          </h2>
          <textarea
            value={roughPrompt}
            onChange={(e) => setRoughPrompt(e.target.value)}
            placeholder={t("optimizerRoughPlaceholder")}
            rows={14}
            className="mt-3 w-full resize-y rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
          <button
            type="button"
            onClick={handleOptimize}
            disabled={optimizing}
            className="mt-4 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {optimizing ? t("optimizerRunning") : t("optimizerRun")}
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
            {t("optimizerImprovedLabel")}
          </h2>
          {result ? (
            <>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.improvements.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-[var(--muted)]">
                  {result.provider}
                </span>
              </div>
              <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-white/90 p-4 font-sans text-sm leading-relaxed">
                {result.optimized}
              </pre>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold hover:bg-white"
                >
                  {t("playgroundCopy")}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving
                    ? t("optimizerSaving")
                    : promptId
                      ? t("optimizerSaveVersion")
                      : t("optimizerSaveNew")}
                </button>
                <Link
                  href="/playground"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-white/80"
                >
                  {t("optimizerTryPlayground")} →
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">{t("optimizerNoResult")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
