"use client";

import React from "react";
import ModulePreview from "@/components/enterprise/ModulePreview";
import { useLang } from "@/lib/i18n/LangProvider";

export default function WorkflowsPage() {
  const { t } = useLang();

  return (
    <ModulePreview
      badge={t("workflowsPreviewBadge")}
      title={t("workflowsPreviewTitle")}
      subtitle={t("workflowsPreviewSubtitle")}
      features={[
        t("workflowsPreviewFeature1"),
        t("workflowsPreviewFeature2"),
        t("workflowsPreviewFeature3"),
      ]}
      primaryCta={t("workflowsPreviewCta")}
      primaryHref="/any-idea"
      secondaryCta={t("workflowsPreviewSecondary")}
      secondaryHref="/dashboard"
      footerNote={t("modulePreviewFooter")}
    />
  );
}
