"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptCategory } from "@prisma/client";
import AiModeBanner from "@/components/AiModeBanner";
import BeforeAfterComparison from "@/components/optimizer/BeforeAfterComparison";
import ExistingPromptSelector from "@/components/optimizer/ExistingPromptSelector";
import ImprovementSummary from "@/components/optimizer/ImprovementSummary";
import OptimizedOutputPanel from "@/components/optimizer/OptimizedOutputPanel";
import OptimizerComposer from "@/components/optimizer/OptimizerComposer";
import OptimizerSkeleton from "@/components/optimizer/OptimizerSkeleton";
import QualityIndicatorsPanel from "@/components/optimizer/QualityIndicators";
import SavedPromptsPanel from "@/components/optimizer/SavedPromptsPanel";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import { clearQuotaExceeded, markQuotaExceeded } from "@/lib/ai/quotaSession";
import type {
  OptimizationGoal,
  OptimizeApiData,
  OutputStyle,
  TargetAudience,
} from "@/lib/optimizer/types";

type SavedPrompt = {
  id: string;
  title: string;
  category: PromptCategory;
  body: string;
  bodyPreview: string;
  versionCount: number;
  updatedAt: string;
};

type LibraryPrompt = {
  id: string;
  title: string;
  category: PromptCategory;
  body: string;
  updatedAt: string;
  versions: {
    id: string;
    version: number;
    name: string;
    body: string;
    notes: string | null;
    createdAt: string;
  }[];
};

export default function OptimizerPage() {
  return (
    <Suspense fallback={<OptimizerSkeleton />}>
      <OptimizerPageInner />
    </Suspense>
  );
}

