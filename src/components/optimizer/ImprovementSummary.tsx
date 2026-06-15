"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";
import type { ImprovementItem } from "@/lib/optimizer/types";

export default function ImprovementSummary({
  improvements,
}: {
  improvements: ImprovementItem[];
}) {
  const { t } = useLang();

  return (
    <GlowCard glow={false} className="p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-indigo-300">
        {t("optImprovementsTitle")}
      </p>
      <ul className="mt-3 space-y-2">
        {improvements.map((item) => (
          <li
            key={`${item.label}-${item.description}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2"
          >
            <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{item.description}</p>
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
