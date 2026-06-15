import React from "react";
import type { DashboardSystem } from "@/types/dashboard";
import StatusBadge from "./StatusBadge";

export default function SystemHealthCard({ system }: { system: DashboardSystem }) {
  const dbStatus =
    system.databaseStatus === "ok" ? "ok" : system.databaseStatus === "unconfigured" ? "warn" : "error";

  const aiStatus =
    system.aiProvider === "openai" ? "ok" : system.aiProvider === "mock" ? "warn" : "neutral";

  const envStatus =
    system.environmentStatus === "ready"
      ? "ok"
      : system.environmentStatus === "degraded"
        ? "warn"
        : "error";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">System Health</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge
          label={`Database ${system.databaseStatus}`}
          status={dbStatus}
        />
        <StatusBadge label={`AI ${system.aiProvider}`} status={aiStatus} />
        <StatusBadge label={`Env ${system.environmentStatus}`} status={envStatus} />
      </div>
      {system.databaseMessage && (
        <p className="mt-3 text-xs text-red-700">{system.databaseMessage}</p>
      )}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Last fetch: {new Date(system.fetchedAt).toLocaleString()}
      </p>
    </div>
  );
}