function OptimizerPageInner() {
  const { t } = useLang();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [roughPrompt, setRoughPrompt] = useState("");
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.GENERAL);
  const [goal, setGoal] = useState<OptimizationGoal>("clarity");
  const [audience, setAudience] = useState<TargetAudience>("general");
  const [style, setStyle] = useState<OutputStyle>("clean");

  const [optimizing, setOptimizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [optimizeData, setOptimizeData] = useState<OptimizeApiData | null>(null);
  const [optimizedText, setOptimizedText] = useState("");
  const [optimizeError, setOptimizeError] = useState<string | null>(null);

  const [promptId, setPromptId] = useState("");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [library, setLibrary] = useState<LibraryPrompt[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const libraryRef = useRef<HTMLDivElement>(null);

  const loadLibrary = useCallback(async () => {
    try {
      const res = await fetch("/api/prompts/library", { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") setLibrary(json.data);
    } catch {
      /* ignore */
    }
  }, []);

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
    loadLibrary();
  }, [loadPrompts, loadLibrary]);

  useEffect(() => {
    const fromPlayground = searchParams.get("prompt");
    if (fromPlayground) {
      setRoughPrompt(decodeURIComponent(fromPlayground));
      setOptimizeData(null);
      setOptimizedText("");
      const cat = searchParams.get("category");
      if (cat && Object.values(PromptCategory).includes(cat as PromptCategory)) {
        setCategory(cat as PromptCategory);
      }
      const ttl = searchParams.get("title");
      if (ttl) setTitle(decodeURIComponent(ttl));
      showToast(t("optimizerLoadedFromPlayground"), "info");
    }
  }, [searchParams, showToast, t]);

  function loadIntoEditor(p: SavedPrompt) {
    setPromptId(p.id);
    setCategory(p.category);
    setRoughPrompt(p.body);
    setTitle(p.title);
    setOptimizeData(null);
    setOptimizedText("");
    showToast(t("optimizerLoadedPrompt"), "info");
  }

  function handlePromptSelect(id: string) {
    setPromptId(id);
    if (!id) {
      setOptimizeData(null);
      setOptimizedText("");
      return;
    }
    const p = savedPrompts.find((x) => x.id === id);
    if (p) loadIntoEditor(p);
  }

  function handleTemplateApply(opts: {
    roughText?: string;
    goal?: OptimizationGoal;
    audience?: TargetAudience;
    style?: OutputStyle;
    append?: boolean;
  }) {
    if (opts.goal) setGoal(opts.goal);
    if (opts.audience) setAudience(opts.audience);
    if (opts.style) setStyle(opts.style);
    if (opts.roughText) {
      if (opts.append && roughPrompt.trim()) {
        setRoughPrompt(`${roughPrompt.trim()}\n\n${opts.roughText}`);
      } else {
        setRoughPrompt(opts.roughText);
      }
    }
  }

  async function handleOptimize() {
    if (!roughPrompt.trim()) {
      showToast(t("optimizerEmptyRough"), "error");
      return;
    }
    setOptimizing(true);
    setOptimizeData(null);
    setOptimizedText("");
    setOptimizeError(null);

    try {
      const res = await fetch("/api/prompts/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roughPrompt,
          title: title.trim() || undefined,
          category,
          optimizationGoal: goal,
          targetAudience: audience,
          outputStyle: style,
          attachedPromptId: promptId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        const msg =
          typeof json.message === "string" ? json.message : t("optimizerRunError");
        if (json.errorKind === "quota") markQuotaExceeded();
        setOptimizeError(msg);
        showToast(msg, "error");
        return;
      }

      clearQuotaExceeded();
      const data = json.data as OptimizeApiData;
      setOptimizeData(data);
      setOptimizedText(data.optimizedPrompt);
      showToast(t("optimizerRunSuccess"), "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("optimizerRunError");
      setOptimizeError(msg);
      showToast(msg, "error");
    } finally {
      setOptimizing(false);
    }
  }

  async function handleSave(asNew: boolean) {
    const body = optimizedText.trim();
    if (!body) {
      showToast(t("optimizerSaveNeedsOptimize"), "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/prompts/optimize/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimized: body,
          original: roughPrompt,
          category,
          title: title.trim() || undefined,
          promptId: asNew ? undefined : promptId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        const msg = json.message === "Prompt not found"
          ? t("optPromptNotFound")
          : t("optimizerSaveError");
        showToast(msg, "error");
        return;
      }
      showToast(
        !asNew && promptId
          ? t("optimizerSaveVersionSuccess").replace("{n}", String(json.data.version))
          : t("optimizerSaveNewSuccess"),
        "success",
      );
      const id = json.data.promptId as string;
      setPromptId(id);
      setHighlightId(id);
      await loadPrompts();
      await loadLibrary();
      libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      showToast(t("optimizerSaveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 pws-animate-in">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          Prompt Refinement Studio
        </p>
        <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{t("optStudioTitle")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{t("optStudioSubtitle")}</p>
      </div>

      <AiModeBanner />

      <ExistingPromptSelector
        prompts={savedPrompts}
        selectedId={promptId}
        onSelect={handlePromptSelect}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <OptimizerComposer
          title={title}
          onTitleChange={setTitle}
          roughPrompt={roughPrompt}
          onRoughPromptChange={setRoughPrompt}
          category={category}
          onCategoryChange={setCategory}
          goal={goal}
          audience={audience}
          style={style}
          onGoalChange={setGoal}
          onAudienceChange={setAudience}
          onStyleChange={setStyle}
          onTemplateApply={handleTemplateApply}
          optimizing={optimizing}
          onOptimize={handleOptimize}
        />

        <OptimizedOutputPanel
          data={optimizeData}
          optimizedText={optimizedText}
          onOptimizedTextChange={setOptimizedText}
          optimizing={optimizing}
          saving={saving}
          hasAttachedPrompt={Boolean(promptId)}
          category={category}
          title={title}
          onSaveNew={() => handleSave(true)}
          onSaveVersion={() => handleSave(false)}
          onClear={() => {
            setOptimizedText("");
            setOptimizeData(null);
            setOptimizeError(null);
          }}
          error={optimizeError}
        />
      </div>

      {optimizeData && optimizedText && !optimizing && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ImprovementSummary improvements={optimizeData.improvements} />
          <QualityIndicatorsPanel indicators={optimizeData.indicators} />
        </div>
      )}

      {optimizeData && optimizedText && !optimizing && (
        <BeforeAfterComparison original={roughPrompt} optimized={optimizedText} />
      )}

      <div ref={libraryRef}>
        <SavedPromptsPanel library={library} highlightId={highlightId} />
      </div>
    </div>
  );
}
