"use client";

import React, { useEffect, useId, useState } from "react";

type Props = {
  chart: string;
  className?: string;
};

export default function MermaidDiagram({ chart, className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
        });
        const { svg: rendered } = await mermaid.render(`mmd-${id}`, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Diagram failed to render");
          setSvg("");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className={`overflow-x-auto rounded-xl border border-red-500/30 bg-red-50/50 p-4 text-xs ${className}`}>
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className={`flex h-32 items-center justify-center rounded-xl border border-[var(--border)] bg-white/50 text-sm text-[var(--muted)] ${className}`}
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-[var(--border)] bg-white/70 p-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
