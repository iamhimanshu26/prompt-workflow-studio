"use client";

import React from "react";
import ModulePreview from "@/components/enterprise/ModulePreview";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LibraryPage() {
  const { t } = useLang();

  return (
    <ModulePreview
      badge={t("libraryPreviewBadge")}
      title={t("libraryPreviewTitle")}
      subtitle={t("libraryPreviewSubtitle")}
      features={[
        t("libraryPreviewFeature1"),
        t("libraryPreviewFeature2"),
        t("libraryPreviewFeature3"),
      ]}
      primaryCta={t("libraryPreviewCta")}
      primaryHref="/playground"
      secondaryCta={t("libraryPreviewSecondary")}
      secondaryHref="/optimizer"
      footerNote={t("modulePreviewFooter")}
    />
  );
}
