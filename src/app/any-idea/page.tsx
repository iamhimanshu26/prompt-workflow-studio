"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";

type IdeaItem = {
  id: string;
  roughNotes: string;
  refinedNotes: string | null;
  isRefined: boolean;
  createdAt: string;
};

export default function AnyIdeaPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [roughNotes, setRoughNotes] = useState("");
  const [refinedPreview, setRefinedPreview] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);

  const loadIdeas = useCallback(async () => {
    try {
      const res = await fetch("/api/ideas", { cache: "no-store" });
      const json = await res.json();
      if (json.status === "ok") setIdeas(json.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  async function handleSave() {
    if (!roughNotes.trim()) {
      showToast(t("anyIdeaEmpty"), "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roughNotes }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(t("anyIdeaSaveError"), "error");
        return;
      }
      showToast(t("anyIdeaSaveSuccess"), "success");
      setRoughNotes("");
      setRefinedPreview(null);
      await loadIdeas();
    } catch {
      showToast(t("anyIdeaSaveError"), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine() {
    if (!roughNotes.trim()) {
      showToast(t("anyIdeaEmpty"), "error");
      return;
    }
    setRefining(true);
    try {
      const res = await fetch("/api/ideas/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roughNotes }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(t("anyIdeaRefineError"), "error");
        return;
      }
      setRefinedPreview(json.data.refinedNotes ?? null);
      showToast(t("anyIdeaRefineSuccess"), "success");
      setRoughNotes("");
      await loadIdeas();
    } catch {
      showToast(t("anyIdeaRefineError"), "error");
    } finally {
      setRefining(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--idea-accent)]">
          {t("anyIdeaTitle")}
        </h1>
        <p className="mt-3 text-[var(--muted)]">{t("anyIdeaSubtitle")}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <label className="text-sm font-medium text-[var(--muted)]" htmlFor="idea-input">
          {t("anyIdeaLabel")}
        </label>
        <textarea
          id="idea-input"
          value={roughNotes}
          onChange={(e) => setRoughNotes(e.target.value)}
          placeholder={t("anyIdeaPlaceholder")}
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm outline-none ring-[var(--idea-accent)]/30 focus:ring-2"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefine}
            disabled={refining || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--idea-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            <span aria-hidden>✨</span>
            {refining ? t("anyIdeaRefining") : t("anyIdeaRefine")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={refining || loading}
            className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-2.5 text-sm font-semibold text-[var(--muted)] hover:bg-white disabled:opacity-50"
          >
            {loading ? t("anyIdeaSaving") : t("anyIdeaSaveRaw")}
          </button>
        </div>
      </div>

      {refinedPreview && (
        <div className="rounded-2xl border border-[var(--idea-accent)]/40 bg-white/80 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--idea-accent)]">
            {t("anyIdeaRefinedPreview")}
          </h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-[var(--foreground)]">
            {refinedPreview}
          </pre>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold">{t("anyIdeaSavedTitle")}</h2>
        {ideas.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">{t("anyIdeaSavedEmpty")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      idea.isRefined
                        ? "bg-[var(--idea-accent)]/15 text-amber-800"
                        : "bg-black/5 text-[var(--muted)]",
                    ].join(" ")}
                  >
                    {idea.isRefined ? t("anyIdeaBadgeRefined") : t("anyIdeaBadgeRaw")}
                  </span>
                  <time className="text-[10px] text-[var(--muted)]">
                    {new Date(idea.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium">{idea.roughNotes}</p>
                {idea.refinedNotes && (
                  <pre className="mt-2 line-clamp-4 whitespace-pre-wrap font-sans text-xs text-[var(--muted)]">
                    {idea.refinedNotes}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
