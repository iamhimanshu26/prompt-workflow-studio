import React from "react";

export default function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
          PromptOps Workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
