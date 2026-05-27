"use client";

import React from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LangToggle() {
  const { lang, setLang, t } = useLang();
  const isEn = lang === "en";

  return (
    <div
      className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 shadow-sm backdrop-blur"
      aria-label="Language toggle"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={[
          "text-sm font-semibold transition-colors",
          isEn ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={isEn}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLang(isEn ? "ja" : "en")}
        className="relative h-7 w-12 rounded-full bg-[var(--border)]/70 p-1 transition-colors"
        aria-label="Switch language"
      >
        <span
          className={[
            "block h-5 w-5 rounded-full bg-[var(--accent)] shadow transition-transform",
            isEn ? "translate-x-0" : "translate-x-5",
          ].join(" ")}
        />
      </button>

      <button
        type="button"
        onClick={() => setLang("ja")}
        className={[
          "text-sm font-semibold transition-colors",
          !isEn ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={!isEn}
      >
        {t("toggleJa")}
      </button>
    </div>
  );
}

