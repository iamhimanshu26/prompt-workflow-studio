"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import LoadingSkeleton from "@/components/enterprise/LoadingSkeleton";
import StatusBadge from "@/components/enterprise/StatusBadge";
import { useLang } from "@/lib/i18n/LangProvider";

type HealthResponse = {
  status: string;
  phase: number;
  app?: string;
  auth?: string;
  database?: "ok" | "error" | string;
  dbMessage?: string;
  ai?: { provider: string; sampleLatencyMs: number; status?: string };
  aiWarning?: string;
  aiConfig?: Record<string, unknown>;
  timestamp?: string;
  message?: string;
};

export default function HealthPage() {
  const { t } = useLang();
  const [data, setData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const json = (await res.json()) as HealthResponse;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          setData({
            status: "error",
            phase: 0,
            database: "error",
            dbMessage: e instanceof Error ? e.message : "Health check failed",
            message: e instanceof Error ? e.message : "Health check failed",
          });
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-indigo-400">
          System Diagnostics
        </p>
        <h1 className="text-2xl font-bold">{t("apiHealthTitle")}</h1>
        <LoadingSkeleton className="max-w-2xl" />
        <p className="text-sm text-[var(--muted)]">{t("healthLoading")}</p>
      </div>
    );
  }

  const dbOk = data.database === "ok";
  const envStatus =
    data.status === "ok" && dbOk
      ? "ok"
      : data.status === "ok"
        ? "warn"
        : "error";

  return (
    <div className="mx-auto max-w-3xl space-y-6 pws-animate-in">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cyan-400">
          System Health
        </p>
        <h1 className="mt-2 text-2xl font-bold">{t("apiHealthTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("rawJsonLabel")}{" "}
          <a href="/api/health" className="text-cyan-400 underline">
            /api/health
          </a>
        </p>
      </div>

      <GlowCard className="flex flex-wrap gap-2 p-5">
        <StatusBadge
          label={dbOk ? "Connected" : "Offline"}
          status={dbOk ? "ok" : "error"}
          pulse
        />
        <StatusBadge
          label={data.ai?.provider === "openai" ? "OpenAI Ready" : "Mock Mode"}
          status={data.ai?.provider === "openai" ? "ok" : "warn"}
        />
        <StatusBadge
          label={
            envStatus === "ok"
              ? t("healthOperational")
              : envStatus === "warn"
                ? t("healthDegraded")
                : t("healthOffline")
          }
          status={envStatus}
        />
      </GlowCard>

      {data.aiWarning && (
        <GlowCard glow={false} className="border-amber-500/30 bg-amber-950/20 p-4">
          <p className="text-sm text-amber-200">{data.aiWarning}</p>
        </GlowCard>
      )}

      <GlowCard glow={false} className="overflow-hidden p-0">
        <pre className="overflow-x-auto p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-cyan-100/90">
          {JSON.stringify(data, null, 2)}
        </pre>
      </GlowCard>

      {data.database === "error" && (
        <GlowCard glow={false} className="border-red-500/30 bg-red-950/20 p-4">
          <p className="font-medium text-red-200">{t("databaseConnectionFailed")}</p>
          <p className="mt-2 text-sm text-red-300/90">{t("dbHintVercel")}</p>
          {typeof data.dbMessage === "string" && (
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-red-400">
              {data.dbMessage}
            </p>
          )}
        </GlowCard>
      )}

      <Link href="/dashboard" className="inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300">
        ← {t("navDashboard")}
      </Link>
    </div>
  );
}
