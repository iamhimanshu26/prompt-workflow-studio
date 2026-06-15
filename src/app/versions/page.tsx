"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import PromptListPanel from "@/components/versions/PromptListPanel";
import RestoreVersionDialog from "@/components/versions/RestoreVersionDialog";
import VersionDiffViewer from "@/components/versions/VersionDiffViewer";
import VersionEmptyState from "@/components/versions/VersionEmptyState";
import VersionSkeleton from "@/components/versions/VersionSkeleton";
import VersionTimeline from "@/components/versions/VersionTimeline";
import { useLang } from "@/lib/i18n/LangProvider";
import { useToast } from "@/components/Toast";
import type { PromptDetail, PromptListItem, VersionRow } from "@/lib/versions/types";

export default function VersionsPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [prompts, setPrompts] = useState<PromptListItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PromptDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<"updated" | "title">("updated");

  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [viewVersion, setViewVersion] = useState<VersionRow | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<VersionRow | null>(null);
  const [restoring, setRestoring] = useState(false);

  const loadList = useCallback(async () => {
    try {
      const res = await fetch("/api/prompts", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        setListError(json.message ?? t("verLoadError"));
        return;
      }
      setPrompts(json.data);
      setListError(null);
    } catch (e) {
      setListError(e instanceof Error ? e.message : t("verLoadError"));
    } finally {
      setLoadingList(false);
    }
  }, [t]);

  const loadDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/prompts/${id}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("verLoadError"), "error");
        return;
      }
      setDetail(json.data);
      const versions = json.data.versions as VersionRow[];
      if (versions.length >= 2) {
        setCompareA(versions[1].id);
        setCompareB(versions[0].id);
      } else if (versions.length === 1) {
        setCompareA(versions[0].id);
        setCompareB(versions[0].id);
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("verLoadError"), "error");
    } finally {
      setLoadingDetail(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  const versionA = useMemo(
    () => detail?.versions.find((v) => v.id === compareA) ?? null,
    [detail, compareA],
  );
  const versionB = useMemo(
    () => detail?.versions.find((v) => v.id === compareB) ?? null,
    [detail, compareB],
  );

  function handleCompareSelect(versionId: string, slot: "a" | "b") {
    if (slot === "a") setCompareA(versionId);
    else setCompareB(versionId);
  }

  async function handleRestoreConfirm() {
    if (!restoreTarget || !selectedId) return;
    setRestoring(true);
    try {
      const res = await fetch(`/api/prompts/${selectedId}/versions/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: restoreTarget.id }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("verRestoreError"), "error");
        return;
      }
      showToast(t("verRestoreSuccess").replace("{n}", String(json.data.version)), "success");
      setRestoreTarget(null);
      await loadList();
      await loadDetail(selectedId);
    } catch {
      showToast(t("verRestoreError"), "error");
    } finally {
      setRestoring(false);
    }
  }

  async function handleDuplicate(version: VersionRow) {
    if (!selectedId) return;
    try {
      const res = await fetch(`/api/prompts/${selectedId}/versions/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: version.id }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "ok") {
        showToast(json.message ?? t("verDuplicateError"), "error");
        return;
      }
      showToast(`${t("verDuplicateSuccess")}: ${json.data.title}`, "success");
      await loadList();
      setSelectedId(json.data.promptId);
    } catch {
      showToast(t("verDuplicateError"), "error");
    }
  }

  if (loadingList) return <VersionSkeleton />;

  return (
    <div className="space-y-8 pws-animate-in">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          PromptOps Governance
        </p>
        <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{t("verPageTitle")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{t("verPageSubtitle")}</p>
      </div>

      {listError && (
        <GlowCard glow={false} className="border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {listError}
        </GlowCard>
      )}

      {prompts.length === 0 && !listError ? (
        <VersionEmptyState
          title={t("verEmptyPromptsTitle")}
          description={t("verEmptyPromptsBody")}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/playground"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                {t("homeCtaPlayground")}
              </Link>
              <Link
                href="/optimizer"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              >
                {t("navOptimizer")}
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <PromptListPanel
              prompts={prompts}
              selectedId={selectedId}
              onSelect={setSelectedId}
              search={search}
              onSearchChange={setSearch}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              sort={sort}
              onSortChange={setSort}
            />

            <div>
              {loadingDetail && <VersionSkeleton />}
              {!loadingDetail && !detail && (
                <VersionEmptyState
                  title={t("verSelectPromptTitle")}
                  description={t("verSelectPromptBody")}
                />
              )}
              {!loadingDetail && detail && (
                <VersionTimeline
                  prompt={detail}
                  compareA={compareA}
                  compareB={compareB}
                  onCompareSelect={handleCompareSelect}
                  onRestore={setRestoreTarget}
                  onDuplicate={handleDuplicate}
                  onView={setViewVersion}
                />
              )}
            </div>
          </div>

          {detail && (
            <section>
              <VersionDiffViewer versionA={versionA} versionB={versionB} />
            </section>
          )}
        </>
      )}

      {restoreTarget && (
        <RestoreVersionDialog
          versionLabel={`v${restoreTarget.version}`}
          onConfirm={handleRestoreConfirm}
          onCancel={() => setRestoreTarget(null)}
          loading={restoring}
        />
      )}

      {viewVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <GlowCard className="max-h-[80vh] w-full max-w-2xl overflow-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold">
                v{viewVersion.version} — {viewVersion.name}
              </h3>
              <button
                type="button"
                onClick={() => setViewVersion(null)}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {t("verClose")}
              </button>
            </div>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{viewVersion.body}</pre>
          </GlowCard>
        </div>
      )}
    </div>
  );
}
