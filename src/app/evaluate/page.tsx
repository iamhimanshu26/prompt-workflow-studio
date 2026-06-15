"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EvaluationModeType } from "@prisma/client";
import AiModeBanner from "@/components/AiModeBanner";
import EvaluationEmptyState from "@/components/evaluation/EvaluationEmptyState";
import EvaluationHistory from "@/components/evaluation/EvaluationHistory";
import EvaluationInputPanel from "@/components/evaluation/EvaluationInputPanel";
import EvaluationModeSelector from "@/components/evaluation/EvaluationModeSelector";
import EvaluationResultPanel from "@/components/evaluation/EvaluationResultPanel";
import EvaluationSkeleton from "@/components/evaluation/EvaluationSkeleton";
import StatusBadge from "@/components/enterprise/StatusBadge";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import type { EvaluationMode, EvaluationRecord } from "@/lib/evaluation/types";

type RunRow = {
  id: string;
  promptText: string;
  responseText: string;
  promptPreview: string;
  responsePreview: string;
  createdAt: string;
  modelId: string;
};

type PromptRow = {
  id: string;
  title: string;
  body: string;
  bodyPreview: string;
};

type VersionRow = {
  id: string;
  version: number;
  name: string;
  body: string;
  bodyPreview: string;
};

function EvaluatePageInner() {
  const { t } = useLang();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<EvaluationMode>("manual");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [evaluationType, setEvaluationType] = useState<EvaluationModeType>(
    EvaluationModeType.ALIGNMENT,
  );

  const [runs, setRuns] = useState<RunRow[]>([]);
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [history, setHistory] = useState<EvaluationRecord[]>([]);

  const [selectedRunId, setSelectedRunId] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");

  const [result, setResult] = useState<EvaluationRecord | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [runsRes, promptsRes, historyRes] = await Promise.all([
        fetch("/api/prompts/runs", { cache: "no-store" }),
        fetch("/api/prompts", { cache: "no-store" }),
        fetch("/api/evaluations", { cache: "no-store" }),
      ]);
      const [runsJson, promptsJson, historyJson] = await Promise.all([
        runsRes.json(),
        promptsRes.json(),
        historyRes.json(),
      ]);
      if (runsJson.status === "ok") setRuns(runsJson.data);
      if (promptsJson.status === "ok") setPrompts(promptsJson.data);
      if (historyJson.status === "ok") setHistory(historyJson.data);
    } catch {
      showToast(t("evalLoadError"), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  const loadVersions = useCallback(async (promptId: string) => {
    if (!promptId) {
      setVersions([]);
      return;
    }
    try {
      const res = await fetch(`/api/prompts/${promptId}`, { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") {
        setVersions(
          json.data.versions.map((v: { id: string; version: number; name: string; body: string }) => ({
            id: v.id,
            version: v.version,
            name: v.name,
            body: v.body,
            bodyPreview: v.body.length > 120 ? `${v.body.slice(0, 120)}…` : v.body,
          })),
        );
      }
    } catch {
      setVersions([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const qMode = searchParams.get("mode");
    if (qMode === "manual" || qMode === "prompt_run" || qMode === "saved_prompt" || qMode === "prompt_version") {
      setMode(qMode);
    }
    const qPrompt = searchParams.get("prompt");
    if (qPrompt) setPrompt(decodeURIComponent(qPrompt));
    const qOutput = searchParams.get("output");
    if (qOutput) setOutput(decodeURIComponent(qOutput));
    const qRun = searchParams.get("runId");
    if (qRun) {
      setSelectedRunId(qRun);
      setMode("prompt_run");
    }
    const qPromptId = searchParams.get("promptId");
    if (qPromptId) setSelectedPromptId(qPromptId);
    const qVersionId = searchParams.get("versionId");
    if (qVersionId) {
      setSelectedVersionId(qVersionId);
      setMode("prompt_version");
    }
    const qType = searchParams.get("type");
    if (qType && Object.values(EvaluationModeType).includes(qType as EvaluationModeType)) {
      setEvaluationType(qType as EvaluationModeType);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedPromptId) loadVersions(selectedPromptId);
  }, [selectedPromptId, loadVersions]);

  function handleRunSelect(id: string) {
    setSelectedRunId(id);
    const run = runs.find((r) => r.id === id);
    if (run) {
      setPrompt(run.promptText);
      setOutput(run.responseText);
    }
  }

  function handlePromptSelect(id: string) {
    setSelectedPromptId(id);
    setSelectedVersionId("");
    const p = prompts.find((x) => x.id === id);
    if (p) setPrompt(p.body);
  }

  function handleVersionSelect(id: string) {
    setSelectedVersionId(id);
    const v = versions.find((x) => x.id === id);
    if (v) setPrompt(v.body);
  }

  async function handleEvaluate(save = true) {
    if (!prompt.trim()) {
      showToast(t("evalEmptyPrompt"), "error");
      return;
    }
    setEvaluating(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluations/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt,
          output: output || undefined,
          expectedOutput: expectedOutput || undefined,
          successCriteria: successCriteria || undefined,
          evaluationType,
          promptId: selectedPromptId || undefined,
          promptRunId: selectedRunId || undefined,
          promptVersionId: selectedVersionId || undefined,
          save,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("evalRunError"), "error");
        return;
      }
      setResult(json.data.evaluation);
      showToast(t("evalRunSuccess"), "success");
      if (save) loadData();
    } catch {
      showToast(t("evalRunError"), "error");
    } finally {
      setEvaluating(false);
    }
  }

  async function handleSaveResult() {
    if (!result || result.id) return;
    setSaving(true);
    await handleEvaluate(true);
    setSaving(false);
  }

  function handleViewHistory(item: EvaluationRecord) {
    setResult(item);
    setPrompt(item.promptText ?? "");
    setOutput(item.responseText ?? "");
    setExpectedOutput(item.expectedOutput ?? "");
    setSuccessCriteria(item.successCriteria ?? "");
    setEvaluationType(item.evaluationType);
    setMode(
      item.sourceType === "PROMPT_RUN"
        ? "prompt_run"
        : item.sourceType === "SAVED_PROMPT"
          ? "saved_prompt"
          : item.sourceType === "PROMPT_VERSION"
            ? "prompt_version"
            : "manual",
    );
  }

  if (loading) return <EvaluationSkeleton />;

  return (
    <div className="space-y-8 pws-animate-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            PromptOps Quality Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{t("evalPageTitle")}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{t("evalPageSubtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={t("evalBadgeAiAssisted")} status="neutral" />
          <StatusBadge label={t("evalBadgePostgres")} status="ok" />
        </div>
      </div>

      <AiModeBanner />

      <EvaluationModeSelector mode={mode} onChange={setMode} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <EvaluationInputPanel
          mode={mode}
          prompt={prompt}
          output={output}
          expectedOutput={expectedOutput}
          successCriteria={successCriteria}
          evaluationType={evaluationType}
          selectedRunId={selectedRunId}
          selectedPromptId={selectedPromptId}
          selectedVersionId={selectedVersionId}
          runs={runs}
          prompts={prompts}
          versions={versions}
          evaluating={evaluating}
          onPromptChange={setPrompt}
          onOutputChange={setOutput}
          onExpectedOutputChange={setExpectedOutput}
          onSuccessCriteriaChange={setSuccessCriteria}
          onEvaluationTypeChange={setEvaluationType}
          onRunSelect={handleRunSelect}
          onPromptSelect={handlePromptSelect}
          onVersionSelect={handleVersionSelect}
          onEvaluate={() => handleEvaluate(true)}
        />

        {evaluating ? (
          <EvaluationSkeleton />
        ) : (
          <EvaluationResultPanel record={result} saving={saving} onSave={handleSaveResult} />
        )}
      </div>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("evalHistoryTitle")}
        </h2>
        {history.length === 0 ? (
          <EvaluationEmptyState
            title={t("evalEmptyHistoryTitle")}
            description={t("evalEmptyHistoryBody")}
          />
        ) : (
          <EvaluationHistory
            items={history}
            onView={handleViewHistory}
            onReEvaluate={(item) => {
              handleViewHistory(item);
              handleEvaluate(true);
            }}
          />
        )}
      </section>
    </div>
  );
}

export default function EvaluatePage() {
  return (
    <Suspense fallback={<EvaluationSkeleton />}>
      <EvaluatePageInner />
    </Suspense>
  );
}
