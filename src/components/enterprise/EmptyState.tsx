import React from "react";
import GlowCard from "./GlowCard";

export default function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <GlowCard
      glow={false}
      className={`border-dashed px-6 py-10 text-center ${className ?? ""}`}
    >
      <p className="font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--muted)]">{description}</p>
    </GlowCard>
  );
}
