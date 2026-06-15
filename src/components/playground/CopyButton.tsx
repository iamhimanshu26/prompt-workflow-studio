"use client";

import React, { useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* parent may show toast */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={
        className ??
        "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-cyan-400/40 hover:bg-[var(--surface-muted)] disabled:opacity-40"
      }
    >
      {copied ? t("pgCopied") : (label ?? t("playgroundCopy"))}
    </button>
  );
}
