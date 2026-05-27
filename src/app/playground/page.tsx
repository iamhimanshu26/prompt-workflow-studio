"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PromptCategory, AiModelId } from "@prisma/client";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import { PROMPT_CATEGORIES } from "@/types";

type RunResult = {
  runId: string;
  responseText: string;
  modelId: AiModelId;
  provider: string;
  tokenInput: number;
  tokenOutput: number;
  latencyMs: number;
};

type RecentRun = {
  id: string;
  createdAt: string;
  category: PromptCategory;
  modelId: AiModelId;
  promptTitle: string | null;
  promptText: string;
  responsePreview: string;
};

export default function PlaygroundPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.GENERAL);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [lastPromptId, setLastPromptId] = useState<string | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/prompts/runs", { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") setRecentRuns(json.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  async function handleRun() {
    if (!promptText.trim()) {
      showToast(t("playgroundEmptyPrompt"), "error");
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/prompts/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText,
          category,
          promptId: lastPromptId ?? undefined,
          modelId: AiModelId.GPT,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("playgroundRunError"), "error");
        return;
      }
      setResult(json.data);
      showToast(t("playgroundRunSuccess"), "success");
      loadRecent();
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("playgroundRunError"), "error");
    } finally {
      setRunning(false);
    }
  }

  async function handleSave() {
    if (!promptText.trim()) {
      showToast(t("playgroundEmptyPrompt"), "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: promptText, category }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(t("playgroundSaveError"), "error");
        return;
      }
      setLastPromptId(json.data.promptId);
      showToast(`${t("playgroundSaveSuccess")}: ${json.data.title}`, "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("playgroundSaveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    if (!result?.responseText) return;
    try {
      await navigator.clipboard.writeText(result.responseText);
      showToast(t("playgroundCopySuccess"), "success");
    } catch {
      showToast(t("playgroundCopyError"), "error");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("playgroundTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("playgroundSubtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <label className="block text-xs font-bold uppercase text-[var(--muted)]">
            {t("playgroundCategory")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PromptCategory)}
            className="w-full rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-sm"
          >
            {PROMPT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="block text-xs font-bold uppercase text-[var(--muted)]">
            {t("playgroundPromptLabel")}
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={10}
            placeholder={t("playgroundPromptPlaceholder")}
            className="w-full rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {running ? t("playgroundRunning") : t("playgroundRun")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {saving ? t("playgroundSaving") : t("playgroundSave")}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-[var(--muted)]">
              {t("playgroundResponse")}
            </h2>
            {result && (
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold hover:bg-white"
              >
                {t("playgroundCopy")}
              </button>
            )}
          </div>

          {!result ? (
            <p className="text-sm text-[var(--muted)]">{t("playgroundNoResponse")}</p>
          ) : (
            <>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-white/70 p-4 text-sm">
                {result.responseText}
              </pre>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                <span>
                  {t("playgroundProvider")}: {result.provider}
                </span>
                <span>
                  {t("playgroundTokens")}: {result.tokenInput} → {result.tokenOutput}
                </span>
                <span>
                  {t("playgroundLatency")}: {result.latencyMs}ms
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-white/50 p-5">
        <h2 className="text-sm font-bold uppercase text-[var(--muted)]">
          {t("playgroundRecentRuns")}
        </h2>
        {recentRuns.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">{t("recentRunsEmpty")}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recentRuns.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-[var(--border)] bg-white/60 px-3 py-2 text-sm"
              >
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>{r.category}</span>
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-1 font-medium line-clamp-1">
                  {r.promptTitle ?? r.promptText}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
