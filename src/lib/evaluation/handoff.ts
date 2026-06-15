import type { EvaluationMode } from "./types";

export function buildEvaluateUrl(opts: {
  mode?: EvaluationMode;
  prompt?: string;
  output?: string;
  runId?: string;
  promptId?: string;
  versionId?: string;
  evaluationType?: string;
}) {
  const params = new URLSearchParams();
  if (opts.mode) params.set("mode", opts.mode);
  if (opts.prompt) params.set("prompt", opts.prompt);
  if (opts.output) params.set("output", opts.output);
  if (opts.runId) params.set("runId", opts.runId);
  if (opts.promptId) params.set("promptId", opts.promptId);
  if (opts.versionId) params.set("versionId", opts.versionId);
  if (opts.evaluationType) params.set("type", opts.evaluationType);
  return `/evaluate?${params.toString()}`;
}
