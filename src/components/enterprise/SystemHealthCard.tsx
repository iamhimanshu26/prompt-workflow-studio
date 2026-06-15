import Link from "next/link";
import React from "react";
import type { DashboardSystem } from "@/types/dashboard";
import GlowCard from "./GlowCard";
import StatusBadge from "./StatusBadge";

function mapDbLabel(status: DashboardSystem["databaseStatus"]) {
  if (status === "ok") return { label: "Connected", badge: "ok" as const };
  if (status === "unconfigured") return { label: "Unconfigured", badge: "warn" as const };
  return { label: "Offline", badge: "error" as const };
}

function mapAiLabel(provider: string) {
  if (provider === "openai") return { label: "OpenAI Ready", badge: "ok" as const };
  if (provider === "mock") return { label: "Mock Mode", badge: "warn" as const };
  return { label: provider, badge: "neutral" as const };
}

function mapEnvLabel(status: DashboardSystem["environmentStatus"]) {
  if (status === "ready") return { label: "Operational", badge: "ok" as const };
  if (status === "degraded") return { label: "Degraded", badge: "warn" as const };
  return { label: "Not Ready", badge: "error" as const };
}

export default function SystemHealthCard({ system }: { system: DashboardSystem }) {
  const db = mapDbLabel(system.databaseStatus);
  const ai = mapAiLabel(system.aiProvider);
  const env = mapEnvLabel(system.environmentStatus);

  return (
    <GlowCard className="p-5">
      <h2 className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
        System Health
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge label={db.label} status={db.badge} pulse />
        <StatusBadge label={ai.label} status={ai.badge} />
        <StatusBadge label={env.label} status={env.badge} />
      </div>
      {system.databaseMessage && (
        <p className="mt-3 text-xs text-red-300">{system.databaseMessage}</p>
      )}
      <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
        Last sync: {new Date(system.fetchedAt).toLocaleString()}
      </p>
      <Link href="/health" className="mt-3 inline-block text-xs font-semibold text-cyan-400 hover:text-cyan-300">
        Open API Health →
      </Link>
    </GlowCard>
  );
}
