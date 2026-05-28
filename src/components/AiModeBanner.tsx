"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

type AiStatus = { provider: string };

export default function AiModeBanner() {
  const { t } = useLang();
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: { ai?: AiStatus }) => {
        if (!cancelled && json.ai?.provider) setProvider(json.ai.provider);
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
    </div>
  );
}
