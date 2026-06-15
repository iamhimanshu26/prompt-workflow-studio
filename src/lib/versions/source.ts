import type { VersionSource, PromptStatus } from "./types";

export function deriveVersionSource(notes: string | null, name: string): VersionSource {
  const text = `${notes ?? ""} ${name}`.toLowerCase();
  if (text.includes("restored from")) return "restored";
  if (text.includes("duplicated from")) return "duplicated";
  if (text.includes("optimizer") || text.includes("refinement") || text.includes("optimized"))
    return "optimizer";
  if (text.includes("playground") || text.includes("initial") || text.includes("created from"))
    return "playground";
  if (text.includes("manual") || text.includes("imported")) return "manual";
  return "unknown";
}

export function inferPromptStatus(
  versionCount: number,
  latestNotes: string | null,
  latestName: string,
): PromptStatus {
  if (versionCount <= 1) return "draft";
  const text = `${latestNotes ?? ""} ${latestName}`.toLowerCase();
  if (text.includes("optim")) return "optimized";
  return "active";
}

export function sourceLabelKey(source: VersionSource): string {
  return `verSource_${source}`;
}

export function statusLabelKey(status: PromptStatus): string {
  return `verStatus_${status}`;
}
