"use client";

import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import { useLang } from "@/lib/i18n/LangProvider";

type VersionRow = {
  id: string;
  version: number;
  name: string;
  body: string;
  notes: string | null;
  createdAt: string;
};

type LibraryItem = {
  id: string;
  title: string;
  category: string;
  body: string;
  updatedAt: string;
  versions: VersionRow[];
};

export default function SavedPromptsPanel({
  library,
  highlightId,
}: {
  library: LibraryItem[];
  highlightId: string | null;
}) {
  const { t } = useLang();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">{t("optimizerSavedInDbTitle")}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("optimizerSavedInDbHint")}</p>
      </div>

      {library.length === 0 ? (
        <GlowCard glow={false} className="border-dashed p-6 text-center">
          <p className="text-sm text-[var(--muted)]">{t("optimizerSavedInDbEmpty")}</p>
        </GlowCard>
      ) : (
        <ul className="space-y-4">
          {library.map((p) => (
            <GlowCard
              key={p.id}
              glow={false}
              className={
                highlightId === p.id
                  ? "border-cyan-500/40 ring-2 ring-cyan-500/20"
                  : undefined
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-2 p-4 pb-0">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                    {p.id}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {p.category}
                </span>
              </div>
              <p className="line-clamp-2 px-4 text-sm text-[var(--muted)]">{p.body}</p>
              <div className="mt-3 px-4 pb-4">
                <p className="text-xs font-bold uppercase text-[var(--muted)]">
                  {t("optimizerVersionsLabel")} ({p.versions.length})
                </p>
                <ul className="mt-2 space-y-2">
                  {p.versions.slice(0, 3).map((v) => (
                    <li
                      key={v.id}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs"
                    >
                      <div className="flex justify-between gap-2 font-semibold">
                        <span>
                          {v.name} (v{v.version})
                        </span>
                        <time className="text-[var(--muted)]">
                          {new Date(v.createdAt).toLocaleString()}
                        </time>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[var(--muted)]">{v.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </GlowCard>
          ))}
        </ul>
      )}
    </section>
  );
}
