"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import StatusBadge from "@/components/enterprise/StatusBadge";
import { useLang } from "@/lib/i18n/LangProvider";
import { buildOptimizerUrl, buildPlaygroundUrl } from "@/lib/versions/handoff";
import type { PromptListItem } from "@/lib/versions/types";
import { PromptCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

export default function PromptListPanel({
  prompts,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sort,
  onSortChange,
}: {
  prompts: PromptListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  sort: "updated" | "title";
  onSortChange: (v: "updated" | "title") => void;
}) {
  const { t } = useLang();

  const filtered = prompts
    .filter((p) => {
      const q = search.trim().toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.body.toLowerCase().includes(q))
        return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <GlowCard className="flex h-full max-h-[720px] flex-col p-4">
      <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-cyan-400">
        {t("verPromptListTitle")}
      </p>

      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("verSearchPlaceholder")}
        className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm"
      />

      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1.5 text-xs"
        >
          <option value="all">{t("verFilterAll")}</option>
          <option value="GENERAL">General</option>
          <option value="CODING">Coding</option>
          <option value="MARKETING">Marketing</option>
          <option value="EMAIL">Email</option>
          <option value="RESUME">Resume</option>
          <option value="INTERVIEW">Interview</option>
          <option value="LEARNING">Learning</option>
        </select>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as "updated" | "title")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1.5 text-xs"
        >
          <option value="updated">{t("verSortUpdated")}</option>
          <option value="title">{t("verSortTitle")}</option>
        </select>
      </div>

      <ul className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition pws-hover-glow",
                selectedId === p.id
                  ? "border-cyan-500/40 bg-cyan-500/10"
                  : "border-[var(--border)] bg-[var(--surface-muted)]",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-[var(--foreground)] line-clamp-1">{p.title}</p>
                <StatusBadge
                  label={t(`verStatus_${p.status}`)}
                  status={p.status === "optimized" ? "ok" : p.status === "draft" ? "warn" : "neutral"}
                />
              </div>
              <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">{p.bodyPreview}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[var(--muted)]">
                <span>{p.category}</span>
                <span>v{p.latestVersion}</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Link
                  href={buildPlaygroundUrl(p.body, p.category as PromptCategory, p.title)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-semibold text-cyan-400 hover:underline"
                >
                  {t("verOpenPlayground")}
                </Link>
                <Link
                  href={buildOptimizerUrl(p.body, p.category as PromptCategory, p.title)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-semibold text-indigo-400 hover:underline"
                >
                  {t("verOpenOptimizer")}
                </Link>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
