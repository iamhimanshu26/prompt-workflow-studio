import React from "react";
import type {
  DashboardRecentIdea,
  DashboardRecentPrompt,
  DashboardRecentRun,
  DashboardRecentVersion,
  DashboardRecentWorkflow,
} from "@/types/dashboard";

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  meta: string;
  at: string;
};

function buildItems(
  runs: DashboardRecentRun[],
  prompts: DashboardRecentPrompt[],
  versions: DashboardRecentVersion[],
  ideas: DashboardRecentIdea[],
  workflows: DashboardRecentWorkflow[],
): ActivityItem[] {
  const items: ActivityItem[] = [
    ...runs.map((r) => ({
      id: `run-${r.id}`,
      type: "Prompt Run",
      title: r.promptTitle,
      meta: `${r.category} · ${r.modelId}`,
      at: r.createdAt,
    })),
    ...prompts.map((p) => ({
      id: `prompt-${p.id}`,
      type: "Saved Prompt",
      title: p.title,
      meta: p.category,
      at: p.updatedAt,
    })),
    ...versions.map((v) => ({
      id: `version-${v.id}`,
      type: "Optimized Version",
      title: `${v.promptTitle} (${v.name})`,
      meta: `v${v.version}`,
      at: v.createdAt,
    })),
    ...ideas.map((i) => ({
      id: `idea-${i.id}`,
      type: "Captured Idea",
      title: i.roughNotes.slice(0, 80) + (i.roughNotes.length > 80 ? "…" : ""),
      meta: i.isRefined ? "Refined" : "Rough",
      at: i.createdAt,
    })),
    ...workflows.map((w) => ({
      id: `workflow-${w.id}`,
      type: "Workflow",
      title: w.name,
      meta: `${w.stepCount} steps`,
      at: w.updatedAt,
    })),
  ];

  return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 12);
}

export default function RecentActivityList({
  runs,
  prompts,
  versions,
  ideas,
  workflows,
  emptyTitle,
  emptyDescription,
}: {
  runs: DashboardRecentRun[];
  prompts: DashboardRecentPrompt[];
  versions: DashboardRecentVersion[];
  ideas: DashboardRecentIdea[];
  workflows: DashboardRecentWorkflow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const items = buildItems(runs, prompts, versions, ideas, workflows);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-8 text-center">
        <p className="font-semibold">{emptyTitle}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
              {item.type}
            </p>
            <p className="mt-0.5 truncate font-medium text-[var(--foreground)]">{item.title}</p>
            <p className="text-xs text-[var(--muted)]">{item.meta}</p>
          </div>
          <time className="shrink-0 text-[10px] text-[var(--muted)]">
            {new Date(item.at).toLocaleString()}
          </time>
        </li>
      ))}
    </ul>
  );
}
