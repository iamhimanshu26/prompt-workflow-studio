"use client";

import React from "react";
import ModulePreview from "@/components/enterprise/ModulePreview";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LibraryPage() {
  const { t } = useLang();

  return (
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
  );
}
