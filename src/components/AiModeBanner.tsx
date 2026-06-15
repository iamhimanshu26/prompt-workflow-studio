"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import {
  hasQuotaExceeded,
  subscribeQuotaExceeded,
} from "@/lib/ai/quotaSession";

type HealthPayload = {
  ai?: { provider: string; status?: string };
  aiConfig?: {
    aiProviderEnv: string | null;
    openaiKeyConfigured: boolean;
    usingMockFallback: boolean;
    hint: string | null;
  };
};

export default function AiModeBanner() {
  const { t } = useLang();
  const [info, setInfo] = useState<HealthPayload["aiConfig"] | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [quotaHit, setQuotaHit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: HealthPayload) => {
        if (cancelled) return;
        setInfo(json.aiConfig ?? null);
        const mock =
          json.ai?.provider === "mock" || json.aiConfig?.usingMockFallback === true;
        setUsingMock(mock);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setQuotaHit(hasQuotaExceeded());
    return subscribeQuotaExceeded(() => setQuotaHit(hasQuotaExceeded()));
  }, []);

  if (quotaHit) {
    return (
      <div
        role="status"
        className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
      >
        <span className="font-semibold">{t("aiQuotaBannerTitle")}</span>
        <p className="mt-1 text-red-300/90">{t("aiQuotaBannerBody")}</p>
      </div>
    );
  }

  if (!usingMock) return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
    >
      <span className="font-semibold">{t("aiMockBannerTitle")}</span>
      <span className="text-amber-200/90"> — {t("aiMockBannerBody")}</span>
      {info?.hint && (
        <p className="mt-2 text-xs text-amber-200/70">{info.hint}</p>
      )}
      <p className="mt-2 text-xs">
        <a href="/health" className="font-semibold underline">
          Open /health
        </a>{" "}
        for full diagnostics after changing Vercel env vars.
      </p>
    </div>
  );
}
