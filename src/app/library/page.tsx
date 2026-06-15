"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";
import ModulePreview from "@/components/enterprise/ModulePreview";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LibraryPage() {
  const { t } = useLang();

  return (
    <div className="space-y-6">
      <ModulePreview
        title={t("libraryPageTitle")}
        subtitle={t("libraryPageSubtitle")}
        statusBadge={t("libraryStatusBadge")}
        features={[
          { icon: "◆", label: t("libraryFeatureSaved") },
          { icon: "▣", label: t("libraryFeatureTemplates") },
          { icon: "◎", label: t("libraryFeatureFilters") },
          { icon: "★", label: t("libraryFeatureFavorites") },
          { icon: "⬡", label: t("libraryFeatureVersions") },
          { icon: "▶", label: t("libraryFeatureMetrics") },
        ]}
        primaryCta={t("libraryCtaPlayground")}
        primaryHref="/playground"
        secondaryCta={t("libraryCtaOptimizer")}
        secondaryHref="/optimizer"
        footerNote={t("libraryPreviewFooter")}
      />

      <GlowCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            {t("libraryVersionCardBadge")}
          </p>
          <p className="mt-1 font-semibold text-[var(--foreground)]">{t("libraryVersionCardTitle")}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("libraryVersionCardBody")}</p>
        </div>
        <Link
          href="/versions"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {t("libraryVersionCta")} →
        </Link>
      </GlowCard>
    </div>
  );
}
