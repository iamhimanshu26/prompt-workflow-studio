"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function PlaygroundPage() {
  const { t } = useLang();
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{t("phase2Label")}</h1>
      <p className="text-sm text-[var(--muted)]">{t("comingSoon")}</p>
    </div>
  );
}

