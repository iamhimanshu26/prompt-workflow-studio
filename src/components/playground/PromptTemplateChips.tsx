"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import { PROMPT_TEMPLATES } from "@/lib/playground/templates";

export default function PromptTemplateChips({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-2">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {t("pgTemplatesTitle")}
      </p>
      <div className="flex flex-wrap gap-2">
        {PROMPT_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(tpl.text)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--foreground)] transition hover:border-cyan-400/35 hover:bg-cyan-500/10 disabled:opacity-50"
          >
            {t(tpl.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
