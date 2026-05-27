"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LangToggle() {
  const { lang, setLang, t } = useLang();
  const isEn = lang === "en";

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/80 px-2 py-0.5 shadow-sm"
      aria-label="Language toggle"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={[
          "text-[10px] font-semibold transition-colors",
          isEn ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={isEn}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLang(isEn ? "ja" : "en")}
        className="relative h-4 w-7 rounded-full bg-[var(--border)]/80 p-0.5"
        aria-label="Switch language"
      >
        <span
          className={[
            "block h-3 w-3 rounded-full bg-[var(--accent)] shadow transition-transform",
            isEn ? "translate-x-0" : "translate-x-3",
          ].join(" ")}
        />
      </button>

      <button
        type="button"
        onClick={() => setLang("ja")}
        className={[
          "text-[10px] font-semibold transition-colors",
          !isEn ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={!isEn}
      >
        {t("toggleJa")}
      </button>
    </div>
  );
}
