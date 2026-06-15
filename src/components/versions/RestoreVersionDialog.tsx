"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";

export default function RestoreVersionDialog({
  versionLabel,
  onConfirm,
  onCancel,
  loading,
}: {
  versionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { t } = useLang();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <GlowCard className="max-w-md p-6">
        <h3 className="text-lg font-bold">{t("verRestoreTitle")}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("verRestoreBody").replace("{version}", versionLabel)}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading ? t("verRestoring") : t("verRestoreConfirm")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            {t("verCancel")}
          </button>
        </div>
      </GlowCard>
    </div>
  );
}
