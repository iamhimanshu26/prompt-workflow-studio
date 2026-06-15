"use client";

import React, { useEffect, useState } from "react";
import CategoryDistribution from "@/components/enterprise/CategoryDistribution";
import CommandHero from "@/components/enterprise/CommandHero";
import EmptyState from "@/components/enterprise/EmptyState";
import ErrorState from "@/components/enterprise/ErrorState";
import LifecyclePipeline, { type PipelineStep } from "@/components/enterprise/LifecyclePipeline";
import LoadingSkeleton from "@/components/enterprise/LoadingSkeleton";
import QuickActionCard from "@/components/enterprise/QuickActionCard";
import RecentActivityList from "@/components/enterprise/RecentActivityList";
import StatCard from "@/components/enterprise/StatCard";
import SystemHealthCard from "@/components/enterprise/SystemHealthCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { DashboardApiResponse, DashboardPayload } from "@/types/dashboard";

export default function DashboardPage() {
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        const json = (await res.json()) as DashboardApiResponse;
        if (cancelled) return;

        if (!res.ok || json.status !== "ok") {
          setErr(json.status === "error" ? json.message : t("dashboardError"));
          setData(null);
          return;
        }

        setData(json.data);
        setErr(null);
      } catch (e) {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : t("dashboardError"));
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [t]);

  if (loading) return <LoadingSkeleton />;

  if (err || !data) {
    return (
      <div className="space-y-6">
        <ErrorState title={t("dashboardError")} message={err ?? t("dashboardError")} />
      </div>
    );
  }

  const { stats, system } = data;
  const hasActivity =
    stats.totalRuns > 0 ||
    stats.totalPrompts > 0 ||
    stats.totalIdeas > 0 ||
    stats.totalWorkflows > 0;

  const pipelineSteps: PipelineStep[] = [
    {
      key: "create",
      title: t("lifecycleCreate"),
      description: t("lifecycleCreateDesc"),
      href: "/playground",
      status: stats.totalPrompts > 0 ? "active" : "partial",
      statusLabel: stats.totalPrompts > 0 ? t("statusActive") : t("statusReady"),
    },
    {
      key: "test",
      title: t("lifecycleTest"),
      description: t("lifecycleTestDesc"),
      href: "/playground",
      status: stats.totalRuns > 0 ? "active" : "partial",
      statusLabel: stats.totalRuns > 0 ? t("statusActive") : t("statusReady"),
    },
    {
      key: "optimize",
      title: t("lifecycleOptimize"),
      description: t("lifecycleOptimizeDesc"),
      href: "/optimizer",
      status: data.recentVersions.length > 0 ? "active" : "partial",
      statusLabel: data.recentVersions.length > 0 ? t("statusActive") : t("statusReady"),
    },
    {
      key: "version",
      title: t("lifecycleVersion"),
      description: t("lifecycleVersionDesc"),
      href: "/versions",
      status: data.recentVersions.length > 0 ? "active" : "partial",
      statusLabel: data.recentVersions.length > 0 ? t("statusActive") : t("statusReady"),
    },
    {
      key: "evaluate",
      title: t("lifecycleEvaluate"),
      description: t("lifecycleEvaluateDesc"),
      href: "/evaluate",
      status: stats.totalEvaluations > 0 ? "active" : stats.averageScore != null ? "partial" : "partial",
      statusLabel:
        stats.totalEvaluations > 0 ? t("statusActive") : t("statusReady"),
    },
    {
      key: "automate",
      title: t("lifecycleAutomate"),
      description: t("lifecycleAutomateDesc"),
      href: "/workflows",
      status: stats.totalWorkflows > 0 ? "partial" : "planned",
      statusLabel: stats.totalWorkflows > 0 ? t("statusPartial") : t("statusPlanned"),
    },
  ];

  return (
    <div className="space-y-8">
      <CommandHero
        title={t("commandCenterTitle")}
        subtitle={t("commandCenterSubtitle")}
        dbStatus={system.databaseStatus}
        aiProvider={system.aiProvider}
        ctaPrimary={t("quickTestExecution")}
        ctaSecondary={t("quickOptimize")}
        ctaPrimaryHref="/playground"
        ctaSecondaryHref="/optimizer"
      />

      {system.databaseStatus !== "ok" && (
        <ErrorState
          title={t("databaseUnavailableTitle")}
          message={system.databaseMessage ?? t("databaseUnavailableBody")}
        />
      )}

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("kpiSectionTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          <StatCard icon="◆" label={t("totalPromptsLabel")} value={stats.totalPrompts} description={t("statPromptsDesc")} />
          <StatCard icon="▶" label={t("totalRunsLabel")} value={stats.totalRuns} description={t("statRunsDesc")} />
          <StatCard icon="◎" label={t("avgScoreLabel")} value={stats.averageScore ?? "—"} hint="/100" description={t("statScoreDesc")} animate={stats.averageScore != null} />
          <StatCard icon="✦" label={t("totalIdeasLabel")} value={stats.totalIdeas} description={t("statIdeasDesc")} />
          <StatCard icon="⬡" label={t("totalWorkflowsLabel")} value={stats.totalWorkflows} description={t("statWorkflowsDesc")} />
          <StatCard icon="AI" label={t("aiProviderStatusLabel")} value={system.aiProvider} animate={false} description={t("statAiDesc")} />
          <StatCard icon="DB" label={t("databaseStatusLabel")} value={system.databaseStatus} animate={false} description={t("statDbDesc")} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("lifecycleSectionTitle")}
        </h2>
        <LifecyclePipeline steps={pipelineSteps} />
      </section>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("quickActionsTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard href="/playground" title={t("quickTestExecution")} description={t("quickTestExecutionDesc")} />
          <QuickActionCard href="/optimizer" title={t("quickOptimize")} description={t("quickOptimizeDesc")} />
          <QuickActionCard href="/any-idea" title={t("quickCaptureIdea")} description={t("quickCaptureIdeaDesc")} />
          <QuickActionCard href="/evaluate" title={t("quickEvaluate")} description={t("quickEvaluateDesc")} />
          <QuickActionCard href="/library" title={t("quickLibrary")} description={t("quickLibraryDesc")} />
          <QuickActionCard href="/workflows" title={t("quickWorkflow")} description={t("quickWorkflowDesc")} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            {t("recentActivityTitle")}
          </h2>
          {hasActivity ? (
            <RecentActivityList
              runs={data.recentRuns}
              prompts={data.recentPrompts}
              versions={data.recentVersions}
              ideas={data.recentIdeas}
              workflows={data.recentWorkflows}
              emptyTitle={t("activityEmptyTitle")}
              emptyDescription={t("activityEmptyBody")}
            />
          ) : (
            <EmptyState title={t("activityEmptyTitle")} description={t("activityEmptyBody")} />
          )}
        </section>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
              {t("categorySectionTitle")}
            </h2>
            <CategoryDistribution
              categories={data.categoryCounts}
              emptyTitle={t("categoryEmptyTitle")}
              emptyBody={t("categoryEmptyBody")}
            />
          </section>
          <SystemHealthCard system={data.system} />
        </div>
      </div>
    </div>
  );
}
