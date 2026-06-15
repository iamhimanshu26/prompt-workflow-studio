import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";

export default function OptimizerEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <GlowCard glow={false} className="border-dashed px-6 py-10 text-center">
      <p className="font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
    </GlowCard>
  );
}
