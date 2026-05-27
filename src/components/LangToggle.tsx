"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LangToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={() => setLang(lang === "en" ? "ja" : "en")}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)]/90 px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm backdrop-blur hover:opacity-90"
        aria-label="Toggle language"
      >
        {lang === "en" ? t("toggleJa") : t("toggleEn")}
      </button>
    </div>
  );
}

