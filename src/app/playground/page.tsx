"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptCategory, AiModelId } from "@prisma/client";
import AiModeBanner from "@/components/AiModeBanner";
import OutputPanel from "@/components/playground/OutputPanel";
import PromptComposer from "@/components/playground/PromptComposer";
import RecentRunsPanel, { type RecentRunRow } from "@/components/playground/RecentRunsPanel";
import PlaygroundSkeleton from "@/components/playground/PlaygroundSkeleton";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import {
  detectVariables,
  replaceVariables,
} from "@/lib/playground/composePrompt";
import type { ProviderUiState } from "@/lib/playground/providerInfo";
import type {
  ExecutionOptions,
  OutputFormat,
  RunMetadata,
  Tone,
} from "@/lib/playground/types";

type RunApiData = {
  output?: string;
  responseText?: string;
  metadata?: RunMetadata;
  runId?: string;
};

function PlaygroundPageInner() {
  const { t } = useLang();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [systemInstruction, setSystemInstruction] = useState("");
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.GENERAL);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("plain");
  const [tone, setTone] = useState<Tone>("professional");
  const [modelId, setModelId] = useState<AiModelId>(AiModelId.GPT);
  const [executionOptions, setExecutionOptions] = useState<ExecutionOptions>({
    temperature: 0.7,
    responseLength: "medium",
    creativity: "balanced",
  });
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RunMetadata | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [lastPromptId, setLastPromptId] = useState<string | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentRunRow[]>([]);
  const [provider, setProvider] = useState<ProviderUiState | null>(null);
  const [runsLoading, setRunsLoading] = useState(true);

  const variables = useMemo(() => detectVariables(promptText), [promptText]);

  const resolvedPrompt = useMemo(
    () => replaceVariables(promptText, variableValues),
    [promptText, variableValues],
  );

  useEffect(() => {
    setVariableValues((prev) => {
      const next = { ...prev };
      for (const v of variables) {
        if (!(v in next)) next[v] = "";
      }
      for (const key of Object.keys(next)) {
        if (!variables.includes(key)) delete next[key];
      }
      return next;
    });
  }, [variables]);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/prompts/runs", { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") setRecentRuns(json.data);
    } catch {
      /* ignore */
    } finally {
      setRunsLoading(false);
    }
  }, []);

  const loadProvider = useCallback(async () => {
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const json = await res.json();
      setProvider({
        activeProvider: json.ai?.provider ?? "mock",
        usingMock: json.aiConfig?.usingMockFallback ?? true,
        openaiConfigured: json.aiConfig?.openaiKeyConfigured ?? false,
      });
    } catch {
      setProvider({ activeProvider: "mock", usingMock: true, openaiConfigured: false });
    }
  }, []);

  useEffect(() => {
    loadRecent();
    loadProvider();
  }, [loadRecent, loadProvider]);

  useEffect(() => {
    const fromOptimizer = searchParams.get("prompt");
    if (fromOptimizer) {
      setPromptText(decodeURIComponent(fromOptimizer));
      const cat = searchParams.get("category");
      if (cat && Object.values(PromptCategory).includes(cat as PromptCategory)) {
        setCategory(cat as PromptCategory);
      }
      const ttl = searchParams.get("title");
      if (ttl) setTitle(decodeURIComponent(ttl));
      showToast(t("playgroundLoadedFromOptimizer"), "info");
    }
  }, [searchParams, showToast, t]);

  async function handleRun(overridePrompt?: string) {
    const base = (overridePrompt ?? resolvedPrompt).trim();
    if (!base) {
      showToast(t("playgroundEmptyPrompt"), "error");
      return;
    }

    setRunning(true);
    setOutput(null);
    setMetadata(null);
    setRunError(null);

    try {
      const res = await fetch("/api/prompts/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText,
          resolvedPrompt: base,
          category,
          promptId: lastPromptId ?? undefined,
          title: title.trim() || undefined,
          modelId,
          systemInstruction: systemInstruction.trim() || undefined,
          outputFormat,
          tone,
          executionOptions,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        const msg =
          typeof json.message === "string"
            ? json.message
            : t("playgroundRunError");
        setRunError(msg);
        showToast(msg, "error");
        return;
      }

      const data = json.data as RunApiData;
      const text = data.output ?? data.responseText ?? "";
      setOutput(text);
      if (data.metadata) setMetadata(data.metadata);
      showToast(t("playgroundRunSuccess"), "success");
      loadRecent();
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("playgroundRunError");
      setRunError(msg);
      showToast(msg, "error");
    } finally {
      setRunning(false);
    }
  }

  async function handleSave() {
    const body = resolvedPrompt.trim();
    if (!body) {
      showToast(t("playgroundEmptyPrompt"), "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          category,
          title: title.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("playgroundSaveError"), "error");
        return;
      }
      setLastPromptId(json.data.promptId);
      if (!title.trim()) setTitle(json.data.title);
      showToast(`${t("playgroundSaveSuccess")}: ${json.data.title}`, "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("playgroundSaveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleLoadRun(run: RecentRunRow) {
    setPromptText(run.promptText);
    setCategory(run.category);
    showToast(t("pgLoadRunSuccess"), "info");
  }

  function handleRerun(run: RecentRunRow) {
    setPromptText(run.promptText);
    setCategory(run.category);
    void handleRun(run.promptText);
  }

  function handleTemplateSelect(text: string) {
    setPromptText(text);
  }

  function handleClearOutput() {
    setOutput(null);
    setMetadata(null);
    setRunError(null);
  }

  return (
    <div className="space-y-8 pws-animate-in">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Prompt Execution Studio
        </p>
        <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{t("pgStudioTitle")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{t("pgStudioSubtitle")}</p>
      </div>

      <AiModeBanner />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PromptComposer
          title={title}
          onTitleChange={setTitle}
          category={category}
          onCategoryChange={setCategory}
          systemInstruction={systemInstruction}
          onSystemInstructionChange={setSystemInstruction}
          promptText={promptText}
          onPromptTextChange={setPromptText}
          outputFormat={outputFormat}
          onOutputFormatChange={setOutputFormat}
          tone={tone}
          onToneChange={setTone}
          variables={variables}
          variableValues={variableValues}
          onVariableChange={(name, value) =>
            setVariableValues((prev) => ({ ...prev, [name]: value }))
          }
          onTemplateSelect={handleTemplateSelect}
          provider={provider}
          modelId={modelId}
          onModelChange={setModelId}
          executionOptions={executionOptions}
          onExecutionOptionsChange={setExecutionOptions}
          running={running}
          saving={saving}
          onRun={() => handleRun()}
          onSave={handleSave}
        />

        <OutputPanel
          output={output}
          metadata={metadata}
          resolvedPrompt={resolvedPrompt}
          running={running}
          error={runError}
          onClear={handleClearOutput}
          onSave={handleSave}
          saving={saving}
        />
      </div>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("playgroundRecentRuns")}
        </h2>
        {runsLoading ? (
          <PlaygroundSkeleton />
        ) : (
          <RecentRunsPanel runs={recentRuns} onLoad={handleLoadRun} onRerun={handleRerun} />
        )}
      </section>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundSkeleton />}>
      <PlaygroundPageInner />
    </Suspense>
  );
}
