"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

type HealthPayload = {
  ai?: { provider: string };
  aiConfig?: {
    aiProviderEnv: string | null;
    openaiKeyConfigured: boolean;
    openaiKeyLength: number;
    activeProvider: string;
    usingMockFallback: boolean;
    hint: string | null;
  };
};

export default function AiModeBanner() {
  const { t } = useLang();
  const [info, setInfo] = useState<HealthPayload["aiConfig"] | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: HealthPayload) => {
        if (cancelled) return;
        setProvider(json.ai?.provider ?? null);
        setInfo(json.aiConfig ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!provider || provider !== "mock") return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-300/50 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
    >
      <span className="font-semibold">{t("aiMockBannerTitle")}</span>
      <span className="text-amber-900/90"> — {t("aiMockBannerBody")}</span>
      {info && (
        <ul className="mt-2 list-inside list-disc text-xs text-amber-900/80">
          <li>
            AI_PROVIDER env: <code>{info.aiProviderEnv ?? "(not set)"}</code>
          </li>
          <li>
            OPENAI_API_KEY:{" "}
            {info.openaiKeyConfigured
              ? `set (${info.openaiKeyLength} chars)`
              : "not set on server"}
          </li>
          {info.hint && <li>{info.hint}</li>}
        </ul>
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
