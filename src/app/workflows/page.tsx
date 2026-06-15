"use client";

import React from "react";
import ModulePreview from "@/components/enterprise/ModulePreview";
import { useLang } from "@/lib/i18n/LangProvider";

export default function WorkflowsPage() {
  const { t } = useLang();

  return (
    <ModulePreview
      title={t("workflowsPageTitle")}
      subtitle={t("workflowsPageSubtitle")}
      statusBadge={t("workflowsStatusBadge")}
      features={[
        { icon: "⬡", label: t("workflowsFeatureChains") },
        { icon: "→", label: t("workflowsFeaturePipeline") },
        { icon: "✦", label: t("workflowsFeatureGates") },
        { icon: "▣", label: t("workflowsFeatureTemplates") },
        { icon: "◇", label: t("workflowsFeatureCanvas") },
        { icon: "▶", label: t("workflowsFeatureLogs") },
      ]}
      pipeline={[
        t("workflowsPipeInput"),
        t("workflowsPipePrompt"),
        t("workflowsPipeOutput"),
        t("workflowsPipeEval"),
        t("workflowsPipeSaved"),
      ]}
      primaryCta={t("workflowsCtaPlayground")}
      primaryHref="/playground"
      secondaryCta={t("workflowsCtaIdea")}
      secondaryHref="/any-idea"
      footerNote={t("workflowsPreviewFooter")}
    />
  );
}
