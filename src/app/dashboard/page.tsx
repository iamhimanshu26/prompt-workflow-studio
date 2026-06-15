"use client";

import React, { useEffect, useState } from "react";
import EmptyState from "@/components/enterprise/EmptyState";
import ErrorState from "@/components/enterprise/ErrorState";
import LifecycleCard from "@/components/enterprise/LifecycleCard";
import LoadingSkeleton from "@/components/enterprise/LoadingSkeleton";
import PageHeader from "@/components/enterprise/PageHeader";
import QuickActionCard from "@/components/enterprise/QuickActionCard";
import RecentActivityList from "@/components/enterprise/RecentActivityList";
import StatCard from "@/components/enterprise/StatCard";
import StatusBadge from "@/components/enterprise/StatusBadge";
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

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (err || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("commandCenterTitle")} description={t("commandCenterSubtitle")} />
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

  const dbBadgeStatus =
    system.databaseStatus === "ok" ? "ok" : system.databaseStatus === "unconfigured" ? "warn" : "error";

  const aiBadgeStatus = system.aiProvider === "openai" ? "ok" : "warn";

  return (
    <div className="space-y-8">
      <PageHeader title={t("commandCenterTitle")} description={t("commandCenterSubtitle")}>
        <StatusBadge label={`Database ${system.databaseStatus}`} status={dbBadgeStatus} />
        <StatusBadge label={`AI ${system.aiProvider}`} status={aiBadgeStatus} />
      </PageHeader>

      {system.databaseStatus !== "ok" && (
        <ErrorState
          title={t("databaseUnavailableTitle")}
          message={system.databaseMessage ?? t("databaseUnavailableBody")}
        />
      )}

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          {t("kpiSectionTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          <StatCard label={t("totalPromptsLabel")} value={stats.totalPrompts} />
          <StatCard label={t("totalRunsLabel")} value={stats.totalRuns} />
          <StatCard
            label={t("avgScoreLabel")}
            value={stats.averageScore ?? "—"}
            hint="/ 100"
          />
          <StatCard label={t("totalIdeasLabel")} value={stats.totalIdeas} />
          <StatCard label={t("totalWorkflowsLabel")} value={stats.totalWorkflows} />
          <StatCard label={t("aiProviderStatusLabel")} value={system.aiProvider} />
          <StatCard label={t("databaseStatusLabel")} value={system.databaseStatus} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          {t("lifecycleSectionTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LifecycleCard
            title={t("lifecycleCreate")}
            description={t("lifecycleCreateDesc")}
            href="/playground"
            status={stats.totalPrompts > 0 ? "active" : "ready"}
            statusLabel={stats.totalPrompts > 0 ? t("statusActive") : t("statusReady")}
          />
          <LifecycleCard
            title={t("lifecycleTest")}
            description={t("lifecycleTestDesc")}
            href="/playground"
            status={stats.totalRuns > 0 ? "active" : "ready"}
            statusLabel={stats.totalRuns > 0 ? t("statusActive") : t("statusReady")}
          />
          <LifecycleCard
            title={t("lifecycleOptimize")}
            description={t("lifecycleOptimizeDesc")}
            href="/optimizer"
            status={data.recentVersions.length > 0 ? "active" : "ready"}
            statusLabel={data.recentVersions.length > 0 ? t("statusActive") : t("statusReady")}
          />
          <LifecycleCard
            title={t("lifecycleVersion")}
            description={t("lifecycleVersionDesc")}
            href="/optimizer"
            status="planned"
            statusLabel={t("statusPlanned")}
          />
          <LifecycleCard
            title={t("lifecycleEvaluate")}
            description={t("lifecycleEvaluateDesc")}
            href="/dashboard"
            status={stats.averageScore != null ? "ready" : "planned"}
            statusLabel={stats.averageScore != null ? t("statusReady") : t("statusPlanned")}
          />
          <LifecycleCard
            title={t("lifecycleWorkflow")}
            description={t("lifecycleWorkflowDesc")}
            href="/workflows"
            status={stats.totalWorkflows > 0 ? "active" : "planned"}
            statusLabel={stats.totalWorkflows > 0 ? t("statusActive") : t("statusPlanned")}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
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
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
              {t("categorySectionTitle")}
            </h2>
            {data.categoryCounts.length === 0 ? (
              <EmptyState
                title={t("categoryEmptyTitle")}
                description={t("categoryEmptyBody")}
              />
            ) : (
              <ul className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                {data.categoryCounts.map((c) => (
                  <li key={c.category} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{c.category}</span>
                    <span className="font-semibold">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <SystemHealthCard system={data.system} />
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          {t("quickActionsTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            href="/playground"
            title={t("quickTestExecution")}
            description={t("quickTestExecutionDesc")}
          />
          <QuickActionCard
            href="/optimizer"
            title={t("quickOptimize")}
            description={t("quickOptimizeDesc")}
          />
          <QuickActionCard
            href="/any-idea"
            title={t("quickCaptureIdea")}
            description={t("quickCaptureIdeaDesc")}
          />
          <QuickActionCard
            href="/library"
            title={t("quickLibrary")}
            description={t("quickLibraryDesc")}
          />
          <QuickActionCard
            href="/workflows"
            title={t("quickWorkflow")}
            description={t("quickWorkflowDesc")}
          />
        </div>
      </section>
    </div>
  );
}
