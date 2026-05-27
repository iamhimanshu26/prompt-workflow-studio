"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

type HealthResponse = {
  status: string;
  phase: number;
  app?: string;
  auth?: string;
  database?: "ok" | "error" | string;
  dbMessage?: string;
  ai?: { provider: string; sampleLatencyMs: number };
  timestamp?: string;
  message?: string;
};

export default function HealthPage() {
  const { t } = useLang();
  const [ok, setOk] = useState(true);
  const [data, setData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const json = (await res.json()) as HealthResponse;
        if (cancelled) return;

        setData(json);
        setOk(Boolean(res.ok && json.database !== "error"));
      } catch (e) {
        if (cancelled) return;
        setOk(false);
        setData({
          status: "error",
          phase: 0,
          database: "error",
          dbMessage: e instanceof Error ? e.message : "Health check failed",
          message: e instanceof Error ? e.message : "Health check failed",
        });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
          ← {t("backToHome")}
        </Link>
        <h1 className="mt-4 text-2xl font-bold">{t("apiHealthTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
        ← {t("backToHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{t("apiHealthTitle")}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {t("rawJsonLabel")}{" "}
        <a href="/api/health" className="text-[var(--accent)] underline">
          /api/health
        </a>
      </p>

      <pre
        className={`mt-6 overflow-x-auto rounded-xl border p-4 text-sm ${
          ok
            ? "border-[var(--success)]/40 bg-[var(--card)]"
            : "border-red-500/40 bg-[var(--card)]"
        }`}
      >
        {JSON.stringify(data, null, 2)}
      </pre>

      {data.database === "error" && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">{t("databaseConnectionFailed")}</p>
          <p className="mt-2">{t("dbHintVercel")}</p>
          {typeof data.dbMessage === "string" && (
            <p className="mt-2 text-xs text-red-300">{data.dbMessage}</p>
          )}
        </div>
      )}
    </main>
  );
}
