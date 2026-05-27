"use client";

import { useParams } from "next/navigation";
import React from "react";
import JourneyPhaseView from "@/components/journey/JourneyPhaseView";
import { getPhaseContent } from "@/content/journey";
import { useLang } from "@/lib/i18n/LangProvider";
import Link from "next/link";

export default function JourneyPhasePage() {
  const params = useParams();
  const { lang } = useLang();
  const phaseNum = Number(params.phase);

  const content = getPhaseContent(phaseNum);

  if (!content) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {lang === "ja" ? "準備中" : "Coming soon"}
        </h1>
        <p className="text-[var(--muted)]">
          {lang === "ja"
            ? "このフェーズのドキュメントは実装後に公開します。"
            : "Documentation for this phase will be added when it ships."}
        </p>
        <Link href="/journey" className="text-[var(--accent)] hover:underline">
          ← {lang === "ja" ? "構築ジャーニー" : "Build Journey"}
        </Link>
      </div>
    );
  }

  return <JourneyPhaseView content={content} />;
}
