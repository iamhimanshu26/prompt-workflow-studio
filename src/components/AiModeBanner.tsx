"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

type HealthPayload = {
  ai?: { provider: string; status?: string };
  aiWarning?: string;
  aiErrorKind?: string;
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
  const [warning, setWarning] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: HealthPayload) => {
        if (cancelled) return;
        setProvider(json.ai?.provider ?? null);
        setInfo(json.aiConfig ?? null);
        setWarning(json.aiWarning ?? null);
        setErrorKind(json.aiErrorKind ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!provider && !warning) return null;
  if (provider === "openai" && !warning) return null;

  const isQuota = errorKind === "quota" || warning?.toLowerCase().includes("quota");

  return (
    <div
      role="status"
      className={[
        "rounded-xl border px-4 py-3 text-sm",
        isQuota
          ? "border-red-500/40 bg-red-950/40 text-red-200"
          : "border-amber-500/40 bg-amber-950/30 text-amber-100",
      ].join(" ")}
    >
      {isQuota ? (
        <>
          <span className="font-semibold">{t("aiQuotaBannerTitle")}</span>
          <p className="mt-1 text-red-300/90">{warning ?? t("aiQuotaBannerBody")}</p>
        </>
      ) : (
        <>
          <span className="font-semibold">{t("aiMockBannerTitle")}</span>
          <span className="text-amber-200/90"> — {t("aiMockBannerBody")}</span>
        </>
      )}
      {info && (
        <ul className="mt-2 list-inside list-disc text-xs text-amber-200/70">
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
