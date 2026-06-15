import React from "react";
import GlowCard from "@/components/enterprise/GlowCard";

export default function VersionEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <GlowCard glow={false} className="border-dashed px-6 py-12 text-center">
      <p className="font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </GlowCard>
  );
}
