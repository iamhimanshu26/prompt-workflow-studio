"use client";

import React from "react";
import { PromptCategory } from "@prisma/client";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";

export type SavedPromptOption = {
  id: string;
  title: string;
  category: PromptCategory;
  bodyPreview: string;
  versionCount: number;
  updatedAt: string;
};

export default function ExistingPromptSelector({
  prompts,
  selectedId,
  onSelect,
}: {
  prompts: SavedPromptOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLang();

  if (prompts.length === 0) return null;

  return (
    <GlowCard glow={false} className="p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("optimizerAttachPrompt")}
      </p>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
      >
        <option value="">{t("optimizerNewPrompt")}</option>
        {prompts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} · {p.category} · v{p.versionCount} ·{" "}
            {new Date(p.updatedAt).toLocaleDateString()}
          </option>
        ))}
      </select>
    </GlowCard>
  );
}
