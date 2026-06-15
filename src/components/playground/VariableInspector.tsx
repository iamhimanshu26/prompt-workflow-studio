"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function VariableInspector({
  variables,
  values,
  onChange,
}: {
  variables: string[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  const { t } = useLang();

  if (variables.length === 0) return null;

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-indigo-300">
        {t("pgVariablesTitle")} ({variables.length})
      </p>
      <div className="mt-2 space-y-2">
        {variables.map((name) => (
          <div key={name} className="grid gap-1 sm:grid-cols-[120px_1fr] sm:items-center">
            <label className="font-[family-name:var(--font-mono)] text-xs text-cyan-300/90">
              {`{{${name}}}`}
            </label>
            <input
              type="text"
              value={values[name] ?? ""}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={t("pgVariablePlaceholder")}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1.5 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
